from __future__ import annotations

from dataclasses import dataclass
from typing import Any

EXPECTED_OTEL_SDK_VERSION = "1.45.0.dev"
EXPECTED_OTEL_SEMCONV_VERSION = "0.66b0.dev"


class OpenTelemetrySdkVersionError(RuntimeError):
    pass


@dataclass(frozen=True, slots=True)
class OpenTelemetrySdkRuntime:
    tracer_provider_type: type[Any]
    sdk_version: str
    semantic_conventions_version: str

    @property
    def healthy(self) -> bool:
        return self.sdk_version == EXPECTED_OTEL_SDK_VERSION and self.semantic_conventions_version == EXPECTED_OTEL_SEMCONV_VERSION

    def new_tracer_provider(self, **kwargs: Any) -> Any:
        return self.tracer_provider_type(**kwargs)
