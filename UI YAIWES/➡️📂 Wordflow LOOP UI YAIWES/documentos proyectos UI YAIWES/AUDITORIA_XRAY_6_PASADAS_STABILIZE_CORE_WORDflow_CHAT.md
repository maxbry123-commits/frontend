# Auditoría Forense X-Ray 6 Pasadas
## Wordflow del Chat — Stack definitivo basado en Stabilize CORE

**Fecha de auditoría:** 2026-09-05  
**Decisión arquitectónica:** `Stabilize CORE` será el único motor de workflow/orquestación.  
**Premisa:** el **router** y el **sistema de memoria** ya existen y no se reconstruyen; se conectan mediante adaptadores.

---

# 0. Resultado ejecutivo

La arquitectura recomendada queda:

**CHAT ➡️ Starlette API ➡️ Stabilize CORE ➡️ Task Contracts/Pydantic ➡️ Memory Adapter + Router Adapter ➡️ Agent/LLM ➡️ Validator/Rule Engine ➡️ State Delta ➡️ Audit/Consolidation ➡️ Stabilize durable state/checkpoint ➡️ PASS | GAP→REPAIR | HITL | NEXT ➡️ FINALIZE**

No se instalarán varios orquestadores simultáneos.

- **Stabilize** = único dueño del DAG, estado de ejecución, queue, recovery y loop.
- **Memoria existente** = contexto, retrieval, evidencia, history, consolidación persistente.
- **Router existente** = selección de modelo/API/worker y health/capability routing.
- **Agent/LLM externo** = razonamiento/ejecución de la unidad asignada.
- Componentes adicionales = contratos, reglas deterministas, API, transporte, observabilidad y pruebas.
- **Dagu** y **redun** se conservan como **fuentes donantes de patrones**, no como runtimes activos.

---

# PASADA 1 — EXTRACCIÓN LITERAL DEL WORDflow

El documento fuente exige que el flujo total pueda cubrir:

**MASTER INPUT  
➡️ QUESTION ENGINE  
➡️ GOALS  
➡️ REQUIREMENTS  
➡️ PLAN  
➡️ TASK DAG  
➡️ TASK FUNNEL  
➡️ TASK CONTRACT  
➡️ MEMORY RETRIEVAL  
➡️ CONTEXT FABRIC  
➡️ SANDBOX  
➡️ LLM  
➡️ OUTPUT  
➡️ SCHEMA VALIDATION  
➡️ AUDIT  
➡️ STATE DELTA  
➡️ CONSOLIDATION  
➡️ MEMORY UPDATE  
➡️ CHECKPOINT  
➡️ COVERAGE CHECK  
➡️ NEXT TASK  
➡️ REPEAT**

También exige:

- Master Input inmutable.
- estados deterministas;
- Task DAG;
- Task Contract;
- Context Pack;
- Pinned Input y Carry Forward;
- Output Schema;
- State Delta;
- Policy;
- Audit;
- Judge;
- Checkpoint;
- retry con **cambio de estrategia**;
- rollback;
- branching;
- convergencia;
- auto-research;
- human-required cuando realmente corresponde;
- consolidación local/global;
- coverage `Requirement → Task → Artifact → Evidence → Validation`;
- cross-check top-down / bottom-up;
- cierre únicamente después de validación global.

**Hallazgo X-Ray 1:** el Wordflow no necesita un “agente-orquestador”. Necesita un **runtime durable + tareas específicas del proyecto + reglas deterministas**.

---

# PASADA 2 — FRONTERAS: QUÉ YA EXISTE Y QUÉ FALTA

## Ya existe — NO reconstruir

### A. Router existente
Debe seguir siendo dueño de:

- capability routing;
- model/API selection;
- health;
- authorization técnica;
- latency/cost;
- specialization;
- fallback de proveedor.

### B. Memory/Audit existente
Debe seguir siendo dueño de:

- ingestión;
- normalización;
- chunking;
- indexing;
- tags;
- retrieval;
- reranking;
- evidence;
- history;
- project memory;
- Context Pack;
- memory versioning;
- provenance;
- knowledge relations.

