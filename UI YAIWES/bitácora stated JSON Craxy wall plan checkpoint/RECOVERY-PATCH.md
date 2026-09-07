# RECOVERY PATCH — UIYAIWES-P05-RECONCILE-0020

Contrato: `tel.workflow/v3` · modo: `FAIL_CLOSED_LOOP` · owner único: `stabilize_core`.
Nodo actual: `P05_STRUCTLOG_OPENTELEMETRY`; branch seguro: `ui-yaiwes-p05-observability-20260906`.

## Evidencia P05
- Cinco búsquedas obligatorias completadas en componentes UI, frontend, agentes, router-universal-router-inteligente- y osquestador-auditor; no apareció adapter canónico alternativo.
- Structlog: https://github.com/hynek/structlog @ `73393f34b40c15688b3fdd0982889b225f11b59b`; code-only tree `d64c15da142a3dae10dd1559661c53dd70a521e2`; MIT OR Apache-2.0.
- OpenTelemetry Python: https://github.com/open-telemetry/opentelemetry-python @ `96df63add12f6e0453b265ac34c5c07ec7b9267e`; API code-only tree `6b978f11923255b723f51a93168fa5c2d9752b4d`; Apache-2.0.
- Código P05 `f26b1c87c6e4f873fdade6e14959e882d4704142`; adapters/factories/activation/vendor/licenses/tests separados; read-back PASS; injection/socket `3/3 PASS`.
- Workflow `.github/workflows/ui-yaiwes-p05-observability-verify.yml` commit `de6c819f53f74f71b193f331be605b92590008af`; run https://github.com/maxbry123-commits/frontend/actions/runs/34076616213, job `101603870455`: `5/5 PASS` en 0.553s con bootstrap real vendored Structlog/OpenTelemetry.
- Reconciliación no-force iniciada mediante draft PR #6: https://github.com/maxbry123-commits/frontend/pull/6; GitHub reporta `mergeable=false`, head `20caf8542441f4d3e19acdd4045991226face2df`, base/main `66145a1ab53b78b3d03618fc2f3e919de685c19c`.
- Compare fresco: `diverged`, `ahead 17 / behind 28`; merge-base `3e91c8f65bef6ec3b6e0c48f889eda35f8017130`.

## Flags / StrategyDelta
1. Cerrados para P05: vendor-not-executed y DNS runner.
2. Activos: `P05-FLAG-MAIN-DIVERGED-17-AHEAD-28-BEHIND`, `P05-FLAG-PR6-MERGE-CONFLICT`, `P05-GAP-DIRECTOR-SOURCE-COUNT-3-VS-CANONICAL-4`.
3. StrategyDelta: no merge/rebase ciego y nunca force; resolver PR #6 seleccionando solo deltas P05 autorizados sobre historia fresca de main; preservar provenance/licencias; repetir read-back + 5/5 real vendor tests antes de cierre.

Rollback: cerrar PR #6 y abandonar staging; `main` queda intacto. Nunca force.
