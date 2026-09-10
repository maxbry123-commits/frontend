# ➡️ Astra plan fábrica UI YAIWES — Perfil de trabajo y arquitectura operativa

Fecha base: 2026-09-10
Proyecto: UI YAIWES
Contrato: tel.workflow/v3
Modo: FAIL_CLOSED_LOOP
Identidad: `➡️ Astra plan fábrica UI YAIWES`
Estado: ACTIVE_LOOP

## 0. Objetivo persistente

Construir, probar, corregir y mejorar de forma continua el FRONTEND de UI YAIWES usando la Fábrica UI como herramienta principal. YAIWES se perfila como un Work multiplataforma con chat/orquestador tipo Jarvis capaz de controlar paneles, ventanas, workflows, agentes y herramientas de la interfaz. El frontend debe poder operar parcialmente local, con seguridad y cifrado fuertes; los agentes/LLMs principales se sirven desde web; el código/componentes del producto viven en infraestructura web; el almacenamiento del usuario es local por defecto y admite conectores opcionales elegidos por el usuario. El producto final es SaaS propietario, no open source.

Regla de frontera: el objetivo de Astra es FRONTEND. Astra debe comprender el backend de Sol y otros agentes para definir contratos, adapters, estados, eventos y superficies UI compatibles, pero no escribir en rutas backend ajenas sin handoff explícito.

Gate: `T1_FACTORY_FRONTEND` debe alcanzar `VERIFIED_CLOSED` antes de iniciar `T2_INTERFACE_YAIWES` como ejecución productiva.

## 1. Reglas absolutas

1. `single_writer_per_path=true`.
2. Antes de escribir: releer main + HEAD/base SHA + Crazy Wall + STATE/CHECKPOINT aplicable.
3. Si HEAD cambia: `STALE_LOCK_GAP_REBASE_REBUILD_DELTA`.
4. Nunca force-push. Nunca LFS.
5. Integraciones/conectores permitidos para este worker: GitHub y Hugging Face. El resto: DENY salvo autorización explícita posterior del Director.
6. `SOURCE_PRESENT != WIRED != RUNTIME_TEST_PASS != VERIFIED_CLOSED`.
7. `REUSE > COPY > PATCH > ADAPT > GENERATE`.
8. No monolito. Separar contratos, adapters, plugins, registry, loader, guards, tests, evidencia y UI.
9. La LLM no convierte directamente una propuesta en estado canónico: `proposal/delta -> schema/contract -> validator -> preview/test -> evidence -> apply/rollback`.
10. Credenciales: jamás dentro del frontend, repositorio o artefacto generado. Sólo `secret_ref` resuelto en runtime seguro.

## 2. Fuentes de verdad del proyecto

Orden de autoridad:

`INPUT literal del Director -> Crazy Wall/STATE/CHECKPOINT -> documentos fuente del proyecto -> código existente -> README/licencia/commit OSS -> investigación secundaria`.

Fuentes recibidas para esta fase:

- `MAX-SYSTEM-100X-FINAL-1.md`: ejecución durable, estado, recovery, arquitectura funcional.
- `🤯🗃️memoria del Wordflow resumen de lo que va en memoria del Wordflow para Kimi k y grock contexto de 20 millones d parámetros para el Wordflow y YAIWES.md`: Workflow / Memory-Audit / Sandbox / LLM / Consolidator / Auditor / Checkpoint, context fabric y recuperación.
- `📌MAVIS-PARALLEL-100X.md`: workers persistentes, cola de prioridad, cache, batching, streaming/backpressure, async pipeline, deduplicación.
- `📌🎯📂 como hacer con gpt las descargas manual ... RECOVERY_PATCH_PLAN2_FINAL.md`: referencia de adquisición; si el contenido del archivo está vacío en GitHub no se inventa su contenido.
- Enchufe universal FABLES/Plugin Bus + Ficha Contract v2 + contrato JSON universal entregados por el Director.

## 3. Referencias externas de producto/UX

Estas referencias son patrones de producto; no autorizan copiar código propietario.

### Grok Bot
Referencia oficial: https://x.ai/news/introducing-grok-bot
Patrones a reutilizar conceptualmente: agentes persistentes, computadora propia/entorno, tareas end-to-end, retorno cuando se requiere aprobación, memoria operativa y trabajo continuo.

