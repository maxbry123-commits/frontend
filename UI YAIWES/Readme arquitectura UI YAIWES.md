# 📱 YAIWES — Arquitectura IA Local WebGPU + Hugging Face Remoto

## 1. OBJETIVO

YAIWES ejecuta IA desde móvil, PWA o navegador usando aceleración local cuando sea posible y Hugging Face remoto cuando sea necesario.

REGLA PRINCIPAL:

> WebGPU, WebNN y WASM NO son aplicaciones de chat.
> Son tecnologías de ejecución/aceleración.
>
> WebLLM, Transformers.js, ONNX Runtime Web, wllama y LiteRT
> son motores/librerías integrados DENTRO de YAIWES.
>
> YAIWES es la aplicación final.

## 2. ARQUITECTURA GENERAL

                    📱 YAIWES APP
                         │
                         ▼
                  🧠 LOCAL ROUTER
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
       WebLLM      Transformers.js    wllama
          │              │              │
          └──────────────┼──────────────┘
                         ▼
              ONNX Runtime / LiteRT
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
            WebGPU     WebNN       WASM
              │          │          │
             GPU        NPU        CPU
                         │
                         ▼
               SI LOCAL NO ALCANZA
                         │
                         ▼
                  YAIWES ROUTER
                         │
                         ▼
                  FastAPI Gateway
                         │
                         ▼
                   HF1 → HF2 → HF3
                         │
                         ▼
              HUGGING FACE REMOTO

## 3. COMPONENTES

- WebGPU: API del navegador para utilizar GPU.
- WebNN: API de aceleración de redes neuronales/NPU cuando exista soporte.
- WASM: runtime web y fallback CPU.
- MLC WebLLM: LLM directamente en navegador.
- Transformers.js: modelos de texto, embeddings, clasificación, visión/audio compatibles desde JavaScript.
- ONNX Runtime Web: inferencia ONNX mediante backends web.
- wllama: llama.cpp/GGUF en entorno web.
- LiteRT.js: inferencia on-device con WebGPU/WebNN/WASM según dispositivo.
- LocalMode: abstracción para evitar dependencia de un único motor.

## 4. REGLA DE DISEÑO

Incorrecto: YAIWES UI → WebLLM

Correcto:

~~~text
YAIWES UI
    ↓
AI ROUTER
    ↓
ENGINE ADAPTER
    ├── WebLLM
    ├── Transformers.js
    ├── ONNX Runtime Web
    ├── wllama
    └── LiteRT
    ↓
WebGPU / WebNN / WASM
~~~

## 5. ROUTER LOCAL

Antes de Internet: modelo local → hardware → WebGPU/WebNN → RAM.
Si no alcanza, escalar al router remoto.

## 6. HUGGING FACE REMOTO

No duplicar pesos públicos por defecto. Conservar principalmente model_id, repo_id,
dataset_id, revision, commit SHA, hf URI, endpoint, capacidades y requisitos.

## 7. HF1 / HF2 / HF3

Workers de procesamiento, no tres almacenes duplicados.
HF1 principal → HF2 secundario → HF3 respaldo.
Política de escalado por recursos y sleep/wake cuando no haya petición.

## 8. FASTAPI GATEWAY

Interfaz común:
/v1/chat
/v1/models
/v1/embeddings
/v1/audio
/v1/vision

El router decide motor/proveedor.

## 9. GITHUB ↔ HUGGING FACE

GitHub: código, workflows, adaptadores, contratos, manifests, configuración, pruebas e infraestructura.
Hugging Face: biblioteca remota de modelos/datasets, Jobs, inferencia, procesamiento y resultados.

Puentes compatibles:
01. Frontend
02. Orquestador
03. Orquestador Auditor Memoria
04. Agentes
05. Motor Agentes Workflow YAIWES
06. Router Inteligente Universal
07. MAXBRY AGI
08. NCT Core

NO construir ocho sistemas HF independientes.

## 10. PRINCIPIO INMUTABLE

1. No tratar WebGPU como aplicación completa.
2. No descargar pesos por defecto.
3. No duplicar modelos entre HF1/HF2/HF3.
4. Preferir referencias remotas.
5. Mantener UI separada de motores.
6. Usar adapters intercambiables.
7. Intentar local cuando sea apropiado.
8. Escalar a remoto cuando local no alcance.
9. GitHub es fuente de código; HF biblioteca/procesamiento.
10. Excepciones de almacenamiento de pesos requieren autorización explícita.

## 🔌 PLUGIN / CABLEADO DE DOCUMENTOS

Añadir enlaces relativos únicamente entre estos marcadores.

<!-- PLUGIN_DOC_LINKS_START -->
- Índice de componentes: ../📂 Indice fromtend componentes.md
<!-- PLUGIN_DOC_LINKS_END -->

---

# 11. BACKEND DEL CHAT — WORDFLOW DETERMINISTA UI YAIWES

Contrato operativo: `tel.workflow/v3`
Modo: `FAIL_CLOSED_LOOP`

