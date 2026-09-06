from __future__ import annotations
from collections.abc import Callable
from typing import Any

class StructlogRuntime:
    """Read-only logging facade. It has no workflow/state mutation authority."""
    def __init__(self, get_logger: Callable[..., Any]) -> None:
        self._get_logger = get_logger

    @property
    def healthy(self) -> bool:
        return callable(self._get_logger)

    def logger(self, *args: Any, **kwargs: Any) -> Any:
        return self._get_logger(*args, **kwargs)

    def emit(self, level: str, event: str, **fields: Any) -> Any:
        logger = self.logger()
        method = getattr(logger, level, None)
        if not callable(method):
            raise ValueError(f"unsupported structlog level: {level}")
        return method(event, **fields)
