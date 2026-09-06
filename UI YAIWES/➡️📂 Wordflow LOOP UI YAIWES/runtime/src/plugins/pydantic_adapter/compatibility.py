from __future__ import annotations

from dataclasses import dataclass

EXPECTED_PYDANTIC_VERSION = "2.14.0b1"
EXPECTED_PYDANTIC_CORE_VERSION = "2.48.0"


class PydanticVersionMismatchError(RuntimeError):
    pass


@dataclass(frozen=True, slots=True)
class CompatibilityReport:
    pydantic_version: str
    core_version: str

    @property
    def compatible(self) -> bool:
        return (
            self.pydantic_version == EXPECTED_PYDANTIC_VERSION
            and self.core_version == EXPECTED_PYDANTIC_CORE_VERSION
        )


def ensure_compatible(pydantic_version: str, core_version: str) -> CompatibilityReport:
    report = CompatibilityReport(pydantic_version, core_version)
    if not report.compatible:
        raise PydanticVersionMismatchError(
            "Pydantic runtime mismatch: "
            f"expected {EXPECTED_PYDANTIC_VERSION}/{EXPECTED_PYDANTIC_CORE_VERSION}, "
            f"got {pydantic_version}/{core_version}"
        )
    return report
