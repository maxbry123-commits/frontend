# HANDOFF V2 — ASTRA / CLAUDE — FÁBRICA + INTERFACE UI YAIWES

Fecha: 2026-09-10
Contrato: `tel.workflow/v3`
Modo: `FAIL_CLOSED_LOOP`
Estado: `ACTIVE_LOOP`
Owner actual: `➡️ Astra plan fábrica UI YAIWES`
Scope: exclusivamente `FÁBRICA UI + INTERFACE UI YAIWES`

# 1. QUÉ DEBE ENTENDER QUIEN RETOMA

Este handoff NO entrega el backend de Sol. Entrega el trabajo de Astra sobre:
- la Fábrica UI;
- la futura Interface UI YAIWES;
- el mapa de componentes frontend/fullstack/backend donantes necesarios para ambas;
- los contratos que la UI necesita del backend;
- la preparación de donor backend OSS en staging separado;
- la trazabilidad, Crazy Wall, STATE, auditoría, Recovery y plan de esas dos tareas.

# 2. OBJETIVO DE PRODUCTO

YAIWES debe ser un Work AI-first propietario/SaaS con una experiencia integrada de chat/orquestador + workspaces + artifacts + coding/design surfaces + fábrica visual.

El agente principal YAIWES funciona como un Jarvis de la interfaz: puede direccionar paneles y capacidades autorizadas mediante contracts/capabilities, no mediante acceso directo e ilimitado al estado.

Plataformas objetivo:
- web;
- Windows;
- Linux;
- Android;
- iOS;
- PC/smartphone con layouts adaptativos.

Modelo local/web:
- UI y parte del workflow/AI pueden funcionar localmente cuando convenga;
- agentes y LLMs principales viven como servicios web;
- almacenamiento local es posible por defecto para datos apropiados;
- conectores opcionales dependen de elección/autorización del cliente;
- código/producto no es open source;
- componentes OSS se reutilizan como capacidades donantes, respetando licencias y provenance.

# 3. REGLA DE GATE

`T1_FACTORY` debe llegar a `VERIFIED_CLOSED` antes de comenzar la implementación/integración productiva de `T2_INTERFACE`.

Durante T1 sólo puede hacerse de T2:
- lectura;
- análisis;
- investigación;
- definición de requirements/contracts;
- verificación de compatibilidad.

No escribir UI productiva T2 ni marcar T2 `ACTIVE` antes del gate.

# 4. ORDEN DE LECTURA PARA RETOMA

Leer literalmente, sin sustituir por este handoff:

1. `INPUT-BLOCK-LITERAL-2026-09-10.md`
2. `INPUT-BLOCK-LITERAL-ADDENDUM-2026-09-10.md`
3. `CRAZY-WALL-ASTRA-FABRICA-INTERFACE-UI-YAIWES.json`
4. `STATE.json`
5. `PERFIL-TRABAJO-Y-PERFIL-UI-YAIWES.md`
6. `ARQUITECTURA-DETALLADA-FABRICA-E-INTERFACE-YAIWES-V1.md`
7. `MATRIZ-FUSION-46-COMPONENTES-FRONTEND-BACKEND.md`
8. `PLAN-MAESTRO-TAREA1-TAREA2-ASTRA-V2.md`
9. `AUDITORIA-FORENSE-4-PASADAS-ASTRA-V2.md`
10. `RECOVERY-PATCH-ASTRA-FABRICA-INTERFACE-YAIWES-V2.md`
11. este Handoff.

Luego releer HEAD/main de los archivos que se pretenda editar.

# 5. ESTADO ACTUAL

## Cerrado documentalmente
- INPUT literal base.
- Addendum literal con 4 URLs fuente + nueva orden de auditoría.
- perfil de trabajo/UI.
- dedicated Crazy Wall Astra.
- plan T1/T2 V2.
- auditoría 4 pasadas.
- Recovery Patch V2.
- raíz `Frontend/` canónica.
- raíz `backend/` donor staging ya existente.

## Cerrado pero NO certificado funcionalmente
- arquitectura de fábrica: `CLOSED_UNVERIFIED`.

## En curso
- `T1_03_COMPONENT_XRAY`.

## Pendiente T1
- seleccionar Canvas/API owner;
- Component Registry contract;
- Factory Shell + 5 steps;
- M1 Element Builder;
- M2 UI Composer;
- M3 Component Transformer;
- M4 AI Operator;
- M5 Deterministic Kit;
- Universal Contract/adapters;
- preview sandbox;
- tests/evidence/version/rollback;
- 3 simulaciones + refutaciones;
- auditoría independiente final.

## Bloqueado
- implementación productiva T2 completa.

# 6. NODO EXACTO A RETOMAR

`T1_03_COMPONENT_XRAY`

Entrada:
`UI YAIWES/componentes open soure UI YAIWES/`

Matriz ya creada:
`MATRIZ-FUSION-46-COMPONENTES-FRONTEND-BACKEND.md`

