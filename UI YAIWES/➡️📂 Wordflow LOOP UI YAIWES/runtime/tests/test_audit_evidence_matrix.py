import json
import sys
import tempfile
import unittest
from dataclasses import replace
from hashlib import sha256
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from audit.evidence import TrustedCIExecution, verify_ci_evidence
from audit.five_pass import FileRef, RequirementTrace
from audit.matrix import RequirementMatrix, audit_matrix


class EvidenceMatrixTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)

        def put(name, data, symbol=""):
            raw = data if isinstance(data, bytes) else data.encode()
            (self.root / name).write_bytes(raw)
            return FileRef(name, sha256(raw).hexdigest(), symbol)

        self.source = put("source.md", "R1 literal")
        self.implementation = put("code.py", "def save():\n    return 1\n", "save")
        self.test = put("test.py", "def test_save():\n    assert True\n", "test_save")
        self.revision = "a" * 40
        self.run_id = 123
        self.job_id = 456
        evidence_payload = {
            "schema": "yaiwes.ci-evidence.v1",
            "run_id": self.run_id,
            "job_id": self.job_id,
            "revision": self.revision,
            "implementation_sha256": self.implementation.sha256,
            "test_sha256": self.test.sha256,
        }
        self.evidence_bytes = json.dumps(
            evidence_payload, sort_keys=True, separators=(",", ":")
        ).encode()
        self.evidence = put("evidence.json", self.evidence_bytes)
        self.trace = RequirementTrace(
            "R1", "G1", "T1", self.source, self.implementation,
            self.test, self.evidence, self.revision,
        )
        self.trusted = TrustedCIExecution(
            self.run_id,
            self.job_id,
            self.revision,
            "completed",
            "success",
            self.implementation.sha256,
            self.test.sha256,
        )

    def lookup(self, run_id, job_id):
        self.assertEqual((run_id, job_id), (self.run_id, self.job_id))
        return self.trusted

    def test_matrix_connects_five_pass_to_independent_ci_evidence(self):
        matrix = RequirementMatrix(("R1",), (self.trace,), ("code.py",))
        result = audit_matrix(self.root, matrix, self.lookup)
        self.assertEqual(result.status, "TRACEABILITY_PASS")
        self.assertEqual(result.coverage_percent, 100)
        self.assertFalse(result.product_verified)

    def test_untrusted_evidence_cannot_self_assert_success(self):
        payload = json.loads(self.evidence_bytes)
        payload["conclusion"] = "success"
        forged = json.dumps(payload).encode()
        self.assertFalse(verify_ci_evidence(self.trace, forged, self.lookup))

    def test_revision_and_hash_binding_are_fail_closed(self):
        for field, value in (
            ("revision", "b" * 40),
            ("implementation_sha256", "0" * 64),
            ("test_sha256", "1" * 64),
        ):
            with self.subTest(field=field):
                payload = json.loads(self.evidence_bytes)
                payload[field] = value
                self.assertFalse(verify_ci_evidence(
                    self.trace, json.dumps(payload).encode(), self.lookup
                ))

    def test_invalid_run_job_identifiers_are_rejected(self):
        for field in ("run_id", "job_id"):
            for value in (0, -1, True, "123"):
                with self.subTest(field=field, value=value):
                    payload = json.loads(self.evidence_bytes)
                    payload[field] = value
                    self.assertFalse(verify_ci_evidence(
                        self.trace, json.dumps(payload).encode(), self.lookup
                    ))

    def test_trusted_ci_must_be_completed_success_and_exactly_bound(self):
        variants = (
            replace(self.trusted, status="in_progress"),
            replace(self.trusted, conclusion="failure"),
            replace(self.trusted, revision="c" * 40),
            replace(self.trusted, implementation_sha256="2" * 64),
            replace(self.trusted, test_sha256="3" * 64),
        )
        for trusted in variants:
            with self.subTest(trusted=trusted):
                self.assertFalse(verify_ci_evidence(
                    self.trace, self.evidence_bytes, lambda *_: trusted
                ))

    def test_lookup_error_and_wrong_type_fail_closed(self):
        def broken(*_):
            raise RuntimeError("CI unavailable")
        self.assertFalse(verify_ci_evidence(self.trace, self.evidence_bytes, broken))
        self.assertFalse(verify_ci_evidence(
            self.trace, self.evidence_bytes, lambda *_: {"conclusion": "success"}
        ))

    def test_matrix_preserves_full_requirement_denominator(self):
        matrix = RequirementMatrix(("R1", "R2"), (self.trace,), ("code.py",))
        result = audit_matrix(self.root, matrix, self.lookup)
        self.assertEqual(result.status, "GAP")
        self.assertEqual(result.coverage_percent, 50)
        self.assertIn("R2:missing_trace", result.gaps)

    def test_matrix_type_is_explicit(self):
        with self.assertRaisesRegex(TypeError, "matrix_required"):
            audit_matrix(self.root, object(), self.lookup)


if __name__ == "__main__":
    unittest.main()
