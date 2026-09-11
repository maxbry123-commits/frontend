from __future__ import annotations

import hashlib
import json
from dataclasses import asdict, dataclass
from typing import Iterable

WORKFLOW_OWNER = "stabilize_core"
WORKFLOW_CONTRACT = "tel.workflow/v3"
WORKFLOW_VERSION = "yaiwes-chat/1"


@dataclass(frozen=True)
class WorkflowStep:
    order: int
    step_id: str
    task: str
    depends_on: tuple[str, ...] = ()
    condition: str = "ALWAYS"


@dataclass(frozen=True)
class WorkflowDefinition:
    owner: str
    contract: str
    version: str
    steps: tuple[WorkflowStep, ...]

    def validate(self) -> None:
        if self.owner != WORKFLOW_OWNER:
            raise ValueError("workflow_owner_must_be_stabilize_core")
        if self.contract != WORKFLOW_CONTRACT:
            raise ValueError("workflow_contract_mismatch")
        if not self.steps:
            raise ValueError("workflow_steps_required")

        expected_orders = tuple(range(1, len(self.steps) + 1))
        orders = tuple(step.order for step in self.steps)
        if orders != expected_orders:
            raise ValueError("workflow_order_must_be_contiguous")

        ids = tuple(step.step_id for step in self.steps)
        if len(ids) != len(set(ids)):
            raise ValueError("workflow_step_ids_must_be_unique")

        seen: set[str] = set()
        for step in self.steps:
            if not step.step_id or not step.task:
                raise ValueError("workflow_step_fields_required")
            unknown = [dependency for dependency in step.depends_on if dependency not in seen]
            if unknown:
                raise ValueError(f"workflow_dependency_not_prior:{','.join(unknown)}")
            seen.add(step.step_id)

    def manifest(self) -> dict:
        self.validate()
        return {
            "owner": self.owner,
            "contract": self.contract,
            "version": self.version,
            "steps": [asdict(step) for step in self.steps],
        }

    def fingerprint(self) -> str:
        payload = json.dumps(
            self.manifest(),
            ensure_ascii=False,
            sort_keys=True,
            separators=(",", ":"),
        ).encode("utf-8")
        return hashlib.sha256(payload).hexdigest()


def _step(
    order: int,
    step_id: str,
    task: str,
    depends_on: Iterable[str] = (),
    *,
    condition: str = "ALWAYS",
) -> WorkflowStep:
    return WorkflowStep(
        order=order,
        step_id=step_id,
        task=task,
        depends_on=tuple(depends_on),
        condition=condition,
    )


# Declarative projection of Architecture §12. This file does not schedule work,
# own queues, persist runtime state, or implement recovery. Stabilize CORE remains
# the sole workflow owner; adapters/tasks consume this immutable definition.
YAIWES_CHAT_WORKFLOW = WorkflowDefinition(
    owner=WORKFLOW_OWNER,
    contract=WORKFLOW_CONTRACT,
    version=WORKFLOW_VERSION,
    steps=(
        _step(1, "master_input", "MasterInputContract"),
        _step(2, "questions", "QuestionTask", ("master_input",)),
        _step(3, "goals", "GoalTask", ("questions",)),
        _step(4, "requirements", "RequirementTask", ("goals",)),
        _step(5, "plan", "PlanTask", ("requirements",)),
        _step(6, "workflow", "StabilizeWorkflow", ("plan",)),
        _step(7, "task_contract", "TaskContract", ("workflow",)),
        _step(8, "context", "MemoryAdapter", ("task_contract",)),
        _step(9, "route", "RouterAdapter", ("context",)),
        _step(10, "agent", "AgentTask", ("route",)),
        _step(11, "candidate_delta", "StateDeltaValidation", ("agent",)),
        _step(12, "audit", "AuditTask", ("candidate_delta",)),
        _step(
            13,
            "gap_strategy",
            "FailureAnalysisStrategyDelta",
            ("audit",),
            condition="GAP",
        ),
        _step(14, "consolidate", "ConsolidatorTask", ("audit",), condition="PASS"),
        _step(15, "memory_update", "MemoryUpdate", ("consolidate",)),
        _step(16, "checkpoint", "StabilizeDurableCheckpoint", ("memory_update",)),
        _step(17, "coverage", "CoverageTask", ("checkpoint",)),
        _step(18, "next_stage", "NextRunnableStage", ("coverage",)),
        _step(19, "final_judge", "FinalJudgeTask", ("coverage",), condition="CLOSURE_CANDIDATE"),
    ),
)

# Fail fast at import time if a future edit breaks the declarative contract.
YAIWES_CHAT_WORKFLOW.validate()
