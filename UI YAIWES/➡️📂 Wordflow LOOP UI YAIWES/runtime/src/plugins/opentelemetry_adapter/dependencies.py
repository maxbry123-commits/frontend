from __future__ import annotations
from dataclasses import dataclass
from typing import Any, Callable

@dataclass(frozen=True, slots=True)
class OpenTelemetryDependencies:
    get_tracer: Callable[..., Any] | None = None
    get_meter: Callable[..., Any] | None = None
