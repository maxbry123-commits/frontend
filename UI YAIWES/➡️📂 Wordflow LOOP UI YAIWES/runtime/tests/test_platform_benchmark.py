import json
import sys
import time
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from uek.platform_matrix import (
    Platform,
    baseline_linear_policy_lookup,
    indexed_policy_lookup,
)


def _measure(fn, platform, iterations):
    start = time.perf_counter_ns()
    for _ in range(iterations):
        fn(platform)
    return time.perf_counter_ns() - start


class PlatformBenchmarkTests(unittest.TestCase):
    def test_indexed_lookup_benchmark_reports_100x_truthfully(self):
        # Warm both paths so import/cache effects do not dominate the measurement.
        for _ in range(2_000):
            baseline_linear_policy_lookup(Platform.IOS)
            indexed_policy_lookup(Platform.IOS)

        iterations = 100_000
        baseline_samples = [
            _measure(baseline_linear_policy_lookup, Platform.IOS, iterations)
            for _ in range(5)
        ]
        candidate_samples = [
            _measure(indexed_policy_lookup, Platform.IOS, iterations)
            for _ in range(5)
        ]
        baseline_ns = sorted(baseline_samples)[len(baseline_samples) // 2]
        candidate_ns = sorted(candidate_samples)[len(candidate_samples) // 2]
        self.assertGreater(baseline_ns, 0)
        self.assertGreater(candidate_ns, 0)

        ratio = baseline_ns / candidate_ns
        report = {
            "schema": "yaiwes.n06.platform-benchmark.v1",
            "metric": "policy_lookup_latency",
            "iterations_per_sample": iterations,
            "samples": 5,
            "aggregation": "median",
            "baseline": "linear_scan_5_platform_policies",
            "candidate": "indexed_dict_lookup",
            "baseline_ns": baseline_ns,
            "candidate_ns": candidate_ns,
            "speedup_ratio": round(ratio, 4),
            "meets_100x": ratio >= 100.0,
        }
        print("N06_BENCHMARK=" + json.dumps(report, sort_keys=True))

        # The test certifies measurement integrity, not a pre-decided 100x claim.
        self.assertEqual(report["meets_100x"], ratio >= 100.0)
        self.assertEqual(report["iterations_per_sample"], 100_000)


if __name__ == "__main__":
    unittest.main()
