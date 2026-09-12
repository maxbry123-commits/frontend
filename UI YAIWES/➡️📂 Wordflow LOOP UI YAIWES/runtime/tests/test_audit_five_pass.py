import sys
import tempfile
import unittest
from dataclasses import replace
from hashlib import sha256
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from audit.five_pass import FileRef, RequirementTrace, audit_five_pass


class FivePassTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        def put(name, text, symbol=""):
            data = text.encode()
            (self.root / name).write_bytes(data)
            return FileRef(name, sha256(data).hexdigest(), symbol)
        self.trace = RequirementTrace(
            "R1", "G1", "T1", put("source.md", "Persist state"),
            put("code.py", "def save():\n    return 1\n", "save"),
            put("test.py", "def test_save():\n    assert True\n", "test_save"),
            put("run.txt", "trusted fixture"), "fixture-revision",
        )

    def run_audit(self, traces=None, expected=None, artifacts=None, verifier=None):
        return audit_five_pass(self.root, expected if expected is not None else ["R1"],
            traces if traces is not None else [self.trace],
            artifacts if artifacts is not None else ["code.py"],
            verifier if verifier is not None else lambda row, data: data == b"trusted fixture")

    def test_complete_trace_is_not_product_certification(self):
        result = self.run_audit()
        self.assertEqual(result.status, "TRACEABILITY_PASS")
        self.assertEqual(result.coverage_percent, 100)
        self.assertFalse(result.product_verified)
        self.assertEqual(result.inverse, (("code.py", "T1", "R1", "G1"),))

    def test_missing_requirement_uses_full_denominator(self):
        result = self.run_audit(expected=["R1", "R2"])
        self.assertEqual(result.coverage_percent, 50)
        self.assertIn("R2:missing_trace", result.gaps)

    def test_tampering_blocks_verifier(self):
        (self.root / "code.py").write_text("def save():\n    return 2\n")
        calls = []
        result = self.run_audit(verifier=lambda *args: calls.append(args))
        self.assertEqual(result.status, "GAP")
        self.assertFalse(calls)

    def test_duplicate_trace_cannot_inflate_coverage(self):
        result = self.run_audit(traces=[self.trace, self.trace])
        self.assertEqual(result.verified_requirements, 0)

    def test_orphan_artifact_blocks_pass(self):
        self.assertIn("orphan_artifact:other.py", self.run_audit(
            artifacts=["code.py", "other.py"]).gaps)

    def test_execution_failure_and_exception_fail_closed(self):
        for value in (False, "PASS", 1):
            with self.subTest(value=value):
                self.assertEqual(self.run_audit(verifier=lambda *args: value).status, "GAP")
        def broken(*args):
            raise RuntimeError("CI unavailable")
        self.assertEqual(self.run_audit(verifier=broken).status, "GAP")

    def test_missing_symbol_blocks(self):
        row = replace(self.trace, implementation=replace(self.trace.implementation, symbol="absent"))
        self.assertEqual(self.run_audit(traces=[row]).status, "GAP")

    def test_unsafe_and_symlink_paths_block(self):
        for path in ("../source.md", "/source.md", "C:/source.md", "a\\source.md"):
            row = replace(self.trace, source=replace(self.trace.source, path=path))
            self.assertEqual(self.run_audit(traces=[row]).status, "GAP")
        try:
            (self.root / "link.md").symlink_to(self.root / "source.md")
        except (OSError, NotImplementedError):
            return
        row = replace(self.trace, source=replace(self.trace.source, path="link.md"))
        self.assertEqual(self.run_audit(traces=[row]).status, "GAP")

    def test_empty_inventory_never_passes(self):
        result = self.run_audit(expected=[], traces=[], artifacts=[])
        self.assertEqual(result.status, "GAP")
        self.assertEqual(result.coverage_percent, 0)


if __name__ == "__main__":
    unittest.main()
