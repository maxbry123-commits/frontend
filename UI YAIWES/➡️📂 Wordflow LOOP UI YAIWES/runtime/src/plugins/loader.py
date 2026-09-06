from __future__ import annotations

from collections.abc import Callable, Mapping
from typing import Any

from .mount_guard import MountGuard
from .registry import PluginRegistry


class PluginFactoryNotFoundError(KeyError):
    pass


class PluginLoader:
    """Mount only pre-registered factories; arbitrary import strings are forbidden."""

    def __init__(
        self,
        registry: PluginRegistry,
        factories: Mapping[str, Callable[[], Any]],
        guard: MountGuard | None = None,
    ) -> None:
        self._registry = registry
        self._factories = dict(factories)
        self._guard = guard or MountGuard()

    def mount(self, name: str) -> Any:
        spec = self._registry.get(name)
        self._guard.validate(spec)
        assert spec.factory_key is not None
        try:
            factory = self._factories[spec.factory_key]
        except KeyError as exc:
            raise PluginFactoryNotFoundError(spec.factory_key) from exc
        return factory()
