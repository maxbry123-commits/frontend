from __future__ import annotations

from dataclasses import dataclass, field
import json
from typing import Any, Awaitable, Callable, Mapping

from integration.integration_state import FablesIntegrationBoundary

# Auditable donor/source presence. These are not runtime imports: the canonical CI
# sparse-checkout does not install these packages, so the control plane stays
# dependency-free while exposing the same ASGI boundary they can wrap later.
HTTPX_VENDOR_TREE_SHA = "21eaf49210613909be2f7a864389a312a484d0eb"
STARLETTE_VENDOR_TREE_SHA = "820b2cdde800811062b2be43abd909e27b38854f"

Authorizer = Callable[[str, Mapping[str, Any]], bool]
OperationHandler = Callable[[Any, Mapping[str, Any]], Any]


class ApiContractError(ValueError):
    pass


class AuthorizationDenied(PermissionError):
    pass


class TaskNotFound(KeyError):
    pass


class ControlStateError(RuntimeError):
    pass


@dataclass(frozen=True)
class OperationSpec:
    plugin: str
    capability: str
    handler: OperationHandler


@dataclass(frozen=True)
class ControlEvent:
    task_id: str
    seq: int
    event: str
    data: Mapping[str, Any]

    def as_dict(self) -> dict[str, Any]:
        return {
            "task_id": self.task_id,
            "seq": self.seq,
            "event": self.event,
            "data": dict(self.data),
        }


@dataclass
class TaskRecord:
    task_id: str
    operation: str
    payload: dict[str, Any]
    evidence: tuple[str, ...]
    state: str = "PENDING"
    result: Any = None
    gaps: tuple[str, ...] = ()
    events: list[ControlEvent] = field(default_factory=list)

    def status(self) -> dict[str, Any]:
        body: dict[str, Any] = {
            "task_id": self.task_id,
            "operation": self.operation,
            "state": self.state,
            "evidence": list(self.evidence),
            "gaps": list(self.gaps),
        }
        if self.state == "PASS":
            body["result"] = self.result
        return body


class ControlPlane:
    """Deterministic API/control state machine; never schedules work itself."""

    def __init__(
        self,
        boundary: FablesIntegrationBoundary,
        operations: Mapping[str, OperationSpec],
        authorizer: Authorizer,
    ) -> None:
        self.boundary = boundary
        self.operations = dict(operations)
        self.authorizer = authorizer
        self._tasks: dict[str, TaskRecord] = {}

    def _authorize(self, action: str, context: Mapping[str, Any]) -> None:
        try:
            allowed = self.authorizer(action, context)
        except Exception as exc:
            raise AuthorizationDenied(f"authorization failed closed for {action}") from exc
        if allowed is not True:
            raise AuthorizationDenied(f"authorization denied for {action}")

    @staticmethod
    def _require_task_id(task_id: str) -> str:
        value = str(task_id).strip()
        if not value:
            raise ApiContractError("task_id is required")
        return value

    @staticmethod
    def _json_safe(value: Any, field_name: str) -> None:
        try:
            json.dumps(value, sort_keys=True, separators=(",", ":"))
        except (TypeError, ValueError) as exc:
            raise ApiContractError(f"{field_name} must be JSON serializable") from exc

    def _emit(self, record: TaskRecord, event: str, data: Mapping[str, Any]) -> None:
        self._json_safe(dict(data), "event data")
        record.events.append(
            ControlEvent(record.task_id, len(record.events) + 1, event, dict(data))
        )

    def _get(self, task_id: str) -> TaskRecord:
        try:
            return self._tasks[task_id]
        except KeyError as exc:
            raise TaskNotFound(task_id) from exc

    def create_task(
        self,
        *,
        task_id: str,
        operation: str,
        payload: Mapping[str, Any] | None,
        evidence: tuple[str, ...],
    ) -> TaskRecord:
        task_id = self._require_task_id(task_id)
        operation = str(operation).strip()
        if operation not in self.operations:
            raise ApiContractError(f"unknown operation: {operation}")
        if not evidence or any(not str(item).strip() for item in evidence):
            raise ApiContractError("non-empty evidence is required")
        body = dict(payload or {})
        self._json_safe(body, "payload")
        self._authorize(
            "task.create",
            {"task_id": task_id, "operation": operation, "payload": body},
        )
        if task_id in self._tasks:
            raise ControlStateError(f"task already exists: {task_id}")
        record = TaskRecord(task_id, operation, body, tuple(evidence))
        self._emit(record, "CREATED", {"state": record.state})
        self._tasks[task_id] = record
        return record

    def status(self, task_id: str) -> dict[str, Any]:
        task_id = self._require_task_id(task_id)
        self._authorize("task.status", {"task_id": task_id})
        return self._get(task_id).status()

    def events(self, task_id: str) -> tuple[ControlEvent, ...]:
        task_id = self._require_task_id(task_id)
        self._authorize("task.events", {"task_id": task_id})
        return tuple(self._get(task_id).events)

    def cancel(self, task_id: str) -> TaskRecord:
        task_id = self._require_task_id(task_id)
        self._authorize("task.cancel", {"task_id": task_id})
        record = self._get(task_id)
        if record.state == "CANCELLED":
            return record
        if record.state != "PENDING":
            raise ControlStateError(
                f"cannot cancel task {task_id} from state {record.state}"
            )
        record.state = "CANCELLED"
        self._emit(record, "CANCELLED", {"state": record.state})
        return record

    def run(self, task_id: str) -> TaskRecord:
        task_id = self._require_task_id(task_id)
        self._authorize("task.run", {"task_id": task_id})
        record = self._get(task_id)
        if record.state == "PASS":
            return record
        if record.state != "PENDING":
            raise ControlStateError(
                f"cannot run task {task_id} from state {record.state}"
            )
        spec = self.operations[record.operation]
        record.state = "RUNNING"
        self._emit(record, "RUNNING", {"state": record.state})
        try:
            result, lane = self.boundary.execute(
                plugin=spec.plugin,
                capability=spec.capability,
                lane=f"api:{task_id}",
                evidence=record.evidence,
                operation=lambda adapter: spec.handler(adapter, record.payload),
            )
            self._json_safe(result, "operation result")
        except Exception as exc:
            record.state = "GAP"
            record.gaps = (f"{type(exc).__name__}:{exc}",)
            self._emit(
                record,
                "GAP",
                {"state": record.state, "gaps": list(record.gaps)},
            )
            raise
        record.state = "PASS"
        record.result = result
        self._emit(
            record,
            "PASS",
            {"state": record.state, "lane": lane.lane, "evidence": list(lane.evidence)},
        )
        return record


