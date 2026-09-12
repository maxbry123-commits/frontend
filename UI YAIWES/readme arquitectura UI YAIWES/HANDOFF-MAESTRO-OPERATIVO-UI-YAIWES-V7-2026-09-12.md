# HANDOFF MAESTRO OPERATIVO — UI YAIWES — V7

Fecha: 2026-09-12
Repo: `maxbry123-commits/frontend`
Branch: `main`
Contrato: `tel.workflow/v3`
Modo: `FAIL_CLOSED_LOOP`
Estado: `ACTIVE_LOOP_NOT_CLOSED`

## Punto de entrada único — orden obligatorio

1. `UI YAIWES/readme arquitectura UI YAIWES/ARQUITECTURA-WORDFLOW-PYTHON-DSL-DAG-96-4-V7-2026-09-12.md`
2. `UI YAIWES/bitácora stated JSON Craxy wall plan checkpoint/CRAZY-WALL-WORDFLOW-XRAY-V4-2026-09-12.json`
3. `UI YAIWES/bitácora stated JSON Craxy wall plan checkpoint/WORDFLOW-FILE-BY-FILE-XRAY-2026-09-12.md`
4. `UI YAIWES/bitácora stated JSON Craxy wall plan checkpoint/CROSSCHECK-3-FUENTES-WORDFLOW-2026-09-11.json`
5. `UI YAIWES/bitácora stated JSON Craxy wall plan checkpoint/AUDIT-GAP-LEDGER-4AI-2026-09-11.json`
6. `UI YAIWES/bitácora stated JSON Craxy wall plan checkpoint/CRAZY-WALL-TASK-QUEUE-MULTI-AI-V2-2026-09-12.json`
7. `UI YAIWES/bitácora stated JSON Craxy wall plan checkpoint/NOTAS-ASTRA-100X-CROSSCHECK-CODE-COMPONENTS-2026-09-12.md`
8. Los 3 documentos fuente de verdad: MAX-SYSTEM, Virtual Computer/14 objetivos y Memory/Audit Wordflow.
9. HEAD real + Actions/runs reales + reports/role states frescos.

Autoridad: `code/runtime/test/log real > Crazy Wall/STATE/checkpoint > arquitectura/handoff > documentos fuente > memoria chat > inferencia`.

## Arquitectura ejecutable vigente

- Python DSL/DAG: `wordflow_loop/wordflow_loop/architecture_dsl.py`.
- P01–P23 congelados como procesos fuente.
- Determinismo mínimo `96%`.
- LLM máximo `4%`; sólo P09/P10/P19 pueden usarlo para ambigüedad/ranking/resumen acotado.
- Owner workflow único: `stabilize_core`.
- `runtime/src/core/workflow_definition.py` sigue siendo la proyección Python de ejecución; no crear segundo scheduler/DAG owner.

## Estado probado / no repetir como nuevo

- Contracts + literal hash + Evidence fuerte.
- LayerRunner fail-closed + Sheriff/Validator/Sentinel/Verifier/Supervisor/Judge/Guardian.
- Ledger hash-chain + locking + fsync + atomic replace + restart/tamper subgates.
- Layers L01–L06.
- Fables + Stabilize bridge TESTED.
- OPA/OpenFGA: SOURCE_PRESENT + FABLES_WIRED + LIVE_RUNTIME_PASS en policy sublane.

## GAPs first-party confirmados por read-back fresco

- `runtime/src/adapters`: README-only.
- `runtime/src/agent`: `.gitkeep`.
- `runtime/src/integration`: README-only.
- `runtime/src/recovery`: control-plane Stabilize-backed implementado y globalmente probado; failover E2E pendiente.
- `runtime/src/uek`, `storage`, `conn`, `observability`, `mission`, `install`: pendientes según readback.

Vacío por sí solo NO autoriza code. Primero: source requirement → dedup/equivalence → owner/write_scope → delta mínimo → test.

## Carriles / nodos

- SOL_GPT1: P08 Memory → P09 Retrieval → P10 Context Fabric → local-first storage/agent boundary.
- SOL_GPT2: P11 Sandbox/UEK → P12 Worker boundary → P16 Router → OTel runtime boundary.
- SOL_GPT3: P20 Global Integration → P17 Continuous Loop → P22 Python API/control.
- ASTRA_GPT: P14 Audit5 → P15 Consolidator → P21 Five-pass + P19 research/dedup + mission/install classification.
- SOL_ORQUESTADOR: P18 recovery/reconstruction + G12 global bidirectional coverage + shared consolidation/final judge.

Nodo lifecycle:
`FREE → CLAIMED → EXECUTING → PASS|GAP → REPORT`.

Máximo 3 pasos:
`VERIFY_OR_RESEARCH → EXECUTE_AUTHORIZED_DELTA → TEST_AND_REPORT`.

Claim: `role + node_id + fresh_base_main_sha + write_scope + claimed_at`.
Report: `paths + SHA/blob + run/job/log + evidence + gaps + next_free_node`.

## CI global — gate P3

Workflow: `.github/workflows/yaiwes-wordflow-loop-pytest.yml`.
Corre todo `wordflow_loop/tests` y todo `runtime/tests`.

Blind spot corregido en commit `baed8f07e9a205f28def181931d9eb7420e76fd7`:
- trigger ahora incluye `runtime/src/**`;
- sparse-checkout ahora incluye `runtime/src` completo.

Gate fresco: run `34723669555`, job `103633952112`, `completed/success`; log: Wordflow 23 PASS y runtime 62 PASS + 9 subtests. P18 recovery control-plane queda TESTED, pero workspace/multi-host sandbox failover E2E y G12 siguen abiertos.

## Regla de mejora / componentes

`REUSE_EXISTING > PATCH > ADAPT > GENERATE > NEW_DOWNLOAD`.
No añadir otro gran orquestador. Componentes nuevos sólo por capability gap único probado, con provenance/destino/motor canónico.

## Cierre

`SPECIFIED != IMPLEMENTED != WIRED != RUNTIME_TEST_PASS != VERIFIED_CLOSED`.
Final Judge sólo puede cerrar con G12 100% y Memory/Audit + Agent + Sandbox/UEK + Integration/Consolidator + Recovery + platform routing evidenciados.
