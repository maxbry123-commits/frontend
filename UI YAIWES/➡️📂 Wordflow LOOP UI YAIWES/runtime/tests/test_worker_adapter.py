from __future__ import annotations

import sys

import pytest

from adapters.worker_adapter import StabilizeTaskWorkerPort, WorkerAdapter, WorkerTask
from plugins.stabilize_adapter.factory import vendor_root

VENDOR = str(vendor_root())
if VENDOR not in sys.path:
    sys.path.insert(0, VENDOR)

from stabilize.tasks.interface import Task
from stabilize.tasks.result import TaskResult


class FakeStabilizeWorker:
    def __init__(self, result):
        self.result = result
        self.calls = []

    def execute(self, *, task_id, payload):
        self.calls.append((task_id, payload))
        return self.result


class RealStabilizeEchoTask(Task):
    def __init__(self):
        self.calls = []

    def execute(self, stage):
        self.calls.append((stage.id, stage.ref_id, stage.type, dict(stage.context)))
        return TaskResult.success(
            outputs={
                "output": {"echo": stage.context["command"]},
                "evidence_refs": ["stabilize:task-result"],
            }
        )


class RealStabilizeRunningTask(Task):
    def __init__(self):
        self.calls = 0

    def execute(self, stage):
        self.calls += 1
        return TaskResult.running(context={"seen": stage.ref_id})


def test_task_to_worker_to_output_and_evidence():
    worker = FakeStabilizeWorker(
        {"task_id": "t-1", "output": {"ok": True}, "evidence_refs": ["worker:run-7"]}
    )
    adapter = WorkerAdapter(worker)

    result = adapter.execute(
        WorkerTask("t-1", {"command": "build"}, ("task:contract-sha",))
    )

    assert worker.calls == [("t-1", {"command": "build"})]
    assert result.task_id == "t-1"
    assert result.output == {"ok": True}
    assert result.evidence_refs == ("task:contract-sha", "worker:run-7")


def test_real_stabilize_task_is_wired_once_with_stage_context_and_evidence():
    task = RealStabilizeEchoTask()
    adapter = WorkerAdapter(StabilizeTaskWorkerPort(task))

    result = adapter.execute(
        WorkerTask("t-real", {"command": "compile"}, ("task:contract-sha",))
    )

    assert task.calls == [("t-real", "t-real", "yaiwes_worker", {"command": "compile"})]
    assert result.task_id == "t-real"
    assert result.output == {"echo": "compile"}
    assert result.evidence_refs == ("task:contract-sha", "stabilize:task-result")


def test_real_stabilize_nonterminal_success_is_fail_closed_without_retry():
    task = RealStabilizeRunningTask()
    adapter = WorkerAdapter(StabilizeTaskWorkerPort(task))

    with pytest.raises(ValueError, match="did not succeed: RUNNING"):
        adapter.execute(WorkerTask("t-running", {"command": "poll"}, ("task:evidence",)))

    assert task.calls == 1


def test_adapter_deduplicates_evidence_without_scheduling_or_retrying():
    worker = FakeStabilizeWorker(
        {"output": "done", "evidence_refs": ["same", "same", "worker"]}
    )
    result = WorkerAdapter(worker).execute(WorkerTask("t-2", {}, ("same",)))
    assert worker.calls == [("t-2", {})]
    assert result.evidence_refs == ("same", "worker")


@pytest.mark.parametrize(
    "raw, error",
    [
        ({"evidence_refs": ["run"]}, ValueError),
        ({"output": "x", "evidence_refs": []}, ValueError),
        ({"task_id": "other", "output": "x", "evidence_refs": ["run"]}, ValueError),
        ({"output": "x", "evidence_refs": "run"}, TypeError),
        ("not-a-mapping", TypeError),
    ],
)
def test_fail_closed_on_invalid_worker_result(raw, error):
    with pytest.raises(error):
        WorkerAdapter(FakeStabilizeWorker(raw)).execute(WorkerTask("t-3", {}))


def test_task_id_required_before_worker_effect():
    worker = FakeStabilizeWorker({"output": "x", "evidence_refs": ["run"]})
    with pytest.raises(ValueError):
        WorkerTask("   ", {})
    assert worker.calls == []
