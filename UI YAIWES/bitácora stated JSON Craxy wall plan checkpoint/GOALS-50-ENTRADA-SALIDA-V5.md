# GOALS 50 — ENTRADA → SALIDA — UI YAIWES

**Revisión:** v5
**Contrato runtime:** `tel.workflow/v3`
**Regla:** cada GOAL debe terminar en un output verificable. `SPECIFIED` significa documentado, NO implementado.

Estados: `VERIFIED | PARTIAL | PREPARED | SPECIFIED | GAP | BLOCKED | PENDING`.

| ID | GOAL | Entrada | Salida obligatoria | Estado actual | Evidencia/gate de cierre |
|---|---|---|---|---|---|
| G01 | Preservar Master Input literal | instrucción usuario | input hash/version inmutable | SPECIFIED | MasterInputContract + hash + read-back |
| G02 | Resolver autoridad de fuentes | input + documentos | SourceAuthoritySet versionado | PARTIAL | source refs + prioridad + contradicciones |
| G03 | Question Engine 12 dimensiones | MasterInput | preguntas faltantes/requisitos implícitos | SPECIFIED | schema Questions + tests |
| G04 | Question Graph | preguntas | relaciones/dependencias entre preguntas | SPECIFIED | graph serializable + coverage |
| G05 | Goal Graph | input+preguntas | goals explícitos trazables | PARTIAL | 50 goals + ids + source refs |
| G06 | Requirement Graph | goals | requisitos atómicos con dependencias | SPECIFIED | RequirementContract + graph tests |
| G07 | Scope/constraint preservation | input | límites/prohibiciones/versiones | PARTIAL | constraints hash + policy checks |
| G08 | Integration Plan previo | goals+requirements | mapa de cómo se unen piezas | PARTIAL | plan versionado antes de work units |
| G09 | Task DAG | requirements | tareas con deps/ready state | SPECIFIED | DAG acíclico + validator |
| G10 | Task Funnel | tarea | subtasks→work units independientes | SPECIFIED | WorkUnit schema + fanout/fanin test |
| G11 | Dependency Graph bidireccional | tasks/artifacts | deps top-down/bottom-up | SPECIFIED | forward/reverse graph equivalence |
| G12 | Canonical State Model | eventos/deltas | STATE autoritativo externo | PARTIAL | STATE existe; falta runtime model completo |
| G13 | Event Model | ejecución | event log ordenado/idempotente | SPECIFIED | Event schema + replay test |
| G14 | Task Contract | ready task | contrato ejecutable tipado | PARTIAL | adapters existen; contrato global incompleto |
| G15 | Deterministic State Machine | task/events | transiciones permitidas | SPECIFIED | transition table + invalid transition tests |
| G16 | Checkpoint Engine | state/delta | snapshot recuperable | PARTIAL | CHECKPOINT existe; falta engine/runtime restore E2E |
| G17 | Policy Engine | action/context | ALLOW/DENY/HUMAN_REQUIRED | PARTIAL | Rule Engine wired; PyCasbin pendiente |
| G18 | Memory Contract | task/state | memory request/update tipado | SPECIFIED | schemas + no direct LLM write test |
| G19 | Retrieval Contract | information need | ranked EvidenceRefs | SPECIFIED | hybrid retrieval test |
| G20 | Context Fabric | requests+indexes | Minimal Sufficient ContextPack | SPECIFIED | budget/provenance/context request tests |
| G21 | Sandbox Contract | WorkUnit+capabilities | isolated execution result | SPECIFIED | FS/network/CPU/RAM capability tests |
| G22 | Worker Contract | authorized WorkUnit | AgentResult/WorkerResult | SPECIFIED | timeout/cancel/idempotency tests |
| G23 | Typed Output Schema | worker output | normalized typed output | PARTIAL | Pydantic adapter prepared; exact runtime flag |
| G24 | Evidence Graph | tasks/artifacts/evidence | SUPPORTS/CONTRADICTS/etc. graph | SPECIFIED | relation schema + traceability queries |
| G25 | Audit Engine | candidate result | audit findings/contradictions | SPECIFIED | requirement/evidence/coverage audit tests |
| G26 | Validator | candidate delta | schema/boundary/version verdict | PARTIAL | validator patterns/plugins exist; global chain incomplete |
| G27 | Judge | audit+verification | closed/unverified/gap/block verdict | SPECIFIED | deterministic closure tests |
| G28 | Consolidator | work-unit results | task/phase/project synthesis | SPECIFIED | progressive consolidation + provenance |
| G29 | Router/Capability Selector | task+health+policy | model/tool/provider route | SPECIFIED | capability registry + failover tests |
| G30 | Continuous LOOP | state+next task | execute→verify→persist→next | PARTIAL | method operational; runtime E2E incomplete |
| G31 | GAP/StrategyDelta recovery | failure | materially distinct retry | PARTIAL | ledger method exists; runtime fingerprint gate pending |
| G32 | Anti-stall Watchdog | stagnant execution | forced safe delta/block evidence | PARTIAL | A/B/C watchdog method exists; project runtime integration pending |
| G33 | Concurrency Reconciliation | moving HEAD | preserved histories/no-force | VERIFIED | multiple real concurrent commits reconciled without force |
| G34 | Vendor provenance/code-only | external component | URL/SHA/license/code-root map | PARTIAL | initial 14 mapped; post-124 inventory still stale |
| G35 | Universal Plugin Socket | component capability | registry→guard→loader→factory | VERIFIED | commit `4960005c...` + read-back/tests |
| G36 | Stabilize unique owner | workflow actions | single canonical scheduler | PARTIAL | guard/wiring present; real vendor execution flag P02A |
| G37 | Pydantic typed contracts | payload | validated/dumped/schema output | BLOCKED | source `2.14.0b1/core2.48.0` vs observed local mismatch |
| G38 | Deterministic Rule Engine | expression+data | deterministic policy result | PARTIAL | adapter/read-back; vendor-real flag |
| G39 | HTTP transport + streaming/cancel | client request/run | transport+events+cancel semantics | PARTIAL | HTTPX real local PASS; Chat API/Starlette exact runtime incomplete |
| G40 | Resilience/Bulkhead/Circuit | execution call | isolated/retry/circuit result | PARTIAL | Bulkman/resilient adapters injection/read-back; real vendors pending |
| G41 | Observability read-only | run/task events | correlated logs/traces/metrics | PREPARED | Structlog/OTel work prepared; publish/runtime version gates pending |
| G42 | Test-only pytest/Hypothesis | code/state machine | unit/property evidence only | GAP | pytest physical provenance mismatch; Hypothesis queue order issue |
| G43 | Donor-only Dagu/redun | workflow patterns/provenance | reusable patterns, no second owner | PARTIAL | donor classification; redun post-124 revalidated NOT_WIRED |
| G44 | PyCasbin authorization | subject/object/action | policy decision | PREPARED | adapter design/tests prepared; deps/real runtime + post124 dedup pending |
| G45 | Hierarchical Memory + indexes | raw corpus/events | L0–L4 + lexical/semantic/graph indexes | SPECIFIED | implementation + retrieval benchmarks pending |
| G46 | MAX-SYSTEM scalable execution | ready independent tasks | fanout/fanin/pools/idempotency/DLQ | SPECIFIED | load tests + queue semantics pending |
| G47 | Virtual Computer boundary | app/platform capabilities | Flutter→Rust→VM/guest isolated computer | SPECIFIED | platform prototypes and capability tests pending |
| G48 | Command Center 85 capabilities | user/session/project | functional chat/work/task/health UI | SPECIFIED | 85→Requirement→Task coverage matrix + implementation tests pending |
| G49 | Coverage + reconstruction | all goals/artifacts/state | top-down=bottom-up, reconstruct without chat | PENDING | reconstruction E2E + coverage 100% |
| G50 | Final E2E / Final Judge | MasterInput | verified output + state + evidence + recovery | PENDING | E2E real + restore + 3 councils + 3 refutations PASS |

