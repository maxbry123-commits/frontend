import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from uek.platform_matrix import (
    CapabilitySnapshot,
    Platform,
    SupportState,
    assess_all,
    assess_platform,
    baseline_linear_policy_lookup,
    indexed_policy_lookup,
    policies,
    policy_fingerprint,
)


class PlatformMatrixTests(unittest.TestCase):
    def test_policy_denominator_is_exactly_five_platforms(self):
        rows = policies()
        self.assertEqual(len(rows), 5)
        self.assertEqual({row.platform for row in rows}, set(Platform))
        self.assertEqual(len({row.source_anchor for row in rows}), 5)

    def test_missing_probes_fail_closed(self):
        rows = {row.platform: row for row in assess_all(())}
        self.assertEqual(rows[Platform.WEB].state, SupportState.BLOCKED)
        self.assertEqual(rows[Platform.WINDOWS].state, SupportState.BLOCKED)
        self.assertEqual(rows[Platform.LINUX].state, SupportState.BLOCKED)
        self.assertEqual(rows[Platform.ANDROID].state, SupportState.BLOCKED)
        self.assertEqual(rows[Platform.IOS].state, SupportState.BLOCKED)

    def test_web_local_vm_is_always_blocked(self):
        row = assess_platform(
            CapabilitySnapshot.from_values(
                Platform.WEB,
                ["QEMU", "KVM", "WHPX", "AVF", "CROSVM"],
                hardware_virtualization=True,
                native_permission=True,
            )
        )
        self.assertEqual(row.state, SupportState.BLOCKED)
        self.assertIsNone(row.selected_backend)

    def test_linux_accelerated_path_requires_kvm_qemu_and_hardware(self):
        accelerated = assess_platform(
            CapabilitySnapshot.from_values(
                Platform.LINUX, ["KVM", "QEMU"], hardware_virtualization=True
            )
        )
        fallback = assess_platform(
            CapabilitySnapshot.from_values(Platform.LINUX, ["QEMU"])
        )
        no_qemu = assess_platform(
            CapabilitySnapshot.from_values(
                Platform.LINUX, ["KVM"], hardware_virtualization=True
            )
        )
        self.assertEqual(accelerated.state, SupportState.SUPPORTED)
        self.assertTrue(accelerated.accelerated)
        self.assertEqual(accelerated.selected_backend, "KVM/QEMU")
        self.assertEqual(fallback.state, SupportState.CONDITIONAL)
        self.assertEqual(fallback.selected_backend, "QEMU")
        self.assertEqual(no_qemu.state, SupportState.BLOCKED)

    def test_windows_accelerated_path_requires_whpx_qemu_and_hardware(self):
        accelerated = assess_platform(
            CapabilitySnapshot.from_values(
                Platform.WINDOWS, ["WHPX", "QEMU"], hardware_virtualization=True
            )
        )
        fallback = assess_platform(
            CapabilitySnapshot.from_values(Platform.WINDOWS, ["QEMU"])
        )
        self.assertEqual(accelerated.state, SupportState.SUPPORTED)
        self.assertEqual(accelerated.selected_backend, "WHPX/QEMU")
        self.assertTrue(accelerated.accelerated)
        self.assertEqual(fallback.state, SupportState.CONDITIONAL)
        self.assertFalse(fallback.accelerated)

    def test_android_primary_requires_avf_crosvm_hardware_and_permission(self):
        primary = assess_platform(
            CapabilitySnapshot.from_values(
                Platform.ANDROID,
                ["AVF", "CROSVM", "QEMU"],
                hardware_virtualization=True,
                native_permission=True,
            )
        )
        missing_permission = assess_platform(
            CapabilitySnapshot.from_values(
                Platform.ANDROID,
                ["AVF", "CROSVM", "QEMU"],
                hardware_virtualization=True,
                native_permission=False,
            )
        )
        self.assertEqual(primary.state, SupportState.SUPPORTED)
        self.assertEqual(primary.selected_backend, "AVF/CROSVM")
        self.assertTrue(primary.accelerated)
        self.assertEqual(missing_permission.state, SupportState.CONDITIONAL)
        self.assertEqual(missing_permission.selected_backend, "QEMU")

    def test_ios_is_never_promoted_by_qemu_source_alone(self):
        qemu = assess_platform(
            CapabilitySnapshot.from_values(Platform.IOS, ["QEMU"])
        )
        absent = assess_platform(CapabilitySnapshot.from_values(Platform.IOS))
        self.assertEqual(qemu.state, SupportState.CONDITIONAL)
        self.assertEqual(qemu.selected_backend, "QEMU")
        self.assertEqual(absent.state, SupportState.BLOCKED)

    def test_unknown_or_source_only_backend_does_not_promote(self):
        row = assess_platform(
            CapabilitySnapshot.from_values(
                Platform.LINUX, ["VENDOR_SOURCE_PRESENT", "FIRECRACKER_SOURCE"]
            )
        )
        self.assertEqual(row.state, SupportState.BLOCKED)
        self.assertIsNone(row.selected_backend)

    def test_duplicate_platform_probe_rejected(self):
        row = CapabilitySnapshot.from_values(Platform.LINUX, ["QEMU"])
        with self.assertRaisesRegex(ValueError, "duplicate_platform_snapshot:linux"):
            assess_all((row, row))

    def test_policy_fingerprint_is_deterministic(self):
        first = policy_fingerprint()
        second = policy_fingerprint()
        self.assertEqual(first, second)
        self.assertEqual(len(first), 64)

    def test_indexed_lookup_matches_linear_baseline(self):
        for platform in Platform:
            with self.subTest(platform=platform.value):
                self.assertEqual(
                    indexed_policy_lookup(platform),
                    baseline_linear_policy_lookup(platform),
                )


if __name__ == "__main__":
    unittest.main()
