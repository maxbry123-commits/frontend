from __future__ import annotations

from collections.abc import Callable
from pathlib import Path
import sys
from typing import Any

from .dependencies import RuleEngineDependencies
from .runtime import EXPECTED_RULE_ENGINE_VERSION, RuleEngineRuntime, RuleEngineVersionError

FACTORY_KEY = "rule_engine.policy"


class RuleEngineBootstrapError(RuntimeError):
    pass


def vendor_root() -> Path:
    return Path(__file__).resolve().parents[3] / "vendor"


def _resolve_dependencies(
    dependencies: RuleEngineDependencies | None,
) -> tuple[type[Any], str]:
    dependencies = dependencies or RuleEngineDependencies()
    if dependencies.rule_type is not None:
        if dependencies.version is None:
            raise ValueError("explicit Rule injection requires explicit version")
        return dependencies.rule_type, dependencies.version

    root = vendor_root()
    package_init = root / "rule_engine" / "__init__.py"
    if not package_init.is_file():
        raise RuleEngineBootstrapError(f"vendored rule_engine missing: {package_init}")
    value = str(root)
    if value not in sys.path:
        sys.path.insert(0, value)
    try:
        import rule_engine
    except Exception as exc:  # pragma: no cover - environment dependent
        raise RuleEngineBootstrapError("unable to import vendored rule_engine") from exc
    return rule_engine.Rule, rule_engine.__version__


def create_rule_engine_runtime(
    dependencies: RuleEngineDependencies | None = None,
) -> RuleEngineRuntime:
    rule_type, version = _resolve_dependencies(dependencies)
    if version != EXPECTED_RULE_ENGINE_VERSION:
        raise RuleEngineVersionError(
            f"expected rule-engine {EXPECTED_RULE_ENGINE_VERSION}, got {version}"
        )
    return RuleEngineRuntime(rule_type=rule_type, version=version)


def build_rule_engine_factory(
    dependencies: RuleEngineDependencies | None = None,
) -> Callable[[], RuleEngineRuntime]:
    return lambda: create_rule_engine_runtime(dependencies)


def build_rule_engine_factories(
    dependencies: RuleEngineDependencies | None = None,
) -> dict[str, Callable[[], RuleEngineRuntime]]:
    return {FACTORY_KEY: build_rule_engine_factory(dependencies)}
