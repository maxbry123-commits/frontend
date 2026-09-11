from pathlib import Path

from wordflow_loop.contracts import Evidence, LayerResult, NodeContract, Status
from wordflow_loop.layers import layer_01_research
from wordflow_loop.runner import LayerRunner


def test_runner_persists_and_recovers_completed_node(tmp_path: Path):
    ledger_path = tmp_path / "state" / "ledger.jsonl"
    runner = LayerRunner({"L01_RESEARCH": layer_01_research.run}, ledger_path=ledger_path)
    node = NodeContract.build(node_id="N1", layer="L01_RESEARCH", literal="research")
    result = runner.run(
        node,
        {
            "candidates": [
                {
                    "url": "https://github.com/example/project",
                    "snippet": "official code",
                    "source_class": "code_official",
                }
            ]
        },
    )
    assert result.status == Status.PASS
    assert ledger_path.exists()

    recovered = LayerRunner({"L01_RESEARCH": layer_01_research.run}, ledger_path=ledger_path)
    assert "N1" in recovered.completed_nodes


def test_pass_with_unhashed_evidence_fails_closed():
    def bad_handler(node: NodeContract, payload: dict) -> LayerResult:
        return LayerResult(
            node_id=node.node_id,
            layer=node.layer,
            status=Status.PASS,
            evidence=[Evidence("log", "memory-only")],
        )

    runner = LayerRunner({"L99": bad_handler})
    node = NodeContract.build(node_id="N99", layer="L99", literal="must have hash")
    result = runner.run(node)
    assert result.status == Status.FAIL
    assert "pass_without_evidence" in result.gaps
