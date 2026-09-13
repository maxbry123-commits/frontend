from __future__ import annotations

from hashlib import sha256

import pytest

from mirror.transport import Pairing, pair, send_frame


def digest(value: str) -> str:
    return sha256(value.encode()).hexdigest()


class FakeTransport:
    def __init__(self, ref="mirror:run-1"):
        self.ref = ref
        self.calls = []

    def send(self, *, session_id, channel, payload):
        self.calls.append((session_id, channel, payload))
        return self.ref


def paired():
    expected = Pairing("peer-1", digest("pair-secret"), digest("auth-secret"), peer_host="192.168.10.8")
    return pair(peer_id="peer-1", pairing_secret="pair-secret", auth_token="auth-secret", expected=expected)


def test_pairing_auth_and_lan_first_session():
    session = paired()
    assert session.peer_id == "peer-1"
    assert session.peer_host == "192.168.10.8"
    assert session.lan_only is True
    assert len(session.session_id) == 24


@pytest.mark.parametrize("secret,token", [("bad", "auth-secret"), ("pair-secret", "bad")])
def test_pairing_fails_closed_before_session(secret, token):
    expected = Pairing("peer-1", digest("pair-secret"), digest("auth-secret"))
    with pytest.raises(PermissionError):
        pair(peer_id="peer-1", pairing_secret=secret, auth_token=token, expected=expected)


def test_public_peer_is_rejected_before_session():
    expected = Pairing(
        "peer-1", digest("pair-secret"), digest("auth-secret"), peer_host="8.8.8.8"
    )
    with pytest.raises(PermissionError, match="outside the LAN"):
        pair(
            peer_id="peer-1",
            pairing_secret="pair-secret",
            auth_token="auth-secret",
            expected=expected,
        )


@pytest.mark.parametrize("channel", ["display", "audio", "input", "clipboard", "control"])
def test_allowed_runtime_channels_emit_evidence(channel):
    transport = FakeTransport()
    result = send_frame(
        session=paired(), auth_token="auth-secret", channel=channel,
        payload=b"frame", transport=transport,
    )
    assert result.channel == channel
    assert result.transport_ref == "mirror:run-1"
    assert transport.calls == [(result.session_id, channel, b"frame")]


@pytest.mark.parametrize("channel", ["disk", "ram", "memory", "filesystem", "unknown"])
def test_disk_ram_and_unknown_mirroring_are_rejected_pre_effect(channel):
    transport = FakeTransport()
    with pytest.raises(PermissionError):
        send_frame(session=paired(), auth_token="auth-secret", channel=channel, payload=b"x", transport=transport)
    assert transport.calls == []


def test_bad_session_auth_rejected_pre_effect():
    transport = FakeTransport()
    with pytest.raises(PermissionError):
        send_frame(session=paired(), auth_token="wrong", channel="input", payload=b"tap", transport=transport)
    assert transport.calls == []


def test_metadata_cannot_smuggle_disk_or_ram_sync():
    transport = FakeTransport()
    with pytest.raises(PermissionError):
        send_frame(
            session=paired(), auth_token="auth-secret", channel="control", payload=b"sync",
            transport=transport, metadata={"sync": "disk"},
        )
    assert transport.calls == []


def test_transport_must_return_evidence_reference():
    with pytest.raises(RuntimeError):
        send_frame(
            session=paired(), auth_token="auth-secret", channel="clipboard", payload=b"text",
            transport=FakeTransport(""),
        )
