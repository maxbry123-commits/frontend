from __future__ import annotations

from collections import defaultdict

from .contract import PluginSpec


class DuplicatePluginError(ValueError):
    pass


class PluginNotFoundError(KeyError):
    pass


class PluginRegistry:
    def __init__(self) -> None:
        self._by_name: dict[str, PluginSpec] = {}
        self._by_capability: dict[str, set[str]] = defaultdict(set)
        self._workflow_owner: str | None = None

    def register(self, spec: PluginSpec) -> None:
        if spec.name in self._by_name:
            raise DuplicatePluginError(spec.name)
        if spec.workflow_owner:
            if self._workflow_owner is not None:
                raise DuplicatePluginError(
                    f"workflow owner already registered: {self._workflow_owner}"
                )
            self._workflow_owner = spec.name
        self._by_name[spec.name] = spec
        for capability in spec.capabilities:
            self._by_capability[capability].add(spec.name)

    def get(self, name: str) -> PluginSpec:
        try:
            return self._by_name[name]
        except KeyError as exc:
            raise PluginNotFoundError(name) from exc

    def providers(self, capability: str) -> tuple[PluginSpec, ...]:
        names = sorted(self._by_capability.get(capability, ()))
        return tuple(self._by_name[name] for name in names)

    @property
    def workflow_owner(self) -> PluginSpec | None:
        if self._workflow_owner is None:
            return None
        return self._by_name[self._workflow_owner]

    def all(self) -> tuple[PluginSpec, ...]:
        return tuple(self._by_name[name] for name in sorted(self._by_name))
