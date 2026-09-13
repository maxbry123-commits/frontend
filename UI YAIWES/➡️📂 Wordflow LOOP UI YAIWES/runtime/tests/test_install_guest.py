import hashlib
import sys
from pathlib import Path
import unittest

SRC = Path(__file__).resolve().parents[1] / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from install.guest_installer import (
    Artifact,
    GuestCapabilities,
    install_verified,
)


PAYLOAD = b"signed package bytes"


class FakeGuest:
    def __init__(self, *, fail_install=False, fail_rollback=False):
        self.calls = []
        self.fail_install = fail_install
        self.fail_rollback = fail_rollback

    def snapshot(self):
        self.calls.append(("snapshot",))
        return "snapshot-1"

    def install(self, **kwargs):
        self.calls.append(("install", kwargs))
        if self.fail_install:
            raise RuntimeError("install")

    def rollback(self, snapshot_id):
        self.calls.append(("rollback", snapshot_id))
        if self.fail_rollback:
            raise RuntimeError("rollback")


def artifact(**overrides):
    values = {
        "name": "agent.apk",
        "payload": PAYLOAD,
        "sha256_hex": hashlib.sha256(PAYLOAD).hexdigest(),
        "signature": "signed",
        "artifact_format": "apk",
        "arch": "arm64",
        "dependencies": ("runtime",),
    }
    values.update(overrides)
    return Artifact(**values)


CAPABILITIES = GuestCapabilities("aarch64", ("apk",), ("runtime",))


class GuestInstallerTests(unittest.TestCase):
    def test_verified_bytes_install_inside_guest_after_snapshot(self):
        guest = FakeGuest()
        receipt = install_verified(artifact(), CAPABILITIES, guest, lambda _: True)
        self.assertEqual(receipt.effect_scope, "guest")
        self.assertEqual([item[0] for item in guest.calls], ["snapshot", "install"])
        self.assertEqual(guest.calls[1][1]["payload"], PAYLOAD)

    def test_hash_signature_format_arch_dependency_fail_before_effect(self):
        cases = [
            (artifact(sha256_hex="0" * 64), CAPABILITIES, lambda _: True),
            (artifact(), CAPABILITIES, lambda _: False),
            (artifact(artifact_format="deb"), CAPABILITIES, lambda _: True),
            (artifact(arch="x86_64"), CAPABILITIES, lambda _: True),
            (artifact(dependencies=("missing",)), CAPABILITIES, lambda _: True),
        ]
        for package, capabilities, verifier in cases:
            guest = FakeGuest()
            with self.assertRaises(ValueError):
                install_verified(package, capabilities, guest, verifier)
            self.assertEqual(guest.calls, [])

    def test_unsafe_name_and_non_bytes_are_rejected_pre_effect(self):
        for package in (
            artifact(name="../agent.apk"),
            artifact(payload=bytearray(PAYLOAD)),
        ):
            guest = FakeGuest()
            with self.assertRaises(ValueError):
                install_verified(package, CAPABILITIES, guest, lambda _: True)
            self.assertEqual(guest.calls, [])

    def test_signature_exception_is_fail_closed_before_snapshot(self):
        guest = FakeGuest()
        def verifier(_):
            raise RuntimeError("verifier")
        with self.assertRaisesRegex(ValueError, "verification failed"):
            install_verified(artifact(), CAPABILITIES, guest, verifier)
        self.assertEqual(guest.calls, [])

    def test_architecture_alias_is_explicitly_supported(self):
        guest = FakeGuest()
        capabilities = GuestCapabilities("arm64", ("APK",), ("runtime",))
        install_verified(artifact(), capabilities, guest, lambda _: True)
        self.assertEqual(len(guest.calls), 2)

    def test_duplicate_dependencies_fail_before_snapshot(self):
        guest = FakeGuest()
        with self.assertRaisesRegex(ValueError, "duplicate"):
            install_verified(
                artifact(dependencies=("runtime", "runtime")),
                CAPABILITIES,
                guest,
                lambda _: True,
            )
        self.assertEqual(guest.calls, [])

    def test_install_failure_rolls_back(self):
        guest = FakeGuest(fail_install=True)
        with self.assertRaisesRegex(RuntimeError, "rollback complete"):
            install_verified(artifact(), CAPABILITIES, guest, lambda _: True)
        self.assertEqual(
            [item[0] for item in guest.calls],
            ["snapshot", "install", "rollback"],
        )

    def test_rollback_failure_is_not_hidden(self):
        guest = FakeGuest(fail_install=True, fail_rollback=True)
        with self.assertRaisesRegex(RuntimeError, "rollback failed"):
            install_verified(artifact(), CAPABILITIES, guest, lambda _: True)

    def test_empty_snapshot_blocks_install(self):
        guest = FakeGuest()
        guest.snapshot = lambda: ""
        with self.assertRaisesRegex(RuntimeError, "snapshot failed"):
            install_verified(artifact(), CAPABILITIES, guest, lambda _: True)
        self.assertEqual(guest.calls, [])


if __name__ == "__main__":
    unittest.main()
