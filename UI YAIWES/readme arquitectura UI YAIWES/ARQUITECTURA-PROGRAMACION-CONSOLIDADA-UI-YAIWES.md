# 📌 UI YAIWES — ARQUITECTURA DE PROGRAMACIÓN CONSOLIDADA

Fecha: 2026-09-06
Contrato: `tel.workflow/v3`
Modo: `FAIL_CLOSED_LOOP`
Política: archivo aditivo; no reemplaza ni reescribe el README/catálogo existente.

## 0. FUENTES DE VERDAD DE ESTA ARQUITECTURA

Esta arquitectura se deriva únicamente de los documentos indicados por el Director para esta fase. El enlace MAX-SYSTEM fue entregado dos veces, por lo que existen cuatro documentos únicos efectivos:

1. MAX-SYSTEM-100X-FINAL-1.md
https://github.com/maxbry123-commits/frontend/blob/08f1e91e9a6383382bde843ff15b8c0c0c377e66/UI%20YAIWES/%E2%9E%A1%EF%B8%8F%F0%9F%93%82%20Wordflow%20LOOP%20UI%20YAIWES/documentos%20proyectos%20UI%20YAIWES/%F0%9F%93%8CMAX-SYSTEM-100X-FINAL-1.md

2. Memoria del Wordflow / contexto masivo
https://github.com/maxbry123-commits/frontend/blob/081c81608546e669645e7de57569d31b0fe9c91d/UI%20YAIWES/%E2%9E%A1%EF%B8%8F%F0%9F%93%82%20Wordflow%20LOOP%20UI%20YAIWES/documentos%20proyectos%20UI%20YAIWES/%F0%9F%A4%AF%F0%9F%97%83%EF%B8%8Fmemoria%20del%20Wordflow%20resumen%20de%20lo%20que%20va%20en%20memoria%20del%20Wordflow%20para%20Kimi%20k%20y%20grock%20contexto%20de%2020%20millones%20d%20par%C3%A1metros%20para%20el%20Wordflow%20y%20YAIWES.md

3. Virtual Computer / 14 objetivos
https://github.com/maxbry123-commits/frontend/blob/081c81608546e669645e7de57569d31b0fe9c91d/UI%20YAIWES/%E2%9E%A1%EF%B8%8F%F0%9F%93%82%20Wordflow%20LOOP%20UI%20YAIWES/documentos%20proyectos%20UI%20YAIWES/%F0%9F%93%8C%F0%9F%91%A8%E2%80%8D%F0%9F%92%BB%20ULTIMA%20VERSI%C3%93N%20c%C3%B3mo%20HACERLO%20MEJOR%20Q%20grock%20tiene%20ventanas%20agente%20%20linux%20iOS%20Android%20phyton%20%F0%9F%A4%AF%F0%9F%A4%AF%F0%9F%A4%AF%F0%9F%8E%AF%2014%20objetivos%F0%9F%92%A1%F0%9F%92%A1%F0%9F%92%A1%E2%9C%85%E2%9C%85%E2%9C%85%F0%9F%8E%AF%F0%9F%8E%AF%F0%9F%8E%AF.md

4. Command Center / especificación funcional del chat
https://github.com/maxbry123-commits/frontend/blob/081c81608546e669645e7de57569d31b0fe9c91d/UI%20YAIWES/%E2%9E%A1%EF%B8%8F%F0%9F%93%82%20Wordflow%20LOOP%20UI%20YAIWES/documentos%20proyectos%20UI%20YAIWES/%F0%9F%93%8C%F0%9F%91%A8%E2%80%8D%F0%9F%92%BB%E2%9E%A1%EF%B8%8FTAREA%20comand%20Center%20Fase%201%202%203%20de%20deepseck%20%F0%9F%97%82%EF%B8%8F%F0%9F%93%82%E2%9C%85%E2%9C%85%E2%9C%85%E2%9C%85%E2%9C%85%E2%9C%85%E2%9C%85%E2%9C%85%E2%9C%85%E2%9C%85%E2%9C%85%E2%9C%85%E2%9C%85%E2%9C%85.md

## 1. PRINCIPIO ARQUITECTÓNICO INMUTABLE

