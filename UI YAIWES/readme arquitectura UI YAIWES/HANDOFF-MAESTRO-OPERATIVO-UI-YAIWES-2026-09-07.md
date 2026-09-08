# HANDOFF MAESTRO OPERATIVO — UI YAIWES

Fecha de corte: 2026-09-07
Repo: `maxbry123-commits/frontend`
Raíz: `UI YAIWES/`
Contrato canónico de arquitectura: `tel.workflow/v3`
Modo: `FAIL_CLOSED_LOOP`
Guía metodológica complementaria: `GUIA-MAESTRA-EJECUCION-LOOP-SOL-UI-YAIWES.md` (`tel.workflow/v4` como overlay de ejecución; NO sustituye silenciosamente el contrato canónico v3).
Owner único del workflow: `stabilize_core`.

---

# 0. PROPÓSITO DEL HANDOFF

Este archivo existe para que otro chat Sol pueda continuar el proyecto sin reconstruir la historia, sin reinterpretar decisiones cerradas y sin confundir presencia de archivos con integración real.

Ley operativa:

`ESTADO REAL → NODO LITERAL → REUSE SEARCH → DELTA 1×1 → VALIDACIÓN → VERIFY REAL → PERSISTENCIA → SIGUIENTE NODO`

Nunca:
- inventar PASS;
- rehacer trabajo ya VERIFIED_CLOSED;
- usar `force` en `main`;
- borrar/deduplicar sin snapshot y evidencia;
- fusionar responsabilidades en un monolito;
- aceptar que un repo descargado equivale a wiring;
- aceptar un mock como ejecución real;
- convertir staging en cierre;
- dejar GAP sin StrategyDelta y recovery.

---

# 1. ORDEN DE AUTORIDAD

1. Estado físico actual de GitHub y runtime verificable.
2. `ARQUITECTURA-PROGRAMACION-CONSOLIDADA-UI-YAIWES.md` — contrato canónico `tel.workflow/v3`.
3. `STATE.json` + `CHECKPOINT.json` + `PLAN-TAREAS.md` + `RECOVERY-PATCH.md` + `BITACORA-CRAZY-WALL.md`.
4. Evidencia de commits, trees, blobs, tests, Actions y read-back.
5. `GUIA-MAESTRA-EJECUCION-LOOP-SOL-UI-YAIWES.md` — metodología de ejecución anti-stall.
6. Documentos fuente del Director.
7. Memoria del chat.
8. Inferencia.

Si dos fuentes contradicen:
`estado_real > contrato_canónico > checkpoint > documento histórico > inferencia`.

---

# 2. X-RAY CRUZADO — TRES ARCHIVOS ADJUNTOS

## Fuente A — `MAX-SYSTEM-100X-FINAL-1.md`
Aporta como requisitos metodológicos/arquitectónicos:
- fan-out/fan-in;
- batching;
- sharding por key/concern;
- idempotency keys + DLQ;
- outbox/CDC cuando aplique;
- pools de workers separados;
- prewarming/autoscale por profundidad de cola;
- ejecución durable;
- recuperación/failover;
- multi-sandbox;
- memoria persistente y checkpoints.

Implicación YAIWES:
- NO crear segundo workflow owner para paralelismo;
- Stabilize conserva semántica del workflow;
- pools/colas son ejecutores/transporte;
- toda paralelización debe preservar idempotencia, evidence refs y checkpoint.

## Fuente B — `memoria del Wordflow ... contexto de 20 millones ... YAIWES.md`
Aporta requisitos de frontera y continuidad:
- Workflow decide QUÉ HACER;
- Memory/Audit decide QUÉ INFORMACIÓN RECUPERAR;
- Sandbox define DÓNDE ejecutar;
- LLM razona, no gobierna estado;
- Consolidator integra resultados locales;
- Auditor verifica;
- Checkpoint recupera;
- StateDelta es candidato, no escritura canónica automática;
- la LLM no escribe directamente memoria canónica;
- retrieval debe ser híbrido, jerárquico y con provenance;
- Requirement Traceability: USER REQUIREMENT→TASK→ARTIFACT→EVIDENCE→VALIDATION;
- cross-check top-down y bottom-up;
- cobertura global obligatoria antes de cierre;
- integración jerárquica: work unit→task→phase→project→final.

