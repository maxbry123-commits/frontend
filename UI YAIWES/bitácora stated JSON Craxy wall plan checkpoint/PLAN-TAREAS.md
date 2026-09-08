# PLAN MAESTRO DE TAREAS 1×1 — UI YAIWES — REVISION v5

**Contrato runtime:** `tel.workflow/v3`
**Modo:** `FAIL_CLOSED_LOOP`
**Owner:** `stabilize_core`
**Fuente operativa:** `CONTRATO-MAESTRO-FORENSE-XRAY-50-GOALS-UI-YAIWES.md`

---

# A. ESTADO DE NODOS YA AVANZADOS

1. `P01` ⚠️ baseline inicial 14/14 históricamente VERIFIED; frescura STALE por Action124 cancelada.
2. `P02A` 🚩 Stabilize adapter/DI cableado; vendor-real gate pendiente.
3. `P02B` 🚩 Pydantic adapter/vendor; exact-version/core mismatch.
4. `P02C` 🚩 Rule Engine adapter/vendor; real-vendor gate pendiente.
5. `P03` ⚠️ HTTPX real local PASS; Starlette exact-version flag.
6. `P04` 🚩 Bulkman/resilient-circuit injection/read-back; real-vendor gates pendientes.
7. `P05` ⏸ Structlog/OpenTelemetry preparado; publicación/real gates pendientes.
8. `P06` ⏸ pytest/Hypothesis TEST_ONLY preparado; pytest provenance GAP + Hypothesis Action ordering histórico.
9. `P07` ⏸ Dagu/redun DONOR_ONLY preparado; redun post124 revalidado.
10. `P08` ⏸ PyCasbin preparado; deps/runtime/dedup pendientes.

---

# B. COLA CRÍTICA ACTION124 / P01

## A01 — Artifact forensic ✅
Recuperar artifact id `10002484616`, extraer checkpoints/gaps y registrar cifras exactas.
Acceptance: artifact digest + 80 checkpoint + gaps.tsv contabilizados.

## A02 — Recovery classification ✅
Clasificar las 124 entradas en C1 complete/no-gap, C2 complete+repair-gap, C3 partial, C4 provider-gap, C5 unattempted, C6 provenance conflict.
Acceptance: 124/124 índices únicos cubiertos por una clase primaria; C6 queda flag secundario.
Evidence: `ACTION124-RECOVERY-CLASSIFICATION-V5.json`.

## A03 — Queue integrity patch ✅
Validar `len/set==124`, indices únicos `1..124`, detectar orden histórico incorrecto y definir recovery view ordenada por `director_index ASC` sin mutar la cola histórica.
Acceptance: deterministic preflight specification + evidence.
Evidence: `ACTION124-QUEUE-INTEGRITY-V5.json`; queue blob `f8283c50395a63d5f8d5d3e127d86c2be75a0176`; Hypothesis index9 observado después de 124.

## A04 — C1 independent audit ACTIVE
Auditar 50 complete-shape/no-gap contra destino actual sin redownload.
Acceptance: URL/commit/sums/hash/license/tree por componente.

## A05 — C2 repair_rc investigation
Índices `1,4,7,11,52,58,64,65,68,80`.
Acceptance: root cause de repair_rc + StrategyDelta por componente; no borrar contenido completo por un exit code ambiguo.

## A06 — C3 resume partial
Índices `2,3,8,10,12,13,14,18,19,21,22,24,31,35,40,46,49,56,63,67`.
Acceptance: reanudar faltantes/PREPARED únicamente.

## A07 — C4 provider adapters
AVF/googlesource + Wayland/Weston/Mesa/virglrenderer/virtiofsd GitLab.
Acceptance: commit pin + provenance + hash + no LFS + source original.

## A08 — C5 unattempted
Procesar 38 entradas no intentadas, incluyendo Hypothesis index9 y 88–124, siempre desde recovery view ordenada.
Acceptance: checkpoint por entrada.

