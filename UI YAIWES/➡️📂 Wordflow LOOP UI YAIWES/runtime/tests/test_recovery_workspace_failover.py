from __future__ import annotations

from dataclasses import replace
import hashlib
from pathlib import Path
import sys
from types import SimpleNamespace
import unittest

SRC = Path(__file__).resolve().parents[1] / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from recovery.product_session import EffectReceipt, EffectRecord
from recovery.workspace_failover import (
    HostCandidate,
    ReplayEffect,
    WorkspaceCheckpoint,
    WorkspaceFailoverError,
    recover_workspace_failover,
    select_failover_host,
)
from storage.product_state import ProductSnapshot, encode_snapshot


class FakeRecovery:
    statuses = ("recovered",)
    init_count = 0

    def __init__(self, store, queue):
        type(self).init_count += 1
        self.store = store
        self.queue = queue

    def recover_pending_workflows(self, application=None):
        return [SimpleNamespace(status=status) for status in type(self).statuses]


class FakeLedger:
    def __init__(self):
        self.records: dict[str, EffectRecord] = {}

    def get(self, effect_id: str):
        return self.records.get(effect_id)

    def mark_pending(self, effect_id: str, payload_sha256: str):
        self.records[effect_id] = EffectRecord("pending", payload_sha256)

    def commit(self, effect_id: str, payload_sha256: str, output_sha256: str):
        current = self.records[effect_id]
        if current.payload_sha256 != payload_sha256:
            raise RuntimeError("payload drift")
        self.records[effect_id] = EffectRecord(
            "committed", payload_sha256, output_sha256
        )


class IdempotentSink:
    def __init__(self, prefix: bytes):
        self.prefix = prefix
        self.outputs: dict[str, bytes] = {}
        self.physical_count = 0

    def apply(self, effect_id: str, payload: bytes) -> EffectReceipt:
        if effect_id in self.outputs:
            return EffectReceipt(effect_id, self.outputs[effect_id], duplicate=True)
        self.physical_count += 1
        output = self.prefix + payload
        self.outputs[effect_id] = output
        return EffectReceipt(effect_id, output)


