# HANDOFF ASTRA — AUDITORÍA + EJECUCIÓN — UI YAIWES V6

Fecha: 2026-09-12
Repo: `maxbry123-commits/frontend`
Branch: `main`
Raíz: `UI YAIWES/`
Contrato: `tel.workflow/v3`
Modo: `FAIL_CLOSED_LOOP`
Estado: `ACTIVE_LOOP_NOT_CLOSED`

## 0. OBJETIVO DE ESTE HANDOFF

Dar a Astra GPT un único punto de entrada para auditar exhaustivamente documentos↔arquitectura↔código↔tests↔evidencia y ejecutar únicamente deltas realmente faltantes, sin pisar a Sol1/Sol2/Sol3 ni duplicar capacidades existentes.

Reglas absolutas:
- `SPECIFIED != IMPLEMENTED != WIRED != RUNTIME_TEST_PASS != VERIFIED_CLOSED`.
- Una tarea = un nodo literal.
- Máximo 3 pasos por tarea: `VERIFY/RESEARCH → EXECUTE DELTA → TEST/REPORT`.
- Sin evidencia real = GAP.
- GAP local bloquea sólo su nodo; continuar con siguiente FREE.
- Antes de escribir: releer HEAD, Crazy Wall y role states; reclamar nodo y write_scope.
- REUSE > PATCH > ADAPT > GENERATE.
- No LFS, no force, no overwrite concurrente.
- Motores canónicos inmutables; no crear downloader/extractor/mover alternativo.

## 1. FUENTES DE VERDAD OBLIGATORIAS

Leer en este orden:
1. `UI YAIWES/➡️📂 Wordflow LOOP UI YAIWES/documentos proyectos UI YAIWES/📌MAX-SYSTEM-100X-FINAL-1.md`
2. `UI YAIWES/➡️📂 Wordflow LOOP UI YAIWES/documentos proyectos UI YAIWES/📌👨‍💻 ULTIMA VERSIÓN cómo HACERLO MEJOR Q grock tiene ventanas agente  linux iOS Android phyton 🤯🤯🤯🎯 14 objetivos💡💡💡✅✅✅🎯🎯🎯.md`
3. `UI YAIWES/➡️📂 Wordflow LOOP UI YAIWES/documentos proyectos UI YAIWES/🤯🗃️memoria del Wordflow resumen de lo que va en memoria del Wordflow para Kimi k y grock contexto de 20 millones d parámetros para el Wordflow y YAIWES.md`
4. `UI YAIWES/readme arquitectura UI YAIWES/HANDOFF-MAESTRO-OPERATIVO-UI-YAIWES-V5.md`
5. `UI YAIWES/bitácora stated JSON Craxy wall plan checkpoint/CROSSCHECK-3-FUENTES-WORDFLOW-2026-09-11.json`
6. `UI YAIWES/bitácora stated JSON Craxy wall plan checkpoint/AUDIT-GAP-LEDGER-4AI-2026-09-11.json`
7. `UI YAIWES/bitácora stated JSON Craxy wall plan checkpoint/CRAZY-WALL-OSS11-RESULT-DELTA-2026-09-11.json`
8. `UI YAIWES/bitácora stated JSON Craxy wall plan checkpoint/CRAZY-WALL-OPA-OPENFGA-LIVE-DELTA-2026-09-11.json`
9. `UI YAIWES/bitácora stated JSON Craxy wall plan checkpoint/DISPATCH-OSS11-SOL123-2026-09-11.json`
10. HEAD real de `main` + workflows/runs vigentes.

Autoridad: `repo/runtime/tests/logs reales > STATE/CHECKPOINT/Crazy Wall > handoff/arquitectura > docs funcionales > memoria chat > inferencia`.

## 2. CÓDIGO QUE ASTRA DEBE CRUZAR

Wordflow determinista:
- `UI YAIWES/➡️📂 Wordflow LOOP UI YAIWES/wordflow_loop/wordflow_loop/runner.py`
- `.../contracts.py`
- `.../ledger.py`
- `.../governance/**`
- `.../layers/layer_01_research.py` … `layer_06_source_evolution.py`
- `.../contracts/workflow.dsl.yaml`

Runtime:
- `UI YAIWES/➡️📂 Wordflow LOOP UI YAIWES/runtime/src/core/**`
- `.../runtime/src/plugins/**`
- `.../runtime/src/governance/**`
- `.../runtime/src/agent/**`
- `.../runtime/src/integration/**`
- `.../runtime/src/recovery/**`
- `.../runtime/src/uek/**`
- `.../runtime/src/adapters/**`
- `.../runtime/tests/**`

## 3. ESTADO YA PROBADO — NO REPETIR COMO SI FUERA NUEVO

Existe y tiene evidencia:
- runner fail-closed de nodo literal.
- Sheriff/Validator/Sentinel/Verifier/Supervisor/Judge/Guardian.
- ledger durable/replay con integridad.
- capas L01–L06.
- Fables socket + bridge Stabilize testeados.
- OPA/OpenFGA adquiridos, cableados por Fables y `LIVE_RUNTIME_PASS` en sublane policy.
- OSS11: 6/11 `SOURCE_PRESENT_READBACK_VERIFIED`: OPA, OpenFGA, rqlite, OpenTelemetry Collector, ORAS, Testcontainers Python.

No promover por presencia:
- 5/11 nuevos OSS continúan `PROVIDER_SPECIAL_FILE_GAP`: Litestream, Grafana Tempo, Schemathesis, Kata Containers, Grype.
- Sustituciones/reuse deben probar capacidad, no sólo similitud nominal.

## 4. GAPs PRINCIPALES A AUDITAR/RESOLVER