## A09 — C6 pytest forensic
Localizar snapshot físico exacto; no dedup por nombre.
Acceptance: SOURCE_COMMIT/tree que explique blobs físicos o estado `INCONCLUSIVE` con evidencia.

## A10 — Alias/dedup
Resolver pares/aliases solo por source URL+commit+tree/code-root.
Acceptance: canonical component IDs + rollback.

## A11 — Verify-final writer
Garantizar que `verify-final.json` se produce aun si una fase parcial falla/cancela.
Acceptance: artifact always contains final summary.

## A12 — Independent auditor
Writer y auditor separados.
Acceptance: 124/124 hashes/provenance + no gaps unresolved.

## A13 — P01 fresh closure
Actualizar COMPONENT-INVENTORY/CODE-MAP.
Acceptance: Judge `VERIFIED_CLOSED` solamente si post124 completo.

---

# C. CIERRE DE NODOS P02–P08

## A14 — P02A Stabilize real vendor
Ejecutar adapter existente con `Orchestrator(queue, store)` real; no duplicar factory.

## A15 — P02B Pydantic compatible runtime
Provisionar par exacto source/core fijado o actualizar fuente explícitamente; ejecutar validate/dump/schema real.

## A16 — P02C Rule Engine vendor
Ejecutar compile/matches/filter contra vendor real 5.0.3.

## A17 — P03 Starlette
Ejecutar API/streaming/cancel/status sobre versión compatible; mantener HTTPX evidence.

## A18 — P04 resilience
Ejecutar circuit/bulkhead reales; tests de timeout/retry/failure isolation.

## A19 — P05 Observability
Publicar Structlog + OTel API/SDK separados, read-only; correlation ids session/run/task/attempt.

## A20 — P06 Tests
MountGuard debe rechazar pytest/Hypothesis en producción; usar ambos solo en test harness; resolver provenance antes de cierre.

## A21 — P07 Donors
Dagu/redun nunca workflow owner; extraer solo patrones/provenance necesarios.

## A22 — P08 PyCasbin
Instalar/resolver deps, adapter policy, real allow/deny tests; integrar con ToolPermissionBroker.

---

# D. CORE DETERMINISTA

## A23 — MasterInputContract
Input literal + hash + scope + source refs.

## A24 — SourceAuthoritySet
Resolver conflicto/frescura/prioridad de fuentes.

## A25 — Question Engine
12 dimensiones mínimas: objetivo, output, alcance, constraints, inputs, interfaces, estado, memoria, paralelismo, seguridad, recovery, acceptance.

## A26 — GoalGraph/RequirementGraph
50 goals → requisitos atómicos → dependencias.

## A27 — IntegrationPlan
Machine-readable mapa de uniones antes de work units.

## A28 — Task DAG/Funnel
Goal→Requirement→Task→Subtask→WorkUnit.

## A29 — Event Model
Event sourcing/idempotency/replay.

## A30 — State Model
Canonical state fuera de LLM/UI.

## A31 — Deterministic State Machine
Transiciones válidas e inválidas.

## A32 — Checkpoint Engine
Snapshot/restore/resume sin repetir trabajo válido.

## A33 — Policy Engine
Rule Engine + PyCasbin; deny-by-default para capabilities sensibles.

---

# E. MEMORY / AUDIT / CONTEXT

## A34 — MemoryContract
L0 raw, L1 working, L2 task, L3 project, L4 long-term validated.

## A35 — Ingestion pipeline
normalize→parse→structural/semantic chunks→metadata→indexes→graph→provenance.

## A36 — Retrieval contract
lexical+semantic+tags+graph+temporal+history+evidence→rerank→budget.

## A37 — Context Fabric
MemoryRequest→ContextPack con minimal sufficient context.

## A38 — Evidence Graph
SUPPORTS/CONTRADICTS/DEPENDS_ON/DERIVED_FROM/IMPLEMENTS/VALIDATES/SUPERSEDES.