Implicación YAIWES:
- falta todavía implementar varias capas de Memory/Audit, Context Fabric, coverage e integration state;
- no basta conectar plugins P02–P08.

## Fuente C — `0. # bloque 0 versión 4 beta.md`
Este archivo pertenece a NCT y NO se eleva automáticamente a autoridad arquitectónica YAIWES. Se reutilizan únicamente reglas metodológicas compatibles:
- constitución/leyes inmutables;
- orden de lectura antes de actuar;
- decisiones cerradas no se reabren sin evidencia nueva;
- separar diseño, pipeline y estado real;
- validación antes de entrega;
- CI/CD y health como evidencia, no como sustituto de ejecución.

GAP documental detectado:
- la arquitectura canónica YAIWES enumera 4 documentos únicos de verdad: MAX-SYSTEM, Memoria Wordflow, Virtual Computer y Command Center;
- el conjunto adjunto disponible para este handoff contiene MAX-SYSTEM, Memoria Wordflow y un documento NCT.
- por lo tanto Virtual Computer y Command Center siguen siendo fuentes YAIWES canónicas a conservar y revisar en auditorías futuras; NO se reemplazan por NCT.

---

# 3. PRINCIPIO ARQUITECTÓNICO INMUTABLE

`THE MODEL THINKS.`
`THE RUNTIME CONTROLS.`
`THE MEMORY REMEMBERS.`
`THE RETRIEVER FINDS.`
`THE AUDITOR QUESTIONS.`
`THE CONSOLIDATOR CONNECTS.`
`THE CHECKPOINT RECOVERS.`
`THE POLICY AUTHORIZES.`
`THE JUDGE VALIDATES.`

Consecuencias:
- LLM = worker cognitivo intercambiable.
- Stabilize = único owner de workflow.
- Sheriff = gate previo a ejecución.
- Validator = valida contrato/estructura.
- Verifier = prueba evidencia real.
- Sentinel = vigila estado, concurrencia y drift.
- Supervisor = vigila al propio agente y anti-stall.
- Judge = clasifica PASS/FAIL/REPAIR/BLOCKED.
- Guardian = protege invariantes destructivos y permisos.

---

# 4. DSL DEL NODO

```yaml
node:
  id: PXX
  input_literal: "texto exacto del Director"
  claim_to_validate: "afirmación demostrable"
  destination: "repo/ruta exacta"
  dependencies: []
  authority: tel.workflow/v3
  state: PENDING|ACTIVE|VERIFYING|GAP|BLOCKED|CLOSED_UNVERIFIED|VERIFIED_CLOSED
  evidence_required:
    - path
    - diff_or_blob
    - commit_sha
    - test_or_log
    - read_back
    - source_url_if_external
  acceptance: []
  failure: []
  rollback: []
  next_if_pass: ""
  next_if_fail: "StrategyDelta distinto"
```

Acción del nodo:
`VALIDA QUE X OCURRIÓ Y CITA PRUEBA`, nunca una orden ciega.

---

# 5. DAG MAESTRO DE TRABAJO

