# CCEE / Wordflow YAIWES — Documento 1:1 de arquitectura + estrategia de programación

> **Tipo:** especificación de programación derivada del documento fuente proporcionado por el usuario.  
> **Objetivo:** transformar la arquitectura conceptual en una estrategia implementable, capa por capa, manteniendo una correspondencia 1:1 con el análisis funcional.  
> **Importante:** las estimaciones de líneas de código (LOC) son **estimaciones de ingeniería**, no cifras presentes en el documento fuente.

---

## 0. Principio rector

- **LLM = Cognitive Processor**
- **Workflow/Runtime = Execution Control**
- **Memory Orchestrator = External Cognitive Memory**
- **Auditor = Verification**
- **Sandbox = Isolated Workspace**
- **Checkpoint = Recovery**
- **Consolidator = Global Integration**
- **Router = Resource Selection**
- **Policy = Authority**
- **State Machine = Deterministic Transitions**
- **Judge = Validation**

**THE MODEL THINKS ➡️ THE RUNTIME CONTROLS ➡️ THE MEMORY REMEMBERS ➡️ THE RETRIEVER FINDS ➡️ THE AUDITOR QUESTIONS ➡️ THE CONSOLIDATOR CONNECTS ➡️ THE CHECKPOINT RECOVERS ➡️ THE POLICY AUTHORIZES ➡️ THE JUDGE VALIDATES**

---

# PARTE I — ESTRATEGIA GENERAL DE PROGRAMACIÓN

## 1.1 Orden canónico del documento fuente

1. CORE STATE MODEL
2. EVENT MODEL
3. TASK MODEL
4. TASK CONTRACT
5. STATE MACHINE
6. CHECKPOINT ENGINE
7. POLICY ENGINE
8. MEMORY CONTRACT
9. RETRIEVAL CONTRACT
10. CONTEXT FABRIC
11. SANDBOX CONTRACT
12. WORKER CONTRACT
13. OUTPUT SCHEMA
14. AUDIT ENGINE
15. CONSOLIDATOR
16. ROUTER
17. CONTINUOUS LOOP
18. RECOVERY
19. RESOURCE BRAIN
20. GLOBAL INTEGRATION
21. FIVE-PASS BUILD AUDITOR
22. API
23. UI

**La API y la UI se programan al final.**

## 1.2 Estrategia propuesta

Enfoque **Python-first, package-by-contract**:

**DOMAIN ➡️ CONTRACTS ➡️ REPOSITORIES ➡️ ENGINES ➡️ ADAPTERS ➡️ RUNTIME ➡️ API ➡️ UI**

Cada componente debe tener:
- modelo;
- contrato;
- implementación;
- repositorio/adaptador;
- eventos;
- tests;
- invariantes;
- criterio de cierre.

## 1.3 Microciclo de programación

**CONTRATO ➡️ MODELO ➡️ IMPLEMENTACIÓN MÍNIMA ➡️ UNIT TEST ➡️ INVARIANTS ➡️ INTEGRATION TEST ➡️ FAILURE TEST ➡️ CHECKPOINT ➡️ SIGUIENTE COMPONENTE**

No avanzar si la capa previa no tiene:
1. schema estable;
2. tests PASS;
3. error model;
4. eventos observables;
5. interface definida;
6. evidencia de integración.

---

# PARTE II — CAPAS FUNCIONALES 1:1 + CÓDIGO NECESARIO


## 01. MASTER INPUT / CONTRATO RAÍZ

### Función
Conservar literalmente la petición original, versionarla, asignarle identidad estable y bloquear modificaciones destructivas.

### Mini diagrama horizontal
**USER ➡️ MASTER INPUT ➡️ VALIDACIÓN ➡️ VERSIONADO ➡️ REGISTRO INMUTABLE**

### Código a programar
`master_input.py, contracts/master_input.py, repositories/input_registry.py`

### Contratos / objetos principales
MasterInput, MasterInputVersion, SourceRef, InputHash

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
inmutabilidad, hash estable, versionado, recuperación literal, rechazo de overwrite

### Estimación de código
- **Implementación:** ~250–400 LOC
- **Tests:** ~150–250 LOC
- **Total capa:** ~400–650 LOC

---


## 02. QUESTION ENGINE

### Función
Convertir vacíos, ambigüedades y necesidades de investigación en preguntas persistentes y trazables; no resolverlas por intuición.

### Mini diagrama horizontal
**MASTER INPUT ➡️ QUESTION ENGINE ➡️ QUESTIONS ➡️ UNKNOWN/GAP ➡️ RESEARCH/TASK**

### Código a programar
`question_engine.py, models/question.py, repositories/question_store.py`

### Contratos / objetos principales
Question, QuestionStatus, QuestionDependency, ResearchNeed

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
creación, deduplicación, prioridad, resolución, conversión a research task

### Estimación de código
- **Implementación:** ~300–500 LOC
- **Tests:** ~200–300 LOC
- **Total capa:** ~500–800 LOC

---


## 03. GOAL ENGINE

### Función
Construir un árbol de objetivos y subobjetivos con criterios explícitos de éxito y fracaso.

### Mini diagrama horizontal
**QUESTIONS + MASTER INPUT ➡️ GOAL ENGINE ➡️ GOAL TREE ➡️ SUCCESS/FAILURE CRITERIA**

### Código a programar
`goal_engine.py, models/goal.py, repositories/goal_store.py`

### Contratos / objetos principales
Goal, GoalTree, SuccessCriterion, FailureCriterion

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
jerarquía, trazabilidad al input, estados, cobertura de criterios

### Estimación de código
- **Implementación:** ~250–400 LOC
- **Tests:** ~150–250 LOC
- **Total capa:** ~400–650 LOC

---


## 04. REQUIREMENT ENGINE

### Función
Transformar objetivos en requisitos verificables con prioridad, dependencias, estado y criterio de cumplimiento.

### Mini diagrama horizontal
**GOAL ➡️ REQUIREMENTS ➡️ DEPENDENCIES ➡️ ACCEPTANCE CRITERIA ➡️ STATUS**

### Código a programar
`requirement_engine.py, models/requirement.py, coverage/requirement_index.py`

### Contratos / objetos principales
Requirement, RequirementStatus, AcceptanceCriterion, RequirementLink

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
transiciones, bloqueo por dependencias, supersession, trazabilidad

### Estimación de código
- **Implementación:** ~300–500 LOC
- **Tests:** ~200–300 LOC
- **Total capa:** ~500–800 LOC

