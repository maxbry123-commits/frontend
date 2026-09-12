import sys
from pathlib import Path
import unittest

SRC = Path(__file__).resolve().parents[2]
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from agent.boundary import (
    AgentBoundaryError,
    AgentBoundaryRequest,
    MemoryScopeKind,
    MemoryScopeRef,
    WORKFLOW_CONTRACT,
    WORKFLOW_OWNER,
    build_agent_loop,
    build_stage_context,
    candidate_from_task_outputs,
)


class FakeAgentLoop:
    def __init__(self, client=None, tools=None):
        self.client = client
        self.tools = tools


class AgentBoundaryTests(unittest.TestCase):
    def _request(self) -> AgentBoundaryRequest:
        return AgentBoundaryRequest(
            agent_id="yaiwes-agent-01",
            task_ref="TASK-001",
            agent_memory=MemoryScopeRef(MemoryScopeKind.AGENT_PRIVATE, "agent-01"),
            context_scopes=(
                MemoryScopeRef(MemoryScopeKind.CHAT, "chat-77"),
                MemoryScopeRef(MemoryScopeKind.PROJECT, "project-yaiwes"),
            ),
            allowed_tools=("search", "code"),
        )

    def test_valid_contract_is_stabilize_owned_and_memory_isolated(self):
        request = self._request()
        manifest = request.manifest()
        self.assertEqual(manifest["workflow_owner"], WORKFLOW_OWNER)
        self.assertEqual(manifest["workflow_owner"], "stabilize_core")
        self.assertEqual(manifest["workflow_contract"], WORKFLOW_CONTRACT)
        self.assertEqual(manifest["workflow_contract"], "tel.workflow/v3")
        self.assertEqual(manifest["agent_memory"]["kind"], "AGENT_PRIVATE")
        self.assertEqual(
            [scope["kind"] for scope in manifest["context_scopes"]],
            ["CHAT", "PROJECT"],
        )

    def test_chat_or_project_memory_cannot_be_agent_private_memory(self):
        for kind in (MemoryScopeKind.CHAT, MemoryScopeKind.PROJECT):
            with self.subTest(kind=kind):
                request = AgentBoundaryRequest(
                    agent_id="agent",
                    task_ref="task",
                    agent_memory=MemoryScopeRef(kind, "shared"),
                )
                with self.assertRaisesRegex(
                    AgentBoundaryError, "agent_memory_must_be_agent_private"
                ):
                    request.validate()

    def test_agent_private_scope_cannot_be_in_context_memory(self):
        request = AgentBoundaryRequest(
            agent_id="agent",
            task_ref="task",
            agent_memory=MemoryScopeRef(MemoryScopeKind.AGENT_PRIVATE, "agent-own"),
            context_scopes=(
                MemoryScopeRef(MemoryScopeKind.AGENT_PRIVATE, "other-agent"),
            ),
        )
        with self.assertRaisesRegex(
            AgentBoundaryError, "context_memory_must_be_chat_or_project"
        ):
            request.validate()

    def test_build_stage_context_carries_context_pack_without_memory_writer(self):
        context = build_stage_context(
            self._request(),
            context_pack={"relevant_memory": ["fact"], "evidence": ["sha256:abc"]},
            llm_input={"prompt": "solve task"},
        )
        self.assertEqual(context["max_iterations"], 8)
        self.assertEqual(context["output_key"], "answer")
        self.assertEqual(context["context_pack"]["relevant_memory"], ["fact"])
        self.assertNotIn("memory_writer", context)
        self.assertNotIn("canonical_memory_writer", context)
        self.assertNotIn("save_memory", context)

    def test_existing_agent_loop_type_is_composed_not_reimplemented(self):
        client = object()
        tools = object()
        loop = build_agent_loop(
            client=client,
            tools=tools,
            agent_loop_type=FakeAgentLoop,
        )
        self.assertIsInstance(loop, FakeAgentLoop)
        self.assertIs(loop.client, client)
        self.assertIs(loop.tools, tools)

    def test_candidate_result_is_explicitly_noncanonical(self):
        candidate = candidate_from_task_outputs(
            self._request(),
            {
                "answer": "candidate",
                "tool_invocations": [{"tool": "search", "result": "ok"}],
                "iterations": 2,
            },
        )
        self.assertEqual(candidate.answer, "candidate")
        self.assertEqual(candidate.task_ref, "TASK-001")
        self.assertFalse(candidate.canonical_memory_write)
        self.assertEqual(candidate.agent_memory.kind, MemoryScopeKind.AGENT_PRIVATE)

    def test_wrong_workflow_owner_fails_closed(self):
        request = AgentBoundaryRequest(
            agent_id="agent",
            task_ref="task",
            agent_memory=MemoryScopeRef(MemoryScopeKind.AGENT_PRIVATE, "private"),
            workflow_owner="yaiwes_second_orchestrator",
        )
        with self.assertRaisesRegex(
            AgentBoundaryError, "workflow_owner_must_be_stabilize_core"
        ):
            request.validate()


if __name__ == "__main__":
    unittest.main()
