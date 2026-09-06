from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True, slots=True)
class OpenTelemetrySdkDependencies:
    tracer_provider_type: type[Any] | None = None
    sdk_version: str | None = None
    semantic_conventions_version: str | None = None
