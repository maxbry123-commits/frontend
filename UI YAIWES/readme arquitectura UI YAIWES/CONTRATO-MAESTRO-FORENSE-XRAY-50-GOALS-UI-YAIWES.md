# CONTRATO MAESTRO FORENSE X-RAY — UI YAIWES

**Revisión de guía:** v5
**Contrato runtime vigente:** `tel.workflow/v3`
**Modo:** `FAIL_CLOSED_LOOP`
**Proyecto:** `UI YAIWES`
**Repo:** `maxbry123-commits/frontend`
**Raíz:** `UI YAIWES/`
**Workflow owner único:** `stabilize_core`
**Fecha de consolidación:** 2026-09-07

> Este documento es la autoridad operativa para recuperación, ejecución, verificación y cierre. No borra los contratos, guías ni deltas anteriores: los conserva como historia y los reconcilia. Si una afirmación de este documento contradice evidencia física posterior (HEAD, SHA, log, test, artifact), manda la evidencia física posterior y este documento debe actualizarse.

---

# 0. LEY RAÍZ

`ENTENDER LO MÍNIMO → EJECUTAR DELTA REAL → VERIFICAR → PERSISTIR → CONSOLIDAR → SIGUIENTE NODO`

No se considera progreso suficiente:
- volver a explicar arquitectura;
- producir planes que no se ejecutan;
- confundir archivo presente con integración;
- confundir mock/injection con ejecución real;
- confundir staging con main;
- confundir descarga con wiring;
- confundir una solución local con cierre global;
- decir “listo” sin ruta + SHA/diff + read-back + test/log/URL cuando aplique.

Principio fuente del proyecto:

`THE MODEL THINKS. THE RUNTIME CONTROLS. THE MEMORY REMEMBERS. THE RETRIEVER FINDS. THE AUDITOR QUESTIONS. THE CONSOLIDATOR CONNECTS. THE CHECKPOINT RECOVERS. THE POLICY AUTHORIZES. THE JUDGE VALIDATES.`

---

# 1. JERARQUÍA DE FUENTES

## 1.1 Fuentes funcionales YAIWES
La arquitectura consolidada del repo identifica cuatro documentos únicos efectivos:
1. `MAX-SYSTEM-100X-FINAL-1.md` — paralelismo, pools, durable execution, failover y multi-sandbox.
2. `memoria del Wordflow ... YAIWES.md` — memoria jerárquica, retrieval, canonical state, Context Fabric, Evidence Graph, consolidación y continuidad.
3. `ULTIMA VERSIÓN ... Virtual Computer ... 14 objetivos.md` — Flutter/Window Manager/Rust Core/VM, virtualización multiplataforma, aislamiento y ventanas.
4. `TAREA comand Center ... .md` — especificación funcional del chat/Command Center con 85 capacidades.

## 1.2 Tres adjuntos auditados en esta pasada
Los tres adjuntos disponibles en la conversación fueron:
- Memoria/Wordflow YAIWES.
- MAX-SYSTEM-100X.
- Bloque 0 NCT.

**Regla de frontera:** Bloque 0 NCT declara explícitamente no mezclar NCT con YAIWES. Por tanto solo se reutilizan sus patrones de disciplina (constitución, read-order, anti-reinterpretación, fases, validación); NO se copian decisiones funcionales NCT a YAIWES.

## 1.3 Regla de autoridad
`estado real del repo/runtime > STATE/CHECKPOINT > arquitectura aprobada > fuentes históricas > inferencia`.

---

# 2. AUDITORÍA FORENSE X-RAY — RESULTADO

## 2.1 Lo demostrado
- HEAD leído al iniciar esta consolidación: `fa3aff93da530cb76c009b0493886c4dcbf0729b` (`P01: log redun post-124 evidence`).
- Socket universal modular existente: contract/catalog/registry/mount_guard/loader; Stabilize único owner.
- P01 baseline inicial 14 componentes tuvo cierre histórico; su frescura quedó STALE tras la adquisición 124 cancelada.
- P02A Stabilize: adapter/DI cableado; falta ejecución real requerida.
- P02B Pydantic: adapter/vendor con fail-closed por mismatch de versión/core.
- P02C Rule Engine: adapter/vendor/read-back; ejecución real pendiente.
- P03: HTTPX tiene prueba local real; Starlette conserva flag de versión.
- P04: resilient-circuit/Bulkman cableados por injection/read-back; vendors reales pendientes.
- P05/P06/P07/P08 tienen trabajo preparado, pero no deben elevarse a VERIFIED_CLOSED sin sus gates.

