from __future__ import annotations

from .contract import PluginKind, PluginSpec
from .registry import PluginRegistry


COMPONENTS = (
    PluginSpec("stabilize_core", PluginKind.CORE, ("workflow.owner", "workflow.durable", "workflow.recovery"), "runtime/vendor/stabilize", "35c7f5b60ee6cf8fd5ae3187d6e92fe15012499b", "runtime/vendor/stabilize", workflow_owner=True, factory_key="stabilize.orchestrator"),
    PluginSpec("pydantic", PluginKind.ADAPTER, ("contracts.typed",), "runtime/vendor/pydantic", "c04b6070f1a19b5c7dfdecc10ce28ba1a4afee9b", "runtime/vendor/pydantic", factory_key="pydantic"),
    PluginSpec("starlette", PluginKind.ADAPTER, ("transport.asgi",), "runtime/vendor/starlette", "820b2cdde800811062b2be43abd909e27b38854f", "runtime/vendor/starlette", factory_key="starlette"),
    PluginSpec("httpx", PluginKind.ADAPTER, ("transport.http",), "runtime/vendor/httpx", "21eaf49210613909be2f7a864389a312a484d0eb", "runtime/vendor/httpx", factory_key="httpx"),
    PluginSpec("rule_engine", PluginKind.ADAPTER, ("rules.deterministic",), "runtime/vendor/rule_engine", "3ca8717fb4ce3561b1e76053afc487061c76cfe3", "runtime/vendor/rule_engine", factory_key="rule_engine"),
    PluginSpec("pycasbin", PluginKind.ADAPTER, ("policy.authz",), "runtime/vendor/pycasbin", "0c9f126dd92deaa7bacc75db4da46ba4a49ce1a7", "runtime/vendor/pycasbin", factory_key="pycasbin"),
    PluginSpec("opentelemetry_python", PluginKind.ADAPTER, ("observability.telemetry",), "runtime/vendor/opentelemetry_python", "39196d42f612ff214bd2bf987e167028b5a0bb25", "runtime/vendor/opentelemetry_python", factory_key="opentelemetry_python"),
    PluginSpec("pytest", PluginKind.TOOL, ("test.runner",), "runtime/vendor/pytest", "ff7a4ded2d8fd81e70d8a567babd84e73e5084c9", "runtime/vendor/pytest", factory_key="pytest"),
    PluginSpec("hypothesis", PluginKind.TOOL, ("test.property",), "runtime/vendor/hypothesis", "3d335f309bbf1d0b22f5a6906a06e05218d51abe", "runtime/vendor/hypothesis", factory_key="hypothesis"),
    PluginSpec("dagu", PluginKind.DONOR, ("workflow.patterns",), "runtime/vendor/dagu", "4d48d945a1ce614e56c0560e8d6671872fc54d98", "runtime/vendor/dagu", factory_key="dagu"),
    PluginSpec("redun", PluginKind.DONOR, ("provenance.hashing",), "runtime/vendor/redun", "a5cf758746537c3555c2f831ab068581c46786b1", "runtime/vendor/redun", factory_key="redun"),
    PluginSpec("librechat", PluginKind.UI, ("workspace.chat",), "runtime/vendor/librechat", "e4359ffa59cb8390dd321361cf8d09d76aa76880", "runtime/vendor/librechat", factory_key="librechat"),
    PluginSpec("big_agi", PluginKind.UI, ("workspace.multimodel",), "component-source/big-AGI", "39ee2280e85c95db1b20309f1bc440222b71f798", "runtime/vendor/big_agi", factory_key="big_agi"),
    PluginSpec("open_webui", PluginKind.UI, ("workspace.admin",), "runtime/vendor/open_webui", "330c665e90d805274126c8286c2f2ede553e36ce", "runtime/vendor/open_webui", factory_key="open_webui"),
)


def build_registry() -> PluginRegistry:
    registry = PluginRegistry()
    for spec in COMPONENTS:
        registry.register(spec)
    return registry
