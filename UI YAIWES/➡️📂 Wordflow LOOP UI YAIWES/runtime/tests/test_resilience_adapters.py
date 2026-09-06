import sys
from pathlib import Path
import unittest

SRC = Path(__file__).resolve().parents[1] / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from plugins.bulkman_adapter import BulkmanDependencies, BulkmanVersionError, create_bulkman_runtime
from plugins.resilient_circuit_adapter import (
    ResilientCircuitDependencies,
    ResilientCircuitVersionError,
    create_resilient_circuit_runtime,
)

class FakePolicy:
    def __init__(self, **kwargs): self.kwargs = kwargs
    def __call__(self, fn):
        def wrapped(*args, **kwargs): return fn(*args, **kwargs)
        return wrapped

class FakeConfig:
    def __init__(self, **kwargs): self.kwargs = kwargs

class FakeBulkhead:
    def __init__(self, config, circuit_storage=None): self.config, self.circuit_storage = config, circuit_storage
    def execute(self, fn, *args, **kwargs): return fn(*args, **kwargs)

class ResilienceAdapterTests(unittest.TestCase):
    def test_resilient_circuit_delegates_policy(self):
        runtime = create_resilient_circuit_runtime(ResilientCircuitDependencies(FakePolicy, "0.7.0"))
        self.assertEqual(runtime.execute(lambda x: x + 1, 2), 3)
        self.assertTrue(runtime.healthy)

    def test_resilient_circuit_wrong_version_fails_closed(self):
        with self.assertRaises(ResilientCircuitVersionError):
            create_resilient_circuit_runtime(ResilientCircuitDependencies(FakePolicy, "0.6.0"))

    def test_bulkman_delegates_threading_bulkhead(self):
        runtime = create_bulkman_runtime(BulkmanDependencies(FakeConfig, FakeBulkhead, "2.0.3"))
        result = runtime.execute(lambda x: x * 2, 3, config_kwargs={"name": "test", "max_concurrent_calls": 1})
        self.assertEqual(result, 6)
        self.assertTrue(runtime.healthy)

    def test_bulkman_wrong_version_fails_closed(self):
        with self.assertRaises(BulkmanVersionError):
            create_bulkman_runtime(BulkmanDependencies(FakeConfig, FakeBulkhead, "1.0.0"))

if __name__ == "__main__":
    unittest.main()
