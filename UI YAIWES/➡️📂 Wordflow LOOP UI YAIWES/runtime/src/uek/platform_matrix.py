"""Fail-closed platform capability classification for N06.

This module does not start, schedule, restore, or own virtual machines.  It only
classifies an explicitly supplied capability snapshot.  N20 remains the owner
of sandbox/VM lifecycle routing.

Policy is grounded in the YAIWES platform requirement: Android prefers
AVF/crosvm with QEMU fallback; Windows prefers WHPX with QEMU fallback; Linux
prefers KVM with QEMU fallback; iOS is secondary/conditional; Web cannot host
the local native hypervisor and is therefore blocked for local VM execution.
"""
from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
from hashlib import sha256
import json
from typing import Iterable


class Platform(str, Enum):
    WEB = "web"
    WINDOWS = "windows"
    LINUX = "linux"
    ANDROID = "android"
    IOS = "ios"


class SupportState(str, Enum):
    SUPPORTED = "SUPPORTED"
    CONDITIONAL = "CONDITIONAL"
    BLOCKED = "BLOCKED"


@dataclass(frozen=True)
class PlatformPolicy:
    platform: Platform
    primary: tuple[str, ...]
    fallback: tuple[str, ...]
    source_anchor: str
    notes: str


@dataclass(frozen=True)
class CapabilitySnapshot:
    """Runtime facts supplied by a trusted platform probe.

    Merely having vendor source in the repository is intentionally not a
    capability.  A backend belongs in ``available_backends`` only after the
    caller has verified it is executable on the current host.
    """

    platform: Platform
    available_backends: frozenset[str] = frozenset()
    hardware_virtualization: bool = False
    native_permission: bool = False

    @classmethod
    def from_values(
        cls,
        platform: Platform | str,
        available_backends: Iterable[str] = (),
        *,
        hardware_virtualization: bool = False,
        native_permission: bool = False,
    ) -> "CapabilitySnapshot":
        parsed = Platform(platform)
        normalized = frozenset(str(item).strip().upper() for item in available_backends if str(item).strip())
        return cls(parsed, normalized, hardware_virtualization, native_permission)


@dataclass(frozen=True)
class PlatformAssessment:
    platform: Platform
    state: SupportState
    selected_backend: str | None
    accelerated: bool
    reason: str
    source_anchor: str


_POLICIES = (
    PlatformPolicy(
        Platform.WEB,
        (),
        (),
        "REQ-S2-platform-web",
        "Browser UI may control/mirror a machine, but Web is not a local native hypervisor host.",
    ),
    PlatformPolicy(
        Platform.WINDOWS,
        ("WHPX",),
        ("QEMU",),
        "REQ-S2-windows-whpx-qemu",
        "Prefer WHPX acceleration; QEMU software execution is fallback only.",
    ),
    PlatformPolicy(
        Platform.LINUX,
        ("KVM",),
        ("QEMU",),
        "REQ-S2-linux-kvm-qemu",
        "Prefer KVM acceleration with QEMU; software QEMU is fallback only.",
    ),
    PlatformPolicy(
        Platform.ANDROID,
        ("AVF", "CROSVM"),
        ("QEMU",),
        "REQ-S2-android-avf-crosvm-qemu",
        "AVF/crosvm is primary when hardware virtualization and permission exist; QEMU is fallback.",
    ),
    PlatformPolicy(
        Platform.IOS,
        (),
        ("QEMU",),
        "REQ-S2-ios-qemu-utm-style",
        "Secondary platform: QEMU/UTM-style execution remains conditional because iOS lacks the same hypervisor path.",
    ),
)
_POLICY_BY_PLATFORM = {row.platform: row for row in _POLICIES}


def policies() -> tuple[PlatformPolicy, ...]:
    return _POLICIES