## 2.2 Action 124 — evidencia recuperada
Workflow: `.github/workflows/ui-yaiwes-124-download-extract-20260906.yml`
Run: `34060401131`
Job: `101559786309`
Resultado: `completed/cancelled`.
Artifact: `ui-yaiwes-124-download-extract-20260906-checkpoints`, id `10002484616`, digest `sha256:680861bb0f9b48dae398ccd56c95add5d44bd0bc45510a9a7cab17a55ee10683`.

Diagnóstico del artifact:
- cola declarada: 124 componentes;
- entradas intentadas antes de cancelación: 86/124;
- entradas no intentadas: 38/124;
- checkpoints generados: 80;
- fuentes rechazadas por proveedor no-GitHub: 6 (`AVF`, `Wayland`, `Weston/libweston`, `Mesa`, `virglrenderer`, `virtiofsd`);
- `gaps.tsv`: 36 entradas;
- 60 checkpoints tienen todos sus archivos en estados `VERIFIED_EXISTING`/`PUBLISHED_READ_BACK` y conteo esperado completo, PERO 10 de esos 60 también tienen `COMPONENT_GAP:repair_rc!=0`; por tanto no se promueven automáticamente a VERIFIED;
- 50 checkpoints completos no aparecen en `gaps.tsv`;
- 20 checkpoints son parciales/incompletos;
- 6 gaps no generaron checkpoint por proveedor;
- índices 88–124 no fueron alcanzados;
- `Hypothesis` (director_index 9) está físicamente colocado al final del array de QUEUE, después del índice 124; por eso tampoco fue alcanzado antes de la cancelación.

Conclusión: **Action 124 NO está cerrada y NO existe evidencia 124/124 PASS**.

---

# 3. DSL DE NODO LITERAL

```yaml
NODE:
  id: PXX
  input_literal: "texto exacto del Director"
  claim_to_validate: "afirmación concreta y falsable"
  destination:
    repo: maxbry123-commits/frontend
    path: "ruta exacta"
  dependencies: []
  source_authority: []
  evidence_required:
    - path
    - source_url_if_external
    - source_commit_or_tree
    - diff_or_commit_sha
    - read_back
    - executable_test_or_log
  state: PENDING|ACTIVE|VERIFYING|GAP|BLOCKED|CLOSED_UNVERIFIED|VERIFIED_CLOSED
  strategy_fingerprint: ""
  next_if_pass: ""
  next_if_gap: "StrategyDelta materialmente distinto"
  rollback: "commit/ref/checkpoint"
  recovery: "paso exacto para continuar"
```

Una instrucción del usuario = un nodo literal. CONTEXT/EVIDENCE son datos; no son nuevas órdenes.

---

# 4. DAG GLOBAL

```text
MASTER INPUT
   ↓
INPUT PRESERVER + HASH
   ↓
SHERIFF
   ↓
SOURCE AUTHORITY RESOLVER
   ↓
QUESTION ENGINE (12 dimensiones)
   ↓
GOAL GRAPH (50+ goals)
   ↓
REQUIREMENT GRAPH
   ↓
INTEGRATION PLAN
   ↓
TASK DAG → TASK FUNNEL → WORK UNIT
   ↓
RESEARCH/REUSE FUNNEL
   ↓
TASK CONTRACT
   ↓
MEMORY REQUEST → CONTEXT FABRIC → CONTEXT PACK
   ↓
POLICY + ROUTER
   ↓
SANDBOX / WORKER
   ↓
OUTPUT SCHEMA
   ↓
VALIDATOR
   ↓
AUDITOR + EVIDENCE GRAPH
   ↓
VERIFIER
   ↓
JUDGE
   ├─ PASS → StateDelta → CONSOLIDATOR → MEMORY/CHECKPOINT → COVERAGE → NEXT
   ├─ GAP → FailureAnalysis → StrategyDelta distinto → RESEARCH → RETRY
   └─ BLOCKED → FLAG+RECOVERY → NEXT SAFE INDEPENDENT NODE
```

