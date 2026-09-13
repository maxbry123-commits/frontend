"""Fail-closed guest-only artifact installer.

Host mutation is intentionally impossible through this boundary: all effects are
performed by an injected GuestPort after verification and a guest snapshot.
"""
from __future__ import annotations

from dataclasses import dataclass
from hashlib import sha256
import re
from typing import Callable, Protocol


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

_SHA256 = re.compile(r"[0-9a-f]{64}")
_SAFE_NAME = re.compile(r"[A-Za-z0-9][A-Za-z0-9._+-]*")
_ARCH_ALIASES = {
    "amd64": "x86_64",
    "x64": "x86_64",
    "x86_64": "x86_64",
    "arm64": "aarch64",
    "aarch64": "aarch64",
}


def _architecture(value: str) -> str:
    normalized = str(value).strip().lower()
    try:
        return _ARCH_ALIASES[normalized]
    except KeyError as exc:
        raise ValueError(f"unsupported architecture: {normalized}") from exc


def install_verified(
    artifact: Artifact,
    capabilities: GuestCapabilities,
    guest: GuestPort,
    verify_signature: SignatureVerifier,
) -> InstallReceipt:
    """Verify fully, snapshot guest, install, and rollback on install failure."""
    if not isinstance(artifact, Artifact) or not isinstance(
        capabilities, GuestCapabilities
    ):
        raise TypeError("artifact and guest capabilities are required")
    if (
        not isinstance(artifact.name, str)
        or not _SAFE_NAME.fullmatch(artifact.name)
        or not isinstance(artifact.payload, bytes)
        or not artifact.payload
    ):
        raise ValueError("artifact name and payload are required")
    digest = sha256(artifact.payload).hexdigest()
    declared_hash = str(artifact.sha256_hex).strip().lower()
    if not _SHA256.fullmatch(declared_hash) or digest != declared_hash:
        raise ValueError("artifact hash mismatch")
    if not isinstance(artifact.signature, str) or not artifact.signature.strip():
        raise ValueError("artifact signature rejected")
    try:
        signature_valid = verify_signature(artifact)
    except Exception as exc:
        raise ValueError("artifact signature verification failed") from exc
    if signature_valid is not True:
        raise ValueError("artifact signature rejected")
    artifact_format = str(artifact.artifact_format).strip().lower()
    supported_formats = {
        str(item).strip().lower() for item in capabilities.formats
    }
    if not artifact_format or artifact_format not in supported_formats:
        raise ValueError("artifact format unsupported")
    if _architecture(artifact.arch) != _architecture(capabilities.arch):
        raise ValueError("artifact architecture mismatch")
    if len(artifact.dependencies) != len(set(artifact.dependencies)):
        raise ValueError("duplicate artifact dependency")
    missing = tuple(dep for dep in artifact.dependencies if dep not in capabilities.dependencies)
    if missing:
        raise ValueError("missing guest dependencies: " + ",".join(missing))

    snapshot_id = guest.snapshot()
    if not isinstance(snapshot_id, str) or not snapshot_id.strip():
        raise RuntimeError("guest snapshot failed")
    try:
        guest.install(
            name=artifact.name,
            payload=artifact.payload,
            artifact_format=artifact_format,
        )
    except Exception as install_error:
        try:
            guest.rollback(snapshot_id)
        except Exception as rollback_error:
            raise RuntimeError("guest install and rollback failed") from rollback_error
        raise RuntimeError("guest install failed; rollback complete") from install_error
    return InstallReceipt(artifact.name, snapshot_id, digest)
