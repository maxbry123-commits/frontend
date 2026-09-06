# BITÁCORA CRAZY WALL — Wordflow LOOP UI YAIWES

Esta bitácora registra progreso humano-legible. `STATE.json` registra el estado estructurado; `CHECKPOINT.json` el punto recuperable; `RECOVERY-PATCH.md` el protocolo de reanudación. Divergencia = GAP.

## EVENTO UI-CW-0001 — AUTORIZACIÓN DEL DIRECTOR
- Orden: iniciar arquitectura de trabajo backend en `maxbry123-commits/frontend/UI YAIWES/`.
- Frontend visual: Grok.
- Backend/Wordflow/integración: este árbol.
- Límite operativo solicitado por el Director: máximo 20 minutos de cómputo por ejecución.
- Método: LOOP persistente fail-closed.

## EVENTO UI-CW-0002 — REVISIÓN FORENSE DEL WORDFLOW FUENTE
- Fuente: `maxbry123-commits/agentes/➡️📂 Wordflow LOOP Yaiwes`.
- Árbol fuente verificado por tree SHA `4d0ed5e0910ca6fe573b7b3dac83d2c451ba49b3`.
- Se localizaron Crazy Wall, STATE, CHECKPOINT, RECOVERY, HANDOFF, runtime y bitácora.
- `AGENTS.md` exige tres métodos PIPELINE.
- GAP observado: esos tres paths no estaban accesibles en `main` durante la lectura.
- Resolución fail-closed: se recuperaron por commits canónicos registrados en `RECOVERY-PATCH.md` del proyecto fuente.

## EVENTO UI-CW-0003 — MÉTODOS CANÓNICOS RECUPERADOS
- Método de trabajo: commit `8024e57606cedc34592ef18b3565c624b1e6d676`, blob `82096da0f52d45624344eeaf8eedf8c7ae0a0f42`.
- Auditoría forense: commit `2072d535920573550a443cf9a3967ab66b50375c`, blob `11e3fb376d252818bf23f2cf7b84252d336e1fec`.
- Estándar ingeniería: commit `7bc798ad4173f39f758abd3d4e6cbc2d909658e6`, blob `5c4f0d8b22880af6f5677d6da5d9ae8f24604b53`.
- Regla replicada: `REUSE > COPY/MOVE > PATCH PEQUEÑO > ADAPTER > GENERATE DELTA`.
- Regla replicada: archivo presente ≠ integrado; PASS exige wiring + test + evidencia.

## EVENTO UI-CW-0004 — ARQUITECTURA BACKEND FIJADA
- Owner único del workflow: Stabilize CORE.
- Router existente: adaptar, no reconstruir.
- Memory existente: adaptar, no reconstruir.
- Stabilize cubre DAG/state/queue/recovery/jump/suspend/HITL.
- Pydantic cubre contratos.
- rule-engine cubre Policy/Judge determinista.
- Starlette expone API.
- HTTPX solo si adapters son remotos.
- structlog/OpenTelemetry observabilidad.
- pytest/Hypothesis verificación.
- Dagu/redun: donantes de patrones, no segundo runtime.

## EVENTO UI-CW-0005 — ANCLAS CREADAS
- README backend inicial creado.
- `HANDOFF.md` creado.
- `STATE.json` creado.
- `CHECKPOINT.json` creado.
- `RECOVERY-PATCH.md` creado.
- Esta bitácora creada.
- `LEDGER-ARQUITECTURA-UI-YAIWES.md` creado.

## EVENTO UI-CW-0006 — RECONCILIACIÓN DEL README
- Read-back del destino mostró que ya existía `UI YAIWES/Readme arquitectura UI YAIWES.md` con arquitectura frontend/local WebGPU/HF.
- Se preservó esa arquitectura y se fusionó dentro del mismo README la arquitectura backend/Wordflow.
- El duplicado temporal creado en esta ejecución fue eliminado.
- README arquitectura canónico único: `UI YAIWES/Readme arquitectura UI YAIWES.md`.

## EVENTO UI-CW-0007 — PRIMERA RÉPLICA PARCIAL
- Se crearon Crazy Wall, HANDOFF, PIPELINE y raíces iniciales de runtime.
- La revisión posterior del Director señaló correctamente que la raíz no era una réplica completa del árbol fuente.
- Veredicto histórico de esta fase: `PARTIAL`; queda supersedido por UI-CW-0009.

## EVENTO UI-CW-0008 — SEGUNDA AUDITORÍA LITERAL DE RAÍCES
- Se releyó directamente `agentes/main/➡️📂 Wordflow LOOP Yaiwes`.
- Raíces fuente verificadas: `Crazy Wall Orquestador`, `HANDOFF.md`, `runtime`, `wordflow_loop`, README Wordflow, `Capa de persistencia open mythos`, `Capa workflow GitHub Action`, `Capa workflow evolución`, `archivos download`, `notas auditoría Claude`.
- Orden literal del Director: `📂 archivos download` NO se replica.
- Se crearon además las dos raíces documentales solicitadas dentro del Wordflow destino.

