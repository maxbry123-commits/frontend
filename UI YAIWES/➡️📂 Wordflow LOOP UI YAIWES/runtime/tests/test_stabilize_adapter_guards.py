import sys
from pathlib import Path
import unittest

SRC = Path(__file__).resolve().parents[1] / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from plugins.catalog import COMPONENTS
from plugins.stabilize_adapter import (
    StabilizeBootstrapError,
    StabilizeDependencies,
    create_stabilize_runtime,
)
from plugins.stabilize_adapter.factory import vendor_root


class BadOrchestrator:
    def __init__(self, queue, store=None):
        self.queue = object()
        self.store = store


class StabilizeAdapterGuardTests(unittest.TestCase):
    def test_static_catalog_remains_inert(self):
        self.assertFalse(any(spec.enabled for spec in COMPONENTS))

    def test_bad_dependency_identity_fails_closed(self):
        with self.assertRaises(StabilizeBootstrapError):
            create_stabilize_runtime(
                StabilizeDependencies(
                    queue=object(),
                    store=object(),
                    orchestrator_type=BadOrchestrator,
                )
            )

    def test_vendored_orchestrator_source_is_present(self):
        self.assertTrue((vendor_root() / "stabilize" / "orchestrator.py").is_file())


if __name__ == "__main__":
    unittest.main()
