from __future__ import annotations

from collections.abc import Callable
from typing import Any

from .compatibility import ensure_compatible
from .dependencies import PydanticDependencies
from .runtime import PydanticContractRuntime

FACTORY_KEY = "pydantic.contracts"


def _resolve_dependencies(
    dependencies: PydanticDependencies | None,
) -> tuple[type[Any], str, str]:
    dependencies = dependencies or PydanticDependencies()

    if dependencies.base_model_type is not None:
        if dependencies.pydantic_version is None or dependencies.core_version is None:
            raise ValueError("explicit BaseModel injection requires explicit Pydantic/core versions")
        return (
            dependencies.base_model_type,
            dependencies.pydantic_version,
            dependencies.core_version,
        )

    import pydantic
    import pydantic_core

    return pydantic.BaseModel, pydantic.__version__, pydantic_core.__version__


def create_pydantic_runtime(
    dependencies: PydanticDependencies | None = None,
) -> PydanticContractRuntime:
    base_model_type, pydantic_version, core_version = _resolve_dependencies(dependencies)
    report = ensure_compatible(pydantic_version, core_version)
    return PydanticContractRuntime(base_model_type=base_model_type, compatibility=report)


def build_pydantic_factory(
    dependencies: PydanticDependencies | None = None,
) -> Callable[[], PydanticContractRuntime]:
    return lambda: create_pydantic_runtime(dependencies)


def build_pydantic_factories(
    dependencies: PydanticDependencies | None = None,
) -> dict[str, Callable[[], PydanticContractRuntime]]:
    return {FACTORY_KEY: build_pydantic_factory(dependencies)}
