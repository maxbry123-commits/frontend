# RECOVERY PATCH — UIYAIWES-V3-POST124-GVISOR-0018

Contrato: `tel.workflow/v3`
Modo: `FAIL_CLOSED_LOOP`
Owner único: `stabilize_core`
Arquitectura canónica: `UI YAIWES/readme arquitectura UI YAIWES/ARQUITECTURA-PROGRAMACION-CONSOLIDADA-UI-YAIWES.md`

## Recovery obligatorio

1. Leer arquitectura consolidada.
2. Leer STATE/CHECKPOINT/PLAN/BITACORA.
3. Consultar HEAD real de `main`.
4. Ejecutar búsquedas: componentes UI → frontend completo → agentes → router → osquestador.
5. Aplicar cuatro pasadas de arquitectura y cuatro pasadas de cada fuente de verdad antes de programar.
6. Ejecutar solo el delta 1×1 seguro.
7. Persistir evidencia y StrategyDelta ante GAP.

## Estado recuperado Action 124

Run `34060401131`: `completed/cancelled`; job `101559786309`; adquisición cancelada; verify final destino `failure`; fail-closed `failure`.
URL: https://github.com/maxbry123-commits/frontend/actions/runs/34060401131

## Último delta 1×1

Entrada: `gVisor`.
- destino: `UI YAIWES/componentes open soure UI YAIWES/gVisor`
- tree: `fa6b9f1ca81285907f24d71ef100410ef48aac1f`
- source: `https://github.com/google/gvisor`
- commit: `0a1316b0d180600212bd607aa0ccfe2a9b09a899`
- licencia: conservada; LICENSE blob `f7a006d10464cfe9724b5d687c0013bf982cc66a`
- candidate roots: `pkg`, `runsc`, `sandboxexec`, `shim`
- clasificación: `MATERIALIZED_OK_DONOR_ONLY_UNMAPPED`
- integración: `NOT_WIRED`

StrategyDelta aplicado: no copiar ni montar repo/code-root al runtime. Conservar provenance. Metadata/CI/dev upstream queda fuera del hot path. La existencia de sandbox code no satisface por sí sola contract→adapter→registry→loader→guard→test→read-back.

## Nodo recuperado

`P01_POST_124_INVENTORY_REVALIDATION`.
P01 conserva baseline histórico 14/14, pero sigue STALE hasta completar toda la reconciliación post-cancelación. P05 permanece bloqueado.

## Próximo paso seguro

Avanzar al siguiente componente físico post-124 y repetir: manifest → SOURCE_URL/SOURCE_COMMIT → licencia → code-root/tree → classify → persist. Si un donor no tiene ruta universal verificable, marcarlo `DONOR_ONLY_UNMAPPED` y continuar sin copiarlo.

## Flags heredados

- `P01-FRESHNESS-STALE-POST-CANCELLED-124`
- `ACTION124-FINAL-DESTINATION-VERIFY-FAILED`
- `GVISOR-DONOR-ONLY-UNMAPPED-NOT-WIRED`
- P02A real Stabilize vendor execution.
- P02B Pydantic/core exact-version mismatch.
- P02C Rule Engine real-vendor execution.
- P03 Starlette version mismatch.
- P04 Bulkman/resilient-circuit real-vendor execution.

## Concurrencia

Refrescar HEAD antes de cada escritura. Si otro commit toca el mismo estado, reconciliar y preservar ambos historiales. Nunca force `main`.

## Cierre

`SOURCE+SHA → adapter/factory → activation → registry → mount_guard → loader → test/health → read-back → STATE/CHECKPOINT/RECOVERY/BITACORA → JUDGE`.
Sin ruta/diff/SHA/log/test/URL no hay `VERIFIED_CLOSED`.
