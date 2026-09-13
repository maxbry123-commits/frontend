from __future__ import annotations

from dataclasses import dataclass
from hashlib import sha256
import hmac
import json
import sys
from types import MappingProxyType
from typing import Any, Callable, Mapping

_STORAGE_SCHEMA = "yaiwes.local-first.v1"
_CHECKPOINT_SCHEMA = "yaiwes.local-first-checkpoint.v1"
_ALLOWED_SCOPES = frozenset({"AGENT_PRIVATE", "CHAT", "PROJECT"})


class LocalFirstStorageError(RuntimeError):
    """Fail-closed error for the YAIWES local-first storage adapter."""


@dataclass(frozen=True)
class StorageCheckpoint:
    checkpoint_ref: str
    sha256: str
    payload: bytes
    entity_id: str
    version: int
    sequence: int


@dataclass(frozen=True)
class StorageWriteReceipt:
    local_committed: bool
    checkpoint: StorageCheckpoint
    mirror_status: str
    mirror_error: str | None = None


def _json_bytes(value: Any) -> bytes:
    try:
        return json.dumps(
            value,
            sort_keys=True,
            separators=(",", ":"),
            ensure_ascii=False,
        ).encode("utf-8")
    except (TypeError, ValueError) as exc:
        raise LocalFirstStorageError("storage_value_not_json_serializable") from exc


def _state_hash(state: Mapping[str, Any]) -> str:
    try:
        raw = json.dumps(dict(state), sort_keys=True, default=str).encode()
    except (TypeError, ValueError) as exc:
        raise LocalFirstStorageError("storage_state_not_hashable") from exc
    return sha256(raw).hexdigest()


def _scope_parts(scope: Any) -> tuple[str, str, str]:
    kind = getattr(scope, "kind", None)
    if hasattr(kind, "value"):
        kind = kind.value
    scope_id = getattr(scope, "scope_id", None)
    if not isinstance(kind, str) or kind not in _ALLOWED_SCOPES:
        raise LocalFirstStorageError("unsupported_storage_scope_kind")
    if not isinstance(scope_id, str) or not scope_id.strip():
        raise LocalFirstStorageError("storage_scope_id_required")
    return kind, scope_id, f"{kind}:{scope_id}"


def _entity_id(scope: Any) -> str:
    _, _, key = _scope_parts(scope)
    return f"yaiwes-memory::{key}"


def _load_stabilize_backend(connection_string: str) -> tuple[Any, Any, Callable[[], None]]:
    if not isinstance(connection_string, str) or not connection_string.startswith("sqlite"):
        raise LocalFirstStorageError("local_first_requires_sqlite_connection")
    try:
        from plugins.stabilize_adapter import vendor_root

        root = vendor_root()
        if str(root) not in sys.path:
            sys.path.insert(0, str(root))
        from stabilize.events.base import EntityType
        from stabilize.events.store.sqlite.store import SqliteEventStore
        from stabilize.persistence.connection import get_connection_manager
    except Exception as exc:
        raise LocalFirstStorageError(
            f"stabilize_sqlite_backend_unavailable:{type(exc).__name__}"
        ) from exc

    backend = SqliteEventStore(connection_string, create_tables=True)

    def close() -> None:
        get_connection_manager().close_sqlite_connection(connection_string)

    return backend, EntityType.WORKFLOW, close


