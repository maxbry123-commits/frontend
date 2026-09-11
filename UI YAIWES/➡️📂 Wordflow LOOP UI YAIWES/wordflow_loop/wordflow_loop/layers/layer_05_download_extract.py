from __future__ import annotations

from ..contracts import Evidence, LayerResult, NodeContract, Status


def run(node: NodeContract, payload: dict) -> LayerResult:
    result = payload.get("motor_result", {})
    balance = result.get("balance", {})
    total = int(balance.get("total", 0) or 0)
    tree_hash = str(result.get("tree_sha256", ""))
    verified = (
        result.get("verdict") == "VERIFIED_CLOSED"
        and total > 0
        and balance.get("failed") == 0
        and balance.get("pending") == 0
        and balance.get("extraction_verified") == total
        and balance.get("published_readback_verified") == total
        and bool(tree_hash)
    )
    if not verified:
        return LayerResult(
            node_id=node.node_id,
            layer=node.layer,
            status=Status.BLOCKED,
            gaps=["canonical_motor_download_extract_not_verified"],
        )

    return LayerResult(
        node_id=node.node_id,
        layer=node.layer,
        status=Status.PASS,
        output=result,
        evidence=[
            Evidence(
                "extracted_tree",
                str(result.get("destination", "destination")),
                tree_hash,
            )
        ],
        actions=list(result.get("actions", ["dispatch_action"])),
        touched_paths=list(result.get("touched_paths", [])),
    )