class AsgiControlApp:
    """Small ASGI HTTP surface for status, cancellation and event streaming."""

    def __init__(self, control: ControlPlane) -> None:
        self.control = control

    async def __call__(
        self,
        scope: Mapping[str, Any],
        receive: Callable[[], Awaitable[Mapping[str, Any]]],
        send: Callable[[Mapping[str, Any]], Awaitable[None]],
    ) -> None:
        if scope.get("type") != "http":
            await self._json(send, 400, {"error": "http scope required"})
            return
        method = str(scope.get("method", "GET")).upper()
        path = str(scope.get("path", "/"))
        try:
            if method == "POST" and path == "/v1/tasks":
                body = await self._body(receive)
                record = self.control.create_task(
                    task_id=body.get("task_id", ""),
                    operation=body.get("operation", ""),
                    payload=body.get("payload"),
                    evidence=tuple(body.get("evidence") or ()),
                )
                await self._json(send, 201, record.status())
                return

            parts = [part for part in path.split("/") if part]
            if len(parts) not in (3, 4) or parts[:2] != ["v1", "tasks"]:
                await self._json(send, 404, {"error": "not found"})
                return
            task_id = parts[2]

            if method == "GET" and len(parts) == 3:
                await self._json(send, 200, self.control.status(task_id))
                return
            if method == "POST" and len(parts) == 4 and parts[3] == "run":
                await self._json(send, 200, self.control.run(task_id).status())
                return
            if method == "POST" and len(parts) == 4 and parts[3] == "cancel":
                await self._json(send, 200, self.control.cancel(task_id).status())
                return
            if method == "GET" and len(parts) == 4 and parts[3] == "events":
                await self._stream_events(send, self.control.events(task_id))
                return
            await self._json(send, 404, {"error": "not found"})
        except AuthorizationDenied as exc:
            await self._json(send, 403, {"error": str(exc)})
        except TaskNotFound:
            await self._json(send, 404, {"error": "task not found"})
        except ApiContractError as exc:
            await self._json(send, 400, {"error": str(exc)})
        except ControlStateError as exc:
            await self._json(send, 409, {"error": str(exc)})
        except Exception as exc:
            await self._json(
                send,
                502,
                {"error": "runtime execution failed", "type": type(exc).__name__},
            )

    @staticmethod
    async def _body(
        receive: Callable[[], Awaitable[Mapping[str, Any]]]
    ) -> dict[str, Any]:
        chunks: list[bytes] = []
        while True:
            message = await receive()
            if message.get("type") != "http.request":
                raise ApiContractError("invalid ASGI request message")
            chunks.append(bytes(message.get("body", b"")))
            if not message.get("more_body", False):
                break
        raw = b"".join(chunks)
        if not raw:
            return {}
        try:
            decoded = json.loads(raw.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError) as exc:
            raise ApiContractError("request body must be UTF-8 JSON") from exc
        if not isinstance(decoded, dict):
            raise ApiContractError("request body must be a JSON object")
        return decoded

    @staticmethod
    async def _json(
        send: Callable[[Mapping[str, Any]], Awaitable[None]],
        status: int,
        body: Mapping[str, Any],
    ) -> None:
        payload = json.dumps(
            dict(body), sort_keys=True, separators=(",", ":")
        ).encode("utf-8")
        await send(
            {
                "type": "http.response.start",
                "status": status,
                "headers": [(b"content-type", b"application/json")],
            }
        )
        await send({"type": "http.response.body", "body": payload})

    @staticmethod
    async def _stream_events(
        send: Callable[[Mapping[str, Any]], Awaitable[None]],
        events: tuple[ControlEvent, ...],
    ) -> None:
        await send(
            {
                "type": "http.response.start",
                "status": 200,
                "headers": [(b"content-type", b"application/x-ndjson")],
            }
        )
        for event in events:
            chunk = (
                json.dumps(
                    event.as_dict(), sort_keys=True, separators=(",", ":")
                )
                + "\n"
            ).encode("utf-8")
            await send(
                {"type": "http.response.body", "body": chunk, "more_body": True}
            )
        await send({"type": "http.response.body", "body": b"", "more_body": False})
