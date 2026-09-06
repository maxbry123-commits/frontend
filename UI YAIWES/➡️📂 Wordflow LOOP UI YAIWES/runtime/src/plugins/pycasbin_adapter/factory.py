from __future__ import annotations

from collections.abc import Callable
from hashlib import sha256
from pathlib import Path
import sys
from typing import Any

from .dependencies import PyCasbinDependencies
from .runtime import EXPECTED_PYCASBIN_VERSION, PyCasbinRuntime, PyCasbinVersionError

FACTORY_KEY = "casbin.authorization"
EXPECTED_PYCASBIN_INIT_SHA256 = "51a574bb630a86bcb5c10a93fd193b2875f3ca72b4693dec277f639f0332b420"


class PyCasbinBootstrapError(RuntimeError):
    pass


def vendor_root() -> Path:
    return Path(__file__).resolve().parents[3] / "vendor"


def _is_under(path: str | None, root: Path) -> bool:
    if not path:
        return False
    try:
        Path(path).resolve().relative_to(root.resolve())
        return True
    except ValueError:
        return False


def _sha256_file(path: Path) -> str:
    digest = sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _verify_vendor_integrity(package_init: Path) -> None:
    observed = _sha256_file(package_init)
    if observed != EXPECTED_PYCASBIN_INIT_SHA256:
        raise PyCasbinBootstrapError(
            f"vendored casbin integrity mismatch: expected {EXPECTED_PYCASBIN_INIT_SHA256}, got {observed}"
        )


def _resolve_dependencies(dependencies: PyCasbinDependencies | None) -> tuple[type[Any], str]:
    dependencies = dependencies or PyCasbinDependencies()
    if dependencies.enforcer_type is not None:
        if dependencies.version is None:
            raise ValueError("explicit PyCasbin injection requires version")
        return dependencies.enforcer_type, dependencies.version
    root = vendor_root()
    package_init = root / "casbin" / "__init__.py"
    if not package_init.is_file():
        raise PyCasbinBootstrapError(f"vendored casbin missing: {package_init}")
    _verify_vendor_integrity(package_init)
    value = str(root)
    if value not in sys.path:
        sys.path.insert(0, value)
    try:
        import casbin
    except Exception as exc:
        raise PyCasbinBootstrapError("unable to import vendored casbin") from exc
    if not _is_under(getattr(casbin, "__file__", None), root):
        raise PyCasbinBootstrapError("casbin import resolved outside vendored root")
    return casbin.Enforcer, EXPECTED_PYCASBIN_VERSION


def create_pycasbin_runtime(dependencies: PyCasbinDependencies | None = None) -> PyCasbinRuntime:
    enforcer_type, version = _resolve_dependencies(dependencies)
    if version != EXPECTED_PYCASBIN_VERSION:
        raise PyCasbinVersionError(f"expected PyCasbin {EXPECTED_PYCASBIN_VERSION}, got {version}")
    return PyCasbinRuntime(enforcer_type, version)


def build_pycasbin_factory(dependencies: PyCasbinDependencies | None = None) -> Callable[[], PyCasbinRuntime]:
    return lambda: create_pycasbin_runtime(dependencies)


def build_pycasbin_factories(dependencies: PyCasbinDependencies | None = None) -> dict[str, Callable[[], PyCasbinRuntime]]:
    return {FACTORY_KEY: build_pycasbin_factory(dependencies)}