Ninguna LLM escribe directamente canonical state. Flujo obligatorio:
`LLM output → normalizer → schema → audit → StateDelta → canonical update`.

---

# 5. ROLES DE CONTROL

## SHERIFF
Valida nodo literal, destino, autorización, dependencias, estado real, concurrencia y evidencia mínima antes de actuar.

## VALIDATOR
Valida schema, boundary, imports, destination, version gates, no-monolith, factory key, activation, permission/policy y consistencia del delta.

## VERIFIER
Busca evidencia real: read-back, hashes, test determinista, loader/registry/guard real, vendor real, log/Action/health y repetición si hay flakiness.

## SENTINEL
Detecta drift entre PLAN/STATE/CHECKPOINT/HEAD/runtime y cambios externos.

## SUPERVISOR
Detecta `STALL_ANALYSIS`, `REPEATED_RESEARCH`, `DUPLICATE_IMPLEMENTATION`, `STALE_STATE`, `FAKE_PASS`, `CONCURRENT_WRITE`, `MONOLITH_DRIFT`.

## AUDITOR
Examina requisitos, evidencia, contradicciones, cobertura y trazabilidad; nunca sustituye al ejecutor.

## JUDGE
Decide únicamente `VERIFIED_CLOSED | CLOSED_UNVERIFIED | GAP | BLOCKED | INCONCLUSIVE` desde evidencia objetiva.

## GUARDIAN
Impone no-force, no-destructive-dedup sin prueba, no secretos, no host escape, no segundo workflow owner y rollback obligatorio.

## WATCHDOG
`READ STATE → CHECK HEAD/ACTIONS → CURRENT 1×1 → EXECUTE SAFE DELTA → VERIFY → PERSIST → REPORT`.

## CONSOLIDATOR
Une resultados locales en Task/Phase/Project Consolidation y evita “100 piezas correctas, proyecto global incoherente”.

---

# 6. RESEARCH / REUSE FUNNEL

Antes de programar cada nodo:
1. chat/checkpoint ya resuelto;
2. `UI YAIWES/componentes open soure UI YAIWES/`;
3. todas las raíces de `frontend`;
4. repo `agentes`;
5. repo `router-universal-router-inteligente-`;
6. repo `osquestador-auditor`;
7. fuentes oficiales/docs/código;
8. comunidad solo como señal secundaria;
9. filtrar;
10. deduplicar;
11. rankear: código ya aprobado > fuente oficial fijada > código interno reusable > implementación nueva mínima;
12. registrar URL/SHA/licencia/destino.

Después de evidencia suficiente: EJECUTAR. No abrir otro ciclo de investigación sin una pregunta nueva.

---

# 7. ANTI-STALL

Si hay 5 operaciones consecutivas de lectura/análisis sin delta:
`STALL_DETECTED → definir GAP en 1 frase → escoger mínimo delta seguro → ejecutar → verificar`.

Un GAP no obliga a detener todo el proyecto. Si el nodo siguiente es independiente, se conserva FLAG+RECOVERY y se continúa.

---

# 8. EVIDENCE GRAPH / TRAZABILIDAD

Relaciones mínimas:
`SUPPORTS`, `CONTRADICTS`, `DEPENDS_ON`, `DERIVED_FROM`, `IMPLEMENTS`, `VALIDATES`, `SUPERSEDES`, `RELATED_TO`.

Cierre requerido:
`Goal → Requirement → Task → Artifact → Evidence → Validation → Judge`.

Coverage doble:
- TOP-DOWN: Goals→Requirements→Tasks→Artifacts.
- BOTTOM-UP: Artifacts→Tasks→Requirements→Goals.

Si falta cualquier enlace obligatorio: `INCOMPLETE`.

---

# 9. MEMORIA / CONTEXTO CONTINUO

La memoria no es una sola vector DB.

