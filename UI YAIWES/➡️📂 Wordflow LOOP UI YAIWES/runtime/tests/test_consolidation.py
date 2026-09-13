import sys
from pathlib import Path
import unittest

SRC = Path(__file__).resolve().parents[1] / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from consolidation.consolidator import (
    ConsolidationError,
    EvidenceRef,
    PhaseResult,
    TaskResult,
    consolidate_phase,
    consolidate_project,
)


class ConsolidationTests(unittest.TestCase):
    def ev(self, ref: str, provenance: str = "run:n24") -> EvidenceRef:
        return EvidenceRef("test", ref, provenance)

    def phase(self, phase_id: str, tasks, expected):
        return consolidate_phase(
            phase_id,
            tasks,
            expected_task_ids=expected,
        )

    def test_phase_pass_requires_every_expected_task_and_preserves_evidence(self):
        shared = self.ev("test_shared")
        phase = self.phase(
            "phase-runtime",
            [
                TaskResult("T1", "PASS", (self.ev("test_t1"), shared)),
                TaskResult("T2", "PASS", (shared, self.ev("test_t2"))),
            ],
            ("T1", "T2"),
        )
        self.assertTrue(phase.passed)
        self.assertTrue(phase.complete)
        self.assertEqual(phase.state, "PASS")
        self.assertEqual(
            phase.evidence,
            (self.ev("test_t1"), shared, self.ev("test_t2")),
        )
        self.assertEqual(phase.gaps, ())

    def test_missing_expected_task_is_gap_even_if_all_observed_tasks_pass(self):
        phase = self.phase(
            "phase-runtime",
            [TaskResult("T1", "PASS", (self.ev("test_t1"),))],
            ("T1", "T2"),
        )
        self.assertFalse(phase.passed)
        self.assertFalse(phase.complete)
        self.assertEqual(phase.state, "GAP")
        self.assertEqual(phase.gaps, ("missing:task:T2",))

    def test_failed_task_propagates_gap(self):
        phase = self.phase(
            "phase-runtime",
            [
                TaskResult("T1", "PASS", (self.ev("test_t1"),)),
                TaskResult(
                    "T2",
                    "GAP",
                    (self.ev("test_t2"),),
                    ("checkpoint_missing",),
                ),
            ],
            ("T1", "T2"),
        )
        self.assertTrue(phase.complete)
        self.assertFalse(phase.passed)
        self.assertEqual(phase.gaps, ("checkpoint_missing",))

    def test_partial_phase_never_promotes_to_project_pass(self):
        partial = self.phase(
            "phase-runtime",
            [TaskResult("T1", "PASS", (self.ev("test_t1"),))],
            ("T1", "T2"),
        )
        project = consolidate_project(
            "YAIWES",
            [partial],
            expected_phase_ids=("phase-runtime",),
        )
        self.assertFalse(project.passed)
        self.assertEqual(project.state, "GAP")
        self.assertEqual(project.gaps, ("missing:task:T2",))

    def test_missing_expected_phase_never_becomes_global_pass(self):
        good = self.phase(
            "phase-good",
            [TaskResult("T1", "PASS", (self.ev("good"),))],
            ("T1",),
        )
        project = consolidate_project(
            "YAIWES",
            [good],
            expected_phase_ids=("phase-good", "phase-missing"),
        )
        self.assertFalse(project.passed)
        self.assertFalse(project.complete)
        self.assertEqual(project.state, "GAP")
        self.assertEqual(project.gaps, ("missing:phase:phase-missing",))

    def test_passing_or_failing_task_without_evidence_is_rejected(self):
        with self.assertRaises(ConsolidationError):
            self.phase("phase", [TaskResult("T1", "PASS")], ("T1",))
        with self.assertRaises(ConsolidationError):
            self.phase(
                "phase",
                [TaskResult("T1", "GAP", (), ("failure",))],
                ("T1",),
            )

    def test_gap_task_without_explicit_gap_is_rejected(self):
        with self.assertRaises(ConsolidationError):
            self.phase(
                "phase",
                [TaskResult("T1", "GAP", (self.ev("x"),))],
                ("T1",),
            )

    def test_duplicate_or_unexpected_task_and_phase_ids_are_rejected(self):
        task = TaskResult("T1", "PASS", (self.ev("x"),))
        with self.assertRaises(ConsolidationError):
            self.phase("phase", [task, task], ("T1",))
        with self.assertRaises(ConsolidationError):
            self.phase("phase", [task], ("T2",))
        with self.assertRaises(ConsolidationError):
            self.phase("phase", [task], ("T1", "T1"))

        p1 = self.phase("p1", [task], ("T1",))
        with self.assertRaises(ConsolidationError):
            consolidate_project(
                "YAIWES",
                [p1, p1],
                expected_phase_ids=("p1",),
            )
        with self.assertRaises(ConsolidationError):
            consolidate_project(
                "YAIWES",
                [p1],
                expected_phase_ids=("other",),
            )

    def test_evidence_requires_provenance_and_survives_project_rollup(self):
        with self.assertRaises(ConsolidationError):
            self.phase(
                "phase",
                [TaskResult("T1", "PASS", (EvidenceRef("test", "x", ""),))],
                ("T1",),
            )

        evidence = EvidenceRef("blob", "abc123", "commit:deadbeef")
        phase = self.phase(
            "phase",
            [TaskResult("T1", "PASS", (evidence,))],
            ("T1",),
        )
        project = consolidate_project(
            "YAIWES",
            [phase],
            expected_phase_ids=("phase",),
        )
        self.assertTrue(project.passed)
        self.assertEqual(project.evidence, (evidence,))

    def test_same_ref_with_distinct_provenance_is_not_collapsed(self):
        source = EvidenceRef("blob", "abc123", "code")
        fixture = EvidenceRef("blob", "abc123", "test-fixture")
        phase = self.phase(
            "phase",
            [TaskResult("T1", "PASS", (source, fixture, source))],
            ("T1",),
        )
        self.assertEqual(phase.evidence, (source, fixture))

    def test_forged_phase_rollup_is_rejected(self):
        task = TaskResult("T1", "PASS", (self.ev("x"),))
        forged = PhaseResult(
            "phase",
            "PASS",
            (task,),
            ("T1",),
            (),
            (),
            True,
        )
        with self.assertRaises(ConsolidationError):
            consolidate_project(
                "YAIWES",
                [forged],
                expected_phase_ids=("phase",),
            )


if __name__ == "__main__":
    unittest.main()
