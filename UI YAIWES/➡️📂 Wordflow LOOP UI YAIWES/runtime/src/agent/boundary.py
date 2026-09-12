from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
from importlib import import_module
from typing import Any, Mapping, TypeVar


WORKFLOW_OWNER = "stabilize_core"
WORKFLOW_CONTRACT = "tel.workflow/v3"
STABILIZE_AGENT_LOOP_TYPE = "stabilize.llm.tasks.AgentLoopTask"
STABILIZE_TOOL_REGISTRY_TYPE = "stabilize.llm.tools.ToolRegistry"
LLM_CONTEXT_KEYS = frozenset(
    {
        "prompt",
        "system",
        "messages",
        "model",
        "temperature",
        "base_url",
        "api_key",
        "api",
        "max_iterations",
        "output_key",
    }
)


class AgentBoundaryError(ValueError):
    """Raised when an Agent/Memory/Workflow boundary contract is invalid."""


class MemoryScopeKind(str, Enum):
    AGENT_PRIVATE = "AGENT_PRIVATE"
    CHAT = "CHAT"
    PROJECT = "PROJECT"


@dataclass(frozen=True)
class MemoryScopeRef:
    kind: MemoryScopeKind
    scope_id: str

    def validate(self) -> None:
        if not self.scope_id or not self.scope_id.strip():
            raise AgentBoundaryError("memory_scope_id_required")

    @property
    def key(self) -> str:
        self.validate()
        return f"{self.kind.value}:{self.scope_id}"


@dataclass(frozen=True)
class AgentBoundaryRequest:
    """Typed handoff into the existing Stabilize agent task.

    This contract does not own workflow scheduling, tool authorization or
    canonical-memory writes. Upstream Runtime/Policy supplies the allowed
    tools and Memory/Audit supplies the context pack.
    """

    agent_id: str
    task_ref: str
    agent_memory: MemoryScopeRef
    context_scopes: tuple[MemoryScopeRef, ...] = ()
    allowed_tools: tuple[str, ...] = ()
    workflow_owner: str = WORKFLOW_OWNER
    workflow_contract: str = WORKFLOW_CONTRACT
    max_iterations: int = 8
    output_key: str = "answer"

    def validate(self) -> None:
        if not self.agent_id or not self.agent_id.strip():
            raise AgentBoundaryError("agent_id_required")
        if not self.task_ref or not self.task_ref.strip():
            raise AgentBoundaryError("task_ref_required")
        if self.workflow_owner != WORKFLOW_OWNER:
            raise AgentBoundaryError("workflow_owner_must_be_stabilize_core")
        if self.workflow_contract != WORKFLOW_CONTRACT:
            raise AgentBoundaryError("workflow_contract_mismatch")
        if self.max_iterations < 1:
            raise AgentBoundaryError("max_iterations_must_be_positive")
        if not self.output_key or not self.output_key.strip():
            raise AgentBoundaryError("output_key_required")

        self.agent_memory.validate()
        if self.agent_memory.kind is not MemoryScopeKind.AGENT_PRIVATE:
            raise AgentBoundaryError("agent_memory_must_be_agent_private")

        seen_context: set[str] = set()
        for scope in self.context_scopes:
            scope.validate()
            if scope.kind not in {MemoryScopeKind.CHAT, MemoryScopeKind.PROJECT}:
                raise AgentBoundaryError("context_memory_must_be_chat_or_project")
            if scope.key == self.agent_memory.key:
                raise AgentBoundaryError("agent_memory_must_be_isolated")
            if scope.key in seen_context:
                raise AgentBoundaryError("duplicate_context_memory_scope")
            seen_context.add(scope.key)

        if any(not name or not name.strip() for name in self.allowed_tools):
            raise AgentBoundaryError("allowed_tool_name_required")
        if len(self.allowed_tools) != len(set(self.allowed_tools)):
            raise AgentBoundaryError("allowed_tools_must_be_unique")

    def manifest(self) -> dict[str, Any]:
        self.validate()
        return {
            "agent_id": self.agent_id,
            "task_ref": self.task_ref,
            "workflow_owner": self.workflow_owner,
            "workflow_contract": self.workflow_contract,
            "agent_memory": {
                "kind": self.agent_memory.kind.value,
                "scope_id": self.agent_memory.scope_id,
            },
            "context_scopes": [
                {"kind": scope.kind.value, "scope_id": scope.scope_id}
                for scope in self.context_scopes
            ],
            "allowed_tools": list(self.allowed_tools),
            "max_iterations": self.max_iterations,
            "output_key": self.output_key,
        }


