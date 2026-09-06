from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True, slots=True)
class StabilizeRuntime:
    orchestrator: Any
    queue: Any
    store: Any | None

    def health(self) -> dict[str, bool]:
        return {
            "queue_injected": getattr(self.orchestrator, "queue", None) is self.queue,
            "store_injected": getattr(self.orchestrator, "store", None) is self.store,
        }

    @property
    def healthy(self) -> bool:
        return all(self.health().values())
