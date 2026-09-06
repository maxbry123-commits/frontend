# PLAN 1×1 — Componentes → Plugins → Wordflow

1. P01A ✅ Inventario raíz: 0 component dirs sueltos; 14 centralizados.
2. P01B ✅ Revisión code-root 14/14.
3. P01C ✅ SOURCE_URL + SOURCE_COMMIT + tree/code-root + destino/dedup 14/14 escritos; verify_final read-back pendiente.
4. P01D ✅ Socket universal modular + local tests 5/5 + GitHub file read-back.
5. P01E ✅ Stabilize code-only vendor copy; sigue NOT_MOUNTED.
6. P02A BLOCKED_UNTIL_P01_VERIFY — factory Stabilize con Queue/WorkflowStore inyectados + mount/health test.
7. P02B — Pydantic contract plugin; validar pydantic-core.
8. P02C — Rule Engine policy plugin.
9. P03 — HTTPX/Starlette adapters.
10. P04 — Bulkman/resilient-circuit.
11. P05 — structlog/OpenTelemetry; SDK OTel separado.
12. P06 — pytest/Hypothesis test-only.
13. P07 — Dagu/redun donor-only.
14. P08 — PyCasbin policy.

Invariante: `SOURCE_URL+COMMIT → code-root SHA → capability passport → adapter/factory → registry → mount guard → health/test → evidence`. No monolitos; no repos completos en hot path.