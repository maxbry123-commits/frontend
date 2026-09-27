# UI YAIWES — ARQUITECTURA BACKEND CONSOLIDADA V1

Fecha: 2026-09-27  
Raíz: `UI YAIWES/`  
Contrato canónico: `tel.workflow/v3`  
Modo: `FAIL_CLOSED_LOOP`  
Alcance: **backend, runtime, workflow, routing, tools, memoria, plugins, gates, workers y evolución controlada**.

## 0. Fuentes nuevas leídas

Los tres archivos subidos se conservan intactos y marcados como `no tocar`.

1. Sistema de componentes/plugins:
https://github.com/maxbry123-commits/frontend/blob/main/UI%20YAIWES/readme%20arquitectura%20UI%20YAIWES/actualizaciones%20arquitectura%20backend/sistema%20de%20componente%20tipo%20plugins%20para%20la%20f%C3%A1brica%20y%20yaiwes%F0%9F%9A%80%F0%9F%86%98%F0%9F%86%98con%20los%20componentes%20necesarios%20y%20como%20funciona%F0%9F%93%B2no%20tocar%20%E2%9A%A0%EF%B8%8F.md

2. Arquitectura completa backend + frontend:
https://github.com/maxbry123-commits/frontend/blob/main/UI%20YAIWES/readme%20arquitectura%20UI%20YAIWES/actualizaciones%20arquitectura%20backend/%F0%9F%93%B2%F0%9F%93%8C%F0%9F%9A%80%F0%9F%93%B2%F0%9F%93%B2%20UI%20YAIWES%20INTERFACE%20VERSI%C3%93N%201.0%20FINAL%20%F0%9F%93%8C%F0%9F%9A%80%F0%9F%93%B2%20Con%20backend%20frontend%20y%20URL%20visible%20...a%20y%20dise%C3%B1o%20para%20backend%20y%20frontend%20todo%20%E2%9B%94no%20tocar%20%F0%9F%94%A8%F0%9F%93%8C.md

3. Plan frontend usado solamente para fijar la frontera API/UI:
https://github.com/maxbry123-commits/frontend/blob/main/UI%20YAIWES/readme%20arquitectura%20UI%20YAIWES/actualizaciones%20arquitectura%20backend/%F0%9F%93%B2%F0%9F%93%B2%20UI%20YAIWES.%20fromtend%20plan%20de%20ejecuci%C3%B3n%20todo%20%20no%20tocar.md

Arquitectura anterior que esta extensión amplía:
https://github.com/maxbry123-commits/frontend/blob/main/UI%20YAIWES/readme%20arquitectura%20UI%20YAIWES/ARQUITECTURA-PROGRAMACION-CONSOLIDADA-UI-YAIWES.md

Frontera frontend:
https://github.com/maxbry123-commits/frontend/blob/main/UI%20YAIWES%20interface/readme%20arquitectura%20UI%20YAIWES%20interface%20beta/ARQUITECTURA-FRONTEND-UI-YAIWES-V1.md

## 1. Regla inmutable

`THE MODEL THINKS. THE RUNTIME CONTROLS.`

Se mantienen las decisiones ya congeladas:
- **Stabilize CORE** es el único owner del DAG, estado de ejecución, queue, recovery y LOOP.
- Ningún framework nuevo se convierte en un segundo orquestador canónico.
- La LLM no escribe estado canónico directamente.
- Memoria, router, workers, harnesses y plugins entran por contratos/adapters.
- Todo cambio canónico pasa schema + policy + audit + verifier/judge.
- `SOURCE_PRESENT != WIRED != TEST_PASS != VERIFIED_CLOSED`.

## 2. Microflujo backend canónico

`INPUT -> INGRESS -> INTENT/POLICY -> CACHE/RETRIEVAL -> CONTEXT -> ROUTER -> STABILIZE CORE -> TASK/WORKFLOW -> ACTION REGISTRY -> TOOL/POOL/HARNESS -> SANDBOX -> VERIFY -> STATE/CHECKPOINT -> RESULT`

Frontera con UI:

`UI -> action_id / NodePlan -> API/Action Registry -> Stabilize CORE -> capability -> result/event -> UI`

La UI nunca necesita conocer Prefect, Temporal, Qdrant, LiteLLM, DeepSeek Harness, Compositor u otro motor concreto.

