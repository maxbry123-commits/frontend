import sys
from pathlib import Path
import unittest

SRC = Path(__file__).resolve().parents[1] / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from plugins.contract import PluginKind, PluginSpec
from plugins.registry import PluginRegistry
from resource_brain import ProvenanceTier, ResourceBrain, ResourceSelectionError


SHA = "a" * 40


def spec(name, capability, *, enabled=False, sha=SHA):
    return PluginSpec(
        name=name,
        kind=PluginKind.ADAPTER,
        capabilities=(capability,),
        source_path=f"runtime/vendor/{name}",
        source_tree_sha=sha,
        mount_path=f"runtime/vendor/{name}",
        enabled=enabled,
        factory_key=name,
    )


def registry(*specs):
    value = PluginRegistry()
    for item in specs:
        value.register(item)
    return value


class ResourceBrainTests(unittest.TestCase):
    def test_official_beats_existing_and_community(self):
        reg = registry(
            spec("community", "transport.http", enabled=True),
            spec("existing", "transport.http", enabled=True),
            spec("official", "transport.http"),
        )
        brain = ResourceBrain(
            reg,
            {
                "community": ProvenanceTier.COMMUNITY,
                "existing": ProvenanceTier.EXISTING,
                "official": ProvenanceTier.OFFICIAL,
            },
        )
        self.assertEqual(brain.select("transport.http").spec.name, "official")

    def test_wired_beats_unwired_inside_same_provenance_tier(self):
        reg = registry(
            spec("unwired", "transport.http"),
            spec("wired", "transport.http", enabled=True),
        )
        brain = ResourceBrain(
            reg,
            {
                "unwired": ProvenanceTier.OFFICIAL,
                "wired": ProvenanceTier.OFFICIAL,
            },
        )
        self.assertEqual(brain.select("transport.http").spec.name, "wired")

    def test_exact_capability_only_and_no_match_fails_closed(self):
        brain = ResourceBrain(
            registry(spec("http", "transport.http")),
            {"http": ProvenanceTier.OFFICIAL},
        )
        with self.assertRaises(ResourceSelectionError):
            brain.select("transport")

    def test_invalid_identity_fails_closed(self):
        brain = ResourceBrain(
            registry(spec("broken", "transport.http", sha="not-a-sha")),
            {"broken": ProvenanceTier.OFFICIAL},
        )
        with self.assertRaises(ResourceSelectionError):
            brain.select("transport.http")

    def test_missing_provenance_fails_closed(self):
        brain = ResourceBrain(registry(spec("http", "transport.http")), {})
        with self.assertRaises(ResourceSelectionError):
            brain.select("transport.http")

    def test_registry_rejects_duplicate_resource_identity(self):
        reg = registry(spec("http", "transport.http"))
        with self.assertRaises(ValueError):
            reg.register(spec("http", "transport.http"))


if __name__ == "__main__":
    unittest.main()
