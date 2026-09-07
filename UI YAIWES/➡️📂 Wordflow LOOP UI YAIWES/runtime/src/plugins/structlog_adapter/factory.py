from __future__ import annotations
from collections.abc import Callable
from pathlib import Path
import sys

from .dependencies import StructlogDependencies
from .runtime import StructlogRuntime

FACTORY_KEY = "structlog.logging"

class StructlogBootstrapError(RuntimeError):
    pass

def vendor_root() -> Path:
    return Path(__file__).resolve().parents[3] / "vendor"

def create_structlog_runtime(dependencies: StructlogDependencies | None = None) -> StructlogRuntime:
    dependencies = dependencies or StructlogDependencies()
    if dependencies.get_logger is not None:
        return StructlogRuntime(dependencies.get_logger)
    root = vendor_root()
    package_init = root / "structlog" / "__init__.py"
    if not package_init.is_file():
        raise StructlogBootstrapError(f"vendored structlog missing: {package_init}")
    value = str(root)
    if value not in sys.path:
        sys.path.insert(0, value)
    try:
        import structlog
    except Exception as exc:
        raise StructlogBootstrapError("unable to import vendored structlog") from exc
    return StructlogRuntime(structlog.get_logger)

def build_structlog_factories(dependencies: StructlogDependencies | None = None) -> dict[str, Callable[[], StructlogRuntime]]:
    return {FACTORY_KEY: lambda: create_structlog_runtime(dependencies)}
