import json
import sys
import unittest
import warnings
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from uek.platform_matrix import Platform, SupportState, assess_platform
from uek.probe import (
    AVF_CROSVM_PATH,
    AVF_FEATURE,
    AVF_VM_PATH,
    PlatformProbeError,
    probe_android_avf_runtime,
    probe_current_host,
)


def fake_which(names):
    names = set(names)
    return lambda name: f"/bin/{name}" if name in names else None


def fake_exists(paths):
    paths = set(paths)
    return lambda path: path in paths


def allow_paths(paths):
    paths = set(paths)
    return lambda path, _mode: path in paths


def fake_run(responses):
    normalized = {tuple(command): value for command, value in responses.items()}
    return lambda command: normalized.get(tuple(command), (127, ""))


def android_queries(
    *,
    feature=True,
    abi="arm64-v8a",
    device="panther",
    model="Pixel 7",
    name="aosp_panther",
    service_access=True,
):
    vm_info_result = (0, "Assignable devices:") if service_access else (1, "permission denied")
    return fake_run(
        {
            ("pm", "has-feature", AVF_FEATURE): (
                0 if feature else 1,
                "true" if feature else "false",
            ),
            ("getprop", "ro.product.cpu.abi"): (0, abi),
            ("getprop", "ro.product.device"): (0, device),
            ("getprop", "ro.product.model"): (0, model),
            ("getprop", "ro.product.name"): (0, name),
            ("/bin/vm", "info"): vm_info_result,
            (AVF_VM_PATH, "info"): vm_info_result,
            ("/system/bin/vm", "info"): vm_info_result,
        }
    )