@dataclass(frozen=True)
class AgentCandidateResult:
    """Non-canonical result emitted for downstream validation/audit."""

    agent_id: str
    task_ref: str
    agent_memory: MemoryScopeRef
    answer: str
    tool_invocations: tuple[Mapping[str, Any], ...]
    iterations: int
    canonical_memory_write: bool = False


TAgentLoop = TypeVar("TAgentLoop")


def build_stage_context(
    request: AgentBoundaryRequest,
    *,
    context_pack: Mapping[str, Any],
    llm_input: Mapping[str, Any],
) -> dict[str, Any]:
    """Build the closed context consumed by Stabilize AgentLoopTask.

    Context memory arrives as a read-only pack from the upstream Memory/Audit
    boundary. Unknown LLM context keys fail closed so a caller cannot smuggle
    a memory writer or another orchestration control through this adapter.
    """

    request.validate()
    if not isinstance(context_pack, Mapping):
        raise AgentBoundaryError("context_pack_mapping_required")
    if not isinstance(llm_input, Mapping):
        raise AgentBoundaryError("llm_input_mapping_required")

    unknown = sorted(set(llm_input) - LLM_CONTEXT_KEYS)
    if unknown:
        raise AgentBoundaryError(f"unsupported_llm_context_keys:{','.join(unknown)}")
    if not llm_input.get("prompt") and not llm_input.get("messages"):
        raise AgentBoundaryError("llm_prompt_or_messages_required")

    stage_context = dict(llm_input)
    stage_context["max_iterations"] = request.max_iterations
    stage_context["output_key"] = request.output_key
    stage_context["yaiwes_agent_boundary"] = request.manifest()
    stage_context["context_pack"] = dict(context_pack)
    return stage_context


def _resolve_stabilize_agent_loop_type() -> type[Any]:
    module = import_module("stabilize.llm.tasks")
    agent_loop_type = getattr(module, "AgentLoopTask", None)
    if agent_loop_type is None:
        raise AgentBoundaryError("stabilize_agent_loop_not_available")
    return agent_loop_type


def _registered_tool_names(tools: Any) -> tuple[str, ...]:
    if tools is None:
        return ()
    schemas = getattr(tools, "schemas", None)
    if not callable(schemas):
        raise AgentBoundaryError("tool_registry_schemas_required")

    names: list[str] = []
    for schema in schemas():
        if not isinstance(schema, Mapping):
            raise AgentBoundaryError("tool_schema_mapping_required")
        function = schema.get("function")
        if not isinstance(function, Mapping):
            raise AgentBoundaryError("tool_schema_function_required")
        name = function.get("name")
        if not isinstance(name, str) or not name:
            raise AgentBoundaryError("tool_schema_name_required")
        names.append(name)
    return tuple(names)


def build_agent_loop(
    request: AgentBoundaryRequest,
    *,
    client: Any = None,
    tools: Any = None,
    agent_loop_type: type[TAgentLoop] | None = None,
) -> TAgentLoop:
    """Compose the existing Stabilize AgentLoopTask; never implement another loop."""

    request.validate()
    registered = _registered_tool_names(tools)
    if set(registered) != set(request.allowed_tools) or len(registered) != len(
        request.allowed_tools
    ):
        raise AgentBoundaryError("tool_registry_authorization_mismatch")

    loop_type: type[Any] = agent_loop_type or _resolve_stabilize_agent_loop_type()
    return loop_type(client=client, tools=tools)


def candidate_from_task_outputs(
    request: AgentBoundaryRequest,
    outputs: Mapping[str, Any],
) -> AgentCandidateResult:
    """Normalize AgentLoopTask outputs into a candidate for Validator/Auditor.

    This function intentionally has no Memory writer parameter. Canonical
    memory can only be updated downstream after schema validation, audit and
    StateDelta acceptance.
    """

    request.validate()
    if not isinstance(outputs, Mapping):
        raise AgentBoundaryError("agent_outputs_mapping_required")

    answer = outputs.get(request.output_key)
    if not isinstance(answer, str):
        raise AgentBoundaryError("agent_answer_required")

    raw_invocations = outputs.get("tool_invocations", ())
    if not isinstance(raw_invocations, (list, tuple)):
        raise AgentBoundaryError("tool_invocations_sequence_required")
    if not all(isinstance(item, Mapping) for item in raw_invocations):
        raise AgentBoundaryError("tool_invocation_mapping_required")

    iterations = outputs.get("iterations", 0)
    if not isinstance(iterations, int) or iterations < 1:
        raise AgentBoundaryError("agent_iterations_positive_integer_required")

    return AgentCandidateResult(
        agent_id=request.agent_id,
        task_ref=request.task_ref,
        agent_memory=request.agent_memory,
        answer=answer,
        tool_invocations=tuple(raw_invocations),
        iterations=iterations,
        canonical_memory_write=False,
    )
