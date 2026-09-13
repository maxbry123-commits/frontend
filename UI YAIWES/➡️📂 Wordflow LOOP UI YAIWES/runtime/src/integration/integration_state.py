from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Callable, Iterable

from plugins.fables import FablesSocket


class IntegrationStateError(RuntimeError):
    pass


@dataclass(frozen=True)
class LaneResult:
    lane: str
    ok: bool
    evidence: tuple[str, ...] = ()
    gaps: tuple[str, ...] = ()

    def validate(self) -> None:
        if not self.lane.strip():
            raise IntegrationStateError("lane must be non-empty")
        if self.ok and not self.evidence:
            raise IntegrationStateError(
                f"passing lane {self.lane!r} requires evidence"
            )
        if not self.ok and not self.gaps:
            raise IntegrationStateError(
                f"failing lane {self.lane!r} requires explicit gaps"
            )


@dataclass(frozen=True)
class GlobalIntegrationState:
    state: str
    lanes: tuple[LaneResult, ...]
    evidence: tuple[str, ...]
    gaps: tuple[str, ...]

    @property
    def passed(self) -> bool:
        return self.state == "PASS"


def _dedupe(values: Iterable[str]) -> tuple[str, ...]:
    return tuple(dict.fromkeys(values))


def consolidate_integration(results: Iterable[LaneResult]) -> GlobalIntegrationState:
    lanes = tuple(results)
    if not lanes:
        raise IntegrationStateError("at least one integration lane is required")

    seen: set[str] = set()
    for lane in lanes:
        lane.validate()
        if lane.lane in seen:
            raise IntegrationStateError(f"duplicate integration lane: {lane.lane}")
        seen.add(lane.lane)

    evidence = _dedupe(item for lane in lanes for item in lane.evidence)
    gaps = _dedupe(item for lane in lanes for item in lane.gaps)
    state = "PASS" if all(lane.ok for lane in lanes) else "GAP"
    return GlobalIntegrationState(state, lanes, evidence, gaps)


class FablesIntegrationBoundary:
    """Consume the existing Fables socket; it never owns orchestration."""

    def __init__(self, socket: FablesSocket) -> None:
        self.socket = socket

    def execute(
        self,
        *,
        plugin: str,
        capability: str,
        lane: str,
        evidence: Iterable[str],
        operation: Callable[[Any], Any],
    ) -> tuple[Any, LaneResult]:
        evidence_tuple = tuple(evidence)
        if not evidence_tuple:
            raise IntegrationStateError(
                f"integration execution {lane!r} requires evidence"
            )

        adapter = self.socket.mount(plugin, capability)
        output = operation(adapter)
        result = LaneResult(lane=lane, ok=True, evidence=evidence_tuple)
        result.validate()
        return output, result