Esta sección integra 1 a 1 la arquitectura backend definida para el chat. No reemplaza la arquitectura frontend/local anterior; la complementa.

## 11.1 Decisión principal

No se construirá un orquestador grande desde cero.

**Stabilize CORE** será el único owner del workflow del chat:
https://github.com/rodmena-limited/stabilize

Arquitectura:

`CHAT/UI ➡️ API ➡️ Stabilize CORE ➡️ TaskContract ➡️ Memory existente + Router existente ➡️ Agent/LLM ➡️ Validator/Judge ➡️ StateDelta ➡️ Consolidator ➡️ durable checkpoint ➡️ PASS | GAP→StrategyDelta→Retry | HITL | NEXT ➡️ VERIFIED_CLOSED`

El chat controla el flujo mediante el runtime. El agente/LLM sigue siendo trabajador externo/intercambiable.

## 11.2 Qué hace Stabilize CORE

`Workflow ➡️ Stage ➡️ Task ➡️ TaskResult(success|failure|suspend|jump) ➡️ durable commit ➡️ next`

Se reutilizan:
- DAG;
- durable state;
- durable queue;
- crash recovery;
- stage reset/jump;
- loops;
- fan-out/fan-in;
- suspend/resume;
- HITL;
- event/audit trail;
- SQLite V1;
- PostgreSQL si se escala.

Regla: no reimplementar dentro de UI YAIWES lo que Stabilize ya resuelve.

## 11.3 Contratos — Pydantic

Repositorio:
https://github.com/pydantic/pydantic

Contratos previstos:
- MasterInputContract
- Goal
- Requirement
- TaskContract
- ContextRequest
- ContextPackRef
- AgentRequest
- AgentResult
- EvidenceRef
- StateDelta
- ValidationResult
- IntegrationState
- ClosureResult

`output inválido ➡️ REJECT ➡️ no canonical commit`

## 11.4 Resiliencia — Bulkman

Repositorio:
https://github.com/rodmena-limited/bulkman

Responsabilidad:
- bulkheads;
- límites de concurrencia;
- timeouts;
- aislamiento lógico de workers;
- prevención de cascadas.

Ya es dependencia de Stabilize.

## 11.5 Circuit breaker — resilient-circuit

Repositorio:
https://github.com/rodmena-limited/resilient-circuit

Responsabilidad:
- circuit breaker;
- durable breaker state;
- backoff;
- retry técnico de servicios.

Retry técnico ≠ retry cognitivo.

Retry cognitivo:
`FAIL ➡️ GAP ➡️ FailureAnalysis ➡️ RESEARCH ➡️ StrategyDelta distinto ➡️ Stabilize jump/reset ➡️ retry`

## 11.6 Policy / Sheriff / Judge — rule-engine

Repositorio:
https://github.com/zeroSteiner/rule-engine

Reglas ejemplo:
- sin evidencia → no VERIFIED;
- schema inválido → REJECT;
- critical_gap → REPAIR/BLOCK;
- coverage incompleta → NOT_COMPLETE;
- retry con mismo fingerprint → REJECT_RETRY;
- no autorización → BLOCK/HUMAN_REQUIRED.

## 11.7 API del chat

Starlette:
https://github.com/Kludex/starlette

Endpoints mínimos previstos:
- POST `/runs`
- POST `/runs/{id}/resume`
- POST `/runs/{id}/cancel`
- GET `/runs/{id}/state`
- GET `/runs/{id}/events`
- health
- WebSocket/SSE de progreso cuando aplique.

La UI consume el backend; la UI no gobierna el workflow.

## 11.8 Transporte

HTTPX:
https://github.com/encode/httpx

Usar únicamente cuando Router, Memory o Agent sean servicios HTTP externos.
Si viven en el mismo proceso, conectar por interfaz directa.

## 11.9 Observabilidad

structlog:
https://github.com/hynek/structlog

OpenTelemetry Python:
https://github.com/open-telemetry/opentelemetry-python

Traza:
`CHAT ➡️ API ➡️ STABILIZE ➡️ MEMORY ➡️ ROUTER ➡️ AGENT ➡️ VALIDATOR ➡️ CONSOLIDATOR ➡️ CHECKPOINT`

Campos mínimos:
run_id, workflow_id, stage, task, attempt, strategy_id, route, context_ref, verdict, gap_type, checkpoint, duration.

## 11.10 Verificación

pytest:
https://github.com/pytest-dev/pytest

Hypothesis:
https://github.com/HypothesisWorks/hypothesis

Pruebas obligatorias:
- contracts/schema;
- state transitions;
- invalid output no commit;
- retry con delta distinto;
- crash/recovery;
- suspend/resume;
- critical GAP no close;
- coverage;
- Final Judge;
- E2E.

## 11.11 Donantes de patrones — no segundos runtimes

Dagu:
https://github.com/dagucloud/dagu

Donará patrones de workflow declarativo YAML/spec→IR.