`THE MODEL THINKS. THE RUNTIME CONTROLS. THE MEMORY REMEMBERS. THE RETRIEVER FINDS. THE AUDITOR QUESTIONS. THE CONSOLIDATOR CONNECTS. THE CHECKPOINT RECOVERS. THE POLICY AUTHORIZES. THE JUDGE VALIDATES.`

Consecuencias:
- LLM/agente = trabajador cognitivo intercambiable; no dueño del estado.
- Stabilize = único owner del Wordflow/runtime canónico.
- Memory/Audit = memoria cognitiva externa; no es una sola base vectorial.
- UI = superficie de interacción; nunca canonical state.
- Sandbox/Virtual Computer = frontera de ejecución.
- Cada cambio canónico debe pasar schema + audit + policy + judge.
- `archivo presente ≠ integrado`; `repo descargado ≠ wired`; `LLM dice listo ≠ PASS`.

## 2. ARQUITECTURA TRANSVERSAL

```text
WEB / ANDROID / iOS / WINDOWS / LINUX
                 │
       ┌─────────┴──────────┐
       │                    │
 COMMAND CENTER         NATIVE APP
 React/Vite             Flutter
       │                    │
       └─────────┬──────────┘
                 ▼
       PROJECT + SESSION FABRIC
                 │
    ┌────────────┼────────────┐
    ▼            ▼            ▼
   CHAT       WORK/ARTIFACT   WINDOWS
               │        Files/Terminal/
               │        Linux/Android/Settings
    └───────────┼─────────────┘
                ▼
        CONTRACT / SHERIFF
        Pydantic + Policy
                │
                ▼
       STABILIZE WORDFLOW CORE
                │
       ┌────────┼─────────┐
       ▼        ▼         ▼
   EXECUTION   MEMORY   SANDBOX
    POOLS      /AUDIT    /VIRTUAL
       │        │         COMPUTER
       └────────┼─────────┘
                ▼
          AUDIT + JUDGE
          │           │
        PASS          GAP
          │           │
     StateDelta   FailureAnalysis
          │           │
          │      StrategyDelta distinto
          │           │
          └──────┬────┘
                 ▼
           CONSOLIDATOR
                 │
          MEMORY + CHECKPOINT
                 │
          NEXT TASK / CLOSE
```

## 3. CAPA A — CHAT + WORK + ARTIFACTS

La interfaz no se reduce a burbujas de conversación. Debe trabajar como una superficie compuesta:

`CHAT ⇄ WORK ⇄ BUILD/ARTIFACT ⇄ FILES ⇄ TERMINAL ⇄ TASK TRACE`

Objetos comunes:
- ProjectID
- SessionID
- ConversationID
- MessageID
- RunID
- TaskID
- ArtifactID
- AttachmentID
- CheckpointID
- ModelRouteID
- EvidenceRef

### Módulos UI mínimos

1. `ChatComposer`: input multilínea, attachments, voz, send/stop.
2. `MessageTimeline`: streaming, Markdown, code, copy, virtualization.
3. `ModelSelector`: registry dinámico, provider groups, AUTO mode.
4. `ChatSettings`: idioma, tokens, temperatura, streaming, tamaño, theme.
5. `HistoryPanel`: conversaciones, búsqueda, reopen, export.
6. `WorkPanel`: artifact persistente, versiones, preview, code/document/design.
7. `TaskPanel`: TaskContract, pendientes, prioridades, dependencias, retry.
8. `ProjectSelector`: repositorio/proyecto y scope explícito.
9. `HealthPanel`: keys/modelos/providers, score, error, failover manual/auto.
10. `ToolPanel`: AI/API/tools registrados por capability y permission scope.
11. `FlowCanvas`: nodos/edges visuales; exporta IR validable, no ejecuta por sí mismo.
12. `NotificationLayer`: toast/push sin convertirse en estado canónico.

### Flujo SEND

`User draft → client validation → attachment refs → POST/run → MasterInputContract → RunID → streaming events → MessageTimeline → artifact/task refs → checkpoint`.

### Flujo STOP

`Stop button → Abort local stream + cancel request → runtime policy → estado CANCEL_REQUESTED/CANCELLED si corresponde → event → UI`.

Cancelar render local no debe falsificar que el backend se detuvo.

