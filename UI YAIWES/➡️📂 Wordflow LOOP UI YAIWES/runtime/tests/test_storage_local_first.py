import hashlib
import json
import sys
from pathlib import Path
import unittest

SRC = Path(__file__).resolve().parents[1] / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from storage.local_first import LocalFirstStorageError, StabilizeLocalFirstStorage


class FakeEntityType:
    WORKFLOW = "workflow"


class Scope:
    def __init__(self, kind: str, scope_id: str):
        self.kind = kind
        self.scope_id = scope_id


class DurableSnapshotBackend:
    """Fixture implementing the Stabilize snapshot-port shape."""

    def __init__(self, shared=None, events=None):
        self.shared = shared if shared is not None else {}
        self.events = events if events is not None else []

    def save_snapshot(self, **kwargs):
        self.events.append(("save", kwargs["entity_id"], kwargs["version"]))
        state = json.loads(json.dumps(kwargs["state"]))
        state_hash = hashlib.sha256(
            json.dumps(state, sort_keys=True, default=str).encode()
        ).hexdigest()
        self.shared[kwargs["entity_id"]] = {
            "entity_type": "workflow",
            "entity_id": kwargs["entity_id"],
            "workflow_id": kwargs["workflow_id"],
            "version": kwargs["version"],
            "sequence": kwargs["sequence"],
            "state": state,
            "state_hash": state_hash,
        }

    def get_latest_snapshot(self, _entity_type, entity_id):
        self.events.append(("read", entity_id))
        return self.shared.get(entity_id)


def entry(entry_id: str, content: str = "value", score: float = 1.0):
    return {
        "entry_id": entry_id,
        "content": content,
        "score": score,
        "evidence_ref": f"evidence-{entry_id}",
        "provenance": {
            "source": "fixture",
            "revision": "1",
            "evidence_ref": f"evidence-{entry_id}",
        },
    }


class LocalFirstStorageTests(unittest.TestCase):
    def setUp(self):
        self.private = Scope("AGENT_PRIVATE", "agent-a")
        self.chat = Scope("CHAT", "chat-a")
        self.project = Scope("PROJECT", "project-a")
        self.shared = {}
        self.events = []

    def store(self, **kwargs):
        return StabilizeLocalFirstStorage(
            backend=DurableSnapshotBackend(self.shared, self.events),
            entity_type=FakeEntityType.WORKFLOW,
            **kwargs,
        )

    def test_persist_reopen_uses_same_durable_snapshot(self):
        first = self.store()
        receipt = first.save_entries(self.private, [entry("m1")])
        reopened = self.store()
        checkpoint = reopened.export_checkpoint(self.private)
        self.assertTrue(receipt.local_committed)
        self.assertEqual(checkpoint.sha256, receipt.checkpoint.sha256)
        result = reopened.read(
            operation="GET_MEMORY",
            task_ref="task-1",
            agent_id="agent-a",
            agent_memory=self.private,
        )
        self.assertEqual(result["entries"][0]["entry_id"], "m1")

    def test_restore_checkpoint_creates_new_latest_version_without_rewriting_history(self):
        store = self.store()
        original = store.save_entries(self.private, [entry("old")]).checkpoint
        store.save_entries(self.private, [entry("new")])
        restored = store.restore_checkpoint(
            self.private, original.payload, original.sha256
        )
        self.assertGreater(restored.checkpoint.version, original.version)
        result = store.read(
            operation="GET_CONTEXT",
            task_ref="task-2",
            agent_id="agent-a",
            agent_memory=self.private,
        )
        self.assertEqual([item["entry_id"] for item in result["entries"]], ["old"])

    def test_tampered_checkpoint_fails_before_any_persistence_effect(self):
        store = self.store()
        checkpoint = store.save_entries(self.private, [entry("safe")]).checkpoint
        version_before = store.export_checkpoint(self.private).version
        tampered = bytearray(checkpoint.payload)
        tampered[-2] ^= 1
        with self.assertRaisesRegex(
            LocalFirstStorageError, "storage_checkpoint_sha256_mismatch"
        ):
            store.restore_checkpoint(
                self.private, bytes(tampered), checkpoint.sha256
            )
        self.assertEqual(store.export_checkpoint(self.private).version, version_before)

    def test_mirror_runs_only_after_local_commit_and_readback(self):
        mirror_events = []

        def mirror(checkpoint):
            mirror_events.append((checkpoint.sha256, tuple(self.events)))

        store = self.store(mirror=mirror)
        receipt = store.save_entries(self.private, [entry("m1")])
        self.assertEqual(receipt.mirror_status, "MIRRORED")
        self.assertEqual(mirror_events[0][1][-1][0], "read")

    def test_mirror_failure_preserves_local_durable_commit(self):
        def failing_mirror(_checkpoint):
            raise RuntimeError("mirror-down")

        store = self.store(mirror=failing_mirror)
        receipt = store.save_entries(self.chat, [entry("chat")])
        self.assertTrue(receipt.local_committed)
        self.assertEqual(
            receipt.mirror_status, "MIRROR_FAILED_LOCAL_COMMIT_PRESERVED"
        )
        self.assertIsNotNone(store.export_checkpoint(self.chat))

    def test_memory_port_combines_authorized_scopes_and_survives_reopen(self):
        store = self.store()
        store.save_entries(self.private, [entry("private", score=1.0)])
        store.save_entries(self.chat, [entry("chat", score=0.8)])
        store.save_entries(self.project, [entry("project", score=0.5)])
        reopened = self.store()
        result = reopened.read(
            operation="GET_CONTEXT",
            task_ref="task-3",
            agent_id="agent-a",
            agent_memory=self.private,
            context_scopes=(self.chat, self.project),
        )
        self.assertEqual(
            [item["entry_id"] for item in result["entries"]],
            ["private", "chat", "project"],
        )
        self.assertRegex(result["checkpoint_sha256"], r"^[0-9a-f]{64}$")
        self.assertRegex(result["snapshot_id"], r"^[0-9a-f]{64}$")

    def test_cross_scope_entry_and_wrong_agent_fail_closed(self):
        store = self.store()
        forged = entry("forged")
        forged["scope"] = {"kind": "PROJECT", "scope_id": "other"}
        with self.assertRaisesRegex(
            LocalFirstStorageError, "storage_entry_scope_mismatch"
        ):
            store.save_entries(self.private, [forged])

        with self.assertRaisesRegex(
            LocalFirstStorageError, "storage_agent_private_scope_mismatch"
        ):
            store.read(
                operation="GET_CONTEXT",
                task_ref="task",
                agent_id="agent-b",
                agent_memory=self.private,
            )

    def test_duplicate_entries_fail_before_local_write(self):
        store = self.store()
        with self.assertRaisesRegex(
            LocalFirstStorageError, "duplicate_storage_entry_id"
        ):
            store.save_entries(self.private, [entry("same"), entry("same")])
        self.assertEqual(self.shared, {})


if __name__ == "__main__":
    unittest.main()
