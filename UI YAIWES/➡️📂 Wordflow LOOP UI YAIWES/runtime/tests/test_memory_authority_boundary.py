import sys
from pathlib import Path
import unittest

SRC = Path(__file__).resolve().parents[1] / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from memory.boundary import MemoryReadRequest, MemoryScopeRef
from memory.fabric import build_context_pack


CHECKPOINT = "b" * 64


class MemoryPort:
    def read(self, **kwargs):
        return {
            "snapshot_id": "snapshot-authority",
            "revision": "rev-authority",
            "checkpoint_sha256": CHECKPOINT,
            "entries": [
                {
                    "entry_id": "project",
                    "scope": {"kind": "PROJECT", "scope_id": "project-1"},
                    "content": "bounded project context",
                    "score": 1.0,
                    "evidence_ref": "ev-project",
                    "provenance": {
                        "source": "project-ledger",
                        "revision": "1",
                        "evidence_ref": "ev-project",
                    },
                }
            ],
        }


class MemoryAuthorityBoundaryTests(unittest.TestCase):
    def test_s3_044_memory_pack_exposes_no_runtime_authority_fields(self):
        request = MemoryReadRequest(
            operation="GET_CONTEXT",
            task_ref="task-1",
            agent_id="agent-a",
            agent_memory=MemoryScopeRef("AGENT_PRIVATE", "agent-a"),
            context_scopes=(MemoryScopeRef("PROJECT", "project-1"),),
        )
        pack = build_context_pack(request, port=MemoryPort()).as_mapping()
        forbidden_authority = {
            "objective",
            "goals",
            "policy",
            "strategy",
            "final_strategy",
            "finalization",
            "authorization",
            "authorized",
            "workflow_control",
            "next_task",
        }
        self.assertTrue(pack["read_only"])
        self.assertTrue(forbidden_authority.isdisjoint(pack.keys()))


if __name__ == "__main__":
    unittest.main()
