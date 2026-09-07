from __future__ import annotations
from collections.abc import Callable
from pathlib import Path
import sys

from .dependencies import OpenTelemetryDependencies
from .runtime import OpenTelemetryRuntime

FACTORY_KEY = "opentelemetry.observability"

class OpenTelemetryBootstrapError(RuntimeError):
    pass

def vendor_root() -> Path:
    return Path(__file__).resolve().parents[3] / "vendor"

def create_opentelemetry_runtime(dependencies: OpenTelemetryDependencies | None = None) -> OpenTelemetryRuntime:
    dependencies = dependencies or OpenTelemetryDependencies()
    if dependencies.get_tracer is not None or dependencies.get_meter is not None:
        if dependencies.get_tracer is None or dependencies.get_meter is None:
            raise ValueError("explicit OpenTelemetry injection requires get_tracer and get_meter")
        return OpenTelemetryRuntime(dependencies.get_tracer, dependencies.get_meter)
    root = vendor_root()
    package_root = root / "opentelemetry"
    if not package_root.is_dir():
        raise OpenTelemetryBootstrapError(f"vendored OpenTelemetry API missing: {package_root}")
    value = str(root)
    if value not in sys.path:
        sys.path.insert(0, value)
    try:
        from opentelemetry import metrics, trace
    except Exception as exc:
        raise OpenTelemetryBootstrapError("unable to import vendored OpenTelemetry API") from exc
    return OpenTelemetryRuntime(trace.get_tracer, metrics.get_meter)

def build_opentelemetry_factories(dependencies: OpenTelemetryDependencies | None = None) -> dict[str, Callable[[], OpenTelemetryRuntime]]:
    return {FACTORY_KEY: lambda: create_opentelemetry_runtime(dependencies)}