## 3. Micro-Kernel de Integración de Componentes

Objetivo: convertir repositorios/software en capacidades registrables sin cablear cada framework en serie.

`SOURCE/URL -> ACQUISITION -> QUARANTINE -> SOURCE ANALYZER -> COMPONENT-IR -> TRANSFORM PLANNER -> COMPILER ROUTER -> CONTRACT GATE -> SANDBOX/TEST/QA -> CAPSULE -> CAPABILITY REGISTRY`

### 3.1 Component-IR

Formato neutral obligatorio entre adquisición y compiladores. Debe registrar al menos:
- id/version/source_sha;
- runtime/lenguaje;
- tipo de componente;
- entrypoints;
- capacidades;
- inputs/outputs;
- permisos;
- artefactos existentes: CLI/API/SKILL/workflow/agent-loop;
- salidas recomendadas: tool/pool/workflow/harness/subagent/mcp;
- riesgos/licencia/provenance.

### 3.2 Transform Planner

Primero reglas deterministas. La LLM entra solo cuando la clasificación no alcanza el umbral definido.

`DETECT -> SCORE -> confidence suficiente ? deterministic plan : LLM classification -> schema validation -> plan`

### 3.3 Compiler Router

No ejecuta todos los frameworks. Selecciona el compilador mínimo necesario:
- **CLI-Anything**: software/app -> Agent Harness/CLI.
- **PydanticAI FunctionToolset**: grupo de funciones -> Tool Pool.
- **LangChain StructuredTool**: función -> Tool.
- **Haystack PipelineTool**: pipeline -> Tool.
- **LangGraph / Microsoft Agent Framework**: workflow/DAG cuando el componente realmente necesita esa forma.
- **OpenAI Agents SDK / Strands**: function tool o agent-as-tool.
- **Agent Skills**: empaquetado de conocimiento/capacidades mediante `SKILL.md`.
- **MCP**: exposición externa opcional; no sustituye el runtime interno.

## 4. Action Registry — bus único del chat/UI

El frontend llama IDs estables, nunca implementaciones concretas.

IDs base:
- `workflow.run`
- `workflow.pause`
- `workflow.resume`
- `workflow.cancel`
- `workflow.loop.start`
- `workflow.loop.stop`
- `task.schedule`
- `task.cancel`
- `pool.dispatch`
- `watchdog.start`
- `watchdog.stop`
- `document.attach`
- `memory.search`
- `command.execute`
- `browser.open`
- `capability.invoke`

Microflujo:
`BUTTON | COMMAND | INTENT -> action_id -> policy -> registry.resolve -> contract -> executor -> audit/result`

## 5. Control agentic determinista

### 5.1 Estados
**transitions** puede actuar como implementación/donor de FSM:

`READY -> WORK -> VERIFY -> RETRY | DONE | FAILED`

La FSM pertenece al contrato YAIWES; la librería no se convierte en owner del estado.

### 5.2 Workflow durable / scheduling

Se aceptan como motores detrás de adapters:
- Prefect;
- Temporal Python SDK;
- Trigger.dev;
- APScheduler;
- Huey.

Regla: **Stabilize CORE decide y despacha**. Temporal/Prefect/Trigger/APScheduler/Huey ejecutan una capacidad concreta cuando el adapter lo requiera; no mantienen una segunda verdad del DAG global.

### 5.3 Workers / pools
Candidatos:
- Dramatiq;
- Taskiq;
- Celery;
- Huey.

Contrato:

`TaskContract -> pool.dispatch -> worker -> OutputSchema -> verifier -> event`

Se exige idempotencia, timeout, retry policy, cancelación, DLQ cuando aplique y fan-out/fan-in explícito.

### 5.4 Watchdogs
Candidatos:
- watchfiles;
- watchdog.

Contrato:

`event/change -> filter -> action_id -> policy -> dispatch`

No deben ejecutar acciones destructivas por observar un archivo; siempre pasan Action Registry + Policy.

### 5.5 Retry
**Tenacity** como adapter de retry local para operaciones idempotentes. No sustituye recovery/checkpoint del workflow.

## 6. Event Bus

**NATS / JetStream** es candidato principal para transporte de eventos durable, replay y consumer groups.

`producer -> topic/domain -> NATS -> consumer -> ack -> checkpoint/audit`

Stabilize CORE conserva la semántica de ejecución; NATS es transporte, no scheduler.

