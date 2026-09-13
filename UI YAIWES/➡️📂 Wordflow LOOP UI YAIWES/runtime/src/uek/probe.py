"""Read-only host capability probe for the N06/N10 platform matrix.

The probe observes executable/device availability and, on Android, verifies the
platform-declared AVF feature before advertising AVF/crosvm as executable. It
never launches a VM, changes host state, or treats repository source presence
as runtime support. Sandbox lifecycle remains owned by N20.
"""
from __future__ import annotations

from collections.abc import Callable, Mapping
from dataclasses import dataclass
import os
import platform as host_platform
import shutil
import subprocess
from typing import Optional

from .platform_matrix import CapabilitySnapshot, Platform


AVF_FEATURE = "android.software.virtualization_framework"
AVF_VM_PATH = "/apex/com.android.virt/bin/vm"
AVF_CROSVM_PATH = "/apex/com.android.virt/bin/crosvm"


class PlatformProbeError(RuntimeError):
    pass


@dataclass(frozen=True)
class AndroidAvfEvidence:
    """Read-only Android AVF facts from platform-owned signals."""

    feature_declared: bool
    abi: str
    cuttlefish: bool
    vm_cli_present: bool
    crosvm_present: bool

    @property
    def executable(self) -> bool:
        return bool(
            self.feature_declared
            and self.abi in {"arm64-v8a", "x86_64"}
            and self.vm_cli_present
            and self.crosvm_present
        )

    @property
    def protected_vm_supported(self) -> bool | None:
        # AOSP AVF documents Cuttlefish as non-protected-VM only. For physical
        # devices capability must be queried by the AVF API; do not infer it.
        return False if self.cuttlefish else None


CommandRunner = Callable[[tuple[str, ...]], tuple[int, str]]


def _run_readonly(command: tuple[str, ...]) -> tuple[int, str]:
    """Run one bounded read-only platform query; failures fail closed."""

    try:
        completed = subprocess.run(
            command,
            check=False,
            capture_output=True,
            text=True,
            timeout=2,
        )
    except (OSError, subprocess.SubprocessError):
        return 127, ""
    return completed.returncode, completed.stdout.strip()


def _query(command: tuple[str, ...], run_command: CommandRunner) -> tuple[int, str]:
    try:
        code, output = run_command(command)
    except Exception:
        return 127, ""
    try:
        return int(code), str(output).strip()
    except (TypeError, ValueError):
        return 127, ""


def _getprop(name: str, run_command: CommandRunner) -> str:
    code, output = _query(("getprop", name), run_command)
    return output if code == 0 else ""


def _pm_has_avf_feature(run_command: CommandRunner) -> bool:
    code, output = _query(("pm", "has-feature", AVF_FEATURE), run_command)
    return code == 0 and output.lower() == "true"


def _is_cuttlefish(device: str, model: str, name: str) -> bool:
    """Match the three-property Cuttlefish identity used by AOSP CTS."""

    return bool(
        device.startswith("vsoc_")
        and model.startswith("Cuttlefish ")
        and (name.startswith("cf_") or name.startswith("aosp_cf_"))
    )


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


def probe_android_avf_runtime(
    *,
    which: Callable[[str], Optional[str]] = shutil.which,
    exists: Callable[[str], bool] = os.path.exists,
    run_command: CommandRunner = _run_readonly,
) -> AndroidAvfEvidence:
    """Verify AVF from Android-owned feature/property/APEX signals.

    ``pm has-feature`` is the authoritative support gate. AOSP ships the AVF
    ``vm`` and crosvm binaries in ``com.android.virt``; their presence is
    necessary runtime evidence but cannot make a feature-less device supported.
    """

    feature_declared = _pm_has_avf_feature(run_command)
    abi = _getprop("ro.product.cpu.abi", run_command)
    device = _getprop("ro.product.device", run_command)
    model = _getprop("ro.product.model", run_command)
    name = _getprop("ro.product.name", run_command)
    vm_cli = bool(which("vm") or exists(AVF_VM_PATH) or exists("/system/bin/vm"))
    crosvm = bool(which("crosvm") or exists(AVF_CROSVM_PATH))
    return AndroidAvfEvidence(
        feature_declared=feature_declared,
        abi=abi,
        cuttlefish=_is_cuttlefish(device, model, name),
        vm_cli_present=vm_cli,
        crosvm_present=crosvm,
    )


def probe_current_host(
    *,
    system_name: str | None = None,
    environ: Mapping[str, str] | None = None,
    which: Callable[[str], Optional[str]] = shutil.which,
    exists: Callable[[str], bool] = os.path.exists,
    access: Callable[[str, int], bool] = os.access,
    run_command: CommandRunner = _run_readonly,
) -> CapabilitySnapshot:
    """Return observed capabilities without performing any mutating effect.

    Windows WHPX is deliberately not inferred from OS identity. A future native
    adapter must provide a verified WHPX capability to the classifier. Likewise,
    repository vendor/source presence is never treated as an executable backend.
    On Android, AVF is advertised only when the framework feature plus its APEX
    runtime binaries and a supported 64-bit ABI are all observed.
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
        avf = probe_android_avf_runtime(
            which=which,
            exists=exists,
            run_command=run_command,
        )
        if avf.executable:
            backends.update({"AVF", "CROSVM"})
            hardware = True
            permission = True

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
