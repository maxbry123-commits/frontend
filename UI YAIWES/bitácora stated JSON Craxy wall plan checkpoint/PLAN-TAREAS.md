# PLAN 1×1 — Componentes → Plugins → Wordflow

1. P01 ✅ VERIFIED_CLOSED — inventario/provenance/dedup 14/14.
2. P02A 🚩 CLOSED_UNVERIFIED — Stabilize real-vendor execution pendiente.
3. P02B 🚩 CLOSED_UNVERIFIED — Pydantic/core mismatch pendiente.
4. P02C 🚩 CLOSED_UNVERIFIED — Rule Engine real-vendor execution pendiente.
5. P03 ⚠️ PARTIAL_VERIFIED — HTTPX PASS real local; Starlette version flag.
6. P04 🚩 CLOSED_UNVERIFIED — resilient-circuit + Bulkman; ejecución real pendiente.
7. P05 🟠 VENDOR_TESTS_VERIFIED_RECONCILIATION_BLOCKED — Structlog + OpenTelemetry read-only; GitHub Actions run `34076616213`, job `101603870455`, `5/5 PASS` en 0.553s. Reconciliación abierta como draft PR #6: https://github.com/maxbry123-commits/frontend/pull/6; GitHub marca `mergeable=false`. Staging vs main = `ahead 17 / behind 28`, merge-base `3e91c8f65bef6ec3b6e0c48f889eda35f8017130`, main `66145a1ab53b78b3d03618fc2f3e919de685c19c`.
8. P06 — pytest + Hypothesis test-only.
9. P07 — Dagu + redun donor-only.
10. P08 — PyCasbin policy.

Antes de CADA nodo: componentes UI → frontend completo → agentes → router-universal-router-inteligente- → osquestador-auditor; después arquitectura ×4 + fuentes de verdad ×4. La arquitectura canónica enumera 4 documentos únicos aunque la orden actual diga 3: GAP fail-closed activo.
Observabilidad no gobierna workflow. Stabilize es el único workflow owner. Nunca force sobre main.
Siguiente gate P05: resolver conflictos de PR #6 preservando ambos historiales y únicamente deltas P05 autorizados; luego read-back + suite real 5/5 sobre historia reconciliada antes de VERIFIED_CLOSED.
