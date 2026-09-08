# CROSS-CHECK FORENSE X-RAY — FUENTES DE VERDAD UI YAIWES

**Revisión:** v5
**Contrato runtime:** `tel.workflow/v3`
**Método:** lectura literal → extracción de invariantes → cruce con repo/state → contradicciones → GAPs → requisitos nuevos → decisión.

---

# 1. FUENTES AUDITADAS

## Fuente A — Memoria/Wordflow YAIWES
Aporta la arquitectura de memoria/contexto continuo:
- memoria jerárquica, no una sola vector DB;
- Context Fabric/ContextPack;
- canonical state externo;
- event history y decisiones;
- Evidence/Contradiction Graph;
- recuperación iterativa;
- Task Decomposer + DAG Planner + segmentación + retrieval + state/checkpoints;
- consolidación progresiva;
- verificación/cobertura top-down y bottom-up;
- LLM nunca escribe canonical state directamente.

## Fuente B — MAX-SYSTEM-100X
Aporta mecanismos de escala y ejecución:
- fan-out/fan-in;
- batching;
- sharding;
- time-wheel/scheduling eficiente;
- idempotency + DLQ;
- outbox/CDC;
- multi-pool workers;
- prewarming/autoscale;
- heartbeat/watchdog;
- snapshots/failover/multi-sandbox.

## Fuente C — Bloque 0 NCT (adjunto)
Aporta disciplina de trabajo:
- constitución inmutable;
- orden de lectura;
- decisiones cerradas;
- mapa de fases/bloques;
- checklist/validación;
- anti-reinterpretación.

**Límite literal de la propia fuente:** no mezclar NCT con YAIWES. Por tanto no es fuente funcional de YAIWES.

## Fuente D — Virtual Computer YAIWES (repo)
Aporta:
- Flutter UI;
- Window Manager;
- Rust Core;
- VM/Storage/Network/Agent Managers;
- AVF/crosvm Android, QEMU fallback;
- KVM/WHPX/HVF según host;
- Linux/Android/Agent/Files/Terminal/Apps/Settings windows;
- local storage por defecto;
- mirror distinto de migration;
- control integral del agente dentro de Virtual Computer, no host arbitrario.

## Fuente E — Command Center/chat YAIWES (repo)
Aporta 85 capacidades funcionales:
- chat multiline/stream/stop/history;
- model settings/selector/AUTO;
- archivos/imagen/audio/voz;
- Markdown/code/copy/export;
- task queue/priorities/retries/dependencies/supervisor;
- DSL/JSON chain;
- health/failover/key/model registry;
- projects/GitHub;
- notes/folders/state board;
- retrieval/knowledge;
- Add AI/API agent;
- visual flows;
- responsive UI;
- errors/rate-limit/reconnect/logging/security.

---

# 2. VERIFICACIÓN CRUZADA — QUÉ COINCIDE

| Invariante | Memoria | MAX | Virtual Computer | Command Center | Repo actual |
|---|---:|---:|---:|---:|---|
| Estado canónico fuera de LLM/UI | sí | compatible | compatible | requiere backend | PARTIAL |
| Workflow determinista | sí | compatible | n/a | DSL/task chain | PARTIAL |
| Checkpoint/recovery | sí | sí | snapshots | autosave/tasks | PARTIAL |
| Auditor/Judge independiente | sí | compatible | boundary | verify chain | SPECIFIED/PARTIAL |
| Paralelismo sin perder owner | sí | sí | managers | task queue | SPECIFIED |
| Memoria/retrieval jerárquico | sí | n/a | n/a | KB/retrieval | SPECIFIED |
| Sandbox/capability boundary | sí | sandboxes | sí fuerte | tools backend | SPECIFIED |
| Observabilidad/health | sí | sí | resource managers | health panel | PREPARED/PARTIAL |
| Tareas/dependencias | sí | pools/queues | n/a | sí | SPECIFIED/PARTIAL |
| Reconstructibilidad | sí | durable state | snapshot | history | PENDING |

Conclusión: las fuentes no piden cinco arquitecturas distintas. Piden capas diferentes de una sola arquitectura: runtime determinista + memory/audit + scalable execution + virtual computer + command center.

---

# 3. CONTRADICCIONES / DESVIACIONES

## X-01 Contrato v3 vs guía v4
Repo operativo volvió a `tel.workflow/v3`; guía histórica dice v4.
**Resolución:** conservar `tel.workflow/v3` como runtime contract y usar `guide_revision: v5` sin cambiar semántica silenciosamente.

## X-02 3 adjuntos vs 4 fuentes funcionales YAIWES
Los 3 adjuntos accesibles no coinciden exactamente con las 4 fuentes funcionales declaradas en arquitectura; uno es NCT.
**Resolución:** adjuntos = evidencia de esta pasada; Virtual Computer + Command Center = fuentes funcionales YAIWES desde repo; NCT = método-only.

## X-03 URL privada como seguridad
Command Center histórico menciona acceso por URL privada; arquitectura actual exige auth/policy real.
**Resolución:** `URL privada != autenticación`; secretos vía refs/backend; policy/RLS/auth según capability.

## X-04 UI/State
Fuentes de chat mencionan Supabase/state board; Memory source exige canonical state controlado.
**Resolución:** UI/Supabase puede persistir datos de producto, pero canonical workflow state solo cambia por StateDelta auditado.

## X-05 Dagu/redun vs Stabilize
Catálogo contiene schedulers/workflow frameworks.
**Resolución:** donors únicamente; Stabilize owner único.

## X-06 Action 124 vs “componentes listos”
Descarga parcial no equivale wiring ni provenance verificada.
**Resolución:** acquisition layer separado de integration layer; cada componente requiere classification + route.

---

# 4. GAPs NUEVOS DETECTADOS POR EL CROSS-CHECK

