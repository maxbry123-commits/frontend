from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
import re
from typing import Iterable

from .platform_matrix import Platform


COMMON_PLATFORM_PROTOCOL = "yaiwes.platform/v1"
MANDATORY_LOCAL_VM_PLATFORMS = frozenset(
    {Platform.ANDROID, Platform.WINDOWS, Platform.LINUX}
)


class PlatformControlError(ValueError):
    """Invalid or unverified platform-control input."""


@dataclass(frozen=True)
class BackendDescriptor:
    """Verified backend metadata; this registry does not own VM lifecycle."""

    name: str
    platforms: frozenset[Platform]
    architectures: frozenset[str]
    current_version: str
    protocol: str = COMMON_PLATFORM_PROTOCOL
    verified_runtime: bool = False

    def validate(self) -> None:
        if not self.name or not self.name.strip():
            raise PlatformControlError("backend_name_required")
        if not self.platforms:
            raise PlatformControlError("backend_platform_required")
        if not self.architectures or any(not item.strip() for item in self.architectures):
            raise PlatformControlError("backend_architecture_required")
        if not _version_tuple(self.current_version):
            raise PlatformControlError("backend_version_invalid")
        if self.protocol != COMMON_PLATFORM_PROTOCOL:
            raise PlatformControlError("backend_protocol_mismatch")


class BackendRegistry:
    """Read-only capability registry over runtime-verified backend descriptors."""

    def __init__(self, backends: Iterable[BackendDescriptor]) -> None:
        rows = tuple(backends)
        by_name: dict[str, BackendDescriptor] = {}
        for row in rows:
            if not isinstance(row, BackendDescriptor):
                raise PlatformControlError("backend_descriptor_required")
            row.validate()
            key = row.name.strip().upper()
            if key in by_name:
                raise PlatformControlError(f"duplicate_backend:{key}")
            by_name[key] = row
        self._by_name = by_name

    @property
    def verified_names(self) -> frozenset[str]:
        return frozenset(
            name for name, row in self._by_name.items() if row.verified_runtime
        )

    def eligible(
        self, platform: Platform | str, architecture: str
    ) -> tuple[BackendDescriptor, ...]:
        target = Platform(platform)
        arch = _normalize_architecture(architecture)
        return tuple(
            row
            for _, row in sorted(self._by_name.items())
            if row.verified_runtime
            and target in row.platforms
            and arch in {_normalize_architecture(item) for item in row.architectures}
        )

    def require_verified(
        self, name: str, platform: Platform | str, architecture: str
    ) -> BackendDescriptor:
        key = str(name).strip().upper()
        row = self._by_name.get(key)
        if row is None:
            raise PlatformControlError(f"backend_unknown:{key}")
        if not row.verified_runtime:
            raise PlatformControlError(f"backend_not_runtime_verified:{key}")
        if Platform(platform) not in row.platforms:
            raise PlatformControlError(f"backend_platform_mismatch:{key}")
        if _normalize_architecture(architecture) not in {
            _normalize_architecture(item) for item in row.architectures
        }:
            raise PlatformControlError(f"backend_architecture_mismatch:{key}")
        return row

    def missing_mandatory_platforms(self, architecture: str) -> frozenset[Platform]:
        arch = _normalize_architecture(architecture)
        covered = {
            platform
            for platform in MANDATORY_LOCAL_VM_PLATFORMS
            if self.eligible(platform, arch)
        }
        return MANDATORY_LOCAL_VM_PLATFORMS - covered


class UpdateState(str, Enum):
    APPROVED = "APPROVED"
    BLOCKED = "BLOCKED"
    CURRENT = "CURRENT"


@dataclass(frozen=True)
class UpdateCandidate:
    backend: str
    platform: Platform
    architecture: str
    version: str
    sha256: str
    protocol: str = COMMON_PLATFORM_PROTOCOL


@dataclass(frozen=True)
class UpdateDecision:
    state: UpdateState
    reason: str
    backend: str
    current_version: str
    candidate_version: str
    sha256: str

    @property
    def executable(self) -> bool:
        return self.state is UpdateState.APPROVED


class PlatformUpdateManager:
    """Pure update gate; download/install effects stay outside this class.

    The manager only approves a candidate when the backend is runtime-verified,
    platform/architecture/protocol match, the digest is a real SHA-256 value,
    and the candidate version is newer than the registered version.
    """

    def __init__(self, registry: BackendRegistry) -> None:
        if not isinstance(registry, BackendRegistry):
            raise PlatformControlError("backend_registry_required")
        self._registry = registry

    def assess(self, candidate: UpdateCandidate) -> UpdateDecision:
        if not isinstance(candidate, UpdateCandidate):
            raise PlatformControlError("update_candidate_required")
        if candidate.protocol != COMMON_PLATFORM_PROTOCOL:
            raise PlatformControlError("update_protocol_mismatch")
        digest = candidate.sha256.strip().lower()
        if not re.fullmatch(r"[0-9a-f]{64}", digest):
            raise PlatformControlError("update_sha256_invalid")

        row = self._registry.require_verified(
            candidate.backend, candidate.platform, candidate.architecture
        )
        current = _version_tuple(row.current_version)
        proposed = _version_tuple(candidate.version)
        if not proposed:
            raise PlatformControlError("update_version_invalid")
        if proposed == current:
            return UpdateDecision(
                UpdateState.CURRENT,
                "candidate_matches_current_version",
                row.name,
                row.current_version,
                candidate.version,
                digest,
            )
        if proposed < current:
            return UpdateDecision(
                UpdateState.BLOCKED,
                "downgrade_not_allowed",
                row.name,
                row.current_version,
                candidate.version,
                digest,
            )
        return UpdateDecision(
            UpdateState.APPROVED,
            "verified_update_candidate",
            row.name,
            row.current_version,
            candidate.version,
            digest,
        )


def _normalize_architecture(value: str) -> str:
    arch = str(value).strip().lower().replace("amd64", "x86_64").replace("aarch64", "arm64")
    if not arch:
        raise PlatformControlError("architecture_required")
    return arch


def _version_tuple(value: str) -> tuple[int, ...]:
    text = str(value).strip()
    if not re.fullmatch(r"\d+(?:\.\d+)*", text):
        return ()
    return tuple(int(part) for part in text.split("."))
