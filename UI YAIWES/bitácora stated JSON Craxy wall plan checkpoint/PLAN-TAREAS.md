# PLAN 1×1 — Componentes → Plugins → Wordflow

1. P01A ✅ Inventario raíz: 0 component dirs sueltos; 14 centralizados.
2. P01B ✅ Revisión code-root 14/14.
3. P01C ✅ SOURCE_URL + SOURCE_COMMIT + tree/code-root + destino/dedup 14/14; read-back independiente PASS.
4. P01D ✅ Socket universal modular + local tests 5/5 + GitHub file read-back.
5. P01E ✅ Stabilize code-only vendor copy; sigue NOT_MOUNTED.
6. P01 ✅ VERIFIED_CLOSED — matriz física/provenance 14/14 reconciliada.
7. P02A READY — factory Stabilize con Queue/WorkflowStore inyectados + registry/mount/health test ejecutable.
8. P02B BLOCKED_BY_P02A — Pydantic contract plugin; validar pydantic-core.
9. P02C BLOCKED_BY_P02A — Rule Engine policy plugin.
10. P03 — HTTPX/Starlette adapters.
11. P04 — Bulkman/resilient-circuit.
12. P05 — structlog/OpenTelemetry; SDK OTel separado.
13. P06 — pytest/Hypothesis test-only.
14. P07 — Dagu/redun donor-only.
15. P08 — PyCasbin policy.

Búsquedas obligatorias por nodo antes de programar: raíz central UI YAIWES → todas las raíces frontend → agentes → router-universal-router-inteligente- → osquestador-auditor. Solo reutilizar con provenance/destino/dedup.

Invariante: `SOURCE_URL+COMMIT → code-root SHA → capability passport → adapter/factory → registry → mount guard → health/test → evidence`. No monolitos; no repos completos en hot path; código presente ≠ integración.