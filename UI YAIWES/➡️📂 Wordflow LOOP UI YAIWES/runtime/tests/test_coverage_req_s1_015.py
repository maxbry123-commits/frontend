import sys
from pathlib import Path
import unittest

SRC = Path(__file__).resolve().parents[1] / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from governance.external_policy import OpaPolicyAdapter
from plugins.activation import ActivationRejectedError, build_runtime_registry
from plugins.contract import PluginKind, PluginSpec


class ReqS1015CapabilityGovernanceTests(unittest.TestCase):
    def test_tools_are_capabilities_not_implicit_authority(self):
        spec = PluginSpec(
            name="example_tool",
            kind=PluginKind.TOOL,
            capabilities=("filesystem.read",),
            source_path="runtime/vendor/example_tool",
            source_tree_sha="a" * 40,
            mount_path="runtime/vendor/example_tool",
            enabled=False,
            workflow_owner=False,
            factory_key="example_tool",
        )
        self.assertEqual(spec.capabilities, ("filesystem.read",))
        self.assertFalse(spec.enabled)
        self.assertFalse(spec.workflow_owner)

    def test_unapproved_tool_activation_fails_closed(self):
        with self.assertRaises(ActivationRejectedError):
            build_runtime_registry(["pytest"])

    def test_external_policy_denial_is_preserved(self):
        def transport(method, url, payload):
            self.assertEqual(method, "POST")
            self.assertIn("/v1/data/yaiwes/allow", url)
            self.assertIn("input", payload)
            return {"result": False}

        decision = OpaPolicyAdapter(transport).decide(
            {"capability": "filesystem.read", "subject": "worker"}
        )
        self.assertFalse(decision.allowed)
        self.assertEqual(decision.provider, "opa")


if __name__ == "__main__":
    unittest.main()
