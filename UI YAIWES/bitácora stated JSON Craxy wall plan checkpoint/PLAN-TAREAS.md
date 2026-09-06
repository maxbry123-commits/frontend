# PLAN 1×1 — Componentes → Plugins → Wordflow

1. P01A ✅ Inventario raíz y carpeta central.
2. P01B ACTIVE — revisar 14 componentes uno a uno: función, código útil, source URL/SHA, dependencia, licencia, basura no copiable.
3. P01C — crear `runtime/src/plugins/` modular: contract, registry, mount_guard, loader y README.
4. P01D — crear tests del plugin universal antes de montar componentes.
5. P02 — integrar primero Stabilize/Pydantic/rule-engine como capacidades separadas; Stabilize sigue único owner.
6. P03 — adapters HTTPX/Starlette; no mezclar transporte con negocio.
7. P04 — resiliencia Bulkman/resilient-circuit.
8. P05 — observabilidad structlog/OpenTelemetry.
9. P06 — test plugins pytest/Hypothesis.
10. P07 — donors Dagu/redun solo patrones/código puntual, no segundo scheduler.
11. P08 — PyCasbin policy como plugin separado, sin gobernar workflow.
12. Cada nodo: test → evidence → STATE/CHECKPOINT/bitácora/arquitectura → siguiente.

Invariante: `component repo → code review → capability passport → adapter/plugin → registry → mount guard → health/test → evidence`; jamás pegar repos completos dentro de un archivo monolítico.