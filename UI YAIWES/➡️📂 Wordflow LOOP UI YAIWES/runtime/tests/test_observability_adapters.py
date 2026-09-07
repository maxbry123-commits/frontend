import sys
from pathlib import Path
import unittest

SRC = Path(__file__).resolve().parents[1] / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from plugins.activation import build_runtime_registry
from plugins.loader import PluginLoader
from plugins.opentelemetry_adapter import OpenTelemetryDependencies, build_opentelemetry_factories, create_opentelemetry_runtime
from plugins.structlog_adapter import StructlogDependencies, build_structlog_factories, create_structlog_runtime

class FakeLogger:
    def __init__(self, sink): self.sink = sink
    def info(self, event, **fields):
        self.sink.append((event, fields))
        return fields

class ObservabilityAdapterTests(unittest.TestCase):
    def test_structlog_injection_is_read_only(self):
        sink = []
        runtime = create_structlog_runtime(StructlogDependencies(lambda *a, **k: FakeLogger(sink)))
        runtime.emit("info", "task_seen", task_id="T1")
        self.assertEqual(sink, [("task_seen", {"task_id": "T1"})])
        self.assertTrue(runtime.healthy)
        self.assertFalse(hasattr(runtime, "execute"))

    def test_opentelemetry_injection_is_read_only(self):
        tracers, meters = [], []
        runtime = create_opentelemetry_runtime(OpenTelemetryDependencies(lambda name, *a: tracers.append(name) or ("tracer", name), lambda name, *a: meters.append(name) or ("meter", name)))
        self.assertEqual(runtime.tracer("yaiwes"), ("tracer", "yaiwes"))
        self.assertEqual(runtime.meter("yaiwes"), ("meter", "yaiwes"))
        self.assertTrue(runtime.healthy)
        self.assertFalse(hasattr(runtime, "execute"))

    def test_universal_socket_mounts_only_registered_factories(self):
        registry = build_runtime_registry(("structlog", "opentelemetry_python"))
        factories = {}
        factories.update(build_structlog_factories(StructlogDependencies(lambda *a, **k: FakeLogger([]))))
        factories.update(build_opentelemetry_factories(OpenTelemetryDependencies(lambda name, *a: object(), lambda name, *a: object())))
        loader = PluginLoader(registry, factories)
        self.assertTrue(loader.mount("structlog").healthy)
        self.assertTrue(loader.mount("opentelemetry_python").healthy)
        owners = [spec.name for spec in registry.all() if spec.workflow_owner]
        self.assertEqual(owners, ["stabilize_core"])

    def test_real_vendored_structlog_bootstrap(self):
        self.assertTrue(create_structlog_runtime().healthy)

    def test_real_vendored_opentelemetry_api_bootstrap(self):
        runtime = create_opentelemetry_runtime()
        self.assertTrue(runtime.healthy)
        self.assertIsNotNone(runtime.tracer("yaiwes.p05"))
        self.assertIsNotNone(runtime.meter("yaiwes.p05"))

if __name__ == "__main__":
    unittest.main()
