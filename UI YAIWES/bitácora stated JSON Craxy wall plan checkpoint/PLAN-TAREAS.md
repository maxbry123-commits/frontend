# PLAN 1×1 — Componentes → Plugins → Wordflow

1. P01 ⚠️ STALE_BY_CONCURRENT_ACQUISITION — el inventario canónico era 14/14, pero la Action 124 está añadiendo nuevas carpetas/aliases; no hacer dedup destructivo hasta que termine.
2. P02A 🚩 CLOSED_UNVERIFIED — Stabilize real-vendor execution pendiente.
3. P02B 🚩 CLOSED_UNVERIFIED — Pydantic/core mismatch pendiente.
4. P02C 🚩 CLOSED_UNVERIFIED — Rule Engine real-vendor execution pendiente.
5. P03 ⚠️ PARTIAL_VERIFIED — HTTPX PASS real local; Starlette version flag; adapters presentes en main.
6. P04 🚩 CLOSED_UNVERIFIED — resilient-circuit 0.7.0 + Bulkman 2.0.3 adapters/vendor presentes en main; ejecución real de vendors pendiente.
7. P05 🚩 STAGED_CLOSED_UNVERIFIED — Structlog + OpenTelemetry API publicados en `yaiwes-runtime-staging-20260906`; OTel SDK vive en adapter separado y NO está allowlisted. Loader/catalog/guard: PASS local determinista.
8. P06 ✅ STAGED_GATE_PASS — pytest + Hypothesis permanecen TEST_ONLY y MountGuard rechaza montaje production.
9. P07 ✅ STAGED_GATE_PASS — Dagu + redun permanecen DONOR_ONLY y MountGuard rechaza montaje production.
10. P08 🚩 STAGED_CLOSED_UNVERIFIED — PyCasbin 2.6.1 adapter + code-only vendor publicados en staging; dependencias reales `simpleeval`/`wcmatch` aún no probadas en runtime.
11. RECONCILE — esperar a que finalice `https://github.com/maxbry123-commits/frontend/actions/runs/34060401131`; luego comparar final `main` ↔ staging y aplicar solo delta no duplicado, sin force.
12. VERIFY_FINAL — ejecutar vendors reales, repetir checks dependientes hasta detectar flakiness, actualizar arquitectura/STATE/CHECKPOINT y cerrar solo con evidencia.

Antes de cada nodo: componentes UI → frontend completo → agentes → router-universal-router-inteligente- → osquestador-auditor; después arquitectura ×4 + fuentes de verdad ×4.
Flags permanecen con evidence/recovery; nunca PASS falso. Observabilidad no gobierna workflow. Stabilize es el único workflow owner.