Estado de la matriz:
`46 candidatos iniciales / SOURCE_PRESENT_ONLY`.

No asumir que 46 es inventario total ni que alguno ya está cableado.

Para cada componente útil:
1. localizar source URL;
2. fijar source ref/commit;
3. verificar licencia;
4. leer README/code entry points;
5. identificar capacidad mínima reutilizable;
6. clasificar FRONTEND/BACKEND/FULLSTACK/TOOLING/DESIGN_ASSET;
7. detectar dependencia y riesgo;
8. decidir `REUSE | PATCH | ADAPT | REJECT`;
9. definir adapter/contract requerido;
10. definir test/evidence;
11. actualizar matrix;
12. sólo luego avanzar a T1_04.

# 7. COMPONENTES YA MAPEADOS INICIALMENTE

La matriz inicial contiene, entre otros:
Apache PyCasbin, Apache Tika, Apprise, Bulkman, Chart.js, CodeMirror 6, Cosign, Dagu, Debezium, Docling, Excalidraw, FastEmbed, Firecracker, Flutter, GSAP, Grafana, Grok Build, HTTPX, Hypothesis, Jan, LanceDB, LibreChat, LiteLLM, LiveKit, Loguru, Loki, Lucide, MCP Python SDK, MCP TypeScript SDK, MSW, Mammoth.js, Meilisearch, Mesa, Moby, NATS, Open WebUI, OpenBao, OpenTelemetry Python, Oxigraph, PDF.js, PGMQ, PGlite, ParadeDB, Piper, PixiJS y Playwright.

La raíz contiene más candidatos y tooling; continuar XRAY.

# 8. DECISIÓN DE ARQUITECTURA YA FIJADA

No construir múltiples sistemas paralelos completos.

Debe existir sólo un owner canónico por capacidad:
- 1 AppShell;
- 1 Canvas API;
- 1 Inspector API;
- 1 Component Registry;
- 1 TypedAction path;
- 1 UIStateDelta model;
- 1 preview sandbox;
- 1 evidence/version path.

Repositorios grandes se usan como donors. Extraer la capacidad mínima necesaria.

# 9. FÁBRICA — 5 PASOS

## Step 1 — Design/Create
Crear/control/template/prompt/design token/preview.

## Step 2 — Compose
Drag/drop, resize, layout, responsive, windows/pages, layers, inspector, undo/redo.

## Step 3 — Connect
Eventos UI -> contracts -> BackendBinding/local capability -> permisos -> mock/real status.

## Step 4 — AI/Transform
Importar componente o pedir mejora AI -> PlanProposal/UIStateDelta -> preview -> tests -> accept/reject.

## Step 5 — Validate/Publish/Edit
Build -> tests -> visual/a11y/responsive -> version -> rollback -> private preview -> evidence -> promote.

# 10. FÁBRICA — 5 MÓDULOS

M1 `Element Builder`
M2 `UI Composer`
M3 `Component Transformer / Inbox`
M4 `AI Operator`
M5 `Deterministic Module Kit`

Ninguno puede saltarse contracts/guards/tests/evidence.

# 11. CABLEADO FRONTEND CANÓNICO

Tres entradas, una implementación:

`drag/drop | Jarvis prompt | command palette`
`-> TypedAction`
`-> Frontend Guard`
`-> Factory Step Engine / Universal Action Bus`
`-> adapter`
`-> BackendBinding si aplica`
`-> result event`
`-> Normalizer`
`-> UIStateDelta`
`-> verifier/evidence`
`-> frontend store`
`-> render`

Razón:
evita tres implementaciones divergentes para manual/AI/atajos.

# 12. CABLEADO DE COMPONENT IMPORT

`SOURCE`
`-> source URL/ref/license/hash`
`-> static inspection`
`-> capability extraction`
`-> FRONTEND/BACKEND split`
`-> manifest`
`-> universal contract`
`-> adapter`
`-> sandbox preview`
`-> build/test`
`-> Component Registry candidate`
`-> version/evidence`

No promover por presencia.

# 13. CABLEADO AI

`AI intent`
`-> PlanProposal`
`-> UIStateDelta`
`-> diff`
`-> preview`
`-> policy/guards`
`-> tests`
`-> apply | reject | rollback`
`-> evidence`

La IA no escribe estado canónico directamente.

# 14. CABLEADO INTERFACE -> BACKEND

`UI action`
`-> BackendBinding`
`-> auth/capability`
`-> adapter`
`-> backend contract verificado`
`-> result event`
`-> Normalizer`
`-> StateDelta`
`-> verifier/evidence`
`-> store`
`-> render`

Un mock puede validar UI/contract, pero no cuenta como integración productiva.

# 15. FRONTERA CON SOL

Backend externo de referencia:
`UI YAIWES/➡️📂 Wordflow LOOP UI YAIWES/wordflow_loop/`

