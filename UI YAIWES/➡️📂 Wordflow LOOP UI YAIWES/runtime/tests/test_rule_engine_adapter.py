import sys
from pathlib import Path
import unittest

SRC = Path(__file__).resolve().parents[1] / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from plugins.activation import build_runtime_registry
from plugins.loader import PluginLoader
from plugins.rule_engine_adapter import (
    EXPECTED_RULE_ENGINE_VERSION,
    RuleEngineDependencies,
    RuleEngineVersionError,
    build_rule_engine_factories,
    create_rule_engine_runtime,
    vendor_root,
)


class FakeRule:
    def __init__(self, expression):
        self.expression = expression

    @classmethod
    def is_valid(cls, expression):
        return expression == "allow"

    def evaluate(self, thing):
        return thing.get("allow", False)

    def matches(self, thing):
        return bool(self.evaluate(thing))

    def filter(self, things):
        return (thing for thing in things if self.matches(thing))


class RuleEngineAdapterTests(unittest.TestCase):
    def test_version_gate_accepts_expected_version(self):
        runtime = create_rule_engine_runtime(
            RuleEngineDependencies(FakeRule, EXPECTED_RULE_ENGINE_VERSION)
        )
        self.assertTrue(runtime.healthy)

    def test_version_gate_rejects_wrong_version(self):
        with self.assertRaises(RuleEngineVersionError):
            create_rule_engine_runtime(RuleEngineDependencies(FakeRule, "0.0.0"))

    def test_runtime_operations_are_deterministic(self):
        runtime = create_rule_engine_runtime(
            RuleEngineDependencies(FakeRule, EXPECTED_RULE_ENGINE_VERSION)
        )
        self.assertTrue(runtime.is_valid("allow"))
        self.assertFalse(runtime.is_valid("deny"))
        self.assertTrue(runtime.matches("allow", {"allow": True}))
        self.assertEqual(runtime.evaluate("allow", {"allow": False}), False)
        self.assertEqual(runtime.filter("allow", [{"allow": True}, {"allow": False}]), [{"allow": True}])

    def test_universal_loader_mounts_rule_engine_factory(self):
        runtime = PluginLoader(
            build_runtime_registry(["rule_engine"]),
            build_rule_engine_factories(
                RuleEngineDependencies(FakeRule, EXPECTED_RULE_ENGINE_VERSION)
            ),
        ).mount("rule_engine")
        self.assertTrue(runtime.healthy)

    def test_vendored_package_source_is_present(self):
        self.assertTrue((vendor_root() / "rule_engine" / "__init__.py").is_file())


if __name__ == "__main__":
    unittest.main()
