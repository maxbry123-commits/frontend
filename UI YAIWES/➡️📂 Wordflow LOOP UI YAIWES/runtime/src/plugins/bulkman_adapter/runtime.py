from __future__ import annotations
from dataclasses import dataclass
from typing import Any, Callable

EXPECTED_BULKMAN_VERSION = "2.0.3"

class BulkmanVersionError(RuntimeError):
    pass

@dataclass(frozen=True, slots=True)
class BulkmanRuntime:
    config_type: type[Any]
    bulkhead_type: type[Any]
    version: str

    @property
    def healthy(self) -> bool:
        return self.version == EXPECTED_BULKMAN_VERSION

    def build(self, *, circuit_storage: Any | None = None, **config_kwargs: Any) -> Any:
        config = self.config_type(**config_kwargs)
        return self.bulkhead_type(config, circuit_storage=circuit_storage)

    def execute(
        self,
        func: Callable[..., Any],
        *args: Any,
        config_kwargs: dict[str, Any],
        circuit_storage: Any | None = None,
        **kwargs: Any,
    ) -> Any:
        bulkhead = self.build(circuit_storage=circuit_storage, **config_kwargs)
        return bulkhead.execute(func, *args, **kwargs)
