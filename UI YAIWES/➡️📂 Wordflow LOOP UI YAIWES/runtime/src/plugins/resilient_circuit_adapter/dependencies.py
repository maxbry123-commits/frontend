from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True, slots=True)
class ResilientCircuitDependencies:
    policy_type: type[Any] | None = None
    version: str | None = None
