# HANDOFF MULTI-AI YAIWES — 3 PASOS ESTRICTOS

Fecha: 2026-09-10
Repo frontend: `maxbry123-commits/frontend`
Repo backend/agentes: `maxbry123-commits/agentes`
Modo: MULTI_AI_CHECKPOINT / FAIL_CLOSED
Objetivo: avanzar rápido sin sobreingeniería, sin pisarse entre IA y sin perder versiones anteriores.

## 0. PRIMERA REGLA — OBLIGATORIA ANTES DE TOCAR CÓDIGO

Cada sesión de ASTRA, CLAUDE, GROK o SOL debe leer primero el estado fresco y el checkpoint antes de reclamar trabajo.

Frontend Crazy Wall / estado:
- `UI YAIWES/bitácora stated JSON Craxy wall plan checkpoint/STATE.json`
- `UI YAIWES/bitácora stated JSON Craxy wall plan checkpoint/CHECKPOINT.json`
- `UI YAIWES/bitácora stated JSON Craxy wall plan checkpoint/BITACORA-CRAZY-WALL.md`

Backend/agentes Crazy Wall:
- `📂 Bitácora stated JSON Craxy wall.json`

Regla de exclusión:
1. Leer estado fresco desde `main`.
2. Si un nodo tiene owner/lock de otra IA: NO TOCARLO.
3. Reclamar solo un nodo libre y escribir owner + checkpoint.before.
4. Hacer únicamente el paso actual del nodo.
5. Guardar evidencia mínima: commit/ruta/test/read-back.
6. Escribir checkpoint.after y liberar el nodo o dejar GAP concreto.
7. Nunca sobrescribir trabajo de otra IA; si hay conflicto, saltar a otro nodo libre.

## 1. CONTRATO ÚNICO DE INTEGRACIÓN — SOLO 3 PASOS

Todo componente, mejora o módulo entra por exactamente estos tres pasos. No existe Paso 4.

### PASO 1 — ANALIZAR A/B/C Y DECIDIR DESTINO

Objetivo único: entender la función real y elegir destino canónico.

- A = agente/subagente/autonomía/lifecycle propio.
- B = workflow/DAG/scheduler/queue/worker/runtime/orquestación.
- C = capacidad modular: UI, memoria, storage, policy, schema, sandbox, router, tool, editor, visualización, investigación, etc.

Salida mínima obligatoria:
`component -> A|B|C -> destino exacto -> motivo de una línea`

PROHIBIDO en Paso 1:
- diseñar arquitectura nueva;
- refactor global;
- escribir adapters;
- crear motores;
- hacer benchmarks;
- abrir nuevas fases.

### PASO 2 — MOVER CON MOTOR CANÓNICO

Objetivo único: mover/copiar/adquirir el código al destino decidido.

Frontend: usar exclusivamente la raíz canónica documentada en:
`UI YAIWES/readme arquitectura UI YAIWES/HANDOFF-WATCHDOG-MOTORES-CANONICOS-2026-09-10.md`

Motores autorizados: extract/download/copy/move allí enumerados. No LFS. No force. No downloader alternativo. No reimplementar motores.

Salida mínima obligatoria:
`source -> motor -> target -> SHA/read-back`

Si el componente ya está físicamente en destino correcto: NO repetir el MOVE; marcar Paso 2 satisfecho con read-back.

### PASO 3 — CABLEAR + PODA MÍNIMA SI HACE FALTA + MICROTEST

Objetivo único: conectar la capacidad real y demostrar un comportamiento mínimo.

Reglas:
- REUSE > PATCH > ADAPT > GENERATE.
- Preservar upstream siempre que sea posible.
- Podar SOLO si un archivo/duplicado bloquea o sobra de forma demostrable.
- Backend: bloques separados, nunca monolito; usar el Enchufe Universal/FABLES donde aplique.
- Frontend: integrar mediante módulo/adaptador/slot sin destruir ventanas existentes.
- Microtest: la prueba funcional más pequeña que demuestre que la capacidad real responde.
- Si falla: localizar causa -> edición quirúrgica/poda mínima -> repetir microtest.
- PASS solo con evidencia real.

PROHIBIDO:
- source_probe o “carpeta existe” como único PASS;
- refactor general;
- reescritura completa sin GAP demostrado;
- crear nuevas capas por gusto;
- documentación que retrase un nodo ejecutable;
- Paso 4.

## 2. OBJETIVO DE UI — MULTI-WORK / MULTI-TAREA / MULTI-AGENTE

La UI YAIWES no debe convertirse en decenas de aplicaciones pegadas. Los componentes OSS se fusionan por capacidades detrás de una superficie única de trabajo.

Cada componente frontend puede integrarse de dos maneras:
1. `FABRICA_UI`: capacidad para construir/diseñar/generar ventanas, paneles, layouts, flujos o componentes.
2. `VENTANA_RUNTIME`: capacidad visible/operativa dentro de una ventana o panel del workspace.

Un mismo componente puede tener ambos modos si existe una razón funcional concreta, pero comparte un solo adapter/contract de capacidad.

Meta funcional: un workspace tipo PC dentro de la UI con múltiples trabajos simultáneos, múltiples workflows, múltiples agentes, paneles acoplables, edición/diseño, terminal/código, archivos, visualización, chat y progreso, sin duplicar runtimes.

La raíz física ya observada es:
`UI YAIWES/componentes open soure UI YAIWES/`