## Falta conectar

1. motor de workflow durable;
2. Task Contracts;
3. guardas/policy deterministas;
4. Agent/Memory/Router adapters;
5. Validator/Judge;
6. Consolidator/Integration State;
7. API del chat;
8. observabilidad;
9. pruebas forenses de invariantes y recovery.

**Hallazgo X-Ray 2:** la mayor parte de lo que falta está entre el chat y los sistemas existentes. Es una **capa de control pequeña**, no otro sistema cognitivo.

---

# PASADA 3 — AUDITORÍA DE CÓDIGO FUENTE DE STABILIZE CORE

## 1. Stabilize CORE — SELECCIONADO COMO MOTOR ÚNICO

**Repositorio:**  
https://github.com/rodmena-limited/stabilize

**Código fuente inspeccionado:**

- `src/stabilize/dag/`
- `src/stabilize/events/`
- `src/stabilize/models/status.py`
- `src/stabilize/models/workflow.py`
- `src/stabilize/models/stage/`
- `src/stabilize/recovery.py`
- `src/stabilize/audit.py`
- `src/stabilize/conditions.py`
- `src/stabilize/finalizers.py`
- `src/stabilize/hitl.py`
- `src/stabilize/handlers/`
- `src/stabilize/handlers/jump_to_stage/reset.py`
- `src/stabilize/handlers/workflow_control.py`
- `src/stabilize/monitor/`
- `src/stabilize/resilience/`
- `README.md`
- `pyproject.toml`

### Capacidades verificadas en el código/repositorio

Stabilize modela:

- `Workflow`;
- `StageExecution`;
- `TaskExecution`;
- `WorkflowStatus`;
- `TaskRegistry`;
- durable store;
- durable queue;
- `QueueProcessor`;
- `Orchestrator`;
- handlers de start/skip/cancel/signal;
- recovery;
- event/audit trail;
- reset de stages para retry;
- jumps hacia stages anteriores;
- fan-out/fan-in;
- suspensión y reanudación;
- HITL;
- workflow event stream;
- SQLite;
- PostgreSQL;
- resiliencia/bulkheads/circuit breaking.

Su documentación fuente indica además que cada paso persiste el nuevo estado y el mensaje que continúa el workflow de forma transaccional y que recovery reencola el trabajo en vuelo.

### Dependencias que Stabilize ya incorpora

Según su `pyproject.toml`:

- `pydantic>=2.0`
- `bulkman>=2.0.1,<3`
- `resilient-circuit>=0.4.6,<0.8`
- `python-ulid>=2.0`

Extras de observabilidad:

- `structlog`
- `opentelemetry-api`
- `opentelemetry-sdk`

### Riesgo detectado

Stabilize se declara **Beta** en su metadata de paquete.

### Decisión

**FORK + PIN.**

No ejecutar contra `main` flotante en producción.

Recomendación:

1. crear fork controlado;
2. congelar una versión/commit probado;
3. mantener una rama `upstream-sync`;
4. no modificar su kernel si una extensión mediante Task/handler/adaptador es suficiente;
5. cubrir el fork con pruebas de recovery y determinismo.

---

# PASADA 4 — AUDITORÍA DE CÓDIGO FUENTE DE COMPONENTES CANDIDATOS

## 2. Pydantic — SELECCIONADO / YA ES DEPENDENCIA DE STABILIZE

**Repositorio:**  
https://github.com/pydantic/pydantic

**Código inspeccionado:**

- `pydantic/main.py`
- implementación de `BaseModel`;
- `model_validate`;
- `model_json_schema`;
- `ValidationError`;
- tests de validación estricta.

### Cubrirá

- `MasterInputContract`;
- `Goal`;
- `Requirement`;
- `TaskContract`;
- `ContextRequest`;
- `ContextPackRef`;
- `AgentRequest`;
- `AgentResult`;
- `EvidenceRef`;
- `StateDelta`;
- `ValidationResult`;
- `IntegrationState`;
- `ClosureResult`.

