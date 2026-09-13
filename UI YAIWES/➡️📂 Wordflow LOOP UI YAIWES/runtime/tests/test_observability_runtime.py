import sys
from pathlib import Path
import unittest

SRC = Path(__file__).resolve().parents[1] / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from observability import (
    OpenTelemetrySink,
    RuntimeTelemetry,
    TelemetryConfigurationError,
)


class FakeSpan:
    def __init__(self, name):
        self.name = name
        self.attributes = {}

    def __enter__(self):
        return self

    def __exit__(self, *args):
        return False

    def set_attribute(self, key, value):
        self.attributes[key] = value


class FakeTracer:
    def __init__(self):
        self.spans = []

    def start_as_current_span(self, name):
        span = FakeSpan(name)
        self.spans.append(span)
        return span


class ObservabilityRuntimeTests(unittest.TestCase):
    def test_task_evidence_recovery_share_one_correlation_id(self):
        tracer = FakeTracer()
        telemetry = RuntimeTelemetry(OpenTelemetrySink(tracer))
        context = telemetry.context("workflow-1", "task-7")

        telemetry.task_started(context)
        telemetry.evidence_recorded(context, "evidence-9")
        telemetry.recovery_completed(context, "recovery-3")

        self.assertEqual(
            [span.name for span in tracer.spans],
            [
                "yaiwes.task.started",
                "yaiwes.evidence.recorded",
                "yaiwes.recovery.completed",
            ],
        )
        correlation_ids = {
            span.attributes["yaiwes.correlation_id"] for span in tracer.spans
        }
        self.assertEqual(correlation_ids, {context.correlation_id})
        self.assertEqual(
            tracer.spans[1].attributes["yaiwes.evidence_id"], "evidence-9"
        )
        self.assertEqual(
            tracer.spans[2].attributes["yaiwes.recovery_id"], "recovery-3"
        )

    def test_context_is_deterministic_and_task_scoped(self):
        tracer = FakeTracer()
        telemetry = RuntimeTelemetry(OpenTelemetrySink(tracer))
        a = telemetry.context("workflow-1", "task-1")
        b = telemetry.context("workflow-1", "task-1")
        c = telemetry.context("workflow-1", "task-2")
        self.assertEqual(a.correlation_id, b.correlation_id)
        self.assertNotEqual(a.correlation_id, c.correlation_id)

    def test_invalid_tracer_fails_closed(self):
        with self.assertRaises(TelemetryConfigurationError):
            OpenTelemetrySink(object())

    def test_invalid_span_fails_closed(self):
        class BadSpan:
            def __enter__(self): return self
            def __exit__(self, *args): return False

        class BadTracer:
            def start_as_current_span(self, name): return BadSpan()

        telemetry = RuntimeTelemetry(OpenTelemetrySink(BadTracer()))
        context = telemetry.context("workflow-1", "task-1")
        with self.assertRaises(TelemetryConfigurationError):
            telemetry.task_started(context)


if __name__ == "__main__":
    unittest.main()
