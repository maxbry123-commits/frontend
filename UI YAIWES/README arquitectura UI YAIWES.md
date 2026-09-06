# README arquitectura UI YAIWES

Estado: CANONICAL WORKING ARCHITECTURE / FAIL-CLOSED
Contrato: `tel.workflow/v3`
Destino: `maxbry123-commits/frontend/UI YAIWES/`

## 0. Propósito

Este README es la guía humana/canónica del backend del chat UI YAIWES. Grok trabaja el frontend; este árbol gobierna únicamente backend, Wordflow, integración, estado, recuperación y cableado con los componentes open source.

Arquitectura elegida:

`CHAT/UI ➡️ Starlette API ➡️ Stabilize CORE ➡️ Task Contract/Pydantic ➡️ Memory Adapter + Router Adapter ➡️ Agent/LLM ➡️ Validator/Judge ➡️ State Delta ➡️ Consolidator ➡️ Durable State/Checkpoint ➡️ PASS | GAP→StrategyDelta→Retry | HITL | NEXT ➡️ VERIFIED_CLOSED`

Regla: **un solo owner del workflow: Stabilize CORE**. Router y memoria existentes se adaptan; no se reconstruyen.

---

# 1. Salida 1 a 1 — diseño del micro-orquestador

## 1.1 CHAT / API
Entrada del usuario y streaming de progreso.

`CHAT ➡️ Starlette ➡️ run_id ➡️ Stabilize Workflow`

Responsabilidad:
- crear run;
- resume/cancel/state/events;
- no decidir el flujo;
- no escribir estado canónico directamente.

Componente:
- Starlette: https://github.com/Kludex/starlette

## 1.2 STABILIZE CORE — motor principal

Repositorio:
https://github.com/rodmena-limited/stabilize

Responsabilidad:
- Workflow/Stage/Task;
- DAG;
- durable state;
- durable queue;
- recovery;
- jump/reset/retry control;
- fan-out/fan-in;
- suspend/resume/HITL;
- event/audit trail;
- SQLite en V1, PostgreSQL al escalar.

Microflujo:
`Workflow ➡️ Stage READY ➡️ TaskRegistry ➡️ Execute ➡️ TaskResult(success|failure|suspend|jump) ➡️ durable commit ➡️ next`

## 1.3 CONTRATOS

Componente:
https://github.com/pydantic/pydantic

Contratos UI YAIWES:
- `MasterInputContract`
- `Goal`
- `Requirement`
- `TaskContract`
- `ContextRequest`
- `ContextPackRef`
- `AgentRequest`
- `AgentResult`
- `EvidenceRef`
- `StateDelta`
- `ValidationResult`
- `IntegrationState`
- `ClosureResult`

Regla:
`OUTPUT sin schema válido ➡️ REJECT ➡️ no commit`

## 1.4 BULKHEAD / AISLAMIENTO

Componente:
https://github.com/rodmena-limited/bulkman

Responsabilidad:
- límites de concurrencia;
- bulkheads;
- timeouts;
- aislamiento de workers/recursos;
- prevención de fallos en cascada.

Nota: ya es dependencia de Stabilize.

## 1.5 CIRCUIT BREAKER / RETRY TÉCNICO

Componente:
https://github.com/rodmena-limited/resilient-circuit

Responsabilidad:
- breaker;
- backoff;
- retry técnico;
- durable breaker state.

Regla: retry técnico no sustituye retry cognitivo.

`FAIL semántico ➡️ GAP ➡️ FailureAnalysis ➡️ StrategyDelta distinto ➡️ Stabilize jump/reset ➡️ Retry`

## 1.6 POLICY / SHERIFF / JUDGE

Componente:
https://github.com/zeroSteiner/rule-engine

Responsabilidad:
- reglas deterministas sobre el estado;
- bloquear cierre sin evidencia;
- impedir commit con schema inválido;
- impedir COMPLETE con GAP crítico;
- exigir delta distinto tras fallo repetido.

Ejemplos:
- `evidence_count == 0 -> BLOCK_VERIFIED`
- `critical_gap == true -> REPAIR`
- `schema_valid == false -> REJECT`
- `coverage_complete == false -> NOT_COMPLETE`

## 1.7 TRANSPORTE

Componente:
https://github.com/encode/httpx

Usar solo si Memory/Router/Agent son servicios HTTP externos.

`Stabilize Task ➡️ Adapter ➡️ HTTPX AsyncClient ➡️ servicio ➡️ typed result`

Si viven dentro del mismo proceso Python, conectar por interfaz directa y no introducir HTTP artificial.

## 1.8 LEDGER / LOGS

Componente:
https://github.com/hynek/structlog

Campos mínimos:
- run_id;
- workflow_id;
- stage;
- task;
- attempt;
- strategy_id;
- router_choice;
- context_ref;
- verdict;
- gap_type;
- checkpoint;
- duration.

