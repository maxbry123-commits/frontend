from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Callable

EXPECTED_OTEL_API_VERSION = "1.45.0.dev"


class OpenTelemetryApiVersionError(RuntimeError):
    pass


@dataclass(frozen=True, slots=True)
class OpenTelemetryApiRuntime:
    get_tracer_fn: Callable[..., Any]
    version: str

    @property
    def healthy(self) -> bool:
        return self.version == EXPECTED_OTEL_API_VERSION

    def get_tracer(self, name: str, version: str | None = None) -> Any:
        return self.get_tracer_fn(name, version)