## A39 — Audit Engine
requirements/evidence/contradictions/coverage/traceability.

## A40 — Consolidator
WorkUnit→Task→Phase→Project; progressive consolidation.

## A41 — Coverage Engine
Top-down y bottom-up equivalentes.

---

# F. ROUTER / SCALE / SANDBOX

## A42 — Capability Registry
model/tool/worker/platform capabilities reales.

## A43 — Router / Resource Brain
health/cost/capability/policy routing; no hardcoded provider authority.

## A44 — Idempotency/DLQ/Outbox
solo donde la semántica del dominio lo exija.

## A45 — Fanout/fanin pools
subordinados a Stabilize; no segundo scheduler.

## A46 — Sandbox Contract
FS/network/CPU/RAM/secrets/capabilities explícitos.

## A47 — Worker Contract
WorkUnit→AgentResult, timeout/cancel/heartbeat.

---

# G. VIRTUAL COMPUTER

## A48 — Flutter shell / Window Manager
Linux/Android/Agent/Files/Terminal/Apps/Settings/Tasks/Trace.

## A49 — Rust Core contracts
VM/Storage/Network/Agent/Window managers.

## A50 — Android backend
AVF/crosvm primero, QEMU fallback según capability.

## A51 — Desktop backends
KVM/WHPX/HVF/QEMU según host.

## A52 — GuestBridge
shell/files/metrics/clipboard/ports con capability manifest.

## A53 — Mirror vs Migration
protocolos separados + tests.

## A54 — Host boundary
agent controla Virtual Computer autorizada; host arbitrary access denegado.

---

# H. COMMAND CENTER / CHAT 85

## A55 — Capability coverage matrix
85 funciones históricas → Requirement IDs → Task IDs → tests.

## A56 — Chat base
multiline/model/history/system prompt/stream/stop/copy.

## A57 — Files/multimodal
image/audio/live voice/files/storage links.

## A58 — Work/Artifacts
Markdown/code/PDF/DOCX/preview/editor/work panel.

## A59 — Task Queue UI/API
priorities/retries/dependencies/supervisor/status/cancel.

## A60 — Model Registry/Health
providers/models/keys/health/manual+auto failover.

## A61 — Project/GitHub + notes/state board
UI mutations siempre pasan backend policy/state contract.

## A62 — Knowledge UI
retrieval/KB citations/provenance.

## A63 — Visual workflows
React Flow/Rete solo editan IR validado; no ejecutan por sí solos.

## A64 — Security
secret refs, auth/policy/RLS/CORS; URL privada no es autorización.

---

# I. FINAL

## A65 — Integration graph
Todos los outputs importantes aparecen como inputs de otro nodo o artifact final.

## A66 — Five-pass build audit
completitud, wiring, stubs/dead code, runtime, recovery.

## A67 — E2E MasterInput
Input→DAG→worker→validator→auditor→judge→state→output.

## A68 — E2E Recovery
matar/interrumpir→checkpoint→restore→resume sin duplicar.

## A69 — Reconstruction test
reconstruir estado/arquitectura desde manifests/STATE/events sin chat.

## A70 — Council A/B/C
los 3 councils deben PASS o dejar REPAIR/BLOCK explícito.

## A71 — 3 refutaciones finales
repetir R1/R2/R3 contra el estado final.

## A72 — Final Judge
50 GOALS + coverage + contradictions + traceability + E2E + recovery → `VERIFIED_CLOSED` o estado honesto.

---

# REGLA DE COLA

Solo una tarea `CURRENT` por rama dependiente. Un `BLOCKED` puede dejar pasar una tarea independiente, nunca una dependiente. Cada tarea actualiza STATE/CHECKPOINT/BITÁCORA/RECOVERY y no se vuelve a ejecutar si ya existe evidencia fresca equivalente.