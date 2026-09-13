from __future__ import annotations

from typing import Any, Mapping

from .platform_matrix import CapabilitySnapshot
from .sandbox_router import (
    SandboxBackend,
    SandboxLifecycle,
    SandboxRecord,
    SandboxRequest,
    SandboxRoute,
    route_sandbox,
)


class VirtualMachineManager:
    """Thin VM facade over the canonical UEK sandbox router/lifecycle.

    This class does not own scheduling, drivers, or platform policy. It only
    exposes the VM-manager capability required by YAIWES while delegating all
    routing and effects to the already-tested canonical sandbox boundary.
    """

    def __init__(self, lifecycle: SandboxLifecycle) -> None:
        if not isinstance(lifecycle, SandboxLifecycle):
            raise TypeError("sandbox_lifecycle_required")
        self._lifecycle = lifecycle

    def route(
        self,
        snapshot: CapabilitySnapshot,
        request: SandboxRequest = SandboxRequest(),
    ) -> SandboxRoute:
        return route_sandbox(snapshot, request)

    def create(
        self,
        vm_id: str,
        snapshot: CapabilitySnapshot,
        request: SandboxRequest = SandboxRequest(),
        spec: Mapping[str, Any] | None = None,
    ) -> SandboxRecord:
        return self._lifecycle.create(vm_id, snapshot, request, spec)

    def start(self, vm_id: str) -> SandboxRecord:
        return self._lifecycle.start(vm_id)

    def stop(self, vm_id: str) -> SandboxRecord:
        return self._lifecycle.stop(vm_id)

    def destroy(self, vm_id: str) -> SandboxRecord:
        return self._lifecycle.destroy(vm_id)

    def get(self, vm_id: str) -> SandboxRecord:
        return self._lifecycle.get(vm_id)

    @property
    def registered_backends(self) -> frozenset[SandboxBackend]:
        return frozenset(self._lifecycle._drivers)
