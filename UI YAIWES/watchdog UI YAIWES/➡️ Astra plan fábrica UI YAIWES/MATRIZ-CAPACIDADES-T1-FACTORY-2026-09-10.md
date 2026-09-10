# MATRIZ DE CAPACIDADES — T1_FACTORY_FRONTEND

Identidad: `➡️ Astra plan fábrica UI YAIWES`
Contrato: `tel.workflow/v3`
Estado: `ACTIVE_LOOP / SOURCE_PRESENT_AUDITED / NOT_WIRED`
Base auditada: `main@0130520585cc7f54f3fcfddbb2a523dd062e5e2d`

## Regla

Esta matriz clasifica capacidad; NO declara integración. `SOURCE_PRESENT != WIRED != RUNTIME_TEST_PASS != VERIFIED_CLOSED`.

## Fábrica existente confirmada

Raíz: `fabrica de UI INTERFACE fromtend/`.

Componentes/artefactos confirmados en read-back: Appsmith, Budibase, Craft.js, Capacitor, Bubblewrap-TWA, Dexie, documentación `00-ADVERTENCIA-Y-MODELO.md`, `01-APROBADO-MULTIPLATAFORMA.md`, `02-OCHO-SIMULACIONES.md`, `CABLEADO.md`, manifests/gaps de adquisición.

El `CABLEADO.md` vigente fija: fábrica separada de runtime; 1 ventana=1 archivo; 1 función=1 archivo; backend fuera de `yaiwes-button`; runtime no importa canvas GrapesJS/Puck.

## Matriz inicial de componentes OSS locales

| Componente | Carril | Capacidad objetivo | Uso en fábrica/UI | Estado |
|---|---|---|---|---|
| Appsmith | Frontend donor | builder/app composition | patrones editor/inspector/bindings | SOURCE_PRESENT / EXTRACT_MINIMUM_ONLY |
| Budibase | Frontend donor | low-code builder | patrones de builder/data UI | SOURCE_PRESENT / EXTRACT_MINIMUM_ONLY |
| Craft.js | Frontend donor | React page editor | candidato principal para composición drag/drop | SOURCE_PRESENT / VERIFY_LICENSE_COMMIT |
| Capacitor | Frontend donor | web→mobile shell | empaquetado Android/iOS | SOURCE_PRESENT / VERIFY_LICENSE_COMMIT |
| Bubblewrap-TWA | Frontend donor | Android TWA | empaquetado web Android opcional | SOURCE_PRESENT / VERIFY_REQUIRED |
| Dexie | Frontend donor | IndexedDB local | persistencia local de drafts/checkpoints UI | SOURCE_PRESENT / VERIFY_LICENSE_COMMIT |
| CodeMirror 6 | Frontend | editor code | panel code/script/config | SOURCE_PRESENT / VERIFY_LICENSE_COMMIT |
| Excalidraw | Frontend | canvas/diagram | diagramas y artefactos visuales | SOURCE_PRESENT / VERIFY_LICENSE_COMMIT |
| Chart.js | Frontend | charts | paneles métricas/evidencia | SOURCE_PRESENT / VERIFY_LICENSE_COMMIT |
| GSAP | Frontend | motion | microinteracciones; no requisito de core | SOURCE_PRESENT / OPTIONAL |
| Lucide | Frontend | icons | iconografía unificada | SOURCE_PRESENT / VERIFY_LICENSE_COMMIT |
| PDF.js | Frontend | PDF viewer | viewer de artefactos | SOURCE_PRESENT / VERIFY_LICENSE_COMMIT |
| PixiJS | Frontend | 2D renderer | canvas avanzado opcional | SOURCE_PRESENT / OPTIONAL |
| LibreChat | Frontend donor | chat workspace | patrones chat/model selector | SOURCE_PRESENT / DONOR_ONLY |
| Open WebUI | Frontend donor | multi-model chat | patrones chat/provider UX | SOURCE_PRESENT / DONOR_ONLY |
| Jan | Frontend donor | local AI desktop | patrones local-first/model management | SOURCE_PRESENT / DONOR_ONLY |
| Flutter | Frontend donor | multiplatform | referencia/carril multiplataforma; no duplicar shell sin decisión | SOURCE_PRESENT / DECISION_REQUIRED |
| Grok Build | Frontend reference | build workflow | patrón plan→preview→iterate | SOURCE_PRESENT / REFERENCE |
| LiteLLM | backend/ donor | model router | provider/model registry; frontend sólo contrato | SOURCE_PRESENT / DONOR_STAGING_ONLY |
| LiveKit | backend/ donor | realtime | streaming/voice/realtime contract | SOURCE_PRESENT / DONOR_STAGING_ONLY |
| HTTPX | backend/ donor | HTTP client | adapter transport | SOURCE_PRESENT / DONOR_STAGING_ONLY |
| MCP Python SDK | backend/ donor | MCP | contract/transport server-side | SOURCE_PRESENT / DONOR_STAGING_ONLY |
| MCP TypeScript SDK | Shared adapter | MCP | typed client/server adapter candidate | SOURCE_PRESENT / DONOR_STAGING_ONLY |
| NATS | backend/ donor | event bus | task/event transport candidate | SOURCE_PRESENT / DONOR_STAGING_ONLY |
| PGMQ | backend/ donor | queue | durable queue candidate | SOURCE_PRESENT / DONOR_STAGING_ONLY |
| Apache Tika | backend/ donor | extraction | ingest documentos | SOURCE_PRESENT / DONOR_STAGING_ONLY |
| Docling | backend/ donor | document conversion | ingest/structure artifacts | SOURCE_PRESENT / DONOR_STAGING_ONLY |
| Mammoth.js | Shared | DOCX→HTML | preview documentos | SOURCE_PRESENT / VERIFY_REQUIRED |
| FastEmbed | backend/ donor | embeddings | local/fast indexing | SOURCE_PRESENT / DONOR_STAGING_ONLY |
| LanceDB | backend/ donor | vector DB | memory/search candidate | SOURCE_PRESENT / DONOR_STAGING_ONLY |
| Meilisearch | backend/ donor | lexical search | search service candidate | SOURCE_PRESENT / DONOR_STAGING_ONLY |
| Oxigraph | backend/ donor | RDF graph | relation/evidence graph candidate | SOURCE_PRESENT / DONOR_STAGING_ONLY |
| PGlite | Shared/local | local Postgres | browser/local structured state candidate | SOURCE_PRESENT / VERIFY_REQUIRED |
| ParadeDB | backend/ donor | search/Postgres | search donor | SOURCE_PRESENT / DONOR_STAGING_ONLY |
| Apache PyCasbin | backend/ donor | policy/RBAC | authorization contract | SOURCE_PRESENT / DONOR_STAGING_ONLY |
| OpenBao | backend/ donor | secrets | secret resolver candidate; never frontend keys | SOURCE_PRESENT / DONOR_STAGING_ONLY |
| Cosign | backend/ donor | signing | supply-chain verification | SOURCE_PRESENT / DONOR_STAGING_ONLY |
| Firecracker | backend/ donor | microVM | isolated execution candidate | SOURCE_PRESENT / DONOR_STAGING_ONLY |
| Moby | backend/ donor | containers | isolated execution candidate | SOURCE_PRESENT / DONOR_STAGING_ONLY |
| OpenTelemetry Python | backend/ donor | tracing | traces/evidence | SOURCE_PRESENT / DONOR_STAGING_ONLY |
| Grafana | Shared reference | observability UI | patterns dashboards; not embed repo wholesale | SOURCE_PRESENT / DONOR_ONLY |
| Loki | backend/ donor | logs | log store candidate | SOURCE_PRESENT / DONOR_STAGING_ONLY |
| Loguru | backend/ donor | logging | structured logs candidate | SOURCE_PRESENT / DONOR_STAGING_ONLY |
| Playwright | Frontend tests | E2E | deterministic UI/runtime tests | SOURCE_PRESENT / TEST_TOOL |
| MSW | Frontend tests | API mocks | backend-contract mocks | SOURCE_PRESENT / TEST_TOOL |
| Hypothesis | backend tests | property tests | contracts/state machines | SOURCE_PRESENT / TEST_TOOL |
| Apprise | backend/ donor | notifications | optional notification adapter | SOURCE_PRESENT / VERIFY_REQUIRED |
| Dagu | backend/ donor | DAG/workflow | workflow donor only; avoid second orchestrator | SOURCE_PRESENT / VERIFY_REQUIRED |
| Debezium | backend/ donor | CDC | optional event/change feed | SOURCE_PRESENT / VERIFY_REQUIRED |
| Piper | backend/ donor | TTS | optional local voice | SOURCE_PRESENT / VERIFY_REQUIRED |
| Bulkman | VERIFY | unresolved exact capability | no wiring until README/source/license verified | SOURCE_PRESENT / VERIFY_REQUIRED |
| Mesa | VERIFY | unresolved scope in this T1 | no wiring until exact repo/capability verified | SOURCE_PRESENT / VERIFY_REQUIRED |

