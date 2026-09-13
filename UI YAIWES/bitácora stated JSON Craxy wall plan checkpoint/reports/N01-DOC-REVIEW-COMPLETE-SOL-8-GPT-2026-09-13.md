# N01 — Revisión documental exhaustiva de las 3 fuentes

- schema: `yaiwes.audit.n01.document-review.v1`
- contract: `tel.workflow/v3`
- node: `N01-DOC-REVIEW-COMPLETE`
- chat_id: `sol 8 gpt`
- claim_main_sha: `3c367a13f5bc3ed444fa5fb8c6c58091a2f1a53e`
- mode: `FAIL_CLOSED`
- scope: `audit/reports/Crazy-Wall only`
- extraction_rule: `NO_REINTERPRET / PRESERVE_SOURCE_ANCHOR / DEDUP_WITH_TRACEABILITY`

## 1. Evidencia de lectura completa

| Fuente | Ruta | Blob SHA leído completo | Estado |
|---|---|---|---|
| S1 | `UI YAIWES/➡️📂 Wordflow LOOP UI YAIWES/documentos proyectos UI YAIWES/📌MAX-SYSTEM-100X-FINAL-1.md` | `b9bc9a7f56cf17607b863829213f7bcb0f8b8081` | FULL_BLOB_READ |
| S2 | `UI YAIWES/➡️📂 Wordflow LOOP UI YAIWES/documentos proyectos UI YAIWES/📌👨‍💻 ULTIMA VERSIÓN cómo HACERLO MEJOR Q grock tiene ventanas agente  linux iOS Android phyton 🤯🤯🤯🎯 14 objetivos💡💡💡✅✅✅🎯🎯🎯.md` | `ecc8b3b1444ade0ca894789e149e881a08b999c0` | FULL_BLOB_READ |
| S3 | `UI YAIWES/➡️📂 Wordflow LOOP UI YAIWES/documentos proyectos UI YAIWES/🤯🗃️memoria del Wordflow resumen de lo que va en memoria del Wordflow para Kimi k y grock contexto de 20 millones d parámetros para el Wordflow y YAIWES.md` | `da109ae2d91e4563c01492ad365bbaa00fc6baa6` | FULL_BLOB_READ |

Regla del denominador: cada entrada `REQ-Sx-NNN` conserva un ancla explícita del documento fuente. Un paquete de sección conserva **todos** sus subrequisitos normativos; N02 no puede marcarlo satisfecho si falta cualquiera de sus subcláusulas. Los huecos de numeración del documento se registran, no se inventan.

## 2. Denominador fuente — S1 MAX-SYSTEM

