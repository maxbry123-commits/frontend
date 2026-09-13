from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from typing import Any

from ..contract import PluginKind, PluginSpec

BIG_AGI_NAME = "big_agi"
BIG_AGI_CAPABILITY = "workspace.multimodel"
BIG_AGI_FACTORY_KEY = "big_agi"
BIG_AGI_SOURCE_PATH = "component-source/big-AGI"
BIG_AGI_SOURCE_TREE_SHA = "39ee2280e85c95db1b20309f1bc440222b71f798"
BIG_AGI_MOUNT_PATH = "runtime/vendor/big_agi"


class BigAgiAdapterError(RuntimeError):
    pass


@dataclass(frozen=True)
class BigAgiWorkspace:
    name: str
    capability: str
    source_path: str
    source_tree_sha: str
    mount_path: str
    workflow_owner: bool = False

    def evidence(self) -> dict[str, Any]:
        return {
            "name": self.name,
            "capability": self.capability,
            "source_path": self.source_path,
            "source_tree_sha": self.source_tree_sha,
            "mount_path": self.mount_path,
            "workflow_owner": self.workflow_owner,
        }


def _validate_spec(spec: PluginSpec) -> None:
    expected = {
        "name": BIG_AGI_NAME,
        "kind": PluginKind.UI,
        "capability": BIG_AGI_CAPABILITY,
        "source_path": BIG_AGI_SOURCE_PATH,
        "source_tree_sha": BIG_AGI_SOURCE_TREE_SHA,
        "mount_path": BIG_AGI_MOUNT_PATH,
        "factory_key": BIG_AGI_FACTORY_KEY,
    }
    if spec.name != expected["name"]:
        raise BigAgiAdapterError("unexpected plugin identity")
    if spec.kind is not expected["kind"]:
        raise BigAgiAdapterError("big-AGI must remain a UI plugin")
    if expected["capability"] not in spec.capabilities:
        raise BigAgiAdapterError("workspace.multimodel capability missing")
    if spec.source_path != expected["source_path"]:
        raise BigAgiAdapterError("unexpected big-AGI source path")
    if spec.source_tree_sha != expected["source_tree_sha"]:
        raise BigAgiAdapterError("unexpected big-AGI source tree")
    if spec.mount_path != expected["mount_path"]:
        raise BigAgiAdapterError("unexpected big-AGI mount path")
    if spec.factory_key != expected["factory_key"]:
        raise BigAgiAdapterError("unexpected big-AGI factory key")
    if spec.workflow_owner:
        raise BigAgiAdapterError("big-AGI cannot own the workflow")


def create_big_agi_workspace(spec: PluginSpec) -> BigAgiWorkspace:
    _validate_spec(spec)
    return BigAgiWorkspace(
        name=spec.name,
        capability=BIG_AGI_CAPABILITY,
        source_path=spec.source_path,
        source_tree_sha=spec.source_tree_sha,
        mount_path=spec.mount_path,
        workflow_owner=False,
    )


def build_big_agi_factories(spec: PluginSpec) -> dict[str, Callable[[], BigAgiWorkspace]]:
    _validate_spec(spec)
    return {BIG_AGI_FACTORY_KEY: lambda: create_big_agi_workspace(spec)}
