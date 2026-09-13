"""Deterministic continuous-loop repair boundary for N27.

This module is not a scheduler or workflow owner. It consumes an ordered stage list
and injected stage/audit callbacks, reinjecting only explicit failed stages with a
bounded StrategyDelta until PASS or a fail-closed terminal GAP.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Callable, Mapping, Sequence

from integration.integration_state import LaneResult


class ContinuousLoopError(RuntimeError):
    pass


@dataclass(frozen=True)
class StrategyDelta:
    stage: str
    attempt: int
    gap: str
    action: str
    evidence: tuple[str, ...]

    def validate(self) -> None:
        if not self.stage.strip() or self.attempt < 1:
            raise ContinuousLoopError("invalid_strategy_delta_identity")
        if not self.gap.strip() or not self.action.strip():
            raise ContinuousLoopError("strategy_delta_gap_action_required")
        if not self.evidence or any(not item.strip() for item in self.evidence):
            raise ContinuousLoopError("strategy_delta_evidence_required")


@dataclass(frozen=True)
class LoopEvent:
    sequence: int
    stage: str
    attempt: int
    state: str
    evidence: tuple[str, ...]
    gaps: tuple[str, ...] = ()
    strategy_delta: StrategyDelta | None = None


@dataclass(frozen=True)
class ContinuousLoopResult:
    state: str
    events: tuple[LoopEvent, ...]
    stage_attempts: Mapping[str, int]
    evidence: tuple[str, ...]
    gaps: tuple[str, ...]

    @property
    def passed(self) -> bool:
        return self.state == "PASS"


StageRunner = Callable[[str, int, StrategyDelta | None], LaneResult]
AuditResult = Callable[[str, LaneResult], LaneResult]
RepairPlanner = Callable[[str, int, LaneResult], StrategyDelta]


def _dedupe(values: Sequence[str]) -> tuple[str, ...]:
    return tuple(dict.fromkeys(values))


def run_continuous_loop(
    stages: Sequence[str],
    *,
    run_stage: StageRunner,
    audit_result: AuditResult,
    plan_repair: RepairPlanner,
    max_attempts_per_stage: int = 3,
) -> ContinuousLoopResult:
    """Run ordered stages and reinject only audited GAP stages.

    Each stage result is audited before state advances. A GAP must produce a valid
    StrategyDelta carrying evidence. The same stage is then reinjected with the
    delta; later stages cannot run until it passes. No hidden retry or scheduling
    occurs. Exhaustion returns explicit GAP instead of claiming closure.
    """
    ordered = tuple(str(stage).strip() for stage in stages)
    if not ordered or any(not stage for stage in ordered):
        raise ContinuousLoopError("non_empty_stages_required")
    if len(set(ordered)) != len(ordered):
        raise ContinuousLoopError("duplicate_stage")
    if max_attempts_per_stage < 1:
        raise ContinuousLoopError("max_attempts_positive")

    events: list[LoopEvent] = []
    attempts: dict[str, int] = {stage: 0 for stage in ordered}
    evidence: list[str] = []
    terminal_gaps: list[str] = []

    for stage in ordered:
        delta: StrategyDelta | None = None
        while attempts[stage] < max_attempts_per_stage:
            attempts[stage] += 1
            attempt = attempts[stage]
            raw = run_stage(stage, attempt, delta)
            if not isinstance(raw, LaneResult):
                raise ContinuousLoopError("stage_runner_must_return_lane_result")
            raw.validate()
            audited = audit_result(stage, raw)
            if not isinstance(audited, LaneResult):
                raise ContinuousLoopError("audit_must_return_lane_result")
            audited.validate()
            if audited.lane != raw.lane:
                raise ContinuousLoopError("audit_lane_identity_mismatch")

            evidence.extend(audited.evidence)
            if audited.ok:
                events.append(
                    LoopEvent(
                        sequence=len(events) + 1,
                        stage=stage,
                        attempt=attempt,
                        state="PASS",
                        evidence=audited.evidence,
                    )
                )
                delta = None
                break

            if len(audited.gaps) != 1:
                raise ContinuousLoopError("exactly_one_gap_required_per_repair_iteration")
            delta = plan_repair(stage, attempt, audited)
            if not isinstance(delta, StrategyDelta):
                raise ContinuousLoopError("repair_planner_must_return_strategy_delta")
            delta.validate()
            if delta.stage != stage or delta.attempt != attempt or delta.gap != audited.gaps[0]:
                raise ContinuousLoopError("strategy_delta_not_bound_to_failed_attempt")

            events.append(
                LoopEvent(
                    sequence=len(events) + 1,
                    stage=stage,
                    attempt=attempt,
                    state="GAP_REINJECT",
                    evidence=_dedupe((*audited.evidence, *delta.evidence)),
                    gaps=audited.gaps,
                    strategy_delta=delta,
                )
            )
            evidence.extend(delta.evidence)
        else:
            terminal_gaps.append(f"{stage}:max_attempts_exhausted")

        if delta is not None:
            terminal_gaps.append(f"{stage}:unresolved:{delta.gap}")
            return ContinuousLoopResult(
                "GAP",
                tuple(events),
                dict(attempts),
                _dedupe(tuple(evidence)),
                _dedupe(tuple(terminal_gaps)),
            )

    return ContinuousLoopResult(
        "PASS",
        tuple(events),
        dict(attempts),
        _dedupe(tuple(evidence)),
        (),
    )
