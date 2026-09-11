from __future__ import annotations

import time
from pathlib import Path
from typing import Any, Callable, Mapping

from .contracts import LayerResult, NodeContract, Status
from .governance import guardian, judge, sentinel, sheriff, supervisor, validator, verifier
from .ledger import append_event, load_ledger, save_ledger

LayerHandler = Callable[[NodeContract, dict[str, Any]], LayerResult]


class LayerRunner:
    """Fail-closed runner for one literal node at a time."""

    def __init__(
        self,
        handlers: Mapping[str, LayerHandler],
        *,
        ledger_path: str | Path | None = None,
    ) -> None:
        self.handlers = dict(handlers)
        self.ledger_path = Path(ledger_path) if ledger_path else None
        self.ledger = load_ledger(self.ledger_path) if self.ledger_path else []
        self.completed_nodes: set[str] = set()
        for row in self.ledger:
            event = row.get("event", {})
            if event.get("node_id"):
                self._update_completion(event["node_id"], event.get("status"))

    def _update_completion(self, node_id: str, status: str) -> None:
        # Replay the latest outcome, not any historical PASS.
        if status == Status.PASS.value:
            self.completed_nodes.add(node_id)
        else:
            self.completed_nodes.discard(node_id)

    def _record(self, node: NodeContract, result: LayerResult) -> None:
        append_event(
            self.ledger,
            {
                "node_id": node.node_id,
                "layer": node.layer,
                "status": result.status.value,
                "gaps": list(result.gaps),
                "evidence": [
                    {
                        "kind": evidence.kind,
                        "ref": evidence.ref,
                        "sha256": evidence.sha256,
                        "detail": evidence.detail,
                    }
                    for evidence in result.evidence
                ],
                "actions": list(result.actions),
                "touched_paths": list(result.touched_paths),
            },
        )
        if self.ledger_path:
            save_ledger(self.ledger_path, self.ledger)
        self._update_completion(node.node_id, result.status.value)

    def run(
        self,
        node: NodeContract,
        payload: dict[str, Any] | None = None,
    ) -> LayerResult:
        payload = payload or {}
        pre_errors = sheriff.check(node) + validator.check(node, self.completed_nodes)
        if pre_errors:
            result = LayerResult(
                node_id=node.node_id,
                layer=node.layer,
                status=Status.BLOCKED,
                gaps=pre_errors,
            )
            self._record(node, result)
            return result

        handler = self.handlers.get(node.layer)
        if handler is None:
            result = LayerResult(
                node_id=node.node_id,
                layer=node.layer,
                status=Status.BLOCKED,
                gaps=["missing_layer_handler"],
            )
            self._record(node, result)
            return result

        started_at = time.monotonic()
        try:
            result = handler(node, payload)
        except Exception as exc:  # fail closed; layer exception is evidence of failure
            result = LayerResult(
                node_id=node.node_id,
                layer=node.layer,
                status=Status.FAIL,
                gaps=[f"layer_exception:{type(exc).__name__}"],
            )

        post_errors = (
            sentinel.check_runtime(node, result, started_at)
            + verifier.check(result)
            + supervisor.check(node, result)
            + judge.check(result)
            + guardian.check(node, result, self.ledger)
        )
        if post_errors:
            result.status = Status.FAIL
            for gap in post_errors:
                if gap not in result.gaps:
                    result.gaps.append(gap)

        self._record(node, result)
        return result