### Grok Build
Referencia oficial: https://x.ai/news/grok-build-mode
Patrón: `describir -> construir -> preview vivo dentro del flujo -> iterar -> publicar/compartir`. Inspiración directa para reducir fricción de la Fábrica.

### Claude Cowork
Referencias: https://www.anthropic.com/news/introducing-anthropic-labs y https://www.anthropic.com/research/trustworthy-agents
Patrón: workspace de trabajo, ejecución multi-paso/multitarea, archivos/artefactos y autonomía delimitada.

### Claude Code
Referencia: https://www.anthropic.com/news/enabling-claude-code-to-work-more-autonomously
Patrones: edición de repos, cambios visibles, diff, checkpoints, terminal/IDE y ejecución verificable.

### Claude Design
Referencia: https://www.anthropic.com/news/claude-design-anthropic-labs
Patrón: lenguaje natural -> direcciones visuales -> prototipo/artefacto -> iteración visual rápida.

## 4. Perfil de experiencia YAIWES

La interfaz objetivo combina:

`WORK + CHAT JARVIS + WORKFLOW + DESIGN/BUILD + CODE + ARTIFACTS + FILES + TERMINAL + TASK TRACE + MULTIAGENT`.

No se diseñan como aplicaciones desconectadas. Se presentan como superficies modulares controladas por un Shell YAIWES y un Action/Command Bus.

### Shell principal

`AppShell -> WorkspaceManager -> Window/Dock Manager -> Command Palette -> Jarvis Chat -> Task/Agent Center -> Canvas/Artifact -> Code/Terminal -> Files -> Evidence/Trace -> Settings/Providers`.

### Regla 0-fricción

Toda operación frecuente debe poder iniciarse de tres formas equivalentes:

1. Directa visual: click/drag/drop.
2. Command palette/búsqueda.
3. Chat Jarvis/IA.

Los tres caminos emiten la MISMA acción tipada; no existen tres implementaciones diferentes.

## 5. Arquitectura de la Fábrica — cinco pasos visibles

### STEP 1 — CREAR
`template/component -> window/button/selector/segment -> props -> style tokens -> live preview`

Salida: `ComponentDraft` versionado y reversible.

### STEP 2 — COMPONER
`ComponentDraft -> canvas -> drag/drop -> resize -> constraints/layout -> responsive states -> navigation -> composition preview`

Salida: `UIScene` / `WindowComposition`.

### STEP 3 — TRANSFORMAR COMPONENTE
`OSS/local component -> source scanner -> capability extractor -> contract/ficha -> adapter -> sandbox preview -> component registry`

Salida: `RegisteredComponentCandidate`.

### STEP 4 — IA / AUTOPILOT
`goal -> context pack -> model/router -> proposed StateDelta -> visual diff -> validator -> preview -> apply OR rollback`

Modos: `MANUAL | AI_ASSIST | AUTOPILOT`.

La IA puede intervenir en cualquier STEP; siempre usa delta reversible, nunca mutación canónica directa.

### STEP 5 — VALIDAR / SALIR
`composition -> contract check -> frontend tests -> backend contract mocks/adapters -> build -> preview -> evidence -> save version -> publish private preview/export`

Salida: versión V+; nunca sobrescribir una versión válida previa.

## 6. Cinco módulos permanentes de la Fábrica

M1 COMPONENT MAKER: crea ventanas, botones, selectores, segmentos y primitives.
M2 UI COMPOSER: integra primitives/componentes, crea UI, abre y reedita versiones.
M3 COMPONENT TRANSFORMER: recibe componente externo, extrae capacidad, crea ficha/adapter y preview seguro.
M4 AI INTERVENTION: cualquier IA autorizada puede proponer/mejorar módulos en cualquier etapa mediante StateDelta + preview + validator.
M5 DETERMINISTIC TOOLBOX: catálogo de operaciones preconfiguradas reproducibles: copy/move, registry, schema, build, test, snapshot, diff, rollback, evidence, package/export.

## 7. Dos raíces obligatorias de integración

Dentro del área de trabajo de Astra se mantienen siempre dos carriles:

`Frontend/`
- visual primitives
- shell/workspace/windows
- canvas/composer
- chat surfaces
- artifact viewers/editors
- responsive/mobile/desktop
- accessibility/input
- typed frontend actions
- preview/build/test frontend

