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
| P08 | MEMORY_CONTRACT | 🟡 TESTED subgate | Read boundary + canonical write gate implementados; storage/checkpoint/product E2E pendientes |
| P09 | RETRIEVAL_CONTRACT | 🟡 boundary API | GET_CONTEXT/GET_MEMORY/GET_EVIDENCE validados contra puerto fake; retrieval real/provenance E2E pendiente |
| P10 | CONTEXT_FABRIC | ❌ GAP | context packing/rerank/budget no E2E |
| P11 | SANDBOX_CONTRACT | 🟡 source-only | Firecracker/gVisor/nsjail/bwrap/QEMU/crosvm presentes; `runtime/src/uek` vacío |
| P12 | WORKER_CONTRACT | 🟡 parcial | Stabilize aporta primitives; adapter YAIWES incompleto |
| P13 | OUTPUT_SCHEMA | ✅ | LayerResult + Evidence fuerte + verifier |
| P14 | AUDIT_ENGINE | 🟡 implementado, integración pendiente | `runtime/src/audit/five_pass.py`; 13/13 tests locales; falta verificador CI conectado e inventario global completo |
| P15 | CONSOLIDATOR | ❌ GAP | task→phase→project no materializado completo |
| P16 | ROUTER | 🟡 parcial | registry/plugins existen; Resource/Capability Router global incompleto |
| P17 | CONTINUOUS_LOOP | 🟡 parcial | runner nodo literal; loop multi-stage autónomo no probado E2E |
| P18 | RECOVERY | 🟡 TESTED subgate | Stabilize-backed control-plane + SHA256/ledger gate PASS; workspace/multi-host sandbox failover E2E pendiente |
| P19 | RESOURCE_BRAIN | ❌ GAP | selección dinámica de recursos/capacidades no completa |
| P20 | GLOBAL_INTEGRATION | 🟡 parcial | OPA/OpenFGA sublane PASS; integration global abierta |
| P21 | FIVE_PASS_BUILD_AUDITOR | 🟡 motor Python probado localmente | Auditor cinco pasadas existente; cruce inverso exige inventario sin omisiones/duplicados; cobertura global/E2E pendientes |
| P22 | API | ❌ GAP | `runtime/src/conn` vacío; falta API/control workflow |
| P23 | UI | downstream | UI sólo después de runtime/API verificados |

## Código first-party auditado

### Wordflow
`contracts.py`, `runner.py`, `ledger.py`, `llm_gate.py`, `architecture_dsl.py`, `component_registry.py`, L01–L06 y governance Sheriff/Validator/Sentinel/Verifier/Supervisor/Judge/Guardian.

### Runtime
- `src/core/workflow_definition.py` ✅ Python 19-step projection; Stabilize permanece único owner.
- `src/plugins/**` ✅ Fables/catalog/loader/activation/adapters reales; sólo subgates probados.
- `src/adapters/` ❌ README-only.
- `src/agent/` 🟡 boundary implementado y cubierto por regresión global.
- `src/integration/` ❌ README-only.
- `src/recovery/` 🟡 control-plane implementado y probado globalmente; `src/uek/`, `src/storage/`, `src/conn/`, `src/observability/`, `src/mission/`, `src/install/` siguen pendientes según readback. Recovery no prueba todavía failover multi-host/sandbox E2E.

No se genera código por tener un directorio vacío: primero debe existir REQUIREMENT y dedup contra Stabilize/Fables/plugins/vendors.

## CI global corregido

Workflow: `.github/workflows/yaiwes-wordflow-loop-pytest.yml`
Commit corrección cobertura: `baed8f07e9a205f28def181931d9eb7420e76fd7`.

Antes: sparse-checkout sólo incluía core/plugins/governance.
Ahora: trigger `runtime/src/**` + sparse-checkout completo `runtime/src`, además de `wordflow_loop` y `runtime/tests`.

Gate fresco: run `34730513826`, job `103652482919`, `completed/success`, log leído: Wordflow 23 PASS; runtime 75 PASS + 9 subtests. Promoción limitada a regresión global y subgates P18 control-plane + P08 boundary; no cierra P08–P10/storage E2E, G12 ni failover E2E.

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


## Delta P14/P21 — 2026-09-13

Commit `fc67c45840d3a121323e43179989424272b8f494`: `audit_five_pass` exige igualdad entre rutas de implementación de las trazas y el inventario de artefactos recibido. Rechaza artefactos huérfanos, implementaciones omitidas y duplicados del inventario. Varias exigencias pueden compartir un mismo archivo. El contador de trazas usa una pasada; no constituye benchmark 100x.

13/13 tests locales, con tres fallos reproducidos antes de corregir. CI `34730134580` pendiente al registrar este delta. El callback independiente y la matriz exhaustiva de requisitos siguen pendientes: `TRACEABILITY_PASS` nunca certifica por sí solo el producto. No se introduce otro workflow owner.

Reentrada y tareas por componente: `UI YAIWES/bitácora stated JSON Craxy wall plan checkpoint/reports/ASTRA-LOOP-CODA-2026-09-13.json`. Guarda claims con SHA/read-back, goals 12/12, Council analítico y refutaciones; watchdog bloqueado por límite 5/5, no activo.


## Delta P08 Memory boundary — 2026-09-13

Commits `17d98a7e7f1a083108c96443d5bc10a05bb7024d` + `084debdb8acb102d9d41b9ca39b8ca88d8c29125`: boundary fail-closed para GET_CONTEXT/GET_MEMORY/GET_EVIDENCE, separación AGENT_PRIVATE/CHAT/PROJECT y rechazo de escritura canónica directa por LLM. Gate global `34730513826`, job `103652482919`: 23 Wordflow PASS; 75 runtime PASS + 9 subtests. Estado: `TESTED_BOUNDARY_SUBGATE`; storage, checkpoint binding, restart isolation y retrieval/context E2E siguen abiertos.

La cola paralela de cierre del editor es downstream P23 y no sustituye Queue V2/Crazy Wall V4 ni habilita cierre runtime. La referencia a un watchdog horario separado en el role state S1 queda marcada como no autoritativa para este LOOP central.