```text
DIRECTOR INPUT
   ↓
INPUT LITERAL + HASH
   ↓
SHERIFF
   ↓
STATE/CHECKPOINT/HEAD READ
   ↓
GOALS + REQUIREMENTS
   ↓
REUSE SEARCH 5 UBICACIONES
   ↓
PLAN 1×1
   ↓
EXECUTE SAFE DELTA
   ↓
VALIDATOR
   ↓
VERIFIER
   ├── PASS_REAL ───────────────┐
   ├── PASS_MOCK_ONLY → FLAG    │
   ├── BLOCKED_EXTERNAL → FLAG  │
   └── FAIL → GAP               │
                ↓               │
         RESEARCH/STRATEGYDELTA │
                ↓               │
             RETRY              │
                                ▼
                         CONSOLIDATOR
                                ↓
                     STATE DELTA + AUDIT
                                ↓
                         CHECKPOINT
                                ↓
                       COVERAGE CHECK
                                ↓
                       JUDGE / GUARDIAN
                                ↓
                        NEXT NODE / CLOSE
```

---

# 6. CADENA SHERIFF → VALIDATOR → VERIFIER → SENTINEL → SUPERVISOR → JUDGE → GUARDIAN

## SHERIFF
Debe responder antes de escribir:
1. nodo literal;
2. destino exacto;
3. dependencias;
4. último cierre válido;
5. evidencia disponible;
6. trabajo concurrente;
7. riesgo destructivo;
8. reusable code existente.

## VALIDATOR
Comprueba:
- schema;
- imports;
- boundary;
- owner único;
- no monolito;
- source provenance;
- destination;
- fail-closed;
- concurrency safety;
- tests/gates definidos.

## VERIFIER
Orden:
1. read-back archivo publicado;
2. comparar contenido/sha;
3. test determinista;
4. test integración real;
5. logs/run;
6. repetir checks flaky hasta 10x;
7. clasificar evidencia.

## SENTINEL
Vigila:
- HEAD cambiante;
- Actions;
- commits concurrentes;
- stale checkpoint;
- drift de owner;
- alias/duplicados;
- flags abiertos.

## SUPERVISOR
Vigila al agente:
- STALL_ANALYSIS;
- REPEATED_RESEARCH;
- DUPLICATE_IMPLEMENTATION;
- FAKE_PASS;
- STALE_STATE;
- MONOLITH_DRIFT.

## JUDGE
Estados finales permitidos:
- VERIFIED_CLOSED;
- CLOSED_UNVERIFIED;
- BLOCKED;
- GAP;
- ACTIVE.

## GUARDIAN
Bloquea:
- force push;
- borrar sin dedup probado;
- secret leakage;
- overwrite concurrente;
- vendor mutation innecesaria;
- segundo workflow owner;
- claim sin evidencia.

---

# 7. 50 GOALS DE ENTRADA/SALIDA MÍNIMOS

Formato: `GOAL → INPUT → OUTPUT → ACCEPTANCE`.