## EVENTO UI-CW-0009 — RÉPLICA FIEL VERIFICADA POR TREE SHA
- `wordflow_loop`: origen=destino tree `5e06f48dcbb01b17d07240a2b7919d92d0a04f77`.
- `📂 Capa de persistencia open mythos`: origen=destino tree `99d51adb61db9328fe1cbf4683aa0ee70b4d4abc`.
- `📂 Capa workflow GitHub Action`: origen=destino tree `76d79758c86beb3856b5b736d434b6095110d13a`.
- `📂 Capa workflow evolución`: origen=destino tree `cf029c82e8879b3c8c297844d45578b0ff83e925`.
- `📂 notas auditoría Claude`: origen=destino tree `d07582fe8bc990e5ce5c3a1850956c697feee653`.
- Durante verificación se detectó un blob no idéntico en `FORENSIC-PASS-research_download_chain.py`; se corrigió y quedó blob fuente exacto `b629f9a7844a4752ff7c28b844b83e7f1d99ccb1`.
- `📂 archivos download` en destino: read-back `404`, conforme a orden.
- `runtime/src`: presentes las 15 raíces estructurales del origen; se mantienen además `adapters`, `tasks`, `integration` como extensiones del backend Stabilize.
- El README fuente de `wordflow_loop` menciona `runner.py`, `layers/`, `tests/`, pero esos objetos no existen en el árbol fuente real; se preservó el GAP y no se inventaron.

## EVENTO UI-CW-0010 — RAÍCES DOCUMENTALES
- Creada: `UI YAIWES/➡️📂 Wordflow LOOP UI YAIWES/Documentos proyectos wordflow backend UI YAIWES/`.
- Creada: `UI YAIWES/➡️📂 Wordflow LOOP UI YAIWES/documentos proyectos UI YAIWES/`.
- Ambas son raíces documentales; ninguna es carpeta de descarga/extracción.
- Checkpoint activo: `UIYAIWES-ROOT-MIRROR-0005`.

## VEREDICTO DEL NODO
`ROOTS_AND_METHODS_REPLICATION_VERIFIED`.

Este veredicto cierra únicamente la réplica de raíces/métodos. La integración funcional del backend Stabilize, Router, Memory, Validator y pruebas E2E continúa como nodo separado.

---

## EVENTO UI-CW-0011 — SALIDA 2 / ARQUITECTURA DE PROGRAMACIÓN CONSOLIDADA
- Orden literal del Director: iniciar Salida 2, pasos 1–4.
- Se preservó el README/catálogo existente; no se reescribió.
- Arquitectura conceptual/programación creada de forma aditiva en:
  `UI YAIWES/readme arquitectura UI YAIWES/ARQUITECTURA-PROGRAMACION-CONSOLIDADA-UI-YAIWES.md`.
- Commit: `54a295799c270123f2826beb9d61bec148ad9205`.
- Fuentes de verdad: cuatro documentos únicos efectivos; el enlace MAX-SYSTEM entregado por el Director estaba duplicado.
- Capas fijadas: Chat/Work/Artifacts; Contracts/Sheriff; Stabilize Wordflow; paralelismo; Memory/Audit; Consolidator/Judge; Sandbox; Virtual Computer; Seguridad/IP; Observabilidad; Tests.

## EVENTO UI-CW-0012 — RECONCILIACIÓN DEL MÉTODO FUENTE
- Se releyó `agentes/➡️📂 Wordflow LOOP Yaiwes/HANDOFF.md`, `STATE.json` y `CHECKPOINT.json` vigentes.
- Fuente HANDOFF blob: `d2a5b8383082bfef4f1451ebfea857cd39908fd9`.
- Fuente STATE blob observado: `bb0d1608c2b899eccf64fa0dd52d7eb9e26ee3e9`.
- Fuente CHECKPOINT blob: `5bfa8f5d1f355972714a8a0959ba888ecc8f70b2`.
- GAP confirmado: el HANDOFF fuente sigue declarando `PIPELINE/*.md` en `main`, pero esos paths actuales responden 404/no aparecen en búsqueda; UI conserva las copias recuperadas por commits históricos canónicos. No se inventó contenido.
- La capa `📂 Capa de persistencia open mythos` fue revalidada archivo a archivo: blobs origen=destino `0ddaebf1...` y `5b86f80b...`.
- `PIPELINE/00_METODO_TRABAJO_Y_ARQUITECTURA.md` UI fue editado aditivamente para incorporar la constitución vigente: LOOP1+LOOP2, 56 checks, Council12, C01–C06 y `verify_final`.
- Commit del delta de método: `a94586bb3cc72a1ffc1b6eb2dbbd8525646a2256`.

