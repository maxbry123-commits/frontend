from __future__ import annotations

from collections.abc import Callable
from pathlib import Path
import sys
from typing import Any

from .dependencies import OpenTelemetrySdkDependencies
from .runtime import EXPECTED_OTEL_SDK_VERSION, EXPECTED_OTEL_SEMCONV_VERSION, OpenTelemetrySdkRuntime, OpenTelemetrySdkVersionError

FACTORY_KEY = "opentelemetry.sdk"


class OpenTelemetrySdkBootstrapError(RuntimeError):
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


def _resolve_dependencies(dependencies: OpenTelemetrySdkDependencies | None) -> tuple[type[Any], str, str]:
    dependencies = dependencies or OpenTelemetrySdkDependencies()
    if dependencies.tracer_provider_type is not None:
        if dependencies.sdk_version is None or dependencies.semantic_conventions_version is None:
            raise ValueError("explicit OpenTelemetry SDK injection requires both versions")
        return dependencies.tracer_provider_type, dependencies.sdk_version, dependencies.semantic_conventions_version
    root = vendor_root()
    sdk_init = root / "opentelemetry" / "sdk" / "trace" / "__init__.py"
    semconv_init = root / "opentelemetry" / "semconv" / "version" / "__init__.py"
    if not sdk_init.is_file() or not semconv_init.is_file():
        raise OpenTelemetrySdkBootstrapError("vendored OpenTelemetry SDK/semconv is incomplete")
    value = str(root)
    if value not in sys.path:
        sys.path.insert(0, value)
    try:
        from opentelemetry.sdk import trace as sdk_trace
        from opentelemetry.sdk.version import __version__ as sdk_version
        from opentelemetry.semconv.version import __version__ as semconv_version
    except Exception as exc:
        raise OpenTelemetrySdkBootstrapError("unable to import vendored OpenTelemetry SDK") from exc
    if not _is_under(getattr(sdk_trace, "__file__", None), root):
        raise OpenTelemetrySdkBootstrapError("OpenTelemetry SDK resolved outside vendored root")
    return sdk_trace.TracerProvider, sdk_version, semconv_version


def create_opentelemetry_sdk_runtime(dependencies: OpenTelemetrySdkDependencies | None = None) -> OpenTelemetrySdkRuntime:
    provider_type, sdk_version, semconv_version = _resolve_dependencies(dependencies)
    if sdk_version != EXPECTED_OTEL_SDK_VERSION or semconv_version != EXPECTED_OTEL_SEMCONV_VERSION:
        raise OpenTelemetrySdkVersionError(f"expected OpenTelemetry SDK/semconv {EXPECTED_OTEL_SDK_VERSION}/{EXPECTED_OTEL_SEMCONV_VERSION}, got {sdk_version}/{semconv_version}")
    return OpenTelemetrySdkRuntime(provider_type, sdk_version, semconv_version)


def build_opentelemetry_sdk_factory(dependencies: OpenTelemetrySdkDependencies | None = None) -> Callable[[], OpenTelemetrySdkRuntime]:
    return lambda: create_opentelemetry_sdk_runtime(dependencies)


def build_opentelemetry_sdk_factories(dependencies: OpenTelemetrySdkDependencies | None = None) -> dict[str, Callable[[], OpenTelemetrySdkRuntime]]:
    return {FACTORY_KEY: build_opentelemetry_sdk_factory(dependencies)}