### Decisión

**OBLIGATORIO, sin añadir peso nuevo:** ya viene con Stabilize.

---

## 3. Bulkman — SELECCIONADO / YA ES DEPENDENCIA DE STABILIZE

**Repositorio:**  
https://github.com/rodmena-limited/bulkman

**Código inspeccionado:**

- `bulkman/core.py`
- `bulkman/threading.py`
- `bulkman/sync_bridge.py`
- excepciones de bulkhead/shutdown/timeout;
- integración desde `stabilize/resilience/bulkheads.py`.

### Cubrirá

- bulkhead isolation;
- límites de concurrencia;
- protección de workers;
- timeouts;
- prevención de cascadas;
- parte del Watchdog/Resource Protection.

### Decisión

**MANTENER COMO DEPENDENCIA HEREDADA.**

No escribir nuestro propio bulkhead.

---

## 4. resilient-circuit — SELECCIONADO / YA ES DEPENDENCIA DE STABILIZE

**Repositorio:**  
https://github.com/rodmena-limited/resilient-circuit

**Código inspeccionado:**

- `resilient_circuit/circuit_breaker.py`
- `resilient_circuit/storage.py`
- `resilient_circuit/retry.py`
- `resilient_circuit/backoff.py`
- `resilient_circuit/failsafe.py`
- `resilient_circuit/policy.py`

### Cubrirá

- circuit breaker;
- durable breaker state;
- backoff;
- retry técnico de llamadas;
- protección ante APIs/workers degradados.

### Regla crítica

El retry técnico de red **no sustituye** el retry cognitivo del Wordflow.

Wordflow exige:

**FAIL ➡️ GAP ➡️ FAILURE ANALYSIS ➡️ STRATEGY CHANGE ➡️ RETRY**

### Decisión

**MANTENER COMO DEPENDENCIA HEREDADA.**

---

## 5. rule-engine — SELECCIONADO

**Repositorio:**  
https://github.com/zeroSteiner/rule-engine

**Código inspeccionado:**

- `lib/rule_engine/engine/rule.py`
- `lib/rule_engine/engine/context.py`
- parser/AST;
- resolución de objetos y tipos.

El código define `Rule` como una expresión lógica que puede evaluarse contra objetos Python arbitrarios.

### Cubrirá

Policy/Judge determinista:

- `evidence_count == 0 -> BLOCK`;
- `critical_gap == true -> REPAIR`;
- `pending_required > 0 -> NOT_COMPLETE`;
- `same_failure_count >= limit -> ESCALATE`;
- `authorization == false -> HUMAN_REQUIRED/BLOCK`;
- `schema_valid == false -> REJECT`;
- `coverage_complete == true && critical_conflicts == 0 -> PASS`.

### Por qué se elige sobre Casbin para el núcleo

El Wordflow necesita reglas sobre **estado de tarea/evidencia/cobertura**, no principalmente RBAC.

### Decisión

**OBLIGATORIO PARA POLICY/JUDGE.**

Casbin queda opcional si posteriormente se necesita RBAC/ABAC multiusuario.

---

## 6. Starlette — SELECCIONADO

**Repositorio:**  
https://github.com/Kludex/starlette

**Código inspeccionado:**

- `starlette/applications.py`
- `starlette/routing.py`
- `Route`;
- `WebSocketRoute`;
- `WebSocket`;
- lifespan;
- middleware;
- exception handlers.

### Cubrirá

API mínima del chat:

- `POST /runs`
- `POST /runs/{id}/resume`
- `POST /runs/{id}/cancel`
- `GET /runs/{id}/state`
- `GET /runs/{id}/events`
- WebSocket/SSE para progreso;
- health.

### Decisión

**OBLIGATORIO SI EL CHAT SE CONECTA POR ASGI/HTTP.**

---

## 7. HTTPX — SELECCIONADO CONDICIONAL

**Repositorio:**  
https://github.com/encode/httpx

