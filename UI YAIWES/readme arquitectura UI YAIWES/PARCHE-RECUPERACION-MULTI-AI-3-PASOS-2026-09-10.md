# PARCHE DE RECUPERACIÓN — MULTI-AI YAIWES 3 PASOS

Fecha: 2026-09-10
Estado: ENTRYPOINT OPERATIVO
Objetivo: permitir que ASTRA, CLAUDE, GROK o cualquier sesión SOL reanuden sin repetir trabajo ni pisarse.

## 1. ENTRADA OBLIGATORIA

Antes de ejecutar cualquier cambio, leer desde `main` en este orden:

1. Handoff multi-IA 3 pasos:
https://github.com/maxbry123-commits/frontend/blob/main/UI%20YAIWES/readme%20arquitectura%20UI%20YAIWES/HANDOFF-MULTI-AI-3-PASOS-ASTRA-CLAUDE-GROK-SOL-2026-09-10.md

2. STATE frontend:
https://github.com/maxbry123-commits/frontend/blob/main/UI%20YAIWES/bit%C3%A1cora%20stated%20JSON%20Craxy%20wall%20plan%20checkpoint/STATE.json

3. CHECKPOINT frontend:
https://github.com/maxbry123-commits/frontend/blob/main/UI%20YAIWES/bit%C3%A1cora%20stated%20JSON%20Craxy%20wall%20plan%20checkpoint/CHECKPOINT.json

4. Crazy Wall frontend:
https://github.com/maxbry123-commits/frontend/blob/main/UI%20YAIWES/bit%C3%A1cora%20stated%20JSON%20Craxy%20wall%20plan%20checkpoint/BITACORA-CRAZY-WALL.md

5. Handoff motores canónicos frontend:
https://github.com/maxbry123-commits/frontend/blob/main/UI%20YAIWES/readme%20arquitectura%20UI%20YAIWES/HANDOFF-WATCHDOG-MOTORES-CANONICOS-2026-09-10.md

6. Handoff Maestro frontend:
https://github.com/maxbry123-commits/frontend/blob/main/UI%20YAIWES/readme%20arquitectura%20UI%20YAIWES/HANDOFF-MAESTRO-OPERATIVO-UI-YAIWES-V5.md

7. Documentos de proyecto/workflow UI:
https://github.com/maxbry123-commits/frontend/tree/56a7e066722b2391b25e3f1a04ec1235489817ad/UI%20YAIWES/%E2%9E%A1%EF%B8%8F%F0%9F%93%82%20Wordflow%20LOOP%20UI%20YAIWES/documentos%20proyectos%20UI%20YAIWES

8. Backend/agentes Handoff integración:
https://github.com/maxbry123-commits/agentes/blob/main/Readme%20arquitectura%20Yaiwes/HANDOFF-INTEGRACION-1-20.md

9. Backend/agentes Crazy Wall:
https://github.com/maxbry123-commits/agentes/blob/main/%F0%9F%93%82%20Bit%C3%A1cora%20stated%20JSON%20Craxy%20wall.json

10. Backend/agentes parche anterior:
https://github.com/maxbry123-commits/agentes/blob/main/PARCHE-RECUPERACION-CORE-INTEGRACION-WATCHDOG.md

## 2. REANUDACIÓN SIN COLISIONES

1. Leer `STATE/CHECKPOINT/Crazy Wall` FRESCOS, nunca confiar solo en un prompt viejo.
2. Identificar nodos `CLAIMED` por otras IA y no tocarlos.
3. Elegir un único nodo libre.
4. Registrar `owner`, `lock=CLAIMED`, `checkpoint_before`.
5. Ejecutar solo el paso actual.
6. Persistir evidencia real y `checkpoint_after`.
7. Si PASS: liberar y siguiente nodo libre.
8. Si GAP: causa exacta + evidencia + siguiente acción; reparar solo lo mínimo dentro del mismo paso o liberar para otra IA.

## 3. CONTRATO AUTORIZADO — NO EXISTE PASO 4

