# PLAN COMPLETO — ➡️ Astra plan fábrica UI YAIWES

Fecha: 2026-09-10
Contrato: tel.workflow/v3
Modo: FAIL_CLOSED_LOOP
Estado: ACTIVE_LOOP
Gate: T1_FACTORY_FRONTEND -> VERIFIED_CLOSED -> T2_INTERFACE_YAIWES

## 0. OBJETIVO ÚNICO

Construir y mantener una Fábrica UI YAIWES de cero fricción que sirva como instrumento permanente para crear, editar, probar, versionar y mejorar la interfaz YAIWES. El objetivo operativo de Astra es FRONTEND, pero debe comprender el backend de Sol, sus contratos, eventos, estados y adapters para diseñar el frontend compatible. Todo donor backend detectado en OSS se deposita en staging separado `backend/` hasta handoff explícito.

YAIWES objetivo: Work multiplataforma + chat/orquestador tipo Jarvis + workflows/agentes + design/build + code + artifacts + files + terminal + task trace + multiagent. Plataformas objetivo: web, Windows, Linux, Android, iOS, smartphone y PC. Operación parcialmente local, con IA embebida/local donde corresponda, cifrado fuerte, producto SaaS propietario, agentes/LLMs servidos desde web y almacenamiento local por defecto con conectores opcionales elegidos por el usuario.

## 1. REGLAS ABSOLUTAS

1. Leer INPUT literal antes de actuar.
2. Releer main, Crazy Wall, STATE, CHECKPOINT y arquitectura antes de escribir.
3. `single_writer_per_path=true`.
4. `SOURCE_PRESENT != WIRED != RUNTIME_TEST_PASS != VERIFIED_CLOSED`.
5. Integraciones/conectores permitidos para Astra: GitHub y Hugging Face únicamente.
6. No force push. No LFS. No secretos en frontend/repo.
7. `REUSE > COPY > PATCH > ADAPT > GENERATE`.
8. No monolito: separar contracts/adapters/plugins/registry/loader/guards/tests/evidence/UI.
9. Toda mutación IA usa `proposal/state delta -> validator -> preview/test -> apply/rollback`.
10. Cualquier cambio UI se guarda como V+ reversible; nunca destruir versión válida anterior.
11. Backend donor staging no equivale a integración backend productiva.
12. T2_INTERFACE_YAIWES no inicia productivamente hasta T1_FACTORY_FRONTEND VERIFIED_CLOSED.

## 2. FUENTES DE VERDAD Y ORDEN DE AUTORIDAD

1. INPUT literal del Director.
2. Crazy Wall, STATE, CHECKPOINT, PLAN, RECOVERY y HANDOFF.
3. Documentos fuente del proyecto:
   - MAX-SYSTEM-100X-FINAL-1.md
   - memoria Wordflow/YAIWES 20M contexto
   - MAVIS-PARALLEL-100X.md
   - RECOVERY_PATCH_PLAN2_FINAL.md (si vacío, no inventar)
4. Código existente en frontend/main.
5. Componentes OSS locales + README/licencia/source commit.
6. Investigación externa secundaria, sólo cuando sea necesaria y siempre diferenciada de fuente canónica.

## 3. ARQUITECTURA DE EXPERIENCIA YAIWES

### 3.1 Shell principal

`AppShell -> WorkspaceManager -> WindowDockManager -> CommandPalette -> JarvisChat -> TaskAgentCenter -> CanvasArtifact -> CodeTerminal -> Files -> EvidenceTrace -> SettingsProviders`

### 3.2 Tres entradas equivalentes por acción

Toda operación frecuente debe poder iniciarse por:

- Click/drag/drop visual.
- Command palette/búsqueda.
- Chat Jarvis/IA.

Las tres rutas emiten la misma `TypedAction` y usan el mismo Action Bus. Prohibido implementar tres lógicas distintas.

### 3.3 Frontera frontend-backend

`USER/AI -> UI Intent -> TypedAction -> Frontend Guard -> Universal Plugin/Action Bus -> API/MCP Adapter -> Backend Contract -> Runtime/Worker -> Event/StateDelta -> Verifier/Evidence -> Frontend Store -> UI Render`

Streaming: `backend stream -> normalized event -> bounded buffer/backpressure -> frontend store -> incremental render`.

Cancelación: `Cancel UI -> task_id -> cancel contract -> backend -> cancellation event -> store -> UI state`.

Secrets: `provider_id/model_id/secret_ref`; nunca API key real en navegador.

## 4. FÁBRICA UI — CINCO PASOS VISIBLES

### STEP 1 — CREAR
Entrada: plantilla, primitive o componente.
Acciones: crear ventana/botón/selector/segmento; props; style tokens; preview vivo.
Salida: `ComponentDraft` versionado y reversible.
Criterio PASS: crear, editar, deshacer/rehacer, preview y guardar V+.

