# ARQUITECTURA FACTORY UI YAIWES — SEGMENTADA / SWARM SAFE — V1

Fecha: 2026-09-14  
Repo: `maxbry123-commits/frontend`  
Branch: `main`  
Contrato: `tel.workflow/v3`  
Modo: `FAIL_CLOSED_LOOP`

## Objetivo

Cerrar Fábrica UI YAIWES sin que SOL GPT, Grok u otro worker puedan pisar el mismo frontend. El frontend se divide por ownership de paths y por versiones inmutables. El backend/micro-kernel usa nodos y scopes separados. La promoción a candidato único es serial y exclusiva del integrador.

## Regla de verdad

`SOURCE_PRESENT != IMPLEMENTED != WIRED != RUNTIME_TEST_PASS != VERIFIED_CLOSED`

Orden de estrategia:

`REUSE_EXISTING > PATCH > ADAPT > GENERATE > NEW_DOWNLOAD`

Todo write exige HEAD fresco + claim + write_scope + readback.

## Entry points históricos congelados

- `Frontend/factory-v0/index-v19.html` queda FROZEN como evidencia del carril Router/HF/layers/remote.
- `Frontend/factory-v0/index-v192.html` queda FROZEN como evidencia del carril workspace/browser/touch/json/skills.
- Ningún productor modifica esos archivos.
- El integrador es el único que puede crear el siguiente candidato (`index-v193.html` o superior).

## Segmentos frontend

El registro ejecutable está en:

`Frontend/factory-v0/src/segments/segment-registry-v1.js`

Segmentos:

1. `SEG-01-SHELL`: workspace shell + CSS de shell.
2. `SEG-02-BROWSER`: navegador de componentes.
3. `SEG-03-EDITOR-CORE`: canvas/editor core y acciones canónicas.
4. `SEG-04-TOUCH`: touch/mobile + preservación de scroll + interaction fix.
5. `SEG-05-CONTROLS`: layers, resize, minimap/FitView y context menu.
6. `SEG-06-IO`: version store, JSON/HTML roundtrip y destinos.
7. `SEG-07-IMPORT`: archivo/HTML/referencia -> canvas editable.
8. `SEG-08-AI-ROUTER`: Router Bridge, backend adapter, remote control, AI router y skills.
9. `SEG-09-HF-JOBS`: Hugging Face jobs panel.
10. `SEG-10-OSS`: donors/acquisition adapters.
11. `SEG-11-INTEGRATOR`: único owner del nuevo entrypoint candidato.

Regla de versiones:

`archivo-vN -> archivo-vN+1`; la versión previa se preserva.

No se acepta edición concurrente de la misma ruta concreta. El registro provee `classifyFactoryPath`, `validateSegmentClaim` y `detectConcretePathCollisions`.

## Preview seguro en Hugging Face

Los workers no publican directamente sobre el live estable.

Ruta conceptual de preview:

`preview/<AGENT>/<NODE>/<SHA>/`

Flujo:

`SEGMENT_DELTA -> LOCAL_TEST -> HF_PREVIEW -> REVIEW -> CANDIDATE_INTEGRATION -> EXACT_SHA_PUBLISH`

La promoción exige:

`segment_test_sha == candidate_test_sha`

Después:

`TESTED_SHA == PUBLISHED_SHA`

## Candidato único obligatorio

El GAP actual es ENTRYPOINT_DIVERGENCE:

V1.9 histórico aporta: `frontend-router-bridge`, `layer-reorder`, `remote-control`, `hf-jobs-panel`.

V1.9.2 histórico aporta: `json-roundtrip`, `touch-dnd-v192`, `skill-activation`, `workspace-shell`, `component-browser`.

El siguiente candidato debe demostrar coexistencia de ambos conjuntos SIN crear un segundo motor de estado/editor.

## Carril backend / micro-kernel

Backend y adquisición NO comparten write_scope con UI visual.

Microflujo determinista:

`CAPABILITY_REQUEST -> LOCAL_DEDUP -> GAP_CLASSIFY -> RESEARCH_IF_NEEDED -> LICENSE/SOURCE/VERSION -> CANONICAL_ACQUIRE -> EXTRACT -> HASH/PROVENANCE -> FABLES_ADAPTER -> CAPABILITY_BUS -> MCP/ROUTER -> ISOLATED_TEST -> FACTORY_TEST -> REVIEW -> PROMOTE|REJECT`

Se reutilizan los motores canónicos existentes de descarga/extracción/copia. Está prohibido crear un motor alternativo.

La LLM sólo participa en research, ranking semántico y resolución de ambigüedad acotada. Policy, ownership, provenance, hash, ejecución, test, estado y promoción son deterministas.

### Provenance mínima

Cada recurso incorporado debe registrar:

- source_url
- source_ref/commit/tag
- SHA256 o blob SHA verificable
- licencia
- destino
- capability
- adapter
- test
- installed_at
- readback

## OSS / Blender

Blender se investiga como referencia de patrones de producto: workspace, viewport, inspector/properties, shortcuts, panels, addons/plugins, undo/history y asset browsing. No se copia Blender completo dentro del frontend.

Los 10 sistemas OSS y los 3 adicionales sólo pueden avanzar de `RESEARCH` a `ACQUIRE` si el dedup local demuestra un capability GAP no cubierto por componentes ya presentes.

## Carriles Crazy Wall

La extensión autoritativa para este plan está en:

`UI YAIWES/bitácora stated JSON Craxy wall plan checkpoint/FACTORY-CRAZY-WALL-SEGMENTED-FE-BE-V1-2026-09-14.json`

Frontend y backend tienen node_id, write_scope y dependencias separados.

Un chat sólo mantiene un nodo activo. Tras PASS/REPORT/RELEASE debe releer main antes de reclamar otro.

## Cadena de cierre

`F-SEG-064 SEGMENTATION BASELINE`
→ `F-INT-065 CANONICAL CANDIDATE`
→ carriles paralelos FE/BE sin path overlap
→ `F-UI-051..061` sobre el MISMO candidato
→ `F-UI-062` reviewer independiente
→ `F-UI-063` único FRONTEND_100 gate.

Los nodos backend/micro-kernel pueden avanzar en paralelo mientras no muten paths reservados por el integrador.

## Política para Grok / SOL GPT

Antes de tocar código:

`READ FRESH -> IDENTIFY FREE/GAP_RESOLVABLE -> CLAIM -> VALIDATE SEGMENT -> VERIFY_RESEARCH -> EXECUTE VERSIONED DELTA -> TEST_REPORT -> READBACK -> RELEASE`

El worker debe abortar su write si:

- el node está CLAIMED/EXECUTING por otro worker;
- el path no pertenece al segmento;
- el path está FROZEN;
- main cambió y el delta quedó stale;
- la evidencia no puede ligarse al SHA exacto.

## Definición de Factory operativa

Una sola versión publicada debe demostrar:

crear -> insertar/drag/drop -> mover/touch -> seleccionar -> editar propiedades -> layers -> resize -> zoom/minimap -> undo/redo -> versionar -> save/reload/reopen -> importar archivo/HTML/referencia -> JSON/HTML roundtrip -> skills -> MCP/API -> Router -> HF Jobs -> salida/destino -> desktop -> mobile/touch -> keyboard -> cero controles muertos -> console/network críticos=0 -> exact SHA publicado.

Sólo `F-UI-063` puede certificar el cierre del frontend.
