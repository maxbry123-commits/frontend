from __future__ import annotations

from dataclasses import replace

from .catalog import COMPONENTS
from .registry import PluginRegistry


class ActivationRejectedError(RuntimeError):
    pass


# Only mounts with concrete adapters/factories under runtime/src/plugins are
# approved here. Catalog-only/donor/UI/tool entries remain fail-closed until
# their own wiring is implemented and explicitly tested. big_agi is the first
# UI entry promoted after its deterministic Fables adapter was added.
_ALLOWED_RUNTIME_ACTIVATIONS = {
    "stabilize_core",
    "pydantic",
    "starlette",
    "httpx",
    "rule_engine",
    "big_agi",
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
