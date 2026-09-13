import hashlib
import sys
from pathlib import Path
import unittest

SRC = Path(__file__).resolve().parents[1] / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from recovery.control_plane import RecoveryControlPlaneError
from recovery.product_session import (
    EffectOutcome,
    EffectReceipt,
    EffectRecord,
    restore_product_session,
    resume_effect,
)
from storage.product_state import (
    ChatMessage,
    ProductSnapshot,
    WindowState,
    build_file_state,
    encode_snapshot,
    snapshot_sha256,
)


class FakeLedger:
    def __init__(self):
        self.records = {}
        self.pending_calls = 0
        self.commit_calls = 0

    def get(self, effect_id):
        return self.records.get(effect_id)

    def mark_pending(self, effect_id):
        self.pending_calls += 1
        self.records[effect_id] = EffectRecord("pending")

    def commit(self, effect_id, output_sha256):
        self.commit_calls += 1
        self.records[effect_id] = EffectRecord("committed", output_sha256)


class IdempotentSink:
    def __init__(self):
        self.outputs = {}
        self.physical_effects = 0
        self.disconnect_once = False

    def apply(self, effect_id, payload):
        if effect_id in self.outputs:
            return EffectReceipt(effect_id, self.outputs[effect_id], True)
        self.physical_effects += 1
        output = b"done:" + payload
        self.outputs[effect_id] = output
        if self.disconnect_once:
            self.disconnect_once = False
            raise ConnectionError("lost after side effect")
        return EffectReceipt(effect_id, output, False)


class ProductRecoveryTests(unittest.TestCase):
    def snapshot_bytes(self):
        file_state = build_file_state("file-1", "draft.txt", b"draft", "text/plain")
        snapshot = ProductSnapshot(
            session_id="session-42",
            agent_memory_ref="memory://agent/42",
            chat=(ChatMessage("m1", 0, "user", "restore me"),),
            windows=(WindowState("w1", "editor", "Draft", "file-1"),),
            files=(file_state,),
        )
        return encode_snapshot(snapshot)

    def test_restore_recovers_chat_windows_files_after_hash_gate(self):
        raw = self.snapshot_bytes()
        result = restore_product_session(
            checkpoint_ref="checkpoint://session/42",
            checkpoint_sha256=snapshot_sha256(raw),
            checkpoint_bytes_loader=lambda _ref: raw,
            expected_session_id="session-42",
        )
        self.assertEqual(result.snapshot.chat[0].content, "restore me")
        self.assertEqual(result.snapshot.windows[0].selected_file_id, "file-1")
        self.assertEqual(dict(result.file_contents)["file-1"], b"draft")
        self.assertEqual(result.snapshot.agent_memory_ref, "memory://agent/42")

    def test_tampered_checkpoint_is_rejected_before_restore(self):
        raw = self.snapshot_bytes()
        with self.assertRaisesRegex(RecoveryControlPlaneError, "checkpoint_sha256_mismatch"):
            restore_product_session(
                checkpoint_ref="checkpoint://session/42",
                checkpoint_sha256=snapshot_sha256(raw),
                checkpoint_bytes_loader=lambda _ref: raw + b"x",
            )

    def test_noncanonical_snapshot_is_rejected_even_with_matching_hash(self):
        canonical = self.snapshot_bytes()
        noncanonical = canonical.replace(b'"session_id":"session-42"', b'"session_id": "session-42"')
        self.assertNotEqual(noncanonical, canonical)
        with self.assertRaisesRegex(RecoveryControlPlaneError, "product_snapshot_not_canonical"):
            restore_product_session(
                checkpoint_ref="checkpoint://session/42",
                checkpoint_sha256=hashlib.sha256(noncanonical).hexdigest(),
                checkpoint_bytes_loader=lambda _ref: noncanonical,
            )

    def test_session_identity_mismatch_fails_closed(self):
        raw = self.snapshot_bytes()
        with self.assertRaisesRegex(RecoveryControlPlaneError, "product_session_mismatch"):
            restore_product_session(
                checkpoint_ref="checkpoint://session/42",
                checkpoint_sha256=snapshot_sha256(raw),
                checkpoint_bytes_loader=lambda _ref: raw,
                expected_session_id="other-session",
            )

    def test_cancel_before_effect_creates_no_pending_or_side_effect(self):
        ledger = FakeLedger()
        sink = IdempotentSink()
        outcome = resume_effect(
            effect_id="effect-1",
            payload=b"payload",
            ledger=ledger,
            apply_effect=sink.apply,
            cancelled=lambda: True,
        )
        self.assertEqual(outcome.status, "cancelled")
        self.assertEqual(ledger.pending_calls, 0)
        self.assertEqual(sink.physical_effects, 0)

    def test_first_effect_commits_hash_and_committed_replay_is_skipped(self):
        ledger = FakeLedger()
        sink = IdempotentSink()
        first = resume_effect(
            effect_id="effect-1",
            payload=b"payload",
            ledger=ledger,
            apply_effect=sink.apply,
        )
        second = resume_effect(
            effect_id="effect-1",
            payload=b"payload",
            ledger=ledger,
            apply_effect=sink.apply,
        )
        self.assertEqual(first.status, "committed")
        self.assertFalse(first.duplicate)
        self.assertEqual(second.status, "skipped_committed")
        self.assertTrue(second.duplicate)
        self.assertEqual(sink.physical_effects, 1)
        self.assertEqual(ledger.commit_calls, 1)

    def test_disconnect_after_side_effect_retries_same_id_without_duplicate(self):
        ledger = FakeLedger()
        sink = IdempotentSink()
        sink.disconnect_once = True
        with self.assertRaisesRegex(RecoveryControlPlaneError, "effect_delivery_failed:ConnectionError"):
            resume_effect(
                effect_id="effect-stable-7",
                payload=b"payload",
                ledger=ledger,
                apply_effect=sink.apply,
            )
        self.assertEqual(ledger.records["effect-stable-7"].status, "pending")
        self.assertEqual(sink.physical_effects, 1)

        recovered = resume_effect(
            effect_id="effect-stable-7",
            payload=b"payload",
            ledger=ledger,
            apply_effect=sink.apply,
        )
        self.assertEqual(recovered.status, "committed")
        self.assertTrue(recovered.duplicate)
        self.assertEqual(sink.physical_effects, 1)
        self.assertEqual(ledger.records["effect-stable-7"].status, "committed")

    def test_cancel_after_pending_preserves_restartable_pending_state(self):
        ledger = FakeLedger()
        ledger.records["effect-1"] = EffectRecord("pending")
        sink = IdempotentSink()
        outcome = resume_effect(
            effect_id="effect-1",
            payload=b"payload",
            ledger=ledger,
            apply_effect=sink.apply,
            cancelled=lambda: True,
        )
        self.assertEqual(outcome.status, "cancelled_pending")
        self.assertEqual(ledger.records["effect-1"].status, "pending")
        self.assertEqual(sink.physical_effects, 0)

    def test_mismatched_receipt_id_fails_closed_and_does_not_commit(self):
        ledger = FakeLedger()
        with self.assertRaisesRegex(RecoveryControlPlaneError, "effect_receipt_id_mismatch"):
            resume_effect(
                effect_id="effect-1",
                payload=b"payload",
                ledger=ledger,
                apply_effect=lambda *_: EffectReceipt("other", b"done", False),
            )
        self.assertEqual(ledger.records["effect-1"].status, "pending")
        self.assertEqual(ledger.commit_calls, 0)


if __name__ == "__main__":
    unittest.main()