---


## 05. PLAN ENGINE

### Función
Generar un PLAN estructurado con fases, tareas, recursos, validaciones, checkpoints, recuperación y artefactos esperados.

### Mini diagrama horizontal
**REQUIREMENTS ➡️ PLAN ENGINE ➡️ PHASES ➡️ TASKS ➡️ RESOURCES ➡️ VALIDATION PLAN**

### Código a programar
`planner.py, models/plan.py, planning/plan_validator.py`

### Contratos / objetos principales
Plan, Phase, PlannedTask, ExpectedArtifact, RecoveryPolicy

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
plan determinista, referencias válidas, no perder requisitos, plan versioning

### Estimación de código
- **Implementación:** ~400–700 LOC
- **Tests:** ~250–400 LOC
- **Total capa:** ~650–1,100 LOC

---


## 06. TASK DAG

### Función
Representar dependencias, desbloqueos, paralelismo y evolución del grafo cuando aparece nueva información.

### Mini diagrama horizontal
**PLAN ➡️ TASK DAG ➡️ READY/BLOCKED/PARALLEL ➡️ SCHEDULER**

### Código a programar
`task_dag.py, scheduler/dependency_graph.py, models/task_edge.py`

### Contratos / objetos principales
TaskNode, TaskEdge, DAGVersion, DependencyState

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
ciclos inválidos, topological order, desbloqueos, DAG versioning, insertions

### Estimación de código
- **Implementación:** ~450–750 LOC
- **Tests:** ~300–450 LOC
- **Total capa:** ~750–1,200 LOC

---


## 07. TASK FUNNEL

### Función
Reducir proyecto→fase→goal→task→subtask→work unit hasta una unidad manejable por la LLM.

### Mini diagrama horizontal
**PROJECT ➡️ PHASE ➡️ GOAL ➡️ TASK ➡️ SUBTASK ➡️ WORK UNIT ➡️ LLM CALL**

### Código a programar
`task_funnel.py, decomposition/work_unit_builder.py`

### Contratos / objetos principales
WorkUnit, DecompositionRule, FunnelLevel, DiscoveryDelta

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
descomposición, recomposición, discovery→new task, límites de tamaño

### Estimación de código
- **Implementación:** ~350–600 LOC
- **Tests:** ~250–350 LOC
- **Total capa:** ~600–950 LOC

---


## 08. TASK CONTRACT

### Función
Congelar para cada tarea su input, contexto, herramientas, worker, schema, éxito, retry, timeout y escalamiento.

### Mini diagrama horizontal
**TASK ➡️ TASK CONTRACT ➡️ VALIDATE ➡️ READY**

### Código a programar
`contracts/task_contract.py, validation/task_contract_validator.py`

### Contratos / objetos principales
TaskContract, ToolPermission, RetryPolicy, SuccessPolicy, TimeoutPolicy

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
campos obligatorios, permisos, contract version, invalid contract blocks execution

### Estimación de código
- **Implementación:** ~250–450 LOC
- **Tests:** ~200–300 LOC
- **Total capa:** ~450–750 LOC

---


## 09. MEMORY INGESTION

### Función
Recibir documentos, código, chats, outputs, artefactos, eventos y checkpoints, asignando IDs estables y procedencia.

### Mini diagrama horizontal
**SOURCE ➡️ INGESTION ➡️ OBJECT ID ➡️ REGISTRY ➡️ PERSISTENCE**

### Código a programar
`memory/ingestion.py, memory/document_registry.py, adapters/*`

### Contratos / objetos principales
MemoryObject, SourceObject, DocumentRecord, IngestionReceipt

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
idempotencia, duplicados, source hash, errores parciales, reingesta

### Estimación de código
- **Implementación:** ~500–900 LOC
- **Tests:** ~300–500 LOC
- **Total capa:** ~800–1,400 LOC

---


## 10. NORMALIZATION + VERSIONING

### Función
Normalizar sin destruir la fuente original; cada derivado conserva pointer, versión, hash y provenance.

### Mini diagrama horizontal
**RAW ➡️ NORMALIZE ➡️ IDENTIFY ➡️ CLASSIFY ➡️ VERSION ➡️ INDEX**

### Código a programar
`memory/normalizer.py, versioning/version_store.py, hashing/content_hash.py`

### Contratos / objetos principales
NormalizedObject, VersionRef, Provenance, ContentHash

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
original intacto, deterministic normalization, version chain, provenance

### Estimación de código
- **Implementación:** ~450–800 LOC
- **Tests:** ~300–450 LOC
- **Total capa:** ~750–1,250 LOC

---


## 11. CHUNKING INTELIGENTE

### Función
Segmentar por semántica, estructura, secciones, entidades, funciones, clases, requisitos y dependencias, no solo por tokens.

### Mini diagrama horizontal
**DOCUMENT ➡️ STRUCTURE PARSE ➡️ SEMANTIC CHUNKS ➡️ SOURCE POINTERS**

### Código a programar
`memory/chunking.py, parsers/code_parser.py, parsers/document_parser.py`

### Contratos / objetos principales
Chunk, ChunkBoundary, StructuralRef, TokenSpan

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
reconstrucción, overlap controlado, code boundaries, section lineage

### Estimación de código
- **Implementación:** ~500–900 LOC
- **Tests:** ~300–500 LOC
- **Total capa:** ~800–1,400 LOC

---


## 12. TAG + RELATION ENGINE

### Función
Indexar objetos con tags y relaciones SUPPORTS, CONTRADICTS, DEPENDS_ON, DERIVED_FROM, IMPLEMENTS, VALIDATES, SUPERSEDES y RELATED_TO.

### Mini diagrama horizontal
**OBJECT ➡️ TAGS + ENTITIES + RELATIONS ➡️ GRAPH/INDEX**

### Código a programar
`memory/tags.py, graph/relations.py, graph/schema.py`

### Contratos / objetos principales
Tag, Entity, Relation, RelationType, RelationEvidence

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
relaciones válidas, dedup, inverse edges, provenance por edge

### Estimación de código
- **Implementación:** ~500–800 LOC
- **Tests:** ~300–450 LOC
- **Total capa:** ~800–1,250 LOC

---


## 13. MEMORY LAYERS

### Función
Separar L0 raw, L1 working, L2 task, L3 project y L4 long-term sin sustituir nunca la fuente original.

### Mini diagrama horizontal
**L0 RAW ➡️ L1 WORKING ➡️ L2 TASK ➡️ L3 PROJECT ➡️ L4 LONG-TERM**