1. Falta SourceAuthoritySet ejecutable/versionado.
2. Falta Question Engine formal 12 dimensiones.
3. Falta Goal/Requirement Graph runtime.
4. Falta Integration Plan machine-readable.
5. Falta Task Funnel runtime (task→subtask→workunit).
6. Falta Event Model/replay.
7. Falta canonical State Model tipado completo.
8. Falta Checkpoint Engine con restore E2E.
9. Falta Evidence Graph ejecutable.
10. Falta Coverage Engine top-down/bottom-up.
11. Falta Reconstruction Test sin chat.
12. Falta Context Fabric real.
13. Falta multi-stage retrieval real.
14. Falta Memory update gate normalizer→schema→audit→StateDelta.
15. Falta Consolidator progresivo runtime.
16. Falta Final Judge completo.
17. Falta idempotency/strategy fingerprint global.
18. Falta DLQ/outbox semantics donde aplique.
19. Falta Router/capability/resource brain.
20. Falta sandbox capability manifest.
21. Falta Virtual Computer platform implementation.
22. Falta mapa completo 85 Command Center → Requirement/Task/Test.
23. Falta API chat real streaming/cancel/status.
24. Falta end-to-end health/telemetry correlation.
25. Falta E2E MasterInput→FinalOutput→Checkpoint→Restore.

---

# 5. ACTION 124 — X-RAY DEL ARTIFACT

Artifact id: `10002484616`.
Digest: `sha256:680861bb0f9b48dae398ccd56c95add5d44bd0bc45510a9a7cab17a55ee10683`.
Contenido: 80 checkpoint JSON + `gaps.tsv`; no apareció `verify-final.json` dentro del ZIP recuperado.

## Cifras
- expected queue: 124;
- attempted: 86;
- unattempted: 38;
- checkpoint JSON: 80;
- provider gaps sin checkpoint: 6;
- gaps.tsv: 36;
- checkpoint “complete read-back shape”: 60;
- de esos 60, 10 también están en gaps.tsv por repair_rc;
- complete-shape sin gap.tsv: 50;
- partial/incomplete checkpoints: 20.

## 36 gaps.tsv
`Stabilize CORE, Pydantic, Starlette, HTTPX, OpenTelemetry Python, pytest, Dagu, redun, LibreChat, big-AGI, Open WebUI, Vite, Vercel AI SDK, TanStack Query, React Virtuoso, shadcn-ui, XYFlow React Flow, Lucide, Uppy, Supabase, Qdrant, Oxigraph, DuckDB, PGlite, workerd, QEMU, crosvm, AVF, Flutter, flutter_rust_bridge, Wayland, Weston-libweston, Mesa, virglrenderer, virtiofsd, libdatachannel`.

## Provider gaps
- AVF — android.googlesource.com
- Wayland — gitlab.freedesktop.org
- Weston/libweston — gitlab.freedesktop.org
- Mesa — gitlab.freedesktop.org
- virglrenderer — gitlab.freedesktop.org
- virtiofsd — gitlab.com

## Queue ordering anomaly
`Hypothesis` tiene `director_index:9` pero aparece al final del array, después de `director_index:124`. El workflow itera en orden de array, no ordena por director_index. Como el run se canceló tras alcanzar la zona de index 87, Hypothesis no se intentó.

## StrategyDelta recomendado
1. construir `queue_recovery` desde artifact + current destination, NO desde memoria;
2. validar indices únicos y set exacto 1..124;
3. ordenar por `director_index`;
4. separar provider adapters GitHub / googlesource / GitLab;
5. para 50 complete-shape/no-gap: solo auditoría hash/provenance independiente, no redownload;
6. para 10 complete-shape+repair_gap: investigar motivo repair_rc antes de decidir;
7. para 20 partial: reanudar desde checkpoint/delta;
8. para 6 provider gaps: descargar por provider adapter autorizado;
9. para 38 unattempted: procesar normalmente en recovery queue;
10. producir `verify-final.json` siempre incluso cuando el writer sea cancelado;
11. auditor independiente comprueba 124/124 hash/provenance;
12. solo entonces P01 fresh puede volver a VERIFIED_CLOSED.

---

# 6. QUÉ ESTÁ LISTO / PARCIAL / FALTA

## LISTO CON EVIDENCIA CONCRETA
- universal plugin socket;
- no-force concurrency method probado en varias colisiones;
- initial 14 inventory baseline histórico;
- HTTPX local real transport test;
- redun/gVisor/gfxstream/jsPDF/libdatachannel/pgvector post124 classifications ya persistidas con provenance (pytest queda GAP, no listo).

## PARCIAL / CLOSED_UNVERIFIED
- Stabilize adapter;
- Pydantic adapter;
- Rule Engine adapter;
- Starlette adapter;
- Bulkman/resilient-circuit;
- P05/P06/P07/P08 preparados;
- Action 124 acquisition;
- State/Checkpoint como archivos operativos.

## ESPECIFICADO PERO NO IMPLEMENTADO E2E
- Memory/Audit engine;
- Context Fabric;
- Evidence Graph;
- Consolidator global;
- Coverage engine;
- Router/resource brain;
- Virtual Computer;
- gran parte del Command Center 85;
- final E2E/reconstruction.

---

# 7. DECISIÓN FORENSE

Estado global correcto: `ACTIVE_LOOP`.

Ninguna fuente soporta declarar proyecto terminado. La siguiente ruta crítica es:

`ACTION124 recovery → P01 fresh inventory/provenance/dedup → P05/P06/P07/P08 → cerrar flags P02–P04 → Core State/Event/Task → Memory/Audit/Context → Router/Sandbox → API/Command Center/Virtual Computer → Coverage/Reconstruction/E2E → Final Judge`.