## EVENTO UI-CW-0013 — PLAN DE PROGRAMACIÓN E INTEGRACIÓN / COLA 1×1

Prioridad 1: cerrar el camino mínimo `Chat → Contract → Stabilize → Router/Memory adapters → Validator/Judge → StateDelta → Checkpoint` con tests reales.
Prioridad 2: después ampliar Work/Artifacts, Memory híbrida, paralelismo, sandbox y Virtual Computer sin romper el owner único del workflow.

### Cadena de tareas pendientes

**P01 — Inventario físico de componentes**
- Enumerar `UI YAIWES/componentes open soure UI YAIWES/` y componentes ya presentes fuera de esa raíz.
- Cruzar contra catálogo auditado 1–124.
- Estado inicial: `PENDING`.
- Gate: no descargar duplicados; cada componente debe mapear `función/GAP → fuente URL/SHA → destino`.

**P02 — Matriz función → componente → código reutilizable**
- Para las 85 funciones del chat y capas backend, registrar qué ya existe, qué es donor, qué falta y qué no se usa.
- Estado: `BLOCKED_BY_P01`.

**P03 — Contratos tipados V1**
- Revisar/cablear MasterInput, Goal, Requirement, Task, ContextRequest/Pack, AgentResult, EvidenceRef, StateDelta, StrategyDelta, CheckpointRef, ClosureResult.
- Estado: `BLOCKED_BY_P02`.

**P04 — Chat API + streaming/cancel/status**
- Endpoints typed; streaming/SSE/WebSocket según implementación existente; cancel no puede ser solo visual.
- Estado: `BLOCKED_BY_P03`.

**P05 — Stabilize workflow wiring**
- Un solo owner; definir etapas/nodos, ready/blocked, durable checkpoint, jump/reset, suspend/resume.
- Estado: `BLOCKED_BY_P03`.

**P06 — RouterAdapter + Model Registry/Health**
- Adaptar Router existente; model/provider/key AUTO; secret_ref; timeout/budget/fallback.
- Estado: `BLOCKED_BY_P03`.

**P07 — MemoryAdapter V1**
- Adaptar memoria existente: raw source/provenance, retrieval contract, ContextPack, evidence refs.
- Estado: `BLOCKED_BY_P03`.

**P08 — Validator/Audit/Judge + StrategyDelta**
- Schema → policy → evidence → PASS/GAP/HUMAN_REQUIRED; retry idéntico rechazado.
- Estado: `BLOCKED_BY_P03`.

**P09 — Consolidator + Coverage + Final Judge**
- Goal→Requirement→Task→Artifact→Evidence→Validation; cross-check top-down/bottom-up.
- Estado: `BLOCKED_BY_P08`.

**P10 — Work/Artifacts/Files/Tasks UI**
- Artifact model/versioning/preview, attachment refs, Task panel, Project selector, trace.
- Estado: `BLOCKED_BY_P04_P09`.

**P11 — Paralelismo + sandbox**
- fan-out/fan-in, batching, worker pools, idempotency/DLQ; capability sandbox según riesgo.
- Estado: `BLOCKED_BY_CORE_E2E`.

**P12 — Virtual Computer multiplataforma**
- Flutter↔Rust, VMManager, AVF/crosvm/QEMU, storage/network/display/input/audio/resource, mirror/migration.
- Estado: `SEPARATE_LATE_PHASE_BLOCKED_BY_CORE`.

**P13 — Seguridad/hardening**
- auth/policy, RLS/ACL, secret refs, local encryption, signatures/provenance/SBOM/scans.
- Estado: `CROSS_CUTTING_STARTS_WITH_P03_P04`.

**P14 — Test suite y cierre**
- unit, schema, integration, stateful, recovery, chaos, load, accessibility, browser E2E y final cross-check.
- Estado: `CONTINUOUS`; cierre final depende de todos los gates aplicables.

### Nodo siguiente 1×1
`P01_COMPONENT_PHYSICAL_INVENTORY`.

No se autoriza saltar directamente a P03–P14 sin cerrar o justificar formalmente los gates anteriores.

## EVENTO UI-CW-0014 — REGLA DE WATCHDOGS
- Watchdog principal debe vigilar LOOP completo y leer esta cola antes de crear tareas nuevas.
- Watchdog réplica adicional debe concentrarse en reconciliación de anclas + P01→P14, detectar GAPs y registrar evidencia.
- Cada actualización de plan/estado debe reflejarse en Watchdogs activos + Crazy Wall + STATE + CHECKPOINT.
- No se considera implementada ninguna tarea P01–P14 por estar escrita aquí.
