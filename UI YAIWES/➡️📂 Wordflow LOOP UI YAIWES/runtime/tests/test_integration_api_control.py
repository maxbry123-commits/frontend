import asyncio
import json
import sys
from pathlib import Path
import unittest

SRC = Path(__file__).resolve().parents[1] / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from conn.api_control import (
    ApiContractError,
    AsgiControlApp,
    AuthorizationDenied,
    ControlPlane,
    ControlStateError,
    OperationSpec,
)
from integration.integration_state import FablesIntegrationBoundary
from plugins.contract import PluginKind, PluginSpec
from plugins.fables import FablesSocket
from plugins.registry import PluginRegistry


async def asgi_request(app, method, path, body=None):
    incoming = [
        {
            "type": "http.request",
            "body": b"" if body is None else json.dumps(body).encode("utf-8"),
            "more_body": False,
        }
    ]
    sent = []

    async def receive():
        return incoming.pop(0)

    async def send(message):
        sent.append(dict(message))

    await app(
        {"type": "http", "method": method, "path": path},
        receive,
        send,
    )
    status = sent[0]["status"]
    raw = b"".join(message.get("body", b"") for message in sent[1:])
    return status, raw, sent


class ApiControlIntegrationTests(unittest.TestCase):
    def _boundary(self, capability="demo.integrate"):
        registry = PluginRegistry()
        registry.register(
            PluginSpec(
                "demo",
                PluginKind.ADAPTER,
                (capability,),
                "components/demo",
                "b" * 40,
                "demo",
                enabled=True,
                factory_key="demo",
            )
        )
        socket = FablesSocket(registry, {"demo": lambda: {"base": 10}})
        return FablesIntegrationBoundary(socket)

    def _control(self, handler=None, authorizer=None, capability="demo.integrate"):
        if handler is None:
            handler = lambda adapter, payload: adapter["base"] + payload.get("value", 0)
        if authorizer is None:
            authorizer = lambda action, context: True
        return ControlPlane(
            self._boundary(capability),
            {
                "demo.add": OperationSpec(
                    "demo",
                    capability,
                    handler,
                )
            },
            authorizer,
        )

    def test_http_create_run_status_and_stream_events(self):
        control = self._control()
        app = AsgiControlApp(control)

        status, raw, _ = asyncio.run(
            asgi_request(
                app,
                "POST",
                "/v1/tasks",
                {
                    "task_id": "t1",
                    "operation": "demo.add",
                    "payload": {"value": 2},
                    "evidence": ["test:n28"],
                },
            )
        )
        self.assertEqual(status, 201)
        self.assertEqual(json.loads(raw)["state"], "PENDING")

        status, raw, _ = asyncio.run(asgi_request(app, "POST", "/v1/tasks/t1/run"))
        self.assertEqual(status, 200)
        self.assertEqual(json.loads(raw)["result"], 12)

        status, raw, _ = asyncio.run(asgi_request(app, "GET", "/v1/tasks/t1"))
        self.assertEqual(status, 200)
        self.assertEqual(json.loads(raw)["state"], "PASS")

        status, raw, sent = asyncio.run(
            asgi_request(app, "GET", "/v1/tasks/t1/events")
        )
        self.assertEqual(status, 200)
        events = [json.loads(line) for line in raw.splitlines()]
        self.assertEqual([e["event"] for e in events], ["CREATED", "RUNNING", "PASS"])
        body_messages = [m for m in sent if m.get("type") == "http.response.body"]
        self.assertGreaterEqual(len(body_messages), 4)
        self.assertTrue(body_messages[0]["more_body"])
        self.assertFalse(body_messages[-1]["more_body"])

    def test_policy_denial_happens_before_runtime_effect(self):
        effects = []

        def handler(adapter, payload):
            effects.append(payload)
            return 1

        control = self._control(
            handler=handler,
            authorizer=lambda action, context: action != "task.run",
        )
        control.create_task(
            task_id="deny",
            operation="demo.add",
            payload={"value": 1},
            evidence=("test:deny",),
        )
        with self.assertRaises(AuthorizationDenied):
            control.run("deny")
        self.assertEqual(effects, [])
        self.assertEqual(control.status("deny")["state"], "PENDING")

    def test_authorizer_exception_fails_closed_before_create_mutation(self):
        def broken_authorizer(action, context):
            raise OSError("policy unavailable")

        control = self._control(authorizer=broken_authorizer)
        with self.assertRaises(AuthorizationDenied):
            control.create_task(
                task_id="blocked",
                operation="demo.add",
                payload={},
                evidence=("test:policy-down",),
            )
        self.assertNotIn("blocked", control._tasks)

    def test_cancel_is_idempotent_and_prevents_operation(self):
        effects = []
        control = self._control(
            handler=lambda adapter, payload: effects.append(payload)
        )
        control.create_task(
            task_id="cancelled",
            operation="demo.add",
            payload={"value": 3},
            evidence=("test:cancel",),
        )
        first = control.cancel("cancelled")
        second = control.cancel("cancelled")
        self.assertIs(first, second)
        self.assertEqual(first.state, "CANCELLED")
        self.assertEqual([event.event for event in first.events], ["CREATED", "CANCELLED"])
        with self.assertRaises(ControlStateError):
            control.run("cancelled")
        self.assertEqual(effects, [])

    def test_repeat_run_does_not_duplicate_effect(self):
        calls = []

        def handler(adapter, payload):
            calls.append(payload["value"])
            return adapter["base"] + payload["value"]

        control = self._control(handler=handler)
        control.create_task(
            task_id="once",
            operation="demo.add",
            payload={"value": 5},
            evidence=("test:idempotent",),
        )
        self.assertEqual(control.run("once").result, 15)
        self.assertEqual(control.run("once").result, 15)
        self.assertEqual(calls, [5])

    def test_unknown_operation_is_rejected_before_task_creation(self):
        control = self._control()
        with self.assertRaises(ApiContractError):
            control.create_task(
                task_id="unknown",
                operation="missing",
                payload={},
                evidence=("test:unknown",),
            )
        self.assertNotIn("unknown", control._tasks)

    def test_runtime_failure_becomes_explicit_gap(self):
        def handler(adapter, payload):
            raise RuntimeError("adapter failure")

        control = self._control(handler=handler)
        record = control.create_task(
            task_id="gap",
            operation="demo.add",
            payload={},
            evidence=("test:gap",),
        )
        with self.assertRaises(RuntimeError):
            control.run("gap")
        self.assertEqual(record.state, "GAP")
        self.assertEqual([event.event for event in record.events], ["CREATED", "RUNNING", "GAP"])
        self.assertIn("RuntimeError:adapter failure", record.gaps[0])

    def test_undeclared_fables_capability_fails_closed(self):
        boundary = self._boundary("demo.integrate")
        control = ControlPlane(
            boundary,
            {
                "bad": OperationSpec(
                    "demo",
                    "demo.undeclared",
                    lambda adapter, payload: 1,
                )
            },
            lambda action, context: True,
        )
        record = control.create_task(
            task_id="cap",
            operation="bad",
            payload={},
            evidence=("test:cap",),
        )
        with self.assertRaises(Exception):
            control.run("cap")
        self.assertEqual(record.state, "GAP")

    def test_http_policy_denial_returns_403_without_effect(self):
        effects = []
        control = self._control(
            handler=lambda adapter, payload: effects.append("ran"),
            authorizer=lambda action, context: action != "task.run",
        )
        app = AsgiControlApp(control)
        asyncio.run(
            asgi_request(
                app,
                "POST",
                "/v1/tasks",
                {
                    "task_id": "http-deny",
                    "operation": "demo.add",
                    "payload": {},
                    "evidence": ["test:http-deny"],
                },
            )
        )
        status, raw, _ = asyncio.run(
            asgi_request(app, "POST", "/v1/tasks/http-deny/run")
        )
        self.assertEqual(status, 403)
        self.assertIn("authorization denied", json.loads(raw)["error"])
        self.assertEqual(effects, [])


if __name__ == "__main__":
    unittest.main()