### Código a programar
`memory/layers.py, memory/tiering.py, memory/store.py`

### Contratos / objetos principales
MemoryLayer, MemoryRef, PromotionRule, RetentionPolicy

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
promotion/demotion, source preservation, tier routing, retention

### Estimación de código
- **Implementación:** ~600–1,000 LOC
- **Tests:** ~400–600 LOC
- **Total capa:** ~1,000–1,600 LOC

---


## 14. HYBRID RETRIEVAL

### Función
Combinar búsqueda léxica, semántica, tags, entidad, grafo, temporal, tarea, evidencia e historial; luego rerank y filter.

### Mini diagrama horizontal
**QUERY ➡️ MULTI-SEARCH ➡️ CANDIDATES ➡️ RERANK ➡️ FILTER ➡️ RESULT SET**

### Código a programar
`retrieval/hybrid.py, retrieval/lexical.py, retrieval/semantic.py, retrieval/graph.py, retrieval/reranker.py`

### Contratos / objetos principales
RetrievalQuery, Candidate, RetrievalScore, EvidenceFilter, RankedResult

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
precision/recall fixtures, dedup, stale exclusion, deterministic filters, fallbacks

### Estimación de código
- **Implementación:** ~900–1,500 LOC
- **Tests:** ~600–900 LOC
- **Total capa:** ~1,500–2,400 LOC

---


## 15. CONTEXT FABRIC

### Función
Construir el contexto mínimo suficiente para la tarea actual en vez de devolver documentos indiscriminadamente.

### Mini diagrama horizontal
**TASK NEED ➡️ RETRIEVE ➡️ RERANK ➡️ AUDIT ➡️ RELATE ➡️ CONTEXT PACK**

### Código a programar
`context/context_fabric.py, context/context_pack.py, context/compiler.py`

### Contratos / objetos principales
ContextPack, ContextSection, ContextEvidence, ContextProvenance

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
minimal sufficient context, provenance, no forbidden memory, reproducibilidad

### Estimación de código
- **Implementación:** ~800–1,300 LOC
- **Tests:** ~500–800 LOC
- **Total capa:** ~1,300–2,100 LOC

---


## 16. CONTEXT BUDGET + PRIORITIES

### Función
Calcular límite del modelo, reserva de output, pinned tokens, memory budget y safety margin; recortar primero P8→P7 antes de P0–P4.

### Mini diagrama horizontal
**CANDIDATE CONTEXT ➡️ TOKEN BUDGET ➡️ PRIORITY ➡️ TRIM ➡️ FINAL PACK**

### Código a programar
`context/budget.py, context/priorities.py`

### Contratos / objetos principales
ContextBudget, PriorityClass, TokenAllocation, TrimDecision

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
hard limit, reserved output, priority preservation, overflow behavior

### Estimación de código
- **Implementación:** ~350–600 LOC
- **Tests:** ~250–350 LOC
- **Total capa:** ~600–950 LOC

---


## 17. INPUT BLOCK + PINS + CARRY

### Función
Compilar Master Input, goal, task, contract, evidencia, state, consolidation, open questions, constraints, pins y carry-forward.

### Mini diagrama horizontal
**MASTER + TASK + MEMORY + PINS + CARRY ➡️ INPUT BLOCK ➡️ LLM**

### Código a programar
`context/input_block.py, continuity/pins.py, continuity/carry_forward.py`

### Contratos / objetos principales
InputBlock, PinnedContext, CarryForwardState, OpenQuestionRef

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
pins sobreviven, carry compacto, superseded excluded, exact contract injection

### Estimación de código
- **Implementación:** ~450–750 LOC
- **Tests:** ~300–450 LOC
- **Total capa:** ~750–1,200 LOC

---


## 18. RESOURCE BRAIN + ROUTER

### Función
Registrar modelos, APIs, tools, datasets, skills, workers y sandboxes; seleccionar por capacidad, salud, autorización, coste, latencia y policy.

### Mini diagrama horizontal
**TASK CONTRACT ➡️ RESOURCE BRAIN ➡️ HEALTH/AUTH ➡️ ROUTER ➡️ RESOURCE**

### Código a programar
`resources/registry.py, resources/health.py, routing/router.py, routing/policy.py`

### Contratos / objetos principales
Resource, Capability, HealthState, AuthorizationState, RouteDecision

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
REGISTERED≠AVAILABLE, AVAILABLE≠AUTHORIZED, degraded fallback, deterministic policies

### Estimación de código
- **Implementación:** ~650–1,100 LOC
- **Tests:** ~400–700 LOC
- **Total capa:** ~1,050–1,800 LOC

---


## 19. SANDBOX

### Función
Aislar cada work unit con policy, permisos, estado local, memoria, cache, event log, checkpoints, branches, artifacts y evidence.

### Mini diagrama horizontal
**WORK UNIT ➡️ CREATE SANDBOX ➡️ EXECUTE ➡️ CAPTURE OUTPUT ➡️ CLOSE/RESUME**

### Código a programar
`sandbox/manager.py, sandbox/state.py, sandbox/permissions.py, sandbox/artifacts.py`

### Contratos / objetos principales
Sandbox, SandboxState, CapabilitySet, LocalArtifact, SandboxCheckpoint

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
aislamiento, resume, permissions, cleanup, failure containment

### Estimación de código
- **Implementación:** ~900–1,500 LOC
- **Tests:** ~600–900 LOC
- **Total capa:** ~1,500–2,400 LOC

---


## 20. WORKER / LLM CONTRACT

### Función
Ejecutar la unidad cognitiva asignada sin permitir que el Worker controle flujo global, memoria canónica o finalización.

### Mini diagrama horizontal
**INPUT BLOCK + CONTRACT ➡️ WORKER ➡️ STRUCTURED OUTPUT**

### Código a programar
`workers/base.py, workers/llm_worker.py, workers/tool_worker.py`

### Contratos / objetos principales
WorkerRequest, WorkerResult, ToolCallResult, WorkerCapabilities

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
worker cannot global-write, timeout, malformed output, tool errors

### Estimación de código
- **Implementación:** ~500–800 LOC
- **Tests:** ~300–500 LOC
- **Total capa:** ~800–1,300 LOC

---


## 21. OUTPUT NORMALIZER + SCHEMA

### Función
Normalizar la salida y validar su schema antes de aceptar cualquier delta o artefacto.

### Mini diagrama horizontal
**LLM OUTPUT ➡️ NORMALIZER ➡️ SCHEMA VALIDATION ➡️ ACCEPT/REJECT**

