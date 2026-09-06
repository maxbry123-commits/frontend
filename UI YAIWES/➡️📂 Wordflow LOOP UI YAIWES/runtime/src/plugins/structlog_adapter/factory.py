from __future__ import annotations

from collections.abc import Callable
from hashlib import sha256
from pathlib import Path
import sys
from typing import Any

from .dependencies import StructlogDependencies
from .runtime import EXPECTED_STRUCTLOG_SOURCE_COMMIT, StructlogProvenanceError, StructlogRuntime

FACTORY_KEY = "structlog.logging"
EXPECTED_STRUCTLOG_INIT_SHA256 = "b3a3b13bc1a1c338a326fe9aeb0b4434f6d5a3e56f29b403a73b4d223efaa092"


class StructlogBootstrapError(RuntimeError):
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
    if observed != EXPECTED_STRUCTLOG_INIT_SHA256:
        raise StructlogBootstrapError(
            f"vendored structlog integrity mismatch: expected {EXPECTED_STRUCTLOG_INIT_SHA256}, got {observed}"
        )


def _resolve_dependencies(dependencies: StructlogDependencies | None) -> tuple[Callable[..., Any], str]:
    dependencies = dependencies or StructlogDependencies()
    if dependencies.get_logger is not None:
        if dependencies.source_commit is None:
            raise ValueError("explicit structlog injection requires source_commit")
        return dependencies.get_logger, dependencies.source_commit
    root = vendor_root()
    package_init = root / "structlog" / "__init__.py"
    if not package_init.is_file():
        raise StructlogBootstrapError(f"vendored structlog missing: {package_init}")
    _verify_vendor_integrity(package_init)
    value = str(root)
    if value not in sys.path:
        sys.path.insert(0, value)
    try:
        import structlog
    except Exception as exc:
        raise StructlogBootstrapError("unable to import vendored structlog") from exc
    if not _is_under(getattr(structlog, "__file__", None), root):
        raise StructlogBootstrapError("structlog import resolved outside vendored root")
    return structlog.get_logger, EXPECTED_STRUCTLOG_SOURCE_COMMIT


def create_structlog_runtime(dependencies: StructlogDependencies | None = None) -> StructlogRuntime:
    get_logger, source_commit = _resolve_dependencies(dependencies)
    if source_commit != EXPECTED_STRUCTLOG_SOURCE_COMMIT:
        raise StructlogProvenanceError(f"expected structlog source {EXPECTED_STRUCTLOG_SOURCE_COMMIT}, got {source_commit}")
    return StructlogRuntime(get_logger, source_commit)


def build_structlog_factory(dependencies: StructlogDependencies | None = None) -> Callable[[], StructlogRuntime]:
    return lambda: create_structlog_runtime(dependencies)


def build_structlog_factories(dependencies: StructlogDependencies | None = None) -> dict[str, Callable[[], StructlogRuntime]]:
    return {FACTORY_KEY: build_structlog_factory(dependencies)}
