# PLAN 1×1 — Componentes → Plugins → Wordflow

1. P01 ✅ VERIFIED_CLOSED — inventario/provenance/dedup 14/14.
2. P02A 🚩 CLOSED_UNVERIFIED — Stabilize real-vendor execution pendiente.
3. P02B 🚩 CLOSED_UNVERIFIED — Pydantic/core mismatch pendiente.
4. P02C 🚩 CLOSED_UNVERIFIED — Rule Engine real-vendor execution pendiente.
5. P03 ⚠️ PARTIAL_VERIFIED — HTTPX PASS real local; Starlette version flag.
6. P04 🚩 CLOSED_UNVERIFIED — resilient-circuit + Bulkman; ejecución real pendiente.
7. P05 🟡 STAGED_UNVERIFIED — Structlog + OpenTelemetry code-only, adapters separados/read-only y activation keys publicados en `ui-yaiwes-p05-observability-20260906`; injection/socket `3/3 PASS`; test real intentado pero bloqueado antes de ejecución por DNS del runner; branch divergido respecto de main (`ahead 3 / behind 4`, merge-base `3e91c8f65bef6ec3b6e0c48f889eda35f8017130`, main observado `04ad9bc66ea4d71fac5a827937a9107aeae1f72c`).
8. P06 — pytest + Hypothesis test-only.
9. P07 — Dagu + redun donor-only.
10. P08 — PyCasbin policy.

Antes de CADA nodo: componentes UI → frontend completo → agentes → router-universal-router-inteligente- → osquestador-auditor; después arquitectura ×4 + fuentes de verdad ×4. La arquitectura canónica enumera 4 documentos únicos aunque la orden actual diga 3: se conserva GAP fail-closed y no se omite evidencia.
Observabilidad no gobierna workflow. Stabilize es el único workflow owner. Nunca force sobre main.
Siguiente gate P05: no mergear mientras exista divergencia sin reconciliación; ejecutar vendors reales mediante ejecución residente en repo o checkout materializado sin dependencia del DNS local, después reconciliar historiales y repetir read-back/tests.