### Código a programar
`output/normalizer.py, output/schema_validator.py, schemas/*.json`

### Contratos / objetos principales
NormalizedOutput, ValidationError, OutputSchemaVersion

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
invalid JSON, missing fields, coercion prohibited, schema versions

### Estimación de código
- **Implementación:** ~350–600 LOC
- **Tests:** ~250–350 LOC
- **Total capa:** ~600–950 LOC

---


## 22. STATE DELTA

### Función
Permitir a la LLM proponer únicamente cambios candidatos; el Runtime valida y aplica sobre el estado anterior.

### Mini diagrama horizontal
**OLD STATE + CANDIDATE DELTA ➡️ VALIDATE ➡️ APPLY/REJECT ➡️ NEW STATE**

### Código a programar
`state/delta.py, state/apply_delta.py, state/delta_validator.py`

### Contratos / objetos principales
StateDelta, DeltaOperation, DeltaValidation, StateVersion

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
atomic apply, rollback on partial failure, version conflict, illegal operation

### Estimación de código
- **Implementación:** ~450–700 LOC
- **Tests:** ~300–450 LOC
- **Total capa:** ~750–1,150 LOC

---


## 23. CLAIMS + EVIDENCE GRAPH

### Función
Mantener claims como UNVERIFIED/SUPPORTED/CONFLICTED/VALIDATED/REJECTED/SUPERSEDED y enlazarlos a fuentes y evidencia.

### Mini diagrama horizontal
**CLAIM ➡️ SOURCE/EVIDENCE ➡️ AUDIT ➡️ STATUS ➡️ REQUIREMENT/RELATION**

### Código a programar
`evidence/claims.py, evidence/ledger.py, graph/evidence_graph.py`

### Contratos / objetos principales
Claim, Evidence, ClaimStatus, EvidenceStrength, ProvenanceRef

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
no evidence=no verified fact, contradiction, supersession, broken source

### Estimación de código
- **Implementación:** ~700–1,200 LOC
- **Tests:** ~500–750 LOC
- **Total capa:** ~1,200–1,950 LOC

---


## 24. SENTINEL

### Función
Observar desviación de objetivo, scope drift, policy violations, loops, output inválido, ausencia de evidencia y estancamiento.

### Mini diagrama horizontal
**EVENT STREAM ➡️ SENTINEL ➡️ RULE MATCH ➡️ OK/ANOMALY**

### Código a programar
`control/sentinel.py, control/anomaly_rules.py`

### Contratos / objetos principales
AnomalyEvent, SentinelRule, Severity

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
detección positiva/negativa, duplicate alerts, rule versioning

### Estimación de código
- **Implementación:** ~350–600 LOC
- **Tests:** ~250–350 LOC
- **Total capa:** ~600–950 LOC

---


## 25. SHERIFF

### Función
Aplicar acciones deterministas: block, pause, reject, retry, rollback, branch, strategy change o escalate.

### Mini diagrama horizontal
**ANOMALY/POLICY EVENT ➡️ SHERIFF ➡️ CONTROL ACTION**

### Código a programar
`control/sheriff.py, control/interventions.py`

### Contratos / objetos principales
ControlAction, InterventionReason, AuthorizationCheck

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
no blind actions, permitted transitions, audit trail, fail-closed

### Estimación de código
- **Implementación:** ~350–600 LOC
- **Tests:** ~250–350 LOC
- **Total capa:** ~600–950 LOC

---


## 26. WATCHDOG

### Función
Vigilar tiempo, retries, consumo, repetición, falta de progreso, workers bloqueados y sandboxes congelados.

### Mini diagrama horizontal
**TELEMETRY ➡️ WATCHDOG ➡️ STALL/LOOP/RESOURCE EVENT ➡️ REPLAN/ESCALATE**

### Código a programar
`control/watchdog.py, telemetry/progress_monitor.py`

### Contratos / objetos principales
WatchdogState, StallEvent, RetryCounter, ResourceBudget

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
stall detection, false positive limits, retry caps, progress reset

### Estimación de código
- **Implementación:** ~350–600 LOC
- **Tests:** ~250–350 LOC
- **Total capa:** ~600–950 LOC

---


## 27. AUDIT ENGINE

### Función
Auditar cobertura, requisitos, evidencia, contradicciones, dependencias, consistencia, omisiones, trazabilidad y scope.

### Mini diagrama horizontal
**ARTIFACT/STATE ➡️ MULTI-AUDIT ➡️ FINDINGS ➡️ REPAIR TASKS**

### Código a programar
`audit/engine.py, audit/requirements.py, audit/evidence.py, audit/contradictions.py, audit/traceability.py`

### Contratos / objetos principales
AuditResult, AuditFinding, AuditType, RepairRecommendation

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
six-perspective fixtures, evidence gaps, omissions, inconsistent state

### Estimación de código
- **Implementación:** ~750–1,300 LOC
- **Tests:** ~500–800 LOC
- **Total capa:** ~1,250–2,100 LOC

---


## 28. JUDGE

### Función
Determinar PASS, FAIL, REPAIR, ESCALATE o HUMAN_REQUIRED a partir de criterios objetivos y auditoría.

### Mini diagrama horizontal
**VALIDATED OUTPUT + AUDIT ➡️ JUDGE ➡️ VERDICT**

### Código a programar
`validation/judge.py, validation/verdict.py`

### Contratos / objetos principales
JudgeVerdict, VerdictReason, CompletionEvidence

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
model says done ≠ pass, critical gap blocks, deterministic precedence

### Estimación de código
- **Implementación:** ~300–500 LOC
- **Tests:** ~200–300 LOC
- **Total capa:** ~500–800 LOC

---


## 29. LOCAL CONSOLIDATOR

### Función
Convertir work units en Task Result y Task Consolidation integrando facts, evidence, decisiones, artefactos y contradicciones.

### Mini diagrama horizontal
**WORK UNIT RESULTS ➡️ LOCAL CONSOLIDATION ➡️ TASK RESULT**

### Código a programar
`consolidation/local.py, consolidation/task_result.py`

### Contratos / objetos principales
TaskConsolidation, LocalFinding, LocalConflict, IntegrationTarget

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
no invention, conflicting findings preserved, source refs complete

### Estimación de código
- **Implementación:** ~500–850 LOC
- **Tests:** ~350–500 LOC
- **Total capa:** ~850–1,350 LOC

---


## 30. GLOBAL CONSOLIDATOR

