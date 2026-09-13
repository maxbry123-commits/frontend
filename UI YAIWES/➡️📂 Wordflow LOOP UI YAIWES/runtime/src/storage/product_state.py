"""Deterministic checkpoint schema for product chat/window/file state.

Chat state is deliberately separate from agent memory. The product checkpoint
stores only an opaque ``agent_memory_ref``; agent-memory contents are owned by
the memory boundary and are never embedded here.
"""
from __future__ import annotations

import base64
from dataclasses import asdict, dataclass
import hashlib
import hmac
import json
from pathlib import PurePosixPath
import re

_SCHEMA = "yaiwes.product-snapshot.v1"
_SHA256 = re.compile(r"^[0-9a-f]{64}$")
_ALLOWED_ROLES = {"system", "user", "assistant", "tool"}
_TOP_LEVEL_KEYS = {
    "schema",
    "session_id",
    "agent_memory_ref",
    "chat",
    "windows",
    "files",
}


class ProductStateError(ValueError):
    """Fail-closed product snapshot validation error."""


@dataclass(frozen=True)
class ChatMessage:
    message_id: str
    sequence: int
    role: str
    content: str


@dataclass(frozen=True)
class WindowState:
    window_id: str
    kind: str
    title: str
    selected_file_id: str | None = None


@dataclass(frozen=True)
class FileState:
    file_id: str
    name: str
    media_type: str
    content_b64: str
    sha256: str


@dataclass(frozen=True)
class ProductSnapshot:
    session_id: str
    agent_memory_ref: str | None
    chat: tuple[ChatMessage, ...]
    windows: tuple[WindowState, ...]
    files: tuple[FileState, ...]


def _required_text(value: object, field: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise ProductStateError(f"{field}_required")
    return value


def _safe_file_name(name: str) -> str:
    _required_text(name, "file_name")
    path = PurePosixPath(name.replace("\\", "/"))
    if path.is_absolute() or ".." in path.parts:
        raise ProductStateError("unsafe_file_name")
    return name


def build_file_state(
    file_id: str,
    name: str,
    content: bytes,
    media_type: str = "application/octet-stream",
) -> FileState:
    _required_text(file_id, "file_id")
    _safe_file_name(name)
    _required_text(media_type, "media_type")
    if not isinstance(content, bytes):
        raise ProductStateError("file_bytes_required")
    return FileState(
        file_id=file_id,
        name=name,
        media_type=media_type,
        content_b64=base64.b64encode(content).decode("ascii"),
        sha256=hashlib.sha256(content).hexdigest(),
    )


def file_bytes(item: FileState) -> bytes:
    try:
        raw = base64.b64decode(item.content_b64, validate=True)
    except Exception as exc:
        raise ProductStateError("invalid_file_base64") from exc
    actual = hashlib.sha256(raw).hexdigest()
    if not _SHA256.fullmatch(item.sha256) or not hmac.compare_digest(actual, item.sha256):
        raise ProductStateError("file_sha256_mismatch")
    return raw


def _validate(snapshot: ProductSnapshot) -> None:
    _required_text(snapshot.session_id, "session_id")
    if snapshot.agent_memory_ref is not None:
        _required_text(snapshot.agent_memory_ref, "agent_memory_ref")

    message_ids: set[str] = set()
    sequences: set[int] = set()
    previous_sequence = -1
    for message in snapshot.chat:
        _required_text(message.message_id, "message_id")
        if message.message_id in message_ids:
            raise ProductStateError("duplicate_message_id")
        message_ids.add(message.message_id)
        if type(message.sequence) is not int or message.sequence < 0:
            raise ProductStateError("invalid_message_sequence")
        if message.sequence in sequences or message.sequence <= previous_sequence:
            raise ProductStateError("non_monotonic_message_sequence")
        sequences.add(message.sequence)
        previous_sequence = message.sequence
        if message.role not in _ALLOWED_ROLES:
            raise ProductStateError("invalid_chat_role")
        if not isinstance(message.content, str):
            raise ProductStateError("chat_content_string_required")

    file_ids: set[str] = set()
    for item in snapshot.files:
        _required_text(item.file_id, "file_id")
        if item.file_id in file_ids:
            raise ProductStateError("duplicate_file_id")
        file_ids.add(item.file_id)
        _safe_file_name(item.name)
        _required_text(item.media_type, "media_type")
        file_bytes(item)

    window_ids: set[str] = set()
    for window in snapshot.windows:
        _required_text(window.window_id, "window_id")
        if window.window_id in window_ids:
            raise ProductStateError("duplicate_window_id")
        window_ids.add(window.window_id)
        _required_text(window.kind, "window_kind")
        if not isinstance(window.title, str):
            raise ProductStateError("window_title_string_required")
        if window.selected_file_id is not None and window.selected_file_id not in file_ids:
            raise ProductStateError("window_file_reference_missing")


def encode_snapshot(snapshot: ProductSnapshot) -> bytes:
    if not isinstance(snapshot, ProductSnapshot):
        raise ProductStateError("product_snapshot_required")
    _validate(snapshot)
    payload = {
        "schema": _SCHEMA,
        "session_id": snapshot.session_id,
        "agent_memory_ref": snapshot.agent_memory_ref,
        "chat": [asdict(item) for item in snapshot.chat],
        "windows": [asdict(item) for item in snapshot.windows],
        "files": [asdict(item) for item in snapshot.files],
    }
    return json.dumps(
        payload,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    ).encode("utf-8")


def _exact_keys(value: object, expected: set[str], label: str) -> dict:
    if not isinstance(value, dict) or set(value) != expected:
        raise ProductStateError(f"invalid_{label}_shape")
    return value


def decode_snapshot(raw: bytes) -> ProductSnapshot:
    if not isinstance(raw, bytes):
        raise ProductStateError("snapshot_bytes_required")
    try:
        payload = json.loads(raw.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise ProductStateError("invalid_snapshot_json") from exc
    payload = _exact_keys(payload, _TOP_LEVEL_KEYS, "snapshot")
    if payload["schema"] != _SCHEMA:
        raise ProductStateError("unsupported_snapshot_schema")
    if not isinstance(payload["chat"], list):
        raise ProductStateError("chat_list_required")
    if not isinstance(payload["windows"], list):
        raise ProductStateError("windows_list_required")
    if not isinstance(payload["files"], list):
        raise ProductStateError("files_list_required")

    chat = tuple(
        ChatMessage(**_exact_keys(item, {"message_id", "sequence", "role", "content"}, "chat"))
        for item in payload["chat"]
    )
    windows = tuple(
        WindowState(**_exact_keys(item, {"window_id", "kind", "title", "selected_file_id"}, "window"))
        for item in payload["windows"]
    )
    files = tuple(
        FileState(**_exact_keys(item, {"file_id", "name", "media_type", "content_b64", "sha256"}, "file"))
        for item in payload["files"]
    )
    snapshot = ProductSnapshot(
        session_id=payload["session_id"],
        agent_memory_ref=payload["agent_memory_ref"],
        chat=chat,
        windows=windows,
        files=files,
    )
    _validate(snapshot)
    return snapshot


def snapshot_sha256(raw: bytes) -> str:
    if not isinstance(raw, bytes):
        raise ProductStateError("snapshot_bytes_required")
    return hashlib.sha256(raw).hexdigest()