## 4. CAPA B — CONTRATOS + SHERIFF + POLICY

Todos los comandos atraviesan contratos tipados antes de ejecutar.

Contratos objetivo:
- MasterInputContract
- GoalContract
- RequirementContract
- PlanContract
- TaskContract
- DependencyRef
- ContextRequest
- ContextPackRef
- ToolCapability
- ToolPermission
- AgentRequest
- AgentResult
- EvidenceRef
- ArtifactRef
- StateDelta
- ValidationResult
- StrategyDelta
- CheckpointRef
- IntegrationState
- ClosureResult

Reglas:
- input literal conservado con hash/version.
- invalid schema → REJECT; no commit.
- sin autorización → BLOCK/HUMAN_REQUIRED.
- sin evidencia suficiente → GAP; nunca VERIFIED_CLOSED.
- retry con mismo execution/strategy fingerprint → REJECT_RETRY.
- UI jamás envía secretos reales cuando puede enviar `secret_ref`.

## 5. CAPA C — WORDFLOW DETERMINISTA

Owner: Stabilize CORE.

Flujo de programación:

`INPUT → Questions → Goals → Requirements → Plan → DAG/FSM → ready task → ContextRequest → Router → Worker → AgentResult → Schema → Audit → StateDelta → Consolidation → Memory update → Checkpoint → Coverage → next task`.

### Estado mínimo de ejecución

Cada ejecución debe conocer:
- run_id
- workflow_id
- task_id
- node_id
- attempt
- strategy_id
- input_hash
- execution_fingerprint
- dependency refs
- context version
- route/model/tool
- status
- evidence refs
- artifact refs
- checkpoint ref
- timestamps

### GAP loop

`FAIL → persist failure → classify GAP → research → StrategyDelta diferente → reset/jump al nodo autorizado → retry → verify`.

No se crea un segundo workflow owner para lograr paralelismo.

## 6. CAPA D — PARALELISMO MAX-SYSTEM

Patrones obligatorios tomados de MAX-SYSTEM:
1. fan-out/fan-in;
2. batching de llamadas externas;
3. sharding por key/proyecto/concern cuando la escala lo requiera;
4. time-wheel/scheduling eficiente cuando exista volumen suficiente;
5. idempotency keys + DLQ;
6. outbox + CDC cuando sea necesario garantizar propagación de eventos;
7. multi-pool de workers por concern;
8. prewarming/autoscale por queue depth cuando haya infraestructura distribuida.

Separación:
- Stabilize decide la semántica del workflow.
- Worker pools ejecutan unidades ya autorizadas.
- Queue/EventBus transporta trabajo/eventos.
- Compute frameworks solo amplían capacidad.

Pools posibles:
- UI/build
- research
- code
- memory/index
- audit/verify
- document/media
- CPU-heavy
- GPU/model

## 7. CAPA E — MEMORY/AUDIT ORCHESTRATOR

No es una base de datos simple.

Debe ser:
`MEMORY FABRIC + RETRIEVAL ENGINE + EVIDENCE GRAPH + CONTEXT FABRIC + AUDIT ENGINE`.

### Capas de memoria
- L0 Raw Source — fuente original, hash, version, location, provenance.
- L1 Working Memory — contexto inmediato.
- L2 Task Memory — información útil para la tarea.
- L3 Project Memory — estado global, decisiones, dependencias y artifacts.
- L4 Long-Term Knowledge — información reutilizable validada.

### Pipeline de ingestión
`SOURCE → normalize → parse → structural chunk → metadata/tags → lexical index → semantic index → graph relations → provenance → store`.

Chunking debe reconocer:
- semántica
- sección
- entidad
- dependencia
- código
- función
- clase
- requisito
- artifact
- evidence

### Retrieval

`TASK → lexical + semantic + tag + graph + entity + temporal + evidence + history → candidate union → rerank → filter → context budget → ContextPack`.

### Evidence Graph

Relaciones mínimas:
- SUPPORTS
- CONTRADICTS
- DEPENDS_ON
- DERIVED_FROM
- IMPLEMENTS
- VALIDATES
- SUPERSEDES
- RELATED_TO

