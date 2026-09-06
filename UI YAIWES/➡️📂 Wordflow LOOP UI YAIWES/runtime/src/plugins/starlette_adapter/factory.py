from __future__ import annotations

from collections.abc import Callable
from pathlib import Path
import sys
from typing import Any

from .dependencies import StarletteDependencies
from .runtime import EXPECTED_STARLETTE_VERSION, StarletteRuntime, StarletteVersionError

FACTORY_KEY = "starlette.asgi"


class StarletteBootstrapError(RuntimeError):
    pass


def vendor_root() -> Path:
    return Path(__file__).resolve().parents[3] / "vendor"


def _resolve_dependencies(dependencies: StarletteDependencies | None) -> tuple[type[Any], str]:
    dependencies = dependencies or StarletteDependencies()
    if dependencies.app_type is not None:
        if dependencies.version is None:
            raise ValueError("explicit Starlette injection requires version")
        return dependencies.app_type, dependencies.version

    root = vendor_root()
    package_init = root / "starlette" / "__init__.py"
    if not package_init.is_file():
        raise StarletteBootstrapError(f"vendored starlette missing: {package_init}")
    value = str(root)
    if value not in sys.path:
        sys.path.insert(0, value)
    try:
        import starlette
        from starlette.applications import Starlette
    except Exception as exc:  # pragma: no cover - environment dependent
        raise StarletteBootstrapError("unable to import vendored starlette") from exc
    return Starlette, starlette.__version__


def create_starlette_runtime(dependencies: StarletteDependencies | None = None) -> StarletteRuntime:
    app_type, version = _resolve_dependencies(dependencies)
    if version != EXPECTED_STARLETTE_VERSION:
        raise StarletteVersionError(f"expected Starlette {EXPECTED_STARLETTE_VERSION}, got {version}")
    return StarletteRuntime(app_type, version)


def build_starlette_factory(dependencies: StarletteDependencies | None = None) -> Callable[[], StarletteRuntime]:
    return lambda: create_starlette_runtime(dependencies)


def build_starlette_factories(dependencies: StarletteDependencies | None = None) -> dict[str, Callable[[], StarletteRuntime]]:
    return {FACTORY_KEY: build_starlette_factory(dependencies)}
