import sys
from pathlib import Path
import unittest

SRC = Path(__file__).resolve().parents[1] / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from plugins.contract import PluginKind, PluginSpec
from plugins.fables import FABLES_CONTRACT, FablesContractError, FablesSocket
from plugins.mount_guard import MountRejectedError
from plugins.registry import PluginRegistry


class FablesSocketTests(unittest.TestCase):
    def _registry(self, *, enabled: bool = True) -> PluginRegistry:
        registry = PluginRegistry()
        registry.register(
            PluginSpec(
                "demo",
                PluginKind.ADAPTER,
                ("demo.read",),
                "components/demo",
                "a" * 40,
                "demo",
                enabled=enabled,
                factory_key="demo",
            )
        )
        return registry

    def test_contract_identity_is_explicit(self):
        self.assertEqual(FablesSocket.contract, FABLES_CONTRACT)
        self.assertEqual(FABLES_CONTRACT, "yaiwes.fables.v1")

    def test_mount_requires_declared_capability(self):
        socket = FablesSocket(self._registry(), {"demo": lambda: {"ok": True}})
        with self.assertRaises(FablesContractError):
            socket.mount("demo", "demo.write")

    def test_existing_mount_guard_remains_authoritative(self):
        socket = FablesSocket(self._registry(enabled=False), {"demo": lambda: {"ok": True}})
        with self.assertRaises(MountRejectedError):
            socket.mount("demo", "demo.read")

    def test_explicit_identity_and_capability_mounts(self):
        socket = FablesSocket(self._registry(), {"demo": lambda: {"ok": True}})
        self.assertEqual(socket.mount("demo", "demo.read"), {"ok": True})


if __name__ == "__main__":
    unittest.main()
