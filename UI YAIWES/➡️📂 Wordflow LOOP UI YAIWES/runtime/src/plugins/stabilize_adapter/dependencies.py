from __future__ import annotations

from dataclasses import dataclass
from typing import Any


class StabilizeBootstrapError(RuntimeError):
    pass


@dataclass(frozen=True, slots=True)
class StabilizeDependencies:
    """Dependencies injected into the single Stabilize workflow owner."""

    queue: Any
    store: Any | None = None
    orchestrator_type: type[Any] | None = None
