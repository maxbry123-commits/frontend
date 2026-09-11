import sys
from pathlib import Path
import unittest

SRC = Path(__file__).resolve().parents[1] / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from pydantic import BaseModel

from plugins.activation import build_runtime_registry
from plugins.loader import PluginLoader
from plugins.pydantic_adapter import (
    EXPECTED_PYDANTIC_CORE_VERSION,
    EXPECTED_PYDANTIC_VERSION,
    PydanticDependencies,
    PydanticVersionMismatchError,
    build_pydantic_factories,
    create_pydantic_runtime,
    ensure_compatible,
)


class DemoContract(BaseModel):
    name: str
    count: int


class PydanticContractAdapterTests(unittest.TestCase):
    def test_exact_component_versions_are_accepted(self):
        report = ensure_compatible(EXPECTED_PYDANTIC_VERSION, EXPECTED_PYDANTIC_CORE_VERSION)
        self.assertTrue(report.compatible)

    def test_wrong_core_version_fails_closed(self):
        with self.assertRaises(PydanticVersionMismatchError):
            ensure_compatible(EXPECTED_PYDANTIC_VERSION, "2.46.4")

    def test_injected_runtime_validates_dumps_and_schemas(self):
        dependencies = PydanticDependencies(
            base_model_type=BaseModel,
            pydantic_version=EXPECTED_PYDANTIC_VERSION,
            core_version=EXPECTED_PYDANTIC_CORE_VERSION,
        )
        runtime = create_pydantic_runtime(dependencies)
        item = runtime.validate(DemoContract, {"name": "demo", "count": "2"})
        self.assertEqual(runtime.dump(item), {"name": "demo", "count": 2})
        self.assertEqual(runtime.schema(DemoContract)["title"], "DemoContract")
        self.assertTrue(runtime.healthy)

    def test_universal_loader_mounts_only_with_compatible_injected_versions(self):
        dependencies = PydanticDependencies(
            base_model_type=BaseModel,
            pydantic_version=EXPECTED_PYDANTIC_VERSION,
            core_version=EXPECTED_PYDANTIC_CORE_VERSION,
        )
        runtime = PluginLoader(
            build_runtime_registry(["pydantic"]),
            build_pydantic_factories(dependencies),
        ).mount("pydantic")
        self.assertTrue(runtime.healthy)

    def test_current_environment_matches_canonical_versions(self):
        runtime = create_pydantic_runtime()
        self.assertTrue(runtime.healthy)
        self.assertEqual(runtime.compatibility.pydantic_version, EXPECTED_PYDANTIC_VERSION)
        self.assertEqual(runtime.compatibility.core_version, EXPECTED_PYDANTIC_CORE_VERSION)


if __name__ == "__main__":
    unittest.main()
