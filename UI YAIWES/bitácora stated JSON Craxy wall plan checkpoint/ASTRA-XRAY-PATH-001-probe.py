"""Regression probe; run with PYTHONPATH pointing to wordflow_loop project root."""
from wordflow_loop.contracts import LayerResult, NodeContract, Status
from wordflow_loop.governance.supervisor import check
n = NodeContract.build(node_id="n", layer="L", literal="validate lexical containment", allowed_paths=("safe",))
for path, denied in [("safe/file", False), ("safe", False), ("safe/../outside", True), ("safe/sub/../../outside", True), ("safe\\outside", True), ("safe/\x00file", True), ("safe-other/file", True), ("/outside", True)]:
    result = LayerResult(node_id="n", layer="L", status=Status.PASS, touched_paths=[path])
    assert bool(check(n, result)) == denied, repr(path)
print("8/8 lexical containment assertions PASS")
