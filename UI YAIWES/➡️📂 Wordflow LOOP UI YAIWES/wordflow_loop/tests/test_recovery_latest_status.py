from wordflow_loop.contracts import Evidence, LayerResult, NodeContract, Status, sha256
from wordflow_loop.runner import LayerRunner


def test_failed_rerun_revokes_dependency_before_and_after_restart(tmp_path):
    status = Status.PASS

    def handler(node, payload):
        return LayerResult(node.node_id, node.layer, status,
                           evidence=[Evidence('test', 'fixture', sha256('fixture'))])

    path = tmp_path / 'ledger.jsonl'
    runner = LayerRunner({'L': handler}, ledger_path=path)
    parent = NodeContract.build(node_id='parent', layer='L', literal='parent')
    child = NodeContract.build(node_id='child', layer='L', literal='child',
                               depends_on=('parent',))
    assert runner.run(parent).status == Status.PASS
    status = Status.FAIL
    assert runner.run(parent).status == Status.FAIL
    assert 'parent' not in runner.completed_nodes
    assert runner.run(child).status == Status.BLOCKED
    recovered = LayerRunner({'L': handler}, ledger_path=path)
    assert 'parent' not in recovered.completed_nodes
    assert recovered.run(child).status == Status.BLOCKED
    status = Status.PASS
    assert recovered.run(parent).status == Status.PASS
    assert recovered.run(child).status == Status.PASS
