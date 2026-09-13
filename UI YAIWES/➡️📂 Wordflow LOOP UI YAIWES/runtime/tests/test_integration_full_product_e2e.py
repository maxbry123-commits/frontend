from __future__ import annotations

import asyncio
import json
import sys
from pathlib import Path
import unittest

SRC = Path(__file__).resolve().parents[1] / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from conn.api_control import AsgiControlApp, ControlPlane, OperationSpec
from integration.integration_state import FablesIntegrationBoundary
from memory.boundary import MemoryReadRequest, MemoryScopeRef
from memory.fabric import build_context_pack
from plugins.contract import PluginKind, PluginSpec
from plugins.fables import FablesSocket
from plugins.registry import PluginRegistry
from recovery.product_session import restore_product_session
from storage.product_state import (
    ChatMessage,
    ProductSnapshot,
    WindowState,
    build_file_state,
    encode_snapshot,
    snapshot_sha256,
)


async def asgi_request(app, method, path, body=None):
    incoming = [{
        "type": "http.request",
        "body": b"" if body is None else json.dumps(body).encode("utf-8"),
        "more_body": False,
    }]
    sent = []

    async def receive():
        return incoming.pop(0)

    async def send(message):
        sent.append(dict(message))

    await app({"type": "http", "method": method, "path": path}, receive, send)
    status = sent[0]["status"]
    raw = b"".join(message.get("body", b"") for message in sent[1:])
    return status, raw, sent


class DurableMemoryPort:
    def __init__(self, checkpoint_sha256):
        self.checkpoint_sha256 = checkpoint_sha256
        self.calls = []

    def read(self, **kwargs):
        self.calls.append(kwargs)
        return {
            "snapshot_id": "memory-snapshot-17",
            "revision": "memory-rev-17",
            "checkpoint_sha256": self.checkpoint_sha256,
            "entries": [
                {
                    "entry_id": "agent-private",
                    "scope": {"kind": "AGENT_PRIVATE", "scope_id": "agent-17"},
                    "content": "remember evidence before answering",
                    "score": 1.0,
                    "evidence_ref": "ev:memory:agent-17",
                    "provenance": {
                        "source": "memory-ledger",
                        "revision": "17",
                        "evidence_ref": "ev:memory:agent-17",
                    },
                },
                {
                    "entry_id": "chat",
                    "scope": {"kind": "CHAT", "scope_id": "chat-17"},
                    "content": "user requested restored project answer",
                    "score": 0.9,
                    "evidence_ref": "ev:chat:17",
                    "provenance": {
                        "source": "chat-ledger",
                        "revision": "17",
                        "evidence_ref": "ev:chat:17",
                    },
                },
                {
                    "entry_id": "project",
                    "scope": {"kind": "PROJECT", "scope_id": "project-17"},
                    "content": "project state is checkpoint bound",
                    "score": 0.8,
                    "evidence_ref": "ev:project:17",
                    "provenance": {
                        "source": "project-ledger",
                        "revision": "17",
                        "evidence_ref": "ev:project:17",
                    },
                },
            ],
        }


class ProductAnswerAdapter:
    def __init__(self):
        self.calls = 0

    def answer(self, *, context_pack, recovered):
        self.calls += 1
        return {
            "answer": (
                context_pack.entries[0].content
                + " | "
                + recovered.snapshot.chat[-1].content
                + " | "
                + dict(recovered.file_contents)["file-17"].decode("utf-8")
            ),
            "session_id": recovered.snapshot.session_id,
            "context_snapshot_id": context_pack.snapshot_id,
            "context_provenance_digest": context_pack.provenance_digest,
            "checkpoint_sha256": context_pack.checkpoint_sha256,
            "evidence_refs": [
                context_pack.entries[0].evidence_ref,
                "checkpoint:" + context_pack.checkpoint_sha256,
            ],
        }


