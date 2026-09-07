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

## Gates
Código staging `f26b1c87c6e4f873fdade6e14959e882d4704142`; GitHub read-back PASS; chequeo injection/socket `3/3 PASS`. El intento de ejecución real fue bloqueado antes de correr tests por DNS del entorno (`Could not resolve host: github.com`), por lo que no constituye PASS ni FAIL funcional. Compare contra main observado `04ad9bc66ea4d71fac5a827937a9107aeae1f72c` mostró divergencia desde merge-base `3e91c8f65bef6ec3b6e0c48f889eda35f8017130` (`ahead 3 / behind 4` antes de los commits de evidencia de este watchdog). Bajo FAIL_CLOSED no se rebasea/mergea/forcea hasta ejecutar vendor real y reconciliar ambos historiales. P05 sigue `STAGED_UNVERIFIED`.

## StrategyDelta activo
Usar ejecución residente en repositorio o checkout materializado desde blobs/trees accesibles, evitando dependencia del DNS local. Después repetir tests reales, comparar HEADs de nuevo y reconciliar main↔staging preservando ambos historiales antes del read-back final.

## Fuentes de verdad
Arquitectura canónica enumera cuatro documentos únicos del Director aunque la orden actual diga tres. StrategyDelta fail-closed: conservar/revisar los cuatro como superset y mantener el GAP hasta reconciliación explícita.
