# RECOVERY PATCH — UIYAIWES-V3-POST124-CANCELLED-0017

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

## Cambio crítico recuperado

La Action 124 `34060401131` ya no está activa.
- status: `completed`
- conclusion: `cancelled`
- job: `101559786309`
- step adquisición: `cancelled`
- verify final destination: `failure`
- fail-closed-until-124-verified: `failure`

URL: https://github.com/maxbry123-commits/frontend/actions/runs/34060401131

Por tanto queda invalidado cualquier estado que diga `in_progress` o que permita asumir 124/124 materializados.

## Nodo recuperado

`P01_POST_124_INVENTORY_REVALIDATION`.

P01 conserva únicamente un baseline histórico inicial 14/14; su inventario actual no puede llamarse fresco hasta terminar esta revalidación.
P05 queda preparado/bloqueado para publicación mientras se resuelve el inventario post-cancelación.

## StrategyDelta actual

NO repetir ni reiniciar ciegamente la descarga.
NO borrar aliases por nombre.
NO continuar P05 como si la Action hubiera finalizado correctamente.

Hacer:
1. enumerar destino físico;
2. cruzar con queue/manifiestos/checkpoints;
3. validar provenance URL/SHA/licencia;
4. clasificar materializados/parciales/ausentes;
5. deduplicar por source commit + code-root/tree;
6. actualizar inventario/code-map;
7. revalidar P01;
8. retomar P05 sin duplicar implementaciones.

## Flags heredados

- P02A real Stabilize vendor execution.
- P02B Pydantic/core exact-version mismatch.
- P02C Rule Engine real-vendor execution.
- P03 Starlette version mismatch.
- P04 Bulkman/resilient-circuit real-vendor execution.

## Concurrencia

Refrescar HEAD antes de cada escritura. Usar el SHA actual del archivo. Si otro commit toca el mismo estado, reconciliar y preservar ambos historiales. Nunca force `main`.

## Cierre

`SOURCE+SHA → adapter/factory → activation → registry → mount_guard → loader → test/health → read-back → STATE/CHECKPOINT/RECOVERY/BITACORA → JUDGE`.

Sin ruta/diff/SHA/log/test/URL no hay `VERIFIED_CLOSED`.
