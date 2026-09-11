from __future__ import annotations

import re

from ..contracts import Evidence, LayerResult, NodeContract, Status

CANONICAL_MOTOR_COMMIT = "ef0669bbc753861bfc33b86548f3f90c0f3d8df9"
ALLOWED_OPERATIONS = {"DOWNLOAD_EXTRACT", "EXTRACT_ONLY"}


def _within_allowed_paths(node: NodeContract, path: str) -> bool:
    return bool(path) and any(
        path == allowed or path.startswith(allowed.rstrip("/") + "/")
        for allowed in node.allowed_paths
    )


def _immutable_git_ref(value: str) -> bool:
    return bool(re.fullmatch(r"[0-9a-fA-F]{40}", value))


def _strong_sha256(value: str) -> bool:
    return bool(re.fullmatch(r"[0-9a-fA-F]{64}", value))


def run(node: NodeContract, payload: dict) -> LayerResult:
    request = payload.get("request", {})
    source_repo = str(request.get("source_repo", "")).strip()
    source_ref = str(request.get("source_ref", "")).strip()
    operation = str(request.get("operation", "")).strip()
    dest_repo = str(request.get("dest_repo", "")).strip()
    dest_branch = str(request.get("dest_branch", "")).strip()
    dest_root = str(request.get("dest_root", "")).strip()
    motor_commit = str(request.get("canonical_motor_commit", "")).strip()

    gaps: list[str] = []
    if node.layer != "L05_DOWNLOAD_EXTRACT":
        gaps.append("LAYER_MISMATCH")
    if not source_repo or not _immutable_git_ref(source_ref):
        gaps.append("SOURCE_LOCK_GAP")
    if operation not in ALLOWED_OPERATIONS:
        gaps.append("OPERATION_NOT_ALLOWED")
    if not dest_repo or not dest_branch or not dest_root:
        gaps.append("DESTINATION_INPUT_GAP")
    elif not _within_allowed_paths(node, dest_root):
        gaps.append("DESTINATION_OUTSIDE_ALLOWED_PATHS")
    if not node.authorization:
        gaps.append("AUTHORIZATION_GAP")
    if motor_commit != CANONICAL_MOTOR_COMMIT:
        gaps.append("MOTOR_MISMATCH")

    if gaps:
        return LayerResult(
            node_id=node.node_id,
            layer=node.layer,
            status=Status.BLOCKED,
            output={"request": request},
            gaps=gaps,
        )

    result = payload.get("motor_result", {})
    balance = result.get("balance", {})
    total = int(balance.get("total", 0) or 0)
    tree_hash = str(result.get("tree_sha256", ""))
    destination = str(result.get("destination", ""))
    result_motor_commit = str(result.get("motor_commit", ""))

    verified = (
        result.get("verdict") == "VERIFIED_CLOSED"
        and result_motor_commit == CANONICAL_MOTOR_COMMIT
        and destination == dest_root
        and total > 0
        and balance.get("failed") == 0
        and balance.get("pending") == 0
        and balance.get("extraction_verified") == total
        and balance.get("published_readback_verified") == total
        and _strong_sha256(tree_hash)
    )
    if not verified:
        return LayerResult(
            node_id=node.node_id,
            layer=node.layer,
            status=Status.BLOCKED,
            output={"request": request, "motor_result": result},
            gaps=["canonical_motor_download_extract_not_verified"],
        )

    return LayerResult(
        node_id=node.node_id,
        layer=node.layer,
        status=Status.PASS,
        output={"request": request, "motor_result": result},
        evidence=[Evidence("extracted_tree", destination, tree_hash)],
        actions=list(result.get("actions", ["dispatch_action"])),
        touched_paths=list(result.get("touched_paths", [])),
    )
