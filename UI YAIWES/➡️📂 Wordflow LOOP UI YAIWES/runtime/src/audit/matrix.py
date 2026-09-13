"""Minimal matrix runner for deterministic requirement/evidence auditing.

This module intentionally does not implement project consolidation, governance,
or a second workflow owner. It only wires an immutable requirement matrix and
an independent CI verifier into the existing five-pass auditor.
"""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from audit.evidence import TrustedCILookup, make_ci_verifier
from audit.five_pass import AuditResult, RequirementTrace, audit_five_pass


@dataclass(frozen=True)
class RequirementMatrix:
    expected_requirements: tuple[str, ...]
    traces: tuple[RequirementTrace, ...]
    artifacts: tuple[str, ...]


def audit_matrix(
    root: str | Path,
    matrix: RequirementMatrix,
    lookup: TrustedCILookup,
) -> AuditResult:
    """Run the existing five-pass auditor over one immutable matrix."""
    if not isinstance(matrix, RequirementMatrix):
        raise TypeError("matrix_required")
    return audit_five_pass(
        root=root,
        expected_requirements=matrix.expected_requirements,
        traces=matrix.traces,
        artifacts=matrix.artifacts,
        verify_execution=make_ci_verifier(lookup),
    )
