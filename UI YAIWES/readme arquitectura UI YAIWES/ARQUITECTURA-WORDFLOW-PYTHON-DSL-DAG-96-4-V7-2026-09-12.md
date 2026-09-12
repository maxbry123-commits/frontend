# ARQUITECTURA WORDFLOW UI YAIWES — PYTHON DSL/DAG 96/4 — V7

Fecha: 2026-09-12
Contrato: `tel.workflow/v3`
Modo: `FAIL_CLOSED_LOOP`
Owner workflow: `stabilize_core`
Definición ejecutable: `UI YAIWES/➡️📂 Wordflow LOOP UI YAIWES/wordflow_loop/wordflow_loop/architecture_dsl.py`
Gate LLM: `.../wordflow_loop/llm_gate.py`

## Regla de arquitectura

El orquestador se expresa en Python ejecutable. JSON/YAML quedan únicamente como formatos externos de estado/configuración histórica cuando ya existen; no son la definición autoritativa del DAG.

`DETERMINISTIC_RATIO = 0.96`
`LLM_RATIO = 0.04`

LLM sólo puede intervenir en ambigüedad/semantic ranking/resumen acotado; runtime, estado, política, auditoría, recovery y cierre son deterministas.

## Microflujo transversal

`INPUT → CONTRACT → POLICY → CONTEXT → ROUTE → SANDBOX/WORKER → OUTPUT_SCHEMA → AUDIT → STATE_DELTA → CONSOLIDATE → MEMORY → CHECKPOINT → COVERAGE → NEXT/REPAIR → FINAL_JUDGE`

## X-Ray procesos P01–P23

| ID | Proceso | Estado código | Evidencia / GAP |
|---|---|---|---|
| P01 | CORE_STATE_MODEL | ✅ base | `contracts.py`: Status/Evidence/NodeContract/LayerResult |
| P02 | EVENT_MODEL | 🟡 parcial | ledger persiste eventos dict; falta modelo tipado de eventos de dominio |
| P03 | TASK_MODEL | 🟡 parcial | NodeContract cubre nodo/tarea mínima; falta Task/Requirement domain model global |
| P04 | TASK_CONTRACT | ✅ | `NodeContract` + hash literal + allowed/forbidden/mutation/auth |
| P05 | STATE_MACHINE | ✅ base | `LayerRunner` + status fail-closed + dependencia/replay |
| P06 | CHECKPOINT_ENGINE | 🟡 parcial | ledger durable/replay/fsync PASS; checkpoint de proyecto/workspace global incompleto |
| P07 | POLICY_ENGINE | ✅ sublane | governance + rule-engine + OPA/OpenFGA live policy lane |
| P08 | MEMORY_CONTRACT | ❌ GAP | Memory/Audit runtime completo no materializado |
| P09 | RETRIEVAL_CONTRACT | ❌ GAP | GET_CONTEXT/GET_MEMORY/GET_EVIDENCE no E2E |
| P10 | CONTEXT_FABRIC | ❌ GAP | context packing/rerank/budget no E2E |
| P11 | SANDBOX_CONTRACT | 🟡 source-only | Firecracker/gVisor/nsjail/bwrap/QEMU/crosvm presentes; `runtime/src/uek` sin control-plane completo |
| P12 | WORKER_CONTRACT | 🟡 parcial | Stabilize aporta tareas/worker primitives; adapter YAIWES incompleto |
| P13 | OUTPUT_SCHEMA | ✅ | LayerResult + Evidence fuerte + verifier |
| P14 | AUDIT_ENGINE | 🟡 parcial | Sheriff/Validator/Sentinel/Verifier/Supervisor/Judge/Guardian; falta auditor global 5-pass sobre goals |
| P15 | CONSOLIDATOR | ❌ GAP | consolidación task→phase→project no materializada completa |
| P16 | ROUTER | 🟡 parcial | component registry/plugins existen; Resource Router global incompleto |
| P17 | CONTINUOUS_LOOP | 🟡 parcial | runner ejecuta nodo literal y retry externo; loop multi-stage autónomo completo no probado E2E |
| P18 | RECOVERY | 🟡 parcial | durable ledger/restart PASS; workspace/multi-host/global recovery pendiente |
| P19 | RESOURCE_BRAIN | ❌ GAP | selección dinámica de recursos/capacidades no materializada completa |
| P20 | GLOBAL_INTEGRATION | 🟡 parcial | OPA/OpenFGA sublane PASS; integración global todavía abierta |
| P21 | FIVE_PASS_BUILD_AUDITOR | ❌ GAP | cobertura documental existe; motor ejecutable 5-pass todavía incompleto |
| P22 | API | ❌/parcial | faltan API de chat/control del workflow y contracts completos |
| P23 | UI | fuera del core | UI se construye después del runtime; no puede cerrar el orquestador |

## Archivos ejecutables auditados

### Wordflow package
- `contracts.py` — contratos/evidencia/hash.
- `runner.py` — nodo literal fail-closed, replay y gobernanza.
- `ledger.py` — hash-chain, lock, fsync, atomic replace.
- `llm_gate.py` — límite LLM 4%.
- `component_registry.py` — catálogo físico; no prueba integración por sí solo.
- `layers/layer_01_research.py` — research funnel.
- `layers/layer_02_xray_documents.py` — X-Ray documental.
- `layers/layer_03_xray_code.py` — X-Ray code.
- `layers/layer_04_copy_move.py` — mutación bajo autorización.
- `layers/layer_05_download_extract.py` — motor canónico/destino/provider/special-file guards.
- `layers/layer_06_source_evolution.py` — reuse/patch/adapter/delta decision.
- `governance/{sheriff,validator,sentinel,verifier,supervisor,judge,guardian}.py` — gates.
- `architecture_dsl.py` — DAG Python P01–P23, 96/4.

### Runtime
- `src/core/workflow_definition.py` — proyección Python 19 pasos de ejecución; owner Stabilize preservado.
- `src/plugins/**` — socket/Fables/activation/catalog/loader/adapters, implementado y testeado parcialmente.
- `src/governance/**` — policy lane.
- `src/agent/**` — GAP principal.
- `src/integration/**` — GAP global; README/manifests no equivalen a implementación.
- `src/recovery/**` — GAP de control-plane global.
- `src/uek/**` — GAP sandbox/VM lifecycle/router.
- `src/adapters/**` — parcial, requiere platform/provider owners.

## Tareas siguientes

1. Memory/Audit + retrieval/context fabric.
2. Agent↔Memory↔Tools↔Workflow.
3. Sandbox/UEK + VM/platform capability router.
4. Integration/Consolidator/Coverage/Final Judge.
5. Workspace/global recovery E2E.
6. API/control surface después del runtime.
7. G12 bidireccional `GOAL→REQUIREMENT→FILE/FUNCTION→TEST→EVIDENCE` al 100%.

## Cierre

`SOURCE_PRESENT != IMPLEMENTED != WIRED != RUNTIME_TEST_PASS != VERIFIED_CLOSED`.
El proyecto sigue `ACTIVE_LOOP`; no se declara cerrado hasta P08–P23 relevantes y G12 tengan evidencia real.
