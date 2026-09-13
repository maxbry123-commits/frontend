"""YAIWES worker boundary over the canonical Stabilize task primitive.

This module is deliberately an adapter, not a scheduler. Selection, retries,
queues and lifecycle ownership remain outside this boundary.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Mapping, Protocol, Sequence


class WorkerPort(Protocol):
    """Minimal one-shot port consumed by :class:`WorkerAdapter`."""

    def execute(self, *, task_id: str, payload: Mapping[str, Any]) -> Mapping[str, Any]: ...


class StabilizeTaskPort(Protocol):
    """Structural view of the vendored ``stabilize.tasks.interface.Task``."""

    def execute(self, stage: Any) -> Any: ...


class StabilizeTaskWorkerPort:
    """Translate one YAIWES worker call to one canonical Stabilize ``Task``.

    The adapter intentionally does not own scheduling, retries, queueing or
    lifecycle. Stabilize remains the workflow owner; this shim only constructs
    the stage-shaped input expected by the vendored Task interface and converts
    a successful TaskResult into the narrow WorkerPort result contract.
    """

    def __init__(self, task: StabilizeTaskPort) -> None:
        if not callable(getattr(task, "execute", None)):
            raise TypeError("stabilize task must expose execute(stage)")
        self._task = task

    @staticmethod
    def _stage_type() -> type:
        import sys

        from plugins.stabilize_adapter.factory import vendor_root

        root = vendor_root()
        if str(root) not in sys.path:
            sys.path.insert(0, str(root))
        from stabilize.models.stage import StageExecution

        return StageExecution

    def execute(self, *, task_id: str, payload: Mapping[str, Any]) -> Mapping[str, Any]:
        StageExecution = self._stage_type()
        # Pass explicit identifiers so this boundary does not generate workflow
        # identity or take lifecycle ownership from Stabilize.
        stage = StageExecution(
            id=task_id,
            ref_id=task_id,
            type="yaiwes_worker",
            name=task_id,
            context=dict(payload),
        )
        result = self._task.execute(stage)
        status_name = getattr(getattr(result, "status", None), "name", None)
        if status_name != "SUCCEEDED":
            raise ValueError(f"stabilize task did not succeed: {status_name or 'UNKNOWN'}")

        outputs = getattr(result, "outputs", None)
        if not isinstance(outputs, Mapping):
            raise TypeError("stabilize task outputs must be a mapping")
        if "output" not in outputs:
            raise ValueError("stabilize task outputs missing output")

        return {
            "task_id": task_id,
            "output": outputs["output"],
            "evidence_refs": outputs.get("evidence_refs", ()),
        }


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
