# RECOVERY PATCH — UIYAIWES-P05-STAGING-0018

Contrato: `tel.workflow/v3` · modo: `FAIL_CLOSED_LOOP` · owner único: `stabilize_core`.
Nodo actual: `P05_STRUCTLOG_OPENTELEMETRY`; branch seguro: `ui-yaiwes-p05-observability-20260906`.

## Evidencia P05
- Cinco búsquedas obligatorias completadas; no se encontró adapter P05 canónico reutilizable fuera de los componentes fuente.
- Structlog: https://github.com/hynek/structlog @ `73393f34b40c15688b3fdd0982889b225f11b59b`; code-only tree `d64c15da142a3dae10dd1559661c53dd70a521e2`; licencia MIT OR Apache-2.0.
- OpenTelemetry Python: https://github.com/open-telemetry/opentelemetry-python @ `96df63add12f6e0453b265ac34c5c07ec7b9267e`; API code-only tree `6b978f11923255b723f51a93168fa5c2d9752b4d`; licencia Apache-2.0.
- Commit de código `f26b1c87c6e4f873fdade6e14959e882d4704142`: adapters separados, factories, activation keys, vendor code-only, licenses y tests definidos; GitHub read-back PASS.
- Injection/socket `3/3 PASS`, pero no equivale a ejecución real de vendors.
- Intento de test real bloqueado ANTES de ejecutar por entorno local: `git clone failed: Could not resolve host: github.com`.
- `main` observado `04ad9bc66ea4d71fac5a827937a9107aeae1f72c`; staging HEAD previo a este registro `189db9198409defb8ae1a7ad48882e6948d40847`; compare = `diverged`, staging `ahead 3 / behind 4`, merge-base `3e91c8f65bef6ec3b6e0c48f889eda35f8017130`.

## Flags / StrategyDelta
1. `P05-FLAG-REAL-VENDOR-TESTS-NOT-EXECUTED`: no convertir bloqueo de transporte en PASS/FAIL funcional.
2. `P05-FLAG-RUNNER-DNS-RESOLUTION`: StrategyDelta = ejecución residente en repo o checkout materializado mediante blobs/trees ya accesibles; no depender de clone DNS.
3. `P05-FLAG-MAIN-DIVERGED-3-AHEAD-4-BEHIND`: no fast-forward/rebase ciego; reconciliar preservando ambos historiales y comprobar conflictos dentro de `UI YAIWES/` antes de merge.
4. `P05-GAP-DIRECTOR-SOURCE-COUNT-3-VS-CANONICAL-4`: revisar el conjunto canónico de 4 como superset y mantener GAP hasta reconciliación documental.

Rollback: abandonar branch/commits de staging; `main` permanece intacto. Nunca force.
