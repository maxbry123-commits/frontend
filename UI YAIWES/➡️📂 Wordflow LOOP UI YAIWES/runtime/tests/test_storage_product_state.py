import base64
import json
import sys
from pathlib import Path
import unittest

SRC = Path(__file__).resolve().parents[1] / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from storage.product_state import (
    ChatMessage,
    FileState,
    ProductSnapshot,
    ProductStateError,
    WindowState,
    build_file_state,
    decode_snapshot,
    encode_snapshot,
    file_bytes,
    snapshot_sha256,
)


class ProductStateTests(unittest.TestCase):
    def snapshot(self):
        file_state = build_file_state("file-1", "docs/a.txt", b"hello", "text/plain")
        return ProductSnapshot(
            session_id="session-1",
            agent_memory_ref="memory://agent/7",
            chat=(
                ChatMessage("m1", 0, "user", "hello"),
                ChatMessage("m2", 1, "assistant", "hi"),
            ),
            windows=(WindowState("w1", "editor", "A", "file-1"),),
            files=(file_state,),
        )

    def test_roundtrip_is_deterministic_and_recovers_file_bytes(self):
        snapshot = self.snapshot()
        raw1 = encode_snapshot(snapshot)
        raw2 = encode_snapshot(snapshot)
        self.assertEqual(raw1, raw2)
        self.assertEqual(decode_snapshot(raw1), snapshot)
        self.assertEqual(file_bytes(snapshot.files[0]), b"hello")
        self.assertEqual(len(snapshot_sha256(raw1)), 64)

    def test_chat_memory_is_separate_from_agent_memory_contents(self):
        payload = json.loads(encode_snapshot(self.snapshot()))
        payload["agent_memory"] = {"secret": "must-not-be-embedded"}
        with self.assertRaisesRegex(ProductStateError, "invalid_snapshot_shape"):
            decode_snapshot(json.dumps(payload).encode())

    def test_tampered_file_content_is_rejected(self):
        payload = json.loads(encode_snapshot(self.snapshot()))
        payload["files"][0]["content_b64"] = base64.b64encode(b"tampered").decode()
        with self.assertRaisesRegex(ProductStateError, "file_sha256_mismatch"):
            decode_snapshot(json.dumps(payload).encode())

    def test_unsafe_file_name_is_rejected(self):
        with self.assertRaisesRegex(ProductStateError, "unsafe_file_name"):
            build_file_state("file-1", "../../secret", b"x")

    def test_duplicate_message_and_file_ids_fail_closed(self):
        snapshot = self.snapshot()
        with self.subTest("message"):
            bad = ProductSnapshot(
                snapshot.session_id,
                snapshot.agent_memory_ref,
                snapshot.chat + (ChatMessage("m1", 2, "user", "again"),),
                snapshot.windows,
                snapshot.files,
            )
            with self.assertRaisesRegex(ProductStateError, "duplicate_message_id"):
                encode_snapshot(bad)
        with self.subTest("file"):
            bad = ProductSnapshot(
                snapshot.session_id,
                snapshot.agent_memory_ref,
                snapshot.chat,
                snapshot.windows,
                snapshot.files + snapshot.files,
            )
            with self.assertRaisesRegex(ProductStateError, "duplicate_file_id"):
                encode_snapshot(bad)

    def test_window_cannot_reference_missing_file(self):
        snapshot = self.snapshot()
        bad = ProductSnapshot(
            snapshot.session_id,
            snapshot.agent_memory_ref,
            snapshot.chat,
            (WindowState("w1", "editor", "A", "missing"),),
            snapshot.files,
        )
        with self.assertRaisesRegex(ProductStateError, "window_file_reference_missing"):
            encode_snapshot(bad)

    def test_chat_sequence_must_be_strictly_monotonic(self):
        snapshot = self.snapshot()
        bad = ProductSnapshot(
            snapshot.session_id,
            snapshot.agent_memory_ref,
            (
                ChatMessage("m1", 1, "user", "hello"),
                ChatMessage("m2", 0, "assistant", "hi"),
            ),
            snapshot.windows,
            snapshot.files,
        )
        with self.assertRaisesRegex(ProductStateError, "non_monotonic_message_sequence"):
            encode_snapshot(bad)


if __name__ == "__main__":
    unittest.main()
