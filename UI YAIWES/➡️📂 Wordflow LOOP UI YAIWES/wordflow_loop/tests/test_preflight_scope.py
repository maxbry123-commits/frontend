import pytest

from wordflow_loop.contracts import Evidence, LayerResult, NodeContract, Status, sha256
from wordflow_loop.runner import LayerRunner


@pytest.mark.parametrize("scope", ["safe/../outside", "../outside", "safe\\outside", "safe\x00outside", "", None])
def test_invalid_scope_blocks_before_handler(scope):
    calls = []

    def handler(node, payload):
        calls.append("effect")
        return LayerResult(node.node_id, node.layer, Status.FAIL)

    node = NodeContract.build(node_id="scope", layer="L", literal="scope", mutation=True,
                              authorization=("director",), allowed_actions=("write",),
                              allowed_paths=(scope,))
    result = LayerRunner({"L": handler}).run(node)
    assert result.status == Status.BLOCKED
    assert "invalid_allowed_path" in result.gaps
    assert calls == []


@pytest.mark.parametrize("scope", ["safe", "/workspace/safe", "safe/nested"])
def test_valid_scope_still_executes(scope):
    calls = []

    def handler(node, payload):
        calls.append("effect")
        return LayerResult(node.node_id, node.layer, Status.PASS,
                           evidence=[Evidence("test", "scope", sha256("scope"))],
                           touched_paths=[scope + "/file"])

    node = NodeContract.build(node_id="scope", layer="L", literal="scope", mutation=True,
                              authorization=("director",), allowed_actions=("write",),
                              allowed_paths=(scope,))
    assert LayerRunner({"L": handler}).run(node).status == Status.PASS
    assert calls == ["effect"]
