import sys
from pathlib import Path

SRC = Path(__file__).resolve().parents[1] / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from core.workflow_definition import YAIWES_CHAT_WORKFLOW


def test_req_s3_001_workflow_controls_normative_pipeline_without_second_owner():
    definition = YAIWES_CHAT_WORKFLOW
    definition.validate()

    tasks = tuple(step.task for step in definition.steps)
    required_pipeline = (
        "MasterInputContract",
        "GoalTask",
        "RequirementTask",
        "PlanTask",
        "StabilizeWorkflow",
        "AgentTask",
        "AuditTask",
        "ConsolidatorTask",
        "FinalJudgeTask",
    )

    positions = [tasks.index(task) for task in required_pipeline]
    assert positions == sorted(positions)
    assert definition.owner == "stabilize_core"
    assert definition.contract == "tel.workflow/v3"
    assert definition.steps[12].condition == "GAP"
    assert definition.steps[13].condition == "PASS"
    assert definition.steps[-1].condition == "CLOSURE_CANDIDATE"
