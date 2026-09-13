from __future__ import annotations

from typing import Any

from ..contracts import LayerResult, NodeContract


def _safe_path(path: str) -> bool:
    # Repository paths use POSIX separators. Reject traversal before prefix checks.
    return isinstance(path, str) and bool(path) and "\\" not in path and "\x00" not in path and ".." not in path.split("/")


def _within_allowed_paths(path: str, allowed_paths: tuple[str, ...]) -> bool:
    return _safe_path(path) and any(
        _safe_path(allowed)
        and (path == allowed or path.startswith(allowed.rstrip("/") + "/"))
        for allowed in allowed_paths
    )


def check_before_effects(node: NodeContract, payload: dict[str, Any]) -> list[str]:
    """Fail closed before any mutating handler can execute.

    Mutating nodes must provide an explicit effect_plan so Supervisor can verify
    the intended actions and paths against the frozen NodeContract before the
    layer handler receives control.
    """
    if not node.mutation:
        return []

    plan = payload.get("effect_plan")
    if not isinstance(plan, dict):
        return ["missing_pre_effect_plan"]

    actions = plan.get("actions")
    paths = plan.get("paths")
    if not isinstance(actions, (list, tuple)) or not actions:
        return ["invalid_pre_effect_actions"]
    if not isinstance(paths, (list, tuple)) or not paths:
        return ["invalid_pre_effect_paths"]

    errors: list[str] = []
    denied_actions = [
        str(action)
        for action in actions
        if action not in node.allowed_actions or action in node.forbidden_actions
    ]
    if denied_actions:
        errors.append("pre_effect_action_outside_scope:" + ",".join(denied_actions))

    denied_paths = [
        str(path)
        for path in paths
        if not isinstance(path, str) or not _within_allowed_paths(path, node.allowed_paths)
    ]
    if denied_paths:
        errors.append("pre_effect_path_outside_scope:" + ",".join(denied_paths))
    return errors


def check(node: NodeContract, result: LayerResult) -> list[str]:
    errors: list[str] = []
    if result.node_id != node.node_id:
        errors.append("node_id_mismatch")
    if result.layer != node.layer:
        errors.append("layer_mismatch")

    denied_actions = [
        action
        for action in result.actions
        if action not in node.allowed_actions or action in node.forbidden_actions
    ]
    if denied_actions:
        errors.append("action_outside_scope:" + ",".join(denied_actions))

    if node.allowed_paths:
        outside = [
            path for path in result.touched_paths
            if not _within_allowed_paths(path, node.allowed_paths)
        ]
        if outside:
            errors.append("path_outside_scope:" + ",".join(outside))
    elif result.touched_paths:
        errors.append("paths_touched_without_allowlist")
    return errors