### Función
Integrar Task→Phase→Project→Final sin reducir el proyecto a un único resumen; mantener relaciones globales.

### Mini diagrama horizontal
**LOCAL A+B+C ➡️ GLOBAL CONSOLIDATOR ➡️ GLOBAL STATE + INTEGRATION MAP**

### Código a programar
`consolidation/global_.py, integration/integration_map.py`

### Contratos / objetos principales
GlobalConsolidation, IntegrationMap, GlobalIssue, GlobalDecision

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
partial results, cross-task conflicts, missing integration targets, deterministic merge

### Estimación de código
- **Implementación:** ~800–1,400 LOC
- **Tests:** ~600–900 LOC
- **Total capa:** ~1,400–2,300 LOC

---


## 31. MEMORY UPDATE + HISTORY

### Función
Aplicar únicamente deltas validados y registrar eventos de ingestión, retrieval, claim, conflict, consolidation, checkpoint y rollback.

### Mini diagrama horizontal
**VALIDATED DELTA ➡️ MEMORY vN+1 ➡️ EVENT ➡️ INDEX/GRAPH UPDATE**

### Código a programar
`memory/update.py, events/event_store.py, history/history.py`

### Contratos / objetos principales
MemoryUpdate, Event, EventType, HistoryCursor

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
append-only behavior, replay, ordering, failed update no event-commit

### Estimación de código
- **Implementación:** ~500–850 LOC
- **Tests:** ~350–500 LOC
- **Total capa:** ~850–1,350 LOC

---


## 32. CHECKPOINT ENGINE

### Función
Guardar estado, task state, memory version, artifacts, consolidation, audit y next action como punto recuperable.

### Mini diagrama horizontal
**VALID STATE ➡️ CHECKPOINT ➡️ VERIFY SNAPSHOT ➡️ CONTINUE**

### Código a programar
`checkpoint/engine.py, checkpoint/snapshot.py, checkpoint/restore.py`

### Contratos / objetos principales
Checkpoint, SnapshotManifest, RestorePlan, CheckpointHash

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
create/restore/replay, corrupt checkpoint, compatibility, exact version refs

### Estimación de código
- **Implementación:** ~650–1,100 LOC
- **Tests:** ~450–700 LOC
- **Total capa:** ~1,100–1,800 LOC

---


## 33. RETRY + FAILURE ANALYSIS

### Función
Impedir retries ciegos: cada fallo debe producir análisis y un delta de estrategia antes del nuevo intento.

### Mini diagrama horizontal
**ATTEMPT ➡️ FAIL ➡️ ANALYZE ➡️ STRATEGY DELTA ➡️ RETRY/ESCALATE**

### Código a programar
`recovery/retry.py, recovery/failure_analysis.py, recovery/strategy.py`

### Contratos / objetos principales
FailureRecord, StrategyDelta, RetryDecision

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
same-strategy rejection, retry caps, transient/permanent classification

### Estimación de código
- **Implementación:** ~350–600 LOC
- **Tests:** ~250–350 LOC
- **Total capa:** ~600–950 LOC

---


## 34. ROLLBACK

### Función
Localizar último checkpoint válido, restaurar estado cognitivo y continuar mediante reparación o branch.

### Mini diagrama horizontal
**INVALID STATE ➡️ LAST VALID CP ➡️ ROLLBACK ➡️ REPAIR/BRANCH ➡️ CONTINUE**

### Código a programar
`recovery/rollback.py, recovery/impact_scope.py`

### Contratos / objetos principales
RollbackPlan, RestoreResult, AffectedObjects

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
rollback exactness, dependent invalidation, replay after restore

### Estimación de código
- **Implementación:** ~500–800 LOC
- **Tests:** ~300–500 LOC
- **Total capa:** ~800–1,300 LOC

---


## 35. BRANCHING

### Función
Ejecutar estrategias A/B/C aisladas y promover solo una rama validada al estado canónico.

### Mini diagrama horizontal
**PLAN A/B/C ➡️ ISOLATED BRANCHES ➡️ COMPARE ➡️ JUDGE ➡️ PROMOTE**

### Código a programar
`branching/manager.py, branching/compare.py, branching/promote.py`

### Contratos / objetos principales
Branch, BranchState, BranchComparison, PromotionDecision

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
isolation, no cross contamination, promotion conflict, discard/archive

### Estimación de código
- **Implementación:** ~450–750 LOC
- **Tests:** ~300–450 LOC
- **Total capa:** ~750–1,200 LOC

---


## 36. MULTI-WORKER / MULTI-MODEL

### Función
Despachar investigación, análisis, implementación, contradicción, verificación y síntesis a Workers especializados con contrato común.

### Mini diagrama horizontal
**TASK DAG ➡️ WORKERS A..N ➡️ LOCAL RESULTS ➡️ NORMALIZER ➡️ CONSOLIDATOR**

### Código a programar
`workers/pool.py, scheduler/dispatcher.py, workers/normalization_bus.py`

### Contratos / objetos principales
WorkerPool, DispatchDecision, WorkerLease, NormalizedWorkerResult

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
parallel completion order, worker failure, duplicates, heterogeneous outputs

### Estimación de código
- **Implementación:** ~650–1,100 LOC
- **Tests:** ~450–700 LOC
- **Total capa:** ~1,100–1,800 LOC

---


## 37. CONVERGENCE ENGINE

### Función
Medir progreso, cobertura, errores, contradicciones, pendientes e incertidumbre para decidir continuar, cambiar estrategia o escalar.

### Mini diagrama horizontal
**LOOP STATE ➡️ METRICS ➡️ CONTINUE / CHANGE STRATEGY / ESCALATE**

### Código a programar
`control/convergence.py, metrics/progress.py`

### Contratos / objetos principales
ConvergenceMetrics, ProgressDelta, ConvergenceDecision

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
no-progress, oscillation, false progress, threshold boundaries

### Estimación de código
- **Implementación:** ~450–750 LOC
- **Tests:** ~300–450 LOC
- **Total capa:** ~750–1,200 LOC

---


## 38. AUTO-RESEARCH

### Función
Convertir UNKNOWN en research task, enrutar recurso, recuperar evidencia, auditarla y devolverla a la tarea original.

### Mini diagrama horizontal
**UNKNOWN ➡️ RESEARCH TASK ➡️ ROUTER ➡️ WORKER ➡️ EVIDENCE ➡️ AUDIT ➡️ ORIGINAL TASK**

### Código a programar
`research/engine.py, research/task_factory.py, research/evidence_ingest.py`

