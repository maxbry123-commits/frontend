from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Callable


@dataclass(frozen=True, slots=True)
class OpenTelemetryApiDependencies:
    get_tracer: Callable[..., Any] | None = None
    version: str | None = None
