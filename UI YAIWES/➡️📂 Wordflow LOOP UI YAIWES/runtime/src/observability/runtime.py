from __future__ import annotations

from dataclasses import dataclass
from hashlib import sha256
from typing import Any, Mapping, Protocol


class TelemetryConfigurationError(RuntimeError):
    pass


@dataclass(frozen=True)
class CorrelationContext:
    workflow_id: str
    task_id: str
    correlation_id: str

    @classmethod
    def build(cls, workflow_id: str, task_id: str) -> "CorrelationContext":
        if not workflow_id or not task_id:
            raise ValueError("workflow_id and task_id are required")
        digest = sha256(f"{workflow_id}\x00{task_id}".encode("utf-8")).hexdigest()
        return cls(workflow_id=workflow_id, task_id=task_id, correlation_id=digest)


@dataclass(frozen=True)
class TelemetryEvent:
    name: str
    context: CorrelationContext
    attributes: Mapping[str, str]


class TelemetrySink(Protocol):
    def emit(self, event: TelemetryEvent) -> None: ...


class OpenTelemetrySink:
    """Small adapter over an injected OpenTelemetry-compatible tracer.

    The runtime owns correlation semantics; the vendor tracer only exports spans.
    This avoids a second observability owner and keeps vendor imports outside the
    deterministic runtime contract.
    """

    def __init__(self, tracer: Any) -> None:
        start_span = getattr(tracer, "start_as_current_span", None)
        if not callable(start_span):
            raise TelemetryConfigurationError(
                "tracer must expose callable start_as_current_span"
            )
        self._tracer = tracer

    def emit(self, event: TelemetryEvent) -> None:
        with self._tracer.start_as_current_span(event.name) as span:
            setter = getattr(span, "set_attribute", None)
            if not callable(setter):
                raise TelemetryConfigurationError(
                    "span must expose callable set_attribute"
                )
            base = {
                "yaiwes.workflow_id": event.context.workflow_id,
                "yaiwes.task_id": event.context.task_id,
                "yaiwes.correlation_id": event.context.correlation_id,
            }
            for key, value in sorted({**base, **dict(event.attributes)}.items()):
                setter(key, value)


class RuntimeTelemetry:
    def __init__(self, sink: TelemetrySink) -> None:
        emit = getattr(sink, "emit", None)
        if not callable(emit):
            raise TelemetryConfigurationError("sink must expose callable emit")
        self._sink = sink

    def context(self, workflow_id: str, task_id: str) -> CorrelationContext:
        return CorrelationContext.build(workflow_id, task_id)

    def task_started(self, context: CorrelationContext) -> TelemetryEvent:
        return self._emit("yaiwes.task.started", context, {})

    def evidence_recorded(
        self, context: CorrelationContext, evidence_id: str
    ) -> TelemetryEvent:
        if not evidence_id:
            raise ValueError("evidence_id is required")
        return self._emit(
            "yaiwes.evidence.recorded",
            context,
            {"yaiwes.evidence_id": evidence_id},
        )

    def recovery_completed(
        self, context: CorrelationContext, recovery_id: str
    ) -> TelemetryEvent:
        if not recovery_id:
            raise ValueError("recovery_id is required")
        return self._emit(
            "yaiwes.recovery.completed",
            context,
            {"yaiwes.recovery_id": recovery_id},
        )

    def _emit(
        self,
        name: str,
        context: CorrelationContext,
        attributes: Mapping[str, str],
    ) -> TelemetryEvent:
        event = TelemetryEvent(name=name, context=context, attributes=dict(attributes))
        self._sink.emit(event)
        return event
