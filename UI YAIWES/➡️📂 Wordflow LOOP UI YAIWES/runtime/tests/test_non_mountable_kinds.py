import sys
from dataclasses import replace
from pathlib import Path
import unittest

SRC = Path(__file__).resolve().parents[1] / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from plugins.catalog import build_registry
from plugins.mount_guard import MountGuard, MountRejectedError


class NonMountableKindTests(unittest.TestCase):
    def test_test_and_donor_components_are_rejected_in_production(self):
        registry = build_registry()
        for name in ("pytest", "hypothesis", "dagu", "redun"):
            with self.subTest(name=name):
                spec = replace(registry.get(name), enabled=True, factory_key="test.forbidden")
                with self.assertRaises(MountRejectedError):
                    MountGuard().validate(spec)


if __name__ == "__main__":
    unittest.main()