```text
L0 RAW SOURCE
L1 WORKING MEMORY
L2 TASK MEMORY
L3 PROJECT MEMORY
L4 LONG-TERM VALIDATED KNOWLEDGE
```

Ingestión:
`source → normalize → parse → structural/semantic chunk → metadata/tags → lexical index → semantic index → graph → provenance → store`.

Retrieval:
`task → structural/project/entity/time filters → lexical+semantic+graph+history+evidence → union → rerank → budget → ContextPack`.

Compresión nunca elimina la fuente original. `summary = navigation`, `original = authority`.

---

# 10. PARALELISMO / MAX-SYSTEM

Patrones autorizados como capacidad, no como segundo owner:
- fan-out/fan-in;
- batching;
- sharding por key/proyecto/concern;
- time-wheel cuando volumen lo justifique;
- idempotency + DLQ;
- outbox + CDC para propagación durable;
- worker pools por concern;
- prewarming/autoscale por queue depth;
- heartbeat/watchdog;
- checkpoints/snapshots/failover.

Stabilize conserva semántica del workflow. Ray/Taskiq/NATS/Valkey/etc. solo pueden ejecutar/transportar unidades ya autorizadas.

---

# 11. VIRTUAL COMPUTER — FRONTERA FUNCIONAL

Fuente funcional YAIWES:
`Flutter UI → Window Manager → Rust Core → VM/Storage/Network/Agent Managers → Platform Backend → Guest`.

Prioridades:
- Android: AVF/crosvm primero, QEMU fallback;
- Linux: KVM/QEMU;
- Windows: WHPX/QEMU;
- macOS: HVF/QEMU;
- iOS: capability-driven/secundario, sin prometer equivalencia Android.

Ventanas: Linux, Android, Agent, Files, Terminal, Apps, Settings, Systems/Network, Tasks/Trace.

Mirror ≠ Migration.
El agente controla integralmente la Virtual Computer autorizada; no obtiene acceso arbitrario al host.

---

# 12. COMMAND CENTER — FRONTERA FUNCIONAL

La fuente Command Center lista 85 capacidades. Deben mapearse a Requirements/Tasks; documentación ≠ implementación.

Familias obligatorias:
- chat/streaming/stop/history/system prompt;
- model selector/settings/AUTO/provider groups;
- attachments imagen/audio/voz/files;
- Markdown/código/copy/export PDF-DOCX-MD;
- task queue/prioridades/retries/dependencies/supervisor;
- DSL/JSON chain + Run/Status;
- health/failover/manual+auto/multi-key;
- model registry dinámico;
- project/GitHub selector;
- notes/folders/state board;
- knowledge/retrieval;
- artifacts/work panels;
- visual flow canvas;
- responsive/mobile;
- error/reconnect/rate-limit/logging;
- security/secret refs/RLS/auth real.

Nota de auditoría: cualquier especificación histórica que sugiera “URL privada = seguridad” debe quedar subordinada al principio actual `URL privada != autenticación/autorización`.

---

# 13. 50 GOALS DE ENTRADA→SALIDA

El detalle completo vive en `GOALS-50-ENTRADA-SALIDA-V5.md`. El Judge global no puede cerrar el proyecto mientras un GOAL requerido permanezca `PENDING/GAP/BLOCKED` sin una excepción explícita aprobada.

Clasificaciones: `VERIFIED | PARTIAL | PREPARED | SPECIFIED | GAP | BLOCKED | PENDING`.

---

# 14. 3 REFUTACIONES OBLIGATORIAS

## REFUTACIÓN R1 — “Action 124 existe/descargó cosas, entonces 124 están listos”
**Refutado.** Run cancelled; verify final falló; artifact prueba 86 intentados, 38 no intentados, 36 GAPs. No existe 124/124 PASS.

## REFUTACIÓN R2 — “Adapter + mock/injection PASS = integración terminada”
**Refutado.** P02A/P02C/P04 tienen evidencia de wiring pero falta ejecución vendor real exigida. Estado correcto: CLOSED_UNVERIFIED/FLAG.

