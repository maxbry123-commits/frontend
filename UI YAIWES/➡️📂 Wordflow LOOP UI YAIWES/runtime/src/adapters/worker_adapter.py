from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Mapping, Protocol, Sequence


STABILIZE_TASK_INTERFACE = "runtime/vendor/stabilize/tasks/interface.py"
STABILIZE_TASK_RESULT = "runtime/vendor/stabilize/tasks/result.py"
STABILIZE_RUN_TASK = "runtime/vendor/stabilize/handlers/run_task/handler.py"


class WorkerAdapterError(RuntimeError):
    pass


class StabilizeTaskRunner(Protocol):
    def __call__(self, task_type: str, payload: Mapping[str, Any]) -> Mapping[str, Any]: ...


@dataclass(frozen=True)
class WorkerTask:
    task_id: str
    task_type: str
    payload: Mapping[str, Any]
    required_evidence: Sequence[str] = ()

    def validate(self) -> None:
        if not self.task_id.strip():
            raise WorkerAdapterError("task_id_required")
        if not self.task_type.strip():
            raise WorkerAdapterError("task_type_required")
        if not isinstance(self.payload, Mapping):
            raise WorkerAdapterError("payload_must_be_mapping")


@dataclass(frozen=True)
class WorkerResult:
    task_id: str
    status: str
    output: Mapping[str, Any]
    evidence: tuple[str, ...]


class YaiwesWorkerAdapter:
    """Thin YAIWES boundary over the existing Stabilize task runtime.

    This object does not own a queue, scheduler, retry loop, persistence layer,
    or recovery engine. All execution is delegated to the injected Stabilize
    runner. The adapter only validates the task/result contract and evidence.
    """

    TERMINAL_SUCCESS = frozenset({"SUCCEEDED", "SUCCESS", "PASS"})

    def __init__(self, runner: StabilizeTaskRunner) -> None:
        if not callable(runner):
            raise WorkerAdapterError("stabilize_runner_required")
        self._runner = runner

    def execute(self, task: WorkerTask) -> WorkerResult:
        task.validate()
        raw = self._runner(task.task_type, dict(task.payload))
        if not isinstance(raw, Mapping):
            raise WorkerAdapterError("worker_result_must_be_mapping")

        status = str(raw.get("status", "")).upper().strip()
        if not status:
            raise WorkerAdapterError("worker_status_required")

        output = raw.get("outputs", raw.get("output", {}))
        if not isinstance(output, Mapping):
            raise WorkerAdapterError("worker_output_must_be_mapping")

        raw_evidence = raw.get("evidence", ())
        if isinstance(raw_evidence, str):
            evidence = (raw_evidence,)
        elif isinstance(raw_evidence, Sequence):
            evidence = tuple(str(item) for item in raw_evidence if str(item).strip())
        else:
            raise WorkerAdapterError("worker_evidence_must_be_sequence")

        if status in self.TERMINAL_SUCCESS:
            missing = tuple(ref for ref in task.required_evidence if ref not in evidence)
            if missing:
                raise WorkerAdapterError("missing_required_evidence:" + ",".join(missing))
            if not evidence:
                raise WorkerAdapterError("success_requires_evidence")

        return WorkerResult(
            task_id=task.task_id,
            status=status,
            output=dict(output),
            evidence=evidence,
        )
