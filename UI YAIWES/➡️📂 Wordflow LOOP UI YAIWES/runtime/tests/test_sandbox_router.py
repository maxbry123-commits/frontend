import sys
from pathlib import Path
import unittest

SRC = Path(__file__).resolve().parents[1] / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from uek.platform_matrix import CapabilitySnapshot, SupportState
from uek.sandbox_router import (
    BACKEND_SOURCE_PATHS,
    SandboxBackend,
    SandboxContractError,
    SandboxEffectError,
    SandboxKind,
    SandboxLifecycle,
    SandboxRequest,
    SandboxUnavailable,
    route_sandbox,
)


class FakeDriver:
    def __init__(self, fail=None):
        self.calls = []
        self.fail = fail

    def _record(self, name, *args):
        self.calls.append((name, *args))
        if self.fail == name:
            raise RuntimeError(name)

    def create(self, sandbox_id, spec):
        self._record("create", sandbox_id, dict(spec))
        return f"handle:{sandbox_id}"

    def start(self, handle):
        self._record("start", handle)

    def stop(self, handle):
        self._record("stop", handle)

    def destroy(self, handle):
        self._record("destroy", handle)


class SandboxRouterTests(unittest.TestCase):
    def test_all_canonical_source_donors_are_registered_without_implying_runtime(self):
        self.assertEqual(
            set(BACKEND_SOURCE_PATHS),
            {
                SandboxBackend.FIRECRACKER,
                SandboxBackend.GVISOR,
                SandboxBackend.QEMU,
                SandboxBackend.CROSVM,
                SandboxBackend.NSJAIL,
            },
        )

    def test_web_is_blocked_even_if_qemu_source_or_probe_name_is_present(self):
        route = route_sandbox(
            CapabilitySnapshot.from_values("web", ["QEMU"]),
            SandboxRequest(),
        )
        self.assertEqual(route.state, SupportState.BLOCKED)
        self.assertIsNone(route.backend)

    def test_linux_firecracker_requires_verified_kvm_and_hardware_virtualization(self):
        route = route_sandbox(
            CapabilitySnapshot.from_values(
                "linux",
                ["FIRECRACKER", "KVM"],
                hardware_virtualization=True,
            ),
            SandboxRequest(),
        )
        self.assertEqual(route.backend, SandboxBackend.FIRECRACKER)
        self.assertEqual(route.state, SupportState.SUPPORTED)
        self.assertTrue(route.accelerated)

    def test_linux_qemu_is_conditional_software_fallback_without_kvm(self):
        route = route_sandbox(
            CapabilitySnapshot.from_values("linux", ["QEMU"]),
            SandboxRequest(),
        )
        self.assertEqual(route.backend, SandboxBackend.QEMU)
        self.assertEqual(route.state, SupportState.CONDITIONAL)
        self.assertFalse(route.accelerated)

    def test_android_crosvm_requires_avf_permission_and_hardware_virtualization(self):
        route = route_sandbox(
            CapabilitySnapshot.from_values(
                "android",
                ["AVF", "CROSVM"],
                hardware_virtualization=True,
                native_permission=True,
            ),
            SandboxRequest(),
        )
        self.assertEqual(route.backend, SandboxBackend.CROSVM)
        self.assertEqual(route.state, SupportState.SUPPORTED)
        self.assertTrue(route.accelerated)

    def test_android_missing_permission_falls_back_only_to_verified_qemu(self):
        route = route_sandbox(
            CapabilitySnapshot.from_values(
                "android",
                ["AVF", "CROSVM", "QEMU"],
                hardware_virtualization=True,
                native_permission=False,
            ),
            SandboxRequest(),
        )
        self.assertEqual(route.backend, SandboxBackend.QEMU)
        self.assertEqual(route.state, SupportState.CONDITIONAL)

    def test_linux_gvisor_and_nsjail_are_isolation_routes_not_vm_routes(self):
        snapshot = CapabilitySnapshot.from_values("linux", ["GVISOR", "NSJAIL"])
        container = route_sandbox(snapshot, SandboxRequest(SandboxKind.CONTAINER))
        process = route_sandbox(snapshot, SandboxRequest(SandboxKind.PROCESS))
        vm = route_sandbox(snapshot, SandboxRequest(SandboxKind.VM))
        self.assertEqual(container.backend, SandboxBackend.GVISOR)
        self.assertEqual(process.backend, SandboxBackend.NSJAIL)
        self.assertEqual(vm.state, SupportState.BLOCKED)

    def test_preferred_backend_unavailable_fails_closed_instead_of_silent_fallback(self):
        snapshot = CapabilitySnapshot.from_values("linux", ["QEMU"])
        route = route_sandbox(
            snapshot,
            SandboxRequest(SandboxKind.VM, SandboxBackend.FIRECRACKER),
        )
        self.assertEqual(route.state, SupportState.BLOCKED)
        self.assertIsNone(route.backend)
        self.assertIn("preferred_backend_unavailable", route.reason)

    def test_missing_driver_rejects_create_before_any_effect(self):
        lifecycle = SandboxLifecycle({})
        snapshot = CapabilitySnapshot.from_values("linux", ["QEMU"])
        with self.assertRaises(SandboxUnavailable):
            lifecycle.create("vm-1", snapshot, SandboxRequest(), {})
        self.assertEqual(lifecycle._records, {})

    def test_lifecycle_is_idempotent_and_does_not_duplicate_effects(self):
        driver = FakeDriver()
        lifecycle = SandboxLifecycle({SandboxBackend.QEMU: driver})
        snapshot = CapabilitySnapshot.from_values("linux", ["QEMU"])
        first = lifecycle.create(
            "vm-1",
            snapshot,
            SandboxRequest(),
            {"disk": "root.img"},
        )
        again = lifecycle.create(
            "vm-1",
            snapshot,
            SandboxRequest(),
            {"disk": "root.img"},
        )
        self.assertIs(first, again)
        lifecycle.start("vm-1")
        lifecycle.start("vm-1")
        lifecycle.stop("vm-1")
        lifecycle.stop("vm-1")
        lifecycle.destroy("vm-1")
        lifecycle.destroy("vm-1")
        self.assertEqual(
            [call[0] for call in driver.calls],
            ["create", "start", "stop", "destroy"],
        )

    def test_create_failure_leaves_no_canonical_record(self):
        driver = FakeDriver(fail="create")
        lifecycle = SandboxLifecycle({SandboxBackend.QEMU: driver})
        snapshot = CapabilitySnapshot.from_values("linux", ["QEMU"])
        with self.assertRaises(SandboxEffectError):
            lifecycle.create("vm-1", snapshot, SandboxRequest(), {})
        self.assertEqual(lifecycle._records, {})

    def test_destroy_running_is_rejected_before_driver_effect(self):
        driver = FakeDriver()
        lifecycle = SandboxLifecycle({SandboxBackend.QEMU: driver})
        snapshot = CapabilitySnapshot.from_values("linux", ["QEMU"])
        lifecycle.create("vm-1", snapshot, SandboxRequest(), {})
        lifecycle.start("vm-1")
        with self.assertRaises(SandboxContractError):
            lifecycle.destroy("vm-1")
        self.assertNotIn("destroy", [call[0] for call in driver.calls])


if __name__ == "__main__":
    unittest.main()
