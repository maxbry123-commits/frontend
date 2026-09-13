import sys
from pathlib import Path
import unittest

SRC = Path(__file__).resolve().parents[1] / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from uek.platform_matrix import CapabilitySnapshot, SupportState
from uek.sandbox_router import SandboxBackend, SandboxLifecycle, SandboxRequest
from uek.virtual_machine_manager import VirtualMachineManager


class FakeDriver:
    def __init__(self):
        self.calls = []

    def create(self, sandbox_id, spec):
        self.calls.append(("create", sandbox_id, dict(spec)))
        return f"handle:{sandbox_id}"

    def start(self, handle):
        self.calls.append(("start", handle))

    def stop(self, handle):
        self.calls.append(("stop", handle))

    def destroy(self, handle):
        self.calls.append(("destroy", handle))


class VirtualMachineManagerTests(unittest.TestCase):
    def test_manager_delegates_to_existing_lifecycle_without_duplicate_effects(self):
        driver = FakeDriver()
        lifecycle = SandboxLifecycle({SandboxBackend.QEMU: driver})
        manager = VirtualMachineManager(lifecycle)
        snapshot = CapabilitySnapshot.from_values("linux", ["QEMU"])

        first = manager.create("vm-1", snapshot, SandboxRequest(), {"disk": "root.img"})
        again = manager.create("vm-1", snapshot, SandboxRequest(), {"disk": "root.img"})
        self.assertIs(first, again)
        manager.start("vm-1")
        manager.start("vm-1")
        manager.stop("vm-1")
        manager.stop("vm-1")
        manager.destroy("vm-1")
        manager.destroy("vm-1")
        self.assertEqual([call[0] for call in driver.calls], ["create", "start", "stop", "destroy"])

    def test_route_is_fail_closed_when_no_verified_backend_exists(self):
        lifecycle = SandboxLifecycle({})
        manager = VirtualMachineManager(lifecycle)
        route = manager.route(CapabilitySnapshot.from_values("web", ["QEMU"]))
        self.assertEqual(route.state, SupportState.BLOCKED)
        self.assertIsNone(route.backend)

    def test_registered_backends_are_read_only_view_of_canonical_lifecycle(self):
        lifecycle = SandboxLifecycle({SandboxBackend.QEMU: FakeDriver()})
        manager = VirtualMachineManager(lifecycle)
        self.assertEqual(manager.registered_backends, frozenset({SandboxBackend.QEMU}))

    def test_invalid_lifecycle_is_rejected(self):
        with self.assertRaisesRegex(TypeError, "sandbox_lifecycle_required"):
            VirtualMachineManager(object())


if __name__ == "__main__":
    unittest.main()
