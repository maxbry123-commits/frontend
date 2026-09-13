import pytest

from wordflow_loop.contracts import Evidence, LayerResult, NodeContract, Status, sha256
from wordflow_loop.runner import LayerRunner


def effect_plan(action: str, path: str) -> dict:
    return {"effect_plan": {"actions": [action], "paths": [path]}}


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


def test_mutation_without_effect_plan_blocks_before_handler():
    calls = []

    def handler(node, payload):
        calls.append("effect")
        return LayerResult(node.node_id, node.layer, Status.FAIL)

    node = NodeContract.build(node_id="pre", layer="L", literal="pre", mutation=True,
                              authorization=("director",), allowed_actions=("write",),
                              allowed_paths=("safe",))
    result = LayerRunner({"L": handler}).run(node)
    assert result.status == Status.BLOCKED
    assert "missing_pre_effect_plan" in result.gaps
    assert calls == []


@pytest.mark.parametrize(
    ("plan", "gap"),
    [
        (effect_plan("delete", "safe/file"), "pre_effect_action_outside_scope:delete"),
        (effect_plan("write", "outside/file"), "pre_effect_path_outside_scope:outside/file"),
        (effect_plan("write", "safe/../outside"), "pre_effect_path_outside_scope:safe/../outside"),
    ],
)
def test_supervisor_rejects_unauthorized_plan_before_handler(plan, gap):
    calls = []

    def handler(node, payload):
        calls.append("effect")
        return LayerResult(node.node_id, node.layer, Status.FAIL)

    node = NodeContract.build(node_id="pre", layer="L", literal="pre", mutation=True,
                              authorization=("director",), allowed_actions=("write",),
                              forbidden_actions=("delete",), allowed_paths=("safe",))
    result = LayerRunner({"L": handler}).run(node, plan)
    assert result.status == Status.BLOCKED
    assert gap in result.gaps
    assert calls == []


@pytest.mark.parametrize("scope", ["safe", "/workspace/safe", "safe/nested"])
def test_valid_scope_still_executes(scope):
    calls = []

    def handler(node, payload):
        calls.append("effect")
        return LayerResult(node.node_id, node.layer, Status.PASS,
                           evidence=[Evidence("test", "scope", sha256("scope"))],
                           touched_paths=[scope + "/file"],
                           actions=["write"])

    node = NodeContract.build(node_id="scope", layer="L", literal="scope", mutation=True,
                              authorization=("director",), allowed_actions=("write",),
                              allowed_paths=(scope,))
    result = LayerRunner({"L": handler}).run(node, effect_plan("write", scope + "/file"))
    assert result.status == Status.PASS
    assert calls == ["effect"]


def test_post_effect_action_scope_remains_fail_closed():
    def handler(node, payload):
        return LayerResult(node.node_id, node.layer, Status.PASS,
                           evidence=[Evidence("test", "scope", sha256("scope"))],
                           touched_paths=["safe/file"],
                           actions=["delete"])

    node = NodeContract.build(node_id="post", layer="L", literal="post", mutation=True,
                              authorization=("director",), allowed_actions=("write",),
                              allowed_paths=("safe",))
    result = LayerRunner({"L": handler}).run(node, effect_plan("write", "safe/file"))
    assert result.status == Status.FAIL
    assert "action_outside_scope:delete" in result.gaps