class StabilizeLocalFirstStorage:
    """YAIWES boundary over Stabilize's canonical SQLite snapshot store.

    The adapter owns no scheduler, recovery engine, or database implementation.
    Local durable commit/readback happens first. Optional mirror transport is
    strictly downstream and cannot invalidate an already committed local write.
    """

    def __init__(
        self,
        connection_string: str = "sqlite:///./yaiwes-local.db",
        *,
        backend: Any | None = None,
        entity_type: Any | None = None,
        close_callback: Callable[[], None] | None = None,
        mirror: Callable[[StorageCheckpoint], Any] | None = None,
    ) -> None:
        if backend is None:
            backend, entity_type, close_callback = _load_stabilize_backend(
                connection_string
            )
        if backend is None:
            raise LocalFirstStorageError("storage_backend_required")
        if entity_type is None:
            raise LocalFirstStorageError("storage_entity_type_required")
        if not callable(getattr(backend, "save_snapshot", None)):
            raise LocalFirstStorageError("storage_backend_save_snapshot_required")
        if not callable(getattr(backend, "get_latest_snapshot", None)):
            raise LocalFirstStorageError("storage_backend_get_snapshot_required")
        if mirror is not None and not callable(mirror):
            raise LocalFirstStorageError("storage_mirror_callable_required")
        self._backend = backend
        self._entity_type = entity_type
        self._close_callback = close_callback
        self._mirror = mirror

    @property
    def backend(self) -> Any:
        return self._backend

    def close(self) -> None:
        if self._close_callback is not None:
            self._close_callback()

    def _latest(self, scope: Any) -> Mapping[str, Any] | None:
        entity_id = _entity_id(scope)
        raw = self._backend.get_latest_snapshot(self._entity_type, entity_id)
        if raw is None:
            return None
        if not isinstance(raw, Mapping):
            raise LocalFirstStorageError("storage_snapshot_mapping_required")
        state = raw.get("state")
        if not isinstance(state, Mapping):
            raise LocalFirstStorageError("storage_snapshot_state_mapping_required")
        stored_hash = raw.get("state_hash")
        if stored_hash is not None:
            if not isinstance(stored_hash, str) or not hmac.compare_digest(
                _state_hash(state), stored_hash
            ):
                raise LocalFirstStorageError("storage_snapshot_state_hash_mismatch")
        if state.get("schema") != _STORAGE_SCHEMA:
            raise LocalFirstStorageError("storage_snapshot_schema_mismatch")
        expected_scope = _scope_parts(scope)[2]
        if state.get("scope_key") != expected_scope:
            raise LocalFirstStorageError("storage_snapshot_scope_mismatch")
        version = raw.get("version")
        sequence = raw.get("sequence")
        if type(version) is not int or version < 1:
            raise LocalFirstStorageError("storage_snapshot_version_invalid")
        if type(sequence) is not int or sequence < 1:
            raise LocalFirstStorageError("storage_snapshot_sequence_invalid")
        return raw

    def _checkpoint_from_snapshot(
        self, scope: Any, snapshot: Mapping[str, Any]
    ) -> StorageCheckpoint:
        entity_id = _entity_id(scope)
        payload = _json_bytes(
            {
                "schema": _CHECKPOINT_SCHEMA,
                "entity_id": entity_id,
                "version": snapshot["version"],
                "sequence": snapshot["sequence"],
                "state": dict(snapshot["state"]),
            }
        )
        digest = sha256(payload).hexdigest()
        return StorageCheckpoint(
            checkpoint_ref=f"storage://{entity_id}/v{snapshot['version']}/{digest}",
            sha256=digest,
            payload=payload,
            entity_id=entity_id,
            version=snapshot["version"],
            sequence=snapshot["sequence"],
        )

    def export_checkpoint(self, scope: Any) -> StorageCheckpoint:
        snapshot = self._latest(scope)
        if snapshot is None:
            raise LocalFirstStorageError("storage_snapshot_not_found")
        return self._checkpoint_from_snapshot(scope, snapshot)

    def save_entries(
        self,
        scope: Any,
        entries: tuple[Mapping[str, Any], ...] | list[Mapping[str, Any]],
    ) -> StorageWriteReceipt:
        kind, scope_id, scope_key = _scope_parts(scope)
        if not isinstance(entries, (tuple, list)):
            raise LocalFirstStorageError("storage_entries_sequence_required")

        normalized: list[dict[str, Any]] = []
        seen_ids: set[str] = set()
        for item in entries:
            if not isinstance(item, Mapping):
                raise LocalFirstStorageError("storage_entry_mapping_required")
            entry = dict(item)
            entry_id = entry.get("entry_id")
            if not isinstance(entry_id, str) or not entry_id.strip():
                raise LocalFirstStorageError("storage_entry_id_required")
            if entry_id in seen_ids:
                raise LocalFirstStorageError("duplicate_storage_entry_id")
            seen_ids.add(entry_id)
            raw_scope = entry.get("scope")
            if raw_scope is None:
                entry["scope"] = {"kind": kind, "scope_id": scope_id}
            elif raw_scope != {"kind": kind, "scope_id": scope_id}:
                raise LocalFirstStorageError("storage_entry_scope_mismatch")
            _json_bytes(entry)
            normalized.append(entry)

        latest = self._latest(scope)
        version = 1 if latest is None else int(latest["version"]) + 1
        sequence = 1 if latest is None else int(latest["sequence"]) + 1
        state = {
            "schema": _STORAGE_SCHEMA,
            "scope_key": scope_key,
            "revision": str(version),
            "entries": normalized,
        }
        entity_id = _entity_id(scope)
        self._backend.save_snapshot(
            entity_type=self._entity_type,
            entity_id=entity_id,
            workflow_id=entity_id,
            version=version,
            sequence=sequence,
            state=state,
        )
        readback = self._latest(scope)
        if readback is None or readback["version"] != version:
            raise LocalFirstStorageError("storage_local_readback_failed")
        if dict(readback["state"]) != state:
            raise LocalFirstStorageError("storage_local_readback_mismatch")

        checkpoint = self._checkpoint_from_snapshot(scope, readback)
        mirror_status = "NOT_CONFIGURED"
        mirror_error: str | None = None
        if self._mirror is not None:
            try:
                self._mirror(checkpoint)
                mirror_status = "MIRRORED"
            except Exception as exc:
                mirror_status = "MIRROR_FAILED_LOCAL_COMMIT_PRESERVED"
                mirror_error = f"{type(exc).__name__}:{exc}"

        return StorageWriteReceipt(
            local_committed=True,
            checkpoint=checkpoint,
            mirror_status=mirror_status,
            mirror_error=mirror_error,
        )

    def restore_checkpoint(
        self,
        scope: Any,
        raw: bytes,
        expected_sha256: str,
    ) -> StorageWriteReceipt:
        if not isinstance(raw, bytes):
            raise LocalFirstStorageError("storage_checkpoint_bytes_required")
        if not isinstance(expected_sha256, str) or len(expected_sha256) != 64:
            raise LocalFirstStorageError("storage_checkpoint_sha256_required")
        actual = sha256(raw).hexdigest()
        if not hmac.compare_digest(actual, expected_sha256.lower()):
            raise LocalFirstStorageError("storage_checkpoint_sha256_mismatch")
        try:
            payload = json.loads(raw.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError) as exc:
            raise LocalFirstStorageError("storage_checkpoint_json_invalid") from exc
        if not isinstance(payload, dict) or set(payload) != {
            "schema",
            "entity_id",
            "version",
            "sequence",
            "state",
        }:
            raise LocalFirstStorageError("storage_checkpoint_shape_invalid")
        if payload["schema"] != _CHECKPOINT_SCHEMA:
            raise LocalFirstStorageError("storage_checkpoint_schema_mismatch")
        if payload["entity_id"] != _entity_id(scope):
            raise LocalFirstStorageError("storage_checkpoint_scope_mismatch")
        state = payload["state"]
        if not isinstance(state, dict):
            raise LocalFirstStorageError("storage_checkpoint_state_mapping_required")
        if state.get("schema") != _STORAGE_SCHEMA:
            raise LocalFirstStorageError("storage_checkpoint_state_schema_mismatch")
        if state.get("scope_key") != _scope_parts(scope)[2]:
            raise LocalFirstStorageError("storage_checkpoint_state_scope_mismatch")
        entries = state.get("entries")
        if not isinstance(entries, list):
            raise LocalFirstStorageError("storage_checkpoint_entries_invalid")
        return self.save_entries(scope, entries)

    def read(
        self,
        *,
        operation: str,
        task_ref: str,
        agent_id: str,
        agent_memory: Any,
        context_scopes: tuple[Any, ...] = (),
    ) -> Mapping[str, Any]:
        if operation not in {"GET_CONTEXT", "GET_MEMORY", "GET_EVIDENCE"}:
            raise LocalFirstStorageError("unsupported_storage_read_operation")
        if not isinstance(task_ref, str) or not task_ref.strip():
            raise LocalFirstStorageError("storage_task_ref_required")
        if not isinstance(agent_id, str) or not agent_id.strip():
            raise LocalFirstStorageError("storage_agent_id_required")
        kind, private_id, _ = _scope_parts(agent_memory)
        if kind != "AGENT_PRIVATE":
            raise LocalFirstStorageError("storage_agent_memory_must_be_private")
        if private_id != agent_id:
            raise LocalFirstStorageError("storage_agent_private_scope_mismatch")

        scopes = (agent_memory,) + tuple(context_scopes)
        scope_keys: set[str] = set()
        entries: list[Mapping[str, Any]] = []
        checkpoint_refs: list[dict[str, Any]] = []
        revisions: list[str] = []
        for index, scope in enumerate(scopes):
            scope_kind, _, key = _scope_parts(scope)
            if index > 0 and scope_kind not in {"CHAT", "PROJECT"}:
                raise LocalFirstStorageError("storage_context_scope_invalid")
            if key in scope_keys:
                raise LocalFirstStorageError("duplicate_storage_read_scope")
            scope_keys.add(key)
            snapshot = self._latest(scope)
            if snapshot is None:
                continue
            checkpoint = self._checkpoint_from_snapshot(scope, snapshot)
            checkpoint_refs.append(
                {
                    "scope_key": key,
                    "checkpoint_ref": checkpoint.checkpoint_ref,
                    "sha256": checkpoint.sha256,
                }
            )
            revisions.append(f"{key}@{snapshot['version']}")
            raw_entries = snapshot["state"].get("entries")
            if not isinstance(raw_entries, list):
                raise LocalFirstStorageError("storage_snapshot_entries_invalid")
            entries.extend(dict(item) for item in raw_entries)

        aggregate = _json_bytes(checkpoint_refs)
        digest = sha256(aggregate).hexdigest()
        return MappingProxyType(
            {
                "snapshot_id": digest,
                "revision": "|".join(revisions) if revisions else "empty",
                "checkpoint_sha256": digest,
                "entries": tuple(entries),
                "operation": operation,
            }
        )
