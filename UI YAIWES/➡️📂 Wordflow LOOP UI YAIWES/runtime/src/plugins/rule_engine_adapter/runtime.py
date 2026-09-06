from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Iterable

EXPECTED_RULE_ENGINE_VERSION = "5.0.3"


class RuleEngineVersionError(RuntimeError):
    pass


@dataclass(frozen=True, slots=True)
class RuleEngineRuntime:
    rule_type: type[Any]
    version: str

    @property
    def healthy(self) -> bool:
        return self.version == EXPECTED_RULE_ENGINE_VERSION

    def compile(self, expression: str) -> Any:
        return self.rule_type(expression)

    def is_valid(self, expression: str) -> bool:
        return bool(self.rule_type.is_valid(expression))

    def evaluate(self, expression: str, thing: Any) -> Any:
        return self.compile(expression).evaluate(thing)

    def matches(self, expression: str, thing: Any) -> bool:
        return bool(self.compile(expression).matches(thing))

    def filter(self, expression: str, things: Iterable[Any]) -> list[Any]:
        return list(self.compile(expression).filter(things))
