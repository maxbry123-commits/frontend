from __future__ import annotations

from dataclasses import dataclass
from typing import Any

EXPECTED_PYCASBIN_VERSION = "2.6.1"


class PyCasbinVersionError(RuntimeError):
    pass


@dataclass(frozen=True, slots=True)
class PyCasbinRuntime:
    enforcer_type: type[Any]
    version: str

    @property
    def healthy(self) -> bool:
        return self.version == EXPECTED_PYCASBIN_VERSION

    def new_enforcer(self, *args: Any, **kwargs: Any) -> Any:
        return self.enforcer_type(*args, **kwargs)

    def enforce(self, enforcer: Any, subject: Any, obj: Any, action: Any) -> bool:
        return bool(enforcer.enforce(subject, obj, action))
