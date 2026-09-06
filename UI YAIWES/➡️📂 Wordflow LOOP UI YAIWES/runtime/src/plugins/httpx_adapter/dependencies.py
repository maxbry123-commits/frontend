from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass(frozen=True, slots=True)
class HttpxDependencies:
    client_type: type[Any] | None = None
    async_client_type: type[Any] | None = None
    version: str | None = None
    client_kwargs: dict[str, Any] = field(default_factory=dict)
