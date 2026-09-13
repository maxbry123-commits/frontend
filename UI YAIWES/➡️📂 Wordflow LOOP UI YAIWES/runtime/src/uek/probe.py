"""Read-only host capability probe for the N06 platform matrix.

The probe only observes executable/device availability. It never launches a VM,
changes host state, or claims that source presence equals runtime support.
Sandbox lifecycle remains owned by N20.
"""
from __future__ import annotations

from collections.abc import Callable, Mapping
import os
import platform as host_platform
import shutil
from typing import Optional

from .platform_matrix import CapabilitySnapshot, Platform


class PlatformProbeError(RuntimeError):
    pass


def _has_qemu(which: Callable[[str], Optional[str]]) -> bool:
    return any(
        which(name)
        for name in (
            "qemu-system-x86_64",
            "qemu-system-aarch64",
            "qemu-system-arm",
            "qemu-system-i386",
        )
    )


def _kvm_usable(
    exists: Callable[[str], bool],
    access: Callable[[str, int], bool],
) -> bool:
    return bool(exists("/dev/kvm") and access("/dev/kvm", os.R_OK | os.W_OK))


def _detect_platform(system_name: str, environ: Mapping[str, str]) -> Platform:
    explicit = environ.get("YAIWES_HOST_PLATFORM", "").strip().lower()
    if explicit:
        try:
            return Platform(explicit)
        except ValueError as exc:
            raise PlatformProbeError(f"unsupported_platform_override:{explicit}") from exc

    lowered = system_name.strip().lower()
    if lowered == "linux":
        if environ.get("ANDROID_ROOT") or environ.get("ANDROID_DATA"):
            return Platform.ANDROID
        return Platform.LINUX
    if lowered == "windows":
        return Platform.WINDOWS
    if lowered in {"ios", "iphoneos"}:
        return Platform.IOS
    if lowered in {"emscripten", "wasi", "web"}:
        return Platform.WEB
    raise PlatformProbeError(f"unsupported_host_system:{system_name}")


def probe_current_host(
    *,
    system_name: str | None = None,
    environ: Mapping[str, str] | None = None,
    which: Callable[[str], Optional[str]] = shutil.which,
    exists: Callable[[str], bool] = os.path.exists,
    access: Callable[[str, int], bool] = os.access,
) -> CapabilitySnapshot:
    """Return observed capabilities without performing any mutating effect.

    Windows WHPX is deliberately not inferred from OS identity. A future native
    adapter must provide a verified WHPX capability to the classifier. Likewise,
    repository vendor/source presence is never treated as an executable backend.
    """

    env = os.environ if environ is None else environ
    system = host_platform.system() if system_name is None else system_name
    target = _detect_platform(system, env)
    backends: set[str] = set()
    hardware = False
    permission = False

    if _has_qemu(which):
        backends.add("QEMU")

    if target is Platform.LINUX:
        if _kvm_usable(exists, access):
            backends.add("KVM")
            hardware = True

    elif target is Platform.ANDROID:
        kvm = _kvm_usable(exists, access)
        vm_cli = bool(
            which("vm")
            or exists("/apex/com.android.virt/bin/vm")
            or exists("/system/bin/vm")
        )
        crosvm = bool(which("crosvm"))
        if vm_cli:
            backends.add("AVF")
        if crosvm:
            backends.add("CROSVM")
        hardware = kvm
        permission = bool(kvm and vm_cli and crosvm)

    elif target is Platform.WEB:
        # Python/WASI presence cannot turn the browser into a native hypervisor.
        backends.clear()

    # iOS and Windows intentionally remain conservative. QEMU, when actually
    # executable, is observable as fallback; native acceleration needs a native
    # adapter/probe and cannot be inferred from the operating-system name.
    return CapabilitySnapshot(
        platform=target,
        available_backends=frozenset(backends),
        hardware_virtualization=hardware,
        native_permission=permission,
    )