### Contratos / objetos principales
ResearchTask, ResearchFinding, SourceRef, EvidenceReceipt

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
no-source fail-closed, duplicate research, stale source, return-to-parent

### Estimación de código
- **Implementación:** ~500–850 LOC
- **Tests:** ~350–500 LOC
- **Total capa:** ~850–1,350 LOC

---


## 39. CONTINUOUS EXECUTION LOOP

### Función
Orquestar get next task→context→sandbox→execute→validate→state→checkpoint→consolidate→next task sin depender de otro prompt humano.

### Mini diagrama horizontal
**NEXT TASK ➡️ CONTEXT ➡️ SANDBOX ➡️ EXECUTE ➡️ VALIDATE ➡️ STATE ➡️ CHECKPOINT ➡️ LOOP**

### Código a programar
`runtime/loop.py, runtime/executor.py, runtime/next_action.py`

### Contratos / objetos principales
LoopState, ExecutionCycle, NextAction, LoopDecision

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
resume after crash, no runnable tasks, blocked graph, deterministic transitions

### Estimación de código
- **Implementación:** ~700–1,200 LOC
- **Tests:** ~500–750 LOC
- **Total capa:** ~1,200–1,950 LOC

---


## 40. STOP CONDITIONS

### Función
Detener únicamente por COMPLETE, conflicto crítico, falta de autorización, policy violation, límites, fallo persistente o intervención humana.

### Mini diagrama horizontal
**LOOP ➡️ STOP CHECK ➡️ CONTINUE/REPAIR/ESCALATE/HUMAN_REQUIRED/COMPLETE**

### Código a programar
`runtime/stop_conditions.py, runtime/termination_policy.py`

### Contratos / objetos principales
StopReason, TerminationDecision, LimitState

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
priority among stop reasons, no model-controlled completion, explicit limits

### Estimación de código
- **Implementación:** ~250–400 LOC
- **Tests:** ~150–250 LOC
- **Total capa:** ~400–650 LOC

---


## 41. COVERAGE MATRIX

### Función
Demostrar el camino Requirement→Task→Artifact→Evidence→Validation y crear repair task si falta cualquier enlace.

### Mini diagrama horizontal
**REQUIREMENT ➡️ TASK ➡️ ARTIFACT ➡️ EVIDENCE ➡️ VALIDATION ➡️ COVERED/GAP**

### Código a programar
`coverage/matrix.py, coverage/gap_detector.py`

### Contratos / objetos principales
CoverageRow, CoverageStatus, CoverageGap

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
missing artifact/evidence/validation, superseded requirement, duplicates

### Estimación de código
- **Implementación:** ~450–750 LOC
- **Tests:** ~300–450 LOC
- **Total capa:** ~750–1,200 LOC

---


## 42. TOP-DOWN ↔ BOTTOM-UP CROSS-CHECK

### Función
Comparar Goals→Requirements→Tasks→Artifacts contra Artifacts→Tasks→Requirements→Goals para detectar huecos o piezas sin propósito.

### Mini diagrama horizontal
**TOP-DOWN ↔ BOTTOM-UP ➡️ COMPARE ➡️ CONSISTENT/GAP**

### Código a programar
`coverage/cross_check.py, integration/reconstruction.py`

### Contratos / objetos principales
CrossCheckResult, OrphanArtifact, MissingImplementation

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
orphan artifacts, unmet goals, wrong links, cyclic trace

### Estimación de código
- **Implementación:** ~450–750 LOC
- **Tests:** ~300–450 LOC
- **Total capa:** ~750–1,200 LOC

---


## 43. FIVE-PASS PREBUILD AUDITOR

### Función
Implementar las cinco pasadas: Extraction, Classification, Cross Reference, Architectural Mapping y Prebuild Gap Audit; bloquear build si falta un crítico.

### Mini diagrama horizontal
**SOURCES ➡️ PASS1 ➡️ PASS2 ➡️ PASS3 ➡️ PASS4 ➡️ PASS5 ➡️ BUILD GATE**

### Código a programar
`audit/prebuild.py, audit/passes/*.py, audit/build_gate.py`

### Contratos / objetos principales
PrebuildAudit, CoverageMatrix, OwnershipMap, BuildGateDecision

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
each pass completeness, critical conflicts, missing ownership, gate fail-closed

### Estimación de código
- **Implementación:** ~700–1,200 LOC
- **Tests:** ~500–750 LOC
- **Total capa:** ~1,200–1,950 LOC

---


## 44. FINAL AUDIT

### Función
Ejecutar auditorías finales de requirements, evidence, contradictions, coverage y traceability antes de la consolidación final.

### Mini diagrama horizontal
**AUDIT REQUIREMENTS ➡️ EVIDENCE ➡️ CONTRADICTIONS ➡️ COVERAGE ➡️ TRACEABILITY**

### Código a programar
`audit/final.py, audit/final_requirements.py, audit/final_traceability.py`

### Contratos / objetos principales
FinalAuditReport, CriticalFinding, ClosureBlocker

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
each audit blocks correctly, unresolved critical finding, report reproducibility

### Estimación de código
- **Implementación:** ~500–850 LOC
- **Tests:** ~350–500 LOC
- **Total capa:** ~850–1,350 LOC

---


## 45. FINALIZATION / GLOBAL JUDGE

### Función
Cerrar únicamente cuando cobertura, contradicciones, requisitos, consolidación y validación global estén satisfechos; producir certificado de cierre.

### Mini diagrama horizontal
**TASK COMPLETION ➡️ GLOBAL AUDIT ➡️ CONSOLIDATION ➡️ FINAL VALIDATION ➡️ FINAL OUTPUT**

### Código a programar
`finalization/engine.py, finalization/certificate.py`

### Contratos / objetos principales
FinalizationState, ClosureCertificate, FinalArtifactManifest

### Estrategia de programación
1. Definir tipos y schemas.
2. Implementar lógica pura cuando sea posible.
3. Añadir repositorio/adaptador detrás de interface.
4. Emitir eventos de entrada, decisión y salida.
5. Bloquear transición si falla schema, policy o invariant.
6. Integrar solo después de unit tests.

### Pruebas mínimas
incomplete cannot close, certificate hashes, closed_unverified vs verified_closed

### Estimación de código
- **Implementación:** ~400–700 LOC
- **Tests:** ~250–400 LOC
- **Total capa:** ~650–1,100 LOC

---

# PARTE III — MAGNITUD ESTIMADA DEL NÚCLEO