Astra/Claude en este handoff:
- pueden leerlo;
- derivar contracts/requirements;
- detectar GAPs que bloqueen frontend;
- preparar donor backend OSS en staging Astra.

No pueden:
- editarlo sin handoff explícito;
- reasignar su owner;
- declarar sus tareas cerradas;
- convertir documentación backend en evidencia de runtime real sin test.

# 16. RAÍCES DE TRABAJO ASTRA

Frontend:
`UI YAIWES/watchdog UI YAIWES/Astra plan fábrica UI YAIWES/Frontend/`

Backend donor staging:
`UI YAIWES/watchdog UI YAIWES/Astra plan fábrica UI YAIWES/backend/`

No recrear `frontend/` lowercase.

# 17. CRAZY WALL

Canónico Astra:
`CRAZY-WALL-ASTRA-FABRICA-INTERFACE-UI-YAIWES.json`

El archivo multi-AI global NO es el state machine de este trabajo; sólo referencia de coordinación.

Toda actualización de tarea Astra modifica:
- Crazy Wall dedicado;
- STATE;
- checkpoint/plan si cambió nodo;
- evidence;
- Recovery/Handoff si cambió la forma de recuperar.

# 18. WATCHDOG

Watchdog horario ya configurado como:
`Watchdog Astra Fábrica UI`

Propósito:
- releer contexto;
- continuar T1;
- después de T1, continuar T2;
- si no hay build activo, investigar/mejorar mediante propuesta verificable, no por cambios arbitrarios;
- respetar GitHub/Hugging Face allowlist;
- usar LOOP/GOALS/Council/simulaciones/refutaciones.

# 19. CROSS-CHECK CON FUENTES

Memoria Wordflow/YAIWES:
compatible con external memory, state deltas, audit, recovery y UI sobre runtime.

MAVIS-PARALLEL:
usar paralelismo para reads/research/tests independientes; canonical writes 1×1.

MAX-SYSTEM:
usar idempotency, queues, durable patterns y worker isolation como referencias backend/contracts, no como lógica embebida indiscriminadamente en frontend.

Recovery manual pinned:
archivo vacío en el commit indicado -> `INCONCLUSIVE`; no derivar reglas no visibles.

# 20. REGLAS DE SEGURIDAD

- GitHub nunca almacena API keys entregadas en chat.
- UI usa secret refs/capabilities.
- imports OSS se sandboxean.
- provenance + hash + licencia antes de promoción.
- mínimo privilegio.
- local sensitive storage cifrado.
- logs/evidence sin secretos.

# 21. PARÁMETROS DE RETOMA CLAUDE

Si Claude recibe el relevo ANTES de T1 cierre:
- puede tomar `T1_03` si owner se transfiere;
- o ser auditor independiente de un nodo T1;
- o investigar T2 read-only.

Si Claude recibe relevo DESPUÉS de T1 cierre:
- puede tomar un nodo T2 específico;
- el handoff debe indicar `owner=CLAUDE`, `write_paths`, `base_sha`, `input`, `output`, `tests`, `evidence`.

Nunca asignar "T2 completa" como un bloque monolítico sin nodos.

# 22. REGLA SINGLE WRITER

Antes de escribir:
1. fetch HEAD/main;
2. fetch archivo destino;
3. registrar base SHA;
4. comprobar owner/path;
5. construir delta;
6. escribir;
7. read-back;
8. actualizar evidence.

Si HEAD cambió:
`STALE_LOCK_GAP -> refetch -> rebuild delta`.
Nunca force-push por conflicto.

# 23. CRITERIO DE EVIDENCIA

Para `VERIFIED_CLOSED`:
`path + SHA/diff + run/test/log + read-back + no unresolved GAP`.

Para T1 final:
auditor independiente obligatorio.

# 24. GAPS ABIERTOS REALES

- `T1_03_COMPONENT_XRAY`: inventario/capability verification no terminado.
- arquitectura todavía no probada en implementación real.
- Factory Shell y M1-M5 pendientes.
- T2 productiva bloqueada.
- contracts reales del backend deben verificarse cuando T2 se desbloquee.

GAP ya reparado:
- colisión `Frontend/` vs `frontend/`.
- URLs fuente omitidas del literal.
- Crazy Wall Astra contaminado por tareas multi-team: resuelto creando dedicated Crazy Wall.
- handoff/recovery backend-centric: supersedidos por V2.

# 25. SIGUIENTE ACCIÓN

Retomar exactamente:
`T1_03_COMPONENT_XRAY`.

No programar aún T2.

Al cerrar XRAY:
actualizar matrix -> Crazy Wall -> STATE -> evidence -> entrar en `T1_04_CANVAS_OWNER_SELECTION`.

# 26. ESTADO FINAL DE ESTE HANDOFF

`ACTIVE_LOOP`

No declarar la fábrica terminada.
No declarar T2 iniciada.
Este handoff está diseñado para que Astra o Claude reconstruyan contexto y continúen sin depender de memoria conversacional.