class WorkspaceFailoverTests(unittest.TestCase):
    def setUp(self):
        snapshot = ProductSnapshot(
            session_id="session-1",
            agent_memory_ref=None,
            chat=(),
            windows=(),
            files=(),
        )
        self.raw = encode_snapshot(snapshot)
        self.checkpoint = WorkspaceCheckpoint(
            workspace_id="workspace-1",
            epoch=7,
            source_host_id="host-a",
            session_id="session-1",
            checkpoint_ref="mem://workspace-1/7",
            checkpoint_sha256=hashlib.sha256(self.raw).hexdigest(),
        )
        self.hosts = (
            HostCandidate("host-a", False, 0),
            HostCandidate("host-c", True, 10),
            HostCandidate("host-b", True, 10),
        )
        self.ledger = FakeLedger()
        self.activation_sink = IdempotentSink(b"activated:")
        self.replay_sink = IdempotentSink(b"replayed:")
        self.loads = 0
        FakeRecovery.statuses = ("recovered",)
        FakeRecovery.init_count = 0

    def loader(self, ref: str) -> bytes:
        self.loads += 1
        self.assertEqual(ref, self.checkpoint.checkpoint_ref)
        return self.raw

    def run_failover(self, **overrides):
        args = dict(
            workspace_id="workspace-1",
            failed_host_id="host-a",
            expected_epoch=7,
            checkpoint=self.checkpoint,
            hosts=self.hosts,
            store=object(),
            queue=object(),
            checkpoint_bytes_loader=self.loader,
            ledger_integrity_check=lambda: True,
            effect_ledger=self.ledger,
            activate_host=self.activation_sink.apply,
            replay_effects=(ReplayEffect("effect-1", b"payload-1"),),
            apply_replay_effect=self.replay_sink.apply,
            application="yaiwes",
            recovery_type=FakeRecovery,
        )
        args.update(overrides)
        return recover_workspace_failover(**args)

    def test_target_selection_is_deterministic(self):
        target = select_failover_host(failed_host_id="host-a", hosts=self.hosts)
        self.assertEqual(target.host_id, "host-b")

    def test_reconstructs_workspace_and_replays_effects(self):
        result = self.run_failover()
        self.assertEqual(result.target_host_id, "host-b")
        self.assertEqual(result.product_session.snapshot.session_id, "session-1")
        self.assertTrue(result.project_recovery.safe_to_continue)
        self.assertEqual(result.activation.status, "committed")
        self.assertEqual(result.replay[0].status, "committed")
        self.assertEqual(self.activation_sink.physical_count, 1)
        self.assertEqual(self.replay_sink.physical_count, 1)
        self.assertEqual(self.loads, 1)
        self.assertEqual(FakeRecovery.init_count, 1)

    def test_restart_retry_does_not_duplicate_host_or_replay_effects(self):
        first = self.run_failover()
        second = self.run_failover()
        self.assertEqual(first.activation.status, "committed")
        self.assertEqual(second.activation.status, "skipped_committed")
        self.assertEqual(second.replay[0].status, "skipped_committed")
        self.assertEqual(self.activation_sink.physical_count, 1)
        self.assertEqual(self.replay_sink.physical_count, 1)
        self.assertEqual(FakeRecovery.init_count, 2)

    def test_workspace_epoch_and_source_binding_fail_closed(self):
        cases = (
            dict(workspace_id="other", expected="workspace_checkpoint_mismatch"),
            dict(expected_epoch=8, expected="workspace_epoch_mismatch"),
            dict(failed_host_id="host-z", expected="checkpoint_source_host_mismatch"),
        )
        for case in cases:
            expected = case.pop("expected")
            with self.subTest(expected=expected):
                with self.assertRaisesRegex(WorkspaceFailoverError, expected):
                    self.run_failover(**case)
        self.assertEqual(FakeRecovery.init_count, 0)
        self.assertEqual(self.activation_sink.physical_count, 0)

    def test_no_healthy_target_fails_before_recovery(self):
        hosts = (
            HostCandidate("host-a", False, 0),
            HostCandidate("host-b", False, 1),
        )
        with self.assertRaisesRegex(WorkspaceFailoverError, "no_healthy_failover_host"):
            self.run_failover(hosts=hosts)
        self.assertEqual(FakeRecovery.init_count, 0)
        self.assertEqual(self.loads, 0)

    def test_partial_project_recovery_blocks_all_failover_effects(self):
        FakeRecovery.statuses = ("partial",)
        with self.assertRaisesRegex(
            WorkspaceFailoverError, "workspace_recovery_not_safe_to_continue"
        ):
            self.run_failover()
        self.assertEqual(self.activation_sink.physical_count, 0)
        self.assertEqual(self.replay_sink.physical_count, 0)

    def test_same_epoch_cannot_drift_to_new_target_or_checkpoint(self):
        self.run_failover()
        FakeRecovery.init_count = 0
        changed_hosts = (
            HostCandidate("host-a", False, 0),
            HostCandidate("host-b", False, 10),
            HostCandidate("host-c", True, 10),
        )
        with self.assertRaisesRegex(
            WorkspaceFailoverError, "failover_binding_changed_for_epoch"
        ):
            self.run_failover(hosts=changed_hosts)
        self.assertEqual(FakeRecovery.init_count, 0)
        self.assertEqual(self.activation_sink.physical_count, 1)

        changed_checkpoint = replace(
            self.checkpoint,
            checkpoint_sha256="0" * 64,
        )
        with self.assertRaisesRegex(
            WorkspaceFailoverError, "failover_binding_changed_for_epoch"
        ):
            self.run_failover(checkpoint=changed_checkpoint)
        self.assertEqual(FakeRecovery.init_count, 0)

    def test_duplicate_replay_ids_fail_before_recovery_or_effect(self):
        duplicate = (
            ReplayEffect("effect-1", b"one"),
            ReplayEffect("effect-1", b"two"),
        )
        with self.assertRaisesRegex(WorkspaceFailoverError, "duplicate_replay_effect_id"):
            self.run_failover(replay_effects=duplicate)
        self.assertEqual(FakeRecovery.init_count, 0)
        self.assertEqual(self.loads, 0)
        self.assertEqual(self.activation_sink.physical_count, 0)


if __name__ == "__main__":
    unittest.main()