**Código inspeccionado:**

- `httpx/_client.py`;
- `AsyncClient`;
- transport;
- `Timeout`;
- `Limits`;
- request/send lifecycle.

### Cubrirá

Transporte hacia:

- router externo;
- memory service externo;
- agentes remotos;
- APIs externas.

### Decisión

**USAR SOLO SI LOS ADAPTERS SON HTTP.**

Si router/memory viven en el mismo proceso Python, no añadir una llamada HTTP artificial.

---

## 8. structlog — SELECCIONADO

**Repositorio:**  
https://github.com/hynek/structlog

**Código inspeccionado:**

- `src/structlog/_base.py`
- `BoundLoggerBase`;
- `bind/unbind`;
- contextvars;
- JSON renderer/processors.

### Cubrirá

Ledger operativo legible:

- `run_id`;
- `workflow_id`;
- `stage`;
- `task`;
- `attempt`;
- `strategy_id`;
- `router_choice`;
- `memory_context_id`;
- `verdict`;
- `gap_type`;
- `checkpoint`;
- `duration`.

### Decisión

**OBLIGATORIO PARA LOGS ESTRUCTURADOS.**

Stabilize ya lo ofrece como extra de observabilidad.

---

## 9. OpenTelemetry Python — SELECCIONADO

**Repositorio:**  
https://github.com/open-telemetry/opentelemetry-python

**Código inspeccionado:**

- `TracerProvider`;
- `MeterProvider`;
- spans;
- `start_as_current_span`;
- span attributes/events;
- correlación trace/log.

### Cubrirá

Trazabilidad transversal:

**CHAT ➡️ STABILIZE ➡️ MEMORY ➡️ ROUTER ➡️ AGENT ➡️ VALIDATOR ➡️ CHECKPOINT**

Métricas:

- latency por stage;
- retry count;
- GAP count;
- stalls;
- API failure;
- model latency;
- memory retrieval latency.

### Decisión

**SELECCIONADO COMO OBSERVABILIDAD.**

No añadir Prometheus client directamente en V1 si OTel ya cubre exportación de métricas.

---

## 10. pytest — SELECCIONADO PARA VERIFICACIÓN

**Repositorio:**  
https://github.com/pytest-dev/pytest

**Código/documentación fuente inspeccionados:**

- fixtures;
- parametrización;
- hooks;
- test collection;
- assertion/testing infrastructure.

### Cubrirá

- unit tests;
- contract tests;
- integration;
- recovery;
- E2E;
- fault injection.

### Decisión

**OBLIGATORIO EN DESARROLLO/CI.**

---

## 11. Hypothesis — SELECCIONADO PARA X-RAY / INVARIANTES

**Repositorio:**  
https://github.com/HypothesisWorks/hypothesis

**Código inspeccionado:**

- `hypothesis/src/hypothesis/stateful.py`;
- `RuleBasedStateMachine`;
- `rule`;
- `initialize`;
- `invariant`;
- stateful tests.

### Cubrirá

Pruebas automáticas de secuencias como:

- start → retry → retry → pass;
- start → suspend → resume;
- start → jump → repair → pass;
- crash → recover → resume;
- invalid output → no state commit;
- conflict → block;
- previous ledger mutation → integrity FAIL.

### Decisión

**OBLIGATORIO PARA PRUEBAS FORENSES DEL KERNEL.**

No corre en el path de producción.

---

# COMPONENTES DONANTES — INVESTIGADOS PERO NO SE EJECUTAN COMO SEGUNDO MOTOR

## 12. Dagu — DONANTE DE PATRÓN, NO RUNTIME

**Repositorio:**  
https://github.com/dagucloud/dagu

**Código inspeccionado:**

- `internal/spec/dag.go`
- representación YAML → IR;
- `internal/service/scheduler/dag_executor.go`
- `internal/runtime/executor/dag_runner.go`
- API de retry/DAG runs.

### Qué copiar como idea

