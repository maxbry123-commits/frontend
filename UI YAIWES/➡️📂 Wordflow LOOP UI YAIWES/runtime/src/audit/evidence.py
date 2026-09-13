"""Deterministic CI evidence verification for the YAIWES five-pass auditor.

The evidence file is untrusted input. A caller-supplied lookup must independently
resolve run/job identifiers against a trusted CI source and return the exact
revision and file hashes observed there. No declaration in the evidence file can
promote itself to PASS.
"""
from __future__ import annotations

import json
from dataclasses import dataclass
from typing import Callable

from audit.five_pass import RequirementTrace


EVIDENCE_SCHEMA = "yaiwes.ci-evidence.v1"


@dataclass(frozen=True)
class TrustedCIExecution:
    run_id: int
    job_id: int
    revision: str
    status: str
    conclusion: str
    implementation_sha256: str
    test_sha256: str


TrustedCILookup = Callable[[int, int], TrustedCIExecution]


def _positive_int(value: object) -> bool:
    return type(value) is int and value > 0


def verify_ci_evidence(
    trace: RequirementTrace,
    evidence: bytes,
    lookup: TrustedCILookup,
) -> bool:
    """Verify untrusted evidence against an independent CI lookup, fail closed."""
    if type(evidence) is not bytes:
        return False
    try:
        payload = json.loads(evidence.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError):
        return False
    if not isinstance(payload, dict):
        return False

    required = {
        "schema",
        "run_id",
        "job_id",
        "revision",
        "implementation_sha256",
        "test_sha256",
    }
    if set(payload) != required or payload.get("schema") != EVIDENCE_SCHEMA:
        return False
    if not _positive_int(payload.get("run_id")) or not _positive_int(payload.get("job_id")):
        return False
    if payload.get("revision") != trace.revision:
        return False
    if payload.get("implementation_sha256") != trace.implementation.sha256:
        return False
    if payload.get("test_sha256") != trace.test.sha256:
        return False

    try:
        trusted = lookup(payload["run_id"], payload["job_id"])
    except Exception:
        return False
    if not isinstance(trusted, TrustedCIExecution):
        return False

    return (
        trusted.run_id == payload["run_id"]
        and trusted.job_id == payload["job_id"]
        and trusted.revision == trace.revision
        and trusted.status == "completed"
        and trusted.conclusion == "success"
        and trusted.implementation_sha256 == trace.implementation.sha256
        and trusted.test_sha256 == trace.test.sha256
    )


def make_ci_verifier(lookup: TrustedCILookup):
    """Bind a trusted CI lookup to the callback shape required by audit_five_pass."""
    def verifier(trace: RequirementTrace, evidence: bytes) -> bool:
        return verify_ci_evidence(trace, evidence, lookup)

    return verifier