A. Memory/Audit Orchestrator + Context Fabric completo y ejecutable.
B. Agent↔Memory propia↔Tools↔Workflow adapter; `runtime/src/agent` estaba vacío en cross-check.
C. Integration/Consolidator/Coverage/Judge global; `runtime/src/integration` estaba incompleto.
D. Recovery/UEK control-plane; `runtime/src/recovery` y `runtime/src/uek` estaban vacíos en cross-check.
E. VM Manager / platform capability routing real para Android AVF/crosvm/QEMU, Windows WHPX/QEMU, Linux KVM/QEMU; iOS/Web fail-closed hasta evidencia.
F. Operaciones Memory/Audit requeridas: GET_CONTEXT, GET_MEMORY, GET_EVIDENCE, GET_STATE, GET_HISTORY, GET_ARTIFACT, GET_RELATIONS, AUDIT_MEMORY y pipeline normalizer→schema→audit→StateDelta→memory.
G. G12 bidireccional `GOAL→REQUIREMENT→TASK→ARTIFACT→TEST→EVIDENCE` y vuelta `ARTIFACT→TASK→REQUIREMENT→GOAL` al 100%.
H. Cierre de adquisición/capacidad de los 5 OSS bloqueados por REUSE probado o provider compatible; prohibido modificar Motor2 para saltar symlink/special-file guards.

## 5. DAG ASTRA — MÁXIMO 3 PASOS POR NODO

### ASTRA-A01 — X-RAY 3 FUENTES ↔ CODE
1. VERIFY: 4 pasadas por cada uno de los 3 documentos y 4 pasadas por Wordflow/runtime/tests.
2. DELTA: producir matriz literal requisito→capa→archivo→test→estado; no escribir productivo todavía.
3. REPORT: registrar contradicciones, equivalencias y GAPs con ruta/SHA/test/run.

### ASTRA-A02 — DEDUP DE GAPs
1. VERIFY: para cada GAP buscar equivalente existente en código/componentes.
2. DELTA: clasificar `REUSE_EXISTING | PATCH | ADAPT | GENERATE | PROVIDER_GAP`.
3. REPORT: añadir decisión y evidencia en archivo Astra propio; no sobrescribir ledger compartido.

### ASTRA-A03 — EJECUCIÓN QUIRÚRGICA
1. VERIFY: reclamar sólo nodo FREE sin owner activo y declarar write_scope.
2. DELTA: ejecutar un único cambio mínimo; respetar fronteras Workflow/Memory/Sandbox/LLM/Consolidator.
3. TEST/REPORT: CI/runtime/read-back; PASS sólo con evidencia; si falla, GAP+StrategyDelta distinto y tomar siguiente FREE.

### ASTRA-A04 — FINAL CROSS-CHECK
1. VERIFY: repetir matriz top-down y bottom-up.
2. DELTA: reparar únicamente huecos independientes todavía demostrados.
3. REPORT: `VERIFIED_CLOSED | CLOSED_UNVERIFIED | INCONCLUSIVE` por requisito, jamás cierre global por suma de PASS locales.

## 6. COORDINACIÓN ANTI-COLISIÓN

Antes de reclamar código:
- Sol1 tiene prioridad en memory/agent/recovery cuando figure CLAIMED.
- Sol2 tiene prioridad en adapters/platform/UEK/telemetry cuando figure CLAIMED.
- Sol3 tiene prioridad en integration/tests/Fables cuando figure CLAIMED.
- Astra sólo ejecuta código productivo en nodo FREE y write_scope no reclamado; si el nodo ya tiene owner, audita/refuta pero no escribe allí.

Astra escribe su reporte en:
`UI YAIWES/bitácora stated JSON Craxy wall plan checkpoint/roles/ASTRA-CROSSCHECK-EXECUTION-STATE.json`
y artefactos de auditoría con prefijo `ASTRA-XRAY-`.
Shared ledgers/Handoff se actualizan sólo después de fresh read-back y merge aditivo.

## 7. COMPONENTES BLOQUEADOS — DECISIÓN A AUDITAR

No forzar descargas por nombre. Comprobar estas hipótesis:
- Kata Containers → capacidad potencialmente cubierta por Firecracker + gVisor para aislamiento; conservar Kata sólo si demuestra GAP único.
- Grype → Trivy + Syft ya existentes; conservar Grype sólo si segundo scanner aporta gate/refutación requerida.
- Schemathesis → Hypothesis + contratos API existentes; conservar sólo si stateful OpenAPI/GraphQL aporta capacidad no cubierta.
- Tempo → OTel Collector ya adquirido; backend de trazas sólo si retention/query exige uno separado.
- Litestream → ledger/checkpoint durable + Stabilize + rqlite pueden cubrir parte del recovery; conservar Litestream sólo si réplica WAL SQLite es requisito real no cubierto.

Cada decisión necesita evidencia real de código/capacidad/tests. `REUSE_EXISTING` sin test no cierra.

## 8. CRITERIO DE CIERRE

Proyecto sólo puede cerrar cuando:
- G12 = 100% requisito↔código↔test↔evidencia.
- Memory/Audit, Agent, Sandbox/UEK, Recovery, Integration/Consolidation y plataforma estén implementados o explícitamente cerrados por equivalencia probada.
- tests unitarios + integración + runtime + recovery/failover + platform capability pasen donde aplique.
- no queden UNKNOWN silenciosos.
- todo GAP restante tenga bloqueo externo concreto y evidencia.

Salida esperada de Astra:
`NODO | PASS/GAP | requisito | archivo | SHA | test/run | evidencia | siguiente_nodo`

No declarar `todo listo` hasta `verify_final` global.