1. G01 Recuperar HEAD real → repo/ref → SHA actual → SHA leído y registrado.
2. G02 Recuperar contrato canónico → arquitectura → `tel.workflow/v3` → no reinterpretado.
3. G03 Recuperar checkpoint → CHECKPOINT.json → nodo actual → coincide con STATE.
4. G04 Recuperar plan → PLAN-TAREAS.md → cola 1×1 → no contradice checkpoint.
5. G05 Recuperar bitácora → BITACORA → eventos previos → sin pérdida de incidentes.
6. G06 Recuperar recovery → RECOVERY-PATCH → StrategyDelta heredado → ejecutable.
7. G07 Validar owner único → registry/catalog → `stabilize_core` → ningún segundo owner.
8. G08 Revalidar inventario post-124 → raíz componentes → inventario fresco → cada entrada clasificada.
9. G09 Recuperar artifact Action124 → run artifact → verify-final/gaps → conteo exacto.
10. G10 Resolver Action124 → gaps.tsv → delta de adquisición → solo faltantes/reparables.
11. G11 Corregir provenance pytest → contenido físico → snapshot exacto → SOURCE_COMMIT no stale.
12. G12 Deduplicar aliases → pares físicos → decisión keep/delete → misma source/tree demostrada.
13. G13 Preservar licencias → componentes → license refs → ninguna licencia requerida borrada.
14. G14 Mantener code-only runtime → vendor → raíces útiles → sin CI/docs upstream innecesarios.
15. G15 Cerrar P02A → Stabilize adapter → mount vendor real → health/test PASS.
16. G16 Cerrar P02B → Pydantic source/core → pareja compatible → runtime real PASS.
17. G17 Cerrar P02C → Rule Engine → vendor import real → policy test PASS.
18. G18 Cerrar HTTPX → adapter → transport real → PASS reproducible.
19. G19 Cerrar Starlette → versión exacta → ASGI runtime → test real PASS.
20. G20 Cerrar resilient-circuit → vendor → circuit state test → PASS real.
21. G21 Cerrar Bulkman → vendor → bulkhead execution → PASS real.
22. G22 Implementar Structlog adapter → source → logging runtime → structured event PASS.
23. G23 Implementar OTel API adapter → API → trace propagation → PASS.
24. G24 Implementar OTel SDK adapter → SDK → exporter/provider test → PASS.
25. G25 Cerrar pytest gate → TEST_ONLY → guard → production mount rejected.
26. G26 Cerrar Hypothesis gate → TEST_ONLY → guard → production mount rejected.
27. G27 Cerrar Dagu donor gate → DONOR_ONLY → guard → production owner rejected.
28. G28 Cerrar redun donor gate → DONOR_ONLY → guard → production owner rejected.
29. G29 Implementar PyCasbin adapter → policy source → authorization test → PASS real.
30. G30 Crear MasterInputContract → literal input → typed immutable object → hash/version.
31. G31 Crear GoalContract → user intent → goals estructurados → coverage map.
32. G32 Crear RequirementContract → goals → requisitos → cada requisito trazable.
33. G33 Crear TaskContract → requisito → tarea ejecutable → acceptance/evidence.
34. G34 Crear StateDelta contract → worker output → candidate delta → audit antes de commit.
35. G35 Crear StrategyDelta contract → failure → estrategia distinta → fingerprint diferente.
36. G36 Crear EvidenceRef → ruta/log/URL/SHA → ref estable → judge consumible.
37. G37 Crear ContextRequest → task → request estructurada → scope explícito.
38. G38 Crear ContextPack → retrieval → pack versionado → provenance incluida.
39. G39 Crear Memory/Audit adapter boundary → requests → response tipada → no workflow ownership.
40. G40 Crear retrieval híbrido → lexical/semantic/graph/tags → candidates → rerank verificable.
41. G41 Crear Evidence/Contradiction engine → claims → contradicciones → flags persistidos.
42. G42 Crear Consolidator → task artifacts → integración jerárquica → global state candidate.
43. G43 Crear Coverage engine → requirements/artifacts → matriz coverage → 100% o GAP.
44. G44 Crear IntegrationState → artifacts/deps → estado global → no fragmentación.
45. G45 Crear Checkpoint engine → state/events → checkpoint → resume/rollback probado.
46. G46 Crear Router adapter → capability registry → route → health/permission/cost aware.
47. G47 Crear sandbox contract → task → isolated workspace → deterministic lifecycle.
48. G48 Crear Chat API → input/stream/cancel/status → RunID/events → backend canonical.
49. G49 Crear E2E → chat→workflow→memory→sandbox→judge → evidence chain → PASS.
50. G50 Cierre global → 50 goals + requirements → bidirectional traceability → VERIFIED_CLOSED solo con 100% evidence coverage.

---

# 8. ESTADO REAL DEL PROYECTO A ESTE CORTE

