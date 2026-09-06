import sys
from pathlib import Path
import unittest

SRC = Path(__file__).resolve().parents[1] / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from plugins.activation import build_runtime_registry
from plugins.loader import PluginLoader
from plugins.opentelemetry_api_adapter import EXPECTED_OTEL_API_VERSION, OpenTelemetryApiDependencies, OpenTelemetryApiVersionError, build_opentelemetry_api_factories, create_opentelemetry_api_runtime
from plugins.opentelemetry_sdk_adapter import EXPECTED_OTEL_SDK_VERSION, EXPECTED_OTEL_SEMCONV_VERSION, OpenTelemetrySdkDependencies, OpenTelemetrySdkVersionError, create_opentelemetry_sdk_runtime
from plugins.structlog_adapter import EXPECTED_STRUCTLOG_SOURCE_COMMIT, StructlogDependencies, StructlogProvenanceError, build_structlog_factories, create_structlog_runtime


class FakeLogger:
    def __init__(self, name=None):
        self.name = name


class FakeTracer:
    def __init__(self, name, version=None):
        self.name = name
        self.version = version


class FakeTracerProvider:
    pass


class ObservabilityAdapterTests(unittest.TestCase):
    def test_structlog_provenance_gate_and_loader(self):
        deps = StructlogDependencies(lambda name=None: FakeLogger(name), EXPECTED_STRUCTLOG_SOURCE_COMMIT)
        runtime = create_structlog_runtime(deps)
        self.assertTrue(runtime.healthy)
        mounted = PluginLoader(build_runtime_registry(["structlog"]), build_structlog_factories(deps)).mount("structlog")
        self.assertEqual(mounted.get_logger("yaiwes").name, "yaiwes")
        with self.assertRaises(StructlogProvenanceError):
            create_structlog_runtime(StructlogDependencies(lambda: FakeLogger(), "0" * 40))

    def test_otel_api_version_gate_and_loader(self):
        deps = OpenTelemetryApiDependencies(lambda name, version=None: FakeTracer(name, version), EXPECTED_OTEL_API_VERSION)
        runtime = create_opentelemetry_api_runtime(deps)
        self.assertTrue(runtime.healthy)
        mounted = PluginLoader(build_runtime_registry(["opentelemetry_python"]), build_opentelemetry_api_factories(deps)).mount("opentelemetry_python")
        self.assertEqual(mounted.get_tracer("yaiwes", "1").name, "yaiwes")
        with self.assertRaises(OpenTelemetryApiVersionError):
            create_opentelemetry_api_runtime(OpenTelemetryApiDependencies(lambda *_: FakeTracer("x"), "0"))

    def test_otel_sdk_is_separate_and_version_gated(self):
        runtime = create_opentelemetry_sdk_runtime(OpenTelemetrySdkDependencies(FakeTracerProvider, EXPECTED_OTEL_SDK_VERSION, EXPECTED_OTEL_SEMCONV_VERSION))
        self.assertTrue(runtime.healthy)
        self.assertIsInstance(runtime.new_tracer_provider(), FakeTracerProvider)
        with self.assertRaises(OpenTelemetrySdkVersionError):
            create_opentelemetry_sdk_runtime(OpenTelemetrySdkDependencies(FakeTracerProvider, "0", EXPECTED_OTEL_SEMCONV_VERSION))


if __name__ == "__main__":
    unittest.main()
