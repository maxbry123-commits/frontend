from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Callable

EXPECTED_STRUCTLOG_SOURCE_COMMIT = "73393f34b40c15688b3fdd0982889b225f11b59b"


class StructlogProvenanceError(RuntimeError):
    pass


@dataclass(frozen=True, slots=True)
class StructlogRuntime:
    get_logger_fn: Callable[..., Any]
    source_commit: str

    @property
    def healthy(self) -> bool:
        return self.source_commit == EXPECTED_STRUCTLOG_SOURCE_COMMIT

    def get_logger(self, *args: Any, **kwargs: Any) -> Any:
        return self.get_logger_fn(*args, **kwargs)
