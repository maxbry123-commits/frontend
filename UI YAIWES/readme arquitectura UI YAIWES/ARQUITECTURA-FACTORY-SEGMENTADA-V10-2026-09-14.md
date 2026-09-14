# ARQUITECTURA FACTORY UI YAIWES SEGMENTADA — V10

Fecha: 2026-09-14  
Repo: `maxbry123-commits/frontend`  
Branch: `main`  
Contrato: `tel.workflow/v3`  
Modo: `FAIL_CLOSED_LOOP`

## 1. Objetivo

Cerrar la Fábrica UI como un único producto probado sin volver a permitir que varios agentes editen el mismo entrypoint o el mismo módulo compartido.

La arquitectura conserva `index-v19.html` y `index-v192.html` como snapshots históricos y desplaza el trabajo paralelo a segmentos con ownership explícito. Ningún worker usa la web live como scratch. Un integrador separado ensambla candidatos nuevos y sólo se promueven después de pruebas reproducibles.

Principio central:

`SOURCE_PRESENT != IMPLEMENTED != WIRED != RUNTIME_TEST_PASS != VERIFIED_CLOSED`

## 2. Flujo operacional

`READ_FRESH → IDENTIFY FREE/GAP_RESOLVABLE → CLAIM SEGMENT → VERIFY_RESEARCH → EXECUTE_DELTA V+1 → FOCUSED TEST → PREVIEW → REVIEW → INTEGRATOR → CANDIDATE TEST → PUBLISH EXACT SHA → CROSS REVIEW → FRONTEND_100`

Reglas:

- 1 chat = 1 nodo activo.
- 1 path = 1 writer activo.
- `fresh_main_sha + chat_id + node_id + write_scope + claimed_at` antes de escribir.
- Prioridad `REUSE_EXISTING > PATCH > ADAPT > GENERATE > NEW_DOWNLOAD`.
- No Git LFS, no force push, no segundo motor de estado/editor.
- No heredar PASS de otro entrypoint.
- Productor no autocertifica el gate final.

## 3. Entry points y versión

### Congelados

- `Frontend/factory-v0/index-v19.html`
- `Frontend/factory-v0/index-v192.html`

No se modifican durante el trabajo paralelo.

### Preview actual

- `Frontend/factory-v0/index-v193-preview.html`

Este preview carga sólo el bootstrap integrador:

- `Frontend/factory-v0/src/bootstrap/candidate-v193.js`

El bootstrap reutiliza módulos existentes de V1.9 y V1.9.2. No introduce un segundo state engine. El único owner de estado sigue siendo `src/app-v19.js`.

Promoción:

`historical → segment v+1 → preview → candidate → exact tested SHA → live`

## 4. Segmentación frontend

El registry ejecutable de ownership es:

`Frontend/factory-v0/src/segments/segment-registry-v1.js`

### SEG-01-SHELL — Workspace

Scope:

- `src/ui/workspace-shell-v*.js`
- `workspace-shell-v*.css`

Responsabilidad: drawers, paneles, layout responsive y canvas-first.

### SEG-02-BROWSER — Component Browser

Scope:

- `src/ui/component-browser-v*.js`

Responsabilidad: búsqueda, categorías, preview, favoritos, recientes, insertar y drag/drop.

### SEG-03-EDITOR-CORE — Core protegido

Scope:

- `src/app-v*.js`
- `src/actions.js`

Responsabilidad: state owner, reducer dispatch, canvas base, step workflow, propiedades y persistencia base.

Política: `PATCH_ONLY`. Los agentes normales no lo reescriben.

### SEG-04-TOUCH — Mobile/Touch

Scope:

- `src/touch-dnd-v*.js`
- `src/scroll-preserver.js`
- `src/interaction-fix.js`

Responsabilidad: pointer/touch, drag/move, scroll y coordinación del canvas móvil.

### SEG-05-CONTROLS

Scope:

- `src/layer-reorder-v*.js`
- `src/resize-snap.js`
- `src/donors/xyflow-minimap-adapter.js`
- `src/donors/frappe-context-menu-adapter.js`
- CSS asociado.

Responsabilidad: capas, resize, FitView/minimap, context menu y controles de interacción.

### SEG-06-IO

Scope:

- `src/json-roundtrip-v*.js`
- `src/version-store-v*.js`
- `src/destination-roundtrip-v*.js`
- `src/html-export-v*.js`

Responsabilidad: JSON/HTML, versiones, restore, destinos y roundtrip.

### SEG-07-IMPORT

Scope:

- `src/file-import-controller-v*.js`
- `src/file-import-v*.js`

Responsabilidad: archivo/HTML/referencia → descriptor → canvas editable.

### SEG-08-AI-ROUTER

Scope:

- `src/frontend-router-bridge.js`
- `src/backend-adapter.js`
- `src/remote-control-v*.js`
- `src/ai-router-*`
- `src/skill-activation-v*.js`

Responsabilidad: Router, modelos, skills, MCP/API-facing boundary, remote status/cancel/readback. Secretos siempre mediante `secret_ref`.

### SEG-09-HF-JOBS

Scope:

- `src/hf-jobs-panel-v*.js`

Responsabilidad: run/status/log/cancel y sincronización con UI sin exponer token.

### SEG-10-OSS

Scope:

- `src/donors/**`
- `src/oss/**`
- `src/acquisition/**`

Responsabilidad: adapters OSS y recursos adquiridos sólo después de capability gap demostrado.