- definición declarativa legible del workflow;
- versión humana del DAG;
- operación externa simple;
- parámetros de ejecución.

### Qué NO hacer

No ejecutar Dagu y Stabilize como dos owners del mismo workflow.

### Adaptación propuesta

Crear un **YAML/JSON declarativo propio** que compile a `Workflow/StageExecution` de Stabilize.

---

## 13. redun — DONANTE DE HASHING/PROVENANCE, NO RUNTIME

**Repositorio:**  
https://github.com/insitro/redun

**Código inspeccionado:**

- `redun/hashing.py`
- `hash_call_node(...)`
- `CallNode`
- CallGraph;
- DB provenance;
- tags;
- documentación de deterministic IDs.

### Qué copiar como patrón

Calcular un fingerprint estable:

**task contract + relevant input refs + context version + strategy id + child refs → execution fingerprint**

Usos:

- deduplicación;
- replay;
- detectar si el mismo intento se está repitiendo;
- provenance;
- impact analysis;
- cache segura.

### Qué NO hacer

No instalar redun como segundo scheduler.

---

# COMPONENTE OPCIONAL FUTURO

## 14. Apache Casbin PyCasbin — OPCIONAL

**Repositorio:**  
https://github.com/apache/casbin-pycasbin

**Código inspeccionado:**

- `casbin/enforcer.py`;
- `Enforcer`;
- policy adapters;
- ACL/RBAC/ABAC.

### Añadir solamente si aparece

- multiusuario;
- roles;
- tenants;
- permisos por workspace;
- permisos por tool/model/resource.

Para el kernel V1 de un chat controlado por un único runtime, `rule-engine` es más directo.

---

# COMPONENTE RECHAZADO DEL NÚCLEO

## 15. Pluggy — NO NECESARIO EN V1

**Repositorio auditado:**  
https://github.com/pytest-dev/pluggy

**Código inspeccionado:**

- `src/pluggy/_manager.py`;
- `PluginManager`;
- registro 1:N;
- hooks.

### Motivo del descarte

Stabilize ya posee `TaskRegistry`.

Agregar Pluggy en V1 introduciría otro registry/hook layer sin cerrar un GAP obligatorio.

Puede añadirse después si el proyecto necesita plugins de terceros.

---

# PASADA 5 — MATRIZ 1:1 DE COBERTURA DEL WORDflow

| # | Función del documento | Componente/propietario final | Estado |
|---|---|---|---|
| 01 | Core State Model | **Stabilize Workflow/Stage/Task/Status** | CUBIERTO |
| 02 | Event Model | **Stabilize events/audit/replay + structlog** | CUBIERTO |
| 03 | Task Model | **Stabilize TaskExecution/StageExecution** | CUBIERTO |
| 04 | Task Contract | **Pydantic + contrato YAIWES** | ADAPTAR |
| 05 | State Machine | **Stabilize handlers/status + rule guards** | CUBIERTO |
| 06 | Checkpoint Engine | **Stabilize durable store/recovery + memory refs** | CUBIERTO/ADAPTAR |
| 07 | Policy Engine | **rule-engine + reglas YAIWES** | ADAPTAR |
| 08 | Memory Contract | **Memoria existente + memory_adapter** | ADAPTAR |
| 09 | Retrieval Contract | **Memoria existente** | YA EXISTE |
| 10 | Context Fabric | **Memoria existente / Context Pack** | YA EXISTE |
| 11 | Sandbox Contract | **Agente externo + Stabilize task boundary + Bulkman** | ADAPTAR |
| 12 | Worker Contract | **Pydantic + Stabilize TaskRegistry + router_adapter** | ADAPTAR |
| 13 | Output Schema | **Pydantic strict models** | CUBIERTO |
| 14 | Audit Engine | **audit_task propio + rule-engine + Evidence Memory** | ADAPTAR |
| 15 | Consolidator | **consolidator_task propio + memoria existente** | ADAPTAR |
| 16 | Router | **Router existente** | YA EXISTE |
| 17 | Continuous Loop | **Stabilize queue/jump/control flow** | CUBIERTO |
| 18 | Recovery | **Stabilize recovery + Bulkman + resilient-circuit** | CUBIERTO |
| 19 | Resource Brain | **Router existente + health + OTel** | YA EXISTE/ADAPTAR |
| 20 | Global Integration | **IntegrationState Pydantic + memoria + consolidator** | ADAPTAR |
| 21 | Five-Pass Build Auditor | **5 audit stages + rule-engine + pytest/Hypothesis** | ADAPTAR |
| 22 | API | **Starlette** | CUBIERTO |
| 23 | UI | **Chat existente** | YA EXISTE |

