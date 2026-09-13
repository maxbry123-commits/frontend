from __future__ import annotations

import sys
from pathlib import Path
import unittest

SRC = Path(__file__).resolve().parents[1] / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from integration.continuous_loop import (
    ContinuousLoopError,
    StrategyDelta,
    run_continuous_loop,
)
from integration.integration_state import LaneResult


class ContinuousLoopTests(unittest.TestCase):
    def audit(self, stage, result):
        self.assertEqual(result.lane, stage)
        return result

    def planner(self, stage, attempt, result):
        return StrategyDelta(
            stage=stage,
            attempt=attempt,
            gap=result.gaps[0],
            action="repair:" + result.gaps[0],
            evidence=(f"repair:{stage}:{attempt}",),
        )

    def test_gap_is_reinjected_into_same_stage_then_loop_advances(self):
        calls = []

        def runner(stage, attempt, delta):
            calls.append((stage, attempt, None if delta is None else delta.action))
            if stage == "audit" and attempt == 1:
                return LaneResult(stage, False, (), ("missing_evidence",))
            return LaneResult(stage, True, (f"ev:{stage}:{attempt}",), ())

        result = run_continuous_loop(
            ("state_delta", "audit", "next"),
            run_stage=runner,
            audit_result=self.audit,
            plan_repair=self.planner,
        )

        self.assertTrue(result.passed)
        self.assertEqual(result.stage_attempts, {"state_delta": 1, "audit": 2, "next": 1})
        self.assertEqual(
            [event.state for event in result.events],
            ["PASS", "GAP_REINJECT", "PASS", "PASS"],
        )
        self.assertEqual(
            calls,
            [
                ("state_delta", 1, None),
                ("audit", 1, None),
                ("audit", 2, "repair:missing_evidence"),
                ("next", 1, None),
            ],
        )
        self.assertIn("repair:audit:1", result.evidence)

    def test_unresolved_gap_stops_before_later_stage(self):
        calls = []

        def runner(stage, attempt, delta):
            calls.append((stage, attempt))
            if stage == "audit":
                return LaneResult(stage, False, (), ("still_bad",))
            return LaneResult(stage, True, (f"ev:{stage}",), ())

        result = run_continuous_loop(
            ("state_delta", "audit", "next"),
            run_stage=runner,
            audit_result=self.audit,
            plan_repair=self.planner,
            max_attempts_per_stage=2,
        )

        self.assertFalse(result.passed)
        self.assertEqual(result.state, "GAP")
        self.assertNotIn(("next", 1), calls)
        self.assertIn("audit:max_attempts_exhausted", result.gaps)
        self.assertIn("audit:unresolved:still_bad", result.gaps)

    def test_audit_cannot_change_lane_identity(self):
        with self.assertRaisesRegex(ContinuousLoopError, "audit_lane_identity_mismatch"):
            run_continuous_loop(
                ("audit",),
                run_stage=lambda stage, attempt, delta: LaneResult(stage, True, ("ev",), ()),
                audit_result=lambda stage, result: LaneResult("forged", True, ("ev",), ()),
                plan_repair=self.planner,
            )

    def test_strategy_delta_must_bind_exact_failed_attempt(self):
        def bad_planner(stage, attempt, result):
            return StrategyDelta(stage, attempt + 1, result.gaps[0], "repair", ("ev:repair",))

        with self.assertRaisesRegex(ContinuousLoopError, "strategy_delta_not_bound_to_failed_attempt"):
            run_continuous_loop(
                ("audit",),
                run_stage=lambda stage, attempt, delta: LaneResult(stage, False, (), ("gap",)),
                audit_result=self.audit,
                plan_repair=bad_planner,
            )

    def test_pass_without_evidence_fails_closed_via_existing_lane_contract(self):
        with self.assertRaisesRegex(Exception, "requires evidence"):
            run_continuous_loop(
                ("audit",),
                run_stage=lambda stage, attempt, delta: LaneResult(stage, True, (), ()),
                audit_result=self.audit,
                plan_repair=self.planner,
            )


if __name__ == "__main__":
    unittest.main()
