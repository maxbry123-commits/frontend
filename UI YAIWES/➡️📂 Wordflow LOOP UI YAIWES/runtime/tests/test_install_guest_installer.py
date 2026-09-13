from hashlib import sha256

import pytest

from install.guest_installer import Artifact, GuestCapabilities, install_verified


class Guest:
    def __init__(self, fail=False):
        self.effects = []
        self.fail = fail
    def snapshot(self):
        self.effects.append(("snapshot", "s1")); return "s1"
    def install(self, **kwargs):
        self.effects.append(("install", kwargs["name"]))
        if self.fail: raise RuntimeError("boom")
    def rollback(self, snapshot_id):
        self.effects.append(("rollback", snapshot_id))


def artifact(**changes):
    payload = changes.pop("payload", b"verified-package")
    values = dict(name="pkg", payload=payload, sha256_hex=sha256(payload).hexdigest(), signature="sig", artifact_format="zip", arch="arm64", dependencies=("python",))
    values.update(changes)
    return Artifact(**values)


def caps():
    return GuestCapabilities(arch="arm64", formats=("zip",), dependencies=("python",))


def signed(_): return True

def rejected(_): return False


def test_verified_install_is_guest_scoped_and_snapshot_first():
    guest = Guest()
    receipt = install_verified(artifact(), caps(), guest, signed)
    assert receipt.effect_scope == "guest"
    assert guest.effects == [("snapshot", "s1"), ("install", "pkg")]


@pytest.mark.parametrize("bad", [
    {"sha256_hex": "0" * 64},
    {"artifact_format": "exe"},
    {"arch": "x86_64"},
    {"dependencies": ("missing",)},
])
def test_pre_effect_verification_failures_have_zero_guest_effects(bad):
    guest = Guest()
    with pytest.raises(ValueError): install_verified(artifact(**bad), caps(), guest, signed)
    assert guest.effects == []


def test_signature_failure_has_zero_guest_effects():
    guest = Guest()
    with pytest.raises(ValueError): install_verified(artifact(), caps(), guest, rejected)
    assert guest.effects == []


def test_install_failure_rolls_back_snapshot():
    guest = Guest(fail=True)
    with pytest.raises(RuntimeError): install_verified(artifact(), caps(), guest, signed)
    assert guest.effects == [("snapshot", "s1"), ("install", "pkg"), ("rollback", "s1")]


def test_empty_snapshot_fails_before_install():
    class BadGuest(Guest):
        def snapshot(self): self.effects.append(("snapshot", "")); return ""
    guest = BadGuest()
    with pytest.raises(RuntimeError): install_verified(artifact(), caps(), guest, signed)
    assert guest.effects == [("snapshot", "")]
