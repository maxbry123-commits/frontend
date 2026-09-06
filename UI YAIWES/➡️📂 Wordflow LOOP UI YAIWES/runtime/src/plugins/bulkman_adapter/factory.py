from __future__ import annotations
from collections.abc import Callable
from pathlib import Path
import sys
from typing import Any

from .dependencies import BulkmanDependencies
from .runtime import EXPECTED_BULKMAN_VERSION, BulkmanRuntime, BulkmanVersionError

FACTORY_KEY = "bulkman.bulkhead"

class BulkmanBootstrapError(RuntimeError):
    pass

def vendor_root() -> Path:
    return Path(__file__).resolve().parents[3] / "vendor"

def _resolve_dependencies(dependencies: BulkmanDependencies | None) -> tuple[type[Any], type[Any], str]:
    dependencies = dependencies or BulkmanDependencies()
    if dependencies.config_type is not None:
        if dependencies.bulkhead_type is None or dependencies.version is None:
            raise ValueError("explicit Bulkman injection requires config_type, bulkhead_type and version")
        return dependencies.config_type, dependencies.bulkhead_type, dependencies.version
    root = vendor_root()
    package_init = root / "bulkman" / "__init__.py"
    if not package_init.is_file():
        raise BulkmanBootstrapError(f"vendored bulkman missing: {package_init}")
    value = str(root)
    if value not in sys.path:
        sys.path.insert(0, value)
    try:
        import bulkman
    except Exception as exc:  # pragma: no cover
        raise BulkmanBootstrapError("unable to import vendored bulkman") from exc
    return bulkman.BulkheadConfig, bulkman.BulkheadThreading, bulkman.__version__

def create_bulkman_runtime(dependencies: BulkmanDependencies | None = None) -> BulkmanRuntime:
    config_type, bulkhead_type, version = _resolve_dependencies(dependencies)
    if version != EXPECTED_BULKMAN_VERSION:
        raise BulkmanVersionError(f"expected Bulkman {EXPECTED_BULKMAN_VERSION}, got {version}")
    return BulkmanRuntime(config_type, bulkhead_type, version)

def build_bulkman_factories(dependencies: BulkmanDependencies | None = None) -> dict[str, Callable[[], BulkmanRuntime]]:
    return {FACTORY_KEY: lambda: create_bulkman_runtime(dependencies)}
