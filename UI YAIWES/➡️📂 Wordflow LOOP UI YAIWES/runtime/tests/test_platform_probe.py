import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from uek.platform_matrix import Platform, SupportState, assess_platform
from uek.probe import PlatformProbeError, probe_current_host


def fake_which(names):
    names = set(names)
    return lambda name: f"/bin/{name}" if name in names else None


def fake_exists(paths):
    paths = set(paths)
    return lambda path: path in paths


def allow_paths(paths):
    paths = set(paths)
    return lambda path, _mode: path in paths


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

    def test_android_avf_crosvm_kvm_probe_can_support_primary_path(self):
        snapshot = probe_current_host(
            system_name="Linux",
            environ={"ANDROID_ROOT": "/system"},
            which=fake_which({"vm", "crosvm", "qemu-system-aarch64"}),
            exists=fake_exists({"/dev/kvm"}),
            access=allow_paths({"/dev/kvm"}),
        )
        row = assess_platform(snapshot)
        self.assertEqual(snapshot.platform, Platform.ANDROID)
        self.assertEqual(snapshot.available_backends, frozenset({"AVF", "CROSVM", "QEMU"}))
        self.assertTrue(snapshot.native_permission)
        self.assertEqual(row.state, SupportState.SUPPORTED)
        self.assertEqual(row.selected_backend, "AVF/CROSVM")

    def test_android_without_avf_permission_uses_qemu_only_conditionally(self):
        snapshot = probe_current_host(
            system_name="Linux",
            environ={"ANDROID_DATA": "/data"},
            which=fake_which({"qemu-system-aarch64"}),
            exists=fake_exists(set()),
            access=allow_paths(set()),
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


if __name__ == "__main__":
    unittest.main()
