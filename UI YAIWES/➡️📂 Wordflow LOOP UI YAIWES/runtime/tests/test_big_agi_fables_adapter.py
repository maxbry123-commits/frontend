import sys
from dataclasses import replace
from pathlib import Path
import unittest

SRC = Path(__file__).resolve().parents[1] / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from plugins.activation import ActivationRejectedError, build_runtime_registry
from plugins.big_agi_adapter import (
    BIG_AGI_CAPABILITY,
    BIG_AGI_MOUNT_PATH,
    BIG_AGI_SOURCE_PATH,
    BIG_AGI_SOURCE_TREE_SHA,
    BigAgiAdapterError,
    build_big_agi_factories,
)
from plugins.fables import FablesContractError, FablesSocket


class BigAgiFablesAdapterTests(unittest.TestCase):
    def _enabled_registry(self):
        return build_runtime_registry(["big_agi"])

    def test_catalog_identity_and_destination_are_pinned(self):
        spec = self._enabled_registry().get("big_agi")
        self.assertEqual(spec.capabilities, (BIG_AGI_CAPABILITY,))
        self.assertEqual(spec.source_path, BIG_AGI_SOURCE_PATH)
        self.assertEqual(spec.source_tree_sha, BIG_AGI_SOURCE_TREE_SHA)
        self.assertEqual(spec.mount_path, BIG_AGI_MOUNT_PATH)
        self.assertFalse(spec.workflow_owner)

    def test_fables_mounts_only_declared_multimodel_capability(self):
        registry = self._enabled_registry()
        spec = registry.get("big_agi")
        socket = FablesSocket(registry, build_big_agi_factories(spec))
        workspace = socket.mount("big_agi", BIG_AGI_CAPABILITY)
        self.assertEqual(workspace.evidence()["source_tree_sha"], BIG_AGI_SOURCE_TREE_SHA)
        self.assertEqual(workspace.evidence()["mount_path"], BIG_AGI_MOUNT_PATH)
        self.assertFalse(workspace.workflow_owner)
        with self.assertRaises(FablesContractError):
            socket.mount("big_agi", "workflow.owner")

    def test_forged_source_identity_fails_closed(self):
        registry = self._enabled_registry()
        forged = replace(registry.get("big_agi"), source_tree_sha="0" * 40)
        with self.assertRaises(BigAgiAdapterError):
            build_big_agi_factories(forged)

    def test_other_ui_catalog_entries_remain_blocked(self):
        for name in ("librechat", "open_webui"):
            with self.subTest(name=name):
                with self.assertRaises(ActivationRejectedError):
                    build_runtime_registry([name])

    def test_stabilize_remains_the_only_workflow_owner(self):
        registry = self._enabled_registry()
        self.assertEqual(registry.workflow_owner.name, "stabilize_core")
        self.assertFalse(registry.get("big_agi").workflow_owner)


if __name__ == "__main__":
    unittest.main()
