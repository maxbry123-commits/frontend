from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Callable


@dataclass(frozen=True, slots=True)
class StructlogDependencies:
    get_logger: Callable[..., Any] | None = None
    source_commit: str | None = None
