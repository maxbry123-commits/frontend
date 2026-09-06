from __future__ import annotations

from collections.abc import Callable
from pathlib import Path
import sys
from typing import Any

from .dependencies import ResilientCircuitDependencies
from .runtime import (
    EXPECTED_RESILIENT_CIRCUIT_VERSION,
    ResilientCircuitRuntime,
    ResilientCircuitVersionError,
)

FACTORY_KEY = "resilient_circuit.breaker"


class ResilientCircuitBootstrapError(RuntimeError):
    pass


def vendor_root() -> Path:
    return Path(__file__).resolve().parents[3] / "vendor"


def _resolve_dependencies(dependencies: ResilientCircuitDependencies | None) -> tuple[type[Any], str]:
    dependencies = dependencies or ResilientCircuitDependencies()
    if dependencies.policy_type is not None:
        if dependencies.version is None:
            raise ValueError("explicit resilient-circuit injection requires version")
        return dependencies.policy_type, dependencies.version

    root = vendor_root()
    package_init = root / "resilient_circuit" / "__init__.py"
    if not package_init.is_file():
        raise ResilientCircuitBootstrapError(f"vendored resilient_circuit missing: {package_init}")
    value = str(root)
    if value not in sys.path:
        sys.path.insert(0, value)
    try:
        import resilient_circuit
    except Exception as exc:  # pragma: no cover
        raise ResilientCircuitBootstrapError("unable to import vendored resilient_circuit") from exc
    return resilient_circuit.CircuitProtectorPolicy, resilient_circuit.__version__


def create_resilient_circuit_runtime(
    dependencies: ResilientCircuitDependencies | None = None,
) -> ResilientCircuitRuntime:
    policy_type, version = _resolve_dependencies(dependencies)
    if version != EXPECTED_RESILIENT_CIRCUIT_VERSION:
        raise ResilientCircuitVersionError(
            f"expected resilient-circuit {EXPECTED_RESILIENT_CIRCUIT_VERSION}, got {version}"
        )
    return ResilientCircuitRuntime(policy_type, version)


def build_resilient_circuit_factories(
    dependencies: ResilientCircuitDependencies | None = None,
) -> dict[str, Callable[[], ResilientCircuitRuntime]]:
    return {FACTORY_KEY: lambda: create_resilient_circuit_runtime(dependencies)}
