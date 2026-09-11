from wordflow_loop.contracts import NodeContract, Status
from wordflow_loop.layers import (
    layer_04_copy_move,
    layer_05_download_extract,
    layer_06_source_evolution,
)

CANONICAL_MOTOR_COMMIT = "ef0669bbc753861bfc33b86548f3f90c0f3d8df9"
SOURCE_REF = "1" * 40
TREE_HASH = "a" * 64


def acquisition_node() -> NodeContract:
    return NodeContract.build(
        node_id="N5",
        layer="L05_DOWNLOAD_EXTRACT",
        literal="validate acquisition",
        mutation=True,
        authorization=("director",),
        allowed_actions=("dispatch_action",),
        allowed_paths=("dest",),
    )


def valid_request() -> dict:
    return {
        "source_repo": "https://github.com/example/project",
        "source_ref": SOURCE_REF,
        "operation": "DOWNLOAD_EXTRACT",
        "dest_repo": "maxbry123-commits/frontend",
        "dest_branch": "main",
        "dest_root": "dest",
        "canonical_motor_commit": CANONICAL_MOTOR_COMMIT,
    }


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


def test_download_extract_rejects_missing_destination():
    request = valid_request()
    request["dest_root"] = ""
    result = layer_05_download_extract.run(acquisition_node(), {"request": request})
    assert result.status == Status.BLOCKED
    assert "DESTINATION_INPUT_GAP" in result.gaps


def test_download_extract_rejects_floating_ref():
    request = valid_request()
    request["source_ref"] = "main"
    result = layer_05_download_extract.run(acquisition_node(), {"request": request})
    assert result.status == Status.BLOCKED
    assert "SOURCE_LOCK_GAP" in result.gaps


def test_download_extract_rejects_wrong_motor_commit():
    request = valid_request()
    request["canonical_motor_commit"] = "2" * 40
    result = layer_05_download_extract.run(acquisition_node(), {"request": request})
    assert result.status == Status.BLOCKED
    assert "MOTOR_MISMATCH" in result.gaps


def test_download_extract_preserves_special_file_gap():
    request = valid_request()
    motor_result = {
        "verdict": "GAPS_PENDING",
        "error": "SOURCE_SPECIAL_FILE_GAP:path/to/link_a,path/to/link_b",
        "balance": {"total": 1, "failed": 1, "pending": 0},
    }
    result = layer_05_download_extract.run(
        acquisition_node(), {"request": request, "motor_result": motor_result}
    )
    assert result.status == Status.BLOCKED
    assert result.gaps == ["SPECIAL_FILE_GAP"]
    assert result.output["motor_result"]["error"] == motor_result["error"]


def test_download_extract_preserves_nested_special_file_gap():
    request = valid_request()
    motor_result = {
        "verdict": "GAPS_PENDING",
        "items": {
            "DuckDB": {
                "status": "FAILED",
                "error": "SOURCE_SPECIAL_FILE_GAP:data/link_to_file,data/link_to_upper_dir",
            }
        },
        "balance": {"total": 1, "failed": 1, "pending": 0},
    }
    result = layer_05_download_extract.run(
        acquisition_node(), {"request": request, "motor_result": motor_result}
    )
    assert result.status == Status.BLOCKED
    assert result.gaps == ["SPECIAL_FILE_GAP"]
    assert "SOURCE_SPECIAL_FILE_GAP" in result.output["motor_result"]["items"]["DuckDB"]["error"]


def test_download_extract_preserves_provider_gap():
    request = valid_request()
    motor_result = {
        "verdict": "GAPS_PENDING",
        "gap_code": "MOTOR_PROVIDER_GAP",
        "reason": "canonical provider is not supported by immutable transport",
        "balance": {"total": 1, "failed": 1, "pending": 0},
    }
    result = layer_05_download_extract.run(
        acquisition_node(), {"request": request, "motor_result": motor_result}
    )
    assert result.status == Status.BLOCKED
    assert result.gaps == ["PROVIDER_GAP"]
    assert result.output["motor_result"]["gap_code"] == "MOTOR_PROVIDER_GAP"


def test_download_extract_keeps_generic_gap_when_motor_has_no_typed_reason():
    request = valid_request()
    result = layer_05_download_extract.run(
        acquisition_node(),
        {
            "request": request,
            "motor_result": {
                "verdict": "GAPS_PENDING",
                "balance": {"total": 1, "failed": 1, "pending": 0},
            },
        },
    )
    assert result.status == Status.BLOCKED
    assert result.gaps == ["canonical_motor_download_extract_not_verified"]


def test_download_extract_accepts_only_closed_balance():
    request = valid_request()
    result = layer_05_download_extract.run(
        acquisition_node(),
        {
            "request": request,
            "motor_result": {
                "verdict": "VERIFIED_CLOSED",
                "motor_commit": CANONICAL_MOTOR_COMMIT,
                "tree_sha256": TREE_HASH,
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
            },
        },
    )
    assert result.status == Status.PASS
    assert result.has_real_evidence()


def test_source_evolution_uses_reuse_first_and_fails_without_decision():
    node = NodeContract.build(node_id="N6", layer="L06_SOURCE_EVOLUTION", literal="evolve")
    reused = layer_06_source_evolution.run(node, {"safe_reuse": True, "small_patch": True})
    assert reused.status == Status.PASS
    assert reused.output["decision"] == "REUSE"
    assert reused.has_real_evidence()

    undecided = layer_06_source_evolution.run(node, {})
    assert undecided.status == Status.INCONCLUSIVE
    assert "source_evolution_decision_gap" in undecided.gaps