Cadena de cierre:
`Goal → Requirement → Task → Artifact → Evidence → Validation`.

### Regla canónica

La LLM nunca escribe directamente:
`LLM output → Normalizer → Schema → Audit → StateDelta → Memory Update`.

## 8. CAPA F — CONSOLIDACIÓN, COVERAGE Y JUDGE

Consolidación progresiva:
`WorkUnit → TaskResult → TaskConsolidation → PhaseConsolidation → ProjectConsolidation → FinalConsolidation`.

Coverage bidireccional:
- top-down: Goal→Requirement→Task→Artifact;
- bottom-up: Artifact→Task→Requirement→Goal.

Final Judge solo puede devolver estados definidos por contrato, por ejemplo:
- PASS
- FAIL
- REPAIR
- HUMAN_REQUIRED
- INCONCLUSIVE
- VERIFIED_CLOSED

La frase de una LLM no es evidencia de cierre.

## 9. CAPA G — SANDBOX

Niveles separados:
1. browser sandbox para previews/artifacts web;
2. WASM sandbox para plugins pequeños;
3. Linux process/container sandbox para tools locales;
4. microVM server sandbox para workloads de mayor riesgo;
5. Virtual Computer local completa para Linux/Android del producto.

Cada sandbox recibe capability manifest:
- filesystem roots
- network allowlist
- CPU/RAM/time limits
- process permissions
- secrets refs
- tool list
- artifact output path

Nunca proporcionar acceso arbitrario al host por defecto.

## 10. CAPA H — VIRTUAL COMPUTER MULTIPLATAFORMA

Producto nativo conceptual:

`Flutter UI → Window Manager → Rust Core → VM/Storage/Network/Mirror/Package Managers → Platform Backend → Guest`.

### Ventanas de primera clase
- Chat/Agent
- Linux
- Android
- Files
- Terminal
- Apps
- Settings
- Systems
- Network
- Tasks/Trace cuando aplique

### Managers del Rust Core
- VMManager
- StorageManager
- NetworkManager
- WindowManager
- DisplayBridge
- InputBridge
- AudioBridge
- MirrorManager
- ResourceManager
- PackageManager
- GuestBridge

### Android
Primera ruta:
`Flutter/Rust host → AVF/crosvm → Linux/Android guest → virtio/vsock/fs/display`.
QEMU queda como fallback donde corresponda.

### Linux desktop
`QEMU/KVM or native virtualization → Linux guest → Wayland compositor → Mesa/virtual GPU → DisplayBridge → Flutter surface`.

### Windows host
`Flutter/Rust → QEMU + WHPX cuando disponible → guest`.

### iOS/iPadOS
Soporte secundario y capability-driven. No se promete equivalencia con Android. El backend debe poder seleccionar una ruta compatible sin condicionar toda la arquitectura al caso iOS.

### Mirror vs Migration
Mirror:
`guest sigue ejecutándose en origen → video/input/data → segundo dispositivo`.

Migration:
`quiesce/stop → snapshot → transfer verified → restore → continue en destino`.

Nunca mezclar ambos contratos.

## 11. CAPA I — SEGURIDAD E IP

### Identidad y acceso
- autenticación real; URL privada no sustituye autenticación;
- RBAC/ABAC/policy para proyecto, tool, file, admin action;
- RLS cuando se use Postgres/Supabase multiusuario;
- sesiones revocables y scopes mínimos.

### Secretos
- secretos server-side/OpenBao/secret manager;
- cliente recibe `secret_ref` o token de alcance mínimo;
- almacenamiento móvil usa secure storage del sistema;
- nunca hardcode de API keys en web/APK.

### Datos locales
- cifrado de DB/cache/checkpoints cuando contengan información sensible;
- backups/artifacts cifrados antes de salir de la frontera confiable;
- keys separadas del ciphertext.

### Supply chain
`source commit → build → SBOM → vulnerability/secret scan → provenance → signature → release metadata → secure update verification`.

### Limitación real
No existe garantía absoluta de impedir reverse engineering de código que debe ejecutarse en un dispositivo controlado por otra persona. Lo que debe permanecer secreto de forma fuerte debe quedar server-side; el cliente se protege mediante reducción de exposición, cifrado de datos, firmas, permisos y compilación nativa donde corresponda.

