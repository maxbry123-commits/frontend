# RECOVERY PATCH — UIYAIWES-V4-GUIDE-HANDOFF-0016

Contrato: `tel.workflow/v4`
Modo: `FAIL_CLOSED_EXECUTION_LOOP`
Owner único: `stabilize_core`
Guía maestra: `UI YAIWES/readme arquitectura UI YAIWES/GUIA-MAESTRA-EJECUCION-LOOP-SOL-UI-YAIWES.md`

## Cómo recuperar el proyecto

1. Leer la guía maestra.
2. Leer STATE.json.
3. Leer CHECKPOINT.json.
4. Leer PLAN-TAREAS.md.
5. Leer BITACORA-CRAZY-WALL.md.
6. Consultar HEAD real de `main`.
7. Consultar Actions/watchdogs concurrentes.
8. Identificar nodo CURRENT y flags heredados.
9. Ejecutar el delta 1×1 más pequeño.
10. Persistir evidencia.

## Estado recuperado

- P01: baseline inicial 14/14 fue VERIFIED_CLOSED, pero la evidencia de inventario quedó `STALE_BY_CONCURRENT_124_ACQUISITION`; revalidar después de la Action 124.
- P02A: `CLOSED_UNVERIFIED_WITH_FLAG`; Stabilize real-vendor execution pendiente.
- P02B: `CLOSED_UNVERIFIED_WITH_VERSION_FLAG`; Pydantic/core mismatch pendiente.
- P02C: `CLOSED_UNVERIFIED_WITH_EXECUTION_FLAG`; Rule Engine real-vendor execution pendiente.
- P03: `PARTIAL_VERIFIED`; HTTPX real local PASS, Starlette version flag.
- P04: `CLOSED_UNVERIFIED_WITH_EXECUTION_FLAGS`; Bulkman/resilient-circuit real vendors pendientes.
- P05: ACTIVE; observability/logging separado y read-only, trabajo avanzado debe reconciliarse con main antes de afirmar publicación.
- P06/P07/P08: trabajo preparado; no confundir preparación/staging con main o cierre.

## Action 124

Run: https://github.com/maxbry123-commits/frontend/actions/runs/34060401131
Job: `queue-124`
Última evidencia verificada: `in_progress`, step 4 procesando componentes secuencialmente; verify final pendiente.

Mientras esté activa:

- NO deduplicar destructivamente la raíz de componentes;
- NO afirmar 124/124 completados;
- NO borrar aliases por nombre solamente;
- sí continuar nodos runtime independientes si no pisan la raíz adquirida.

Cuando termine:

1. revisar conclusion;
2. leer job steps/logs;
3. verificar destino físico;
4. contar materializados;
5. verificar SOURCE_URL/SOURCE_COMMIT;
6. comparar aliases por commit + code-root/tree SHA;
7. deduplicar solo con evidencia;
8. actualizar inventory/code-map;
9. revalidar P01.

## Recovery por flags

### P02A
NO repetir: crear otro adapter/factory Stabilize.
Reusar: bloque existente.
StrategyDelta: ejecutar el mismo adapter contra vendor real en entorno compatible.

### P02B
NO repetir: forzar carga con versiones incompatibles.
StrategyDelta: proveer Pydantic/core exactos fijados y ejecutar gate real.

### P02C
NO repetir: duplicar Rule Engine adapter.
StrategyDelta: ejecutar vendor real con dependencias disponibles.

### P03 Starlette
NO repetir: silenciar mismatch.
StrategyDelta: runtime compatible con fuente fijada o nueva decisión explícita de versión.

### P04
NO repetir: asumir PASS por injection/read-back.
StrategyDelta: ejecutar Bulkman/resilient-circuit reales y verificar health/comportamiento.

### P05
NO repetir: fusionar Structlog + OTel en módulo único.
StrategyDelta: reconciliar main; mantener Structlog, OTel API y OTel SDK separados; observabilidad read-only.

### P06/P07
NO crear plugins de producción innecesarios.
StrategyDelta: cerrar mediante gates explícitos de rechazo production mount.

### P08
NO deduplicar PyCasbin mientras Action 124 esté activa.
StrategyDelta post-Action: comparar aliases por SOURCE_COMMIT + casbin code tree; preservar uno canónico y luego montar policy adapter.

## Anti-stall recovery

Si otro Sol realiza 5 lecturas/análisis consecutivos sin delta:

`STALL_DETECTED → resumir GAP en 1 frase → elegir delta mínimo seguro → ejecutar → verificar`.

No responder con otro plan general.

## Concurrencia

Si `main` avanza durante un delta:

1. refrescar HEAD;
2. inspeccionar commit concurrente;
3. adoptar código equivalente si cumple contrato;
4. reinyectar solo faltantes;
5. no force.

## Incidente operativo registrado

Se crearon accidentalmente archivos temporales de prueba `NOOP`/`TEMP` en `main` y fueron limpiados. Regla permanente: **nunca probar permisos/escritura creando archivos temporales en main**.

## Cierre

Un chat nuevo puede continuar únicamente con esta guía + Crazy Wall; no necesita reconstruir toda la conversación.

Rollback: historial GitHub; nunca force sobre `main`.
