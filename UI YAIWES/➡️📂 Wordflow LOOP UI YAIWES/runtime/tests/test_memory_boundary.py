import sys
from pathlib import Path
import unittest

SRC = Path(__file__).resolve().parents[1] / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from memory.boundary import (
    MemoryBoundaryError,
    MemoryReadRequest,
    MemoryScopeRef,
    authorize_canonical_memory_write,
    perform_memory_read,
)


class FakeMemoryPort:
    def __init__(self):
        self.calls = []

    def read(self, **kwargs):
        self.calls.append(kwargs)
        return {
            "relevant_memory": ["m1"],
            "evidence": ["e1"],
            "provenance": {"source": "fixture", "version": "1"},
            "confidence": 0.9,
        }


class MemoryBoundaryTests(unittest.TestCase):
    def request(self, operation="GET_CONTEXT"):
        return MemoryReadRequest(
            operation=operation,
            task_ref="task-42",
            agent_id="agent-7",
            agent_memory=MemoryScopeRef("AGENT_PRIVATE", "agent-7"),
            context_scopes=(
                MemoryScopeRef("CHAT", "chat-3"),
                MemoryScopeRef("PROJECT", "project-9"),
            ),
        )

    def test_get_context_returns_read_only_context_pack(self):
        port = FakeMemoryPort()
        result = perform_memory_read(self.request("GET_CONTEXT"), port=port)
        pack = result.context_pack()
        self.assertTrue(result.read_only)
        self.assertEqual(pack["task_ref"], "task-42")
        self.assertEqual(pack["payload"]["evidence"], ("e1",))
        with self.assertRaises(TypeError):
            pack["payload"]["confidence"] = 0.1

    def test_get_memory_uses_read_boundary(self):
        port = FakeMemoryPort()
        result = perform_memory_read(self.request("GET_MEMORY"), port=port)
        self.assertEqual(result.operation, "GET_MEMORY")
        self.assertEqual(port.calls[0]["operation"], "GET_MEMORY")

    def test_get_evidence_uses_read_boundary(self):
        port = FakeMemoryPort()
        result = perform_memory_read(self.request("GET_EVIDENCE"), port=port)
        self.assertEqual(result.operation, "GET_EVIDENCE")
        self.assertEqual(result.payload["evidence"], ("e1",))

    def test_write_operation_cannot_enter_read_boundary(self):
        with self.assertRaisesRegex(MemoryBoundaryError, "write_operation_not_allowed"):
            self.request("SAVE_STATE_DELTA").validate()

    def test_agent_memory_must_be_private(self):
        req = MemoryReadRequest(
            operation="GET_CONTEXT",
            task_ref="task-42",
            agent_id="agent-7",
            agent_memory=MemoryScopeRef("CHAT", "chat-3"),
        )
        with self.assertRaisesRegex(MemoryBoundaryError, "agent_memory_must_be_agent_private"):
            req.validate()

    def test_context_memory_cannot_be_agent_private(self):
        req = MemoryReadRequest(
            operation="GET_CONTEXT",
            task_ref="task-42",
            agent_id="agent-7",
            agent_memory=MemoryScopeRef("AGENT_PRIVATE", "agent-7"),
            context_scopes=(MemoryScopeRef("AGENT_PRIVATE", "other-agent"),),
        )
        with self.assertRaisesRegex(MemoryBoundaryError, "context_memory_must_be_chat_or_project"):
            req.validate()

    def test_direct_llm_canonical_write_is_rejected(self):
        with self.assertRaisesRegex(MemoryBoundaryError, "direct_llm_canonical_memory_write_forbidden"):
            authorize_canonical_memory_write(
                operation="SAVE_STATE_DELTA",
                origin="LLM",
                normalized=True,
                schema_validated=True,
                audited=True,
                state_delta_accepted=True,
            )

    def test_incomplete_write_gate_is_rejected(self):
        with self.assertRaisesRegex(MemoryBoundaryError, "canonical_memory_write_gate_incomplete"):
            authorize_canonical_memory_write(
                operation="SAVE_STATE_DELTA",
                origin="MEMORY_AUDIT",
                normalized=True,
                schema_validated=True,
                audited=False,
                state_delta_accepted=True,
            )

    def test_post_audit_memory_update_can_be_authorized(self):
        auth = authorize_canonical_memory_write(
            operation="SAVE_STATE_DELTA",
            origin="MEMORY_AUDIT",
            normalized=True,
            schema_validated=True,
            audited=True,
            state_delta_accepted=True,
        )
        self.assertTrue(auth.canonical_memory_write_authorized)
        self.assertEqual(auth.operation, "SAVE_STATE_DELTA")


if __name__ == "__main__":
    unittest.main()
