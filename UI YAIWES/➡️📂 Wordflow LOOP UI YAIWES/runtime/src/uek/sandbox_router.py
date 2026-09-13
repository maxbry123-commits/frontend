from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
from typing import Any, Mapping, Protocol

from .platform_matrix import CapabilitySnapshot, Platform, SupportState, assess_platform


class SandboxContractError(ValueError):
    """Invalid deterministic sandbox request or lifecycle transition."""


class SandboxUnavailable(RuntimeError):
    """No verified runtime backend can satisfy the sandbox request."""


class SandboxEffectError(RuntimeError):
    """A selected backend failed while applying a lifecycle effect."""


class SandboxKind(str, Enum):
    VM = "vm"
    CONTAINER = "container"
    PROCESS = "process"


class SandboxBackend(str, Enum):
    FIRECRACKER = "FIRECRACKER"
    GVISOR = "GVISOR"
    QEMU = "QEMU"
    CROSVM = "CROSVM"
    NSJAIL = "NSJAIL"


BACKEND_SOURCE_PATHS = {
    SandboxBackend.FIRECRACKER: "UI YAIWES/componentes open soure UI YAIWES/Firecracker",
    SandboxBackend.GVISOR: "UI YAIWES/componentes open soure UI YAIWES/gVisor",
    SandboxBackend.QEMU: "UI YAIWES/componentes open soure UI YAIWES/QEMU",
    SandboxBackend.CROSVM: "UI YAIWES/componentes open soure UI YAIWES/crosvm",
    SandboxBackend.NSJAIL: "UI YAIWES/componentes open soure UI YAIWES/nsjail",
}


class SandboxState(str, Enum):
    CREATED = "CREATED"
    RUNNING = "RUNNING"
    STOPPED = "STOPPED"
    DESTROYED = "DESTROYED"


@dataclass(frozen=True)
class SandboxRequest:
    kind: SandboxKind = SandboxKind.VM
    preferred_backend: SandboxBackend | None = None


@dataclass(frozen=True)
class SandboxRoute:
    platform: Platform
    kind: SandboxKind
    state: SupportState
    backend: SandboxBackend | None
    accelerated: bool
    reason: str
    source_anchor: str

    @property
    def executable(self) -> bool:
        return self.backend is not None and self.state is not SupportState.BLOCKED


class SandboxDriver(Protocol):
    def create(self, sandbox_id: str, spec: Mapping[str, Any]) -> Any: ...
    def start(self, handle: Any) -> None: ...
    def stop(self, handle: Any) -> None: ...
    def destroy(self, handle: Any) -> None: ...


@dataclass
class SandboxRecord:
    sandbox_id: str
    route: SandboxRoute
    spec: dict[str, Any]
    handle: Any
    state: SandboxState = SandboxState.CREATED


def _normalized_available(snapshot: CapabilitySnapshot) -> frozenset[str]:
    return frozenset(str(item).strip().upper() for item in snapshot.available_backends)


def _blocked(
    snapshot: CapabilitySnapshot,
    request: SandboxRequest,
    reason: str,
    anchor: str,
) -> SandboxRoute:
    return SandboxRoute(
        snapshot.platform,
        request.kind,
        SupportState.BLOCKED,
        None,
        False,
        reason,
        anchor,
    )


def route_sandbox(
    snapshot: CapabilitySnapshot,
    request: SandboxRequest = SandboxRequest(),
) -> SandboxRoute:
    """Select a verified backend without producing side effects.

    Source presence never implies runtime availability: only names supplied by a
    trusted CapabilitySnapshot are eligible.
    """
    if not isinstance(snapshot, CapabilitySnapshot):
        raise TypeError("capability_snapshot_required")
    if not isinstance(request, SandboxRequest):
        raise TypeError("sandbox_request_required")

    assessment = assess_platform(snapshot)
    available = _normalized_available(snapshot)
    anchor = assessment.source_anchor

    if snapshot.platform is Platform.WEB:
        return _blocked(snapshot, request, "web_has_no_local_sandbox_backend", anchor)

    candidate: SandboxBackend | None = None
    state = SupportState.BLOCKED
    accelerated = False
    reason = "no_verified_backend_for_request"

    if request.kind is SandboxKind.VM:
        if snapshot.platform is Platform.LINUX:
            if (
                "FIRECRACKER" in available
                and "KVM" in available
                and snapshot.hardware_virtualization
            ):
                candidate = SandboxBackend.FIRECRACKER
                state = SupportState.SUPPORTED
                accelerated = True
                reason = "linux_firecracker_kvm_verified"
            elif "QEMU" in available:
                candidate = SandboxBackend.QEMU
                state = (
                    assessment.state
                    if assessment.state is not SupportState.BLOCKED
                    else SupportState.CONDITIONAL
                )
                accelerated = bool(assessment.accelerated)
                reason = (
                    "linux_qemu_accelerated_verified"
                    if accelerated
                    else "linux_qemu_software_fallback"
                )
        elif snapshot.platform is Platform.ANDROID:
            if (
                "CROSVM" in available
                and "AVF" in available
                and snapshot.hardware_virtualization
                and snapshot.native_permission
            ):
                candidate = SandboxBackend.CROSVM
                state = SupportState.SUPPORTED
                accelerated = True
                reason = "android_avf_crosvm_verified"
            elif "QEMU" in available:
                candidate = SandboxBackend.QEMU
                state = SupportState.CONDITIONAL
                reason = "android_qemu_fallback"
        elif snapshot.platform in (Platform.WINDOWS, Platform.IOS):
            if "QEMU" in available:
                candidate = SandboxBackend.QEMU
                state = assessment.state
                accelerated = bool(assessment.accelerated)
                reason = (
                    "windows_qemu_route"
                    if snapshot.platform is Platform.WINDOWS
                    else "ios_qemu_conditional_route"
                )
    elif request.kind is SandboxKind.CONTAINER:
        if snapshot.platform is Platform.LINUX and "GVISOR" in available:
            candidate = SandboxBackend.GVISOR
            state = SupportState.SUPPORTED
            reason = "linux_gvisor_verified"
    elif request.kind is SandboxKind.PROCESS:
        if snapshot.platform is Platform.LINUX and "NSJAIL" in available:
            candidate = SandboxBackend.NSJAIL
            state = SupportState.SUPPORTED
            reason = "linux_nsjail_verified"

    if request.preferred_backend is not None:
        if candidate is not request.preferred_backend:
            return _blocked(
                snapshot,
                request,
                f"preferred_backend_unavailable:{request.preferred_backend.value}",
                anchor,
            )

    if candidate is None or state is SupportState.BLOCKED:
        return _blocked(snapshot, request, reason, anchor)

    return SandboxRoute(
        snapshot.platform,
        request.kind,
        state,
        candidate,
        accelerated,
        reason,
        anchor,
    )