### STEP 2 — COMPONER
Entrada: ComponentDraft/registry.
Acciones: canvas drag/drop, resize, constraints, layout, responsive states, navegación, composición.
Salida: `UIScene` / `WindowComposition`.
Criterio PASS: composición editable, reabrible y responsive.

### STEP 3 — TRANSFORMAR COMPONENTE
Entrada: componente OSS/local.
Acciones: source scanner -> capability extractor -> ficha/contract -> adapter -> sandbox preview -> registry.
Salida: `RegisteredComponentCandidate`.
Criterio PASS: URL/source commit/licencia + capacidad mínima + adapter + test + read-back.

### STEP 4 — IA / AUTOPILOT
Entrada: goal + context pack.
Acciones: model/router -> proposed StateDelta -> visual diff -> validator -> preview -> apply/rollback.
Modos: MANUAL | AI_ASSIST | AUTOPILOT.
Criterio PASS: IA nunca muta estado canónico sin validator/preview; rollback comprobado.

### STEP 5 — VALIDAR / SALIR
Entrada: composición.
Acciones: contract check -> unit/contract/E2E/visual/responsive/security -> build -> preview -> evidence -> save V+ -> private preview/export.
Salida: versión V+ verificable.
Criterio PASS: tests + evidencia + read-back + reviewer independiente.

## 5. CINCO MÓDULOS PERMANENTES

M1 COMPONENT MAKER: primitives, windows, buttons, selectors, segments.
M2 UI COMPOSER: integración visual, edición/reedición, layouts, navigation, responsive.
M3 COMPONENT TRANSFORMER: ingest OSS/local, capability extraction, ficha/adapter, sandbox preview, registry.
M4 AI INTERVENTION: intervención de IA en cualquier step por StateDelta reversible.
M5 DETERMINISTIC TOOLBOX: copy/move, registry, schema, build, test, snapshot, diff, rollback, evidence, package/export.

## 6. DOS RAÍCES OBLIGATORIAS

### Frontend/
- primitives
- shell/workspace/windows
- canvas/composer
- Jarvis/chat surfaces
- artifact viewers/editors
- responsive/mobile/desktop
- accessibility/input
- typed actions
- adapters frontend
- preview/build/tests

### backend/
Estado: DONOR_STAGING_ONLY.
- provider/router donors
- workflow/task donors
- persistence/search/index donors
- realtime/stream donors
- security/policy donors
- observability donors
- fixtures

Regla: no fusionar estos donors en rutas Sol sin handoff/ownership explícito.

## 7. FUSIÓN DE COMPONENTES OSS POR CAPACIDAD

### Lote A — Shell/UI/Chat/Editors
CodeMirror 6, Excalidraw, Chart.js, GSAP, Lucide, PDF.js, PixiJS, LibreChat, Open WebUI, Jan, Flutter, Grok Build.
Destino: Frontend/.
Objetivo: editor, canvas, gráficos, iconografía, documentos, render, chat/workspace, patrón build y cross-platform.

### Lote B — Realtime/Provider/Transport
LiteLLM, LiveKit, HTTPX, MCP Python SDK, MCP TypeScript SDK, NATS, PGMQ.
Destino principal: backend/ donor staging; frontend sólo clientes/adapters tipados necesarios.

### Lote C — Memory/Search/Documents
Apache Tika, Docling, Mammoth.js, FastEmbed, LanceDB, Meilisearch, Oxigraph, PGlite, ParadeDB.
Destino: backend donors + viewers/status frontend.

### Lote D — Security/Isolation/Supply chain
Apache PyCasbin, OpenBao, Cosign, Firecracker, Moby.
Destino: backend donors; frontend policy/permission UX y estado.

### Lote E — Observability/Quality
OpenTelemetry Python, Grafana, Loki, Loguru, Playwright, MSW, Hypothesis.
Destino: backend + frontend test/telemetry viewers.

### Lote F — VERIFY_REQUIRED
Apprise, Bulkman, Dagu, Debezium, Mesa, Piper y cualquier otro componente cuyo uso exacto no esté confirmado.
Regla: no cablear sin source URL + source commit + licencia + capability extraction + test.

## 8. ORDEN DE EJECUCIÓN T1

P0 INPUT — crear/mantener INPUT literal 1:1.
P1 SOURCE — releer arquitectura/fuentes/Crazy Wall/STATE/CHECKPOINT.
P2 INVENTORY — read-back físico de fábrica y componentes; matriz de capacidades/licencias.
P3 FACTORY CORE — cinco steps + cinco módulos + estado determinista.
P4 DONORS — cablear capacidades frontend mínimas; backend donors separados.
P5 AI — mini-router/model selector y AI Assist/Autopilot detrás de delta/validator.
P6 TEST — unit/contract/E2E/visual/responsive/security + preview privado.
P7 EVIDENCE — SHA/diff/test/log/read-back; 3 simulaciones; 3 refutaciones; Council12.
P8 CLOSE — reviewer/Sheriff independiente promueve a VERIFIED_CLOSED.
P9 THEN — habilitar T2_INTERFACE_YAIWES productiva y usar la propia fábrica para construir la UI.