## LISTO / EVIDENCIA FUERTE
- Arquitectura canónica v3 publicada.
- Guía maestra anti-stall publicada.
- Crazy Wall/STATE/CHECKPOINT/PLAN/RECOVERY existentes.
- P01 baseline histórico 14/14 estuvo VERIFIED_CLOSED antes de adquisición 124.
- Socket universal modular existe: contract/catalog/registry/mount_guard/loader.
- Stabilize es owner único.
- P02A adapter/DI existe.
- P02B adapter/version gate existe.
- P02C Rule Engine adapter/vendor/read-back existe.
- P03 HTTPX tiene prueba real local; Starlette tiene gate de versión.
- P04 Bulkman/resilient-circuit tienen adapters/vendor/read-back/injection.
- Revalidación post-124 ya clasificó al menos: gVisor, gfxstream, jsPDF, libdatachannel, pgvector, pytest y redun.

## PREPARADO PERO NO CERRADO
- P05 Structlog/OpenTelemetry.
- P06 pytest/Hypothesis gates.
- P07 Dagu/redun donor gates.
- P08 PyCasbin adapter/policy.

## NO TERMINADO
- reconciliación completa post-124;
- artifact exacto de verify-final/gaps de Action124;
- snapshot físico exacto pytest;
- cierre real-vendor P02A/B/C/P03/P04;
- P05–P08 publicación y verify final;
- contratos globales G30–G38;
- Memory/Audit G39–G41;
- consolidación/cobertura G42–G44;
- checkpoint/router/sandbox/chat/E2E G45–G50.

---

# 9. GITHUB ACTION 124 — GAP REGISTRADO

Workflow:
`.github/workflows/ui-yaiwes-124-download-extract-20260906.yml`

Run:
`34060401131`

Job:
`101559786309 / queue-124`

Estado:
- run `completed`;
- conclusion `cancelled`;
- preflight PASS;
- proceso 124 cancelado;
- verify final destination = failure;
- fail-closed = failure;
- checkpoints/artifact preservation = success.

No declarar 124/124.

GAPs asociados:
1. recuperar artifact `verify-final.json`;
2. recuperar `gaps.tsv`;
3. obtener número exacto VERIFIED;
4. identificar último índice procesado;
5. diferenciar MISSING vs TRACE_MISSING vs HASH_GAP vs SOURCE_PROVIDER_GAP vs CLONE_GAP;
6. crear delta únicamente para faltantes;
7. no reiniciar 124 completos si ya existe material válido;
8. revalidar destination read-back;
9. actualizar inventario y provenance;
10. solo entonces cerrar P01 post-124.

StrategyDelta recomendado:
`artifact-first recovery`, no `rerun-all-first`.

---

# 10. MATRIZ DE GAPS Y SOLUCIONES

| GAP | Clasificación | Evidencia | Solución primaria | Fallback |
|---|---|---|---|---|
| Action124 cancelada | BLOCK | run/job | artifact-first delta | rerun solo failed/missing |
| P01 stale | GAP | root cambió | revalidación 1×1 | snapshot tree global |
| pytest SOURCE_COMMIT stale | GAP provenance | nodeid.py posterior | localizar snapshot exacto | reconstruir provenance por blobs |
| P02A vendor real no probado | CLOSED_UNVERIFIED | mocks PASS | ejecutar vendored Orchestrator | CI isolated test |
| P02B core mismatch | BLOCK version | 2.48.0 vs 2.46.4 | runtime exacto | container/venv pinned |
| P02C vendor real pendiente | CLOSED_UNVERIFIED | read-back PASS | import real | isolated CI |
| Starlette mismatch | BLOCK version | 1.6.0 vs local 0.50.0 | env pinned | isolated CI |
| P04 vendors no ejecutados | CLOSED_UNVERIFIED | injection PASS | install/vendor import tests | isolated CI |
| P05 preparado no cerrado | PENDING | staging/design | publish after P01 fresh | branch isolated |
| P08 PyCasbin deps faltantes | BLOCK deps | simpleeval/wcmatch absent | pinned env | vendor deps isolate |
| Memory/Audit incompleto | ARCH GAP | source truth | contracts+retrieval+audit | incremental nodes |
| Coverage engine faltante | ARCH GAP | source truth | requirement matrix | deterministic checker |
| Consolidator incompleto | ARCH GAP | source truth | hierarchical artifact merge | phase-by-phase |
| E2E faltante | SYSTEM GAP | no full chain | test chat→judge | staged integration |

