from __future__ import annotations

from dataclasses import dataclass
import hashlib
import hmac
import re
from typing import Any, Callable, Iterable

_SHA256 = re.compile(r"^[0-9a-f]{64}$")
_ALLOWED_RESULTS = {"recovered", "skipped", "partial", "failed"}


class RecoveryControlPlaneError(RuntimeError):
    """Fail-closed error raised before project continuation is allowed."""


@dataclass(frozen=True)
class ProjectRecoveryEvidence:
    checkpoint_ref: str
    checkpoint_sha256: str
    recovered: int
    skipped: int
    partial: int
    failed: int
    total_results: int
    safe_to_continue: bool


def _load_stabilize_recovery_type() -> type:
    import sys
    from plugins.stabilize_adapter import vendor_root

    root = vendor_root()
    if str(root) not in sys.path:
        sys.path.insert(0, str(root))
    from stabilize.recovery import WorkflowRecovery

    return WorkflowRecovery


def _validate_checkpoint(checkpoint_ref: str, checkpoint_sha256: str) -> None:
    if not checkpoint_ref.strip():
        raise RecoveryControlPlaneError("checkpoint_ref_required")
    if not _SHA256.fullmatch(checkpoint_sha256):
        raise RecoveryControlPlaneError("strong_checkpoint_sha256_required")


def _verify_checkpoint_bytes(
    *,
    checkpoint_ref: str,
    checkpoint_sha256: str,
    checkpoint_bytes_loader: Callable[[str], bytes],
) -> None:
    try:
        raw = checkpoint_bytes_loader(checkpoint_ref)
    except Exception as exc:
        raise RecoveryControlPlaneError(
            f"checkpoint_read_failed:{type(exc).__name__}"
        ) from exc
    if not isinstance(raw, bytes):
        raise RecoveryControlPlaneError("checkpoint_bytes_required")

    actual_sha256 = hashlib.sha256(raw).hexdigest()
    if not hmac.compare_digest(actual_sha256, checkpoint_sha256):
        raise RecoveryControlPlaneError("checkpoint_sha256_mismatch")


def _summarize(results: Iterable[Any]) -> tuple[int, int, int, int, int]:
    counts = {name: 0 for name in _ALLOWED_RESULTS}
    total = 0
    for item in results:
        status = getattr(item, "status", None)
        if status not in _ALLOWED_RESULTS:
            raise RecoveryControlPlaneError(f"unknown_recovery_status:{status}")
        counts[status] += 1
        total += 1
    return (
        counts["recovered"],
        counts["skipped"],
        counts["partial"],
        counts["failed"],
        total,
    )


def recover_project(
    *,
    store: Any,
    queue: Any,
    checkpoint_ref: str,
    checkpoint_sha256: str,
    checkpoint_bytes_loader: Callable[[str], bytes],
    ledger_integrity_check: Callable[[], bool],
    application: str | None = None,
    recovery_type: type | None = None,
) -> ProjectRecoveryEvidence:
    """Validate checkpoint bytes/evidence, delegate recovery to Stabilize, summarize.

    This control-plane deliberately does not implement workflow recovery itself.
    Stabilize remains the only recovery engine/owner; YAIWES adds fail-closed
    project evidence gates before any restore/recovery effect is allowed.
    """
    if store is None:
        raise RecoveryControlPlaneError("store_required")
    if queue is None:
        raise RecoveryControlPlaneError("queue_required")
    _validate_checkpoint(checkpoint_ref, checkpoint_sha256)
    _verify_checkpoint_bytes(
        checkpoint_ref=checkpoint_ref,
        checkpoint_sha256=checkpoint_sha256,
        checkpoint_bytes_loader=checkpoint_bytes_loader,
    )

    try:
        integrity_ok = bool(ledger_integrity_check())
    except Exception as exc:
        raise RecoveryControlPlaneError(
            f"ledger_integrity_check_failed:{type(exc).__name__}"
        ) from exc
    if not integrity_ok:
        raise RecoveryControlPlaneError("ledger_integrity_failure")

    recovery_cls = recovery_type or _load_stabilize_recovery_type()
    recovery = recovery_cls(store=store, queue=queue)
    results = recovery.recover_pending_workflows(application=application)
    recovered, skipped, partial, failed, total = _summarize(results)

    return ProjectRecoveryEvidence(
        checkpoint_ref=checkpoint_ref,
        checkpoint_sha256=checkpoint_sha256,
        recovered=recovered,
        skipped=skipped,
        partial=partial,
        failed=failed,
        total_results=total,
        safe_to_continue=(partial == 0 and failed == 0),
    )
