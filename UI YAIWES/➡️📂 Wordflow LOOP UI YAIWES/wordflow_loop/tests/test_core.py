from pathlib import Path

from wordflow_loop.contracts import Evidence, LayerResult, NodeContract, Status, sha256
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
    recovered_event = recovered.recover_event("N1")
    assert recovered_event is not None
    assert recovered_event["literal"] == node.literal
    assert recovered_event["literal_sha256"] == node.literal_sha256
    assert recovered_event["output"] == result.output

    # Recovery read-back is defensive: callers cannot mutate the runner's replay state.
    recovered_event["output"]["results"].clear()
    assert recovered.recover_event("N1")["output"] == result.output


def test_stale_runners_refresh_and_preserve_shared_ledger(tmp_path: Path):
    def handler(node: NodeContract, payload: dict) -> LayerResult:
        return LayerResult(
            node_id=node.node_id,
            layer=node.layer,
            status=Status.PASS,
            output={"seen": node.node_id},
            evidence=[Evidence("test", node.node_id, sha256(node.node_id))],
        )

    ledger_path = tmp_path / "shared" / "ledger.jsonl"
    runner_a = LayerRunner({"L": handler}, ledger_path=ledger_path)
    runner_b = LayerRunner({"L": handler}, ledger_path=ledger_path)
    parent = NodeContract.build(node_id="parent", layer="L", literal="parent")
    child = NodeContract.build(
        node_id="child",
        layer="L",
        literal="child",
        depends_on=("parent",),
    )

    assert runner_a.run(parent).status == Status.PASS
    # runner_b was instantiated before parent existed; run() must refresh durable state.
    assert runner_b.run(child).status == Status.PASS

    recovered = LayerRunner({"L": handler}, ledger_path=ledger_path)
    assert recovered.completed_nodes == {"parent", "child"}
    assert len(recovered.ledger) == 2
    assert recovered.recover_event("parent")["output"] == {"seen": "parent"}
    assert recovered.recover_event("child")["output"] == {"seen": "child"}


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
