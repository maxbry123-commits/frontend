from __future__ import annotations

from .contract import PluginKind, PluginSpec


COMPONENTS: tuple[PluginSpec, ...] = (
    PluginSpec("apache_pycasbin", PluginKind.POLICY, ("policy.authorization",), "UI YAIWES/componentes open soure UI YAIWES/Apache PyCasbin", "ca8d5efdcb1b63bbfabf07e6679075134391b314", "casbin"),
    PluginSpec("bulkman", PluginKind.RESILIENCE, ("resilience.bulkhead",), "UI YAIWES/componentes open soure UI YAIWES/Bulkman", "271c64e915a38926db06754adc6c20841a4a4dd0", "bulkman"),
    PluginSpec("dagu", PluginKind.DONOR, ("donor.workflow_patterns",), "UI YAIWES/componentes open soure UI YAIWES/Dagu", "766403bfa76c123b3d8bf9f2a9be3008e4e0d2eb", None),
    PluginSpec("httpx", PluginKind.ADAPTER, ("transport.http",), "UI YAIWES/componentes open soure UI YAIWES/HTTPX", "50f3492d7c603cfd94e5029870ac7546666dec5e", "httpx"),
    PluginSpec("hypothesis", PluginKind.TEST, ("test.property",), "UI YAIWES/componentes open soure UI YAIWES/Hypothesis", "c7a0b0e22f5d5b63fd1f97fbd4dbf65a781e865c", "hypothesis"),
    PluginSpec("opentelemetry_python", PluginKind.OBSERVABILITY, ("observability.trace", "observability.metrics"), "UI YAIWES/componentes open soure UI YAIWES/OpenTelemetry Python", "2a74339d862124f2637247862f53497448619d49", "opentelemetry-api/src/opentelemetry"),
    PluginSpec("pydantic", PluginKind.ADAPTER, ("contract.validation",), "UI YAIWES/componentes open soure UI YAIWES/Pydantic", "41f2003ff0dd618e9f0b751b01bcea3f1deb5c6f", "pydantic"),
    PluginSpec("rule_engine", PluginKind.POLICY, ("policy.rules",), "UI YAIWES/componentes open soure UI YAIWES/Rule Engine", "ab1bbafa70cc9fb0dc1f82c138e5a6a734e9a882", "lib"),
    PluginSpec("stabilize_core", PluginKind.CORE, ("workflow.owner", "workflow.dag", "workflow.recovery", "workflow.streaming"), "UI YAIWES/componentes open soure UI YAIWES/Stabilize CORE", "4698f403b847a5cc7aecd4b6f22a1636ca8be98b", "src/stabilize", workflow_owner=True),
    PluginSpec("starlette", PluginKind.ADAPTER, ("api.asgi", "api.websocket", "api.streaming"), "UI YAIWES/componentes open soure UI YAIWES/Starlette", "9d9ad977106de6488276491f051c93a2698954e7", "starlette"),
    PluginSpec("pytest", PluginKind.TEST, ("test.unit", "test.integration"), "UI YAIWES/componentes open soure UI YAIWES/pytest", "05ba709ff69eab1ecb554ed1da1b7982b36dd64c", "src"),
    PluginSpec("redun", PluginKind.DONOR, ("donor.provenance", "donor.hashing"), "UI YAIWES/componentes open soure UI YAIWES/redun", "e301e8967ebdcb0b27734a820bd2608999b08541", None),
    PluginSpec("resilient_circuit", PluginKind.RESILIENCE, ("resilience.circuit_breaker",), "UI YAIWES/componentes open soure UI YAIWES/resilient-circuit", "32c7a96fee897e44e20a85b6e78995cc9bd5a9e3", "resilient_circuit"),
    PluginSpec("structlog", PluginKind.OBSERVABILITY, ("observability.logging",), "UI YAIWES/componentes open soure UI YAIWES/structlog", "5393fcee00ae1ed638601ed9915c78dd862988d5", "src/structlog"),
)


def build_registry():
    from .registry import PluginRegistry

    registry = PluginRegistry()
    for spec in COMPONENTS:
        registry.register(spec)
    return registry
