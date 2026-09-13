"""Deterministic traceability audit, never a product or sandbox certification.

Call against an immutable checkout. The caller supplies the authoritative set of
requirements and an independent CI verifier; declarations alone cannot pass.
"""
from __future__ import annotations

import ast
from collections import Counter
from dataclasses import dataclass
from hashlib import sha256
from pathlib import Path, PurePosixPath
from typing import Callable, Iterable


@dataclass(frozen=True)
class FileRef:
    path: str
    sha256: str
    symbol: str = ""


@dataclass(frozen=True)
class RequirementTrace:
    requirement_id: str
    goal_id: str
    task_id: str
    source: FileRef
    implementation: FileRef
    test: FileRef
    evidence: FileRef
    revision: str


@dataclass(frozen=True)
class AuditResult:
    status: str
    verified_requirements: int
    total_requirements: int
    coverage_percent: float
    gaps: tuple[str, ...]
    inverse: tuple[tuple[str, str, str, str], ...]
    product_verified: bool = False


def _read(root: Path, ref: FileRef) -> bytes:
    path = PurePosixPath(ref.path)
    if (not ref.path or path.is_absolute() or ".." in path.parts
            or "\\" in ref.path or "\x00" in ref.path or ":" in ref.path):
        raise ValueError("unsafe_path")
    target = root
    for part in path.parts:
        target = target / part
        if target.is_symlink():
            raise ValueError("symlink_not_allowed")
    target.resolve(strict=True).relative_to(root)
    data = target.read_bytes()
    if sha256(data).hexdigest() != ref.sha256:
        raise ValueError("hash_mismatch")
    return data


def _symbol(data: bytes, name: str) -> bool:
    if not name:
        return False
    tree = ast.parse(data)
    nodes = tree.body
    for part in name.split("."):
        match = next((n for n in nodes if isinstance(
            n, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)
        ) and n.name == part), None)
        if match is None:
            return False
        nodes = match.body
    return True


def audit_five_pass(
    root: str | Path,
    expected_requirements: Iterable[str],
    traces: Iterable[RequirementTrace],
    artifacts: Iterable[str],
    verify_execution: Callable[[RequirementTrace, bytes], bool],
) -> AuditResult:
    """Read/hash sources, inspect symbols, verify CI, reverse-map, then count.

verify_execution must validate the evidence against trusted run/job data and
bind it to trace.revision and the exact implementation/test hashes. A callback
returning True unconditionally is not an independent verifier. This module
does not fetch URLs, execute untrusted code, or authorize canonical writes.
artifacts must list each in-scope implementation path exactly once. Both sides
of the reverse inventory are checked; multiple requirements may share a file.
"""
    root = Path(root).resolve(strict=True)
    expected_list = list(expected_requirements)
    expected = set(expected_list)
    rows = list(traces)
    gaps: list[str] = []
    if not expected or any(not x.strip() for x in expected):
        gaps.append("invalid_requirement_inventory")
    if len(expected_list) != len(expected):
        gaps.append("duplicate_expected_requirement")
    counts = Counter(r.requirement_id for r in rows)
    passed: set[str] = set()
    inverse: list[tuple[str, str, str, str]] = []
    for row in rows:
        key = row.requirement_id
        start = len(gaps)
        # 1: literal identity and source read-back.
        if (key not in expected or counts.get(key) != 1 or not row.goal_id.strip()
                or not row.task_id.strip() or not row.revision.strip()):
            gaps.append(f"{key}:identity_or_duplicate")
        data: dict[str, bytes] = {}
        for label in ("source", "implementation", "test", "evidence"):
            try:
                data[label] = _read(root, getattr(row, label))
            except (OSError, ValueError) as exc:
                gaps.append(f"{key}:{label}:{type(exc).__name__}:{exc}")
        # 2: exact Python symbols, not just nonempty directories.
        for label in ("implementation", "test"):
            try:
                if label not in data or not _symbol(data[label], getattr(row, label).symbol):
                    gaps.append(f"{key}:{label}:symbol_missing")
            except (SyntaxError, ValueError):
                gaps.append(f"{key}:{label}:invalid_python")
        # 3: independent execution attestation, fail closed on errors/non-bools.
        if len(gaps) == start:
            try:
                if verify_execution(row, data["evidence"]) is not True:
                    gaps.append(f"{key}:execution_not_verified")
            except Exception as exc:
                gaps.append(f"{key}:verifier_error:{type(exc).__name__}")
        if len(gaps) == start:
            passed.add(key)
        inverse.append((row.implementation.path, row.task_id, key, row.goal_id))
    # 4: reconcile both sides; an omitted inventory must not certify coverage.
    mapped = {entry[0] for entry in inverse}
    artifact_counts = Counter(artifacts)
    inventory = set(artifact_counts)
    for path in sorted(inventory):
        if artifact_counts[path] != 1:
            gaps.append(f"duplicate_artifact:{path}")
    for path in sorted(inventory - mapped):
        gaps.append(f"orphan_artifact:{path}")
    for path in sorted(mapped - inventory):
        gaps.append(f"unlisted_implementation:{path}")
    for key in sorted(expected):
        if counts[key] == 0:
            gaps.append(f"{key}:missing_trace")
    # 5: denominator is the full supplied requirement inventory, never rows.
    percent = round(100 * len(passed) / len(expected), 2) if expected else 0.0
    return AuditResult(
        "TRACEABILITY_PASS" if not gaps else "GAP", len(passed), len(expected),
        percent, tuple(gaps), tuple(sorted(inverse)),
    )
