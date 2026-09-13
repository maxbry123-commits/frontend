from __future__ import annotations

from dataclasses import dataclass
from enum import IntEnum
from typing import Mapping

from plugins.contract import PluginSpec
from plugins.registry import PluginRegistry


class ResourceSelectionError(RuntimeError):
    pass


class ProvenanceTier(IntEnum):
    OFFICIAL = 0
    EXISTING = 1
    COMMUNITY = 2


@dataclass(frozen=True)
class RankedResource:
    spec: PluginSpec
    provenance: ProvenanceTier


class ResourceBrain:
    """Deterministic capability selector over the existing plugin registry.

    Selection never mounts or enables plugins. The existing activation gate keeps
    authority over runtime activation and stabilize_core keeps workflow ownership.
    """

    def __init__(
        self,
        registry: PluginRegistry,
        provenance_by_name: Mapping[str, ProvenanceTier],
    ) -> None:
        self._registry = registry
        self._provenance = dict(provenance_by_name)

    def select(self, capability: str) -> RankedResource:
        if not capability or capability != capability.strip():
            raise ValueError("capability must be a non-empty canonical string")

        ranked: list[RankedResource] = []
        for spec in self._registry.all():
            if capability not in spec.capabilities:
                continue
            if not spec.valid_identity():
                raise ResourceSelectionError(
                    f"invalid source identity for candidate: {spec.name}"
                )
            try:
                provenance = self._provenance[spec.name]
            except KeyError as exc:
                raise ResourceSelectionError(
                    f"missing provenance for candidate: {spec.name}"
                ) from exc
            if not isinstance(provenance, ProvenanceTier):
                raise ResourceSelectionError(
                    f"invalid provenance for candidate: {spec.name}"
                )
            ranked.append(RankedResource(spec=spec, provenance=provenance))

        if not ranked:
            raise ResourceSelectionError(
                f"no verified resource for capability: {capability}"
            )

        ranked.sort(
            key=lambda candidate: (
                int(candidate.provenance),
                0 if candidate.spec.enabled else 1,
                candidate.spec.name,
            )
        )
        return ranked[0]
