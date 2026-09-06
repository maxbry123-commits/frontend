from __future__ import annotations
from collections.abc import Callable
from typing import Any

class OpenTelemetryRuntime:
    """Read-only telemetry facade. It emits observations but never controls workflow."""
    def __init__(self, get_tracer: Callable[..., Any], get_meter: Callable[..., Any]) -> None:
        self._get_tracer = get_tracer
        self._get_meter = get_meter

    @property
    def healthy(self) -> bool:
        return callable(self._get_tracer) and callable(self._get_meter)

    def tracer(self, name: str, version: str | None = None) -> Any:
        return self._get_tracer(name, version) if version is not None else self._get_tracer(name)

    def meter(self, name: str, version: str | None = None) -> Any:
        return self._get_meter(name, version) if version is not None else self._get_meter(name)