## 9. LOOP OBLIGATORIO

`INPUT literal -> GOALS12 -> prioridades -> plan -> queue1x1 -> execute/review -> verify/refute -> GAP/FLAG -> research hasta 20 soluciones -> StrategyDelta materialmente distinto -> retry/continue safe task -> Council12 -> 3 simulaciones -> 3 refutaciones -> cross-check -> CODA -> verify_final`

Si GAP: investigar y ejecutar StrategyDelta; no declarar PASS.
Si FLAG: mantener pendiente con evidencia y continuar safe task independiente.

## 10. GOALS12 DE T1

G1. Cero fricción para operaciones normales.
G2. Máximo cinco pasos visibles principales.
G3. Drag/drop real.
G4. Constructor de controles/primitives.
G5. Compositor de UI completa editable.
G6. Transformador de componentes OSS/locales.
G7. IA operable desde cualquier step sin corrupción de estado.
G8. Operaciones deterministas y reproducibles.
G9. Preview vivo + undo/redo + rollback.
G10. Cableado por contrato/enchufe universal.
G11. Build/test/evidencia automáticos.
G12. Resultado reabrible, versionado V+, exportable y desplegable en preview privado.

## 11. ASK COUNCIL 12

C1. ¿Qué problema concreto resuelve?
C2. ¿Existe ya esa capacidad localmente?
C3. ¿Qué source/commit/licencia la respalda?
C4. ¿Frontend, backend donor o adapter compartido?
C5. ¿Unidad mínima reutilizable?
C6. ¿Contrato consume/expone?
C7. ¿Qué estado/eventos necesita?
C8. ¿Qué permisos/secrets necesita y dónde se resuelven?
C9. ¿Qué test prueba capacidad real?
C10. ¿Cómo se observa/audita?
C11. ¿Cómo se revierte sin romper V previa?
C12. ¿Qué evidencia permite a otro agente continuar sin reinterpretar?

## 12. TRES SIMULACIONES

S1 HUMANO SIN CÓDIGO: crear ventana completa por drag/drop y chat; preview, undo, save V+, reopen.
S2 IA AUTÓNOMA: goal -> Component Inbox -> StateDelta -> preview/test -> apply o rechazo; no corrupción canónica.
S3 BACKEND ADAPTER: frontend usa contrato mock compatible con Sol y cambia al adapter real sin rehacer UI.

## 13. TRES REFUTACIONES

R1 FACTUAL: ¿evidencia prueba WIRED/RUNTIME o sólo SOURCE_PRESENT?
R2 ESTRUCTURAL: ¿introduce monolito/duplicación/acoplamiento?
R3 ADVERSARIAL: ¿fallo de IA/red/modelo/componente/backend puede filtrar secreto, corromper estado o romper V previa?

Cualquier NO -> GAP -> StrategyDelta -> retry.

## 14. TEST MATRIX OBLIGATORIA

- Unit: reducers, state transitions, component registry, action schemas.
- Contract: TypedAction, Event, StateDelta, Adapter, provider/model selectors.
- E2E: create -> compose -> transform -> AI -> validate/export.
- Visual: desktop/tablet/mobile breakpoints.
- Accessibility: keyboard/focus/ARIA.
- Security: no secrets client-side, sanitization, permission boundaries.
- Recovery: checkpoint/reopen/rollback/V+.
- Performance: large canvas, many windows, streaming, backpressure.

## 15. CIERRE T1

T1_FACTORY_FRONTEND sólo puede pasar a VERIFIED_CLOSED si existe:

- INPUT literal presente y leído.
- Arquitectura completa presente.
- Plan presente.
- STATE y CHECKPOINT consistentes.
- Factory ejecutable.
- Drag/drop probado.
- Transformador probado con al menos un donor OSS trazable.
- AI delta/rollback probado.
- Build/preview probado.
- E2E completo probado.
- Source URL/commit/licencia de donor integrado.
- Evidencia SHA/diff/test/log/read-back.
- 3 simulaciones PASS.
- 3 refutaciones PASS.
- Cross-check global PASS.
- Reviewer independiente promueve el estado.

Hasta entonces: ACTIVE_LOOP o CLOSED_UNVERIFIED; nunca VERIFIED_CLOSED por presencia.

## 16. T2 DESPUÉS DEL GATE

T2_INTERFACE_YAIWES utiliza la fábrica para construir la interfaz productiva completa. Astra integra frontend con backend por contrato y adapter, no por acoplamiento directo. Sol mantiene ownership backend. Donors backend de Astra se entregan por handoff para evaluación e integración de backend.

## 17. PERSISTENCIA

Cada cambio material debe actualizar según corresponda:
- BITÁCORA
- STATE.json
- CHECKPOINT
- PLAN
- RECOVERY
- HANDOFF
- arquitectura/README
- Crazy Wall

No modificar por actividad vacía. Toda mejora V+ debe tener motivo, diff, test y rollback.