| Requirement ID | Ancla fuente | Requisito/alcance normativo preservado |
|---|---|---|
| REQ-S1-001 | §1 Resumen ejecutivo | Paralelismo se obtiene combinando fan-out/fan-in, batching, sharding, time-wheel, idempotency+DLQ, outbox+CDC, multi-pool y pre-warming/autoscale; 100x es objetivo a medir, no evidencia por sí mismo. |
| REQ-S1-002 | §2 Comunidad devs | Comparar/seleccionar mecanismos por throughput, latencia, durabilidad y coste operativo; async y batching son candidatos de mejora medible. |
| REQ-S1-003 | §3 OSS GitHub | Reutilizar OSS maduro cuando cubra capability; no reinventar orquestación, durabilidad o scheduling ya disponibles. |
| REQ-S1-004 | §4 China | Considerar time-wheel, sharding, scheduling compartido/optimista, pre-positioning y active-active sólo donde el requisito y la medición lo justifiquen. |
| REQ-S1-005 | §5 India | Considerar outbox/CDC, rate limiting, pre-warming, caching con jitter, event-driven, saga/bulkhead según el gap real. |
| REQ-S1-006 | §6 Top 8 patrones | Fan-out/fan-in, batching, sharding, time-wheel, idempotency+DLQ, outbox+CDC, multi-pool y autoscale por profundidad son el conjunto de capacidades de rendimiento/resiliencia a evaluar. |
| REQ-S1-007 | §7 Patrones por geografía | Distinguir durable execution/observability, scheduling masivo y patrones pragmáticos; no confundir evidencia regional con obligación de implementación. |
| REQ-S1-008 | §8 Orquestadores OSS | Evaluar equivalencias antes de nueva descarga; las recomendaciones Temporal/Hatchet/Conductor son propuestas de fuente, no permiso para crear un segundo workflow owner. |
| REQ-S1-009 | §9 Arquitectura de paralelismo | Capa de concurrencia I/O + workers independientes + estado compartido + orquestador + batching; patrón universal fan-out→workers→fan-in→decisión. |
| REQ-S1-010 | §10 Arquitectura multi-sandbox | Soportar aislamiento de sandboxes, estado externo, primary/backup o equivalente y recuperación sin perder trabajo válido. |
| REQ-S1-011 | §11 Cuatro capas de memoria persistente | Separar estado de workflow, memoria de agentes, archivos/workspace y cache/locks; persistencia y cache no son equivalentes. |
| REQ-S1-012 | §12 Recovery de sandbox | Heartbeat/detección de caída→reemplazo→restaurar estado/workspace→reconectar locks→reanudar paso→notificar, con idempotencia. |
| REQ-S1-013 | §13 Failover automático | Definir y probar escenarios de sandbox/región/DB/cache/disco/hang/network partition con RTO/RPO observables; no declarar RTO/RPO sin medición. |
| REQ-S1-014 | §14 Setup mínimo viable | Infra y snapshots son una propuesta de implementación; conservar requirement de backup/snapshot/chaos test y no fijar proveedor sin dedup/política. |
| REQ-S1-015 | §15 Catálogo de funciones | El runtime debe tratar tools como capabilities controladas, no como autoridad implícita; filesystem/search/media/memory/agents/tasks/secrets/deploy requieren contrato y permisos. |
| REQ-S1-016 | §16 Combinación de tools | Componer tools mediante batches/concurrencia/background de forma gobernada y mapear cada actividad a timeout/retry verificable. |
| REQ-S1-017 | §17 Límites del entorno | Respetar límites de workspace/network/background/skills/tiempo/web; no inventar datos verificables y monitorizar trabajos iniciados. |
| REQ-S1-018 | §18 Plan 100x | Medir quick wins y mejoras: batching/async, colas/streams, multi-pool, idempotencia, durabilidad, failover, DSL y resource pools; 100x sólo si benchmark lo demuestra. |
| REQ-S1-019 | §19 Costos | Tratar costo de infraestructura como restricción/telemetría de selección, no como evidencia funcional. |
| REQ-S1-020 | §20 Riesgos | Registrar riesgos y mitigaciones: cuello DB, retrieval, self-host, loops/OOM, costes, corrupción de memoria, failover, snapshots, cold start. |

**Gap estructural S1:** el índice enumera hasta “21. Riesgos”, mientras el cuerpo numerado leído termina en `§20 Riesgos`; se conserva como `SOURCE_INDEX_MISMATCH_S1`, sin inventar una sección 21.

## 3. Denominador fuente — S2 Virtual Computer / 14 objetivos

