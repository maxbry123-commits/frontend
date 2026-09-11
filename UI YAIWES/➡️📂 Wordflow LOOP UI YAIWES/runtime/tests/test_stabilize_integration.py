import sys
from pathlib import Path
import unittest

SRC = Path(__file__).resolve().parents[1] / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from core.workflow_definition import (
    WORKFLOW_CONTRACT,
    WORKFLOW_OWNER,
    YAIWES_CHAT_WORKFLOW,
)
from plugins.activation import ActivationRejectedError, build_runtime_registry
from plugins.loader import PluginLoader
from plugins.stabilize_adapter import (
    StabilizeBootstrapError,
    StabilizeDependencies,
    build_stabilize_factories,
    create_stabilize_runtime,
)


class FakeOrchestrator:
    def __init__(self, queue, store=None):
        self.queue = queue
        self.store = store


class StabilizeIntegrationTests(unittest.TestCase):
    def test_activation_is_explicit_and_single_owner(self):
        registry = build_runtime_registry(["stabilize_core"])
        spec = registry.get("stabilize_core")
        self.assertTrue(spec.enabled)
        self.assertEqual(spec.factory_key, "stabilize.orchestrator")
        self.assertEqual(registry.workflow_owner.name, "stabilize_core")

    def test_unapproved_activation_fails_closed(self):
        with self.assertRaises(ActivationRejectedError):
            build_runtime_registry(["dagu"])

    def test_queue_is_required(self):
        with self.assertRaises(StabilizeBootstrapError):
            create_stabilize_runtime(
                StabilizeDependencies(queue=None, orchestrator_type=FakeOrchestrator)
            )

    def test_dependency_identity_health(self):
        queue = object()
        store = object()
        runtime = create_stabilize_runtime(
            StabilizeDependencies(
                queue=queue,
                store=store,
                orchestrator_type=FakeOrchestrator,
            )
        )
        self.assertTrue(runtime.healthy)
        self.assertIs(runtime.orchestrator.queue, queue)
        self.assertIs(runtime.orchestrator.store, store)

    def test_universal_loader_mounts_stabilize_factory(self):
        queue = object()
        store = object()
        dependencies = StabilizeDependencies(
            queue=queue,
            store=store,
            orchestrator_type=FakeOrchestrator,
        )
        registry = build_runtime_registry(["stabilize_core"])
        runtime = PluginLoader(
            registry,
            build_stabilize_factories(dependencies),
        ).mount("stabilize_core")
        self.assertTrue(runtime.healthy)
        self.assertIs(runtime.queue, queue)
        self.assertIs(runtime.store, store)

    def test_yaiwes_workflow_definition_is_19_step_declarative_contract(self):
        definition = YAIWES_CHAT_WORKFLOW
        definition.validate()
        self.assertEqual(definition.owner, WORKFLOW_OWNER)
        self.assertEqual(definition.owner, "stabilize_core")
        self.assertEqual(definition.contract, WORKFLOW_CONTRACT)
        self.assertEqual(definition.contract, "tel.workflow/v3")
        self.assertEqual(len(definition.steps), 19)
        self.assertEqual(tuple(step.order for step in definition.steps), tuple(range(1, 20)))
        self.assertEqual(definition.steps[0].step_id, "master_input")
        self.assertEqual(definition.steps[-1].step_id, "final_judge")
        self.assertEqual(definition.steps[12].condition, "GAP")
        self.assertEqual(definition.steps[13].condition, "PASS")
        self.assertEqual(len(definition.fingerprint()), 64)
        self.assertEqual(definition.fingerprint(), definition.fingerprint())

    def test_workflow_definition_matches_runtime_single_owner(self):
        registry = build_runtime_registry([WORKFLOW_OWNER])
        self.assertEqual(registry.workflow_owner.name, YAIWES_CHAT_WORKFLOW.owner)
        self.assertNotIn("dagu", YAIWES_CHAT_WORKFLOW.manifest()["owner"])
        self.assertNotIn("redun", YAIWES_CHAT_WORKFLOW.manifest()["owner"])


if __name__ == "__main__":
    unittest.main()