---

# COBERTURA DE LAS FUNCIONES INTERNAS DEL WORKFLOW

## MASTER INPUT
**Pydantic immutable contract + memory source ref**

## QUESTION ENGINE
Stage propio de Stabilize:
`QuestionTask`

## GOAL ENGINE
Stage propio:
`GoalTask`

## REQUIREMENT ENGINE
Stage propio:
`RequirementTask`

## PLAN ENGINE
Stage propio:
`PlanTask`

## TASK DAG
Stabilize.

## TASK FUNNEL
Stage propio:
`DecomposeTask`

Genera stages/child workflow según el contrato.

## TASK CONTRACT
Pydantic.

## CONTEXT REQUEST
`MemoryAdapter.get_context(task_contract)`

## INPUT BLOCK / PINNED / CARRY
Memoria existente + Pydantic `InputBlock`.

## RESOURCE ROUTING
Router existente.

## SANDBOX / WORKER
External Agent adapter + Bulkman logical isolation.

## LLM OUTPUT
Pydantic `AgentResult`.

## NORMALIZER
Pequeño módulo propio.

## SCHEMA VALIDATION
Pydantic strict validation.

## AUDIT
`AuditTask` + rule-engine + evidence from memory.

## STATE DELTA
Pydantic `StateDelta`; solo se aplica tras PASS.

## CONSOLIDATION
`ConsolidatorTask`.

## MEMORY UPDATE
Memory adapter.

## CHECKPOINT
Stabilize state + references a memory/artifacts.

## COVERAGE
`CoverageTask` propio.

## NEXT TASK
Stabilize DAG/control flow.

## RETRY
Separar:

- **technical retry** → resilient-circuit/Stabilize resilience;
- **cognitive retry** → GAP + StrategyDelta + jump/retry de Stabilize.

## ROLLBACK
Stabilize recovery + proyecto define qué memory/artifact refs vuelven a ser activos.

## BRANCH
Stabilize fan-out / jump / child workflow.

## CONVERGENCE
`ConvergenceRuleTask` sobre métricas:
progress, coverage, repeated fingerprint, failures, uncertainty.

## FINAL JUDGE
rule-engine + `FinalJudgeTask`.

## FINALIZATION
Stabilize final stage solo se ejecuta cuando:
- mandatory coverage = PASS;
- critical gaps = 0;
- unresolved critical conflicts = 0;
- evidence requirements = PASS;
- IntegrationState = VALIDATED.

---

# PASADA 6 — DEDUPLICACIÓN, GAPS Y STACK DEFINITIVO

## A. Stack de producción obligatorio

### 1. Stabilize CORE
https://github.com/rodmena-limited/stabilize

**Owner único:** workflow/DAG/durable state/queue/recovery/loop/HITL.

### 2. Pydantic
https://github.com/pydantic/pydantic

**Owner:** schemas y contratos.

### 3. Bulkman
https://github.com/rodmena-limited/bulkman

**Owner:** bulkheads/aislamiento lógico/límites.  
**Nota:** dependencia heredada de Stabilize.

### 4. resilient-circuit
https://github.com/rodmena-limited/resilient-circuit

**Owner:** circuit breaker/backoff/retry técnico.  
**Nota:** dependencia heredada de Stabilize.

### 5. rule-engine
https://github.com/zeroSteiner/rule-engine

**Owner:** Policy/Sheriff/Judge deterministic rules.

