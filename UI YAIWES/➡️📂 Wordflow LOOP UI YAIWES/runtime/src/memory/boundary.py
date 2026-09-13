from __future__ import annotations

from dataclasses import dataclass
from types import MappingProxyType
from typing import Any, Mapping

READ_OPERATIONS = frozenset({
    "GET_CONTEXT", "GET_MEMORY", "GET_EVIDENCE", "GET_STATE",
    "GET_HISTORY", "GET_ARTIFACT", "GET_RELATIONS", "AUDIT_MEMORY",
})
WRITE_OPERATIONS = frozenset({
    "SAVE_STATE_DELTA", "SAVE_ARTIFACT", "SAVE_CLAIM", "SAVE_EVIDENCE",
    "SAVE_CONSOLIDATION", "CREATE_CHECKPOINT",
})

class MemoryBoundaryError(ValueError):
    pass

@dataclass(frozen=True)
class MemoryScopeRef:
    kind: str
    scope_id: str

    def validate(self) -> None:
        if self.kind not in {"AGENT_PRIVATE", "CHAT", "PROJECT"}:
            raise MemoryBoundaryError("unsupported_memory_scope_kind")
        if not self.scope_id or not self.scope_id.strip():
            raise MemoryBoundaryError("memory_scope_id_required")

    @property
    def key(self) -> str:
        self.validate()
        return f"{self.kind}:{self.scope_id}"

@dataclass(frozen=True)
class MemoryReadRequest:
    operation: str
    task_ref: str
    agent_id: str
    agent_memory: MemoryScopeRef
    context_scopes: tuple[MemoryScopeRef, ...] = ()

    def validate(self) -> None:
        if self.operation not in READ_OPERATIONS:
            if self.operation in WRITE_OPERATIONS:
                raise MemoryBoundaryError("write_operation_not_allowed_on_read_boundary")
            raise MemoryBoundaryError("unsupported_memory_read_operation")
        if not self.task_ref or not self.task_ref.strip():
            raise MemoryBoundaryError("task_ref_required")
        if not self.agent_id or not self.agent_id.strip():
            raise MemoryBoundaryError("agent_id_required")
        self.agent_memory.validate()
        if self.agent_memory.kind != "AGENT_PRIVATE":
            raise MemoryBoundaryError("agent_memory_must_be_agent_private")
        seen: set[str] = set()
        for scope in self.context_scopes:
            scope.validate()
            if scope.kind not in {"CHAT", "PROJECT"}:
                raise MemoryBoundaryError("context_memory_must_be_chat_or_project")
            if scope.key == self.agent_memory.key:
                raise MemoryBoundaryError("agent_memory_must_be_isolated")
            if scope.key in seen:
                raise MemoryBoundaryError("duplicate_context_memory_scope")
            seen.add(scope.key)

@dataclass(frozen=True)
class MemoryReadResult:
    operation: str
    task_ref: str
    agent_id: str
    payload: Mapping[str, Any]
    read_only: bool = True

    def context_pack(self) -> Mapping[str, Any]:
        if self.operation != "GET_CONTEXT":
            raise MemoryBoundaryError("context_pack_requires_get_context")
        return MappingProxyType({
            "task_ref": self.task_ref,
            "agent_id": self.agent_id,
            "read_only": True,
            "payload": self.payload,
        })

@dataclass(frozen=True)
class MemoryWriteAuthorization:
    operation: str
    origin: str
    canonical_memory_write_authorized: bool = True


def _freeze(value: Any) -> Any:
    if isinstance(value, Mapping):
        return MappingProxyType({str(k): _freeze(v) for k, v in value.items()})
    if isinstance(value, (list, tuple)):
        return tuple(_freeze(v) for v in value)
    return value


def perform_memory_read(request: MemoryReadRequest, *, port: Any) -> MemoryReadResult:
    request.validate()
    reader = getattr(port, "read", None)
    if not callable(reader):
        raise MemoryBoundaryError("memory_read_port_required")
    response = reader(
        operation=request.operation,
        task_ref=request.task_ref,
        agent_id=request.agent_id,
        agent_memory=request.agent_memory,
        context_scopes=request.context_scopes,
    )
    if not isinstance(response, Mapping):
        raise MemoryBoundaryError("memory_read_response_mapping_required")
    return MemoryReadResult(
        operation=request.operation,
        task_ref=request.task_ref,
        agent_id=request.agent_id,
        payload=_freeze(response),
        read_only=True,
    )


def authorize_canonical_memory_write(
    *,
    operation: str,
    origin: str,
    normalized: bool,
    schema_validated: bool,
    audited: bool,
    state_delta_accepted: bool,
) -> MemoryWriteAuthorization:
    if operation not in WRITE_OPERATIONS:
        raise MemoryBoundaryError("unsupported_memory_write_operation")
    if not origin or not origin.strip():
        raise MemoryBoundaryError("memory_write_origin_required")
    if origin.strip().upper() == "LLM":
        raise MemoryBoundaryError("direct_llm_canonical_memory_write_forbidden")
    gates = {
        "normalized": normalized,
        "schema_validated": schema_validated,
        "audited": audited,
        "state_delta_accepted": state_delta_accepted,
    }
    missing = [name for name, passed in gates.items() if not passed]
    if missing:
        raise MemoryBoundaryError(
            "canonical_memory_write_gate_incomplete:" + ",".join(missing)
        )
    return MemoryWriteAuthorization(operation=operation, origin=origin)
