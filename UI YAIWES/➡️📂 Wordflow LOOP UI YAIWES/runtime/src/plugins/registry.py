from __future__ import annotations

from .contract import PluginSpec


class PluginRegistry:
    def __init__(self) -> None:
        self._specs: dict[str, PluginSpec] = {}

    def register(self, spec: PluginSpec) -> None:
        if spec.name in self._specs:
            raise ValueError(f"duplicate plugin: {spec.name}")
        self._specs[spec.name] = spec

    def get(self, name: str) -> PluginSpec:
        try:
            return self._specs[name]
        except KeyError as exc:
            raise KeyError(f"unknown plugin: {name}") from exc

    def all(self) -> tuple[PluginSpec, ...]:
        return tuple(self._specs.values())

    @property
    def workflow_owner(self) -> PluginSpec:
        owners = [spec for spec in self._specs.values() if spec.workflow_owner]
        if len(owners) != 1:
            raise ValueError(f"expected one workflow owner, found {len(owners)}")
        return owners[0]
