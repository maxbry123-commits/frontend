from __future__ import annotations

from pathlib import Path

from audit.evidence import TrustedCIExecution, make_ci_verifier
from audit.five_pass import audit_five_pass
from coverage.trace_inventory import load_trace_inventory


PROJECT_ROOT = Path(__file__).resolve().parents[2]
RUNTIME_ROOT = PROJECT_ROOT / "runtime"
TRACE_ROOT = RUNTIME_ROOT / "requirement_traces"
TRACE_ID = "REQ-S2-009"


def test_req_s2_009_platform_control_traceability_pass(tmp_path):
    target = tmp_path / f"{TRACE_ID}.json"
    target.write_bytes((TRACE_ROOT / f"{TRACE_ID}.json").read_bytes())
    traces = load_trace_inventory(tmp_path, (TRACE_ID,))
    trace = traces[0]

    def trusted_lookup(run_id: int, job_id: int) -> TrustedCIExecution:
        assert (run_id, job_id) == (34904843397, 104178992615)
        return TrustedCIExecution(
            run_id=run_id,
            job_id=job_id,
            revision="1a799861d71a1a5154614289a89b2ef44b9d205b",
            status="completed",
            conclusion="success",
            implementation_sha256=trace.implementation.sha256,
            test_sha256=trace.test.sha256,
        )

    result = audit_five_pass(
        PROJECT_ROOT,
        (TRACE_ID,),
        traces,
        (trace.implementation.path,),
        make_ci_verifier(trusted_lookup),
    )

    assert result.status == "TRACEABILITY_PASS"
    assert result.verified_requirements == 1
    assert result.total_requirements == 1
    assert result.product_verified is False
