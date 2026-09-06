from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Callable

EXPECTED_RESILIENT_CIRCUIT_VERSION = "0.7.0"


class ResilientCircuitVersionError(RuntimeError):
    pass


@dataclass(frozen=True, slots=True)
class ResilientCircuitRuntime:
    policy_type: type[Any]
    version: str

    @property
    def healthy(self) -> bool:
        return self.version == EXPECTED_RESILIENT_CIRCUIT_VERSION

    def build_policy(self, **kwargs: Any) -> Any:
        return self.policy_type(**kwargs)

    def protect(self, func: Callable[..., Any], **policy_kwargs: Any) -> Callable[..., Any]:
        return self.build_policy(**policy_kwargs)(func)

    def execute(
        self,
        func: Callable[..., Any],
        *args: Any,
        policy_kwargs: dict[str, Any] | None = None,
        **kwargs: Any,
    ) -> Any:
        protected = self.protect(func, **(policy_kwargs or {}))
        return protected(*args, **kwargs)
