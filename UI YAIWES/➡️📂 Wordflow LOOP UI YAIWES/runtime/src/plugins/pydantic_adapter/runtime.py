from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from .compatibility import CompatibilityReport


class ContractTypeError(TypeError):
    pass


@dataclass(frozen=True, slots=True)
class PydanticContractRuntime:
    base_model_type: type[Any]
    compatibility: CompatibilityReport

    @property
    def healthy(self) -> bool:
        return self.compatibility.compatible

    def _require_model(self, model_type: type[Any]) -> None:
        if not isinstance(model_type, type) or not issubclass(model_type, self.base_model_type):
            raise ContractTypeError("model_type must inherit from the configured Pydantic BaseModel")

    def validate(self, model_type: type[Any], payload: Any) -> Any:
        self._require_model(model_type)
        return model_type.model_validate(payload)

    def dump(self, instance: Any) -> dict[str, Any]:
        if not isinstance(instance, self.base_model_type):
            raise ContractTypeError("instance must be a Pydantic BaseModel")
        return instance.model_dump(mode="json")

    def schema(self, model_type: type[Any]) -> dict[str, Any]:
        self._require_model(model_type)
        return model_type.model_json_schema()
