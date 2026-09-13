from __future__ import annotations

import pytest

from adapters.worker_adapter import WorkerAdapter, WorkerTask


class FakeStabilizeWorker:
    def __init__(self, result):
        self.result = result
        self.calls = []

    def execute(self, *, task_id, payload):
        self.calls.append((task_id, payload))
        return self.result


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