### 6. Starlette
https://github.com/Kludex/starlette

**Owner:** API/WebSocket/stream del chat.

### 7. HTTPX
https://github.com/encode/httpx

**Owner:** transporte async solo para adapters HTTP.

### 8. structlog
https://github.com/hynek/structlog

**Owner:** ledger/log estructurado.

### 9. OpenTelemetry Python
https://github.com/open-telemetry/opentelemetry-python

**Owner:** traces + metrics + correlación transversal.

## B. Verificación/CI

### 10. pytest
https://github.com/pytest-dev/pytest

### 11. Hypothesis
https://github.com/HypothesisWorks/hypothesis

## C. Donantes de patrones — NO runtime

### 12. Dagu
https://github.com/dagucloud/dagu

Donar: YAML/IR declarativo y experiencia operativa de DAG.

### 13. redun
https://github.com/insitro/redun

Donar: deterministic hashing, CallGraph/provenance y fingerprints.

## D. Opcional futuro

### 14. Apache Casbin PyCasbin
https://github.com/apache/casbin-pycasbin

Solo si aparecen RBAC/ABAC/multitenancy.

---

# GAPS QUE NINGÚN REPO DEBE “INVENTAR” POR NOSOTROS

Estos módulos son específicos de tu método de trabajo y deben ser pequeños componentes propios:

1. `contracts_yaiwes.py`
2. `memory_adapter.py`
3. `router_adapter.py`
4. `agent_task.py`
5. `question_goal_requirement_tasks.py`
6. `validator_rules.py`
7. `audit_task.py`
8. `strategy_delta.py`
9. `consolidator_task.py`
10. `coverage_task.py`
11. `integration_state.py`
12. `final_judge_task.py`
13. `chat_api.py`
14. `workflow_definition.py`

No son otro framework; son el **cableado y las reglas de negocio**.

---

# ESTIMACIÓN DE CÓDIGO PROPIO DESPUÉS DE REUTILIZAR EL STACK

| Bloque | LOC aproximadas |
|---|---:|
| Contratos Pydantic YAIWES | 200–350 |
| Workflow/Stages definition | 250–450 |
| Memory adapter | 120–250 |
| Router adapter | 120–250 |
| Agent Task | 120–220 |
| Question/Goal/Requirement/Plan tasks | 200–400 |
| Validator + Policy Rules | 200–400 |
| GAP + Strategy Delta | 120–220 |
| Audit Task | 150–300 |
| Consolidator + Coverage | 250–500 |
| Integration State + Final Judge | 150–300 |
| Starlette API/cableado | 180–350 |

**Código propio de producción aproximado: 1.860–3.990 LOC.**

Tests adicionales del proyecto:

**~1.500–3.000 LOC**, usando pytest + Hypothesis.

El rango real depende de cuánto del Memory/Router existente ya exponga los contratos requeridos.

---

# FLUJO FINAL DEL CHAT

**USER  
➡️ CHAT  
➡️ Starlette  
➡️ Stabilize Workflow  
➡️ MasterInputContract  
➡️ Question/Goal/Requirement/Plan Stages  
➡️ Task DAG  
➡️ MemoryAdapter → CONTEXT PACK  
➡️ RouterAdapter → WORKER  
➡️ AgentTask  
➡️ AgentResult/Pydantic  
➡️ AuditTask  
➡️ rule-engine Judge  
➡️ PASS?**

### PASS

**PASS  
➡️ StateDelta  
➡️ Consolidator  
➡️ Memory Update  
➡️ Stabilize durable commit  
➡️ Coverage  
➡️ Next Stage**

### GAP

**FAIL  
➡️ GAP typed  
➡️ Failure Analysis  
➡️ StrategyDelta distinto  
➡️ Stabilize jump/reset  
➡️ nuevo intento  
➡️ Verify**

### Bloqueo humano

**AUTH/CRITICAL CONFLICT  
➡️ Stabilize HITL SUSPEND  
➡️ durable wait  
➡️ approval/input  
➡️ RESUME**

