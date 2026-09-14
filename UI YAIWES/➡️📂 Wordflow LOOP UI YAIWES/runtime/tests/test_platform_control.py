import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from uek.platform_control import (
    BackendDescriptor,
    BackendRegistry,
    COMMON_PLATFORM_PROTOCOL,
    PlatformControlError,
    PlatformUpdateManager,
    UpdateCandidate,
    UpdateState,
)
from uek.platform_matrix import Platform


class PlatformControlTests(unittest.TestCase):
    def _registry(self) -> BackendRegistry:
        return BackendRegistry(
            (
                BackendDescriptor(
                    "QEMU-WINDOWS",
                    frozenset({Platform.WINDOWS}),
                    frozenset({"x86_64"}),
                    "9.1.0",
                    verified_runtime=True,
                ),
                BackendDescriptor(
                    "KVM-QEMU",
                    frozenset({Platform.LINUX}),
                    frozenset({"x86_64", "arm64"}),
                    "9.1.0",
                    verified_runtime=True,
                ),
                BackendDescriptor(
                    "AVF-CROSVM",
                    frozenset({Platform.ANDROID}),
                    frozenset({"arm64"}),
                    "1.4.0",
                    verified_runtime=True,
                ),
                BackendDescriptor(
                    "IOS-MIRROR-SOURCE",
                    frozenset({Platform.IOS}),
                    frozenset({"arm64"}),
                    "1.0.0",
                    verified_runtime=False,
                ),
            )
        )

    def test_registry_filters_unverified_backends_fail_closed(self):
        registry = self._registry()
        self.assertEqual(registry.eligible(Platform.IOS, "arm64"), ())
        self.assertNotIn("IOS-MIRROR-SOURCE", registry.verified_names)
        with self.assertRaisesRegex(
            PlatformControlError, "backend_not_runtime_verified:IOS-MIRROR-SOURCE"
        ):
            registry.require_verified("IOS-MIRROR-SOURCE", Platform.IOS, "arm64")

    def test_mandatory_platform_coverage_is_architecture_specific(self):
        registry = self._registry()
        self.assertEqual(
            registry.missing_mandatory_platforms("arm64"),
            frozenset({Platform.WINDOWS}),
        )
        self.assertEqual(
            registry.missing_mandatory_platforms("amd64"),
            frozenset({Platform.ANDROID}),
        )

    def test_common_protocol_is_required(self):
        with self.assertRaisesRegex(PlatformControlError, "backend_protocol_mismatch"):
            BackendRegistry(
                (
                    BackendDescriptor(
                        "BAD",
                        frozenset({Platform.LINUX}),
                        frozenset({"x86_64"}),
                        "1.0.0",
                        protocol="other/v1",
                        verified_runtime=True,
                    ),
                )
            )
        self.assertEqual(COMMON_PLATFORM_PROTOCOL, "yaiwes.platform/v1")

    def test_update_manager_approves_only_newer_verified_candidate(self):
        manager = PlatformUpdateManager(self._registry())
        approved = manager.assess(
            UpdateCandidate(
                "KVM-QEMU",
                Platform.LINUX,
                "amd64",
                "9.2.0",
                "a" * 64,
            )
        )
        self.assertEqual(approved.state, UpdateState.APPROVED)
        self.assertTrue(approved.executable)

        current = manager.assess(
            UpdateCandidate(
                "KVM-QEMU",
                Platform.LINUX,
                "x86_64",
                "9.1.0",
                "b" * 64,
            )
        )
        self.assertEqual(current.state, UpdateState.CURRENT)
        self.assertFalse(current.executable)

        downgrade = manager.assess(
            UpdateCandidate(
                "KVM-QEMU",
                Platform.LINUX,
                "x86_64",
                "8.9.0",
                "c" * 64,
            )
        )
        self.assertEqual(downgrade.state, UpdateState.BLOCKED)
        self.assertFalse(downgrade.executable)

    def test_update_manager_rejects_invalid_digest_protocol_arch_and_platform(self):
        manager = PlatformUpdateManager(self._registry())
        with self.assertRaisesRegex(PlatformControlError, "update_sha256_invalid"):
            manager.assess(
                UpdateCandidate(
                    "KVM-QEMU", Platform.LINUX, "x86_64", "9.2.0", "not-a-hash"
                )
            )
        with self.assertRaisesRegex(PlatformControlError, "update_protocol_mismatch"):
            manager.assess(
                UpdateCandidate(
                    "KVM-QEMU",
                    Platform.LINUX,
                    "x86_64",
                    "9.2.0",
                    "d" * 64,
                    protocol="other/v1",
                )
            )
        with self.assertRaisesRegex(PlatformControlError, "backend_architecture_mismatch"):
            manager.assess(
                UpdateCandidate(
                    "QEMU-WINDOWS", Platform.WINDOWS, "arm64", "9.2.0", "e" * 64
                )
            )
        with self.assertRaisesRegex(PlatformControlError, "backend_platform_mismatch"):
            manager.assess(
                UpdateCandidate(
                    "KVM-QEMU", Platform.WINDOWS, "x86_64", "9.2.0", "f" * 64
                )
            )

    def test_duplicate_backend_and_invalid_descriptor_are_rejected(self):
        row = BackendDescriptor(
            "KVM-QEMU",
            frozenset({Platform.LINUX}),
            frozenset({"x86_64"}),
            "9.1.0",
            verified_runtime=True,
        )
        with self.assertRaisesRegex(PlatformControlError, "duplicate_backend:KVM-QEMU"):
            BackendRegistry((row, row))
        with self.assertRaisesRegex(PlatformControlError, "backend_version_invalid"):
            BackendRegistry(
                (
                    BackendDescriptor(
                        "BAD-VERSION",
                        frozenset({Platform.LINUX}),
                        frozenset({"x86_64"}),
                        "latest",
                        verified_runtime=True,
                    ),
                )
            )


if __name__ == "__main__":
    unittest.main()
