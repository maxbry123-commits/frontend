# P05 — Structlog + OpenTelemetry Delta

Contrato `tel.workflow/v3`; `FAIL_CLOSED_LOOP`.

## Invariantes
- `stabilize_core` conserva en exclusiva `workflow.owner`.
- Structlog y OpenTelemetry son `PluginKind.OBSERVABILITY`: solo telemetría; no cambian canonical state, plan, policy ni decisiones.
- Montaje por `activation → registry → mount_guard → loader → factory`; no import arbitrario desde input.

## Provenance / código reutilizado
- Structlog: https://github.com/hynek/structlog @ `73393f34b40c15688b3fdd0982889b225f11b59b`; catálogo `5393fcee00ae1ed638601ed9915c78dd862988d5`; code-only `d64c15da142a3dae10dd1559661c53dd70a521e2`; MIT OR Apache-2.0.
- OpenTelemetry Python: https://github.com/open-telemetry/opentelemetry-python @ `96df63add12f6e0453b265ac34c5c07ec7b9267e`; catálogo `2a74339d862124f2637247862f53497448619d49`; API code-only `6b978f11923255b723f51a93168fa5c2d9752b4d`; Apache-2.0.

## Módulos
`structlog_adapter/{dependencies,factory,runtime}` y `opentelemetry_adapter/{dependencies,factory,runtime}`; vendor code-only `runtime/vendor/`; licencias `runtime/vendor/_licenses/`; tests `runtime/tests/test_observability_adapters.py`.

## Gates verificados
Código staging `f26b1c87c6e4f873fdade6e14959e882d4704142`; GitHub read-back PASS; chequeo injection/socket `3/3 PASS`.
StrategyDelta repo-resident `de6c819f53f74f71b193f331be605b92590008af` creó verificación con sparse checkout runtime-only (`blob:none`, `lfs:false`). Run https://github.com/maxbry123-commits/frontend/actions/runs/34076616213 / job `101603870455` completó SUCCESS: cinco tests reales, incluidos bootstrap vendored Structlog y OpenTelemetry, `5/5 PASS` en 0.553s. El GAP DNS queda cerrado para P05.

## Gate restante
P05 sigue sin `VERIFIED_CLOSED` porque staging y main divergen. Main observado `66145a1ab53b78b3d03618fc2f3e919de685c19c`; merge-base `3e91c8f65bef6ec3b6e0c48f889eda35f8017130`; staging `ahead 11 / behind 28` antes de los commits documentales posteriores. No merge/rebase/force ejecutado. El siguiente paso es reconciliar ambos historiales sin force, integrar únicamente deltas P05 autorizados y repetir read-back + 5/5 tests sobre la historia reconciliada.

## Fuentes de verdad
Arquitectura canónica enumera cuatro documentos únicos del Director aunque la orden actual diga tres. StrategyDelta fail-closed: conservar/revisar los cuatro como superset y mantener el GAP hasta reconciliación explícita.