| Requirement ID | Ancla fuente | Requisito/alcance normativo preservado |
|---|---|---|
| REQ-S2-000 | Punto/Objetivo 0 — arquitectura | Computador virtual local multiplataforma; Android/Windows/Linux obligatorios, iOS/iPadOS condicionado; UI→core→backend; Linux y Android como VMs independientes; agente dentro del boundary del sandbox. |
| REQ-S2-001 | Objetivo 1 — cómputo local | CPU/RAM/GPU locales cuando sea posible; detector de capabilities; preferir guest de misma arquitectura; backend fail-closed AVF/pKVM→KVM/crosvm→QEMU acelerado→TCG→unsupported; resource/thermal/battery/lifecycle/network/GPU monitoring. |
| REQ-S2-002 | Objetivo 2 — storage local | Discos, paquetes, config, código, DB, cache y snapshots locales por defecto; qcow2/dinámico; export/import `.vcomputer`; cuotas, COW, integridad, journal/crash recovery y cifrado opcional; mirror ≠ storage sync. |
| REQ-S2-003 | Objetivo 3 — Linux real | VM Linux con kernel/fs/users/processes/PTY/packages/services/GUI/apps/network/storage; virtio devices, guest agent/control, display/input/audio/clipboard/shared folder/time sync/RNG y lifecycle reproducible. |
| REQ-S2-004 | Objetivo 4 — Android real | Android VM hermana independiente; AVF prioritario sólo si capability/permiso real; AOSP/Cuttlefish-like; lifecycle/snapshot/restore/display/input/audio/GPU/network/package/storage; validar acceso AVF antes de prometer soporte. |
| REQ-S2-005 | Objetivo 5 — instalación | Instalar dentro del guest, no contaminar host; UniversalInstaller/guest package/filesystem/disk/download/verifier/arch resolver; SHA256/firma/formato/arquitectura/dependencias antes de instalar; snapshot-before-install y rollback. |
| REQ-S2-006 | Objetivo 6 — apps Android externas | AOSP sin dependencia obligatoria de GMS; GMS/Play condicionado a licencia/certificación; repository abstraction; control estructurado y fallback visual; compatibilidad/hardware bridge sólo con permisos. |
| REQ-S2-007 | Objetivo 7 — runtimes de desarrollo | Python/Node/Rust/C/C++/Go/Java/Bash dentro del Linux guest; jobs persistentes/logs/stdin/stdout; workspace/runtime plugins/PTY/process supervisor/control channel; Jupyter opcional, no core. |
| REQ-S2-008 | Objetivo 8 — mirror | Un host activo con clientes mirror; transmitir display/audio/input/clipboard/control, no copiar continuamente disco/RAM; discovery/pairing/auth/session/codec/adaptive bitrate; LAN first, remoto opcional. |
| REQ-S2-009 | Objetivo 9 — multiplataforma | Core compartido + backends de plataforma; Android/Windows/Linux obligatorios; iOS inicialmente cliente/mirror; capability matrix/backend registry/update manager; protocolos comunes. |
| REQ-S2-010 | Objetivo 10 — virtualización | Abstracción `VirtualizationManager/BackendRegistry/HostCapabilityDetector/IVirtualizationBackend`; AVF/KVM/WHPX/QEMU; image verifier hash/firma/arch; disk/snapshot/network/fs/display/input/device managers; persistencia tras cerrar UI. |
| REQ-S2-011 | Objetivo 11 | `SOURCE_NUMBERING_GAP`: no existe encabezado “OBJETIVO 11” localizable en el blob leído; prohibido completar por inferencia. |
| REQ-S2-012 | Objetivo 12 — ventanas | WindowManager real: mover/resize/min/max/focus, ids/estado/posición/tamaño/permisos; tipos Linux/Android/Agent/Terminal/Code/Files/Settings/Mirror/System; layout persistente y input routing. |
| REQ-S2-013 | Objetivo 13 — agente | AgentControlPlane/Kernel con planner/executor/observer/verifier/memory/tool/event/recovery; capability/permission gate; structured API preferred; policy para efectos destructivos; checkpoints/recovery/audit/evidence; no host-root arbitrario. |
| REQ-S2-014 | Objetivo 14 — OSS | Mapear requisito→OSS con URL/licencia/plataforma/arquitectura/mantenimiento/gaps; “fusión” por adapters/core, no mezcla ciega; dedup antes de descargar; fuente/provenance verificables. |

**Gap estructural S2:** `REQ-S2-011` es un hueco de numeración de la propia fuente; no se cuenta como requisito implementable hasta que exista material fuente autoritativo.

## 4. Denominador fuente — S3 Workflow + Memory/Audit