`backend/`
- únicamente código/capacidades donantes detectadas en OSS y preparación de contratos/adapters
- provider/router candidates
- task/workflow donors
- persistence/indexing/search donors
- streaming/realtime donors
- security/policy donors
- observability donors
- test fixtures

Regla backend: Astra no fusiona estos donors directamente en las rutas de Sol. Los deja separados, trazables y listos para que Sol/Astra-backend los incorpore mediante el enchufe universal.

## 8. Frontera Frontend ↔ Backend

Microflujo transversal canónico:

`USER/AI -> UI Intent -> TypedAction -> Frontend Guard -> Universal Plugin/Action Bus -> API/MCP Adapter -> Backend Contract -> Runtime/Worker -> Event/StateDelta -> Verifier/Evidence -> Frontend Store -> UI Render`

Cancelación:
`Cancel UI -> task_id -> cancel contract -> backend -> cancellation event -> store -> UI state`.

Streaming:
`backend stream -> normalized event -> bounded buffer/backpressure -> frontend store -> incremental render`.

Secrets:
`UI provider selector -> provider_id/model_id/secret_ref -> backend secret resolver`; nunca API key real en navegador.

## 9. Componentes localizados en `componentes open soure UI YAIWES/`

Inventario inicial confirmado en árbol de GitHub (>40):

1. Apache PyCasbin
2. Apache Tika
3. Apprise
4. Bulkman
5. Chart.js
6. CodeMirror 6
7. Cosign
8. Dagu
9. Debezium
10. Docling
11. Excalidraw
12. FastEmbed
13. Firecracker
14. Flutter
15. GSAP
16. Grafana
17. Grok Build
18. HTTPX
19. Hypothesis
20. Jan
21. LanceDB
22. LibreChat
23. LiteLLM
24. LiveKit
25. Loguru
26. Loki
27. Lucide
28. MCP Python SDK
29. MCP TypeScript SDK
30. MSW
31. Mammoth.js
32. Meilisearch
33. Mesa
34. Moby
35. NATS
36. Open WebUI
37. OpenBao
38. OpenTelemetry Python
39. Oxigraph
40. PDF.js
41. PGMQ
42. PGlite
43. ParadeDB
44. Piper
45. PixiJS
46. Playwright

Este inventario prueba presencia física en el árbol; NO prueba integración.

## 10. Plan de fusión por capacidades

No se fusionan 46 repos completos. Se extrae la capacidad mínima necesaria.

### Lote A — Shell/UI/Chat/Editors
Candidatos: CodeMirror 6, Excalidraw, Chart.js, GSAP, Lucide, PDF.js, PixiJS, LibreChat, Open WebUI, Jan, Flutter, Grok Build.
Destino conceptual: `Frontend/`.
Objetivo: editor, canvas, gráficos, iconografía, documentos, render 2D, chat/workspace, patrón build, cross-platform.

### Lote B — Realtime/Provider/Transport
Candidatos: LiteLLM, LiveKit, HTTPX, MCP Python SDK, MCP TypeScript SDK, NATS, PGMQ.
Destino conceptual principal: `backend/`; frontend recibe sólo clientes/adapters tipados cuando corresponda.
Objetivo: modelo/provider routing, streaming/realtime, HTTP, MCP, eventos/colas.

### Lote C — Memory/Search/Documents
Candidatos: Apache Tika, Docling, Mammoth.js, FastEmbed, LanceDB, Meilisearch, Oxigraph, PGlite, ParadeDB.
Destino: backend donors + viewers/index status en frontend.
Objetivo: extracción de documentos, embeddings, vector/search/graph/local data.

### Lote D — Security/Isolation/Supply chain
Candidatos: Apache PyCasbin, OpenBao, Cosign, Firecracker, Moby.
Destino: backend donors; frontend sólo policy/permission UX y estado, nunca secretos.
Objetivo: autorización, secret management, firma/verificación, aislamiento/container boundary.

### Lote E — Observability/Quality
Candidatos: OpenTelemetry Python, Grafana, Loki, Loguru, Playwright, MSW, Hypothesis.
Destino: backend + frontend tests/telemetry viewers.
Objetivo: traces, métricas/logs, E2E, mocks contractuales, property tests.

