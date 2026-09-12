from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable

DETERMINISTIC_RATIO = 0.96
LLM_RATIO = 0.04


@dataclass(frozen=True)
class ProcessSpec:
    process_id: str
    name: str
    depends_on: tuple[str, ...] = ()
    owner: str = "RUNTIME"
    llm_allowed: bool = False
    status_hint: str = "REQUIRES_EVIDENCE"


PROCESSES: tuple[ProcessSpec, ...] = (
    ProcessSpec("P01", "CORE_STATE_MODEL"),
    ProcessSpec("P02", "EVENT_MODEL", ("P01",)),
    ProcessSpec("P03", "TASK_MODEL", ("P01", "P02")),
    ProcessSpec("P04", "TASK_CONTRACT", ("P03",)),
    ProcessSpec("P05", "STATE_MACHINE", ("P04",)),
    ProcessSpec("P06", "CHECKPOINT_ENGINE", ("P05",)),
    ProcessSpec("P07", "POLICY_ENGINE", ("P04",)),
    ProcessSpec("P08", "MEMORY_CONTRACT", ("P04", "P06"), owner="MEMORY"),
    ProcessSpec("P09", "RETRIEVAL_CONTRACT", ("P08",), owner="MEMORY", llm_allowed=True),
    ProcessSpec("P10", "CONTEXT_FABRIC", ("P08", "P09"), owner="MEMORY", llm_allowed=True),
    ProcessSpec("P11", "SANDBOX_CONTRACT", ("P04",), owner="SANDBOX"),
    ProcessSpec("P12", "WORKER_CONTRACT", ("P10", "P11")),
    ProcessSpec("P13", "OUTPUT_SCHEMA", ("P12",)),
    ProcessSpec("P14", "AUDIT_ENGINE", ("P13",), owner="AUDIT"),
    ProcessSpec("P15", "CONSOLIDATOR", ("P14",), owner="CONSOLIDATOR"),
    ProcessSpec("P16", "ROUTER", ("P07", "P10", "P11")),
    ProcessSpec("P17", "CONTINUOUS_LOOP", ("P15", "P16")),
    ProcessSpec("P18", "RECOVERY", ("P06", "P17")),
    ProcessSpec("P19", "RESOURCE_BRAIN", ("P09", "P16"), llm_allowed=True),
    ProcessSpec("P20", "GLOBAL_INTEGRATION", ("P15", "P17", "P18", "P19")),
    ProcessSpec("P21", "FIVE_PASS_BUILD_AUDITOR", ("P20",), owner="AUDIT"),
    ProcessSpec("P22", "API", ("P20", "P21")),
    ProcessSpec("P23", "UI", ("P22",)),
)


class ArchitectureError(ValueError):
    pass


def process_map(processes: Iterable[ProcessSpec] = PROCESSES) -> dict[str, ProcessSpec]:
    items = tuple(processes)
    result = {item.process_id: item for item in items}
    if len(result) != len(items):
        raise ArchitectureError("duplicate_process_id")
    return result


def validate_architecture(processes: Iterable[ProcessSpec] = PROCESSES) -> tuple[str, ...]:
    items = tuple(processes)
    by_id = process_map(items)
    errors: list[str] = []

    if round(DETERMINISTIC_RATIO + LLM_RATIO, 8) != 1.0:
        errors.append("ratio_sum_must_equal_one")
    if DETERMINISTIC_RATIO < 0.96:
        errors.append("deterministic_ratio_below_96_percent")
    if LLM_RATIO > 0.04:
        errors.append("llm_ratio_above_4_percent")

    seen: set[str] = set()
    for item in items:
        for dependency in item.depends_on:
            if dependency not in by_id:
                errors.append(f"{item.process_id}:missing_dependency:{dependency}")
            elif dependency not in seen:
                errors.append(f"{item.process_id}:dependency_not_before_node:{dependency}")
        seen.add(item.process_id)

    llm_nodes = {item.process_id for item in items if item.llm_allowed}
    allowed_llm_nodes = {"P09", "P10", "P19"}
    if not llm_nodes.issubset(allowed_llm_nodes):
        errors.append("llm_enabled_outside_bounded_semantic_nodes")

    return tuple(errors)


def topological_order(processes: Iterable[ProcessSpec] = PROCESSES) -> tuple[str, ...]:
    items = tuple(processes)
    errors = validate_architecture(items)
    if errors:
        raise ArchitectureError(";".join(errors))
    return tuple(item.process_id for item in items)


def microflow(process_id: str) -> str:
    spec = process_map()[process_id]
    left = " + ".join(spec.depends_on) if spec.depends_on else "INPUT"
    mode = "LLM<=4%" if spec.llm_allowed else "DET"
    return f"{left} -> {spec.process_id}:{spec.name} [{mode}] -> EVIDENCE -> NEXT"


def main() -> int:
    errors = validate_architecture()
    if errors:
        for error in errors:
            print(f"GAP {error}")
        return 1
    print(f"DETERMINISTIC={DETERMINISTIC_RATIO:.0%} LLM_MAX={LLM_RATIO:.0%}")
    for item in PROCESSES:
        print(microflow(item.process_id))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
