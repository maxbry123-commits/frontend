# PLAN 1×1 — Componentes → Plugins → Wordflow

1. P01 ✅ VERIFIED_CLOSED — inventario/provenance/dedup 14/14.
2. P02A 🚩 CLOSED_UNVERIFIED — Stabilize real-vendor execution pendiente.
3. P02B 🚩 CLOSED_UNVERIFIED — Pydantic/core mismatch pendiente.
4. P02C 🚩 CLOSED_UNVERIFIED — Rule Engine real-vendor execution pendiente.
5. P03 ⚠️ PARTIAL_VERIFIED — HTTPX PASS real local; Starlette version flag.
6. P04 🚩 CLOSED_UNVERIFIED — resilient-circuit + Bulkman; ejecución real pendiente.
7. P05 🔴 VENDOR_TESTS_VERIFIED_PR_CONFLICT_DRAFT_GATE — Structlog + OpenTelemetry read-only; GitHub Actions run `34076616213`, job `101603870455`, `5/5 PASS` en 0.553s. PR #6 https://github.com/maxbry123-commits/frontend/pull/6 sigue `draft=true` y ahora `mergeable=false`; compare fresco = `ahead 35 / behind 40`, merge-base `3e91c8f65bef6ec3b6e0c48f889eda35f8017130`, main `3f1c71da16abccc8a3bc62d1c848f5c3d9044162`, staging observado `fae3a13c07f0ac6cda7731bf5ee14e4898291a26`. Workflow endurecido en `fa2bd785a1690d18e51c7c45bfdf47a22f0a75c3` para verificar también main usando el SHA exacto.
8. P06 — pytest + Hypothesis test-only.
9. P07 — Dagu + redun donor-only.
10. P08 — PyCasbin policy.

Antes de CADA nodo: componentes UI → frontend completo → agentes → router-universal-router-inteligente- → osquestador-auditor; después arquitectura ×4 + fuentes de verdad ×4. La arquitectura canónica enumera 4 documentos únicos aunque la orden actual diga 3: GAP fail-closed activo.
Observabilidad no gobierna workflow. Stabilize es el único workflow owner. Nunca force sobre main.
Siguiente gate P05: resolver la divergencia/conflicto únicamente con deltas P05 autorizados y preservando ambos historiales; mientras PR #6 sea draft o `mergeable=false`, no fusionar. Tras reconciliación e integración autorizada exigir read-back + suite real 5/5 sobre main antes de VERIFIED_CLOSED.
