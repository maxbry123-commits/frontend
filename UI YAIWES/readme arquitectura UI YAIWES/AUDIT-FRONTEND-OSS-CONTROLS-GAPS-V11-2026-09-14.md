# AUDITORÍA FRONTEND OSS + CONTROLES + GAPS — V11 — 2026-09-14

Repo: `maxbry123-commits/frontend`  
Branch: `main`  
Contrato: `tel.workflow/v3`  
Ámbito: `FRONTEND_ONLY`

## Veredicto

La Fábrica ya tiene una base funcional segmentada y varios donors reales, pero el inventario físico de componentes es mucho mayor que la integración runtime demostrada.

Regla de verdad:

`SOURCE_PRESENT != IMPLEMENTED != WIRED != RUNTIME_TEST_PASS != VERIFIED_CLOSED`

No se ordena integrar todo ni descargar por descargar. Cada capacidad nueva debe justificar un GAP, usar un adapter delgado y pasar un microtest antes de que `SEG-11` pueda cablearla.

## Inventario físico revisado

Ruta real:

`UI YAIWES/componentes open soure UI YAIWES/`

El nombre `componentes open soure fromtend/` no es la ruta real de `main`.

Registry de Factory:

`Frontend/factory-v0/src/donors/oss-registry.js`

Frontend listados por el registry: **22**.

### Ya acreditados como donors frontend

- Frappe Builder → context menu.
- xyflow → minimap + Fit View.
- Craft.js → patrones de editor.

Además:
- Lucide → runtime de iconos.
- Playwright → harness de navegador.

### Presentes pero no acreditados todavía como donor runtime de Factory

1. Chart.js
2. CodeMirror 6
3. Excalidraw
4. GSAP
5. MSW
6. Mammoth.js
7. PDF.js
8. PGlite
9. PixiJS
10. OpenPencil
11. Webstudio
12. Silex
13. tldraw
14. draw.io
15. assistant-ui
16. Dockview
17. i18next
18. react-i18next
19. FullCalendar

Estos 19 son candidatos de adaptación, no 19 obligaciones de cargar monolitos. Si al reclamar un nodo ya existe un adapter probado, el resultado correcto es `PASS_NO_DELTA`.

## Motor de adquisición/copia

No crear otro downloader/copier.

Contrato canónico:

`Frontend/factory-v0/src/microkernel/acquisition/index.js`

Ese wrapper declara `REUSE_EXISTING_ADAPT_NO_FORK` y el invariante `NO_ALTERNATE_DOWNLOADER`.

Cola Motor2 existente:

`UI YAIWES/automation/oss-11-canonical-motor2-20260911/QUEUE.json`

Destino canónico:

`UI YAIWES/componentes open soure UI YAIWES`

Política por nodo OSS:

- `AVAILABLE_LOCAL` / `AVAILABLE_EXTRACTED` → reutilizar árbol local, sin nueva descarga.
- `AVAILABLE_ZIP` → extraer sólo si hace falta mediante Motor2/adquisición canónica y conservar provenance.
- nunca copiar código indiscriminadamente al editor.
- `adapter mínimo → test aislado → release del segmento → integrador`.

## Candidato y controles reales

Se auditó `index-v195.html`, `src/app-v19.js`, shell/browser y donors activos.

Se identificaron **65 superficies de control** para verificación aislada: modos, cinco pasos, diez tipos de componente, breakpoints, zoom, historial, propiedades, importación, skills, router, media, destinos, exportación, browser v2, drawers, layers y Fit View.

Cada control recibe un nodo QA separado. El nodo QA:

- interactúa con un solo control;
- captura estado antes/después;
- exige efecto observable;
- registra consola/red;
- no repara el producto;
- si falla, reporta el GAP al segmento propietario.

Esto evita que un test de botón termine modificando simultáneamente core, router, shell o IO.

## 100 tareas justificadas

- `F-FE-090..154`: 65 gates individuales de botones/controles.
- `F-FE-155..173`: 19 adapters OSS frontend pendientes de acreditación.
- `F-FE-174..189`: 16 mejoras acotadas de UX, accesibilidad, touch, IO, import, Router/HF y performance.

No se crea un segundo motor de estado, editor, router o downloader.

## Coordinación multi-Grok

El workpack usa un manifiesto inmutable y **un archivo de claim por nodo**:

`UI YAIWES/bitácora stated JSON Craxy wall plan checkpoint/claims/frontend-workpack-100/F-FE-XXX.json`

Así varias instancias Grok no editan simultáneamente una única cola JSON.

Cadena:

`READ FRESH → CLAIM FILE PROPIO → VERIFY_RESEARCH → EXECUTE_DELTA → TEST_REPORT → PASS_RELEASED | GAP_RESOLVABLE → NEXT`

Sólo `SEG-11` integra. Sólo `F-UI-063` puede declarar `FRONTEND_100`.
