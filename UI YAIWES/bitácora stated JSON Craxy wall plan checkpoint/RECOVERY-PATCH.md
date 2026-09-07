# RECOVERY PATCH — UIYAIWES-P05-RECONCILE-0023

Contrato: `tel.workflow/v3` · modo: `FAIL_CLOSED_LOOP` · owner único: `stabilize_core`.
Nodo actual: `P05_STRUCTLOG_OPENTELEMETRY`; branch seguro: `ui-yaiwes-p05-observability-20260906`.

## Evidencia P05
- Cinco búsquedas obligatorias completadas/repetidas en componentes UI, frontend, agentes, router-universal-router-inteligente- y osquestador-auditor; no apareció adapter canónico alternativo.
- Structlog: https://github.com/hynek/structlog @ `73393f34b40c15688b3fdd0982889b225f11b59b`; code-only tree `d64c15da142a3dae10dd1559661c53dd70a521e2`; MIT OR Apache-2.0.
- OpenTelemetry Python: https://github.com/open-telemetry/opentelemetry-python @ `96df63add12f6e0453b265ac34c5c07ec7b9267e`; API code-only tree `6b978f11923255b723f51a93168fa5c2d9752b4d`; Apache-2.0.
- Código P05 `f26b1c87c6e4f873fdade6e14959e882d4704142`; adapters/factories/activation/vendor/licenses/tests separados; read-back PASS; injection/socket `3/3 PASS`.
- Workflow `.github/workflows/ui-yaiwes-p05-observability-verify.yml` commit base `de6c819f53f74f71b193f331be605b92590008af`; run https://github.com/maxbry123-commits/frontend/actions/runs/34076616213, job `101603870455`: `5/5 PASS` en 0.553s con bootstrap real vendored Structlog/OpenTelemetry.
- Hardening `fa2bd785a1690d18e51c7c45bfdf47a22f0a75c3`: workflow cubre staging+main y checkout del `github.sha` exacto.
- Arquitectura reconciliada en `aa0497ede19c57984053b4c3f95a83cb017eef6c`.
- PR #6: https://github.com/maxbry123-commits/frontend/pull/6; `draft=true`, `mergeable=false`; main observado `3f1c71da16abccc8a3bc62d1c848f5c3d9044162`.
- Compare fresco: `diverged`, `ahead 35 / behind 40`; staging observado antes de esta sincronización `fae3a13c07f0ac6cda7731bf5ee14e4898291a26`; merge-base `3e91c8f65bef6ec3b6e0c48f889eda35f8017130`.

## Flags / StrategyDelta
1. Cerrados para P05: vendor-not-executed y DNS runner.
2. Activos: `P05-FLAG-MAIN-DIVERGED-35-AHEAD-40-BEHIND`, `P05-FLAG-PR6-MERGE-CONFLICT`, `P05-FLAG-PR6-DRAFT-GATE`, `P05-GAP-DIRECTOR-SOURCE-COUNT-3-VS-CANONICAL-4`.
3. StrategyDelta: no merge/rebase ciego ni force; aislar únicamente deltas P05 autorizados frente al main actual, preservar ambos historiales y volver a evaluar mergeability. Solo después de integración autorizada repetir read-back + 5/5 real vendor tests sobre main antes de cierre.

Rollback: cerrar PR #6 y abandonar staging; `main` queda intacto. Nunca force.