| Requirement ID | Ancla fuente | Requisito/alcance normativo preservado |
|---|---|---|
| REQ-S3-001 | §1 RESPONSABILIDAD DEL WORKFLOW | Workflow convierte Master Input→Goals→Requirements→Plan→Task Graph→Execution→Validation→Consolidation→Final Output; controla ciclo, no almacena todo ni sustituye LLM. |
| REQ-S3-002 | §2 MASTER INPUT | Original inmutable, versionado, trazable y siempre recuperable; derivados nunca sustituyen original. |
| REQ-S3-003 | §3 QUESTION ENGINE | Interrogación estructurada antes de tarea compleja: objetivo, restricciones, faltantes, investigación, dependencias, riesgos, criterio correcto y blockers. |
| REQ-S3-004 | §4 GOAL ENGINE | Goal tree con objetivos/subobjetivos, criterios de éxito y fracaso. |
| REQ-S3-005 | §5 REQUIREMENT ENGINE | Cada goal→requisitos verificables con ID, descripción, prioridad, origen, dependencias, criterio, estado y tareas; estados explícitos. |
| REQ-S3-006 | §6 PLAN ENGINE | PLAN estructurado con goals/requirements/phases/tasks/dependencies/resources/validation/checkpoints/recovery/expected artifacts. |
| REQ-S3-007 | §7 TASK DAG | DAG cuando sea posible, dependencias obligatorias y modificación dinámica ante nuevos requisitos/tareas/dependencias. |
| REQ-S3-008 | §8 TASK CONTRACT | Cada tarea define input/contexto/objetivo/restricciones/tools/worker/output schema/validators/success/retry/timeout/escalation; LLM recibe contrato, no lo decide. |
| REQ-S3-009 | §9 TASK FUNNEL | Project→phase→goal→task→subtask→work unit→LLM call; unidad suficientemente pequeña. |
| REQ-S3-010 | §10 CONTEXT REQUEST | Workflow solicita contexto indicando tarea/necesidad/objetivo/evidencia; Memory Orchestrator recupera. |
| REQ-S3-011 | §11 INPUT BLOCK | Master Input + Current Goal/Task + Task Contract + Relevant Context/Evidence + Current State/Consolidation + Open Questions + Constraints + Output Schema. |
| REQ-S3-012 | §12 PINNED INPUT | Instrucciones críticas, objetivo, restricciones, requisitos críticos, decisiones y políticas acompañan cada ventana relevante. |
| REQ-S3-013 | §13 CARRY FORWARD | Objetivo/tarea/hechos/decisiones/errores/preguntas/dependencias/progreso/siguiente acción/consolidación pasan a siguiente ventana. |
| REQ-S3-014 | §14 LLM OUTPUT | Output no es verdad automática: Normalizer→Schema Validation→Audit→State Delta→Consolidation. |
| REQ-S3-015 | §15 STATE DELTA | LLM propone cambios, no modifica estado global; runtime decide aplicación. |
| REQ-S3-016 | §16 CONTINUOUS EXECUTION LOOP | Next task→context→sandbox→execute→validate→state→checkpoint→consolidate→next; continuidad automática. |
| REQ-S3-017 | §17 STOP CONDITIONS | Parar por no tasks, conflicto crítico, falta autorización, policy, no progreso, límites, fallo repetitivo o intervención humana; no por “terminó una respuesta”. |
| REQ-S3-018 | §18 RETRY | Retry registra failure analysis y Strategy Change; fallo persistente escala, no repite ciegamente. |
| REQ-S3-019 | §19 CHECKPOINT | Estado/task/memory/artifacts/consolidation/audit/next action después de unidad significativa. |
| REQ-S3-020 | §20 ROLLBACK | Estado inválido→último checkpoint válido→rollback→repair/branch→continue; nunca reset por defecto. |
| REQ-S3-021 | §21 BRANCHING | Estrategias A/B/C aisladas→compare→audit→judge→rama validada. |
| REQ-S3-022 | §22 CONVERGENCE | Medir progreso/cobertura/errores/contradicciones/pendientes/incertidumbre; progreso→continue, estancamiento→change strategy, persistencia→escalate. |
| REQ-S3-023 | §23 FINALIZATION | Completion→coverage audit→contradiction audit→requirement audit→global consolidation→final validation→final output. |
| REQ-S3-024 | §24 RESPONSABILIDAD MEMORY/AUDIT | Administrar raw data/memory/evidence/indexes/tags/graph/artifacts/history/consolidations/checkpoint refs/audit. |
| REQ-S3-025 | §25 NO ES DB SIMPLE | Memory Fabric + Retrieval Engine + Evidence Graph + Context Fabric + Audit Engine. |
| REQ-S3-026 | §26 MEMORY LAYERS | L0 Raw, L1 Working, L2 Task, L3 Project, L4 Long-Term. |
| REQ-S3-027 | §27 RAW SOURCE | Nunca eliminar original por síntesis; recuperar source/version/hash/location/provenance. |
| REQ-S3-028 | §28 CHUNKING | Dividir por semántica/estructura/sección/entidad/dependencia/código/función/clase/requisito, no sólo tamaño. |
| REQ-S3-029 | §29 TAGGING | Tags project/topic/task/goal/requirement/entity/source/evidence/status/priority/version/dependency y relaciones supports/contradicts/depends/derived/implements/validates/supersedes/related. |
| REQ-S3-030 | §30 RETRIEVAL | Híbrido lexical+semantic+tag+graph+entity+temporal+task+evidence+history→retrieve→rerank→filter→context pack. |
| REQ-S3-031 | §31 CONTEXT FABRIC | Construir minimal sufficient context, no devolver documentos indiscriminadamente. |
| REQ-S3-032 | §32 CONTEXT BUDGET | Conocer model limit/system/task/output reserve/pinned/memory/safety margin y no exceder límite. |
| REQ-S3-033 | §33 MEMORY COMPACTION | Window→extract→validate→consolidate→store→index; original permanece, síntesis es derivada. |
| REQ-S3-034 | §34 CONSOLIDATION | Local y global; integrar facts/decisions/evidence/requirements/artifacts/dependencies/contradictions/task state, no sólo resumen. |
| REQ-S3-035 | §35 CLAIM SYSTEM | Claim con source/evidence/confidence/status/provenance y estados unverified/supported/conflicted/validated/rejected/superseded. |
| REQ-S3-036 | §36 EVIDENCE GRAPH | Claim→source→evidence; claim supports requirement; contradicciones explícitas entre claims. |
| REQ-S3-037 | §37 MEMORY AUDIT | Detectar duplicados, contradicciones, stale, claims sin evidencia, refs rotas, memoria huérfana, estados inconsistentes, artefactos sin provenance. |
| REQ-S3-038 | §38 MEMORY VERSIONING | Cada cambio importante nueva versión; reconstrucción N→N+1→N+2; no overwrite silencioso. |
| REQ-S3-039 | §39 HISTORY | Eventos input/document/memory/retrieval/claim/audit/conflict/consolidation/checkpoint/rollback. |
| REQ-S3-040 | §40 TRACEABILITY | Todo crítico responde origen/productor/versión/tarea/evidencia/checkpoint/validación. |
| REQ-S3-041 | §41 RESOURCE BRAIN | Catálogo models/APIs/tools/datasets/indexes/skills/workers/sandboxes/services con estados discovered→available/degraded/unavailable y autorización/salud. |
| REQ-S3-042 | §42 RESOURCE ROUTING | Considerar capability/health/authorization/context/latency/cost/specialization/policy; decisión final de ejecución pertenece al Runtime. |
| REQ-S3-043 | §43 MEMORY RESPONSE | Respuesta de memoria es CONTEXT PACK estructurado con memory/evidence/relations/state/consolidation/open questions/provenance/confidence/budget, no conversación libre. |
| REQ-S3-044 | §44 REGLA FUNDAMENTAL MEMORY | Memory Orchestrator no decide objetivo/política/estrategia final/finalización/autorización; entrega estructura al Runtime. |
| REQ-S3-045 | §45 INTERFAZ CONCEPTUAL | Workflow→GET_CONTEXT→Memory/Audit→retrieve/rerank/audit/relate/build→Context Pack→Workflow→Sandbox→LLM→State Delta→Memory/Audit. |
| REQ-S3-046 | §46 OPERACIONES PRINCIPALES | GET_CONTEXT/MEMORY/EVIDENCE/STATE/HISTORY/ARTIFACT/RELATIONS/AUDIT_MEMORY; SAVE_STATE_DELTA/ARTIFACT/CLAIM/EVIDENCE/CONSOLIDATION/CREATE_CHECKPOINT. |
| REQ-S3-047 | §47 REGLA DE ESCRITURA | LLM nunca escribe memoria canónica: Output→Normalizer→Schema Validation→Audit→State Delta→Memory Update. |
| REQ-S3-048 | §48 REGLA DE LECTURA | LLM no decide libremente memoria; Runtime pide contexto para tarea, Memory Orchestrator construye Context Pack. |
| REQ-S3-049 | §49 CONTINUOUS COGNITIVE LOOP | Master→questions→goals→requirements→plan→DAG→funnel→contract→retrieval→context→sandbox→LLM→schema→audit→delta→consolidation→memory→checkpoint→coverage→next→repeat. |
| REQ-S3-050 | §50 CONTINUAR SIN NUEVO INPUT | Si hay tareas+autorización+contexto+progreso y no conflicto crítico, continuar loop sin nuevo prompt humano. |
| REQ-S3-051 | §51 AUTO-PREGUNTAS | Preguntas de investigación/validación/integración/contradicción/dependencia se convierten en tareas y vuelven a la tarea original. |
| REQ-S3-052 | §52 AUTO-RESEARCH | Unknown→Research Task→Resource Router→Worker→Evidence→Audit→Memory→Original Task; no inventar para llenar vacío. |
| REQ-S3-053 | §53 CONSOLIDACIÓN EN EMBUDO | Work Unit→Task Result→Task Consolidation→Phase→Project→Final Consolidation. |
| REQ-S3-054 | §54 INTEGRATION CHECK | Cada requirement→task→artifact→evidence→validation; requirement sin implementación = INCOMPLETE. |
| REQ-S3-055 | §55 CROSS-CHECK | Top-down goals→requirements→tasks→artifacts y bottom-up artifacts→tasks→requirements→goals; comparar ambos. |
| REQ-S3-056 | §56 FINAL JUDGE | PASS/FAIL/REPAIR/ESCALATE/HUMAN_REQUIRED; no aceptar “LLM dice terminado”. |
| REQ-S3-057 | §57 FINAL AUDIT | Cinco auditorías: requirements, evidence, contradictions, coverage, traceability→global consolidation→final output. |
| REQ-S3-058 | §58 ANTI-ALUCINACIÓN | Reducir estructuralmente con source+evidence+retrieval+schema+state+audit+cross-check+traceability. |
| REQ-S3-059 | §59 ANTI-PÉRDIDA DE CONTEXTO | Preservar externamente Master/Memory/State/Artifacts/Evidence/Consolidation/Checkpoints/History y recuperar contexto relevante dinámicamente. |
| REQ-S3-060 | §60 ANTI-FRAGMENTACIÓN | Local Results→Local Consolidation→Global State→Integration Map→Global Consolidation→Cross-check→Final Validation. |
| REQ-S3-061 | §61 ARQUITECTURA FINAL | Workflow/Memory-Audit/Context Pack/Sandbox/LLM/State Delta/Audit+Validation/Consolidator/Memory+Checkpoint/Next Task/Loop con fronteras explícitas. |
| REQ-S3-062 | §62 | `SOURCE_NUMBERING_GAP`: no existe encabezado `# 62.` localizable en el blob leído; el material transicional “FRONTERA DEFINITIVA” se conserva como contexto, no se fabrica un número. |
| REQ-S3-063 | §63 PRINCIPIO FINAL | LLM=cognitive processor; Workflow=execution control; Memory=external cognitive memory; Auditor=verification; Sandbox=workspace; Checkpoint=recovery; Consolidator=integration; Router=selection; Policy=authority; State Machine=deterministic transitions. |
| REQ-S3-064 | §64 ORDEN DE PROGRAMACIÓN | Orden 01 Core State→02 Event→03 Task→04 Contract→05 State Machine→06 Checkpoint→07 Policy→08 Memory→09 Retrieval→10 Context→11 Sandbox→12 Worker→13 Output Schema→14 Audit→15 Consolidator→16 Router→17 Loop→18 Recovery→19 Resource Brain→20 Global Integration→21 Five-Pass Auditor→22 API→23 UI; UI última. |
| REQ-S3-065 | §65 CRITERIO DE ÉXITO | LLM pequeña procesa 20M total mediante lectura/segmentación/research/reason/resolve/save/consolidate/recover/continue/integrate/audit/repair/finalize sin perder objetivo/instrucciones/decisiones/evidencia/dependencias/resultados/estado/trazabilidad; parcial ≠ global. |