class FullProductE2ETests(unittest.TestCase):
    def setUp(self):
        file_state = build_file_state(
            "file-17", "answer.txt", b"restored-file", "text/plain"
        )
        self.snapshot = ProductSnapshot(
            session_id="session-17",
            agent_memory_ref="memory://agent/17",
            chat=(
                ChatMessage("m1", 0, "user", "restore the answer"),
                ChatMessage("m2", 1, "assistant", "restored-chat"),
            ),
            windows=(WindowState("w1", "chat", "Session 17", "file-17"),),
            files=(file_state,),
        )
        self.raw_snapshot = encode_snapshot(self.snapshot)
        self.checkpoint_sha = snapshot_sha256(self.raw_snapshot)
        self.adapter = ProductAnswerAdapter()
        self.tamper = False
        self.control = self._control()
        self.app = AsgiControlApp(self.control)

    def _memory_request(self):
        return MemoryReadRequest(
            operation="GET_CONTEXT",
            task_ref="task-17",
            agent_id="agent-17",
            agent_memory=MemoryScopeRef("AGENT_PRIVATE", "agent-17"),
            context_scopes=(
                MemoryScopeRef("CHAT", "chat-17"),
                MemoryScopeRef("PROJECT", "project-17"),
            ),
        )

    def _handler(self, adapter, payload):
        # Fresh ports model process/fabric recreation over the same durable snapshot.
        before = build_context_pack(
            self._memory_request(), port=DurableMemoryPort(self.checkpoint_sha)
        )
        after_restart = build_context_pack(
            self._memory_request(), port=DurableMemoryPort(self.checkpoint_sha)
        )
        if before.provenance_digest != after_restart.provenance_digest:
            raise RuntimeError("context_restart_drift")

        raw = self.raw_snapshot + (b"tamper" if self.tamper else b"")
        recovered = restore_product_session(
            checkpoint_ref="checkpoint://session/17",
            checkpoint_sha256=before.checkpoint_sha256,
            checkpoint_bytes_loader=lambda _ref: raw,
            expected_session_id="session-17",
        )
        recovered_after_restart = restore_product_session(
            checkpoint_ref="checkpoint://session/17",
            checkpoint_sha256=after_restart.checkpoint_sha256,
            checkpoint_bytes_loader=lambda _ref: self.raw_snapshot,
            expected_session_id="session-17",
        )
        if recovered != recovered_after_restart:
            raise RuntimeError("recovery_restart_drift")
        return adapter.answer(context_pack=after_restart, recovered=recovered_after_restart)

    def _control(self):
        registry = PluginRegistry()
        registry.register(
            PluginSpec(
                "product_answer",
                PluginKind.ADAPTER,
                ("product.answer",),
                "runtime/tests/e2e/product_answer",
                "a" * 40,
                "product_answer",
                enabled=True,
                factory_key="product_answer",
            )
        )
        boundary = FablesIntegrationBoundary(
            FablesSocket(registry, {"product_answer": lambda: self.adapter})
        )
        return ControlPlane(
            boundary,
            {
                "product.answer": OperationSpec(
                    "product_answer", "product.answer", self._handler
                )
            },
            lambda action, context: True,
        )

    def _create(self, task_id="task-17"):
        return asyncio.run(
            asgi_request(
                self.app,
                "POST",
                "/v1/tasks",
                {
                    "task_id": task_id,
                    "operation": "product.answer",
                    "payload": {"prompt": "answer from recovered state"},
                    "evidence": [
                        "ui:chat-17",
                        "checkpoint:" + self.checkpoint_sha,
                        "memory:memory-snapshot-17",
                    ],
                },
            )
        )

    def test_ui_api_fables_memory_recovery_to_observable_response(self):
        status, raw, _ = self._create()
        self.assertEqual(status, 201)
        self.assertEqual(json.loads(raw)["state"], "PENDING")

        status, raw, _ = asyncio.run(
            asgi_request(self.app, "POST", "/v1/tasks/task-17/run")
        )
        self.assertEqual(status, 200)
        result = json.loads(raw)
        self.assertEqual(result["state"], "PASS")
        self.assertEqual(result["result"]["session_id"], "session-17")
        self.assertEqual(result["result"]["checkpoint_sha256"], self.checkpoint_sha)
        self.assertIn("remember evidence before answering", result["result"]["answer"])
        self.assertIn("restored-chat", result["result"]["answer"])
        self.assertIn("restored-file", result["result"]["answer"])
        self.assertEqual(self.adapter.calls, 1)

        status, raw, _ = asyncio.run(
            asgi_request(self.app, "GET", "/v1/tasks/task-17/events")
        )
        self.assertEqual(status, 200)
        events = [json.loads(line) for line in raw.splitlines()]
        self.assertEqual([event["event"] for event in events], ["CREATED", "RUNNING", "PASS"])
        self.assertEqual(
            events[-1]["data"]["evidence"],
            [
                "ui:chat-17",
                "checkpoint:" + self.checkpoint_sha,
                "memory:memory-snapshot-17",
            ],
        )

    def test_checkpoint_tamper_becomes_api_gap_before_answer_effect(self):
        self.tamper = True
        self._create("tampered")
        status, raw, _ = asyncio.run(
            asgi_request(self.app, "POST", "/v1/tasks/tampered/run")
        )
        self.assertEqual(status, 502)
        self.assertEqual(json.loads(raw)["type"], "RecoveryControlPlaneError")
        self.assertEqual(self.adapter.calls, 0)
        status, raw, _ = asyncio.run(
            asgi_request(self.app, "GET", "/v1/tasks/tampered/events")
        )
        self.assertEqual(status, 200)
        events = [json.loads(line) for line in raw.splitlines()]
        self.assertEqual([event["event"] for event in events], ["CREATED", "RUNNING", "GAP"])
        self.assertIn("checkpoint_sha256_mismatch", events[-1]["data"]["gaps"][0])

    def test_repeat_run_is_idempotent_and_does_not_repeat_product_effect(self):
        self._create()
        first_status, first_raw, _ = asyncio.run(
            asgi_request(self.app, "POST", "/v1/tasks/task-17/run")
        )
        second_status, second_raw, _ = asyncio.run(
            asgi_request(self.app, "POST", "/v1/tasks/task-17/run")
        )
        self.assertEqual((first_status, second_status), (200, 200))
        self.assertEqual(json.loads(first_raw)["result"], json.loads(second_raw)["result"])
        self.assertEqual(self.adapter.calls, 1)
        self.assertEqual(
            [event.event for event in self.control.events("task-17")],
            ["CREATED", "RUNNING", "PASS"],
        )


if __name__ == "__main__":
    unittest.main()
