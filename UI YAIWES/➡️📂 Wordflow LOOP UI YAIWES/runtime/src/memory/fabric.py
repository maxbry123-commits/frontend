"""Deterministic Retrieval/Context Fabric over the canonical Memory read port.

The fabric is intentionally stateless. Persistence/checkpoint ownership remains
with the injected canonical Memory/Storage port; this layer consumes a persisted
snapshot identity and produces a bounded, provenance-preserving, read-only
context pack. It never writes canonical memory and never owns workflow control.
"""
from __future__ import annotations

from dataclasses import dataclass
from hashlib import sha256
import json
import re
from types import MappingProxyType
from typing import Any, Mapping

from .boundary import (
    MemoryBoundaryError,
    MemoryReadRequest,
    MemoryScopeRef,
    perform_memory_read,
)

_SHA256_RE = re.compile(r"^[0-9a-fA-F]{64}$")


@dataclass(frozen=True)
class ContextBudget:
    max_items: int = 16
    max_chars: int = 16_000

    def validate(self) -> None:
        if self.max_items < 1:
            raise MemoryBoundaryError("context_budget_max_items_positive")
        if self.max_chars < 1:
            raise MemoryBoundaryError("context_budget_max_chars_positive")


@dataclass(frozen=True)
class ContextEntry:
    entry_id: str
    scope: MemoryScopeRef
    content: str
    score: float
    evidence_ref: str
    provenance: Mapping[str, str]

    def canonical(self) -> Mapping[str, Any]:
        return MappingProxyType(
            {
                "entry_id": self.entry_id,
                "scope": MappingProxyType(
                    {"kind": self.scope.kind, "scope_id": self.scope.scope_id}
                ),
                "content": self.content,
                "score": self.score,
                "evidence_ref": self.evidence_ref,
                "provenance": self.provenance,
            }
        )


@dataclass(frozen=True)
class ContextPack:
    task_ref: str
    agent_id: str
    snapshot_id: str
    revision: str
    checkpoint_sha256: str
    entries: tuple[ContextEntry, ...]
    provenance_digest: str
    used_chars: int
    omitted_count: int
    budget: ContextBudget
    read_only: bool = True

    def as_mapping(self) -> Mapping[str, Any]:
        return MappingProxyType(
            {
                "task_ref": self.task_ref,
                "agent_id": self.agent_id,
                "snapshot_id": self.snapshot_id,
                "revision": self.revision,
                "checkpoint_sha256": self.checkpoint_sha256,
                "entries": tuple(entry.canonical() for entry in self.entries),
                "provenance_digest": self.provenance_digest,
                "used_chars": self.used_chars,
                "omitted_count": self.omitted_count,
                "budget": MappingProxyType(
                    {
                        "max_items": self.budget.max_items,
                        "max_chars": self.budget.max_chars,
                    }
                ),
                "read_only": True,
            }
        )


def _require_text(mapping: Mapping[str, Any], key: str, error: str) -> str:
    value = mapping.get(key)
    if not isinstance(value, str) or not value.strip():
        raise MemoryBoundaryError(error)
    return value


def _parse_entry(raw: Mapping[str, Any], allowed_scopes: set[str]) -> ContextEntry:
    entry_id = _require_text(raw, "entry_id", "context_entry_id_required")
    content = _require_text(raw, "content", "context_entry_content_required")
    evidence_ref = _require_text(
        raw, "evidence_ref", "context_entry_evidence_ref_required"
    )

    raw_scope = raw.get("scope")
    if not isinstance(raw_scope, Mapping):
        raise MemoryBoundaryError("context_entry_scope_mapping_required")
    scope = MemoryScopeRef(
        _require_text(raw_scope, "kind", "context_entry_scope_kind_required"),
        _require_text(raw_scope, "scope_id", "context_entry_scope_id_required"),
    )
    scope.validate()
    if scope.key not in allowed_scopes:
        raise MemoryBoundaryError("context_entry_scope_not_authorized")

    score = raw.get("score")
    if isinstance(score, bool) or not isinstance(score, (int, float)):
        raise MemoryBoundaryError("context_entry_score_number_required")
    score = float(score)
    if not 0.0 <= score <= 1.0:
        raise MemoryBoundaryError("context_entry_score_out_of_range")

    provenance = raw.get("provenance")
    if not isinstance(provenance, Mapping):
        raise MemoryBoundaryError("context_entry_provenance_mapping_required")
    source = _require_text(
        provenance, "source", "context_entry_provenance_source_required"
    )
    revision = _require_text(
        provenance, "revision", "context_entry_provenance_revision_required"
    )
    if provenance.get("evidence_ref") != evidence_ref:
        raise MemoryBoundaryError("context_entry_provenance_evidence_mismatch")

    return ContextEntry(
        entry_id=entry_id,
        scope=scope,
        content=content,
        score=score,
        evidence_ref=evidence_ref,
        provenance=MappingProxyType(
            {
                "source": source,
                "revision": revision,
                "evidence_ref": evidence_ref,
            }
        ),
    )


