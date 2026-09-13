import sys
from pathlib import Path
import unittest

SRC = Path(__file__).resolve().parents[1] / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from integration.integration_state import (
    FablesIntegrationBoundary,
    IntegrationStateError,
    LaneResult,
    consolidate_integration,
)
from plugins.contract import PluginKind, PluginSpec
from plugins.fables import FablesContractError, FablesSocket
from plugins.registry import PluginRegistry


class IntegrationStateTests(unittest.TestCase):
    def _socket(self) -> FablesSocket:
        registry = PluginRegistry()
        registry.register(
            PluginSpec(
                "demo",
                PluginKind.ADAPTER,
                ("demo.integrate",),
                "components/demo",
                "a" * 40,
                "demo",
                enabled=True,
                factory_key="demo",
            )
        )
        return FablesSocket(registry, {"demo": lambda: {"value": 7}})

    def test_multiple_passing_lanes_converge_to_pass_with_evidence(self):
        state = consolidate_integration(
            [
                LaneResult("policy", True, ("run:1", "blob:a")),
                LaneResult("memory", True, ("run:2", "blob:b")),
            ]
        )
        self.assertTrue(state.passed)
        self.assertEqual(state.state, "PASS")
        self.assertEqual(state.evidence, ("run:1", "blob:a", "run:2", "blob:b"))
        self.assertEqual(state.gaps, ())

    def test_any_failed_lane_keeps_global_state_gap(self):
        state = consolidate_integration(
            [
                LaneResult("policy", True, ("run:1",)),
                LaneResult("recovery", False, ("run:2",), ("checkpoint_mismatch",)),
            ]
        )
        self.assertFalse(state.passed)
        self.assertEqual(state.state, "GAP")
        self.assertEqual(state.gaps, ("checkpoint_mismatch",))

    def test_pass_without_evidence_is_rejected(self):
        with self.assertRaises(IntegrationStateError):
            consolidate_integration([LaneResult("policy", True)])

    def test_gap_without_explicit_reason_is_rejected(self):
        with self.assertRaises(IntegrationStateError):
            consolidate_integration([LaneResult("recovery", False, ("run:2",))])

    def test_duplicate_lane_is_rejected(self):
        with self.assertRaises(IntegrationStateError):
            consolidate_integration(
                [
                    LaneResult("policy", True, ("run:1",)),
                    LaneResult("policy", True, ("run:2",)),
                ]
            )

    def test_fables_boundary_mounts_existing_socket_and_returns_lane_result(self):
        boundary = FablesIntegrationBoundary(self._socket())
        output, result = boundary.execute(
            plugin="demo",
            capability="demo.integrate",
            lane="demo-lane",
            evidence=("test:test_integration_state",),
            operation=lambda adapter: adapter["value"] + 1,
        )
        self.assertEqual(output, 8)
        self.assertEqual(result, LaneResult("demo-lane", True, ("test:test_integration_state",)))

    def test_fables_boundary_rejects_undeclared_capability(self):
        boundary = FablesIntegrationBoundary(self._socket())
        with self.assertRaises(FablesContractError):
            boundary.execute(
                plugin="demo",
                capability="demo.mutate",
                lane="demo-lane",
                evidence=("test:test_integration_state",),
                operation=lambda adapter: adapter,
            )

    def test_fables_boundary_requires_evidence_before_effect(self):
        called = []
        boundary = FablesIntegrationBoundary(self._socket())
        with self.assertRaises(IntegrationStateError):
            boundary.execute(
                plugin="demo",
                capability="demo.integrate",
                lane="demo-lane",
                evidence=(),
                operation=lambda adapter: called.append(adapter),
            )
        self.assertEqual(called, [])


if __name__ == "__main__":
    unittest.main()