## REFUTACIÓN R3 — “Bloque 0 NCT debe importarse a YAIWES porque está adjunto”
**Refutado.** El propio documento prohíbe mezclar NCT con YAIWES. Solo se reutiliza disciplina/método, no arquitectura funcional.

---

# 15. 3 ASK COUNCIL

## COUNCIL A — ARQUITECTURA / OWNERSHIP
12 preguntas: ¿owner único?, ¿segundo scheduler?, ¿UI canonical state?, ¿LLM write directo?, ¿sandbox boundary?, ¿Memory separada de Workflow?, ¿Mirror/Migration separados?, ¿contrato antes de ejecución?, ¿capability gap real?, ¿no-monolith?, ¿reuse-first?, ¿rollback definido?
Resultado permitido: `PASS | REPAIR | BLOCK`.

## COUNCIL B — EVIDENCIA / COBERTURA
12 preguntas: ¿Goal→Requirement?, ¿Requirement→Task?, ¿Task→Artifact?, ¿Artifact→Evidence?, ¿evidencia fresca?, ¿SHA/source?, ¿test real?, ¿mock marcado?, ¿contradicciones?, ¿top-down completo?, ¿bottom-up completo?, ¿Judge independiente?
Resultado permitido: `PASS | REPAIR | BLOCK`.

## COUNCIL C — EJECUCIÓN / RECOVERY
12 preguntas: ¿CURRENT 1×1?, ¿HEAD fresco?, ¿concurrencia?, ¿idempotency?, ¿StrategyDelta distinto?, ¿checkpoint?, ¿restore probado?, ¿FLAG no oculto?, ¿siguiente nodo independiente?, ¿no-force?, ¿no destructive dedup?, ¿handoff suficiente?
Resultado permitido: `PASS | REPAIR | BLOCK`.

---

# 16. 3 SIMULACIONES + SOLUCIÓN

## SIM-01 Action cancelada a mitad
Entrada: 124 tareas; cancelación después de 86 intentos.
No hacer: rerun ciego completo ni declarar éxito por carpetas existentes.
Solución: artifact→checkpoint/gaps→clasificar exacto→preservar completos→StrategyDelta para parciales/proveedores→procesar solo faltantes→verify-final hash→auditor independiente.

## SIM-02 version mismatch
Entrada: adapter correcto, runtime incompatible (Pydantic/Starlette).
No hacer: forzar instalación silenciosa o desactivar gate.
Solución: registrar expected/actual→fail closed→continuar nodo independiente→preparar entorno compatible→test vendor real→read-back→Judge.

## SIM-03 escritura concurrente/alias duplicado
Entrada: watchdog añade carpeta mientras otro chat integra.
No hacer: force push/borrado por nombre.
Solución: refresh HEAD→comparar SOURCE_URL/COMMIT/tree/code-root→adoptar delta compatible→dedup solo si identidad demostrada→preservar ambos historiales→verify.

---

# 17. GAP MATRIX GLOBAL

### Adquisición
- A124-G01 run cancelled.
- A124-G02 final destination verification failure.
- A124-G03 38 entradas no intentadas.
- A124-G04 36 gaps.tsv.
- A124-G05 20 checkpoints parciales.
- A124-G06 10 checkpoints aparentemente completos pero con repair_rc GAP.
- A124-G07 6 proveedores no-GitHub requieren StrategyDelta específico.
- A124-G08 Hypothesis index 9 está fuera de orden al final de la cola.
- A124-G09 pytest provenance mismatch.
- A124-G10 falta auditor independiente 124/124.

### Runtime/integración
- P02A vendor real.
- P02B exact Pydantic/core compatible runtime.
- P02C vendor real.
- P03 Starlette exact-version runtime.
- P04 Bulkman/resilient vendor real.
- P05 publish+real observability gates.
- P06 TEST_ONLY gates + pytest provenance.
- P07 DONOR_ONLY gates.
- P08 PyCasbin dependencies+real policy test.

