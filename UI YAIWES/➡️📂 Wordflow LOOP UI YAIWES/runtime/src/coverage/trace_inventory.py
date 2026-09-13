"""Strict loader for persisted N35 requirement traces.

The loader only validates and materializes records. It never creates evidence,
promotes a trace to PASS, or replaces the independent CI verifier.
"""
from __future__ import annotations

import json
import re
from pathlib import Path, PurePosixPath
from typing import Iterable

from audit.five_pass import FileRef, RequirementTrace


TRACE_SCHEMA = "yaiwes.requirement-trace.v1"
_TRACE_FIELDS = {
    "schema", "requirement_id", "goal_id", "task_id", "source",
    "implementation", "test", "evidence", "revision",
}
_REF_FIELDS = {"path", "sha256", "symbol"}
_SHA256 = re.compile(r"[0-9a-f]{64}")
_REVISION = re.compile(r"[0-9a-f]{40}")


def _required_text(value: object, error: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise ValueError(error)
    return value


def _file_ref(value: object) -> FileRef:
    if not isinstance(value, dict) or set(value) != _REF_FIELDS:
        raise ValueError("invalid_file_ref")
    path = _required_text(value["path"], "invalid_file_ref")
    pure = PurePosixPath(path)
    if (pure.is_absolute() or ".." in pure.parts or "\\" in path
            or "\x00" in path or ":" in path):
        raise ValueError("unsafe_trace_path")
    digest = _required_text(value["sha256"], "invalid_file_ref")
    symbol = value["symbol"]
    if not _SHA256.fullmatch(digest) or not isinstance(symbol, str):
        raise ValueError("invalid_file_ref")
    return FileRef(path, digest, symbol)


def _load_trace(path: Path) -> RequirementTrace:
    if path.is_symlink():
        raise ValueError("symlink_trace_not_allowed")
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as exc:
        raise ValueError("invalid_trace_json") from exc
    if (not isinstance(payload, dict) or set(payload) != _TRACE_FIELDS
            or payload.get("schema") != TRACE_SCHEMA):
        raise ValueError("invalid_trace_fields")
    revision = _required_text(payload["revision"], "invalid_revision")
    if not _REVISION.fullmatch(revision):
        raise ValueError("invalid_revision")
    return RequirementTrace(
        requirement_id=_required_text(payload["requirement_id"], "invalid_requirement_id"),
        goal_id=_required_text(payload["goal_id"], "invalid_goal_id"),
        task_id=_required_text(payload["task_id"], "invalid_task_id"),
        source=_file_ref(payload["source"]),
        implementation=_file_ref(payload["implementation"]),
        test=_file_ref(payload["test"]),
        evidence=_file_ref(payload["evidence"]),
        revision=revision,
    )


def load_trace_inventory(
    directory: str | Path,
    expected_requirements: Iterable[str],
) -> tuple[RequirementTrace, ...]:
    """Load deterministic JSON records and reject unknown or duplicate IDs."""
    root = Path(directory)
    if root.is_symlink() or not root.is_dir():
        raise ValueError("invalid_trace_directory")
    expected_list = tuple(expected_requirements)
    expected = set(expected_list)
    if not expected or len(expected) != len(expected_list):
        raise ValueError("invalid_expected_requirements")

    traces: list[RequirementTrace] = []
    seen: set[str] = set()
    for path in sorted(root.glob("*.json")):
        trace = _load_trace(path)
        if path.stem != trace.requirement_id:
            raise ValueError("trace_filename_mismatch")
        if trace.requirement_id not in expected:
            raise ValueError("unexpected_requirement")
        if trace.requirement_id in seen:
            raise ValueError("duplicate_requirement_trace")
        seen.add(trace.requirement_id)
        traces.append(trace)
    missing = sorted(expected - seen)
    if missing:
        raise ValueError(f"missing_requirement_traces:{','.join(missing)}")
    return tuple(traces)
