# MATRIZ DE FUSIÓN — 46 componentes localizados

Fecha: 2026-09-10
Owner: `➡️ Astra plan fábrica UI YAIWES`
Estado: PLAN / SOURCE_PRESENT_ONLY

Regla: esta matriz clasifica capacidades candidatas. Ninguna fila equivale a `WIRED` hasta revisar README/licencia/source commit, extraer la unidad mínima, crear ficha/adapter y pasar test/read-back.

| # | Componente | Carril principal | Capacidad candidata | Estrategia inicial |
|---|---|---|---|---|
| 1 | Apache PyCasbin | backend | policy/autorización | DONOR -> contract -> adapter |
| 2 | Apache Tika | backend | extracción documental | DONOR -> document service |
| 3 | Apprise | backend | notificaciones | VERIFY -> donor |
| 4 | Bulkman | backend | VERIFY_REQUIRED | revisar README/source antes de asignar función |
| 5 | Chart.js | Frontend | charts/dashboards | ADAPT componente visual |
| 6 | CodeMirror 6 | Frontend | editor de código/texto | ADAPT editor |
| 7 | Cosign | backend | firma/verificación supply-chain | DONOR seguridad |
| 8 | Dagu | backend | workflow/DAG candidate | VERIFY -> donor workflow |
| 9 | Debezium | backend | change events/CDC candidate | VERIFY -> event donor |
| 10 | Docling | backend | documentos/normalización | DONOR document pipeline |
| 11 | Excalidraw | Frontend | canvas/whiteboard donor | ADAPT capacidad; no segundo shell |
| 12 | FastEmbed | backend | embeddings | DONOR retrieval |
| 13 | Firecracker | backend | aislamiento VM | DONOR/security research only |
| 14 | Flutter | Frontend | patrón/capa cross-platform | VERIFY alcance antes de integrar |
| 15 | GSAP | Frontend | motion/animation | ADAPT motion layer |
| 16 | Grafana | backend | observabilidad/dashboard donor | backend telemetry; UI propia YAIWES |
| 17 | Grok Build | Frontend | build/preview workflow reference/donor | VERIFY licencia/code -> extract pattern |
| 18 | HTTPX | backend | cliente HTTP | DONOR transport |
| 19 | Hypothesis | backend | property tests | test donor |
| 20 | Jan | Frontend | local AI/chat UX donor | extract UX/components only |
| 21 | LanceDB | backend | vector/local memory | DONOR memory |
| 22 | LibreChat | Frontend | chat/provider/workspace donor | extract chat capabilities |
| 23 | LiteLLM | backend | provider/model router | DONOR router adapter |
| 24 | LiveKit | backend | realtime/voice/stream | DONOR + typed frontend client |
| 25 | Loguru | backend | logging | DONOR observability |
| 26 | Loki | backend | logs | DONOR observability |
| 27 | Lucide | Frontend | iconografía | ADAPT icon registry |
| 28 | MCP Python SDK | backend | MCP contracts/transport | DONOR adapter |
| 29 | MCP TypeScript SDK | Frontend/backend | MCP TS client/server contracts | split adapter by boundary |
| 30 | MSW | Frontend | mock API/contract tests | test harness |
| 31 | Mammoth.js | Frontend/backend | DOCX -> HTML/content extraction candidate | adapter/document donor |
| 32 | Meilisearch | backend | lexical search | DONOR search |
| 33 | Mesa | backend | VERIFY_REQUIRED | no wiring hasta identificar fuente/función |
| 34 | Moby | backend | containers | DONOR isolation research |
| 35 | NATS | backend | event bus/messaging | DONOR event layer |
| 36 | Open WebUI | Frontend | chat/model UI donor | extract components/patterns |
| 37 | OpenBao | backend | secret management | DONOR secret boundary |
| 38 | OpenTelemetry Python | backend | traces/metrics | DONOR telemetry |
| 39 | Oxigraph | backend | graph/RDF store | DONOR relations/memory candidate |
| 40 | PDF.js | Frontend | PDF viewer | ADAPT artifact viewer |
| 41 | PGMQ | backend | durable queue candidate | DONOR task/event queue |
| 42 | PGlite | Frontend/backend | local Postgres/WASM data | evaluate local encrypted workspace persistence |
| 43 | ParadeDB | backend | search/analytics candidate | VERIFY need before donor |
| 44 | Piper | backend | local TTS | DONOR voice optional; source confirmed OHF-Voice/piper1-gpl |
| 45 | PixiJS | Frontend | high-performance 2D canvas/render | ADAPT only if needed by canvas/artifact |
| 46 | Playwright | Frontend | E2E/browser tests | canonical E2E candidate |

