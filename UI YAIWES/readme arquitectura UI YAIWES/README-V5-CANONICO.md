# README V5 CANÓNICO — ARQUITECTURA UI YAIWES

Esta carpeta conserva arquitectura histórica y deltas. Desde esta revisión, el orden de lectura operativo es:

1. `CONTRATO-MAESTRO-FORENSE-XRAY-50-GOALS-UI-YAIWES.md` — contrato operativo X-Ray, DAG, roles, GAPs, councils, refutaciones y cierre.
2. `CROSSCHECK-FUENTES-VERDAD-XRAY-UI-YAIWES.md` — auditoría cruzada de fuentes y estado físico.
3. `GUIA-MAESTRA-EJECUCION-LOOP-SOL-UI-YAIWES.md` — guía histórica detallada de método/anti-stall; válida salvo contradicción con evidencia/contrato vigente.
4. `ARQUITECTURA-PROGRAMACION-CONSOLIDADA-UI-YAIWES.md` — arquitectura funcional consolidada derivada de MAX-SYSTEM, Memory, Virtual Computer y Command Center.
5. `README.md` — catálogo OSS auditado y 12 goals/council históricos.
6. Deltas `P01-*`, `P02*`, `P03*`, `P04*` — evidencia localizada por nodo.

## Regla de versión

- **runtime contract vigente:** `tel.workflow/v3`;
- **guide revision:** `v5`;
- no se cambia el runtime contract solo por editar documentación;
- v4/v3 anteriores permanecen como historia y se resuelven por esta regla: `estado real > STATE/CHECKPOINT > contrato vigente > guía histórica`.

## Arquitectura global

`INPUT → Sheriff → Source Authority → Questions → Goals → Requirements → Integration Plan → Task DAG/Funnel → Context Fabric → Policy/Router → Sandbox/Worker → Validator/Auditor/Verifier → Judge → StateDelta → Consolidator → Memory/Checkpoint → Coverage → Next/Close`.

## Capas del producto

1. Command Center web: React/Vite y funciones de chat/work/tasks/artifacts.
2. Native/Virtual Computer: Flutter + Window Manager + Rust Core + platform backends.
3. Contract/Policy: Pydantic/Rule Engine/PyCasbin.
4. Workflow: Stabilize único owner.
5. Execution: pools/queues/sandbox workers subordinados al workflow.
6. Memory/Audit: L0-L4, retrieval, evidence graph, context fabric, auditor.
7. Observability: logs/traces/metrics read-only.
8. Persistence/Recovery: STATE/events/checkpoints/snapshots.
9. Judge/Coverage: cierre por evidencia, no por opinión del modelo.

## Cierre

Ningún documento por sí solo prueba implementación. El estado ejecutable vive en Crazy Wall `STATE/CHECKPOINT/PLAN/RECOVERY/BITACORA`, y el cierre final exige evidencia E2E + reconstruction + coverage + Judge.
