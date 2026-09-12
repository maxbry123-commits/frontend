from __future__ import annotations

from ..contracts import LayerResult, NodeContract


def _safe_path(path: str) -> bool:
    # Repository paths use POSIX separators. Reject traversal before prefix checks.
    return isinstance(path, str) and bool(path) and "\\" not in path and "\x00" not in path and ".." not in path.split("/")


def check(node: NodeContract, result: LayerResult) -> list[str]:
    errors: list[str] = []
    if result.node_id != node.node_id:
        errors.append("node_id_mismatch")
    if result.layer != node.layer:
        errors.append("layer_mismatch")
    if node.allowed_paths:
        outside = [
            path for path in result.touched_paths
            if not _safe_path(path) or not any(
                _safe_path(allowed) and (
                path == allowed or path.startswith(allowed.rstrip("/") + "/")
                )
                for allowed in node.allowed_paths
            )
        ]
        if outside:
            errors.append("path_outside_scope:" + ",".join(outside))
    elif result.touched_paths:
        errors.append("paths_touched_without_allowlist")
    return errors
