from __future__ import annotations

import json
from hashlib import sha256

import pytest

from coverage.trace_inventory import load_trace_inventory


def _trace(requirement_id: str = "REQ-S3-057") -> dict[str, object]:
    def ref(path: str, symbol: str = "") -> dict[str, str]:
        return {"path": path, "sha256": sha256(path.encode()).hexdigest(), "symbol": symbol}

    return {
        "schema": "yaiwes.requirement-trace.v1",
        "requirement_id": requirement_id,
        "goal_id": "G12",
        "task_id": "N35",
        "source": ref("source.md"),
        "implementation": ref("src/audit/five_pass.py", "audit_five_pass"),
        "test": ref("tests/test_audit_five_pass.py", "test_five_pass"),
        "evidence": ref("evidence/ci.json"),
        "revision": "a" * 40,
    }


def test_loads_one_strict_trace_per_expected_requirement(tmp_path):
    (tmp_path / "trace.json").write_text(json.dumps(_trace()), encoding="utf-8")

    traces = load_trace_inventory(tmp_path, ("REQ-S3-057",))

    assert len(traces) == 1
    assert traces[0].requirement_id == "REQ-S3-057"
    assert traces[0].implementation.symbol == "audit_five_pass"


@pytest.mark.parametrize(
    "rows, error",
    [
        ([{"schema": "wrong"}], "invalid_trace_fields"),
        ([_trace("REQ-UNKNOWN-001")], "unexpected_requirement"),
        ([_trace(), _trace()], "duplicate_requirement_trace"),
    ],
)
def test_malformed_unknown_and_duplicate_traces_fail_closed(tmp_path, rows, error):
    for index, row in enumerate(rows):
        (tmp_path / f"{index}.json").write_text(json.dumps(row), encoding="utf-8")

    with pytest.raises(ValueError, match=error):
        load_trace_inventory(tmp_path, ("REQ-S3-057",))
