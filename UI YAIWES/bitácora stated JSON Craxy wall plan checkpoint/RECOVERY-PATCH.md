# RECOVERY PATCH — UIYAIWES-P05-VERIFY-0019

Contrato: `tel.workflow/v3` · modo: `FAIL_CLOSED_LOOP` · owner único: `stabilize_core`.
Nodo actual: `P05_STRUCTLOG_OPENTELEMETRY`; branch seguro: `ui-yaiwes-p05-observability-20260906`.

## Evidencia P05
- Cinco búsquedas obligatorias completadas; no se encontró adapter P05 canónico reutilizable fuera de los componentes fuente.
- Structlog: https://github.com/hynek/structlog @ `73393f34b40c15688b3fdd0982889b225f11b59b`; code-only tree `d64c15da142a3dae10dd1559661c53dd70a521e2`; licencia MIT OR Apache-2.0.
- OpenTelemetry Python: https://github.com/open-telemetry/opentelemetry-python @ `96df63add12f6e0453b265ac34c5c07ec7b9267e`; API code-only tree `6b978f11923255b723f51a93168fa5c2d9752b4d`; licencia Apache-2.0.
- Código P05 `f26b1c87c6e4f873fdade6e14959e882d4704142`; adapters/factories/activation/vendor/licenses/tests separados; GitHub read-back PASS.
- Injection/socket `3/3 PASS`.
- StrategyDelta repo-resident: `.github/workflows/ui-yaiwes-p05-observability-verify.yml` commit `de6c819f53f74f71b193f331be605b92590008af`, `filter: blob:none`, sparse checkout runtime-only, `lfs:false`.
- Run https://github.com/maxbry123-commits/frontend/actions/runs/34076616213, job `101603870455`: `5/5 PASS` en 0.553s incluyendo bootstrap real vendored Structlog y OpenTelemetry.
- El bloqueo DNS anterior queda superado para P05; no se considera defecto funcional.
- Main observado `66145a1ab53b78b3d03618fc2f3e919de685c19c`; staging vs main = `diverged`, `ahead 11 / behind 28`, merge-base `3e91c8f65bef6ec3b6e0c48f889eda35f8017130`.

## Flags / StrategyDelta
1. Cerrados para P05: `P05-FLAG-REAL-VENDOR-TESTS-NOT-EXECUTED` y `P05-FLAG-RUNNER-DNS-RESOLUTION`.
2. Activo: `P05-FLAG-MAIN-DIVERGED-11-AHEAD-28-BEHIND`; no fast-forward/rebase ciego, no force.
3. Activo: `P05-GAP-DIRECTOR-SOURCE-COUNT-3-VS-CANONICAL-4`.
4. StrategyDelta siguiente: reconciliar histories preservando main + staging; limitar integración a deltas P05 autorizados; ejecutar read-back y suite real 5/5 nuevamente sobre historia reconciliada.

Rollback: abandonar branch/commits de staging; `main` permanece intacto. Nunca force.