### Arquitectura funcional todavía no cerrada
- Core State/Event/Task models completos.
- State machine/checkpoint/policy integration E2E.
- Memory/Audit Orchestrator real.
- Retrieval/Context Fabric real.
- Evidence Graph/coverage reconstruible.
- Router/resource brain.
- sandbox/Virtual Computer contracts e implementación por plataforma.
- Command Center 85 capacidades mapeadas y probadas.
- Chat API streaming/cancel/status real.
- End-to-end project reconstruction test.

---

# 18. SOLUTION CATALOG

1. Recuperar artifact Action antes de rerun.
2. Reusar checkpoint válido; no re-descargar sin causa.
3. Generar queue-delta solo faltantes/GAP.
4. Separar provider adapters (GitHub/googlesource/GitLab).
5. Ordenar QUEUE por `director_index` y validar unicidad/contigüidad.
6. Preflight debe comprobar `len(components)==expected_components` y set exacto 1..124.
7. Validar SOURCE_URL provider antes del job largo.
8. Validar filesystem size/capacidad antes de componente gigante.
9. Preserve provenance aunque no se monte runtime.
10. Dedup por URL+commit+tree, no por nombre.
11. Alias resolver con canonical component id.
12. Version gates explícitos.
13. Factory allowlist explícita.
14. MountGuard donor/test.
15. Real-vendor tests en entorno compatible.
16. Test injection separado y etiquetado.
17. Checkpoint cada componente.
18. Idempotency fingerprint por source commit + destination.
19. Artifact de gaps y final verify siempre generado incluso en cancelación.
20. Watchdog auditor separado del writer.

---

# 19. ORDEN DE PROGRAMACIÓN GLOBAL

Orden derivado de las fuentes y del estado real:
1. reconciliar adquisición/inventario;
2. Core State Model;
3. Event Model;
4. Task Model;
5. Task Contract;
6. deterministic State Machine;
7. Checkpoint Engine;
8. Policy Engine;
9. Memory Contract;
10. Retrieval Contract;
11. Context Fabric;
12. Sandbox Contract;
13. Worker Contract;
14. Output Schema;
15. Audit Engine;
16. Consolidator;
17. Router;
18. Continuous Loop;
19. Recovery/StrategyDelta;
20. Resource Brain;
21. Global Integration;
22. Five-pass Build Auditor;
23. API/streaming/cancel/status;
24. Command Center/UI;
25. Virtual Computer surfaces/platform backends;
26. final E2E + reconstruction + coverage + Judge.

La UI no puede ser evidencia de que el runtime existe.

---

# 20. PERSISTENCIA OBLIGATORIA

Después de un delta relevante actualizar:
- `BITACORA-CRAZY-WALL.md`
- `STATE.json`
- `CHECKPOINT.json`
- `PLAN-TAREAS.md`
- `RECOVERY-PATCH.md`
- arquitectura/delta correspondiente.

Cada actualización debe conservar:
`current_node`, `last_verified`, `evidence`, `flags`, `strategy`, `next_delta`, `rollback`, `source authority`.

---

# 21. PROGRESO — FÓRMULA

Nunca un único porcentaje ambiguo.

Reportar:
- `VERIFIED_PROGRESS`: requirements/goals cerrados con evidencia real.
- `PHYSICAL_IMPLEMENTATION_PROGRESS`: código/artefacts publicados aunque existan flags.
- `SPECIFICATION_COVERAGE`: goals/requisitos ya especificados.

No contar una carpeta descargada como integración. No contar un documento como código.

---

# 22. CRITERIO DE CIERRE GLOBAL

Antes del cierre:
1. 50 GOALS auditados.
2. cada Requirement enlaza Task/Artifact/Evidence/Validation.
3. 3 refutaciones repetidas contra estado final.
4. Council A/B/C PASS.
5. Audit requirements/evidence/contradictions/coverage/traceability PASS.
6. E2E real desde MasterInput hasta FinalOutput.
7. recovery desde checkpoint probado.
8. top-down y bottom-up equivalentes.
9. reconstruction test desde manifest/STATE sin depender del chat.
10. Final Judge devuelve `VERIFIED_CLOSED`.

Hasta entonces el estado global es `ACTIVE_LOOP`, `CLOSED_UNVERIFIED`, `BLOCKED` o `INCONCLUSIVE`, nunca “listo” por declaración.
