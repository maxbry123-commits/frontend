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
Código staging `f26b1c87c6e4f873fdade6e14959e882d4704142`; GitHub read-back PASS; injection/socket `3/3 PASS`.
Workflow `de6c819f53f74f71b193f331be605b92590008af`; run https://github.com/maxbry123-commits/frontend/actions/runs/34076616213 / job `101603870455` = SUCCESS; cinco tests reales, incluido bootstrap vendored Structlog/OpenTelemetry, `5/5 PASS` en 0.553s.

## Gate de reconciliación
P05 NO es `VERIFIED_CLOSED`. Compare fresco: main `66145a1ab53b78b3d03618fc2f3e919de685c19c`, merge-base `3e91c8f65bef6ec3b6e0c48f889eda35f8017130`, staging `ahead 17 / behind 28`. Draft PR #6 https://github.com/maxbry123-commits/frontend/pull/6 preserva ambos historiales sin force pero GitHub reporta `mergeable=false`; se registra `P05-FLAG-PR6-MERGE-CONFLICT`. No merge/rebase/force ciego. Resolver conflictos aplicando únicamente deltas P05 autorizados sobre historia fresca de main, preservar provenance/licencias y repetir read-back + suite real 5/5 antes de cierre.

## Fuentes de verdad
Arquitectura canónica enumera cuatro documentos únicos del Director aunque la orden actual diga tres. StrategyDelta fail-closed: revisar el superset de cuatro y mantener el GAP hasta reconciliación explícita.
