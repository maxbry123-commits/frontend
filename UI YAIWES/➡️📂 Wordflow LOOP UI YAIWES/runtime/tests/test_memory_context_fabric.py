import sys
from pathlib import Path
import unittest

SRC = Path(__file__).resolve().parents[1] / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from agent.boundary import (
    AgentBoundaryRequest,
    MemoryScopeKind,
    MemoryScopeRef as AgentMemoryScopeRef,
    build_stage_context,
)
from memory.boundary import (
    MemoryBoundaryError,
    MemoryReadRequest,
    MemoryScopeRef,
    authorize_canonical_memory_write,
    perform_memory_read,
)
from memory.fabric import ContextBudget, build_context_pack


CHECKPOINT = "a" * 64


class DurableMemoryPort:
    """Test port modeling state that survives process/fabric recreation."""

    def __init__(self):
        self.snapshots = {
            "agent-a": {
                "snapshot_id": "snapshot-7",
                "revision": "rev-11",
                "checkpoint_sha256": CHECKPOINT,
                "entries": [
                    {
                        "entry_id": "project",
                        "scope": {"kind": "PROJECT", "scope_id": "project-1"},
                        "content": "project context",
                        "score": 0.7,
                        "evidence_ref": "ev-project",
                        "provenance": {
                            "source": "project-ledger",
                            "revision": "7",
                            "evidence_ref": "ev-project",
                        },
                    },
                    {
                        "entry_id": "private",
                        "scope": {
                            "kind": "AGENT_PRIVATE",
                            "scope_id": "agent-a",
                        },
                        "content": "private agent memory",
                        "score": 1.0,
                        "evidence_ref": "ev-agent",
                        "provenance": {
                            "source": "agent-memory",
                            "revision": "11",
                            "evidence_ref": "ev-agent",
                        },
                    },
                    {
                        "entry_id": "chat",
                        "scope": {"kind": "CHAT", "scope_id": "chat-1"},
                        "content": "chat context",
                        "score": 0.9,
                        "evidence_ref": "ev-chat",
                        "provenance": {
                            "source": "chat-ledger",
                            "revision": "8",
                            "evidence_ref": "ev-chat",
                        },
                    },
                ],
            }
        }
        self.calls = []

    def read(self, **kwargs):
        self.calls.append(kwargs)
        return self.snapshots[kwargs["agent_id"]]


def request(operation="GET_CONTEXT", agent_id="agent-a"):
    return MemoryReadRequest(
        operation=operation,
        task_ref="task-1",
        agent_id=agent_id,
        agent_memory=MemoryScopeRef("AGENT_PRIVATE", agent_id),
        context_scopes=(
            MemoryScopeRef("CHAT", "chat-1"),
            MemoryScopeRef("PROJECT", "project-1"),
        ),
    )


