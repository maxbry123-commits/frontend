"""Regression tests for closure after Coda; no external services required."""
import importlib.util
from pathlib import Path
import sys
import unittest

module_path = Path(__file__).resolve().parents[1] / "open_mythos_persistence_loop.py"
spec = importlib.util.spec_from_file_location("yaiwes_coda_under_test", module_path)
runtime = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = runtime
spec.loader.exec_module(runtime)


class CodaValidationTests(unittest.TestCase):
    def run_loop(self, coda, verify=lambda state: state["valid"]):
        return runtime.run_persistence_loop(
            {"valid": True},
            prelude=lambda state: dict(state),
            recurrent_step=lambda current, anchor, iteration: dict(current),
            verify_refute=verify,
            research_20=lambda current, anchor: [dict(anchor) for _ in range(20)],
            apply_recovery=lambda current, choices: choices[0],
            coda=coda,
        )

    def test_valid_coda_closes(self):
        trace = self.run_loop(lambda state: dict(state))
        self.assertTrue(trace.closed)
        self.assertTrue(trace.coda["valid"])

    def test_invalid_coda_cannot_close(self):
        with self.assertRaisesRegex(RuntimeError, "Coda final validation failed"):
            self.run_loop(lambda state: {"valid": False})

    def test_in_place_coda_mutation_is_checked(self):
        def coda(state):
            state["valid"] = False
            return state
        with self.assertRaisesRegex(RuntimeError, "Coda final validation failed"):
            self.run_loop(coda)

    def test_final_verifier_exception_propagates(self):
        def verify(state):
            if state.get("final"):
                raise ValueError("evidence unavailable")
            return state["valid"]
        with self.assertRaisesRegex(ValueError, "evidence unavailable"):
            self.run_loop(lambda state: {"valid": True, "final": True}, verify)


if __name__ == "__main__":
    unittest.main()
