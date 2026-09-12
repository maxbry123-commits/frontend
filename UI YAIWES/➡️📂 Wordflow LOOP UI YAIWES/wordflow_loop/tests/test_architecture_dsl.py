from wordflow_loop.architecture_dsl import (
    DETERMINISTIC_RATIO,
    LLM_RATIO,
    PROCESSES,
    microflow,
    topological_order,
    validate_architecture,
)
from wordflow_loop.llm_gate import LLMBudget


def test_architecture_is_96_4_and_valid():
    assert DETERMINISTIC_RATIO == 0.96
    assert LLM_RATIO == 0.04
    assert validate_architecture() == ()
    assert len(PROCESSES) == 23
    assert topological_order() == tuple(item.process_id for item in PROCESSES)


def test_llm_budget_defaults_to_four_percent():
    budget = LLMBudget(deterministic_units=96, llm_units=4)
    assert budget.max_ratio == 0.04
    assert budget.ratio == 0.04
    assert not budget.allows(1)


def test_llm_is_bounded_to_semantic_nodes_only():
    enabled = {item.process_id for item in PROCESSES if item.llm_allowed}
    assert enabled == {"P09", "P10", "P19"}


def test_microflow_is_horizontal_and_evidence_gated():
    text = microflow("P20")
    assert "P20:GLOBAL_INTEGRATION" in text
    assert "EVIDENCE -> NEXT" in text
    assert "[DET]" in text
