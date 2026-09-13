"""Product-level recovery glue for chats, windows, files and idempotent effects.

This module does not implement workflow recovery. Stabilize remains the recovery
engine; this layer reuses the existing checkpoint SHA gate and restores product
state around that engine boundary.
"""
from __future__ import annotations

from dataclasses import dataclass
import hashlib
import hmac
import re
from typing import Callable, Protocol

from recovery.control_plane import RecoveryControlPlaneError, _verify_checkpoint_bytes
from storage.product_state import (
    ProductSnapshot,
    ProductStateError,
    decode_snapshot,
    encode_snapshot,
    file_bytes,
)

_SHA256 = re.compile(r"^[0-9a-f]{64}$")


@dataclass(frozen=True)
class RecoveredProductSession:
    snapshot: ProductSnapshot
    file_contents: tuple[tuple[str, bytes], ...]


@dataclass(frozen=True)
class EffectRecord:
    status: str
    payload_sha256: str
    output_sha256: str | None = None


@dataclass(frozen=True)
class EffectReceipt:
    effect_id: str
    output: bytes
    duplicate: bool = False


@dataclass(frozen=True)
class EffectOutcome:
    effect_id: str
    status: str
    output_sha256: str | None
    duplicate: bool


class EffectLedger(Protocol):
    """Persistence boundary; N19 may provide the local-first implementation."""

    def get(self, effect_id: str) -> EffectRecord | None: ...

    def mark_pending(self, effect_id: str, payload_sha256: str) -> None: ...

    def commit(self, effect_id: str, payload_sha256: str, output_sha256: str) -> None: ...


def restore_product_session(
    *,
    checkpoint_ref: str,
    checkpoint_sha256: str,
    checkpoint_bytes_loader: Callable[[str], bytes],
    expected_session_id: str | None = None,
) -> RecoveredProductSession:
    """Verify bytes first, require canonical readback, then restore product state."""
    cached: dict[str, bytes] = {}

    def cached_loader(ref: str) -> bytes:
        if ref not in cached:
            cached[ref] = checkpoint_bytes_loader(ref)
        return cached[ref]

    _verify_checkpoint_bytes(
        checkpoint_ref=checkpoint_ref,
        checkpoint_sha256=checkpoint_sha256,
        checkpoint_bytes_loader=cached_loader,
    )
    raw = cached[checkpoint_ref]
    try:
        snapshot = decode_snapshot(raw)
    except ProductStateError as exc:
        raise RecoveryControlPlaneError(f"product_snapshot_invalid:{exc}") from exc
    if encode_snapshot(snapshot) != raw:
        raise RecoveryControlPlaneError("product_snapshot_not_canonical")
    if expected_session_id is not None and snapshot.session_id != expected_session_id:
        raise RecoveryControlPlaneError("product_session_mismatch")

    contents = tuple((item.file_id, file_bytes(item)) for item in snapshot.files)
    return RecoveredProductSession(snapshot=snapshot, file_contents=contents)


def _read_record(ledger: EffectLedger, effect_id: str) -> EffectRecord | None:
    try:
        record = ledger.get(effect_id)
    except Exception as exc:
        raise RecoveryControlPlaneError(f"effect_ledger_read_failed:{type(exc).__name__}") from exc
    if record is not None and not isinstance(record, EffectRecord):
        raise RecoveryControlPlaneError("invalid_effect_record")
    return record


def _validate_record(record: EffectRecord, payload_sha256: str) -> None:
    if record.status not in {"pending", "committed"}:
        raise RecoveryControlPlaneError("invalid_effect_record")
    if not _SHA256.fullmatch(record.payload_sha256):
        raise RecoveryControlPlaneError("invalid_effect_payload_hash")
    if not hmac.compare_digest(record.payload_sha256, payload_sha256):
        raise RecoveryControlPlaneError("effect_payload_mismatch")
    if record.status == "pending":
        if record.output_sha256 is not None:
            raise RecoveryControlPlaneError("invalid_effect_record")
        return
    if not isinstance(record.output_sha256, str) or not _SHA256.fullmatch(record.output_sha256):
        raise RecoveryControlPlaneError("invalid_committed_effect_hash")


def resume_effect(
    *,
    effect_id: str,
    payload: bytes,
    ledger: EffectLedger,
    apply_effect: Callable[[str, bytes], EffectReceipt],
    cancelled: Callable[[], bool] = lambda: False,
) -> EffectOutcome:
    """Resume one effect using a stable idempotency key bound to exact payload bytes.

    A disconnect after physical delivery leaves ``pending``. On restart the same
    ``effect_id`` and payload hash must be reused. A different payload for the
    same id is rejected before delivery, preventing cross-request replay.
    """
    if not isinstance(effect_id, str) or not effect_id.strip():
        raise RecoveryControlPlaneError("effect_id_required")
    if not isinstance(payload, bytes):
        raise RecoveryControlPlaneError("effect_payload_bytes_required")

    payload_sha256 = hashlib.sha256(payload).hexdigest()
    record = _read_record(ledger, effect_id)

    if record is not None:
        _validate_record(record, payload_sha256)
        if record.status == "committed":
            return EffectOutcome(effect_id, "skipped_committed", record.output_sha256, True)
    else:
        try:
            if cancelled():
                return EffectOutcome(effect_id, "cancelled", None, False)
        except Exception as exc:
            raise RecoveryControlPlaneError(f"cancel_check_failed:{type(exc).__name__}") from exc
        try:
            ledger.mark_pending(effect_id, payload_sha256)
        except Exception as exc:
            raise RecoveryControlPlaneError(f"effect_ledger_pending_failed:{type(exc).__name__}") from exc
        record = _read_record(ledger, effect_id)
        if record is None:
            raise RecoveryControlPlaneError("effect_pending_readback_missing")
        _validate_record(record, payload_sha256)
        if record.status != "pending":
            raise RecoveryControlPlaneError("effect_pending_readback_invalid")

    try:
        if cancelled():
            return EffectOutcome(effect_id, "cancelled_pending", None, False)
    except Exception as exc:
        raise RecoveryControlPlaneError(f"cancel_check_failed:{type(exc).__name__}") from exc

    try:
        receipt = apply_effect(effect_id, payload)
    except Exception as exc:
        raise RecoveryControlPlaneError(f"effect_delivery_failed:{type(exc).__name__}") from exc
    if not isinstance(receipt, EffectReceipt):
        raise RecoveryControlPlaneError("effect_receipt_required")
    if receipt.effect_id != effect_id:
        raise RecoveryControlPlaneError("effect_receipt_id_mismatch")
    if not isinstance(receipt.output, bytes) or type(receipt.duplicate) is not bool:
        raise RecoveryControlPlaneError("invalid_effect_receipt")

    output_sha256 = hashlib.sha256(receipt.output).hexdigest()
    try:
        ledger.commit(effect_id, payload_sha256, output_sha256)
    except Exception as exc:
        raise RecoveryControlPlaneError(f"effect_ledger_commit_failed:{type(exc).__name__}") from exc

    committed = _read_record(ledger, effect_id)
    if committed is None:
        raise RecoveryControlPlaneError("effect_commit_readback_missing")
    _validate_record(committed, payload_sha256)
    if committed.status != "committed" or not hmac.compare_digest(
        committed.output_sha256 or "", output_sha256
    ):
        raise RecoveryControlPlaneError("effect_commit_readback_invalid")
    return EffectOutcome(effect_id, "committed", output_sha256, receipt.duplicate)