## 7. Policy / Sheriff / Gates

**Open Policy Agent (OPA)** como motor de políticas declarativas.

Pipeline obligatorio:

`REQUEST -> SCHEMA GATE -> POLICY/OPA -> CAPABILITY PERMISSIONS -> EXECUTION -> AUDIT -> VERIFY`

Reglas:
- secretos por referencia;
- permisos por capacidad;
- filesystem/network/process scope explícito;
- confirmación humana para irreversible/riesgo alto;
- deny-by-default en acciones no registradas.

## 8. Memoria y retrieval

Separar memoria de estado canónico.

### 8.1 Qdrant
Rol: retrieval vectorial/filtrado y contexto relevante.

### 8.2 Mem0
Rol: adapter de memoria persistente de IA cuando encaje con el contrato de memoria.

### 8.3 Memanto
Rol: administrador especializado de memoria: deduplicación, conflicto, caducidad y selección de contexto. Nunca escribe canonical state sin gate.

Pipeline:

`memory.write candidate -> schema -> policy -> dedup/conflict -> memory store -> provenance`

Lectura:

`task -> retrieval contract -> lexical/semantic/tags/graph/temporal -> rerank -> minimal sufficient context`

## 9. Reducción de llamadas/tokens y Model Router

Estas piezas se integran como etapas internas, no como routers rivales.

Pipeline recomendado:

`INPUT -> deterministic rules -> Semantic Router(optional) -> semantic cache -> Qdrant/RAG -> LLMLingua -> YAIWES ModelRouter -> provider gateway -> model`

Candidatos:
- Semantic Router: preclasificación/ruta sin generación cuando sea posible.
- GPTCache / RedisVL: cache semántica.
- Qdrant: retrieval top-k.
- LLMLingua: compresión de contexto cuando la política lo autorice.
- RouteLLM: señal para modelo económico/potente; no owner del router.
- LiteLLM: provider gateway/fallback/budget.
- Portkey: gateway alternativo, no simultáneo sin necesidad.
- Haystack: retrieve/rerank pipelines.
- txtai: búsqueda/clasificación local.
- vLLM: backend de inferencia local/servidor.
- LMCache: reutilización de KV/prefix cache en runtimes compatibles.

Regla: **YAIWES ModelRouter conserva la decisión canónica**. Los gateways son adapters intercambiables.

## 10. Harness operativo

### 10.1 DeepSeek Harness
Se integra como harness/worker cognitivo detrás del runtime:
- sesiones;
- tools;
- agent loop;
- subagentes;
- shell/filesystem;
- plugins.

No se convierte en owner del DAG global.

Microflujo:

`Stabilize task -> HarnessAdapter -> DeepSeek Harness -> tool/subagent -> structured result -> verifier`

### 10.2 CLI-Anything
Rol de fábrica: software existente -> harness controlable.

`repo -> CLI-Anything -> generated harness -> contract normalization -> tests -> capsule -> registry`

## 11. Autoevolución controlada

Componentes fuente:
- Continual Harness;
- Meta-Harness;
- Life-Harness;
- MemRL;
- Bayesian-Agent;
- MetaClaw;
- SCOPE;
- ZERA;
- MOSS como referencia de modificación profunda del harness.

Regla crítica: **ningún motor de autoevolución puede autopromover cambios a producción**.

Pipeline:

`TRACE/FAILURE -> proposer -> candidate change -> quarantine -> replay/evals -> security/policy -> regression -> judge -> versioned capsule -> manual/authorized promotion`

Roles:
- Continual/Meta/Life Harness: propuestas sobre harness.
- MemRL: estrategias recuperadas desde feedback/memoria.
- Bayesian-Agent: confianza/evidencia de skills.
- MetaClaw: aprendizaje desde conversaciones.
- SCOPE/ZERA: optimización de prompts.
- MOSS: referencia para cambios estructurales profundos; siempre aislados y validados.

## 12. Skills

**Agent Skills** es el formato de empaquetado reutilizable.

`SKILL.md + scripts + references + assets -> SkillCompiler -> executable workflow/tool bindings`

Adicionales:
- Ponytail: gate de solución mínima/reutilización antes de generar nuevas capas.
- Prompt Master: optimización de prompts como capacidad registrada.
- Skills externos: solo se cargan bajo demanda y con provenance.

