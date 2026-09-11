from __future__ import annotations

from collections.abc import Callable
from typing import Any

from .mount_guard import MountGuard, MountRejectedError
from .registry import PluginRegistry


class PluginLoader:
    def __init__(
        self,
        registry: PluginRegistry,
        factories: dict[str, Callable[[], Any]],
        guard: MountGuard | None = None,
    ) -> None:
        self.registry = registry
        self.factories = factories
        self.guard = guard or MountGuard()

    def mount(self, name: str) -> Any:
        spec = self.registry.get(name)
        self.guard.validate(spec)
        factory = self.factories.get(spec.factory_key)
        if factory is None:
            raise MountRejectedError(f"factory unavailable: {spec.factory_key}")
        return factory()