### Cierre

**NO RUNNABLE TASKS  
+ COVERAGE PASS  
+ EVIDENCE PASS  
+ NO CRITICAL CONFLICT  
+ INTEGRATION VALIDATED  
➡️ FINAL JUDGE  
➡️ VERIFIED_CLOSED**

---

# REGLAS DE FUSIÓN

1. **Un solo owner del estado de ejecución:** Stabilize.
2. No copiar schedulers completos de Dagu/redun.
3. Tomar de Dagu únicamente el patrón declarativo.
4. Tomar de redun únicamente fingerprint/provenance.
5. Router no se mueve dentro de Stabilize: se adapta.
6. Memoria no se mueve dentro de Stabilize: se adapta.
7. Agent/LLM nunca escribe el estado canónico directamente.
8. Todo output entra por Pydantic.
9. Todo avance entra por Judge/Rules.
10. Todo GAP genera un `StrategyDelta`.
11. Retry idéntico al fallido se rechaza mediante fingerprint.
12. Checkpoint/recovery pertenecen a Stabilize; Memory guarda referencias cognitivas.
13. Observabilidad no gobierna el flujo.
14. UI no gobierna el flujo.
15. La finalización es una transición validada, no una frase del modelo.

---

# ESTRATEGIA DE DESPLIEGUE

## V1 — un solo backend

**Starlette + Stabilize SQLite + Router Adapter + Memory Adapter + Agent Adapter**

Ventaja:
- simple;
- embebido;
- sin scheduler externo.

## V2 — si se escala a varios procesos/nodos

Cambiar:

**Stabilize SQLite ➡️ Stabilize PostgreSQL**

y conservar exactamente los mismos Task Contracts.

---

# PRUEBAS FORENSES OBLIGATORIAS ANTES DEL DESPLIEGUE

1. `MASTER_INPUT` no puede ser sobrescrito.
2. Output inválido no modifica estado.
3. Claim sin evidencia no llega a VERIFIED.
4. Critical GAP bloquea cierre.
5. Retry igual al intento previo se rechaza.
6. Retry con StrategyDelta distinto continúa.
7. Crash después de commit reanuda sin duplicar side effect.
8. Crash antes de commit no produce estado fantasma.
9. Suspend/HITL sobrevive restart.
10. Jump/repair vuelve al stage correcto.
11. Branches paralelos no sobrescriben resultados.
12. Consolidator preserva conflicto A=X / A=Y.
13. Coverage incompleta impide COMPLETE.
14. Ledger replay reconstruye la ejecución.
15. Mutación de evento histórico produce integrity FAIL si se añade hash-chain de proyecto.
16. Hypothesis ejecuta secuencias aleatorias de transición sin romper invariantes.
17. MemoryAdapter devuelve la versión/context ref esperada.
18. RouterAdapter registra exactamente qué recurso fue seleccionado.
19. Final Judge no acepta “la LLM dice que terminó”.
20. E2E termina únicamente en `VERIFIED_CLOSED`.

---

# VEREDICTO FINAL X-RAY

**VERIFIED ARCHITECTURAL PLAN — NO DEPLOYMENT CLAIM**

La auditoría concluye que el Wordflow puede reducirse a:

**STABILIZE CORE  
+ TU MEMORY  
+ TU ROUTER  
+ PYDANTIC CONTRACTS  
+ RULE ENGINE  
+ STARLETTE/HTTPX  
+ STRUCTLOG/OTEL  
+ PYTEST/HYPOTHESIS  
+ ~2K–4K LOC DE CABLEADO Y REGLAS PROPIAS**

sin construir desde cero:

- DAG engine;
- queue;
- durable state;
- recovery;
- loop engine;
- HITL;
- bulkhead;
- circuit breaker;
- schema engine;
- API framework;
- observability framework;
- testing framework.

La recomendación final es **forkear/pinear Stabilize CORE** y montar encima solamente los adaptadores y reglas específicas de YAIWES/Wordflow.