class PlatformProbeTests(unittest.TestCase):
    def test_linux_kvm_qemu_probe_promotes_only_when_both_observed(self):
        snapshot = probe_current_host(
            system_name="Linux",
            environ={},
            which=fake_which({"qemu-system-x86_64"}),
            exists=fake_exists({"/dev/kvm"}),
            access=allow_paths({"/dev/kvm"}),
        )
        row = assess_platform(snapshot)
        self.assertEqual(snapshot.platform, Platform.LINUX)
        self.assertEqual(snapshot.available_backends, frozenset({"KVM", "QEMU"}))
        self.assertTrue(snapshot.hardware_virtualization)
        self.assertEqual(row.state, SupportState.SUPPORTED)

    def test_linux_without_executable_qemu_stays_blocked(self):
        snapshot = probe_current_host(
            system_name="Linux",
            environ={},
            which=fake_which(set()),
            exists=fake_exists({"/dev/kvm"}),
            access=allow_paths({"/dev/kvm"}),
        )
        row = assess_platform(snapshot)
        self.assertEqual(row.state, SupportState.BLOCKED)
        self.assertIsNone(row.selected_backend)

    def test_android_arm64_requires_feature_apex_and_real_avf_service_access(self):
        snapshot = probe_current_host(
            system_name="Linux",
            environ={"ANDROID_ROOT": "/system"},
            which=fake_which({"qemu-system-aarch64"}),
            exists=fake_exists({AVF_VM_PATH, AVF_CROSVM_PATH}),
            access=allow_paths(set()),
            run_command=android_queries(),
        )
        row = assess_platform(snapshot)
        self.assertEqual(snapshot.platform, Platform.ANDROID)
        self.assertEqual(
            snapshot.available_backends,
            frozenset({"AVF", "CROSVM", "QEMU"}),
        )
        self.assertTrue(snapshot.hardware_virtualization)
        self.assertTrue(snapshot.native_permission)
        self.assertEqual(row.state, SupportState.SUPPORTED)
        self.assertEqual(row.selected_backend, "AVF/CROSVM")

    def test_android_binaries_without_framework_feature_fail_closed_to_qemu(self):
        snapshot = probe_current_host(
            system_name="Linux",
            environ={"ANDROID_ROOT": "/system"},
            which=fake_which({"vm", "crosvm", "qemu-system-aarch64"}),
            exists=fake_exists({AVF_VM_PATH, AVF_CROSVM_PATH}),
            access=allow_paths({"/dev/kvm"}),
            run_command=android_queries(feature=False),
        )
        row = assess_platform(snapshot)
        self.assertNotIn("AVF", snapshot.available_backends)
        self.assertNotIn("CROSVM", snapshot.available_backends)
        self.assertFalse(snapshot.native_permission)
        self.assertEqual(row.state, SupportState.CONDITIONAL)
        self.assertEqual(row.selected_backend, "QEMU")

    def test_android_feature_and_apex_without_service_access_fail_closed(self):
        snapshot = probe_current_host(
            system_name="Linux",
            environ={"ANDROID_ROOT": "/system"},
            which=fake_which({"vm", "crosvm", "qemu-system-aarch64"}),
            exists=fake_exists({AVF_VM_PATH, AVF_CROSVM_PATH}),
            access=allow_paths(set()),
            run_command=android_queries(service_access=False),
        )
        row = assess_platform(snapshot)
        self.assertNotIn("AVF", snapshot.available_backends)
        self.assertNotIn("CROSVM", snapshot.available_backends)
        self.assertFalse(snapshot.hardware_virtualization)
        self.assertFalse(snapshot.native_permission)
        self.assertEqual(row.state, SupportState.CONDITIONAL)
        self.assertEqual(row.selected_backend, "QEMU")

    def test_unrelated_path_binaries_named_vm_and_crosvm_never_count_as_avf(self):
        snapshot = probe_current_host(
            system_name="Linux",
            environ={"ANDROID_ROOT": "/system"},
            which=fake_which({"vm", "crosvm"}),
            exists=fake_exists(set()),
            access=allow_paths(set()),
            run_command=android_queries(),
        )
        self.assertEqual(snapshot.available_backends, frozenset())
        self.assertFalse(snapshot.hardware_virtualization)
        self.assertFalse(snapshot.native_permission)
        self.assertEqual(assess_platform(snapshot).state, SupportState.BLOCKED)

    def test_cuttlefish_x86_64_is_identified_but_protected_vm_is_not_inferred(self):
        evidence = probe_android_avf_runtime(
            which=fake_which(set()),
            exists=fake_exists({AVF_VM_PATH, AVF_CROSVM_PATH}),
            run_command=android_queries(
                abi="x86_64",
                device="vsoc_x86_64",
                model="Cuttlefish x86_64 phone",
                name="aosp_cf_x86_64_phone",
            ),
        )
        self.assertTrue(evidence.feature_declared)
        self.assertTrue(evidence.cuttlefish)
        self.assertTrue(evidence.service_accessible)
        self.assertTrue(evidence.executable)
        self.assertIs(evidence.protected_vm_supported, False)

    def test_android_unsupported_abi_never_advertises_avf(self):
        snapshot = probe_current_host(
            system_name="Linux",
            environ={"ANDROID_DATA": "/data"},
            which=fake_which({"vm", "crosvm"}),
            exists=fake_exists({AVF_VM_PATH, AVF_CROSVM_PATH}),
            access=allow_paths(set()),
            run_command=android_queries(abi="armeabi-v7a"),
        )
        self.assertEqual(snapshot.available_backends, frozenset())
        self.assertFalse(snapshot.hardware_virtualization)
        self.assertFalse(snapshot.native_permission)
        self.assertEqual(assess_platform(snapshot).state, SupportState.BLOCKED)

    def test_android_query_failure_fails_closed_even_when_binaries_exist(self):
        snapshot = probe_current_host(
            system_name="Linux",
            environ={"ANDROID_DATA": "/data"},
            which=fake_which({"vm", "crosvm"}),
            exists=fake_exists({AVF_VM_PATH, AVF_CROSVM_PATH}),
            access=allow_paths(set()),
            run_command=lambda _command: (_ for _ in ()).throw(OSError("query failed")),
        )
        self.assertEqual(snapshot.available_backends, frozenset())
        self.assertFalse(snapshot.native_permission)
        self.assertEqual(assess_platform(snapshot).state, SupportState.BLOCKED)

    def test_android_without_avf_permission_uses_qemu_only_conditionally(self):
        snapshot = probe_current_host(
            system_name="Linux",
            environ={"ANDROID_DATA": "/data"},
            which=fake_which({"qemu-system-aarch64"}),
            exists=fake_exists(set()),
            access=allow_paths(set()),
            run_command=android_queries(feature=False),
        )
        row = assess_platform(snapshot)
        self.assertEqual(row.state, SupportState.CONDITIONAL)
        self.assertEqual(row.selected_backend, "QEMU")
        self.assertFalse(snapshot.native_permission)

    def test_windows_identity_does_not_invent_whpx(self):
        snapshot = probe_current_host(
            system_name="Windows",
            environ={},
            which=fake_which({"qemu-system-x86_64"}),
            exists=fake_exists(set()),
            access=allow_paths(set()),
        )
        row = assess_platform(snapshot)
        self.assertNotIn("WHPX", snapshot.available_backends)
        self.assertEqual(row.state, SupportState.CONDITIONAL)
        self.assertEqual(row.selected_backend, "QEMU")

    def test_ios_qemu_remains_conditional(self):
        snapshot = probe_current_host(
            system_name="iOS",
            environ={},
            which=fake_which({"qemu-system-aarch64"}),
            exists=fake_exists(set()),
            access=allow_paths(set()),
        )
        self.assertEqual(assess_platform(snapshot).state, SupportState.CONDITIONAL)

    def test_web_probe_cannot_smuggle_native_backend(self):
        snapshot = probe_current_host(
            system_name="Web",
            environ={},
            which=fake_which({"qemu-system-x86_64"}),
            exists=fake_exists({"/dev/kvm"}),
            access=allow_paths({"/dev/kvm"}),
        )
        self.assertEqual(snapshot.available_backends, frozenset())
        self.assertEqual(assess_platform(snapshot).state, SupportState.BLOCKED)

    def test_unknown_host_and_bad_override_fail_closed(self):
        with self.assertRaisesRegex(PlatformProbeError, "unsupported_host_system"):
            probe_current_host(system_name="Plan9", environ={})
        with self.assertRaisesRegex(PlatformProbeError, "unsupported_platform_override"):
            probe_current_host(
                system_name="Linux", environ={"YAIWES_HOST_PLATFORM": "magic"}
            )

    def test_real_ci_host_probe_is_auditable_and_never_overpromises(self):
        snapshot = probe_current_host()
        row = assess_platform(snapshot)
        payload = {
            "schema": "yaiwes.n06.real-host-probe.v1",
            "platform": snapshot.platform.value,
            "available_backends": sorted(snapshot.available_backends),
            "hardware_virtualization": snapshot.hardware_virtualization,
            "native_permission": snapshot.native_permission,
            "state": row.state.value,
            "selected_backend": row.selected_backend,
            "accelerated": row.accelerated,
            "reason": row.reason,
        }
        warnings.warn(
            "N06_REAL_HOST=" + json.dumps(payload, sort_keys=True),
            RuntimeWarning,
            stacklevel=1,
        )
        if row.state is SupportState.SUPPORTED:
            self.assertTrue(row.accelerated)
            self.assertIsNotNone(row.selected_backend)
            if snapshot.platform is Platform.LINUX:
                self.assertTrue({"KVM", "QEMU"}.issubset(snapshot.available_backends))
            elif snapshot.platform is Platform.ANDROID:
                self.assertTrue({"AVF", "CROSVM"}.issubset(snapshot.available_backends))
                self.assertTrue(snapshot.native_permission)
        if "QEMU" not in snapshot.available_backends and snapshot.platform in {
            Platform.LINUX,
            Platform.WINDOWS,
            Platform.ANDROID,
            Platform.IOS,
        }:
            self.assertEqual(row.state, SupportState.BLOCKED)


if __name__ == "__main__":
    unittest.main()
