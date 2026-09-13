"""Fail-closed guest-only artifact installer.

Host mutation is intentionally impossible through this boundary: all effects are
performed by an injected GuestPort after verification and a guest snapshot.
"""
from __future__ import annotations

from dataclasses import dataclass
from hashlib import sha256
from typing import Callable, Protocol, Sequence


class GuestPort(Protocol):
    def snapshot(self) -> str: ...
    def install(self, *, name: str, payload: bytes, artifact_format: str) -> None: ...
    def rollback(self, snapshot_id: str) -> None: ...


@dataclass(frozen=True)
class Artifact:
    name: str
    payload: bytes
    sha256_hex: str
    signature: str
    artifact_format: str
    arch: str
    dependencies: tuple[str, ...] = ()


@dataclass(frozen=True)
class GuestCapabilities:
    arch: str
    formats: tuple[str, ...]
    dependencies: tuple[str, ...]


@dataclass(frozen=True)
class InstallReceipt:
    name: str
    snapshot_id: str
    artifact_sha256: str
    effect_scope: str = "guest"


SignatureVerifier = Callable[[Artifact], bool]


def install_verified(
    artifact: Artifact,
    capabilities: GuestCapabilities,
    guest: GuestPort,
    verify_signature: SignatureVerifier,
) -> InstallReceipt:
    """Verify fully, snapshot guest, install, and rollback on install failure."""
    if not artifact.name.strip() or not artifact.payload:
        raise ValueError("artifact name and payload are required")
    digest = sha256(artifact.payload).hexdigest()
    if digest != artifact.sha256_hex.lower():
        raise ValueError("artifact hash mismatch")
    if not artifact.signature.strip() or not verify_signature(artifact):
        raise ValueError("artifact signature rejected")
    if artifact.artifact_format not in capabilities.formats:
        raise ValueError("artifact format unsupported")
    if artifact.arch != capabilities.arch:
        raise ValueError("artifact architecture mismatch")
    missing = tuple(dep for dep in artifact.dependencies if dep not in capabilities.dependencies)
    if missing:
        raise ValueError("missing guest dependencies: " + ",".join(missing))

    snapshot_id = guest.snapshot()
    if not isinstance(snapshot_id, str) or not snapshot_id.strip():
        raise RuntimeError("guest snapshot failed")
    try:
        guest.install(name=artifact.name, payload=artifact.payload, artifact_format=artifact.artifact_format)
    except Exception:
        guest.rollback(snapshot_id)
        raise
    return InstallReceipt(artifact.name, snapshot_id, digest)
