"""Deterministic task -> phase -> project consolidation.

This module aggregates already-produced task/phase results. It does not schedule,
execute effects, or own workflow state. PASS is fail-closed: every expected child
must be present and pass, identifiers must be unique, and evidence provenance is
preserved through every rollup.
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
        if not self.evidence:
            raise ConsolidationError(f"task {self.task_id!r} requires evidence")
        if self.state == "PASS" and self.gaps:
            raise ConsolidationError(f"passing task {self.task_id!r} cannot carry gaps")
        if self.state == "GAP" and not self.gaps:
            raise ConsolidationError(f"gap task {self.task_id!r} requires explicit gaps")


@dataclass(frozen=True)
class PhaseResult:
    phase_id: str
    state: str
    tasks: tuple[TaskResult, ...]
    expected_task_ids: tuple[str, ...]
    evidence: tuple[EvidenceRef, ...]
    gaps: tuple[str, ...]
    complete: bool

    @property
    def passed(self) -> bool:
        return self.state == "PASS" and self.complete


@dataclass(frozen=True)
class ProjectResult:
    project_id: str
    state: str
    phases: tuple[PhaseResult, ...]
    expected_phase_ids: tuple[str, ...]
    evidence: tuple[EvidenceRef, ...]
    gaps: tuple[str, ...]
    complete: bool

    @property
    def passed(self) -> bool:
        return self.state == "PASS" and self.complete


def _validate_id(label: str, value: str) -> None:
    if not isinstance(value, str) or not value.strip():
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


def _expected_ids(label: str, values: Iterable[str]) -> tuple[str, ...]:
    rows = tuple(values)
    if not rows:
        raise ConsolidationError(f"{label} denominator must be non-empty")
    seen: set[str] = set()
    for value in rows:
        _validate_id(label, value)
        if value in seen:
            raise ConsolidationError(f"duplicate {label}: {value}")
        seen.add(value)
    return rows


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


def consolidate_phase(
    phase_id: str,
    tasks: Iterable[TaskResult],
    *,
    expected_task_ids: Iterable[str],
) -> PhaseResult:
    _validate_id("phase_id", phase_id)
    expected = _expected_ids("expected_task_id", expected_task_ids)
    rows = tuple(tasks)

    expected_set = set(expected)
    seen: set[str] = set()
    for row in rows:
        if not isinstance(row, TaskResult):
            raise ConsolidationError("phase children must be TaskResult")
        row.validate()
        if row.task_id in seen:
            raise ConsolidationError(f"duplicate task: {row.task_id}")
        if row.task_id not in expected_set:
            raise ConsolidationError(f"unexpected task for {phase_id!r}: {row.task_id}")
        seen.add(row.task_id)

    missing = tuple(task_id for task_id in expected if task_id not in seen)
    complete = not missing and len(rows) == len(expected)
    evidence = _dedupe_evidence(item for row in rows for item in row.evidence)
    gaps = _dedupe_strings(
        [item for row in rows for item in row.gaps]
        + [f"missing:task:{task_id}" for task_id in missing]
    )
    state = "PASS" if complete and all(row.state == "PASS" for row in rows) else "GAP"
    if state == "GAP" and not gaps:
        raise ConsolidationError(f"gap phase {phase_id!r} requires explicit gaps")
    return PhaseResult(phase_id, state, rows, expected, evidence, gaps, complete)


def _validate_phase(row: PhaseResult) -> None:
    _validate_id("phase_id", row.phase_id)
    _validate_state(row.state)
    expected = consolidate_phase(
        row.phase_id,
        row.tasks,
        expected_task_ids=row.expected_task_ids,
    )
    if row != expected:
        raise ConsolidationError(f"phase {row.phase_id!r} is not canonically consolidated")


def consolidate_project(
    project_id: str,
    phases: Iterable[PhaseResult],
    *,
    expected_phase_ids: Iterable[str],
) -> ProjectResult:
    _validate_id("project_id", project_id)
    expected = _expected_ids("expected_phase_id", expected_phase_ids)
    rows = tuple(phases)

    expected_set = set(expected)
    seen: set[str] = set()
    for row in rows:
        if not isinstance(row, PhaseResult):
            raise ConsolidationError("project children must be PhaseResult")
        _validate_phase(row)
        if row.phase_id in seen:
            raise ConsolidationError(f"duplicate phase: {row.phase_id}")
        if row.phase_id not in expected_set:
            raise ConsolidationError(f"unexpected phase for {project_id!r}: {row.phase_id}")
        seen.add(row.phase_id)

    missing = tuple(phase_id for phase_id in expected if phase_id not in seen)
    complete = not missing and len(rows) == len(expected)
    evidence = _dedupe_evidence(item for row in rows for item in row.evidence)
    gaps = _dedupe_strings(
        [item for row in rows for item in row.gaps]
        + [f"missing:phase:{phase_id}" for phase_id in missing]
    )
    state = "PASS" if complete and all(row.passed for row in rows) else "GAP"
    if state == "GAP" and not gaps:
        raise ConsolidationError(f"gap project {project_id!r} requires explicit gaps")
    return ProjectResult(project_id, state, rows, expected, evidence, gaps, complete)