## 5. Dedupe — denominador canónico sin perder source anchors

El denominador canónico para N02 se agrupa por capability/contrato, **sin borrar los IDs fuente**:

| Canonical ID | Capability/contrato | IDs fuente que lo alimentan |
|---|---|---|
| CAN-001 | Performance medible / fan-out / batching / async / workers | S1-001..009, S1-016, S1-018 |
| CAN-002 | Durable execution único + loops gobernados | S1-008..009, S3-016..018, S3-022, S3-049..050 |
| CAN-003 | Multi-sandbox / aislamiento / shared state | S1-010..013, S3-019..021, S3-061 |
| CAN-004 | Recovery/failover/idempotencia/checkpoints | S1-011..014, S3-019..020, S3-038..040, S3-059 |
| CAN-005 | Local virtual computer / plataforma matrix | S2-000..001, S2-009..010 |
| CAN-006 | Storage local-first / export / snapshot / integrity | S2-002, S1-011..014, S3-019, S3-027, S3-038 |
| CAN-007 | Linux guest real | S2-003, S2-007 |
| CAN-008 | Android guest / AVF capability fail-closed | S2-004, S2-006, S2-009..010 |
| CAN-009 | Universal installer / artifact verification / rollback | S2-005, S3-019..020, S3-058 |
| CAN-010 | Mirror display/control no disk-sync | S2-008, S2-002, S2-012 |
| CAN-011 | Window/UI shell and per-window permissions | S2-012, S3-064 |
| CAN-012 | Agent control plane / capability permissions | S2-013, S3-008, S3-042, S3-047..048 |
| CAN-013 | OSS reuse / provenance / dedup | S2-014, S1-003, S3-027, S3-040..042 |
| CAN-014 | Immutable Master Input | S3-002, S3-011..013 |
| CAN-015 | Questions / goals / requirements / plan | S3-003..006 |
| CAN-016 | DAG / Task Contract / Task Funnel | S3-007..009, S3-051..053 |
| CAN-017 | Context Request / Input Block / Pins / Carry | S3-010..013, S3-031..033, S3-043..048 |
| CAN-018 | Structured LLM output / schema / State Delta | S3-014..015, S3-047, S3-058 |
| CAN-019 | Stop / retry / convergence / finalization | S3-017..018, S3-022..023, S3-056..057 |
| CAN-020 | Memory layers / raw source preservation | S3-024..027, S3-033 |
| CAN-021 | Chunking / tags / hybrid retrieval | S3-028..030 |
| CAN-022 | Context Fabric / budget / compaction | S3-031..033, S3-043 |
| CAN-023 | Claims / evidence graph / continuous audit | S3-035..037, S3-054..058 |
| CAN-024 | Version/history/traceability | S3-038..040, S3-059 |
| CAN-025 | Resource Brain / resource routing | S3-041..042, S1-015..017 |
| CAN-026 | Workflow↔Memory/Audit API boundary | S3-043..048 |
| CAN-027 | Auto-question / auto-research no-invention | S3-051..052, S3-058 |
| CAN-028 | Local/global consolidation / anti-fragmentation | S3-034, S3-053..055, S3-060..061 |
| CAN-029 | Global integration requirement→artifact→evidence→validation | S3-054..055, S3-060..061, S3-065 |
| CAN-030 | Final Judge + Five-Pass audit | S3-056..057, S3-064 |
| CAN-031 | Anti-hallucination / evidence-first | S3-037, S3-047, S3-052, S3-058 |
| CAN-032 | External context continuity / 20M processing | S3-026..033, S3-059, S3-065 |
| CAN-033 | Deterministic authority separation | S3-001, S3-014..015, S3-042, S3-044, S3-047..050, S3-063 |
| CAN-034 | Programming order / API before final UI | S3-064 |
| CAN-035 | Source structural gaps preserved, never inferred | S1 index mismatch, S2-011, S3-062 |

