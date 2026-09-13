import hashlib
import json
import sqlite3
import subprocess
import sys
import tempfile
from pathlib import Path
import unittest

RUNTIME = Path(__file__).resolve().parents[1]
SRC = RUNTIME / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from storage.local_first import StabilizeLocalFirstStorage


class FakeEntityType:
    WORKFLOW = "workflow"


class Scope:
    def __init__(self, kind: str, scope_id: str):
        self.kind = kind
        self.scope_id = scope_id


class SqliteSnapshotBackend:
    """On-disk snapshot port matching Stabilize save/get semantics."""

    def __init__(self, path: str | Path):
        self.path = str(path)
        with sqlite3.connect(self.path) as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS snapshots (
                    entity_type TEXT NOT NULL,
                    entity_id TEXT NOT NULL,
                    workflow_id TEXT NOT NULL,
                    version INTEGER NOT NULL,
                    sequence INTEGER NOT NULL,
                    state TEXT NOT NULL,
                    state_hash TEXT NOT NULL,
                    PRIMARY KEY (entity_type, entity_id, version)
                )
                """
            )

    def save_snapshot(self, **kwargs):
        state = json.loads(json.dumps(kwargs["state"]))
        state_json = json.dumps(state)
        state_hash = hashlib.sha256(
            json.dumps(state, sort_keys=True, default=str).encode()
        ).hexdigest()
        entity_type = getattr(kwargs["entity_type"], "value", kwargs["entity_type"])
        with sqlite3.connect(self.path) as conn:
            conn.execute(
                """
                INSERT OR REPLACE INTO snapshots
                (entity_type, entity_id, workflow_id, version, sequence, state, state_hash)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    entity_type,
                    kwargs["entity_id"],
                    kwargs["workflow_id"],
                    kwargs["version"],
                    kwargs["sequence"],
                    state_json,
                    state_hash,
                ),
            )

    def get_latest_snapshot(self, entity_type, entity_id):
        raw_type = getattr(entity_type, "value", entity_type)
        with sqlite3.connect(self.path) as conn:
            conn.row_factory = sqlite3.Row
            row = conn.execute(
                """
                SELECT entity_type, entity_id, workflow_id, version, sequence, state, state_hash
                FROM snapshots
                WHERE entity_type = ? AND entity_id = ?
                ORDER BY version DESC
                LIMIT 1
                """,
                (raw_type, entity_id),
            ).fetchone()
        if row is None:
            return None
        return {
            "entity_type": row["entity_type"],
            "entity_id": row["entity_id"],
            "workflow_id": row["workflow_id"],
            "version": row["version"],
            "sequence": row["sequence"],
            "state": json.loads(row["state"]),
            "state_hash": row["state_hash"],
        }


def entry(entry_id: str):
    return {
        "entry_id": entry_id,
        "content": f"content-{entry_id}",
        "score": 1.0,
        "evidence_ref": f"evidence-{entry_id}",
        "provenance": {
            "source": "process-fixture",
            "revision": "1",
            "evidence_ref": f"evidence-{entry_id}",
        },
    }


def run_child(*args: str) -> dict:
    script = r'''
import json
import sys
from pathlib import Path
runtime = Path(sys.argv[1])
sys.path.insert(0, str(runtime / "tests"))
sys.path.insert(0, str(runtime / "src"))
from test_storage_local_first_process import FakeEntityType, Scope, SqliteSnapshotBackend
from storage.local_first import StabilizeLocalFirstStorage

mode = sys.argv[2]
db_path = sys.argv[3]
scope = Scope("AGENT_PRIVATE", "agent-process")
store = StabilizeLocalFirstStorage(
    backend=SqliteSnapshotBackend(db_path),
    entity_type=FakeEntityType.WORKFLOW,
)
if mode == "read":
    result = store.read(
        operation="GET_MEMORY",
        task_ref="process-read",
        agent_id="agent-process",
        agent_memory=scope,
    )
    checkpoint = store.export_checkpoint(scope)
    print(json.dumps({
        "entry_ids": [item["entry_id"] for item in result["entries"]],
        "checkpoint_sha256": checkpoint.sha256,
        "version": checkpoint.version,
    }))
elif mode == "restore":
    checkpoint_path = Path(sys.argv[4])
    expected_sha256 = sys.argv[5]
    receipt = store.restore_checkpoint(scope, checkpoint_path.read_bytes(), expected_sha256)
    result = store.read(
        operation="GET_MEMORY",
        task_ref="process-restore",
        agent_id="agent-process",
        agent_memory=scope,
    )
    print(json.dumps({
        "entry_ids": [item["entry_id"] for item in result["entries"]],
        "version": receipt.checkpoint.version,
        "sha256": receipt.checkpoint.sha256,
    }))
else:
    raise SystemExit("unsupported child mode")
'''
    proc = subprocess.run(
        [sys.executable, "-c", script, str(RUNTIME), *args],
        check=False,
        capture_output=True,
        text=True,
        timeout=30,
    )
    if proc.returncode != 0:
        raise AssertionError(f"child failed: {proc.stderr}\nstdout={proc.stdout}")
    return json.loads(proc.stdout.strip())


class LocalFirstProcessBoundaryTests(unittest.TestCase):
    def test_persisted_snapshot_reopens_in_fresh_python_process(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            db_path = Path(temp_dir) / "local-first.sqlite"
            scope = Scope("AGENT_PRIVATE", "agent-process")
            store = StabilizeLocalFirstStorage(
                backend=SqliteSnapshotBackend(db_path),
                entity_type=FakeEntityType.WORKFLOW,
            )
            receipt = store.save_entries(scope, [entry("before-restart")])

            child = run_child("read", str(db_path))

            self.assertEqual(child["entry_ids"], ["before-restart"])
            self.assertEqual(child["checkpoint_sha256"], receipt.checkpoint.sha256)
            self.assertEqual(child["version"], 1)

    def test_checkpoint_restore_executes_after_restart_and_becomes_latest(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            db_path = Path(temp_dir) / "local-first.sqlite"
            checkpoint_path = Path(temp_dir) / "checkpoint.bin"
            scope = Scope("AGENT_PRIVATE", "agent-process")
            store = StabilizeLocalFirstStorage(
                backend=SqliteSnapshotBackend(db_path),
                entity_type=FakeEntityType.WORKFLOW,
            )
            original = store.save_entries(scope, [entry("restore-me")]).checkpoint
            store.save_entries(scope, [entry("newer")])
            checkpoint_path.write_bytes(original.payload)

            child = run_child(
                "restore",
                str(db_path),
                str(checkpoint_path),
                original.sha256,
            )

            self.assertEqual(child["entry_ids"], ["restore-me"])
            self.assertGreater(child["version"], 2)

            reopened = StabilizeLocalFirstStorage(
                backend=SqliteSnapshotBackend(db_path),
                entity_type=FakeEntityType.WORKFLOW,
            )
            result = reopened.read(
                operation="GET_MEMORY",
                task_ref="parent-after-child",
                agent_id="agent-process",
                agent_memory=scope,
            )
            self.assertEqual(
                [item["entry_id"] for item in result["entries"]],
                ["restore-me"],
            )


if __name__ == "__main__":
    unittest.main()
