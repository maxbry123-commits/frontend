from __future__ import annotations

from ..contracts import Evidence, LayerResult, NodeContract, Status


def run(node: NodeContract, payload: dict) -> LayerResult:
    result = payload.get("motor_result", {})
    source_hash = str(result.get("source_sha256", ""))
    destination_hash = str(result.get("destination_sha256", ""))
    verified = (
        result.get("verdict") == "VERIFIED_CLOSED"
        and result.get("failed") == 0
        and result.get("pending") == 0
        and bool(source_hash)
        and source_hash == destination_hash
    )
    if not verified:
        return LayerResult(
            node_id=node.node_id,
            layer=node.layer,
            status=Status.BLOCKED,
            gaps=["canonical_motor_copy_move_not_verified"],
        )

    return LayerResult(
        node_id=node.node_id,
        layer=node.layer,
        status=Status.PASS,
        output=result,
        evidence=[
            Evidence(
                "motor_readback",
                str(result.get("destination", "destination")),
                destination_hash,
            )
        ],
        touched_paths=list(result.get("touched_paths", [])),
        actions=list(result.get("actions", ["move"])),
    )