class SandboxLifecycle:
    """Fail-closed lifecycle boundary. It routes; it never schedules work."""

    def __init__(self, drivers: Mapping[SandboxBackend, SandboxDriver]) -> None:
        self._drivers = dict(drivers)
        self._records: dict[str, SandboxRecord] = {}

    @staticmethod
    def _require_id(sandbox_id: str) -> str:
        value = str(sandbox_id).strip()
        if not value:
            raise SandboxContractError("sandbox_id_required")
        return value

    def get(self, sandbox_id: str) -> SandboxRecord:
        key = self._require_id(sandbox_id)
        try:
            return self._records[key]
        except KeyError as exc:
            raise SandboxContractError(f"unknown_sandbox:{key}") from exc

    def create(
        self,
        sandbox_id: str,
        snapshot: CapabilitySnapshot,
        request: SandboxRequest,
        spec: Mapping[str, Any] | None = None,
    ) -> SandboxRecord:
        key = self._require_id(sandbox_id)
        normalized_spec = dict(spec or {})
        existing = self._records.get(key)
        if existing is not None:
            if existing.spec == normalized_spec and existing.route == route_sandbox(snapshot, request):
                return existing
            raise SandboxContractError(f"sandbox_id_conflict:{key}")

        route = route_sandbox(snapshot, request)
        if not route.executable or route.backend is None:
            raise SandboxUnavailable(route.reason)
        driver = self._drivers.get(route.backend)
        if driver is None:
            raise SandboxUnavailable(f"driver_not_registered:{route.backend.value}")

        try:
            handle = driver.create(key, normalized_spec)
        except Exception as exc:
            raise SandboxEffectError(f"create_failed:{route.backend.value}") from exc

        record = SandboxRecord(key, route, normalized_spec, handle)
        self._records[key] = record
        return record

    def start(self, sandbox_id: str) -> SandboxRecord:
        record = self.get(sandbox_id)
        if record.state is SandboxState.RUNNING:
            return record
        if record.state not in (SandboxState.CREATED, SandboxState.STOPPED):
            raise SandboxContractError(
                f"cannot_start:{record.sandbox_id}:{record.state.value}"
            )
        driver = self._drivers[record.route.backend]
        try:
            driver.start(record.handle)
        except Exception as exc:
            raise SandboxEffectError(f"start_failed:{record.route.backend.value}") from exc
        record.state = SandboxState.RUNNING
        return record

    def stop(self, sandbox_id: str) -> SandboxRecord:
        record = self.get(sandbox_id)
        if record.state is SandboxState.STOPPED:
            return record
        if record.state is not SandboxState.RUNNING:
            raise SandboxContractError(
                f"cannot_stop:{record.sandbox_id}:{record.state.value}"
            )
        driver = self._drivers[record.route.backend]
        try:
            driver.stop(record.handle)
        except Exception as exc:
            raise SandboxEffectError(f"stop_failed:{record.route.backend.value}") from exc
        record.state = SandboxState.STOPPED
        return record

    def destroy(self, sandbox_id: str) -> SandboxRecord:
        record = self.get(sandbox_id)
        if record.state is SandboxState.DESTROYED:
            return record
        if record.state is SandboxState.RUNNING:
            raise SandboxContractError(f"cannot_destroy_running:{record.sandbox_id}")
        driver = self._drivers[record.route.backend]
        try:
            driver.destroy(record.handle)
        except Exception as exc:
            raise SandboxEffectError(f"destroy_failed:{record.route.backend.value}") from exc
        record.state = SandboxState.DESTROYED
        return record