- **Código funcional:** ~22,050–37,250 LOC
- **Tests:** ~14,800–22,500 LOC
- **Núcleo + tests:** **~36,850–59,750 LOC**

No incluye adapters específicos de proveedores, migrations, SDK generado, frontend rico, CI/CD ni infraestructura como código.

Estimación adicional:
- **API:** +1,500–3,000 LOC
- **UI mínima:** +2,500–5,000 LOC
- **Ops/observabilidad/migrations/CLI:** +1,000–2,000 LOC
- **V1 robusta total estimada:** **~41,850–69,750 LOC**

> Las LOC son rangos de planificación, no un KPI de calidad.

---


# PARTE IV — PLAN DE PROGRAMACIÓN CANÓNICO EN 23 FASES

## FASE 01 — CORE STATE MODEL
**Objetivo:** fuente de verdad de estados.  
**Código:** `state/models.py`, `state/version.py`, `state/repository.py`, `state/invariants.py`.  
**Gate:** `STATE MODEL + INVARIANTS + TESTS = PASS`.  
**LOC:** 700–1,200 implementación + 450–750 tests.

**INPUT ➡️ STATE OBJECT ➡️ VALIDATE ➡️ VERSION ➡️ STORE**

## FASE 02 — EVENT MODEL
**Objetivo:** historial reproducible.  
**Código:** `events/models.py`, `events/store.py`, `events/replay.py`, `events/hash_chain.py`.  
**Gate:** `event replay ➡️ mismo estado`.  
**LOC:** 600–1,000 + 400–650 tests.

**ACTION ➡️ EVENT ➡️ APPEND-ONLY STORE ➡️ REPLAY ➡️ STATE**

## FASE 03 — TASK MODEL
**Objetivo:** task/subtask/work unit/dependencias/prioridad/progreso.  
**Gate:** DAG válido, ciclos rechazados, READY calculado correctamente.  
**LOC:** 650–1,100 + 450–700 tests.

## FASE 04 — TASK CONTRACT
Una tarea sin `input + objective + constraints + tools + output_schema + success + retry + timeout` no entra en READY.  
**LOC:** 300–500 + 200–350 tests.

## FASE 05 — STATE MACHINE
**CREATED ➡️ PLANNED ➡️ READY ➡️ RUNNING ➡️ VERIFYING ➡️ CONSOLIDATING ➡️ VALIDATED ➡️ COMPLETE**  
Laterales: `BLOCKED | CONFLICT | REPAIR | REPLAN | ESCALATED | HUMAN_REQUIRED`.  
La LLM no cambia el estado directamente.  
**LOC:** 500–800 + 350–550 tests.

## FASE 06 — CHECKPOINT ENGINE
Checkpoint referencia state, memory, task, artifacts, evidence, consolidation, audit y next action.  
**Gate:** **CHECKPOINT ➡️ CRASH SIMULADO ➡️ RESTORE ➡️ HASH EQUIVALENTE**  
**LOC:** 650–1,100 + 450–700 tests.

## FASE 07 — POLICY ENGINE
Reglas mínimas:
- Master Input immutable.
- Worker no escribe Global State.
- Claim sin evidence no es VERIFIED.
- Critical conflict bloquea cierre.
- Invalid schema bloquea update.
- No checkpoint bloquea long-running continuation.

**LOC:** 500–900 + 350–600 tests.

## FASE 08 — MEMORY CONTRACT
Interfaces: `GET_MEMORY`, `GET_STATE`, `GET_HISTORY`, `SAVE_STATE_DELTA`, `SAVE_ARTIFACT`, `SAVE_CLAIM`, `SAVE_EVIDENCE`, `SAVE_CONSOLIDATION`.  
**LOC:** 550–900 + 350–550 tests.

## FASE 09 — RETRIEVAL CONTRACT
Debe soportar lexical + semantic + tag + graph + entity + temporal + task + evidence + history.  
**LOC:** 450–750 + 300–500 tests.

## FASE 10 — CONTEXT FABRIC
Produce `CONTEXT PACK`, no una lista de documentos.  
Incluye relevant memory, evidence, relations, state, consolidation, open questions, provenance, confidence y budget.  
**Gate:** pack reproducible y dentro del límite.  
**LOC:** 900–1,500 + 600–900 tests.

## FASE 11 — SANDBOX CONTRACT
`create ➡️ load ➡️ execute ➡️ write local artifact ➡️ checkpoint ➡️ resume ➡️ close`  
**LOC:** 650–1,000 + 450–650 tests.

## FASE 12 — WORKER CONTRACT
Entrada: `TaskContract + InputBlock + CapabilitySet`  
Salida: `StructuredOutput + ToolResults + CandidateStateDelta + EvidenceRefs`  
**LOC:** 450–750 + 300–500 tests.

## FASE 13 — OUTPUT SCHEMA
Campos: findings, decisions, evidence, contradictions, questions, artifact refs, candidate delta, status.  
**LOC:** 300–550 + 250–400 tests.

## FASE 14 — AUDIT ENGINE
Auditorías: omissions, contradictions, evidence, requirements, dependencies, scope, traceability.  
**LOC:** 900–1,500 + 600–900 tests.

## FASE 15 — CONSOLIDATOR
**LOCAL CONSOLIDATION ➡️ GLOBAL CONSOLIDATION**  
Si A=X y A=Y ➡️ `CONFLICT`, nunca overwrite silencioso.  
**LOC:** 900–1,500 + 650–950 tests.

## FASE 16 — ROUTER
Decisión por capability + health + authorization + cost + latency + context + specialization + policy.  
**REGISTERED ≠ AVAILABLE ≠ AUTHORIZED**  
**LOC:** 600–1,000 + 400–650 tests.

## FASE 17 — CONTINUOUS LOOP
**GET NEXT TASK ➡️ GET CONTEXT ➡️ SANDBOX ➡️ EXECUTE ➡️ VALIDATE ➡️ UPDATE ➡️ CHECKPOINT ➡️ CONSOLIDATE ➡️ NEXT TASK**  
La LLM termina una iteración; el Runtime decide si termina la tarea.  
**LOC:** 700–1,200 + 500–750 tests.

## FASE 18 — RECOVERY
**FAIL ➡️ FAILURE ANALYSIS ➡️ STRATEGY DELTA ➡️ RETRY**  
Nunca: **FAIL ➡️ MISMO INTENTO**  
Debe incluir retry, rollback, branch y escalation.  
**LOC:** 850–1,400 + 550–850 tests.

