# P05 — Structlog + OpenTelemetry Delta

Contrato `tel.workflow/v3`; `FAIL_CLOSED_LOOP`.

## Invariantes
- `stabilize_core` conserva en exclusiva `workflow.owner`.
- Structlog y OpenTelemetry son `PluginKind.OBSERVABILITY`: solo lectura/telemetría; no cambian canonical state, plan, policy ni decisiones.
- Montaje exclusivamente mediante `activation → registry → mount_guard → loader → factory`; no import arbitrario desde input.

## Provenance / código reutilizado
- Structlog: https://github.com/hynek/structlog @ `73393f34b40c15688b3fdd0982889b225f11b59b`; catálogo `5393fcee00ae1ed638601ed9915c78dd862988d5`; code-only `d64c15da142a3dae10dd1559661c53dd70a521e2`; MIT OR Apache-2.0.
- OpenTelemetry Python: https://github.com/open-telemetry/opentelemetry-python @ `96df63add12f6e0453b265ac34c5c07ec7b9267e`; catálogo `2a74339d862124f2637247862f53497448619d49`; API code-only `6b978f11923255b723f51a93168fa5c2d9752b4d`; Apache-2.0.

## Módulos
`structlog_adapter/{dependencies,factory,runtime}` y `opentelemetry_adapter/{dependencies,factory,runtime}`; vendor code-only bajo `runtime/vendor/`; licencias bajo `runtime/vendor/_licenses/`; tests en `runtime/tests/test_observability_adapters.py`.

## Gates
Commit staging: `f26b1c87c6e4f873fdade6e14959e882d4704142`; GitHub read-back PASS. Runtime tests todavía NO ejecutados y main está bajo adquisición concurrente, por tanto P05 = `STAGED_UNVERIFIED`, nunca VERIFIED_CLOSED.

## Fuentes de verdad
La arquitectura consolidada enumera cuatro documentos únicos del Director (MAX-SYSTEM, memoria Wordflow, Virtual Computer/14 objetivos, Command Center/chat). La orden actual dice tres; se aplica fail-closed y se revisa el conjunto de cuatro como superset sin descartar información.
