from __future__ import annotations

from .contract import PluginKind, PluginSpec


class MountRejectedError(RuntimeError):
    pass


class MountGuard:
    WORKFLOW_OWNER_NAME = "stabilize_core"

    def validate(self, spec: PluginSpec) -> None:
        if not spec.enabled:
            raise MountRejectedError(f"{spec.name}: disabled")
        if spec.kind in {PluginKind.DONOR, PluginKind.TEST}:
            raise MountRejectedError(
                f"{spec.name}: {spec.kind.value} plugins are not production-mountable"
            )
        if spec.code_root is None:
            raise MountRejectedError(f"{spec.name}: code_root missing")
        if spec.factory_key is None:
            raise MountRejectedError(f"{spec.name}: factory_key missing")
        if spec.workflow_owner and spec.name != self.WORKFLOW_OWNER_NAME:
            raise MountRejectedError(
                f"{spec.name}: only {self.WORKFLOW_OWNER_NAME} may own workflow"
            )
