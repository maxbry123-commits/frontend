# PLAN 1×1 — Componentes → Plugins → Wordflow

1. P01 ✅ VERIFIED_CLOSED — inventario/provenance/dedup 14/14.
2. P02A 🚩 CLOSED_UNVERIFIED — Stabilize adapter cableado; recovery real-vendor pendiente por DNS local.
3. P02B 🚩 CLOSED_UNVERIFIED — Pydantic adapter/vendor; recovery pendiente por mismatch `2.14.0b1/2.48.0` vs runtime local.
4. P02C 🚩 CLOSED_UNVERIFIED — Rule Engine adapter/vendor 5.0.3; checks/read-back PASS, ejecución real bloqueada por DNS local.
5. P03 ACTIVE — HTTPX + Starlette en adapters separados: transporte cliente y servidor ASGI; ninguno posee workflow.
6. P04 — Bulkman/resilient-circuit.
7. P05 — structlog/OpenTelemetry; SDK OTel separado.
8. P06 — pytest/Hypothesis test-only.
9. P07 — Dagu/redun donor-only.
10. P08 — PyCasbin policy.

Antes de CADA nodo: componentes UI → frontend completo → agentes → router-universal-router-inteligente- → osquestador-auditor; después arquitectura ×4 + fuentes de verdad ×4.

Flags/bloqueos: persistir evidencia y recovery; jamás convertirlos en PASS; continuar únicamente con tarea segura independiente.

Invariante: `SOURCE_URL+COMMIT → code-root SHA → capability passport → adapter/factory → registry → mount guard → health/test → evidence`. No monolitos; código presente ≠ integración; sin evidencia real no VERIFIED_CLOSED.