redun:
https://github.com/insitro/redun

Donará patrones de deterministic hashing/CallGraph/provenance.

Fingerprint propuesto:
`TaskContract + input refs + context version + strategy_id + dependency refs ➡️ execution_fingerprint`

No ejecutar Dagu/redun como schedulers paralelos a Stabilize.

---

# 12. FLUJO DEL CHAT 1 A 1

1. `USER ➡️ CHAT ➡️ MasterInputContract ➡️ hash/version`
2. `MASTER INPUT ➡️ QuestionTask ➡️ unknowns/gaps`
3. `questions ➡️ GoalTask ➡️ goal/subgoals/success-failure`
4. `goals ➡️ RequirementTask ➡️ requirements + criteria`
5. `requirements ➡️ PlanTask ➡️ stages/tasks/dependencies`
6. `plan ➡️ Stabilize Workflow/DAG ➡️ ready/blocked`
7. `ready task ➡️ TaskContract`
8. `TaskContract ➡️ MemoryAdapter ➡️ ContextPack + evidence refs`
9. `TaskContract + context ➡️ RouterAdapter ➡️ worker/model/resource`
10. `typed request ➡️ Agent/LLM ➡️ AgentResult`
11. `AgentResult ➡️ Pydantic ➡️ candidate StateDelta`
12. `candidate delta + evidence ➡️ AuditTask/rule-engine ➡️ PASS|GAP|HUMAN_REQUIRED`
13. `GAP ➡️ FailureAnalysis ➡️ RESEARCH ➡️ StrategyDelta distinto ➡️ jump/reset ➡️ retry`
14. `PASS ➡️ Consolidator ➡️ facts/evidence/decisions/dependencies/conflicts`
15. `validated delta ➡️ Memory update`
16. `execution state ➡️ Stabilize durable checkpoint`
17. `Requirement ➡️ Task ➡️ Artifact ➡️ Evidence ➡️ Validation`
18. `coverage/state ➡️ next runnable stage`
19. `coverage PASS + no critical conflict + integration validated ➡️ Final Judge ➡️ VERIFIED_CLOSED`

---

# 13. LOOP DE TRABAJO

`[NODO literal] ➡️ SHERIFF ➡️ VALIDATOR ➡️ RESEARCH(chat→código→comunidad→filtra→dedup→rank+URL) ➡️ EXECUTE(delta autorizado) ➡️ VERIFY`

NO:
`GAP ➡️ persist failure/checkpoint/failed strategy ➡️ RESEARCH ➡️ delta distinto ➡️ mismo nodo`

SÍ:
`CODA ➡️ verify_final independiente`

Estados finales:
- VERIFIED_CLOSED
- CLOSED_UNVERIFIED
- INCONCLUSIVE

Reglas:
- 1 instrucción = 1 nodo;
- fail-closed;
- sin evidencia real no hay verified claim;
- retry idéntico no cuenta;
- checks reales/flaky hasta 10× cuando corresponda;
- check puro/determinista 1×.

---

# 14. ARQUITECTURA DE TRABAJO / CRAZY WALL

Patrón replicado desde:
https://github.com/maxbry123-commits/agentes/tree/main/%E2%9E%A1%EF%B8%8F%F0%9F%93%82%20Wordflow%20LOOP%20Yaiwes

Raíz:

```text
UI YAIWES/
├── Readme arquitectura UI YAIWES.md
├── documentos proyectos UI YAIWES/
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
        ├── src/core/
        ├── src/adapters/
        ├── src/tasks/
        ├── src/integration/
        └── tests/
```

README = arquitectura/contrato humano.
STATE = estado estructurado.
CHECKPOINT = punto recuperable.
RECOVERY = reanudación.
Crazy Wall = bitácora humana.
HANDOFF = entrada para siguiente agente.
PIPELINE = métodos operativos.

Divergencia entre anclas = GAP antes de mutar.

---

# 15. CÓDIGO PROPIO QUE DEBE QUEDAR PEQUEÑO

Previsto:
- contracts_yaiwes.py
- workflow_definition.py
- memory_adapter.py
- router_adapter.py
- agent_task.py
- validator_rules.py
- audit_task.py
- strategy_delta.py
- consolidator_task.py
- coverage_task.py
- integration_state.py
- final_judge_task.py
- chat_api.py

Estimación de ingeniería, no implementación demostrada: ~1.860–3.990 LOC de producción + ~1.500–3.000 LOC de tests, dependiendo de las interfaces reales de Router/Memory.

---

# 16. REGLA DE CIERRE

`archivo presente ≠ integrado`

`componente descargado ≠ adaptado`

`import presente ≠ wired`

`LLM dice listo ≠ PASS`

Cierre backend únicamente tras:
`componentes reales ➡️ revisión código ➡️ adapters ➡️ wiring ➡️ contract tests ➡️ recovery tests ➡️ E2E ➡️ evidence ➡️ VERIFIED_CLOSED`
