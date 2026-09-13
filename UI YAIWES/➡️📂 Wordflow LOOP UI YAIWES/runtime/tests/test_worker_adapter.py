import sys
from pathlib import Path
import unittest

SRC = Path(__file__).resolve().parents[1] / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from adapters.worker_adapter import (
    STABILIZE_RUN_TASK,
    STABILIZE_TASK_INTERFACE,
    STABILIZE_TASK_RESULT,
    WorkerAdapterError,
    WorkerTask,
    YaiwesWorkerAdapter,
)


class WorkerAdapterTests(unittest.TestCase):
    def test_declares_existing_stabilize_primitives(self):
        self.assertEqual(STABILIZE_TASK_INTERFACE, "runtime/vendor/stabilize/tasks/interface.py")
        self.assertEqual(STABILIZE_TASK_RESULT, "runtime/vendor/stabilize/tasks/result.py")
        self.assertEqual(STABILIZE_RUN_TASK, "runtime/vendor/stabilize/handlers/run_task/handler.py")

    def test_task_to_worker_to_output_and_evidence(self):
        calls = []

        def runner(task_type, payload):
            calls.append((task_type, payload))
            return {
                "status": "SUCCEEDED",
                "outputs": {"answer": 42},
                "evidence": ["run:123", "sha:abc"],
            }

        adapter = YaiwesWorkerAdapter(runner)
        result = adapter.execute(
            WorkerTask(
                task_id="T-1",
                task_type="python",
                payload={"x": 1},
                required_evidence=("run:123", "sha:abc"),
            )
        )

        self.assertEqual(calls, [("python", {"x": 1})])
        self.assertEqual(result.status, "SUCCEEDED")
        self.assertEqual(result.output, {"answer": 42})
        self.assertEqual(result.evidence, ("run:123", "sha:abc"))

    def test_success_without_evidence_fails_closed(self):
        adapter = YaiwesWorkerAdapter(lambda *_: {"status": "SUCCEEDED", "outputs": {}})
        with self.assertRaisesRegex(WorkerAdapterError, "success_requires_evidence"):
            adapter.execute(WorkerTask("T-2", "shell", {}))

    def test_required_evidence_must_be_present(self):
        adapter = YaiwesWorkerAdapter(
            lambda *_: {"status": "PASS", "output": {}, "evidence": ["run:1"]}
        )
        with self.assertRaisesRegex(WorkerAdapterError, "missing_required_evidence:sha:2"):
            adapter.execute(
                WorkerTask(
                    "T-3",
                    "http",
                    {},
                    required_evidence=("run:1", "sha:2"),
                )
            )

    def test_invalid_result_shape_fails_closed(self):
        adapter = YaiwesWorkerAdapter(lambda *_: "bad-result")
        with self.assertRaisesRegex(WorkerAdapterError, "worker_result_must_be_mapping"):
            adapter.execute(WorkerTask("T-4", "python", {}))

    def test_non_success_status_preserves_gap_evidence(self):
        adapter = YaiwesWorkerAdapter(
            lambda *_: {
                "status": "GAP",
                "outputs": {"retryable": True},
                "evidence": ["gap:backend-unavailable"],
            }
        )
        result = adapter.execute(WorkerTask("T-5", "ssh", {}))
        self.assertEqual(result.status, "GAP")
        self.assertEqual(result.output, {"retryable": True})
        self.assertEqual(result.evidence, ("gap:backend-unavailable",))

    def test_adapter_does_not_expose_scheduler_or_queue_ownership(self):
        adapter = YaiwesWorkerAdapter(lambda *_: {"status": "GAP", "evidence": ["gap:x"]})
        self.assertFalse(hasattr(adapter, "schedule"))
        self.assertFalse(hasattr(adapter, "enqueue"))
        self.assertFalse(hasattr(adapter, "retry_loop"))


if __name__ == "__main__":
    unittest.main()
