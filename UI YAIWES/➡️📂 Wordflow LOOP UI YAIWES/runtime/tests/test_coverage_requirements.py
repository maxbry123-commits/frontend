from __future__ import annotations

from coverage.requirements import (
    EXPECTED_REQUIREMENTS,
    S1_REQUIREMENTS,
    S2_REQUIREMENTS,
    S3_REQUIREMENTS,
    S4_EXACT_EXISTING,
    S4_INTERNAL_DUPLICATES,
    S4_REQUIREMENTS,
    requirement_inventory,
)


def test_four_source_denominator_is_exactly_167_unique_ids():
    inventory = requirement_inventory()
    assert inventory == EXPECTED_REQUIREMENTS
    assert len(inventory) == 167
    assert len(set(inventory)) == 167
    assert len(S1_REQUIREMENTS) == 20
    assert len(S2_REQUIREMENTS) == 14
    assert len(S3_REQUIREMENTS) == 64
    assert len(S4_REQUIREMENTS) == 69


def test_source_numbering_gaps_are_not_in_implementable_inventory():
    inventory = set(requirement_inventory())
    assert "REQ-S2-011" not in inventory
    assert "REQ-S3-062" not in inventory


def test_n34_s4_dedup_and_security_override_are_preserved():
    inventory = set(requirement_inventory())
    assert S4_EXACT_EXISTING == frozenset({
        28, 35, 41, 42, 43, 47, 49, 50, 51, 54, 55, 57, 70, 82, 84,
    })
    assert S4_INTERNAL_DUPLICATES == {23: 4}
    assert "REQ-S4-023" not in inventory
    assert "REQ-S4-004" in inventory
    # Historical private-URL/no-auth wording is authority-corrected, not dropped.
    assert "REQ-S4-034" in inventory


def test_every_inventory_id_has_supported_source_namespace():
    for requirement_id in requirement_inventory():
        assert requirement_id.startswith(("REQ-S1-", "REQ-S2-", "REQ-S3-", "REQ-S4-"))
