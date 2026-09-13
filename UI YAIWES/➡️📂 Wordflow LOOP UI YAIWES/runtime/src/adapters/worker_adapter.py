"""YAIWES worker boundary over an injected Stabilize-compatible worker primitive.

This module is deliberately an adapter, not a scheduler.  Selection, retries,
queues and lifecycle ownership remain outside this boundary.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Mapping, Protocol, Sequence


class WorkerPort(Protocol):
    """Minimal port supplied by the canonical worker implementation."""

    def execute(self, *, task_id: str, payload: Mapping[str, Any]) -> Mapping[str, Any]: ...


@dataclass(frozen=True)
class WorkerTask:
    task_id: str
    payload: Mapping[str, Any]
    evidence_refs: tuple[str, ...] = ()

    def __post_init__(self) -> None:
        if not self.task_id.strip():
            raise ValueError("task_id is required")


@dataclass(frozen=True)
class WorkerResult:
    task_id: str
    output: Any
    evidence_refs: tuple[str, ...]


class WorkerAdapter:
    """One-shot task -> canonical worker -> output/evidence adapter."""

    def __init__(self, worker: WorkerPort) -> None:
        self._worker = worker

    def execute(self, task: WorkerTask) -> WorkerResult:
        raw = self._worker.execute(task_id=task.task_id, payload=dict(task.payload))
        if not isinstance(raw, Mapping):
            raise TypeError("worker result must be a mapping")
        if "output" not in raw:
            raise ValueError("worker result missing output")

        worker_refs = raw.get("evidence_refs", ())
        if isinstance(worker_refs, str) or not isinstance(worker_refs, Sequence):
            raise TypeError("worker evidence_refs must be a sequence of strings")
        refs = tuple(worker_refs)
        if any(not isinstance(ref, str) or not ref.strip() for ref in refs):
            raise ValueError("worker evidence_refs must contain non-empty strings")

        combined = tuple(dict.fromkeys((*task.evidence_refs, *refs)))
        if not combined:
            raise ValueError("worker result requires evidence")

        returned_task_id = raw.get("task_id", task.task_id)
        if returned_task_id != task.task_id:
            raise ValueError("worker task_id mismatch")

        return WorkerResult(
            task_id=task.task_id,
            output=raw["output"],
            evidence_refs=combined,
        )
