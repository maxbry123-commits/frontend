from __future__ import annotations

from .contract import PluginSpec


class MountRejectedError(RuntimeError):
    pass


class MountGuard:
    def validate(self, spec: PluginSpec) -> None:
        if not spec.enabled:
            raise MountRejectedError(f"plugin disabled: {spec.name}")
        if not spec.valid_identity():
            raise MountRejectedError(f"invalid plugin identity: {spec.name}")
        if spec.workflow_owner and spec.name != "stabilize_core":
            raise MountRejectedError("workflow owner must be stabilize_core")
        if not spec.factory_key:
            raise MountRejectedError(f"missing factory key: {spec.name}")