### SEG-11-INTEGRATOR

Scope:

- `index-v193+`
- `src/bootstrap/candidate-v*.js`

Sólo rol `integrator` puede modificar este segmento. El integrador no desarrolla features; únicamente compone versiones de segmentos que ya tienen evidencia.

## 5. Trabajo simultáneo SOL GPT / Grok

Cada agente reclama un nodo cuyo `write_scope` cae en un único segmento.

Ejemplo:

- Grok → SEG-02 browser v2.
- SOL GPT A → SEG-04 touch v193.
- SOL GPT B → SEG-08 router bridge v2.
- Integrator → SEG-11 sólo cuando los productores reportan.

Nunca dos agentes escriben el mismo path.

Si un agente necesita una capacidad de otro segmento:

`REPORT DEPENDENCY → RELEASE/SKIP → otro nodo owner implementa → readback → integrator compone`.

No se cruza el scope para “arreglar rápido”.

## 6. Hugging Face preview

La web estable no se usa como entorno de edición concurrente.

Modelo recomendado:

`preview/<agent>/<node>/<commit-sha>/`

El preview registra:

- source SHA,
- segment id,
- node id,
- producer,
- artifact/run/job,
- test result.

Sólo el integrador puede promover preview a candidato y sólo publicación final puede sustituir el live estable.

## 7. Backend separado — micro-kernel de auto-evolución

Los nodos backend se guardan separados de los nodos frontend en `FACTORY-CRAZY-WALL-SEGMENTED-V10-2026-09-14.json`.

No se implementa un segundo downloader. Se envuelve el Motor 2 canónico existente.

Flujo:

`CAPABILITY_REQUEST`
→ `LOCAL_CAPABILITY_DEDUP`
→ si existe: `REUSE`
→ si falta: `BOUNDED_RESEARCH`
→ `LICENSE + SOURCE + VERSION CHECK`
→ `CANONICAL_MOTOR2_DOWNLOAD/EXTRACT`
→ `SHA256 + PROVENANCE`
→ `FABLES ADAPTER`
→ `CAPABILITY BUS`
→ `ISOLATED TEST`
→ `FACTORY TEST`
→ `PREVIEW`
→ `INDEPENDENT REVIEW`
→ `PROMOTE | REJECT`.

Cualquier fallo produce `FAIL_CLOSED` y el componente no se cablea.

## 8. Motor determinista 96/4

La regla existente de YAIWES se conserva:

- 96% determinista: state, policy, ownership, hashes, provenance, routing contractual, gates, tests, promote/reject.
- hasta 4% LLM: búsqueda semántica, ranking, clasificación y resolución de ambigüedad acotada.

La LLM no decide por sí sola:

- permisos,
- claims,
- escritura fuera de scope,
- aceptación de licencia,
- hashes,
- tests,
- promoción,
- `VERIFIED_CLOSED`.

## 9. Fables Universal Plugin + Capability Bus

Todo componente aceptado se presenta al core mediante un adapter tipado.

`component/program/skill/template → Fables adapter → capability bus → consumer segment`

No se permite acceso directo de un componente adquirido al state owner.

Cada registro debe indicar:

- capability id,
- source URL,
- source ref/tag/commit,
- SHA256,
- license,
- local destination,
- adapter path,
- test path,
- activation state,
- rollback target.

## 10. MCP y Router

Ingress externo permitido:

- MCP,
- API HTTP autorizada.

Router recibe una acción tipada y selecciona únicamente capabilities registradas.

Rechazos obligatorios:

- capability desconocida,
- provider desconocido,
- contrato sin schema,
- secreto inline,
- provenance incompleta,
- adapter no probado.

## 11. Blender y OSS

Blender se investiga como donor de patrones, no como monolito embebido completo. Áreas relevantes:

- workspaces,
- viewport/editor separation,
- property inspector,
- operators/commands,
- keymaps,
- add-ons/extensions,
- context-dependent tools,
- non-destructive editing/version-like workflows.

La investigación de 10 sistemas OSS app/web + 3 adicionales debe comparar primero contra los recursos que ya existen en `UI YAIWES/componentes open soure UI YAIWES/` y el registry OSS de Factory.

Nueva descarga sólo si persiste un capability gap demostrable.

## 12. Gates

### Gate A — Segment architecture

- frozen versions intact,
- ownership registry sin collisions,
- SEG-11 integrator-only,
- preview usa bootstrap único,
- static test PASS.

### Gate B — Unified browser candidate

Una sola URL debe demostrar simultáneamente:

- workspace shell,
- component browser,
- canvas editor,
- touch,
- layers/resize/minimap/context menu,
- JSON/version/destination,
- import,
- skills,
- Router/remote,
- HF jobs.

### Gate C — UI exhaustive

Reusar F-UI-051..061 sobre el mismo candidate SHA.

### Gate D — independent review

F-UI-062.

### Gate E — FRONTEND_100

Sólo F-UI-063 puede declarar frontend 100%, y exige:

`TESTED_SHA == PUBLISHED_SHA` + desktop/mobile/touch/keyboard + cero botones muertos + reload/reopen + export + Router/HF + console/network critical errors=0 + evidencia + reviewer independiente.

## 13. Estado actual de esta arquitectura

La existencia de V1.9.3 preview acredita únicamente convergencia estructural. No acredita navegador, publicación ni `FRONTEND_100` hasta ejecutar los gates downstream.
