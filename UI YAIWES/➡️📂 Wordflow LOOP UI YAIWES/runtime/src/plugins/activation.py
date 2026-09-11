from __future__ import annotations

from dataclasses import replace

from .catalog import COMPONENTS
from .registry import PluginRegistry


class ActivationRejectedError(RuntimeError):
    pass


_ALLOWED_RUNTIME_ACTIVATIONS = {"stabilize_core"}


def build_runtime_registry(enabled_names: list[str] | tuple[str, ...]) -> PluginRegistry:
    requested = set(enabled_names)
    rejected = requested - _ALLOWED_RUNTIME_ACTIVATIONS
    if rejected:
        raise ActivationRejectedError(
            "runtime activation not approved: " + ", ".join(sorted(rejected))
        )

    registry = PluginRegistry()
    for spec in COMPONENTS:
        registry.register(replace(spec, enabled=spec.name in requested))
    return registry