Un `SKILL.md` en prosa no cuenta como workflow ejecutable. Para operaciones críticas debe compilarse a acciones tipadas o estar respaldado por tools reales.

## 13. Web, browser y scraping

Capacidades registrables:
- Obscura: browser/headless/MCP adapter.
- Scrapling: scraping/browser/MCP.
- ScrapeGraphAI Just-Scrape: scraping estructurado cuando exista credencial autorizada.
- Agent Reach: lectura/búsqueda multifuente según permisos/autenticación.
- Playwright: browser automation y QA.
- OpenWA: gateway WhatsApp como canal externo, aislado del core.

Contrato:

`browser/search action -> policy -> network scope -> executor -> normalized evidence -> provenance -> caller`

## 14. Motores externos especializados

### Compositor
No convertir el source completo a Skill.

Arquitectura:

`YAIWES -> Compositor Skill -> Compositor Adapter (CLI/MCP/API) -> código real -> artifact -> verifier`

Capacidades posibles:
- `image.open`
- `image.resize`
- `layer.create`
- `layer.move`
- `mask.create`
- `filter.apply`
- `transform.rotate`
- `selection.create`
- `image.export`

El Skill enseña; el adapter conecta; Compositor ejecuta.

## 15. Capability Registry

Todo componente integrado termina registrado como capacidad, no como dependencia informal.

Registro mínimo:
- capability_id;
- version;
- source/provenance;
- contract/schema;
- executor adapter;
- permissions;
- runtime requirements;
- health;
- tests/evidence;
- cost/latency metadata si aplica;
- lifecycle state.

Estados fail-closed:

`DISCOVERED -> ACQUIRED -> ANALYZED -> COMPILED -> QUARANTINED -> TESTED -> WIRED -> VERIFIED_CLOSED`

No saltar estados.

## 16. Contratos backend mínimos

- `TaskContract`
- `ExecutionPlan`
- `ActionContract`
- `CapabilityContract`
- `MemoryContract`
- `RetrievalContract`
- `RouterDecision`
- `PolicyDecision`
- `EventEnvelope`
- `CheckpointRecord`
- `ToolCall`
- `ToolResult`
- `OutputSchema`
- `VerificationResult`
- `ComponentIR`
- `CapsuleManifest`

## 17. Separación de responsabilidades

| Capa | Dueño |
|---|---|
| DAG / LOOP / recovery / canonical execution | Stabilize CORE |
| Estado canónico | State/Checkpoint layer |
| Transporte de eventos | NATS adapter |
| Workers | Pool adapters |
| Políticas | OPA/Sheriff |
| Memoria cognitiva | Memory adapters |
| Retrieval | Qdrant/related adapters |
| Selección de modelo | YAIWES ModelRouter |
| Provider gateway | LiteLLM/OmniRoute/adapter elegido |
| Harness cognitivo | DeepSeek Harness u otro adapter |
| Plugins/capacidades | Capability Registry |
| Integración de software | Micro-Kernel + Component-IR |
| Seguridad de ejecución | Contract Gate + Sandbox + Verifier |
| UI | `UI YAIWES interface`, fuera del canonical state |

## 18. Orden de implementación backend

1. Congelar contratos + Component-IR.
2. Action Registry.
3. Capability Registry.
4. Micro-Kernel ingest/analyze/plan.
5. Compiler adapters, empezando por CLI-Anything y tool/pool wrappers.
6. Contract/Policy Gate + sandbox/test.
7. Event Bus adapter.
8. Worker/pool adapters.
9. Memory/retrieval adapters.
10. Model Router pipeline + cache/compression.
11. DeepSeek Harness adapter.
12. Web/browser/specialized engines.
13. Autoevolution en quarantine/evals.
14. Recovery/chaos/load/E2E.
15. Five-pass audit + Final Judge.

## 19. Cierre

`SOURCE -> PROVENANCE -> COMPONENT-IR -> PLAN -> ADAPTER/COMPILER -> CONTRACT/POLICY -> SANDBOX -> TEST -> WIRING -> EVIDENCE -> READBACK -> VERIFIED_CLOSED`

La presencia de una URL o de código fuente no significa integración. Cada componente de esta arquitectura permanece **CANDIDATE/REFERENCE** hasta demostrar adquisición, contrato, adapter, wiring y tests reales.
