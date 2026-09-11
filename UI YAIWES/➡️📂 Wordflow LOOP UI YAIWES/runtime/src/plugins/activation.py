from __future__ import annotations

from dataclasses import replace

from .catalog import COMPONENTS
from .contract import PluginKind
from .registry import PluginRegistry


class ActivationRejectedError(RuntimeError):
    pass


# Runtime may activate the single CORE owner plus auxiliary adapters.
# Donor schedulers, UI bundles and test tools stay inert unless a separate
# explicit policy authorizes them. This preserves Stabilize as the only
# workflow owner while allowing typed contracts/rules/transports to mount.
_ALLOWED_RUNTIME_KINDS = {PluginKind.CORE, PluginKind.ADAPTER}
_ALLOWED_RUNTIME_ACTIVATIONS = {
    spec.name for spec in COMPONENTS if spec.kind in _ALLOWED_RUNTIME_KINDS
}


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