## 6. Arquitectura vigente aplicada como filtro de implementación, sin alterar los requisitos fuente

Los documentos fuente definen producto/capabilities. La arquitectura vigente `ARQUITECTURA-WORDFLOW-PYTHON-DSL-DAG-96-4-V7-2026-09-12.md` define **cómo** implementarlos:

1. Python ejecutable + DSL + DAG + schema determinista.
2. Objetivo mínimo `>=96%` determinista y máximo `<=4%` LLM.
3. `stabilize_core` sigue siendo el único workflow owner/scheduler/recovery owner.
4. No segundo scheduler, no segundo orquestador, no segundo recovery engine.
5. Antes de efectos: `NODO_LITERAL → SHERIFF → VALIDATOR/POLICY`.
6. `REUSE_EXISTING > PATCH > ADAPT > GENERATE > NEW_DOWNLOAD`.
7. SOURCE_PRESENT ≠ IMPLEMENTED ≠ WIRED ≠ RUNTIME_TEST_PASS ≠ VERIFIED_CLOSED.
8. Las propuestas S1 de Temporal/Hatchet/Redis/sharded orchestrator se tratan como **evidencia/propuestas de capability**, no autorización para duplicar el owner existente.
9. La afirmación “100x” requiere benchmark reproducible; no se hereda como PASS desde el documento.

