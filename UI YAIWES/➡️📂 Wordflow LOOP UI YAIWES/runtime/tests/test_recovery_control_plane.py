import hashlib
import sys
from dataclasses import dataclass
from pathlib import Path
import unittest

SRC = Path(__file__).resolve().parents[1] / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from recovery.control_plane import RecoveryControlPlaneError, recover_project


@dataclass
class FakeResult:
    status: str


class FakeRecovery:
    results = [FakeResult("recovered"), FakeResult("skipped")]
    seen_store = None
    seen_queue = None
    seen_application = None
    init_count = 0

    def __init__(self, *, store, queue):
        type(self).init_count += 1
        type(self).seen_store = store
        type(self).seen_queue = queue

    def recover_pending_workflows(self, application=None):
        type(self).seen_application = application
        return list(type(self).results)


class RecoveryControlPlaneTests(unittest.TestCase):
    CHECKPOINT_BYTES = b"yaiwes-checkpoint-v1"
    SHA = hashlib.sha256(CHECKPOINT_BYTES).hexdigest()

    def setUp(self):
        FakeRecovery.init_count = 0
        FakeRecovery.seen_store = None
        FakeRecovery.seen_queue = None
        FakeRecovery.seen_application = None

    def checkpoint_loader(self, ref):
        self.assertEqual(ref, "checkpoint://project/42")
        return self.CHECKPOINT_BYTES

    def test_delegates_to_recovery_engine_after_strong_evidence(self):
        store = object()
        queue = object()
        FakeRecovery.results = [FakeResult("recovered"), FakeResult("skipped")]
        evidence = recover_project(
            store=store,
            queue=queue,
            checkpoint_ref="checkpoint://project/42",
            checkpoint_sha256=self.SHA,
            checkpoint_bytes_loader=self.checkpoint_loader,
            ledger_integrity_check=lambda: True,
            application="yaiwes",
            recovery_type=FakeRecovery,
        )
        self.assertEqual(FakeRecovery.init_count, 1)
        self.assertIs(FakeRecovery.seen_store, store)
        self.assertIs(FakeRecovery.seen_queue, queue)
        self.assertEqual(FakeRecovery.seen_application, "yaiwes")
        self.assertEqual(evidence.recovered, 1)
        self.assertEqual(evidence.skipped, 1)
        self.assertTrue(evidence.safe_to_continue)

    def test_invalid_checkpoint_fails_closed_before_recovery(self):
        with self.assertRaisesRegex(RecoveryControlPlaneError, "strong_checkpoint"):
            recover_project(
                store=object(),
                queue=object(),
                checkpoint_ref="checkpoint://project/42",
                checkpoint_sha256="weak",
                checkpoint_bytes_loader=self.checkpoint_loader,
                ledger_integrity_check=lambda: True,
                recovery_type=FakeRecovery,
            )
        self.assertEqual(FakeRecovery.init_count, 0)

    def test_tampered_checkpoint_bytes_fail_closed_before_recovery(self):
        with self.assertRaisesRegex(RecoveryControlPlaneError, "checkpoint_sha256_mismatch"):
            recover_project(
                store=object(),
                queue=object(),
                checkpoint_ref="checkpoint://project/42",
                checkpoint_sha256=self.SHA,
                checkpoint_bytes_loader=lambda _ref: b"tampered-checkpoint",
                ledger_integrity_check=lambda: True,
                recovery_type=FakeRecovery,
            )
        self.assertEqual(FakeRecovery.init_count, 0)

    def test_checkpoint_read_failure_fails_closed_before_recovery(self):
        def broken_loader(_ref):
            raise OSError("checkpoint unavailable")

        with self.assertRaisesRegex(RecoveryControlPlaneError, "checkpoint_read_failed:OSError"):
            recover_project(
                store=object(),
                queue=object(),
                checkpoint_ref="checkpoint://project/42",
                checkpoint_sha256=self.SHA,
                checkpoint_bytes_loader=broken_loader,
                ledger_integrity_check=lambda: True,
                recovery_type=FakeRecovery,
            )
        self.assertEqual(FakeRecovery.init_count, 0)

    def test_tampered_ledger_fails_closed(self):
        with self.assertRaisesRegex(RecoveryControlPlaneError, "ledger_integrity_failure"):
            recover_project(
                store=object(),
                queue=object(),
                checkpoint_ref="checkpoint://project/42",
                checkpoint_sha256=self.SHA,
                checkpoint_bytes_loader=self.checkpoint_loader,
                ledger_integrity_check=lambda: False,
                recovery_type=FakeRecovery,
            )
        self.assertEqual(FakeRecovery.init_count, 0)

    def test_partial_or_failed_recovery_blocks_project_continuation(self):
        FakeRecovery.results = [FakeResult("recovered"), FakeResult("partial")]
        evidence = recover_project(
            store=object(),
            queue=object(),
            checkpoint_ref="checkpoint://project/42",
            checkpoint_sha256=self.SHA,
            checkpoint_bytes_loader=self.checkpoint_loader,
            ledger_integrity_check=lambda: True,
            recovery_type=FakeRecovery,
        )
        self.assertEqual(evidence.partial, 1)
        self.assertFalse(evidence.safe_to_continue)

    def test_unknown_recovery_status_fails_closed(self):
        FakeRecovery.results = [FakeResult("mystery")]
        with self.assertRaisesRegex(RecoveryControlPlaneError, "unknown_recovery_status"):
            recover_project(
                store=object(),
                queue=object(),
                checkpoint_ref="checkpoint://project/42",
                checkpoint_sha256=self.SHA,
                checkpoint_bytes_loader=self.checkpoint_loader,
                ledger_integrity_check=lambda: True,
                recovery_type=FakeRecovery,
            )


if __name__ == "__main__":
    unittest.main()