### Lote F — Auxiliary/VERIFY_REQUIRED
Candidatos: Apprise, Bulkman, Dagu, Debezium, Mesa, Piper y cualquier componente cuyo uso exacto no haya sido confirmado por README/código/licencia.
Regla: no cablear hasta `SOURCE_URL + SOURCE_COMMIT + LICENSE + capability extraction + test`.

## 11. Plan de ejecución T1 — cola 1x1

P0 INPUT: mantener `INPUT-BLOCK-LITERAL-ASTRA-2026-09-10.md` actualizado, sin reinterpretar instrucciones.
P1 SOURCE: leer 4x arquitectura/fuentes verdad y Crazy Wall/STATE/CHECKPOINT.
P2 INVENTORY: read-back físico de Fábrica + componentes; construir matriz de capacidades y licencias.
P3 FACTORY CORE: cinco STEPS + cinco módulos, con contratos y estado determinista.
P4 DONORS: integrar capacidades frontend por lotes pequeños y depositar backend donors separados.
P5 AI: mini-router/model selector + AI Assist/Autopilot siempre detrás de delta/validator.
P6 TEST: unit/contract/E2E/visual/responsive/security; preview privado.
P7 EVIDENCE: SHA/diff/test/log/read-back; 3 simulaciones + 3 refutaciones + Council12.
P8 CLOSE: sólo Sheriff/reviewer puede promover a `VERIFIED_CLOSED`.
P9 THEN: habilitar `T2_INTERFACE_YAIWES` y usar la propia fábrica para crear/mejorar la UI.

## 12. Tres simulaciones obligatorias

S1 HUMANO SIN CÓDIGO: usuario crea una ventana completa por drag/drop y chat sin abrir editor de código. PASS si preview, undo, save V+ y reopen funcionan.
S2 IA AUTÓNOMA: IA recibe goal, usa Component Inbox, propone StateDelta, ejecuta preview/test y deja evidencia sin modificar estado canónico si falla.
S3 INTEGRACIÓN BACKEND: frontend usa un contrato mock compatible con Sol; después se cambia el adapter al backend real sin rehacer componentes visuales.

## 13. Ask Council 12

1. ¿Qué problema concreto resuelve este cambio?
2. ¿Existe ya esa capacidad localmente?
3. ¿Qué fuente/commit/licencia la respalda?
4. ¿Es Frontend, backend donor o adapter compartido?
5. ¿Cuál es la unidad mínima reutilizable?
6. ¿Qué contrato consume/expone?
7. ¿Qué estado/eventos necesita?
8. ¿Qué permisos/secrets necesita y dónde se resuelven?
9. ¿Qué test demuestra la capacidad real?
10. ¿Cómo se observa y audita?
11. ¿Cómo se revierte sin romper V anterior?
12. ¿Qué evidencia permite a otro agente continuar sin reinterpretar?

## 14. Refutación automática 3x

R1 FACTUAL: ¿la evidencia prueba WIRED/RUNTIME o sólo SOURCE_PRESENT?
R2 ESTRUCTURAL: ¿la solución introduce acoplamiento/monolito/duplicación?
R3 ADVERSARIAL: ¿un fallo de IA, red, modelo, componente o backend puede corromper estado, filtrar secreto o romper V previa?

Si cualquiera falla: `GAP -> research -> StrategyDelta materialmente distinto -> retry`.

## 15. LOOP persistente

`INPUT literal -> GOALS -> priorities -> plan -> queue1x1 -> execute -> verify/refute -> GAP/FLAG -> research hasta 20 soluciones -> StrategyDelta -> retry/continue safe task -> Council12 -> 3 refutaciones -> cross-check -> CODA -> verify_final`.

Cuando una fase quede cerrada, el Watchdog no termina: pasa a `research/improvement loop`, mantiene backlog de propuestas y usa la Fábrica para construir versiones modulares V+ que puedan aprobarse o descartarse sin destruir la versión estable.

## 16. Criterio de cierre por nodo

No aceptar texto como evidencia. Mínimo:

`source URL + source commit/license cuando aplique + ruta destino + diff/blob/commit SHA + build/test/log + read-back + verifier result`.

Estados permitidos: `ACTIVE_LOOP | GAP | INCONCLUSIVE | CLOSED_UNVERIFIED | VERIFIED_CLOSED`.