Ejemplos físicamente observados allí incluyen Apache PyCasbin, Apache Tika, Apprise, Bulkman, Chart.js, CodeMirror 6, Cosign, Dagu, Debezium, Docling, Excalidraw y FastEmbed, entre otros. No asumir integración por presencia: cada uno debe entrar por los 3 pasos.

## 3. CARRIL ESPECIAL ASTRA + CLAUDE

ASTRA y CLAUDE pueden generar/reclamar nodos dentro de cinco frentes, pero cada nodo sigue el contrato de 3 pasos.

### A1 — Frontend
Revisar UI existente y componentes OSS. Mejorar/integrar sin sustituir ventanas actuales. Toda mejora nueva se publica como versión adicional (`v+1`) o módulo nuevo; la versión anterior permanece recuperable.

### A2 — Apoyo backend a SOL
Ayudar a integrar componentes y escribir únicamente el código faltante necesario: contracts/adapters/ports/plugins/tests pequeños. Backend modular, bloques separados y enchufables; no monolito y no refactor general sin GAP.

### A3 — Reuse OSS primero
Antes de escribir una capacidad significativa desde cero, buscar si ya existe un componente OSS adecuado. Para adquisición usar solo motores canónicos. Registrar URL/revisión/licencia/destino. La investigación no debe bloquear un nodo si ya existe una opción suficiente.

### A4 — Aceleración + evaluación
Crear tooling o integrar APIs SOLO cuando reduzca trabajo real y no duplique motores existentes. Revisar el trabajo previo de Grok/Sol y proponer una mejora quirúrgica versionada cuando exista evidencia de fricción, fallo o duplicación.

### A5 — Mejora versionada/fricción cero
No romper versiones anteriores. Nueva mejora = copia/version/module delta recuperable. Evaluar frontend y backend buscando menos fricción, pero solo ejecutar cambios vinculados a un nodo y un microtest. No se autoriza “mejorar 100x” sin medición; sí se autoriza mejorar iterativamente preservando rollback.

División recomendada:
- ASTRA: arquitectura funcional, integración UI/workspace, evaluación, selección OSS, compatibilidad.
- CLAUDE: code review, contracts, adapters/ports, typing, tests y reparaciones quirúrgicas.

## 4. CARRIL GROK + SOL

GROK y SOL usan exclusivamente el contrato común de 3 pasos.

- GROK: puede reclamar componentes/nodos libres, especialmente análisis A/B/C, destinos, OSS y luego completar MOVE + cableado/microtest del mismo nodo si sigue libre.
- SOL: puede reclamar cualquier nodo libre de backend/frontend; prioridad a integración física, FABLES/adapters y cierre de microtests.
- Ninguno toca nodos `CLAIMED` por otra IA.
- Ninguno reabre un PASS sin un GAP nuevo verificable.

## 5. CHECKPOINT MÍNIMO POR NODO

```json
{
  "node_id": "...",
  "component": "...",
  "owner": "ASTRA|CLAUDE|GROK|SOL",
  "lock": "FREE|CLAIMED",
  "step": 1,
  "classification": "A|B|C|null",
  "target": null,
  "checkpoint_before": null,
  "checkpoint_after": null,
  "evidence": [],
  "status": "PENDING|PASS|GAP",
  "next_action": null
}
```

Una IA que no pueda cerrar el nodo debe dejar `GAP` + causa concreta + evidencia + `next_action`, liberar el lock si otra IA puede continuar, y pasar a otro nodo independiente.

## 6. FUENTES/HANDOFF CANÓNICOS

Frontend arquitectura:
https://github.com/maxbry123-commits/frontend/blob/main/UI%20YAIWES/Readme%20arquitectura%20UI%20YAIWES.md

Frontend Handoff Maestro V5:
https://github.com/maxbry123-commits/frontend/blob/main/UI%20YAIWES/readme%20arquitectura%20UI%20YAIWES/HANDOFF-MAESTRO-OPERATIVO-UI-YAIWES-V5.md

Handoff motores canónicos frontend:
https://github.com/maxbry123-commits/frontend/blob/main/UI%20YAIWES/readme%20arquitectura%20UI%20YAIWES/HANDOFF-WATCHDOG-MOTORES-CANONICOS-2026-09-10.md

Documentos de proyecto/workflow UI usados para perfilar el objetivo:
https://github.com/maxbry123-commits/frontend/tree/56a7e066722b2391b25e3f1a04ec1235489817ad/UI%20YAIWES/%E2%9E%A1%EF%B8%8F%F0%9F%93%82%20Wordflow%20LOOP%20UI%20YAIWES/documentos%20proyectos%20UI%20YAIWES

Backend/agentes Handoff integración:
https://github.com/maxbry123-commits/agentes/blob/main/Readme%20arquitectura%20Yaiwes/HANDOFF-INTEGRACION-1-20.md

Backend/agentes parche recuperación:
https://github.com/maxbry123-commits/agentes/blob/main/PARCHE-RECUPERACION-CORE-INTEGRACION-WATCHDOG.md

## 7. REGLA DE AUTORIDAD

TODO trabajo no directamente trazable a PASO 1, PASO 2 o PASO 3 de un nodo concreto está NO AUTORIZADO.

Excepciones permitidas únicamente como soporte directo del mismo nodo: leer Crazy Wall/checkpoint, investigación OSS breve, evidencia/read-back y reparación quirúrgica tras un fallo.

Secuencia final:
`READ CRAZY WALL -> CLAIM NODE -> PASO 1 -> CHECKPOINT -> PASO 2 -> CHECKPOINT -> PASO 3 -> MICROTEST -> PASS/GAP -> RELEASE -> NEXT FREE NODE`