def build_context_pack(
    request: MemoryReadRequest,
    *,
    port: Any,
    budget: ContextBudget | None = None,
) -> ContextPack:
    """Build a bounded context pack from one persisted Memory snapshot.

    Ranking is deterministic: descending numeric score, then entry_id. The
    injected port remains the persistence owner. Recreating this fabric after
    restart reads the same snapshot/checkpoint and therefore reproduces the
    same pack when the underlying persisted state is unchanged.
    """

    if request.operation != "GET_CONTEXT":
        raise MemoryBoundaryError("context_fabric_requires_get_context")
    request.validate()
    budget = budget or ContextBudget()
    budget.validate()

    result = perform_memory_read(request, port=port)
    payload = result.payload
    snapshot_id = _require_text(payload, "snapshot_id", "memory_snapshot_id_required")
    revision = _require_text(payload, "revision", "memory_revision_required")
    checkpoint_sha256 = _require_text(
        payload, "checkpoint_sha256", "memory_checkpoint_sha256_required"
    )
    if not _SHA256_RE.fullmatch(checkpoint_sha256):
        raise MemoryBoundaryError("memory_checkpoint_sha256_invalid")
    checkpoint_sha256 = checkpoint_sha256.lower()

    raw_entries = payload.get("entries")
    if not isinstance(raw_entries, (list, tuple)):
        raise MemoryBoundaryError("context_entries_sequence_required")

    allowed_scopes = {request.agent_memory.key}
    allowed_scopes.update(scope.key for scope in request.context_scopes)

    parsed: list[ContextEntry] = []
    seen_ids: set[str] = set()
    for raw in raw_entries:
        if not isinstance(raw, Mapping):
            raise MemoryBoundaryError("context_entry_mapping_required")
        entry = _parse_entry(raw, allowed_scopes)
        if entry.entry_id in seen_ids:
            raise MemoryBoundaryError("duplicate_context_entry_id")
        seen_ids.add(entry.entry_id)
        parsed.append(entry)

    parsed.sort(key=lambda entry: (-entry.score, entry.entry_id))
    selected: list[ContextEntry] = []
    used_chars = 0
    for entry in parsed:
        if len(selected) >= budget.max_items:
            break
        entry_chars = len(entry.content)
        if used_chars + entry_chars > budget.max_chars:
            continue
        selected.append(entry)
        used_chars += entry_chars

    canonical = {
        "snapshot_id": snapshot_id,
        "revision": revision,
        "checkpoint_sha256": checkpoint_sha256,
        "entries": [
            {
                "entry_id": entry.entry_id,
                "scope": {
                    "kind": entry.scope.kind,
                    "scope_id": entry.scope.scope_id,
                },
                "content": entry.content,
                "score": entry.score,
                "evidence_ref": entry.evidence_ref,
                "provenance": dict(entry.provenance),
            }
            for entry in selected
        ],
    }
    provenance_digest = sha256(
        json.dumps(
            canonical,
            sort_keys=True,
            separators=(",", ":"),
            ensure_ascii=False,
        ).encode("utf-8")
    ).hexdigest()

    return ContextPack(
        task_ref=request.task_ref,
        agent_id=request.agent_id,
        snapshot_id=snapshot_id,
        revision=revision,
        checkpoint_sha256=checkpoint_sha256,
        entries=tuple(selected),
        provenance_digest=provenance_digest,
        used_chars=used_chars,
        omitted_count=len(parsed) - len(selected),
        budget=budget,
        read_only=True,
    )
