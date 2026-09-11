import sys
from pathlib import Path
import unittest

SRC = Path(__file__).resolve().parents[1] / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from plugins.activation import ActivationRejectedError, build_runtime_registry
from plugins.catalog import COMPONENTS, build_registry
from plugins.contract import PluginKind, PluginSpec
from plugins.loader import PluginLoader
from plugins.mount_guard import MountGuard, MountRejectedError
from plugins.registry import PluginRegistry


class UniversalPluginTests(unittest.TestCase):
    def test_catalog_is_14_unique_components(self):
        registry = build_registry()
        self.assertEqual(len(COMPONENTS), 14)
        self.assertEqual(len(registry.all()), 14)
        self.assertEqual(registry.workflow_owner.name, "stabilize_core")

    def test_no_component_is_mounted_before_wiring(self):
        self.assertFalse(any(spec.enabled for spec in COMPONENTS))

    def test_disabled_plugin_fails_closed(self):
        with self.assertRaises(MountRejectedError):
            PluginLoader(build_registry(), {}).mount("stabilize_core")

    def test_non_stabilize_workflow_owner_is_rejected(self):
        spec = PluginSpec(
            "rogue",
            PluginKind.CORE,
            ("workflow.owner",),
            "components/rogue",
            "a" * 40,
            "src/rogue",
            enabled=True,
            workflow_owner=True,
            factory_key="rogue",
        )
        with self.assertRaises(MountRejectedError):
            MountGuard().validate(spec)

    def test_catalog_only_adapters_remain_fail_closed(self):
        for name in ("pycasbin", "opentelemetry_python"):
            with self.subTest(name=name):
                with self.assertRaises(ActivationRejectedError):
                    build_runtime_registry([name])

    def test_donor_ui_and_tool_entries_remain_fail_closed(self):
        for name in ("dagu", "redun", "pytest", "librechat"):
            with self.subTest(name=name):
                with self.assertRaises(ActivationRejectedError):
                    build_runtime_registry([name])

    def test_explicit_factory_mounts(self):
        spec = PluginSpec(
            "safe",
            PluginKind.ADAPTER,
            ("demo.safe",),
            "components/safe",
            "b" * 40,
            "safe",
            enabled=True,
            factory_key="safe",
        )
        registry = PluginRegistry()
        registry.register(spec)
        mounted = PluginLoader(registry, {"safe": lambda: {"mounted": True}}).mount("safe")
        self.assertEqual(mounted, {"mounted": True})


if __name__ == "__main__":
    unittest.main()