class MemoryContextFabricTests(unittest.TestCase):
    def test_context_pack_rank_budget_and_provenance_are_deterministic(self):
        pack = build_context_pack(
            request(),
            port=DurableMemoryPort(),
            budget=ContextBudget(max_items=2, max_chars=100),
        )
        self.assertEqual([item.entry_id for item in pack.entries], ["private", "chat"])
        self.assertEqual(pack.checkpoint_sha256, CHECKPOINT)
        self.assertEqual(pack.omitted_count, 1)
        self.assertEqual(
            pack.used_chars,
            len("private agent memory") + len("chat context"),
        )
        self.assertRegex(pack.provenance_digest, r"^[0-9a-f]{64}$")

    def test_restart_rebuilds_same_pack_from_persisted_snapshot(self):
        port = DurableMemoryPort()
        before_restart = build_context_pack(request(), port=port)
        after_restart = build_context_pack(request(), port=port)
        self.assertEqual(before_restart.snapshot_id, after_restart.snapshot_id)
        self.assertEqual(before_restart.revision, after_restart.revision)
        self.assertEqual(
            before_restart.provenance_digest,
            after_restart.provenance_digest,
        )
        self.assertEqual(before_restart.entries, after_restart.entries)

    def test_cross_agent_private_memory_leak_fails_closed(self):
        port = DurableMemoryPort()
        port.snapshots["agent-a"]["entries"].append(
            {
                "entry_id": "leak",
                "scope": {"kind": "AGENT_PRIVATE", "scope_id": "agent-b"},
                "content": "must not leak",
                "score": 1.0,
                "evidence_ref": "ev-leak",
                "provenance": {
                    "source": "agent-memory",
                    "revision": "2",
                    "evidence_ref": "ev-leak",
                },
            }
        )
        with self.assertRaisesRegex(
            MemoryBoundaryError, "context_entry_scope_not_authorized"
        ):
            build_context_pack(request(), port=port)

    def test_provenance_evidence_mismatch_fails_closed(self):
        port = DurableMemoryPort()
        port.snapshots["agent-a"]["entries"][0]["provenance"][
            "evidence_ref"
        ] = "wrong"
        with self.assertRaisesRegex(
            MemoryBoundaryError, "context_entry_provenance_evidence_mismatch"
        ):
            build_context_pack(request(), port=port)

    def test_checkpoint_identity_is_required_and_validated(self):
        port = DurableMemoryPort()
        port.snapshots["agent-a"]["checkpoint_sha256"] = "not-a-sha"
        with self.assertRaisesRegex(
            MemoryBoundaryError, "memory_checkpoint_sha256_invalid"
        ):
            build_context_pack(request(), port=port)

    def test_context_pack_is_deeply_read_only(self):
        pack = build_context_pack(request(), port=DurableMemoryPort())
        mapped = pack.as_mapping()
        with self.assertRaises(TypeError):
            mapped["revision"] = "changed"
        with self.assertRaises(TypeError):
            mapped["entries"][0]["content"] = "changed"
        with self.assertRaises(TypeError):
            mapped["entries"][0]["provenance"]["source"] = "changed"

    def test_get_memory_and_evidence_use_same_canonical_read_port(self):
        port = DurableMemoryPort()
        memory = perform_memory_read(request("GET_MEMORY"), port=port)
        evidence = perform_memory_read(request("GET_EVIDENCE"), port=port)
        self.assertEqual(memory.payload["snapshot_id"], "snapshot-7")
        self.assertEqual(evidence.payload["checkpoint_sha256"], CHECKPOINT)
        self.assertEqual(
            [call["operation"] for call in port.calls],
            ["GET_MEMORY", "GET_EVIDENCE"],
        )

    def test_context_fabric_connects_to_agent_without_memory_writer(self):
        pack = build_context_pack(request(), port=DurableMemoryPort()).as_mapping()
        agent_request = AgentBoundaryRequest(
            agent_id="agent-a",
            task_ref="task-1",
            agent_memory=AgentMemoryScopeRef(
                MemoryScopeKind.AGENT_PRIVATE, "agent-a"
            ),
            context_scopes=(
                AgentMemoryScopeRef(MemoryScopeKind.CHAT, "chat-1"),
                AgentMemoryScopeRef(MemoryScopeKind.PROJECT, "project-1"),
            ),
        )
        stage = build_stage_context(
            agent_request,
            context_pack=pack,
            llm_input={"prompt": "answer from bounded context"},
        )
        self.assertEqual(stage["context_pack"]["snapshot_id"], "snapshot-7")
        self.assertNotIn("memory_writer", stage)
        self.assertNotIn("canonical_memory_writer", stage)
        self.assertNotIn("save_memory", stage)

    def test_direct_llm_write_remains_forbidden_end_to_end(self):
        with self.assertRaisesRegex(
            MemoryBoundaryError, "direct_llm_canonical_memory_write_forbidden"
        ):
            authorize_canonical_memory_write(
                operation="SAVE_STATE_DELTA",
                origin="LLM",
                normalized=True,
                schema_validated=True,
                audited=True,
                state_delta_accepted=True,
            )

    def test_tight_character_budget_omits_entries_without_truncating_them(self):
        pack = build_context_pack(
            request(),
            port=DurableMemoryPort(),
            budget=ContextBudget(max_items=10, max_chars=len("chat context")),
        )
        self.assertEqual([item.entry_id for item in pack.entries], ["chat"])
        self.assertEqual(pack.entries[0].content, "chat context")
        self.assertEqual(pack.omitted_count, 2)


if __name__ == "__main__":
    unittest.main()