## 7. Cross-check contra GAP ledger actual

Este denominador conserva y explica los GAPs ya conocidos, sin cerrarlos por documentación:

- G09 Memory boundary ↔ CAN-020..026.
- G10 Platform matrix ↔ CAN-005..010.
- G11 Multi-sandbox/global recovery ↔ CAN-003..004.
- G12 Global goals coverage ↔ todo el denominador y especialmente CAN-029..030.
- G13 Agent adapter ↔ CAN-012/CAN-033.
- G14 Core paralelo prohibido ↔ CAN-002/CAN-033.
- G15 Integration scaffold ↔ CAN-028..029.
- G16 Adapters/platform ↔ CAN-005/CAN-012.
- G17 VM capability/router ↔ CAN-005/CAN-008.

Ningún GAP se promueve por `SOURCE_PRESENT` ni por esta auditoría documental.

## 8. Test de cobertura de extracción

### TEST-N01-01 — Source identity
- expected: 3/3 fuentes exactas con blob SHA.
- observed: 3/3.
- result: PASS.

### TEST-N01-02 — Numbered-anchor coverage
- S1: 20 secciones numeradas del cuerpo registradas; mismatch del índice registrado.
- S2: Objetivos 0–10 y 12–14 registrados; ausencia literal de Objetivo 11 registrada como source gap.
- S3: §§1–61 y §§63–65 registrados; ausencia localizable de §62 registrada como source gap.
- result: PASS_FAIL_CLOSED — ningún hueco fue rellenado por inferencia.

