from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any


class StabilizeBootstrapError(RuntimeError):
    pass


@dataclass(frozen=True)
class StabilizeDependencies:
    queue: Any
    store: Any = None
    orchestrator_type: type | None = None


@dataclass(frozen=True)
class StabilizeRuntime:
    queue: Any
    store: Any
    orchestrator: Any
    healthy: bool = True


def vendor_root() -> Path:
    return Path(__file__).resolve().parents[3] / "vendor"


def _load_orchestrator_type() -> type:
    import sys

    root = vendor_root()
    if str(root) not in sys.path:
        sys.path.insert(0, str(root))
    from stabilize import Orchestrator

    return Orchestrator


def create_stabilize_runtime(dependencies: StabilizeDependencies) -> StabilizeRuntime:
    if dependencies.queue is None:
        raise StabilizeBootstrapError("queue is required")

    orchestrator_type = dependencies.orchestrator_type or _load_orchestrator_type()
    orchestrator = orchestrator_type(dependencies.queue, store=dependencies.store)

    if getattr(orchestrator, "queue", None) is not dependencies.queue:
        raise StabilizeBootstrapError("orchestrator queue identity mismatch")
    if getattr(orchestrator, "store", None) is not dependencies.store:
        raise StabilizeBootstrapError("orchestrator store identity mismatch")

    return StabilizeRuntime(
        queue=dependencies.queue,
        store=dependencies.store,
        orchestrator=orchestrator,
    )


def build_stabilize_factories(dependencies: StabilizeDependencies):
    return {
        "stabilize.orchestrator": lambda: create_stabilize_runtime(dependencies)
    }
