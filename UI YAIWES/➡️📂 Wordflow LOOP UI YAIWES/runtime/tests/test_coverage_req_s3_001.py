from __future__ import annotations

from pathlib import Path

from audit.evidence import TrustedCIExecution, make_ci_verifier
from audit.five_pass import audit_five_pass
from coverage.trace_inventory import load_trace_inventory


PROJECT_ROOT = Path(__file__).resolve().parents[2]
TRACE_ROOT = PROJECT_ROOT / "runtime" / "requirement_traces"
TRACE_ID = "REQ-S3-001"


def test_req_s3_001_workflow_responsibility_trace_passes_five_pass(tmp_path):
    target = tmp_path / f"{TRACE_ID}.json"
    target.write_bytes((TRACE_ROOT / f"{TRACE_ID}.json").read_bytes())
    traces = load_trace_inventory(tmp_path, (TRACE_ID,))
    trace = traces[0]

    def trusted_lookup(run_id: int, job_id: int) -> TrustedCIExecution:
        assert (run_id, job_id) == (34911857849, 104200883482)
        return TrustedCIExecution(
            run_id=run_id,
            job_id=job_id,
            revision="58eb999314e13bd1622e921379feb008817fb614",
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
