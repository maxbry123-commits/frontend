from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True, slots=True)
class PydanticDependencies:
    base_model_type: type[Any] | None = None
    pydantic_version: str | None = None
    core_version: str | None = None