## 1.9 TRACING / MÉTRICAS

Componente:
https://github.com/open-telemetry/opentelemetry-python

Traza transversal:
`CHAT ➡️ API ➡️ STABILIZE ➡️ MEMORY ➡️ ROUTER ➡️ AGENT ➡️ VALIDATOR ➡️ CONSOLIDATOR ➡️ CHECKPOINT`

## 1.10 TESTS

pytest:
https://github.com/pytest-dev/pytest

Hypothesis:
https://github.com/HypothesisWorks/hypothesis

Pruebas mínimas:
- contratos;
- DAG;
- state transitions;
- retry distinto;
- crash/recovery;
- suspend/resume;
- invalid output no commit;
- critical GAP no close;
- coverage;
- final judge;
- E2E.

---

# 2. Donantes de patrones — NO segundo runtime

## Dagu
https://github.com/dagucloud/dagu

Tomar como patrón:
- workflow declarativo YAML;
- spec → IR;
- operación DAG legible.

No ejecutar Dagu como segundo owner del mismo workflow.

## redun
https://github.com/insitro/redun

Tomar como patrón:
- deterministic hashing;
- CallGraph/provenance;
- fingerprint de ejecución.

Fingerprint propuesto:
`TaskContract + input refs + context version + strategy_id + dependency refs ➡️ execution_fingerprint`

Uso:
- dedupe;
- replay;
- detectar retry idéntico;
- provenance;
- impact analysis.

---

# 3. Componentes existentes que NO se reconstruyen

## Router existente
Owner de:
- capability selection;
- model/API selection;
- health;
- cost/latency;
- specialization;
- fallback.

Se conecta mediante `router_adapter`.

## Memory existente
Owner de:
- ingestion;
- persistence;
- retrieval;
- reranking;
- evidence;
- history;
- Context Pack;
- provenance;
- project memory.

Se conecta mediante `memory_adapter`.

---

# 4. Flujo 1 a 1 del Wordflow del chat

## Nodo 0 — RECEIVE / MASTER INPUT
`USER ➡️ CHAT ➡️ MasterInputContract ➡️ hash/version ➡️ STATE`

## Nodo 1 — QUESTION
`MASTER INPUT ➡️ QuestionTask ➡️ unknowns/gaps ➡️ typed questions`

## Nodo 2 — GOALS
`questions ➡️ GoalTask ➡️ primary goal + subgoals + success/failure criteria`

## Nodo 3 — REQUIREMENTS
`goals ➡️ RequirementTask ➡️ R001...Rn ➡️ acceptance criteria`

## Nodo 4 — PLAN
`requirements ➡️ PlanTask ➡️ stages/tasks/dependencies/validation`

## Nodo 5 — DAG
`plan ➡️ Stabilize Workflow/Stages ➡️ ready/blocked`

## Nodo 6 — TASK CONTRACT
`ready task ➡️ Pydantic TaskContract ➡️ immutable execution envelope`

## Nodo 7 — MEMORY REQUEST
`TaskContract ➡️ memory_adapter ➡️ Context Pack + evidence refs + current state`

## Nodo 8 — ROUTER
`TaskContract + context ➡️ router_adapter ➡️ selected worker/model/resource`

## Nodo 9 — AGENT/LLM
`typed request ➡️ external agent/LLM ➡️ AgentResult`

## Nodo 10 — NORMALIZE/SCHEMA
`AgentResult ➡️ Pydantic validation ➡️ candidate StateDelta`

## Nodo 11 — AUDIT/JUDGE
`candidate delta + evidence + requirements ➡️ rule-engine + AuditTask ➡️ PASS|GAP|HUMAN_REQUIRED`

## Nodo 12 — GAP / REPAIR
`GAP ➡️ FailureAnalysis ➡️ research ➡️ StrategyDelta distinto ➡️ Stabilize jump/reset ➡️ retry`

## Nodo 13 — CONSOLIDATE
`PASS ➡️ ConsolidatorTask ➡️ facts/evidence/decisions/dependencies/conflicts`

## Nodo 14 — MEMORY UPDATE
`validated delta ➡️ memory_adapter.save_delta ➡️ memory version N+1`

## Nodo 15 — CHECKPOINT
`validated execution state ➡️ Stabilize durable commit + refs ➡️ recoverable point`

## Nodo 16 — COVERAGE
`Requirement ➡️ Task ➡️ Artifact ➡️ Evidence ➡️ Validation`

Missing link = GAP.

## Nodo 17 — NEXT
`coverage/task state ➡️ Stabilize scheduler/control ➡️ next runnable stage`

## Nodo 18 — FINAL JUDGE
`no runnable tasks + coverage PASS + evidence PASS + no critical conflicts + integration validated ➡️ VERIFIED_CLOSED`

LLM nunca declara globalmente terminado por sí misma.

---

# 5. LOOP persistente

