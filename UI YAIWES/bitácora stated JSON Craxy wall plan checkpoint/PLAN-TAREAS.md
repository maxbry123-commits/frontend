# PLAN 1×1 — Componentes → Plugins → Wordflow

1. P01 ✅ VERIFIED_CLOSED — inventario/provenance/dedup 14/14.
2. P02A 🚩 CLOSED_UNVERIFIED — Stabilize adapter cableado; recovery real-vendor pendiente.
3. P02B 🚩 CLOSED_UNVERIFIED — Pydantic adapter/vendor; mismatch de versión/core pendiente.
4. P02C 🚩 CLOSED_UNVERIFIED — Rule Engine adapter/vendor; ejecución real pendiente.
5. P03 ⚠️ PARTIAL_VERIFIED — HTTPX 0.28.1 ejecutado PASS; Starlette fuente 1.6.0 vs local 0.50.0 queda flag fail-closed.
6. P04 ACTIVE — Bulkman + resilient-circuit como adapters de resiliencia separados.
7. P05 — structlog + OpenTelemetry; SDK OTel separado.
8. P06 — pytest + Hypothesis test-only.
9. P07 — Dagu + redun donor-only.
10. P08 — PyCasbin policy.

Antes de CADA nodo: componentes UI → frontend completo → agentes → router-universal-router-inteligente- → osquestador-auditor; después arquitectura ×4 + fuentes de verdad ×4.

Flags/bloqueos: persistir evidencia/recovery; jamás convertirlos en PASS; continuar únicamente con tarea segura independiente.

Invariante: `SOURCE_URL+COMMIT → code-root SHA → adapter/factory → registry → mount guard → health/test → evidence`. Stabilize único workflow owner; no monolitos; código presente ≠ integración.
