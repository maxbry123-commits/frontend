from __future__ import annotations

from collections.abc import Callable
from typing import Any

from .loader import PluginLoader
from .registry import PluginRegistry

FABLES_CONTRACT = "yaiwes.fables.v1"


class FablesContractError(RuntimeError):
    pass


class FablesSocket:
    contract = FABLES_CONTRACT

    def __init__(
        self,
        registry: PluginRegistry,
        factories: dict[str, Callable[[], Any]],
    ) -> None:
        self.registry = registry
        self.loader = PluginLoader(registry, factories)

    def mount(self, name: str, capability: str) -> Any:
        spec = self.registry.get(name)
        if capability not in spec.capabilities:
            raise FablesContractError(
                f"{name} does not declare capability {capability}"
            )
        return self.loader.mount(name)