---

# 11. TRES REFUTACIONES OBLIGATORIAS

## Refutación R1
Hipótesis: “Los componentes están descargados, entonces P01 está cerrado”.
Refutación: la Action124 fue cancelada y verify-final falló; el baseline 14/14 histórico no certifica la raíz posterior.
Veredicto: FALSO. P01 post-124 sigue ACTIVE.

## Refutación R2
Hipótesis: “Adapters con mocks PASS significan integración”.
Refutación: P02A/P04 tienen pruebas de inyección/read-back pero vendor real no ejecutado.
Veredicto: FALSO. CLOSED_UNVERIFIED hasta prueba real.

## Refutación R3
Hipótesis: “Completar P02–P08 significa terminar YAIWES”.
Refutación: fuentes de verdad exigen contracts, state machine, checkpoint, memory/audit, retrieval, consolidator, coverage, router, sandbox, API/UI y E2E.
Veredicto: FALSO. P02–P08 son infraestructura base, no cierre global.

---

# 12. TRES ASK COUNCIL

## Council 1 — Arquitectura
Pregunta: ¿Stabilize debe seguir como único owner mientras se añaden pools/colas/paralelismo?
- Validator: sí, evita dual ownership.
- Verifier: exige que ningún plugin declare workflow owner adicional.
- Sentinel: vigila catalog/registry.
- Judge: PASS solo si owner único se mantiene.
Resultado: KEEP STABILIZE SINGLE OWNER.

## Council 2 — Action124
Pregunta: ¿repetir 124 completos o recuperar artifact y ejecutar delta?
- Validator: artifact-first conserva idempotencia.
- Verifier: `verify-final.json/gaps.tsv` permiten medir faltantes.
- Guardian: evita overwrite y descarga innecesaria.
- Judge: delta-only preferido.
Resultado: ARTIFACT-FIRST, RERUN-ONLY-MISSING.

## Council 3 — Estado global
Pregunta: ¿avanzar P05 mientras P01 post-124 está stale?
- Supervisor: puede prepararse trabajo independiente.
- Guardian: no elevarlo a integración canónica si depende del inventario.
- Judge: staging/prepared permitido, VERIFIED_CLOSED no.
Resultado: PREPARE SAFE, PUBLISH/CLOSE ONLY AFTER DEPENDENCY GATE.

---

# 13. TRES SIMULACIONES + SOLUCIÓN

## Simulación S1 — Action124 artifact dice 83/124 VERIFIED
Acción:
1. parsear 41 gaps;
2. agrupar por causa;
3. separar provider gaps de clone/hash/trace;
4. ejecutar queue delta de 41 o menos;
5. read-back 124;
6. auditor independiente.
No hacer: rerun 124 a ciegas.

## Simulación S2 — pytest snapshot no coincide con SOURCE_COMMIT
Acción:
1. inventariar blobs físicos clave;
2. buscar commit upstream que contenga esos blobs;
3. identificar tree exacto;
4. corregir SOURCE_COMMIT/manifest solo si demostrado;
5. conservar licencia;
6. test-only, no production mount.

## Simulación S3 — P02A funciona con mock pero vendor falla import
Acción:
1. capturar traceback;
2. clasificar dependencia/import/path;
3. no modificar vendor primero;
4. corregir adapter/env;
5. retry con StrategyDelta distinto;
6. mount real + health + loader + owner check;
7. solo entonces VERIFIED_CLOSED.

---

# 14. LISTA DE TAREAS MAESTRA

