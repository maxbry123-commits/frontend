from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
import re


class PluginKind(str, Enum):
    CORE = "CORE"
    ADAPTER = "ADAPTER"
    TOOL = "TOOL"
    UI = "UI"
    DONOR = "DONOR"


@dataclass(frozen=True)
class PluginSpec:
    name: str
    kind: PluginKind
    capabilities: tuple[str, ...]
    source_path: str
    source_tree_sha: str
    mount_path: str
    enabled: bool = False
    workflow_owner: bool = False
    factory_key: str = ""

    def valid_identity(self) -> bool:
        return bool(
            self.name
            and self.source_path
            and self.mount_path
            and re.fullmatch(r"[0-9a-fA-F]{40}", self.source_tree_sha)
        )
