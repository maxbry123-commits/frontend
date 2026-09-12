# DIRECTOR — PYTHON DSL/DAG 96/4 — CODE EXECUTION

Contrato: `tel.workflow/v3`
Modo: `FAIL_CLOSED_LOOP`
Arquitectura: `ARQUITECTURA-WORDFLOW-PYTHON-DSL-DAG-96-4-V7-2026-09-12.md`
Crazy Wall: `CRAZY-WALL-WORDFLOW-XRAY-V4-2026-09-12.json`

## Orden

El Wordflow/Orquestador autoritativo se implementa como Python ejecutable. No crear JSON/YAML como lógica del DAG. Stabilize CORE sigue siendo el único workflow owner. El target es determinista >=96%; LLM <=4% y sólo para ambiguity resolution, semantic ranking y bounded summary en P09/P10/P19.

## Nodo = tarea

Cada entorno reclama un único nodo FREE y escribe sólo en su `write_scope`:
- SOL_GPT1: `WF-G08-MEMORY` primero; luego P09/P10/storage.
- SOL_GPT2: `WF-G11-SANDBOX-UEK` primero; luego P12/P16/observability.
- SOL_GPT3: `WF-G20-GLOBAL-INTEGRATION` primero; luego P17/P22.
- ASTRA_GPT: `WF-G14-AUDITOR5` primero; luego P15/P21; P19 sólo research hasta owner explícito.
- SOL_ORQUESTADOR: `WF-G18-RECOVERY` + `WF-G12-GLOBAL-COVERAGE`, shared consolidation/final judge.

Máximo 3 pasos por nodo:
1. `VERIFY_OR_RESEARCH`: source requirement + fresh code/readback + dedup.
2. `EXECUTE_AUTHORIZED_DELTA`: Python mínimo; REUSE>PATCH>ADAPT>GENERATE>NEW_DOWNLOAD.
3. `TEST_AND_REPORT`: tests reales + SHA/run/job/log + PASS/GAP + next node.

## Código faltante prioritario

1. P08 Memory Contract + canonical write gate.
2. P09 Retrieval Contract.
3. P10 Context Fabric.
4. P11 Sandbox/UEK capability lifecycle.
5. P12 Worker boundary YAIWES sobre Stabilize.
6. P14/P21 deterministic five-pass audit/coverage.
7. P15 Consolidator task→phase→project.
8. P16 Resource/Capability Router.
9. P17 Continuous multi-stage loop E2E.
10. P18 Workspace/global recovery and reconstruction.
11. P19 Resource Brain only after research/dedup.
12. P20 Global Integration/Fables E2E.
13. P22 Python API/control surface.
14. P23 UI remains downstream until runtime verified.

## Anti-colisión

Antes de escribir: HEAD fresco + claim con owner/node/base_sha/write_scope/claimed_at. No tocar scope de otro owner. Shared files sólo Orquestador. GAP local no frena otros nodos.

## Cierre

`SOURCE_PRESENT != IMPLEMENTED != WIRED != RUNTIME_TEST_PASS != VERIFIED_CLOSED`.
No cerrar proyecto hasta G12 bidireccional 100% y Final Judge E2E.