## FASE A — RECOVERY/INVENTORY
A01 recuperar artifact Action124.
A02 leer verify-final.json.
A03 leer gaps.tsv.
A04 calcular verified/missing exactos.
A05 continuar revalidación post-124 1×1.
A06 resolver pytest provenance.
A07 dedup aliases probados.
A08 actualizar COMPONENT-INVENTORY/CODE-MAP.
A09 revalidar P01 post-124.

## FASE B — PLUGIN BASE
B01 P02A Stabilize real vendor.
B02 P02B Pydantic exact runtime.
B03 P02C Rule Engine real vendor.
B04 P03 Starlette exact runtime.
B05 P04 resilient-circuit real.
B06 P04 Bulkman real.
B07 P05 Structlog.
B08 P05 OTel API.
B09 P05 OTel SDK.
B10 P06 TEST_ONLY gates.
B11 P07 DONOR_ONLY gates.
B12 P08 PyCasbin.

## FASE C — CONTRATOS DETERMINISTAS
C01 MasterInputContract.
C02 GoalContract.
C03 RequirementContract.
C04 PlanContract.
C05 TaskContract.
C06 DependencyRef.
C07 ContextRequest/ContextPackRef.
C08 EvidenceRef/ArtifactRef.
C09 StateDelta.
C10 StrategyDelta.
C11 ValidationResult/ClosureResult.

## FASE D — MEMORY/AUDIT
D01 ingestion registry.
D02 provenance/versioning.
D03 lexical index adapter.
D04 semantic index adapter.
D05 graph relation adapter.
D06 tag/entity index.
D07 retrieval union.
D08 reranker/filter.
D09 context budget.
D10 Evidence/Claim store.
D11 contradiction engine.
D12 audit engine.
D13 context pack builder.

## FASE E — EXECUTION GLOBAL
E01 checkpoint engine.
E02 event/state machine.
E03 idempotency/execution fingerprints.
E04 retry/StrategyDelta.
E05 router capability registry.
E06 resource health/authorization.
E07 sandbox contract.
E08 worker pools.
E09 consolidator.
E10 integration state.
E11 coverage engine.
E12 final judge.

## FASE F — CHAT/API/UI
F01 chat API submit.
F02 streaming events.
F03 cancel semantics.
F04 status/run trace.
F05 attachments refs.
F06 Work/Artifact persistence.
F07 History/project/session fabric.
F08 Health/Tool panels.
F09 FlowCanvas IR validation.

## FASE G — VERIFY FINAL
G01 unit tests.
G02 integration tests.
G03 real vendor tests.
G04 concurrency tests.
G05 retry/rollback tests.
G06 memory retrieval tests.
G07 contradiction tests.
G08 coverage tests.
G09 E2E chat→workflow→memory→sandbox→judge.
G10 traceability audit 50/50 goals.

---

# 15. RUTA ANTI-STALL PARA CUALQUIER CHAT SOL

Al entrar:
1. leer este handoff;
2. leer STATE;
3. leer CHECKPOINT;
4. leer PLAN;
5. leer RECOVERY;
6. leer HEAD;
7. comprobar Actions;
8. identificar CURRENT_NODE;
9. ejecutar un delta seguro antes de repetir análisis.

Regla de 5 lecturas:
si ya hubo 5 operaciones de lectura útiles y existe acción segura, ejecutar.

---

# 16. RESEARCH FUNNEL OBLIGATORIO POR NODO

1. Chat/checkpoint actual.
2. `UI YAIWES/componentes open soure UI YAIWES/`.
3. todas las raíces `frontend`.
4. repo `agentes`.
5. repo `router-universal-router-inteligente-`.
6. repo `osquestador-auditor`.
7. código/documentación oficial externa cuando aplique.
8. comunidad solo secundaria.
9. filtrar URL real.
10. dedup.
11. rank: código aprobado > oficial > interno reutilizable > nueva implementación mínima.

---

# 17. CRITERIO DE CIERRE GLOBAL

