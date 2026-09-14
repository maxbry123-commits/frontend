from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path
import unittest

SRC = Path(__file__).resolve().parents[1] / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from storage.local_first import LocalFirstStorageError, StabilizeLocalFirstStorage

MASTER_INPUT_ID = "master_input:original"


class Scope:
    def __init__(self, kind: str, scope_id: str):
        self.kind = kind
        self.scope_id = scope_id


class Backend:
    def __init__(self):
        self.shared = {}

    def save_snapshot(self, **kwargs):
        state = json.loads(json.dumps(kwargs["state"]))
        state_hash = hashlib.sha256(
            json.dumps(state, sort_keys=True, default=str).encode()
        ).hexdigest()
        self.shared[kwargs["entity_id"]] = {
            "version": kwargs["version"],
            "sequence": kwargs["sequence"],
            "state": state,
            "state_hash": state_hash,
        }

    def get_latest_snapshot(self, _entity_type, entity_id):
        return self.shared.get(entity_id)


def entry(entry_id: str, content: str, revision: str):
    return {
        "entry_id": entry_id,
        "content": content,
        "score": 1.0,
        "evidence_ref": f"evidence-{revision}",
        "provenance": {
            "source": "master-input-test",
            "revision": revision,
            "evidence_ref": f"evidence-{revision}",
        },
    }


class MasterInputInvariantTests(unittest.TestCase):
    def setUp(self):
        self.scope = Scope("PROJECT", "project-master")
        self.store = StabilizeLocalFirstStorage(
            backend=Backend(), entity_type="workflow"
        )

    def checkpoint_entries(self):
        payload = json.loads(self.store.export_checkpoint(self.scope).payload)
        return payload["state"]["entries"]

    def test_derived_snapshot_cannot_drop_original_master_input(self):
        original = entry(MASTER_INPUT_ID, "ORIGINAL", "1")
        self.store.save_entries(self.scope, [original])
        self.store.save_entries(self.scope, [entry("derived:plan", "PLAN", "2")])
        by_id = {item["entry_id"]: item for item in self.checkpoint_entries()}
        self.assertEqual(by_id[MASTER_INPUT_ID]["content"], original["content"])
        self.assertEqual(
            by_id[MASTER_INPUT_ID]["provenance"], original["provenance"]
        )
        self.assertEqual(by_id["derived:plan"]["content"], "PLAN")

    def test_master_input_content_cannot_be_replaced(self):
        self.store.save_entries(
            self.scope, [entry(MASTER_INPUT_ID, "ORIGINAL", "1")]
        )
        with self.assertRaisesRegex(
            LocalFirstStorageError, "master_input_original_immutable"
        ):
            self.store.save_entries(
                self.scope, [entry(MASTER_INPUT_ID, "MUTATED", "2")]
            )


if __name__ == "__main__":
    unittest.main()