def policy_fingerprint() -> str:
    payload = [
        {
            "platform": row.platform.value,
            "primary": row.primary,
            "fallback": row.fallback,
            "source_anchor": row.source_anchor,
            "notes": row.notes,
        }
        for row in _POLICIES
    ]
    raw = json.dumps(payload, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return sha256(raw).hexdigest()


def _contains_all(snapshot: CapabilitySnapshot, names: tuple[str, ...]) -> bool:
    return bool(names) and all(name in snapshot.available_backends for name in names)


def assess_platform(snapshot: CapabilitySnapshot) -> PlatformAssessment:
    """Classify one trusted capability snapshot without performing effects."""

    if not isinstance(snapshot, CapabilitySnapshot):
        raise TypeError("capability_snapshot_required")
    policy = _POLICY_BY_PLATFORM[snapshot.platform]

    if snapshot.platform is Platform.WEB:
        return PlatformAssessment(
            snapshot.platform,
            SupportState.BLOCKED,
            None,
            False,
            "local_native_hypervisor_unavailable_in_web_runtime",
            policy.source_anchor,
        )

    if snapshot.platform is Platform.ANDROID:
        if (
            _contains_all(snapshot, policy.primary)
            and snapshot.hardware_virtualization
            and snapshot.native_permission
        ):
            return PlatformAssessment(
                snapshot.platform,
                SupportState.SUPPORTED,
                "AVF/CROSVM",
                True,
                "primary_android_virtualization_verified",
                policy.source_anchor,
            )
        if "QEMU" in snapshot.available_backends:
            return PlatformAssessment(
                snapshot.platform,
                SupportState.CONDITIONAL,
                "QEMU",
                False,
                "android_qemu_fallback_only",
                policy.source_anchor,
            )
        return PlatformAssessment(
            snapshot.platform,
            SupportState.BLOCKED,
            None,
            False,
            "no_verified_android_backend",
            policy.source_anchor,
        )

    if snapshot.platform is Platform.IOS:
        if "QEMU" in snapshot.available_backends:
            return PlatformAssessment(
                snapshot.platform,
                SupportState.CONDITIONAL,
                "QEMU",
                False,
                "ios_secondary_qemu_path_requires_device_specific_validation",
                policy.source_anchor,
            )
        return PlatformAssessment(
            snapshot.platform,
            SupportState.BLOCKED,
            None,
            False,
            "no_verified_ios_backend",
            policy.source_anchor,
        )

    primary = next((name for name in policy.primary if name in snapshot.available_backends), None)
    has_qemu = "QEMU" in snapshot.available_backends
    if primary and has_qemu and snapshot.hardware_virtualization:
        return PlatformAssessment(
            snapshot.platform,
            SupportState.SUPPORTED,
            f"{primary}/QEMU",
            True,
            "accelerated_primary_backend_verified",
            policy.source_anchor,
        )
    if has_qemu:
        return PlatformAssessment(
            snapshot.platform,
            SupportState.CONDITIONAL,
            "QEMU",
            False,
            "software_qemu_fallback_only",
            policy.source_anchor,
        )
    return PlatformAssessment(
        snapshot.platform,
        SupportState.BLOCKED,
        None,
        False,
        "no_verified_runtime_backend",
        policy.source_anchor,
    )


def assess_all(snapshots: Iterable[CapabilitySnapshot]) -> tuple[PlatformAssessment, ...]:
    """Return one deterministic row for every platform; missing probes fail closed."""

    supplied: dict[Platform, CapabilitySnapshot] = {}
    for snapshot in snapshots:
        if not isinstance(snapshot, CapabilitySnapshot):
            raise TypeError("capability_snapshot_required")
        if snapshot.platform in supplied:
            raise ValueError(f"duplicate_platform_snapshot:{snapshot.platform.value}")
        supplied[snapshot.platform] = snapshot

    return tuple(
        assess_platform(supplied.get(platform, CapabilitySnapshot(platform)))
        for platform in Platform
    )


def baseline_linear_policy_lookup(platform: Platform) -> PlatformPolicy:
    """Reference baseline used only for the reproducible N06 lookup benchmark."""

    for row in _POLICIES:
        if row.platform is platform:
            return row
    raise KeyError(platform)


def indexed_policy_lookup(platform: Platform) -> PlatformPolicy:
    """Candidate constant-time lookup used by the runtime classifier."""

    return _POLICY_BY_PLATFORM[platform]