El proyecto NO está terminado porque “la UI se ve” o porque “los plugins existen”.

Debe demostrarse:
- 50/50 GOALS cubiertos;
- cada requirement tiene task/artifact/evidence/validation;
- cross-check top-down PASS;
- cross-check bottom-up PASS;
- no contradicciones críticas abiertas;
- no flags de runtime críticos;
- checkpoint/resume probado;
- retry StrategyDelta probado;
- Memory/Audit y retrieval probados;
- Consolidator probado;
- Coverage engine probado;
- E2E real probado;
- STATE/CHECKPOINT/PLAN/RECOVERY/BITACORA sincronizados;
- Judge = VERIFIED_CLOSED.

---

# 18. PROGRESO — REGLA DE MEDICIÓN

Nunca dar un único porcentaje sin separar categorías.

Reportar:
- `VERIFIED_CLOSED_PERCENT` = solo nodos cerrados con evidencia real.
- `IMPLEMENTED_OR_PREPARED_PERCENT` = código/diseño/staging con evidencia parcial.
- `GLOBAL_PHYSICAL_PROGRESS_PERCENT` = ponderación explícita de fases, nunca sensación.

El baseline P01 14/14 es histórico; mientras P01 post-124 esté stale no se cuenta como inventario fresco final.

---

# 19. RECOVERY PATCH DE EMERGENCIA

Si un nuevo chat pierde contexto:

```text
READ HANDOFF
→ READ STATE
→ READ CHECKPOINT
→ READ PLAN
→ READ RECOVERY
→ FETCH main HEAD
→ FETCH Action124 status/artifact
→ RESOLVE CURRENT NODE
→ DO NOT REPEAT VERIFIED WORK
→ EXECUTE ONE SAFE DELTA
→ VERIFY
→ PERSIST ALL FIVE OPERATIONAL FILES
```

Si STATE y CHECKPOINT discrepan:
- usar evidencia más fresca;
- registrar discrepancy;
- corregir ambos en el mismo ciclo.

Si `main` cambia durante escritura:
- abortar write;
- fetch HEAD;
- inspeccionar commit;
- adoptar si coincide;
- reinyectar solo delta faltante;
- jamás force.

Si aparece GAP:
- guardar error/log;
- no repetir misma estrategia;
- research up to 20 solo si necesario;
- elegir mejor StrategyDelta;
- ejecutar;
- verificar;
- mantener flag si bloque externo.

---

# 20. CHECKLIST DE HANDOFF

- [x] contrato canónico identificado.
- [x] guía metodológica separada de arquitectura.
- [x] fuentes adjuntas cruzadas sin fusionar NCT con YAIWES.
- [x] 50 GOALS definidos.
- [x] 3 refutaciones.
- [x] 3 Ask Council.
- [x] 3 simulaciones/soluciones.
- [x] gaps Action124 documentados.
- [x] P01–P08 clasificados.
- [x] lista de tareas completa hasta E2E.
- [x] Recovery Patch incluido.
- [ ] artifact Action124 leído y cuantificado.
- [ ] P01 post-124 fresco.
- [ ] P02–P08 cerrados con runtime real.
- [ ] contratos globales completos.
- [ ] Memory/Audit completo.
- [ ] Consolidator/Coverage completos.
- [ ] Chat API/E2E completos.
- [ ] 50/50 evidence coverage.

---

# 21. PRÓXIMO NODO EXACTO

`P01_POST_124_INVENTORY_REVALIDATION`

Siguiente delta prioritario:
`recuperar artifact del run 34060401131 → leer verify-final.json + gaps.tsv → cuantificar destino exacto → continuar únicamente faltantes`.

En paralelo seguro:
`continuar clasificación 1×1 de componentes post-124 sin montarlos automáticamente`.

Cierre del nodo:
solo cuando el inventario físico/provenance/dedup completo post-124 tenga evidencia fresca.
