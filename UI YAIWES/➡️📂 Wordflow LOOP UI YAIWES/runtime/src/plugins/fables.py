from __future__ import annotations

from collections.abc import Callable, Mapping
from typing import Any

from .loader import PluginLoader
from .mount_guard import MountGuard
from .registry import PluginRegistry

FABLES_CONTRACT = "yaiwes.fables.v1"


class FablesContractError(RuntimeError):
    pass


class FablesSocket:
    """Project-level Fables contract over the existing universal plugin socket.

    This adapter does not replace registry, guard or loader. It requires an
    explicit plugin identity plus an explicit capability before delegating the
    actual mount to the existing fail-closed PluginLoader.
    """

    contract = FABLES_CONTRACT

    def __init__(
        self,
        registry: PluginRegistry,
        factories: Mapping[str, Callable[[], Any]],
        guard: MountGuard | None = None,
    ) -> None:
        self._registry = registry
        self._loader = PluginLoader(registry, factories, guard=guard)

    def mount(self, plugin_name: str, required_capability: str) -> Any:
        if not plugin_name or not required_capability:
            raise FablesContractError("plugin_name and required_capability are required")
        spec = self._registry.get(plugin_name)
        if required_capability not in spec.capabilities:
            raise FablesContractError(
                f"{plugin_name}: capability not declared: {required_capability}"
            )
        return self._loader.mount(plugin_name)