PASO 1: analizar función real -> A/B/C -> destino exacto.
PASO 2: mover/adquirir con motor canónico -> SHA/read-back.
PASO 3: cablear -> podar solo si hace falta -> microtest real -> PASS/GAP.

Todo trabajo que no sea soporte directo de uno de esos tres pasos está NO AUTORIZADO.

NO AUTORIZADO:
- arquitecturas paralelas nuevas;
- refactor global;
- motores alternativos de download/extract/copy/move;
- LFS/force;
- benchmarks sin necesidad del nodo;
- documentación extensa que sustituya ejecución;
- reabrir nodos PASS sin GAP nuevo;
- monolitos backend;
- destruir versiones anteriores;
- PASS por presencia de carpeta/import/source_probe únicamente.

## 4. VERSIONADO / ROLLBACK

Toda mejora de UI o backend debe conservar la versión anterior. Preferencia:
`REUSE -> PATCH -> ADAPT -> GENERATE`.

Si se necesita cambiar una ventana, adapter, módulo o integración ya funcional:
- mantener versión existente;
- crear `v+1` o delta modular nuevo;
- cablear nueva versión detrás de adapter/plugin/slot;
- microtest;
- solo promover si PASS.

## 5. ASTRA + CLAUDE

Pueden trabajar en cinco frentes, siempre como nodos sometidos a los 3 pasos:
A1 frontend/workspace multi-tarea y fábrica UI;
A2 apoyo al backend de SOL con código modular faltante;
A3 reuse/investigación OSS + adquisición por motores canónicos;
A4 aceleración/evaluación de trabajo previo, solo con GAP/fricción demostrada;
A5 mejora versionada y rollback, manteniendo ventanas/versiones anteriores.

ASTRA prioriza arquitectura funcional, selección de componentes y experiencia/workspace.
CLAUDE prioriza contracts/adapters/ports/typing/tests y code review quirúrgico.

## 6. GROK + SOL

Usan el mismo contrato 3 pasos y Crazy Wall.
GROK: análisis A/B/C, investigación OSS y cierre de nodos libres.
SOL: integración/cableado/FABLES/microtests y nodos libres de frontend/backend.
Si una IA reclama un nodo, las otras lo saltan.

## 7. OBJETIVO FRONTEND

Raíz de componentes observada:
https://github.com/maxbry123-commits/frontend/tree/main/UI%20YAIWES/componentes%20open%20soure%20UI%20YAIWES

No convertir cada OSS en una app aparte. Fusionar capacidades detrás de un workspace YAIWES único.

Dos modos de incorporación permitidos:
- `FABRICA_UI`: herramienta/capacidad para construir/diseñar UI, layouts, workflows y ventanas.
- `VENTANA_RUNTIME`: capacidad visible operativa dentro del workspace.

Objetivo: workspace multi-tarea/multi-workflow/multi-agente tipo PC dentro de UI YAIWES, con chat como sistema de workflow y con módulos intercambiables, no runtimes duplicados.

## 8. ESTADO OBSERVADO AL CREAR ESTE PARCHE

El `STATE.json` frontend leído antes de crear el parche reporta `component_integration_01_20.step=3`, `passed=17`, `pending_source=3`. Esto es estado observado, no cierre nuevo.

El mismo STATE conserva un nodo forense activo (`P01_POST124_C1_INDEPENDENT_AUDIT`), por lo cual este parche NO reemplaza ese flujo ni autoriza a pisarlo. Los nuevos trabajos deben convivir mediante locks/checkpoints.

## 9. INSTRUCCIÓN DE ARRANQUE

`READ CRAZY WALL -> READ CHECKPOINT -> IDENTIFY OWNER/LOCK -> CLAIM ONE FREE NODE -> PASO 1 -> CHECKPOINT -> PASO 2 -> CHECKPOINT -> PASO 3 -> MICROTEST -> EVIDENCE -> PASS/GAP -> RELEASE -> NEXT FREE NODE`

Si no existe nodo libre seguro: no inventar uno sobre trabajo ajeno; crear únicamente un nodo nuevo para una tarea nueva claramente separable y registrar su alcance antes de tocar código.
