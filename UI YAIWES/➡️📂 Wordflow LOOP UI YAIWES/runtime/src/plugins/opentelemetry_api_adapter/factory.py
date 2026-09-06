from __future__ import annotations

from collections.abc import Callable
from pathlib import Path
import sys
from typing import Any

from .dependencies import OpenTelemetryApiDependencies
from .runtime import EXPECTED_OTEL_API_VERSION, OpenTelemetryApiRuntime, OpenTelemetryApiVersionError

FACTORY_KEY = "opentelemetry.api"


class OpenTelemetryApiBootstrapError(RuntimeError):
    pass


def vendor_root() -> Path:
    return Path(__file__).resolve().parents[3] / "vendor"


def _is_under(path: str | None, root: Path) -> bool:
    if not path:
        return False
    try:
        Path(path).resolve().relative_to(root.resolve())
        return True
    except ValueError:
        return False


def _resolve_dependencies(dependencies: OpenTelemetryApiDependencies | None) -> tuple[Callable[..., Any], str]:
    dependencies = dependencies or OpenTelemetryApiDependencies()
    if dependencies.get_tracer is not None:
        if dependencies.version is None:
            raise ValueError("explicit OpenTelemetry API injection requires version")
        return dependencies.get_tracer, dependencies.version
    root = vendor_root()
    trace_init = root / "opentelemetry" / "trace" / "__init__.py"
    version_init = root / "opentelemetry" / "version" / "__init__.py"
    if not trace_init.is_file() or not version_init.is_file():
        raise OpenTelemetryApiBootstrapError("vendored OpenTelemetry API is incomplete")
    value = str(root)
    if value not in sys.path:
        sys.path.insert(0, value)
    try:
        from opentelemetry import trace
        from opentelemetry.version import __version__
    except Exception as exc:
        raise OpenTelemetryApiBootstrapError("unable to import vendored OpenTelemetry API") from exc
    if not _is_under(getattr(trace, "__file__", None), root):
        raise OpenTelemetryApiBootstrapError("OpenTelemetry API resolved outside vendored root")
    return trace.get_tracer, __version__


def create_opentelemetry_api_runtime(dependencies: OpenTelemetryApiDependencies | None = None) -> OpenTelemetryApiRuntime:
    get_tracer, version = _resolve_dependencies(dependencies)
    if version != EXPECTED_OTEL_API_VERSION:
        raise OpenTelemetryApiVersionError(f"expected OpenTelemetry API {EXPECTED_OTEL_API_VERSION}, got {version}")
    return OpenTelemetryApiRuntime(get_tracer, version)


def build_opentelemetry_api_factory(dependencies: OpenTelemetryApiDependencies | None = None) -> Callable[[], OpenTelemetryApiRuntime]:
    return lambda: create_opentelemetry_api_runtime(dependencies)


def build_opentelemetry_api_factories(dependencies: OpenTelemetryApiDependencies | None = None) -> dict[str, Callable[[], OpenTelemetryApiRuntime]]:
    return {FACTORY_KEY: build_opentelemetry_api_factory(dependencies)}