Contrato:
`[NODO literal] ➡️ SHERIFF ➡️ VALIDATOR ➡️ RESEARCH(chat→código→comunidad→filtra→dedup→rank+URL) ➡️ EXECUTE(delta autorizado) ➡️ evidencia real?`

- NO ➡️ `GAP ➡️ persist failure/checkpoint/failed strategy ➡️ RESEARCH con delta distinto ➡️ mismo nodo`
- SÍ ➡️ `CODA ➡️ verify_final independiente`

Estados finales:
- `VERIFIED_CLOSED`
- `CLOSED_UNVERIFIED`
- `INCONCLUSIVE`

Reglas:
- 1 instrucción = 1 nodo;
- fail-closed;
- sin evidencia citada no hay cierre;
- retry idéntico no cuenta como estrategia nueva;
- check real/flaky puede repetirse hasta 10×;
- check puro/determinista se ejecuta 1×.

---

# 6. Anclas de trabajo

README = contrato/arquitectura humana.

STATE = estado estructurado.

CHECKPOINT = punto recuperable.

RECOVERY = cómo reconstruir contexto y volver al último punto válido.

CRAZY WALL = bitácora humana append-oriented.

HANDOFF = punto de entrada para otro agente/Codex/GPT.

PIPELINE = métodos y estándares operativos.

Si divergen:
`DIVERGENCIA ➡️ GAP ➡️ reconciliar antes de mutar`

---

# 7. Raíz de trabajo UI YAIWES

```text
UI YAIWES/
├── README arquitectura UI YAIWES.md
├── Documentos proyecto UI YAIWES/
├── componentes/                         # Codex descarga OSS aquí
└── ➡️📂 Wordflow LOOP UI YAIWES/
    ├── HANDOFF.md
    ├── Crazy Wall Orquestador/
    │   ├── BITACORA-CRAZY-WALL.md
    │   ├── STATE.json
    │   ├── CHECKPOINT.json
    │   ├── RECOVERY-PATCH.md
    │   └── LEDGER-ARQUITECTURA-UI-YAIWES.md
    ├── PIPELINE/
    │   ├── 00_METODO_TRABAJO_Y_ARQUITECTURA.md
    │   ├── FORENSIC_CODE_AUDIT.md
    │   └── ADVANCED_ENGINEERING_STANDARD_V3.md
    └── runtime/
        ├── docs/
        ├── src/
        │   ├── core/
        │   ├── adapters/
        │   ├── tasks/
        │   └── integration/
        └── tests/
```

---

# 8. Código propio esperado

Solo reglas/cableado de dominio:
- contracts_yaiwes.py
- memory_adapter.py
- router_adapter.py
- agent_task.py
- question_goal_requirement_tasks.py
- validator_rules.py
- audit_task.py
- strategy_delta.py
- consolidator_task.py
- coverage_task.py
- integration_state.py
- final_judge_task.py
- chat_api.py
- workflow_definition.py

Estimación de referencia, no hecho demostrado: **~1.860–3.990 LOC de producción + ~1.500–3.000 LOC de tests**, condicionado por las interfaces reales del Router/Memory existentes.

---

# 9. Reglas de implementación

`CONTEXT ➡️ REUSE ➡️ COPY-FIRST ➡️ ADAPTER/PATCH mínimo ➡️ WIRE ➡️ TEST ➡️ FORENSIC X-RAY ➡️ VERDICT ➡️ CHECKPOINT`

Prioridad:
`REUSE > COPY/MOVE > PATCH PEQUEÑO > ADAPTER > GENERATE DELTA`

No hacer:
- segundo scheduler;
- segunda memoria;
- segundo router;
- estado paralelo no reconciliado;
- PASS por presencia de archivo;
- secretos en repo/log;
- rediseño global silencioso desde una task.

---

# 10. Fuentes de arquitectura replicada

Repo fuente:
https://github.com/maxbry123-commits/agentes

Wordflow fuente:
https://github.com/maxbry123-commits/agentes/tree/main/%E2%9E%A1%EF%B8%8F%F0%9F%93%82%20Wordflow%20LOOP%20Yaiwes

La arquitectura de trabajo replicada conserva el patrón comprobado del proyecto fuente:
`README ↔ HANDOFF ↔ STATE ↔ CHECKPOINT ↔ RECOVERY ↔ CRAZY WALL ↔ PIPELINE`

La implementación backend cambia a **Stabilize CORE** como motor para evitar reprogramar DAG/queue/recovery desde cero.

---

# 11. Estado inicial de este árbol

- Arquitectura README: CREATED.
- Documentos proyecto UI YAIWES: ruta ya existente en el repo.
- `componentes/`: pendiente de aparición/verificación de la descarga de Codex en el momento de esta creación.
- Wordflow/anchors: deben quedar creados y reconciliados antes de integración de componentes.
- Runtime funcional: NO declarado integrado todavía.
- Cierre: `IN_PROGRESS` hasta evidencia de wiring/tests/E2E.
