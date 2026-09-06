from __future__ import annotations

from collections.abc import Callable
from pathlib import Path
import sys
from typing import Any

from .dependencies import StabilizeBootstrapError, StabilizeDependencies
from .runtime import StabilizeRuntime


FACTORY_KEY = "stabilize.orchestrator"


def vendor_root() -> Path:
    """Return the fixed, local vendor root for UI YAIWES runtime code."""

    return Path(__file__).resolve().parents[3] / "vendor"


def _resolve_orchestrator_type(explicit: type[Any] | None) -> type[Any]:
    if explicit is not None:
        return explicit

    root = vendor_root()
    orchestrator_file = root / "stabilize" / "orchestrator.py"
    if not orchestrator_file.is_file():
        raise StabilizeBootstrapError(
            f"vendored stabilize orchestrator missing: {orchestrator_file}"
        )

    value = str(root)
    if value not in sys.path:
        sys.path.insert(0, value)

    try:
        from stabilize.orchestrator import Orchestrator
    except Exception as exc:  # pragma: no cover - environment dependent
        raise StabilizeBootstrapError(
            "unable to import vendored stabilize Orchestrator"
        ) from exc
    return Orchestrator


def create_stabilize_runtime(
    dependencies: StabilizeDependencies,
) -> StabilizeRuntime:
    """Create Stabilize with explicit Queue/WorkflowStore dependency injection."""

    if dependencies.queue is None:
        raise StabilizeBootstrapError("queue dependency is required")

    orchestrator_type = _resolve_orchestrator_type(dependencies.orchestrator_type)
    orchestrator = orchestrator_type(dependencies.queue, dependencies.store)
    runtime = StabilizeRuntime(
        orchestrator=orchestrator,
        queue=dependencies.queue,
        store=dependencies.store,
    )
    if not runtime.healthy:
        raise StabilizeBootstrapError("dependency injection identity check failed")
    return runtime


def build_stabilize_factory(
    dependencies: StabilizeDependencies,
) -> Callable[[], StabilizeRuntime]:
    return lambda: create_stabilize_runtime(dependencies)


def build_stabilize_factories(
    dependencies: StabilizeDependencies,
) -> dict[str, Callable[[], StabilizeRuntime]]:
    return {FACTORY_KEY: build_stabilize_factory(dependencies)}
