import sys
from pathlib import Path
import unittest

SRC = Path(__file__).resolve().parents[1] / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from plugins.activation import build_runtime_registry
from plugins.loader import PluginLoader
from plugins.pycasbin_adapter import EXPECTED_PYCASBIN_VERSION, PyCasbinDependencies, PyCasbinVersionError, build_pycasbin_factories, create_pycasbin_runtime


class FakeEnforcer:
    def __init__(self, allowed=True):
        self.allowed = allowed

    def enforce(self, subject, obj, action):
        return self.allowed and (subject, obj, action) == ("alice", "data1", "read")


class PyCasbinAdapterTests(unittest.TestCase):
    def test_enforcement_version_gate_and_loader(self):
        deps = PyCasbinDependencies(FakeEnforcer, EXPECTED_PYCASBIN_VERSION)
        runtime = create_pycasbin_runtime(deps)
        self.assertTrue(runtime.healthy)
        mounted = PluginLoader(build_runtime_registry(["apache_pycasbin"]), build_pycasbin_factories(deps)).mount("apache_pycasbin")
        enforcer = mounted.new_enforcer(True)
        self.assertTrue(mounted.enforce(enforcer, "alice", "data1", "read"))
        self.assertFalse(mounted.enforce(enforcer, "bob", "data1", "read"))

    def test_wrong_version_fails_closed(self):
        with self.assertRaises(PyCasbinVersionError):
            create_pycasbin_runtime(PyCasbinDependencies(FakeEnforcer, "0.0.0"))


if __name__ == "__main__":
    unittest.main()
