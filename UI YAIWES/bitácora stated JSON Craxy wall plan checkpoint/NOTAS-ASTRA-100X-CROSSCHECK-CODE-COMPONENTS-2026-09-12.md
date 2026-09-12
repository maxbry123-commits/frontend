# NOTAS PARA ASTRA GPT — X-RAY + 100X + CODE GAPS

Contrato: `tel.workflow/v3`
Modo: `FAIL_CLOSED_LOOP`
Cola autoritativa para nuevos claims: `CRAZY-WALL-TASK-QUEUE-MULTI-AI-V2-2026-09-12.json`
Handoff: `UI YAIWES/readme arquitectura UI YAIWES/HANDOFF-ASTRA-AUDITORIA-EJECUCION-UI-YAIWES-V6.md`
Recovery Patch: `UI YAIWES/bitácora stated JSON Craxy wall plan checkpoint/RECOVERY-PATCH-ASTRA-AUDITORIA-EJECUCION-2026-09-12.md`

## 1. TU PRIMER NODO

Reclama únicamente `A1-01-XRAY-DOCS-CODE-4PASS` si sigue `FREE` después de releer HEAD y la cola V2.

Haz 4 pasadas por cada una de las 3 fuentes principales y 4 pasadas por:
- `wordflow_loop/wordflow_loop/**`
- `runtime/src/**`
- `runtime/tests/**`
- Crazy Wall / GAP ledger / reports / role states

Produce dos matrices:
1. `GOAL → REQUIREMENT → LAYER → FILE/FUNCTION → TEST → EVIDENCE → STATUS`
2. `ARTIFACT → TASK → REQUIREMENT → GOAL`

No marques cumplimiento por directorio, README, source presence o test parcial.

## 2. INVESTIGACIÓN 100X

Después de A1-01, reclama `A1-02-100X-COMPONENT-RESEARCH-DEDUP`.

Para cada mejora/candidato investiga:
- capacidad exacta que falta;
- componente OSS oficial;
- URL oficial y licencia;
- ref/commit recomendado;
- solapamiento con componentes ya presentes;
- `REUSE | KEEP | DEFER | REJECT`;
- destino literal propuesto sólo si realmente se necesita adquirir;
- evidencia de por qué mejora rendimiento, recovery, memoria, aislamiento, integración, observabilidad o trazabilidad.

Prioridad obligatoria: `REUSE_EXISTING > PATCH > ADAPT > GENERATE > NEW_DOWNLOAD`.
No descargues nada desde el nodo A1-02: deja recomendación para el Orquestador.

## 3. CODE FALTANTE

Sólo tras demostrar que un GAP es genuinamente no cubierto, reclama `A1-03-UNOWNED-CODE-GAPS`.

Write scope Astra reservado:
- `runtime/src/audit/**`
- `runtime/src/coverage/**`
- `runtime/src/consolidation/**`
- tests asociados

No tocar:
- Sol1: `runtime/src/memory/**`, `runtime/src/agent/**`
- Sol2: `runtime/src/adapters/**`, `runtime/src/uek/**`, platform/sandbox
- Sol3: `runtime/src/integration/**`

Cada delta debe ser mínimo, testeado y acompañado por SHA/run/log.

## 4. COMPONENTES / CAPACIDADES A REFUTAR ANTES DE PROPONER NUEVOS

Ya existen o están presentes en el proyecto y deben deduplicarse primero:
- Stabilize, Fables, OPA, OpenFGA
- Firecracker, gVisor, QEMU, crosvm, nsjail, bubblewrap, UTM
- OpenTelemetry Python + OpenTelemetry Collector
- Trivy + Syft
- pytest + Hypothesis + Playwright
- NATS/PGMQ/Debezium
- Qdrant/FastEmbed/Meilisearch/Tantivy/Oxigraph
- rqlite, Testcontainers Python, ORAS

Los 5 OSS aún no adquiridos por Motor2 no son automáticamente obligatorios:
- Litestream
- Grafana Tempo
- Schemathesis
- Kata Containers
- Grype

Primero demuestra si la capacidad ya está cubierta por REUSE; si no, propone provider/path compatible sin cambiar motores canónicos.

## 5. CÓMO DEJAR NOTAS PARA LOS OTROS ENTORNOS

Al finalizar cada nodo crea un reporte `reports/ASTRA-<NODE>.json` con:
`node_id | status | findings | affected_goals | exact_paths | evidence | candidate_components | recommended_owner | recommended_free_node | code_delta_if_any | sha | test_run_or_log | gaps | next`.

`recommended_owner` sólo recomienda; NO reclama nodos de otro rol.
- Memory/Agent → SOL_GPT1
- Platform/Sandbox/Telemetry → SOL_GPT2
- Integration/Fables/E2E → SOL_GPT3
- Shared architecture/G12/components/publish/final judge → SOL_ORQUESTADOR

## 6. OBJETIVO DE CALIDAD

Busca mejoras materiales, no cantidad de componentes. Una mejora 100x válida debe cerrar un cuello de botella o aumentar robustez de forma comprobable: paralelismo/fan-out-fan-in, recovery/checkpoint, context/memory retrieval, sandbox isolation, routing, observabilidad, deterministic replay, evidence graph, integration/final coverage.

No declarar `VERIFIED_CLOSED` hasta que G12 alcance cobertura bidireccional 100% y los subsistemas Memory/Audit, Agent boundary, Integration/Consolidator, Sandbox/UEK/Recovery y platform routing tengan código + test + evidencia end-to-end.