from __future__ import annotations

from pathlib import Path

import pytest

from audit.evidence import TrustedCIExecution, make_ci_verifier
from audit.five_pass import audit_five_pass
from coverage.requirements import requirement_inventory
from coverage.trace_inventory import load_trace_inventory


PROJECT_ROOT = Path(__file__).resolve().parents[2]
RUNTIME_ROOT = PROJECT_ROOT / "runtime"
TRACE_ROOT = RUNTIME_ROOT / "requirement_traces"
TRACE_ID = "REQ-S3-057"
SECOND_TRACE_ID = "REQ-S3-055"
THIRD_TRACE_ID = "REQ-S3-054"
FOURTH_TRACE_ID = "REQ-S3-053"


def _copy_certified_trace(tmp_path: Path) -> Path:
    target = tmp_path / f"{TRACE_ID}.json"
    target.write_bytes((TRACE_ROOT / f"{TRACE_ID}.json").read_bytes())
    return tmp_path


def test_first_production_trace_binds_source_code_test_and_real_ci(tmp_path):
    traces = load_trace_inventory(_copy_certified_trace(tmp_path), (TRACE_ID,))
    trace = traces[0]

    def trusted_lookup(run_id: int, job_id: int) -> TrustedCIExecution:
        assert (run_id, job_id) == (34736273179, 103668162691)
        return TrustedCIExecution(
            run_id=run_id,
            job_id=job_id,
            revision="6223ed833be0fddf5023646f269089a7a3705e88",
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


def test_cross_check_trace_binds_reverse_inventory_and_real_ci(tmp_path):
    target = tmp_path / f"{SECOND_TRACE_ID}.json"
    target.write_bytes((TRACE_ROOT / f"{SECOND_TRACE_ID}.json").read_bytes())
    traces = load_trace_inventory(tmp_path, (SECOND_TRACE_ID,))
    trace = traces[0]

    def trusted_lookup(run_id: int, job_id: int) -> TrustedCIExecution:
        assert (run_id, job_id) == (34770663786, 103759541073)
        return TrustedCIExecution(
            run_id=run_id,
            job_id=job_id,
            revision="84c16b33bd092a0005a076a34cd921f90263277f",
            status="completed",
            conclusion="success",
            implementation_sha256=trace.implementation.sha256,
            test_sha256=trace.test.sha256,
        )

    result = audit_five_pass(
        PROJECT_ROOT,
        (SECOND_TRACE_ID,),
        traces,
        (trace.implementation.path,),
        make_ci_verifier(trusted_lookup),
    )

    assert result.status == "TRACEABILITY_PASS"
    assert result.verified_requirements == 1
    assert result.total_requirements == 1
    assert result.product_verified is False


def test_integration_check_trace_binds_artifact_validation_and_real_ci(tmp_path):
    target = tmp_path / f"{THIRD_TRACE_ID}.json"
    target.write_bytes((TRACE_ROOT / f"{THIRD_TRACE_ID}.json").read_bytes())
    traces = load_trace_inventory(tmp_path, (THIRD_TRACE_ID,))
    trace = traces[0]

    def trusted_lookup(run_id: int, job_id: int) -> TrustedCIExecution:
        assert (run_id, job_id) == (34775560166, 103772919055)
        return TrustedCIExecution(
            run_id=run_id,
            job_id=job_id,
            revision="c480fcd8445d2d00501b01de4b0b45c37b6a6029",
            status="completed",
            conclusion="success",
            implementation_sha256=trace.implementation.sha256,
            test_sha256=trace.test.sha256,
        )

    result = audit_five_pass(
        PROJECT_ROOT,
        (THIRD_TRACE_ID,),
        traces,
        (trace.implementation.path,),
        make_ci_verifier(trusted_lookup),
    )

    assert result.status == "TRACEABILITY_PASS"
    assert result.verified_requirements == 1
    assert result.total_requirements == 1
    assert result.product_verified is False


def test_funnel_consolidation_trace_preserves_provenance_and_real_ci(tmp_path):
    target = tmp_path / f"{FOURTH_TRACE_ID}.json"
    target.write_bytes((TRACE_ROOT / f"{FOURTH_TRACE_ID}.json").read_bytes())
    traces = load_trace_inventory(tmp_path, (FOURTH_TRACE_ID,))
    trace = traces[0]

    def trusted_lookup(run_id: int, job_id: int) -> TrustedCIExecution:
        assert (run_id, job_id) == (34739510224, 103678337638)
        return TrustedCIExecution(
            run_id=run_id,
            job_id=job_id,
            revision="cf40e9cbde77fb663aa58c06701b9dedab46d43e",
            status="completed",
            conclusion="success",
            implementation_sha256=trace.implementation.sha256,
            test_sha256=trace.test.sha256,
        )

    result = audit_five_pass(
        PROJECT_ROOT,
        (FOURTH_TRACE_ID,),
        traces,
        (trace.implementation.path,),
        make_ci_verifier(trusted_lookup),
    )

    assert result.status == "TRACEABILITY_PASS"
    assert result.verified_requirements == 1
    assert result.total_requirements == 1
    assert result.product_verified is False


def test_product_inventory_stays_fail_closed_until_all_167_traces_exist():
    with pytest.raises(ValueError) as exc:
        load_trace_inventory(TRACE_ROOT, requirement_inventory())

    message = str(exc.value)
    assert message.startswith("missing_requirement_traces:")
    missing = set(message.split(":", 1)[1].split(","))
    assert TRACE_ID not in missing
    assert SECOND_TRACE_ID not in missing
    assert THIRD_TRACE_ID not in missing
    assert FOURTH_TRACE_ID not in missing
    assert len(missing) == 163
