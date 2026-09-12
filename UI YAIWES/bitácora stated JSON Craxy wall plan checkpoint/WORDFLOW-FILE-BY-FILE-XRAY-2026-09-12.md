# X-RAY 1×1 — WORDFLOW / RUNTIME FIRST-PARTY — 2026-09-12

Contrato: `tel.workflow/v3`
Estado: `ACTIVE_LOOP_NOT_CLOSED`
Alcance: código first-party del orquestador/runtime y sus superficies ejecutables. Los árboles OSS vendorizados se auditan por provenance/build/integration y NO se reinterpretan como código first-party YAIWES.

## A. `wordflow_loop/wordflow_loop`

| Archivo / superficie | Resultado | Proceso |
|---|---|---|
| `contracts.py` | ✅ contrato literal, Evidence, NodeContract, LayerResult, hashes | P01/P03/P04/P13 |
| `runner.py` | ✅ runner fail-closed + pre/post governance + replay | P05/P17-base |
| `ledger.py` | ✅ hash-chain + lock + fsync + atomic replace + tamper detection | P06/P18-base |
| `llm_gate.py` | ✅ límite actualizado a LLM 4% | contrato 96/4 |
| `architecture_dsl.py` | ⏳ Python DSL/DAG P01–P23; CI global pendiente al momento de este snapshot | P01–P23 |
| `component_registry.py` | 🟡 catálogo/estado físico; no demuestra wiring global | P16 |
| `layers/layer_01_research.py` | ✅ research funnel base | research |
| `layers/layer_02_xray_documents.py` | ✅ X-Ray docs base | audit input |
| `layers/layer_03_xray_code.py` | ✅ X-Ray code base | audit input |
| `layers/layer_04_copy_move.py` | ✅ guard de mutación/copy-move | acquisition |
| `layers/layer_05_download_extract.py` | ✅ guards de motor/destino/provider/special-file/readback | acquisition |
| `layers/layer_06_source_evolution.py` | ✅ decisión reuse/patch/adapter/delta | evolution |
| `governance/sheriff.py` | ✅ pre-gate | governance |
| `governance/validator.py` | ✅ dependency/schema gate base | governance |
| `governance/sentinel.py` | ✅ runtime/time gate base | governance |
| `governance/verifier.py` | ✅ evidence gate base | governance |
| `governance/supervisor.py` | ✅ mutation/scope supervision base | governance |
| `governance/judge.py` | ✅ local result judge base | P14/P21-base |
| `governance/guardian.py` | ✅ ledger/authorization guard base | governance |
| `tests/test_core.py` | ✅ persistence/recovery/tamper/evidence tests | P05/P06/P18 |
| `tests/test_layers.py` | ✅ L01–L06 gates | layers |
| `tests/test_recovery_latest_status.py` | ✅ latest-state replay guard | P18-base |
| `tests/test_xray_regressions.py` | ✅ X-Ray regressions | audit |
| `tests/test_architecture_dsl.py` | ⏳ nuevo; gate CI run global | P01–P23/96-4 |

## B. `runtime/src`

| Superficie | Estado físico fresco | Clasificación / tarea |
|---|---|---|
| `core/workflow_definition.py` | ✅ Python, 19-step projection, Stabilize owner | reutilizar; no segundo DAG owner |
| `plugins/**` | ✅ implementación real: Fables, catalog, activation, loader, adapters | TESTED en subgates; no implica global integration |
| `governance/**` | ✅ policy/runtime governance existente | reutilizar |
| `adapters/` | ❌ sólo README | WF-G11/WF-G12/WF-G16 |
| `agent/` | ❌ sólo `.gitkeep` | WF-G08 Agent↔Memory↔Tools↔Workflow |
| `integration/` | ❌ sólo README | WF-G20 + WF-G17 |
| `recovery/` | ❌ sólo `.gitkeep` | WF-G18 global recovery control-plane |
| `uek/` | ❌ sólo `.gitkeep` | WF-G11 sandbox/VM lifecycle/capability router |
| `storage/` | ❌ sólo `.gitkeep` | nuevo nodo: local-first storage/checkpoint boundary; dedup rqlite/Stabilize first |
| `conn/` | ❌ sólo `.gitkeep` | nuevo nodo: P22 API/control connection after runtime contracts |
| `observability/` | ❌ sólo `.gitkeep` | nuevo nodo: wire acquired OTel Collector only if distinct from plugin instrumentation |
| `mission/` | ❌ sólo `.gitkeep` | no generar por nombre; mapear únicamente si goals/requirements need executable mission model |
| `install/` | ❌ sólo `.gitkeep` | no generar hasta package/install requirement is mapped from source |

## C. Procesos fuente P01–P23

- ✅/base real: P01, P04, P05, P07-sublane, P13.
- 🟡 parciales: P02, P03, P06, P11, P12, P14, P16, P17, P18, P20.
- ❌ GAP principal: P08, P09, P10, P15, P19, P21, P22.
- P23 UI: bloqueado hasta runtime/API verificados.

## D. Nuevas tareas derivadas de archivos

1. `WF-GSTORAGE-LOCAL-FIRST` — Sol1 — probar/implementar storage local-first + checkpoint scope, dedup con Stabilize/rqlite.
2. `WF-GOBS-OTEL-RUNTIME` — Sol2 — wire OTel Collector boundary sólo si capability distinta; runtime test.
3. `WF-GCONN-API` — Sol3 — P22 API/control boundary después de P20.
4. `WF-GMISSION-MAP` — Astra audit — decidir si `mission/` necesita code o si goals/requirements ya lo cubren; NO generar sin requisito.
5. `WF-GINSTALL-MAP` — Astra audit — decidir si install/package manager pertenece al Wordflow core o Virtual Computer downstream; NO generar sin requisito.

## E. Gate CI corregido

`.github/workflows/yaiwes-wordflow-loop-pytest.yml` fue corregido para que `sparse-checkout` incluya **todo `runtime/src`** y el trigger cubra `runtime/src/**`; antes sólo cubría core/plugins/governance.

Cierre de esta pasada: el inventario de código first-party del orquestador está clasificado, pero el proyecto sigue abierto hasta que cada GAP tenga Python + test/evidencia o equivalencia probada.
