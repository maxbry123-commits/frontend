from __future__ import annotations

from ..contracts import Evidence, LayerResult, NodeContract, Status, sha256


def run(node: NodeContract, payload: dict) -> LayerResult:
    if payload.get("safe_reuse"):
        decision = "REUSE"
    elif payload.get("small_patch"):
        decision = "PATCH_SMALL"
    elif payload.get("adapter_possible"):
        decision = "ADAPTER"
    elif payload.get("missing_delta_defined"):
        decision = "GENERATE_DELTA"
    else:
        return LayerResult(
            node_id=node.node_id,
            layer=node.layer,
            status=Status.INCONCLUSIVE,
            gaps=["source_evolution_decision_gap"],
        )

    return LayerResult(
        node_id=node.node_id,
        layer=node.layer,
        status=Status.PASS,
        output={"decision": decision},
        evidence=[Evidence("decision_input", "source-evolution", sha256(payload))],
    )