## Decisión de arquitectura por los cinco pasos

`STEP1 CREAR` → primitives propios + Lucide + tokens existentes; NO traer builder completo.

`STEP2 COMPONER` → Craft.js como primer candidato de composición; Appsmith/Budibase quedan como donors de patrones específicos, no runtimes paralelos.

`STEP3 TRANSFORMAR` → scanner/ficha/adapter propio y pequeño; CodeMirror para inspección; MSW para mocks.

`STEP4 IA/AUTOPILOT` → interfaz tipada `goal -> ProposedStateDelta -> validate -> preview -> apply|rollback`; LiteLLM/MCP sólo como donor backend/adapter y nunca secreto en navegador.

`STEP5 VALIDAR/SALIR` → Playwright + MSW + build existente + evidence/read-back; Capacitor/Bubblewrap sólo en carril de empaquetado posterior al PASS web.

## GOALS12 de este nodo

1. Reusar antes de generar. 2. Un motor dominante por capacidad. 3. Mantener factory/runtime separados. 4. Drag/drop sin acoplar UI final al canvas. 5. Estado reversible. 6. Frontend/backend separados. 7. Secrets fuera del navegador. 8. Donors backend sin tocar Sol. 9. Test contractual. 10. Test E2E. 11. Evidencia por SHA/read-back. 12. T2 bloqueada hasta cierre T1.

## Refutación 3x

- Factual: inventario físico no demuestra cableado; estado permanece `SOURCE_PRESENT`.
- Estructural: integrar Appsmith+Budibase+Craft.js como tres runtimes sería monolito/conflicto; se elige un motor dominante y donors.
- Adversarial: Autopilot sin delta/validator podría corromper estado; toda IA queda detrás de preview/rollback.

## Siguiente cola 1x1

`P2_FACTORY_CONTRACTS`: materializar en el carril Astra contratos mínimos para `ComponentDraft`, `UIScene`, `RegisteredComponentCandidate`, `ProposedStateDelta`, `FactoryEvidence`, más `Frontend/` y `backend/` staging. No escribir rutas de Sol ni producto final.
