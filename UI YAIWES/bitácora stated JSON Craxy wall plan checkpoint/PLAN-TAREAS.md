# PLAN 1×1 — Componentes → Plugins → Wordflow

1. P01 ✅ VERIFIED_CLOSED — inventario/provenance/dedup 14/14.
2. P02A 🚩 CLOSED_UNVERIFIED — Stabilize real-vendor execution pendiente.
3. P02B 🚩 CLOSED_UNVERIFIED — Pydantic/core mismatch pendiente.
4. P02C 🚩 CLOSED_UNVERIFIED — Rule Engine real-vendor execution pendiente.
5. P03 ⚠️ PARTIAL_VERIFIED — HTTPX PASS real local; Starlette version flag.
6. P04 🚩 CLOSED_UNVERIFIED — resilient-circuit 0.7.0 + Bulkman 2.0.3 adapters/vendor publicados; versiones compatibles entre sí; ejecución real de vendors pendiente.
7. P05 ACTIVE — structlog + OpenTelemetry en adapters separados y read-only.
8. P06 — pytest + Hypothesis test-only.
9. P07 — Dagu + redun donor-only.
10. P08 — PyCasbin policy.

Antes de CADA nodo: componentes UI → frontend completo → agentes → router-universal-router-inteligente- → osquestador-auditor; después arquitectura ×4 + fuentes de verdad ×4.
Flags permanecen con evidence/recovery; nunca PASS falso. Observabilidad no gobierna workflow. Stabilize es el único workflow owner.
