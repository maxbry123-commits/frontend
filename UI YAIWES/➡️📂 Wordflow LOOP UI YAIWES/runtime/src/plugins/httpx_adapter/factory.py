from __future__ import annotations

from collections.abc import Callable
from pathlib import Path
import sys
from typing import Any

from .dependencies import HttpxDependencies
from .runtime import EXPECTED_HTTPX_VERSION, HttpxRuntime, HttpxVersionError

FACTORY_KEY = "httpx.transport"


class HttpxBootstrapError(RuntimeError):
    pass


def vendor_root() -> Path:
    return Path(__file__).resolve().parents[3] / "vendor"


def _resolve_dependencies(dependencies: HttpxDependencies | None) -> tuple[type[Any], type[Any], str, dict[str, Any]]:
    dependencies = dependencies or HttpxDependencies()
    if dependencies.client_type is not None:
        if dependencies.async_client_type is None or dependencies.version is None:
            raise ValueError("explicit HTTPX injection requires client_type, async_client_type and version")
        return dependencies.client_type, dependencies.async_client_type, dependencies.version, dict(dependencies.client_kwargs)

    root = vendor_root()
    package_init = root / "httpx" / "__init__.py"
    if not package_init.is_file():
        raise HttpxBootstrapError(f"vendored httpx missing: {package_init}")
    value = str(root)
    if value not in sys.path:
        sys.path.insert(0, value)
    try:
        import httpx
    except Exception as exc:  # pragma: no cover - environment dependent
        raise HttpxBootstrapError("unable to import vendored httpx") from exc
    return httpx.Client, httpx.AsyncClient, httpx.__version__, dict(dependencies.client_kwargs)


def create_httpx_runtime(dependencies: HttpxDependencies | None = None) -> HttpxRuntime:
    client_type, async_client_type, version, client_kwargs = _resolve_dependencies(dependencies)
    if version != EXPECTED_HTTPX_VERSION:
        raise HttpxVersionError(f"expected HTTPX {EXPECTED_HTTPX_VERSION}, got {version}")
    return HttpxRuntime(client_type, async_client_type, version, client_kwargs)


def build_httpx_factory(dependencies: HttpxDependencies | None = None) -> Callable[[], HttpxRuntime]:
    return lambda: create_httpx_runtime(dependencies)


def build_httpx_factories(dependencies: HttpxDependencies | None = None) -> dict[str, Callable[[], HttpxRuntime]]:
    return {FACTORY_KEY: build_httpx_factory(dependencies)}
