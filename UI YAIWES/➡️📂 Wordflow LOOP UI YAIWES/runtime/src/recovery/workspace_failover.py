"""Deterministic workspace/multi-host failover glue for YAIWES recovery.

Stabilize remains the only workflow recovery engine. This module only binds a
workspace checkpoint to a deterministic target host, delegates checkpoint and
workflow recovery to the existing YAIWES/Stabilize boundaries, and resumes
host/replay effects through the existing idempotent effect ledger.
"""
from __future__ import annotations

from dataclasses import dataclass
import hashlib
import hmac
from typing import Any, Callable, Iterable

from recovery.control_plane import (
    ProjectRecoveryEvidence,
    RecoveryControlPlaneError,
    recover_project,
)
from recovery.product_session import (
    EffectLedger,
    EffectOutcome,
    EffectReceipt,
    EffectRecord,
    RecoveredProductSession,
    restore_product_session,
    resume_effect,
)


class WorkspaceFailoverError(RecoveryControlPlaneError):
    """Fail-closed error for invalid workspace failover/reconstruction state."""


@dataclass(frozen=True)
class HostCandidate:
    host_id: str
    healthy: bool
    priority: int = 100


@dataclass(frozen=True)
class WorkspaceCheckpoint:
    workspace_id: str
    epoch: int
    source_host_id: str
    session_id: str
    checkpoint_ref: str
    checkpoint_sha256: str


@dataclass(frozen=True)
class ReplayEffect:
    effect_id: str
    payload: bytes


@dataclass(frozen=True)
class WorkspaceFailoverEvidence:
    workspace_id: str
    epoch: int
    source_host_id: str
    target_host_id: str
    failover_effect_id: str
    product_session: RecoveredProductSession
    project_recovery: ProjectRecoveryEvidence
    activation: EffectOutcome
    replay: tuple[EffectOutcome, ...]


