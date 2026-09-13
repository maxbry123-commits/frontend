"""Fail-closed LAN-first mirror transport/control boundary for CAN-010.

This module owns no disk/RAM replication. It validates pairing/auth/session state and
forwards only explicitly allowed display/audio/input/clipboard/control frames to an
injected transport port.
"""
from __future__ import annotations

from dataclasses import dataclass
from hashlib import sha256
from hmac import compare_digest
from ipaddress import ip_address
from typing import Mapping, Protocol


ALLOWED_CHANNELS = frozenset({"display", "audio", "input", "clipboard", "control"})
FORBIDDEN_CHANNELS = frozenset({"disk", "ram", "memory", "filesystem"})


class MirrorTransportPort(Protocol):
    def send(self, *, session_id: str, channel: str, payload: bytes) -> str: ...


@dataclass(frozen=True)
class Pairing:
    peer_id: str
    pairing_secret_sha256: str
    auth_token_sha256: str
    lan_only: bool = True
    peer_host: str = "127.0.0.1"


@dataclass(frozen=True)
class MirrorSession:
    session_id: str
    peer_id: str
    auth_token_sha256: str
    lan_only: bool = True
    peer_host: str = "127.0.0.1"


@dataclass(frozen=True)
class MirrorReceipt:
    session_id: str
    channel: str
    payload_sha256: str
    transport_ref: str


def _digest_text(value: str) -> str:
    return sha256(value.encode("utf-8")).hexdigest()


def _require_lan_host(value: str) -> str:
    try:
        host = ip_address(value)
    except ValueError as exc:
        raise PermissionError("mirror peer_host must be a literal LAN IP") from exc
    if not (host.is_private or host.is_loopback or host.is_link_local):
        raise PermissionError("mirror peer_host is outside the LAN boundary")
    return str(host)


def pair(*, peer_id: str, pairing_secret: str, auth_token: str, expected: Pairing) -> MirrorSession:
    """Authenticate pairing before creating a mirror session."""
    if not peer_id.strip() or not pairing_secret or not auth_token:
        raise ValueError("peer_id, pairing_secret and auth_token are required")
    if peer_id != expected.peer_id:
        raise PermissionError("peer mismatch")
    if not expected.lan_only:
        raise PermissionError("mirror must be LAN-first")
    peer_host = _require_lan_host(expected.peer_host)
    if not compare_digest(_digest_text(pairing_secret), expected.pairing_secret_sha256.lower()):
        raise PermissionError("pairing rejected")
    if not compare_digest(_digest_text(auth_token), expected.auth_token_sha256.lower()):
        raise PermissionError("authentication rejected")
    session_id = sha256((peer_id + ":" + expected.auth_token_sha256).encode("utf-8")).hexdigest()[:24]
    return MirrorSession(session_id, peer_id, expected.auth_token_sha256.lower(), True, peer_host)


def send_frame(
    *,
    session: MirrorSession,
    auth_token: str,
    channel: str,
    payload: bytes,
    transport: MirrorTransportPort,
    metadata: Mapping[str, str] | None = None,
) -> MirrorReceipt:
    """Authorize and forward one bounded mirror/control frame.

    Disk/RAM/filesystem channels are rejected before the injected transport sees an
    effect. Metadata is validation-only and cannot widen the channel allowlist.
    """
    if not session.lan_only:
        raise PermissionError("non-LAN mirror session rejected")
    _require_lan_host(session.peer_host)
    normalized = channel.strip().lower()
    if normalized in FORBIDDEN_CHANNELS or normalized not in ALLOWED_CHANNELS:
        raise PermissionError("mirror channel forbidden")
    if not payload:
        raise ValueError("payload is required")
    if not compare_digest(_digest_text(auth_token), session.auth_token_sha256):
        raise PermissionError("authentication rejected")
    if metadata:
        requested = {str(k).lower(): str(v).lower() for k, v in metadata.items()}
        if any(key in FORBIDDEN_CHANNELS or value in FORBIDDEN_CHANNELS for key, value in requested.items()):
            raise PermissionError("disk/RAM mirroring metadata forbidden")
    transport_ref = transport.send(session_id=session.session_id, channel=normalized, payload=payload)
    if not isinstance(transport_ref, str) or not transport_ref.strip():
        raise RuntimeError("transport produced no evidence reference")
    return MirrorReceipt(session.session_id, normalized, sha256(payload).hexdigest(), transport_ref)
