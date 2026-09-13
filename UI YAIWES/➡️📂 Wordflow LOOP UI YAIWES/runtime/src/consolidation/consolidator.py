"""Deterministic task -> phase -> project consolidation.

This module aggregates already-produced task/phase results. It does not schedule,
execute effects, or own workflow state. PASS is fail-closed: every child must
pass, identifiers must be unique, and passing children must carry evidence.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable


class ConsolidationError(ValueError):
    pass


@dataclass(frozen=True, order=True)
class EvidenceRef:
    kind: str
    ref: str
    provenance: str

    def validate(self) -> None:
        if not self.kind.strip():
            raise ConsolidationError("evidence kind must be non-empty")
        if not self.ref.strip():
            raise ConsolidationError("evidence ref must be non-empty")
        if not self.provenance.strip():
            raise ConsolidationError("evidence provenance must be non-empty")


@dataclass(frozen=True)
class TaskResult:
    task_id: str
    state: str
    evidence: tuple[EvidenceRef, ...] = ()
    gaps: tuple[str, ...] = ()

    def validate(self) -> None:
        _validate_id("task_id", self.task_id)
        _validate_state(self.state)
        _validate_evidence(self.evidence)
        _validate_gaps(self.gaps)
        if self.state == "PASS":
            if not self.evidence:
                raise ConsolidationError(f"passing task {self.task_id!r} requires evidence")
            if self.gaps:
                raise ConsolidationError(f"passing task {self.task_id!r} cannot carry gaps")
        elif not self.gaps:
            raise ConsolidationError(f"gap task {self.task_id!r} requires explicit gaps")


@dataclass(frozen=True)
class PhaseResult:
    phase_id: str
    state: str
    tasks: tuple[TaskResult, ...]
    evidence: tuple[EvidenceRef, ...]
    gaps: tuple[str, ...]

    @property
    def passed(self) -> bool:
        return self.state == "PASS"


@dataclass(frozen=True)
class ProjectResult:
    project_id: str
    state: str
    phases: tuple[PhaseResult, ...]
    evidence: tuple[EvidenceRef, ...]
    gaps: tuple[str, ...]

    @property
    def passed(self) -> bool:
        return self.state == "PASS"


def _validate_id(label: str, value: str) -> None:
    if not value.strip():
        raise ConsolidationError(f"{label} must be non-empty")


def _validate_state(state: str) -> None:
    if state not in {"PASS", "GAP"}:
        raise ConsolidationError(f"unsupported state: {state}")


def _validate_evidence(items: Iterable[EvidenceRef]) -> None:
    for item in items:
        if not isinstance(item, EvidenceRef):
            raise ConsolidationError("evidence entries must be EvidenceRef")
        item.validate()


def _validate_gaps(gaps: Iterable[str]) -> None:
    for gap in gaps:
        if not isinstance(gap, str) or not gap.strip():
            raise ConsolidationError("gaps must be non-empty strings")


def _dedupe_evidence(items: Iterable[EvidenceRef]) -> tuple[EvidenceRef, ...]:
    ordered: list[EvidenceRef] = []
    seen: set[EvidenceRef] = set()
    for item in items:
        item.validate()
        if item not in seen:
            ordered.append(item)
            seen.add(item)
    return tuple(ordered)


def _dedupe_strings(items: Iterable[str]) -> tuple[str, ...]:
    ordered: list[str] = []
    seen: set[str] = set()
    for item in items:
        if item not in seen:
            ordered.append(item)
            seen.add(item)
    return tuple(ordered)


def consolidate_phase(phase_id: str, tasks: Iterable[TaskResult]) -> PhaseResult:
    _validate_id("phase_id", phase_id)
    rows = tuple(tasks)
    if not rows:
        raise ConsolidationError("phase requires at least one task")

    seen: set[str] = set()
    for row in rows:
        if not isinstance(row, TaskResult):
            raise ConsolidationError("phase children must be TaskResult")
        row.validate()
        if row.task_id in seen:
            raise ConsolidationError(f"duplicate task: {row.task_id}")
        seen.add(row.task_id)

    state = "PASS" if all(row.state == "PASS" for row in rows) else "GAP"
    evidence = _dedupe_evidence(item for row in rows for item in row.evidence)
    gaps = _dedupe_strings(item for row in rows for item in row.gaps)
    return PhaseResult(phase_id, state, rows, evidence, gaps)


def _validate_phase(row: PhaseResult) -> None:
    _validate_id("phase_id", row.phase_id)
    _validate_state(row.state)
    if not row.tasks:
        raise ConsolidationError(f"phase {row.phase_id!r} requires tasks")
    expected = consolidate_phase(row.phase_id, row.tasks)
    if row.state != expected.state or row.evidence != expected.evidence or row.gaps != expected.gaps:
        raise ConsolidationError(f"phase {row.phase_id!r} is not canonically consolidated")


def consolidate_project(project_id: str, phases: Iterable[PhaseResult]) -> ProjectResult:
    _validate_id("project_id", project_id)
    rows = tuple(phases)
    if not rows:
        raise ConsolidationError("project requires at least one phase")

    seen: set[str] = set()
    for row in rows:
        if not isinstance(row, PhaseResult):
            raise ConsolidationError("project children must be PhaseResult")
        _validate_phase(row)
        if row.phase_id in seen:
            raise ConsolidationError(f"duplicate phase: {row.phase_id}")
        seen.add(row.phase_id)

    state = "PASS" if all(row.state == "PASS" for row in rows) else "GAP"
    evidence = _dedupe_evidence(item for row in rows for item in row.evidence)
    gaps = _dedupe_strings(item for row in rows for item in row.gaps)
    return ProjectResult(project_id, state, rows, evidence, gaps)
