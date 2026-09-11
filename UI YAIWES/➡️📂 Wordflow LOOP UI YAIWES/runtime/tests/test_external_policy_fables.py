import sys
from pathlib import Path
import unittest

SRC = Path(__file__).resolve().parents[1] / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from governance.external_policy import (
    OPENFGA_CAPABILITY,
    OPA_CAPABILITY,
    OpenFgaPolicyAdapter,
    OpaPolicyAdapter,
    PolicyDecisionError,
    build_external_policy_socket,
)
from plugins.fables import FablesContractError


class ExternalPolicyFablesTests(unittest.TestCase):
    def test_opa_mounts_through_fables_and_decides(self):
        calls = []

        def transport(method, url, payload):
            calls.append((method, url, payload))
            return {"result": {"allow": True}}

        socket = build_external_policy_socket(transport)
        adapter = socket.mount("opa", OPA_CAPABILITY)
        self.assertIsInstance(adapter, OpaPolicyAdapter)
        decision = adapter.decide({"subject": "alice"}, "yaiwes/allow")
        self.assertTrue(decision.allowed)
        self.assertEqual(decision.provider, "opa")
        self.assertEqual(calls[0][0], "POST")
        self.assertTrue(calls[0][1].endswith("/v1/data/yaiwes/allow"))
        self.assertEqual(calls[0][2], {"input": {"subject": "alice"}})

    def test_openfga_mounts_through_fables_and_checks(self):
        calls = []

        def transport(method, url, payload):
            calls.append((method, url, payload))
            return {"allowed": False}

        socket = build_external_policy_socket(transport)
        adapter = socket.mount("openfga", OPENFGA_CAPABILITY)
        self.assertIsInstance(adapter, OpenFgaPolicyAdapter)
        decision = adapter.check(
            "store-1",
            {"user": "user:alice", "relation": "viewer", "object": "document:1"},
            authorization_model_id="model-1",
        )
        self.assertFalse(decision.allowed)
        self.assertEqual(decision.provider, "openfga")
        self.assertTrue(calls[0][1].endswith("/stores/store-1/check"))
        self.assertEqual(calls[0][2]["authorization_model_id"], "model-1")

    def test_undeclared_capability_is_rejected_by_fables(self):
        socket = build_external_policy_socket(lambda *_: {})
        with self.assertRaises(FablesContractError):
            socket.mount("opa", OPENFGA_CAPABILITY)

    def test_opa_missing_boolean_fails_closed(self):
        adapter = OpaPolicyAdapter(lambda *_: {"result": {"reason": "unknown"}})
        with self.assertRaises(PolicyDecisionError):
            adapter.decide({"subject": "alice"})

    def test_openfga_missing_allowed_fails_closed(self):
        adapter = OpenFgaPolicyAdapter(lambda *_: {"decision": True})
        with self.assertRaises(PolicyDecisionError):
            adapter.check("store-1", {"user": "u", "relation": "r", "object": "o"})

    def test_transport_failure_is_fail_closed(self):
        def broken(*_):
            raise OSError("network down")

        with self.assertRaises(PolicyDecisionError):
            OpaPolicyAdapter(broken).decide({"x": 1})
        with self.assertRaises(PolicyDecisionError):
            OpenFgaPolicyAdapter(broken).check("store-1", {"user": "u", "relation": "r", "object": "o"})


if __name__ == "__main__":
    unittest.main()
