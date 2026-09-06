from __future__ import annotations

from collections.abc import Iterable
from dataclasses import replace

from .catalog import COMPONENTS
from .registry import PluginRegistry


_APPROVED_FACTORY_KEYS: dict[str, str] = {
    "stabilize_core": "stabilize.orchestrator",
}


class ActivationRejectedError(ValueError):
    pass


def build_runtime_registry(enabled_names: Iterable[str] = ()) -> PluginRegistry:
    """Build an explicit runtime registry from the inert component catalog.

    The catalog remains fail-closed. A component can become mountable only when
    its name is present in the local approval map and is explicitly requested.
    """

    requested = frozenset(enabled_names)
    unknown = requested.difference(_APPROVED_FACTORY_KEYS)
    if unknown:
        names = ", ".join(sorted(unknown))
        raise ActivationRejectedError(f"not approved for activation: {names}")

    registry = PluginRegistry()
    for spec in COMPONENTS:
        if spec.name in requested:
            spec = replace(
                spec,
                enabled=True,
                factory_key=_APPROVED_FACTORY_KEYS[spec.name],
            )
        registry.register(spec)
    return registry
