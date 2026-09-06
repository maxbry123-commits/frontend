from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
import re

_SHA1 = re.compile(r"^[0-9a-f]{40}$")


class PluginKind(str, Enum):
    CORE = "core"
    ADAPTER = "adapter"
    POLICY = "policy"
    RESILIENCE = "resilience"
    OBSERVABILITY = "observability"
    TEST = "test"
    DONOR = "donor"


@dataclass(frozen=True, slots=True)
class PluginSpec:
    name: str
    kind: PluginKind
    capabilities: tuple[str, ...]
    source_root: str
    source_tree_sha: str
    code_root: str | None
    enabled: bool = False
    workflow_owner: bool = False
    factory_key: str | None = None

    def __post_init__(self) -> None:
        if not self.name or any(char.isspace() for char in self.name):
            raise ValueError("plugin name must be a non-empty token")
        if not self.capabilities:
            raise ValueError("plugin must declare at least one capability")
        if len(set(self.capabilities)) != len(self.capabilities):
            raise ValueError("duplicate capabilities are not allowed")
        if not _SHA1.fullmatch(self.source_tree_sha):
            raise ValueError("source_tree_sha must be a 40-char lowercase Git SHA")
        if not self.source_root:
            raise ValueError("source_root is required")
        if self.code_root is not None:
            _validate_relative_path(self.code_root)


def _validate_relative_path(value: str) -> None:
    if not value or value.startswith("/") or "\\" in value:
        raise ValueError("code_root must be a relative POSIX path")
    if any(part in {"", ".", ".."} for part in value.split("/")):
        raise ValueError("code_root contains an unsafe path segment")
