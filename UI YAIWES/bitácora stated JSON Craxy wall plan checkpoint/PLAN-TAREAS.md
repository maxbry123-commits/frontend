# PLAN 1×1 — Componentes → Plugins → Wordflow

1. P01 ✅ VERIFIED_CLOSED — inventario/provenance/dedup 14/14.
2. P02A 🚩 CLOSED_UNVERIFIED_WITH_FLAG — Stabilize adapter cableado; falta mount real por bloqueo DNS local.
3. P02A-RECOVERY PENDING — repetir mismo adapter en entorno ejecutable; no duplicar.
4. P02B 🚩 CLOSED_UNVERIFIED_WITH_VERSION_FLAG — Pydantic adapter + code-only vendor publicados; fuente exige `2.14.0b1 / core 2.48.0`, runtime local tiene `2.13.4 / core 2.46.4`; factory falla cerrado.
5. P02B-RECOVERY PENDING — ejecutar adapter con versiones exactas antes de VERIFIED_CLOSED.
6. P02C ACTIVE_SAFE — Rule Engine policy/rules plugin aislado, sin ownership de workflow.
7. P03 — HTTPX/Starlette adapters.
8. P04 — Bulkman/resilient-circuit.
9. P05 — structlog/OpenTelemetry; SDK OTel separado.
10. P06 — pytest/Hypothesis test-only.
11. P07 — Dagu/redun donor-only.
12. P08 — PyCasbin policy.

Antes de CADA nodo: componentes UI → frontend completo → agentes → router-universal-router-inteligente- → osquestador-auditor; después arquitectura ×4 + fuentes de verdad ×4.

Flags/bloqueos: persistir evidencia y recovery; jamás convertirlos en PASS; continuar únicamente con tarea segura independiente.

Invariante: `SOURCE_URL+COMMIT → code-root SHA → capability passport → adapter/factory → registry → mount guard → health/test → evidence`. No monolitos; código presente ≠ integración; sin evidencia real no VERIFIED_CLOSED.