## FASE 19 — RESOURCE BRAIN
Estados: `DISCOVERED ➡️ REGISTERED ➡️ CONFIGURED ➡️ REACHABLE ➡️ HEALTHY ➡️ AUTHORIZED ➡️ AVAILABLE`, más `DEGRADED | UNAVAILABLE`.  
**LOC:** 600–1,000 + 400–650 tests.

## FASE 20 — GLOBAL INTEGRATION

Objeto canónico recomendado:

```json
{
  "requirements": {},
  "tasks": {},
  "artifacts": {},
  "dependencies": {},
  "decisions": {},
  "contradictions": {},
  "evidence": {},
  "coverage": {},
  "unresolved": {},
  "integration_status": {},
  "reconstruction_status": {}
}
```

**NO COMPLETE si `integration_status != VALIDATED`**  
**LOC:** 900–1,500 + 650–950 tests.

## FASE 21 — FIVE-PASS BUILD AUDITOR
1. EXTRACTION
2. CLASSIFICATION
3. CROSS_REFERENCE
4. ARCHITECTURAL MAPPING
5. PREBUILD GAP AUDIT

Outputs:
- coverage matrix;
- missing requirements;
- unresolved conflicts;
- ownership map;
- implementation dependencies;
- final checklist.

**LOC:** 700–1,200 + 500–750 tests.

## FASE 22 — API
No debe contener lógica de negocio principal.  
Endpoints: submit Master Input, inspect state/task/DAG/context/evidence/checkpoint, execute/pause/resume, audit y final status.  
**LOC:** 1,500–3,000.

## FASE 23 — UI
Pantallas: Project/Run overview, DAG, Current Task, Memory/Evidence, Integration State, Checkpoints, Audit/GAPs, Resource Health y Finalization Certificate.  
**LOC:** 2,500–5,000.

---

# PARTE V — ESTRUCTURA DE REPOSITORIO PROPUESTA

```text
ccee/
├── contracts/
├── state/
├── events/
├── goals/
├── requirements/
├── planning/
├── tasks/
├── memory/
├── retrieval/
├── graph/
├── context/
├── continuity/
├── sandbox/
├── workers/
├── output/
├── evidence/
├── resources/
├── routing/
├── audit/
├── validation/
├── control/
│   ├── sentinel.py
│   ├── sheriff.py
│   ├── watchdog.py
│   └── convergence.py
├── consolidation/
├── integration/
├── checkpoint/
├── recovery/
├── branching/
├── research/
├── coverage/
├── finalization/
├── runtime/
├── api/
├── ui/
└── tests/
    ├── unit/
    ├── contract/
    ├── integration/
    ├── recovery/
    ├── invariants/
    └── e2e/
```

---

# PARTE VI — ESTRATEGIA DE TESTS

## Nivel 1 — Unit
Schemas, funciones puras, scoring y transiciones.

## Nivel 2 — Contract
Cada adapter demuestra que respeta la interface.

## Nivel 3 — Integration
Workflow ↔ Memory ↔ Retrieval ↔ Context ↔ Sandbox ↔ Worker.

## Nivel 4 — Failure
Timeout, output inválido, checkpoint corrupto, stale memory, duplicate event, conflicting delta, unavailable resource, no progress.

## Nivel 5 — Recovery
**RUN ➡️ CHECKPOINT ➡️ CRASH ➡️ RESTORE ➡️ CONTINUE**

## Nivel 6 — Invariants
- no verified claim without evidence;
- no Worker global write;
- no COMPLETE with critical gap;
- no update after schema fail;
- replay reconstructs same state.

## Nivel 7 — E2E
**MASTER ➡️ QUESTIONS ➡️ GOALS ➡️ REQUIREMENTS ➡️ DAG ➡️ RETRIEVAL ➡️ CONTEXT ➡️ WORKER ➡️ AUDIT ➡️ DELTA ➡️ CONSOLIDATION ➡️ CHECKPOINT ➡️ COVERAGE ➡️ FINALIZATION**

---

# PARTE VII — GATES REALES

1. **G0 SOURCE FROZEN**
2. **G1 STATE SAFE**
3. **G2 EVENT REPLAY**
4. **G3 CHECKPOINT RECOVERABLE**
5. **G4 MEMORY TRACEABLE**
6. **G5 CONTEXT REPRODUCIBLE**
7. **G6 WORKER CONFINED**
8. **G7 NO VALIDATION, NO COMMIT**
9. **G8 CONSOLIDATION SAFE**
10. **G9 LOOP CONVERGES**
11. **G10 RECOVERY REAL**
12. **G11 GLOBAL COVERAGE**
13. **G12 VERIFIED_CLOSED**

---

# PARTE VIII — MEJORAS A PROGRAMAR DESDE EL PRINCIPIO

1. Event ledger append-only + hash chain.
2. Idempotency keys.
3. Optimistic locking/version checks.
4. Semantic Impact Engine.
5. Recovery drills automáticos.
6. Shadow state.
7. Dead-letter queue.
8. Context hash por ejecución.
9. Evidence freshness scheduler.
10. Untrusted-source firewall.
11. Capability-based security.
12. Producer ≠ Verifier.
13. Property-based invariants.
14. Semantic diff.
15. Safe memory garbage collector.
16. Index migration manager.
17. Cost/resource budget.
18. Full observability.
19. Reconstruction test.
20. Closure Certificate.

---

# PARTE IX — CRITERIO FINAL

El sistema debe demostrar:

**MASTER INPUT INMUTABLE  
➡️ QUESTIONS  
➡️ GOALS  
➡️ REQUIREMENTS  
➡️ PLAN  
➡️ TASK DAG  
➡️ TASK CONTRACT  
➡️ MEMORY RETRIEVAL  
➡️ CONTEXT PACK  
➡️ SANDBOX  
➡️ WORKER  
➡️ OUTPUT SCHEMA  
➡️ AUDIT  
➡️ VALIDATED STATE DELTA  
➡️ GLOBAL CONSOLIDATION  
➡️ MEMORY UPDATE  
➡️ CHECKPOINT  
➡️ RECOVERY TEST  
➡️ COVERAGE MATRIX  
➡️ TOP-DOWN/BOTTOM-UP CROSS-CHECK  
➡️ FINAL AUDIT  
➡️ RECONSTRUCTION TEST  
➡️ CLOSURE CERTIFICATE  
➡️ VERIFIED_CLOSED**

Una solución parcial **no** se considera automáticamente una solución global.
