# ARQUITECTURA WORDFLOW UI YAIWES — PYTHON DSL/DAG 96/4 — V7

Fecha: 2026-09-12
Contrato: `tel.workflow/v3`
Modo: `FAIL_CLOSED_LOOP`
Owner workflow: `stabilize_core`
Definición ejecutable: `UI YAIWES/➡️📂 Wordflow LOOP UI YAIWES/wordflow_loop/wordflow_loop/architecture_dsl.py`
Gate LLM: `.../wordflow_loop/llm_gate.py`
X-Ray 1×1: `UI YAIWES/bitácora stated JSON Craxy wall plan checkpoint/WORDFLOW-FILE-BY-FILE-XRAY-2026-09-12.md`
Crazy Wall vigente: `UI YAIWES/bitácora stated JSON Craxy wall plan checkpoint/CRAZY-WALL-WORDFLOW-XRAY-V4-2026-09-12.json`

## Regla de arquitectura

El DAG autoritativo del Wordflow se expresa en Python ejecutable. JSON/YAML pueden existir como estado/configuración externa o CI, pero no definen el ownership ni la lógica autoritativa del orquestador.

`DETERMINISTIC_RATIO = 0.96`
`LLM_RATIO = 0.04`

LLM sólo se admite de forma acotada en P09 Retrieval, P10 Context Fabric y P19 Resource Brain para `ambiguity_resolution | semantic_ranking | bounded_summary`. Runtime, estado, policy, audit, recovery y cierre son deterministas.

## Microflujo transversal

`INPUT → CONTRACT → POLICY → CONTEXT → ROUTE → SANDBOX/WORKER → OUTPUT_SCHEMA → AUDIT → STATE_DELTA → CONSOLIDATE → MEMORY → CHECKPOINT → COVERAGE → NEXT/REPAIR → FINAL_JUDGE`

## X-Ray procesos P01–P23

| ID | Proceso | Estado código | Evidencia / GAP |
|---|---|---|---|
| P01 | CORE_STATE_MODEL | ✅ base | `contracts.py`: Status/Evidence/NodeContract/LayerResult |
| P02 | EVENT_MODEL | 🟡 parcial | ledger persiste eventos; falta modelo tipado de eventos de dominio |
| P03 | TASK_MODEL | 🟡 parcial | NodeContract cubre nodo mínimo; falta Goal/Requirement/Task global |
| P04 | TASK_CONTRACT | ✅ | `NodeContract` + hash literal + allowed/forbidden/mutation/auth |
| P05 | STATE_MACHINE | ✅ base | `LayerRunner` + fail-closed + dependency/replay |
| P06 | CHECKPOINT_ENGINE | 🟡 parcial | ledger durable/replay/fsync probado; workspace/project checkpoint global incompleto |
| P07 | POLICY_ENGINE | ✅ sublane | governance + rule-engine + OPA/OpenFGA live policy lane |
| P08 | MEMORY_CONTRACT | ❌ GAP | Memory/Audit runtime completo no materializado |
| P09 | RETRIEVAL_CONTRACT | ❌ GAP | GET_CONTEXT/GET_MEMORY/GET_EVIDENCE no E2E |
| P10 | CONTEXT_FABRIC | ❌ GAP | context packing/rerank/budget no E2E |
| P11 | SANDBOX_CONTRACT | 🟡 source-only | Firecracker/gVisor/nsjail/bwrap/QEMU/crosvm presentes; `runtime/src/uek` vacío |
| P12 | WORKER_CONTRACT | 🟡 parcial | Stabilize aporta primitives; adapter YAIWES incompleto |
| P13 | OUTPUT_SCHEMA | ✅ | LayerResult + Evidence fuerte + verifier |
| P14 | AUDIT_ENGINE | 🟡 parcial | governance local; falta auditor global 5-pass sobre goals |
| P15 | CONSOLIDATOR | ❌ GAP | task→phase→project no materializado completo |
| P16 | ROUTER | 🟡 parcial | registry/plugins existen; Resource/Capability Router global incompleto |
| P17 | CONTINUOUS_LOOP | 🟡 parcial | runner nodo literal; loop multi-stage autónomo no probado E2E |
| P18 | RECOVERY | 🟡 parcial | durable ledger/restart PASS; workspace/global recovery pendiente |
| P19 | RESOURCE_BRAIN | ❌ GAP | selección dinámica de recursos/capacidades no completa |
| P20 | GLOBAL_INTEGRATION | 🟡 parcial | OPA/OpenFGA sublane PASS; integration global abierta |
| P21 | FIVE_PASS_BUILD_AUDITOR | ❌ GAP | cobertura documental existe; motor Python 5-pass falta |
| P22 | API | ❌ GAP | `runtime/src/conn` vacío; falta API/control workflow |
| P23 | UI | downstream | UI sólo después de runtime/API verificados |

## Código first-party auditado

### Wordflow
`contracts.py`, `runner.py`, `ledger.py`, `llm_gate.py`, `architecture_dsl.py`, `component_registry.py`, L01–L06 y governance Sheriff/Validator/Sentinel/Verifier/Supervisor/Judge/Guardian.

### Runtime
- `src/core/workflow_definition.py` ✅ Python 19-step projection; Stabilize permanece único owner.
- `src/plugins/**` ✅ Fables/catalog/loader/activation/adapters reales; sólo subgates probados.
- `src/adapters/` ❌ README-only.
- `src/agent/` ❌ `.gitkeep`.
- `src/integration/` ❌ README-only.
- `src/recovery/`, `src/uek/`, `src/storage/`, `src/conn/`, `src/observability/`, `src/mission/`, `src/install/` ❌ `.gitkeep` al X-Ray fresco.

No se genera código por tener un directorio vacío: primero debe existir REQUIREMENT y dedup contra Stabilize/Fables/plugins/vendors.

## CI global corregido

Workflow: `.github/workflows/yaiwes-wordflow-loop-pytest.yml`
Commit corrección cobertura: `baed8f07e9a205f28def181931d9eb7420e76fd7`.

Antes: sparse-checkout sólo incluía core/plugins/governance.
Ahora: trigger `runtime/src/**` + sparse-checkout completo `runtime/src`, además de `wordflow_loop` y `runtime/tests`.

Run de gate creado: `34716613952`; mientras no sea `completed/success` + log leído, el DSL 96/4 permanece `PENDING_TEST_GATE`.

## Cola de ejecución

- SOL_GPT1: P08→P09→P10 + storage/agent boundary.
- SOL_GPT2: P11→P12→P16 + OTel runtime boundary.
- SOL_GPT3: P20→P17→P22.
- ASTRA_GPT: P14→P15→P21 + P19 research/dedup + mission/install classification.
- SOL_ORQUESTADOR: P18 recovery/reconstruction + G12 bidireccional + shared consolidation/final judge.

Cada tarea = 1 nodo; máximo 3 pasos: `VERIFY_OR_RESEARCH → EXECUTE_AUTHORIZED_DELTA → TEST_AND_REPORT`.

## Cierre

`SOURCE_PRESENT != IMPLEMENTED != WIRED != RUNTIME_TEST_PASS != VERIFIED_CLOSED`.
El proyecto sigue `ACTIVE_LOOP`; no se cierra hasta que G12 y los límites Memory/Agent/Sandbox/Integration/Recovery/Platform tengan evidencia real.