## Fusión por 6 lotes

### A — Shell / Canvas / Editors / Artifacts
`CodeMirror 6 + Excalidraw + Chart.js + GSAP + Lucide + PDF.js + PixiJS + Jan + LibreChat + Open WebUI + Grok Build + Flutter`

Objetivo: construir capacidades del Work/Factory sin crear múltiples shells. Regla: un AppShell, un Component Registry, un Canvas API, un Inspector API.

### B — Provider / Realtime / Transport
`LiteLLM + HTTPX + LiveKit + MCP Python SDK + MCP TypeScript SDK + NATS + PGMQ`

Objetivo: preparar donors backend y contratos frontend para model routing, streaming, realtime, eventos, cola y MCP/API.

### C — Memory / Search / Documents
`Apache Tika + Docling + Mammoth.js + FastEmbed + LanceDB + Meilisearch + Oxigraph + PGlite + ParadeDB`

Objetivo: local-first context/artifacts/search con backend web opcional. No seleccionar todas las DB: comparar y elegir capacidades no redundantes.

### D — Security / Isolation
`Apache PyCasbin + OpenBao + Cosign + Firecracker + Moby`

Objetivo: policy, secret refs, supply-chain verification y aislamiento. Frontend sólo muestra permisos/estado; nunca secretos.

### E — Observability / Tests
`OpenTelemetry Python + Grafana + Loki + Loguru + Playwright + MSW + Hypothesis`

Objetivo: trazas, logs, E2E, contract mocking, property tests. YAIWES usa su UI propia; Grafana es donor/referencia, no shell final.

### F — Verify before use
`Apprise + Bulkman + Dagu + Debezium + Mesa + Piper + cualquier elemento con función/licencia no confirmada`.

No cablear por nombre. Gate: `SOURCE_URL -> SOURCE_COMMIT -> LICENSE -> README/CODE -> capability -> destination -> test`.

## Orden cola 1x1 de integración

1. Definir contratos frontend comunes: `TypedAction`, `ComponentManifest`, `UIScene`, `StateDelta`, `ArtifactRef`, `TaskEvent`, `ProviderRef`, `EvidenceRef`.
2. Elegir un canvas dominante después de prueba comparativa; Excalidraw/PixiJS se usan como donors especializados, no como canvases simultáneos por defecto.
3. Integrar editor + artifacts: CodeMirror/PDF.js/Chart.js/Lucide.
4. Integrar chat/work shell por extracción mínima de LibreChat/Open WebUI/Jan, sin copiar tres aplicaciones completas.
5. Integrar test harness MSW + Playwright antes de backend real.
6. Preparar backend donors por contrato en `backend/`, sin tocar Sol.
7. Conectar al enchufe universal mediante adapters; no importaciones directas cruzando capas.
8. Hacer 3 simulaciones: humano drag/drop, IA StateDelta, backend swap mock->real.
9. Sólo después promover capacidad a versión V+ candidata.

## Definición de 0-fricción

`drag/drop | command palette | Jarvis prompt` -> misma `TypedAction` -> mismo validator -> mismo StateDelta -> mismo preview -> mismo apply/undo.

Así la UX tiene tres entradas pero una sola implementación funcional.
