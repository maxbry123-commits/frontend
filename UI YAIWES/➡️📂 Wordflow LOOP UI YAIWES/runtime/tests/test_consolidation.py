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
    def ev(self, ref: str, provenance: str = "run:34730513826") -> EvidenceRef:
        return EvidenceRef("test", ref, provenance)

    def test_phase_pass_requires_every_task_pass_and_preserves_evidence(self):
        shared = self.ev("test_shared")
        phase = consolidate_phase(
            "phase-runtime",
            [
                TaskResult("T1", "PASS", (self.ev("test_t1"), shared)),
                TaskResult("T2", "PASS", (shared, self.ev("test_t2"))),
            ],
        )
        self.assertTrue(phase.passed)
        self.assertEqual(phase.state, "PASS")
        self.assertEqual(
            phase.evidence,
            (self.ev("test_t1"), shared, self.ev("test_t2")),
        )
        self.assertEqual(phase.gaps, ())

    def test_partial_phase_never_promotes_to_pass(self):
        phase = consolidate_phase(
            "phase-runtime",
            [
                TaskResult("T1", "PASS", (self.ev("test_t1"),)),
                TaskResult("T2", "GAP", (self.ev("test_t2"),), ("checkpoint_missing",)),
            ],
        )
        self.assertFalse(phase.passed)
        self.assertEqual(phase.state, "GAP")
        self.assertEqual(phase.gaps, ("checkpoint_missing",))

    def test_project_partial_never_becomes_global_pass(self):
        good = consolidate_phase(
            "phase-good",
            [TaskResult("T1", "PASS", (self.ev("good"),))],
        )
        blocked = consolidate_phase(
            "phase-gap",
            [TaskResult("T2", "GAP", (self.ev("gap"),), ("recovery_unverified",))],
        )
        project = consolidate_project("YAIWES", [good, blocked])
        self.assertFalse(project.passed)
        self.assertEqual(project.state, "GAP")
        self.assertEqual(project.gaps, ("recovery_unverified",))
        self.assertEqual(project.evidence, (self.ev("good"), self.ev("gap")))

    def test_passing_task_without_evidence_is_rejected(self):
        with self.assertRaises(ConsolidationError):
            consolidate_phase("phase", [TaskResult("T1", "PASS")])

    def test_gap_task_without_explicit_gap_is_rejected(self):
        with self.assertRaises(ConsolidationError):
            consolidate_phase("phase", [TaskResult("T1", "GAP", (self.ev("x"),))])

    def test_duplicate_task_and_phase_ids_are_rejected(self):
        task = TaskResult("T1", "PASS", (self.ev("x"),))
        with self.assertRaises(ConsolidationError):
            consolidate_phase("phase", [task, task])

        p1 = consolidate_phase("p1", [task])
        with self.assertRaises(ConsolidationError):
            consolidate_project("YAIWES", [p1, p1])

    def test_evidence_requires_provenance_and_survives_project_rollup(self):
        with self.assertRaises(ConsolidationError):
            consolidate_phase(
                "phase",
                [TaskResult("T1", "PASS", (EvidenceRef("test", "x", ""),))],
            )

        evidence = EvidenceRef("blob", "abc123", "commit:deadbeef")
        phase = consolidate_phase("phase", [TaskResult("T1", "PASS", (evidence,))])
        project = consolidate_project("YAIWES", [phase])
        self.assertEqual(project.evidence, (evidence,))

    def test_forged_phase_rollup_is_rejected(self):
        task = TaskResult("T1", "PASS", (self.ev("x"),))
        forged = PhaseResult("phase", "PASS", (task,), (), ())
        with self.assertRaises(ConsolidationError):
            consolidate_project("YAIWES", [forged])


if __name__ == "__main__":
    unittest.main()