---

# GOALS DE ENTRADA — mínimo contractual

Antes de ejecutar un nodo deben existir:
1. Input literal preservado.
2. Project/repo/root explícitos.
3. current HEAD.
4. current STATE.
5. current CHECKPOINT.
6. current PLAN 1×1.
7. RECOVERY vigente.
8. source authority.
9. goals afectados.
10. requirements afectados.
11. dependencies.
12. destination.
13. evidence expected.
14. rollback.
15. next-if-pass.
16. next-if-gap.
17. concurrency state.
18. policy/capability scope.
19. reuse search result.
20. strategy fingerprint.

# GOALS DE SALIDA — mínimo contractual

Cada nodo ejecutado debe dejar, según aplique:
1. artifact/código/delta real.
2. path exacto.
3. source URL/commit/tree.
4. commit/diff SHA.
5. read-back.
6. deterministic test.
7. real-runtime test cuando exigido.
8. logs/health/run evidence.
9. validator verdict.
10. auditor findings.
11. verifier classification.
12. Judge state.
13. StateDelta.
14. checkpoint.
15. bitácora event.
16. plan updated.
17. recovery updated.
18. open flags.
19. coverage delta.
20. next exact node.

---

# COBERTURA POR DOMINIO

## A. Ejecución determinista
G01–G17, G23–G33, G35–G40.

## B. Memoria/contexto/auditoría
G18–G20, G24–G28, G45, G49.

## C. Componentes/provenance/testing/policy
G34, G37–G44.

## D. Escala/sandbox/plataforma/UI
G21–G22, G46–G48.

## E. Cierre
G49–G50.

---

# REGLA DE PROGRESO

No sumar `SPECIFIED` como implementación física. No sumar `PREPARED` como publicado. No sumar `PARTIAL` como cierre. Un GOAL solo pasa a `VERIFIED` cuando su acceptance concreta tiene evidencia fresca.
