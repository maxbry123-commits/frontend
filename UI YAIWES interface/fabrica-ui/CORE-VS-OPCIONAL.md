# Anti sobre-ingeniería · qué va al plan de verdad

Enlace para **mandar los 50 (ZIP)**:  
https://github.com/maxbry123-commits/frontend/upload/main/fabrica%20de%20UI%20INTERFACE%20fromtend/componentes%20para%20fabrica%20de%20interface

Índice forense (qué hay en el repo):  
https://github.com/maxbry123-commits/frontend/blob/main/%F0%9F%93%82%20Indice%20fromtend%20componentes.md

## CORE (se integra ahora — 12)

| Pieza | Dónde vive | Cómo se integra |
|-------|------------|-----------------|
| lote-01 ABS/slots/wire | `fabrica-ui/runtime/lote-01-nucleo-host/` | Botón → ABS → kernel |
| dockview | `fabrica-ui/vendor/dockview/` **COPIA EXTRACTED** | HOST split de iframes |
| lucide | `fabrica-ui/vendor/lucide/` **COPIA EXTRACTED** | iconos blancos → Little |
| i18next / assistant-ui | EXTRACTED en `fromted-sources/` (puntero; 350+280 files no duplicar de nuevo) | chat + idiomas |
| GrapesJS **o** Puck (uno, no cinco canvas) | GrapesJS ya en fábrica grande | Canvas **F1 solo** |
| JSONForms | FALTA ZIP | ficha de botón |
| XState | npm/pequeño | LOOP S0–S8 |
| Workbox | ya | PWA |
| Tauri + Capacitor | ya | 4 OS |
| WebCrypto AES-GCM | `_shared/security.js` | wires |
| Dexie / browser-fs-access | ya | storage + Cargar |

## OPCIONAL (después de OK de 39)

xyflow (grafo FOTO-01) · tldraw (wall libre) · Node-RED **o** Blockly (una receta, no dos) · PocketBase (API local) · Transformers.js / WebLLM (motor local, no chrome) · qiankun/wujie si iframe no basta.

## NO en el plan (sobre-ingeniería)

Airflow, Prefect, Dagster, Luigi, Keycloak, Casdoor, Appwrite, WordPress skills, 5 canvas a la vez (OpenPencil+Penpot+Webstudio+Silex+Frappe), ONNX+LiteRT+wllama **todos** a la vez.

**Un canvas. Un orquestador de recetas. Un runtime LLM local.** El resto se queda ZIP hasta que el CORE pinta.

## Del índice (32 OSS): qué copiar / qué no

**EXTRACTED (usar):** assistant-ui, dockview, i18next, react-i18next, lucide. Copiados a vendor: dockview + lucide.

**ZIP_ONLY (no extraer 20 monorepos):** OpenPencil, OpenDesign, Onlook, Penpot, Webstudio, Silex, Frappe, BESSER, tldraw, draw.io, xyflow, Craft.js (Craft ya está entero en fábrica), Mermaid, PlantUML, skills Anthropic/MS, Transformers.js, MLC WebLLM, ONNX, wllama, LiteRT.

**Código real (puntero):** HTML Grok, Router Universal UI, Fromted React Vite — referencia, no se fusionan al producto.

## Integración de cada CORE en el DAG

F0 inventario → F1 lote-01 → F2 ABS/security → F3 HOST+dockview → F4 lucide iconos → F5 PWA Workbox → F6 Tauri/Capacitor → F7 conector user-picked (incl. huggingface **opcional**) → F8 cifrado → F9 strip Factory → F10 Action extract → F11 OK ID → F12 03-producto.