### TEST-N01-03 — No-drop dedup
- expected: cada ID fuente implementable aparece en al menos un CAN-* o queda explícitamente como source gap/context-only.
- observed: todos los paquetes normativos quedaron preservados por anchor; las propuestas/telemetría/costos siguen trazables y no se convirtieron silenciosamente en requisitos distintos.
- result: PASS.

### TEST-N01-04 — Authority/refutation
- intento de refutación 1: tratar recomendación OSS como requisito de instalar un segundo orquestador → REJECTED por arquitectura vigente.
- intento de refutación 2: tratar “100x” como hecho → REJECTED; requiere benchmark N06.
- intento de refutación 3: inventar Objetivo 11 o §62 → REJECTED; quedan SOURCE_NUMBERING_GAP.
- result: PASS.

## 9. Resultado N01

- source_files_read_full: `3/3`
- source_requirement_packages_registered: `98`
- source_numbering/index_gaps_registered: `3` (`S1 index/body mismatch`, `S2 Objetivo 11`, `S3 §62`)
- canonical_requirement_groups_after_dedup: `35`
- dropped_source_packages: `0`
- inferred_missing_requirements: `0`
- status: `PASS`
- next_dependency_unlocked: `N02-TRACEABILITY-BIDIRECTIONAL`
- remaining_work: N02 debe mapear cada requirement package/canonical group a tarea↔code↔test↔evidencia y detectar huérfanos; este documento NO afirma implementación.
