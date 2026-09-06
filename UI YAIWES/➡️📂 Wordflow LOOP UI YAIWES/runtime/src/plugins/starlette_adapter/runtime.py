from __future__ import annotations

from dataclasses import dataclass
from typing import Any

EXPECTED_STARLETTE_VERSION = "1.6.0"


class StarletteVersionError(RuntimeError):
    pass


@dataclass(frozen=True, slots=True)
class StarletteRuntime:
    app_type: type[Any]
    version: str

    @property
    def healthy(self) -> bool:
        return self.version == EXPECTED_STARLETTE_VERSION

    def create_app(self, **kwargs: Any) -> Any:
        return self.app_type(**kwargs)