## 12. CAPA J — OBSERVABILIDAD

Correlation IDs mínimos:
`project_id, session_id, run_id, task_id, attempt, strategy_id, model_route, tool_id, sandbox_id, artifact_id, checkpoint_id`.

Eventos importantes:
- input accepted/rejected
- task queued/started/completed/failed
- retrieval executed
- claim/evidence created
- audit executed
- conflict detected
- strategy changed
- checkpoint created/restored
- failover
- cancellation
- closure verdict

Logs/metrics/traces son evidencia operativa; no gobiernan el flujo.

## 13. CAPA K — PRUEBAS

### Frontend
- unit/store tests;
- component interaction;
- streaming/cancel;
- modal/selectors;
- upload;
- responsive/accessibility;
- browser E2E.

### Runtime
- schemas;
- transition invariants;
- invalid output no commit;
- retry requires StrategyDelta;
- crash/recovery;
- suspend/resume;
- idempotency;
- concurrency/fan-out/fan-in;
- cancellation;
- Final Judge.

### Memory
- raw source preservation;
- deterministic provenance;
- dedup;
- lexical/semantic/graph retrieval;
- stale-data handling;
- conflicting evidence;
- context budget;
- traceability Goal→Evidence.

### Sandbox/Virtual Computer
- permission denial;
- filesystem boundary;
- network boundary;
- CPU/RAM limits;
- VM start/stop/snapshot/restore;
- display/input bridge;
- mirror;
- migration integrity;
- host platform capability matrix.

## 14. PROGRAMACIÓN POR FASES

### Fase P0 — anclas y contratos
- reconciliar README/HANDOFF/STATE/CHECKPOINT/RECOVERY/Crazy Wall;
- congelar contratos y IDs;
- inventario físico de componentes existentes.

### Fase P1 — chat funcional base
- composer, messages, streaming, stop, model selector, settings, history;
- backend typed endpoints;
- auth/session/secrets baseline.

### Fase P2 — Work/Artifacts/Projects
- artifact model/versioning/preview;
- files/uploads;
- project/repo selector;
- task/trace panels.

### Fase P3 — Wordflow wiring
- Stabilize workflow definition;
- contracts;
- RouterAdapter;
- AgentTask;
- Validator/Judge;
- StateDelta;
- StrategyDelta/retry;
- checkpoint/recovery.

### Fase P4 — Memory/Audit
- raw store/provenance;
- ingestion/chunking;
- hybrid retrieval;
- graph/evidence;
- ContextFabric;
- consolidation/coverage.

### Fase P5 — parallel execution
- queue abstraction;
- worker pools;
- idempotency/DLQ;
- batching/fan-out/fan-in;
- load tests antes de introducir sharding/CDC/distributed compute.

### Fase P6 — sandbox/tool runtime
- capability contracts;
- permissions;
- process/WASM/container/microVM adapters según riesgo.

### Fase P7 — Virtual Computer
- Flutter↔Rust bridge;
- VMManager;
- platform backend adapters;
- GuestBridge;
- storage/network/display/input/audio;
- Linux/Android windows;
- resource control;
- mirror/migration.

### Fase P8 — hardening y cierre
- security scans;
- SBOM/provenance/signatures;
- chaos/recovery/load/E2E;
- coverage audit;
- 12 GOALS + Council12 + Final Judge.

## 15. CATALOGO DE COMPONENTES

El catálogo auditado 1×1 con clasificación, aporte, encaje, límite y URL está en:

`UI YAIWES/readme arquitectura UI YAIWES/README.md`

Regla: el catálogo es un banco de piezas. Ningún componente se descarga o integra únicamente por estar en la lista. Antes de integrarlo se debe registrar:
`GAP/función → componente candidato → licencia → fuente/SHA → bloque reutilizado → adapter/wiring → tests → evidencia`.

## 16. CRITERIO DE CIERRE

Esta arquitectura conceptual queda documentada. La implementación física no se considera cerrada hasta demostrar:

`componentes reales → revisión fuente/licencia/SHA → adapters → wiring → tests → recovery/chaos/E2E → evidence → cross-check 12 GOALS → Council12 → Final Judge → VERIFIED_CLOSED`.
