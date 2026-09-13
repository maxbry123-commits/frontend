"""Authoritative expected requirement inventory for N35 certification.

This is not a PASS declaration and contains no synthetic RequirementTrace rows.
It materializes the four-source denominator established by N34 so the existing
five-pass auditor can fail closed against one stable, deduplicated inventory.
"""
from __future__ import annotations

S1_REQUIREMENTS = tuple(f"REQ-S1-{n:03d}" for n in range(1, 21))
S2_REQUIREMENTS = tuple(
    f"REQ-S2-{n:03d}" for n in range(0, 15) if n != 11
)
S3_REQUIREMENTS = tuple(
    f"REQ-S3-{n:03d}" for n in range(1, 66) if n != 62
)

# N34 strict semantic dedup: these Command Center rows are materially covered
# by S1-S3 and remain source anchors without increasing the denominator.
S4_EXACT_EXISTING = frozenset({
    28, 35, 41, 42, 43, 47, 49, 50, 51, 54, 55, 57, 70, 82, 84,
})
# Command Center #23 duplicates #4 (copy response capability).
S4_INTERNAL_DUPLICATES = {23: 4}

# #34 is intentionally INCLUDED. Its historical private-URL/no-auth wording is
# authority-corrected by the current architecture/forensic contract to require
# real authentication/authorization; a private URL is never a security boundary.
S4_REQUIREMENTS = tuple(
    f"REQ-S4-{n:03d}"
    for n in range(1, 86)
    if n not in S4_EXACT_EXISTING and n not in S4_INTERNAL_DUPLICATES
)

EXPECTED_REQUIREMENTS = (
    S1_REQUIREMENTS + S2_REQUIREMENTS + S3_REQUIREMENTS + S4_REQUIREMENTS
)


def requirement_inventory() -> tuple[str, ...]:
    """Return the immutable 167-ID N34 denominator used by N35."""
    if len(EXPECTED_REQUIREMENTS) != 167:
        raise RuntimeError("requirement_denominator_count_mismatch")
    if len(set(EXPECTED_REQUIREMENTS)) != len(EXPECTED_REQUIREMENTS):
        raise RuntimeError("duplicate_requirement_identity")
    return EXPECTED_REQUIREMENTS
