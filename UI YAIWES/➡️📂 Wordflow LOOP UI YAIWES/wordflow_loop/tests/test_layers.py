from wordflow_loop.contracts import NodeContract, Status
from wordflow_loop.layers import layer_04_copy_move, layer_05_download_extract


def test_copy_move_rejects_unverified_motor_result():
    node = NodeContract.build(
        node_id="N4",
        layer="L04_COPY_MOVE",
        literal="validate move",
        mutation=True,
        authorization=("director",),
        allowed_actions=("move",),
        allowed_paths=("dest",),
    )
    result = layer_04_copy_move.run(node, {"motor_result": {"verdict": "GAPS_PENDING"}})
    assert result.status == Status.BLOCKED


def test_download_extract_accepts_only_closed_balance():
    node = NodeContract.build(
        node_id="N5",
        layer="L05_DOWNLOAD_EXTRACT",
        literal="validate acquisition",
        mutation=True,
        authorization=("director",),
        allowed_actions=("dispatch_action",),
        allowed_paths=("dest",),
    )
    tree_hash = "a" * 64
    result = layer_05_download_extract.run(
        node,
        {
            "motor_result": {
                "verdict": "VERIFIED_CLOSED",
                "tree_sha256": tree_hash,
                "destination": "dest",
                "actions": ["dispatch_action"],
                "touched_paths": ["dest"],
                "balance": {
                    "total": 1,
                    "failed": 0,
                    "pending": 0,
                    "extraction_verified": 1,
                    "published_readback_verified": 1,
                },
            }
        },
    )
    assert result.status == Status.PASS