def _required_text(value: object, label: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise WorkspaceFailoverError(f"{label}_required")
    return value


def select_failover_host(
    *, failed_host_id: str, hosts: Iterable[HostCandidate]
) -> HostCandidate:
    """Choose one healthy non-failed host deterministically by priority/id."""
    _required_text(failed_host_id, "failed_host_id")
    seen: set[str] = set()
    eligible: list[HostCandidate] = []
    for host in tuple(hosts):
        if not isinstance(host, HostCandidate):
            raise WorkspaceFailoverError("host_candidate_required")
        host_id = _required_text(host.host_id, "host_id")
        if host_id in seen:
            raise WorkspaceFailoverError("duplicate_host_id")
        seen.add(host_id)
        if type(host.healthy) is not bool:
            raise WorkspaceFailoverError("host_health_bool_required")
        if type(host.priority) is not int or host.priority < 0:
            raise WorkspaceFailoverError("host_priority_invalid")
        if host.healthy and host_id != failed_host_id:
            eligible.append(host)
    if not eligible:
        raise WorkspaceFailoverError("no_healthy_failover_host")
    return min(eligible, key=lambda item: (item.priority, item.host_id))


def _validate_checkpoint_binding(
    *,
    workspace_id: str,
    failed_host_id: str,
    expected_epoch: int,
    checkpoint: WorkspaceCheckpoint,
) -> None:
    workspace_id = _required_text(workspace_id, "workspace_id")
    failed_host_id = _required_text(failed_host_id, "failed_host_id")
    if type(expected_epoch) is not int or expected_epoch <= 0:
        raise WorkspaceFailoverError("expected_epoch_invalid")
    if not isinstance(checkpoint, WorkspaceCheckpoint):
        raise WorkspaceFailoverError("workspace_checkpoint_required")
    if checkpoint.workspace_id != workspace_id:
        raise WorkspaceFailoverError("workspace_checkpoint_mismatch")
    if checkpoint.source_host_id != failed_host_id:
        raise WorkspaceFailoverError("checkpoint_source_host_mismatch")
    if type(checkpoint.epoch) is not int or checkpoint.epoch != expected_epoch:
        raise WorkspaceFailoverError("workspace_epoch_mismatch")
    _required_text(checkpoint.session_id, "session_id")
    _required_text(checkpoint.checkpoint_ref, "checkpoint_ref")
    _required_text(checkpoint.checkpoint_sha256, "checkpoint_sha256")


def _validated_replays(
    replay_effects: Iterable[ReplayEffect],
    apply_replay_effect: Callable[[str, bytes], EffectReceipt] | None,
) -> tuple[ReplayEffect, ...]:
    rows = tuple(replay_effects)
    seen: set[str] = set()
    for row in rows:
        if not isinstance(row, ReplayEffect):
            raise WorkspaceFailoverError("replay_effect_required")
        effect_id = _required_text(row.effect_id, "replay_effect_id")
        if effect_id in seen:
            raise WorkspaceFailoverError("duplicate_replay_effect_id")
        seen.add(effect_id)
        if not isinstance(row.payload, bytes):
            raise WorkspaceFailoverError("replay_payload_bytes_required")
    if rows and apply_replay_effect is None:
        raise WorkspaceFailoverError("replay_effect_handler_required")
    return rows


def _failover_identity(workspace_id: str, epoch: int) -> str:
    workspace_key = hashlib.sha256(workspace_id.encode("utf-8")).hexdigest()
    return f"workspace-failover:{workspace_key}:{epoch}"


def _failover_payload(
    checkpoint: WorkspaceCheckpoint, target_host_id: str
) -> bytes:
    return (
        f"workspace={checkpoint.workspace_id}\n"
        f"epoch={checkpoint.epoch}\n"
        f"source={checkpoint.source_host_id}\n"
        f"target={target_host_id}\n"
        f"checkpoint={checkpoint.checkpoint_sha256}\n"
    ).encode("utf-8")


def _assert_existing_failover_binding(
    *, ledger: EffectLedger, effect_id: str, payload: bytes
) -> None:
    """Reject split-brain target/checkpoint drift before recovery side effects."""
    try:
        record = ledger.get(effect_id)
    except Exception as exc:
        raise WorkspaceFailoverError(
            f"effect_ledger_read_failed:{type(exc).__name__}"
        ) from exc
    if record is None:
        return
    if not isinstance(record, EffectRecord):
        raise WorkspaceFailoverError("invalid_effect_record")
    expected = hashlib.sha256(payload).hexdigest()
    if not hmac.compare_digest(record.payload_sha256, expected):
        raise WorkspaceFailoverError("failover_binding_changed_for_epoch")


def recover_workspace_failover(
    *,
    workspace_id: str,
    failed_host_id: str,
    expected_epoch: int,
    checkpoint: WorkspaceCheckpoint,
    hosts: Iterable[HostCandidate],
    store: Any,
    queue: Any,
    checkpoint_bytes_loader: Callable[[str], bytes],
    ledger_integrity_check: Callable[[], bool],
    effect_ledger: EffectLedger,
    activate_host: Callable[[str, bytes], EffectReceipt],
    replay_effects: Iterable[ReplayEffect] = (),
    apply_replay_effect: Callable[[str, bytes], EffectReceipt] | None = None,
    application: str | None = None,
    recovery_type: type | None = None,
) -> WorkspaceFailoverEvidence:
    """Reconstruct one workspace on a deterministic failover host.

    Checkpoint bytes are cached once and verified by both existing recovery
    gates. No host/replay effect occurs unless project recovery is safe. The
    failover activation itself uses a stable epoch-scoped idempotency key whose
    payload binds source, target and checkpoint hash, preventing split-brain
    retries from silently changing target or checkpoint.
    """
    _validate_checkpoint_binding(
        workspace_id=workspace_id,
        failed_host_id=failed_host_id,
        expected_epoch=expected_epoch,
        checkpoint=checkpoint,
    )
    target = select_failover_host(failed_host_id=failed_host_id, hosts=hosts)
    replay_rows = _validated_replays(replay_effects, apply_replay_effect)
    failover_effect_id = _failover_identity(workspace_id, expected_epoch)
    if any(row.effect_id == failover_effect_id for row in replay_rows):
        raise WorkspaceFailoverError("replay_effect_collides_with_failover_id")
    activation_payload = _failover_payload(checkpoint, target.host_id)
    _assert_existing_failover_binding(
        ledger=effect_ledger,
        effect_id=failover_effect_id,
        payload=activation_payload,
    )

    cached: dict[str, bytes] = {}

    def cached_loader(ref: str) -> bytes:
        if ref not in cached:
            cached[ref] = checkpoint_bytes_loader(ref)
        return cached[ref]

    product_session = restore_product_session(
        checkpoint_ref=checkpoint.checkpoint_ref,
        checkpoint_sha256=checkpoint.checkpoint_sha256,
        checkpoint_bytes_loader=cached_loader,
        expected_session_id=checkpoint.session_id,
    )
    project_recovery = recover_project(
        store=store,
        queue=queue,
        checkpoint_ref=checkpoint.checkpoint_ref,
        checkpoint_sha256=checkpoint.checkpoint_sha256,
        checkpoint_bytes_loader=cached_loader,
        ledger_integrity_check=ledger_integrity_check,
        application=application,
        recovery_type=recovery_type,
    )
    if not project_recovery.safe_to_continue:
        raise WorkspaceFailoverError("workspace_recovery_not_safe_to_continue")

    activation = resume_effect(
        effect_id=failover_effect_id,
        payload=activation_payload,
        ledger=effect_ledger,
        apply_effect=activate_host,
    )
    replay: list[EffectOutcome] = []
    for row in replay_rows:
        assert apply_replay_effect is not None
        replay.append(
            resume_effect(
                effect_id=row.effect_id,
                payload=row.payload,
                ledger=effect_ledger,
                apply_effect=apply_replay_effect,
            )
        )

    return WorkspaceFailoverEvidence(
        workspace_id=workspace_id,
        epoch=expected_epoch,
        source_host_id=failed_host_id,
        target_host_id=target.host_id,
        failover_effect_id=failover_effect_id,
        product_session=product_session,
        project_recovery=project_recovery,
        activation=activation,
        replay=tuple(replay),
    )
