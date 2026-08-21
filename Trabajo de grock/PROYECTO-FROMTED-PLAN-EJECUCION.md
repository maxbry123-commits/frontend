# FROMTED — PLAN DE EJECUCIÓN

Fecha: 2026-07-27 22:00 -05  
Estado: PROPUESTO — pendiente aprobación usuario  
Método: download code OS → copy/edit → no desde 0 · sin sobreingeniería · bajo token

---

## 0. Auditoría de prioridades (antes de proponer)

Prioridades que el usuario ya fijó (lectura de notes + inputs):

1. Interface UI-only (web primero) — no kernels dentro del frontend  
2. Chat funcional + selector modelos/API/agentes (conectividad simple primero)  
3. Código OS fuerte: descargar sources, no diseñar desde 0  
4. Método determinista (manifest + sparse + inventory)  
5. App local (Gemma 1B Q4) = complemento, no bloquea v1 web  
6. 61 funciones = checklist; muchas son EXT (solo UI dispara)  
7. Visual PASO 2 después de sources  
8. Un objetivo grande por turno; plan luego código  

**Auditoría:** el orden de programación abajo respeta eso.  
No se construye canvas/router/E2B/Linux antes del chat shell.  
App Flutter runtime = fase B después de web mínima usable.

---

## 1. Estrategia token-económica

| Regla | Acción |
|-------|--------|
| Download first | `fromted/sources/` con sparse checkout |
| Copy only needed | Solo paths de componentes a usar |
| No rewrite | Adaptar imports/theme; no reescribir libs |
| Web v1 mínima | Chat + config + selector + stream + stop |
| Custom solo huecos | tags, loop continuo, ficha router N→N, tokens color |
| App local | Fase B; no mezcla en mismo turno que web shell |
| Docs | 1 plan + inventory; no 10 specs intermedias |

---

## 2. Sources prioritarios a DESCARGAR (manifest corto)

### Web (Fase A)

| id | official_repository | paths orientativos | destino |
|----|---------------------|--------------------|---------|
| assistant-ui | https://github.com/assistant-ui/assistant-ui | packages/react/src | sources/assistant-ui |
| xyflow | https://github.com/xyflow/xyflow | packages/react | sources/xyflow |
| shadcn patterns | docs + chatcn / shadcn-chatbot-kit | components usados | sources/chat-shadcn |
| svar-filemanager | https://github.com/svar-widgets/react-filemanager | src | sources/filemanager |
| mcp-ui / use-mcp | https://github.com/idosal/mcp-ui | src | sources/mcp-ui |
| mdx-editor | https://github.com/mdx-editor/editor | src | sources/mdx-editor |
| react-web-speech | https://github.com/SyntropyLabs/react-web-speech | src | sources/speech |
| pyodide | https://github.com/pyodide/pyodide | (npm/runtime) | note: CDN/npm no full clone |
| openClaw-web-interface | https://github.com/knightafter/openClaw-web-interface | src | sources/openclaw-web |
| reachat | https://github.com/reaviz/reachat | src | sources/reachat |

### App local (Fase B — después)

| id | repo | uso |
|----|------|-----|
| fllama | https://github.com/Telosnex/fllama | runtime GGUF |
| flutter_chat_ui | https://github.com/flyerhq/flutter_chat_ui | chat shell app |
| pocket_llm | https://github.com/PradyX/pocket_llm | model download ref |

Inventory ya existente en agents/programs (OpenClaw, LiteLLM, Graphiti, Graphify, filebrowser) = **no re-clonar**; solo conectar.

---

## 3. Orden de programación (línea de pasos)

### FASE A — Web v1 (usable)

| Paso | Qué | Cómo | Trazabilidad |
|------|-----|------|--------------|
| A0 | Repo `fromted` + structure | sources/ src/ inventory.json | PARTE-1 |
| A1 | RUN download manifest web | sparse clone → inventory | determinista |
| A2 | Shell Next/Vite + dark tokens | bg negro mate, texto blanco, naranja/azul/verde | visual notes |
| A3 | Chat base stream + stop | copy assistant-ui / reachat patterns | 61: #1 #6 #7 |
| A4 | Model selector + registry hook | UI lista; GET registry/LiteLLM | 61: #2 #15 |
| A5 | Historial lista + search UI | local/store; tags chips custom | 61: #3 #24 |
| A6 | Config panel (temp, stream, texto) | Zustand/simple store | 61: #8–11 |
| A7 | Markdown + copy buttons | react-markdown / built-in | 61: #18 #23 |
| A8 | Attach image/file + voice btn | dropzone + react-web-speech | 61: #36–38 |
| A9 | Deploy Vercel preview | sin backend pesado | PARTE-2 web |

**Criterio salida A:** chat funciona contra API/LiteLLM, stop, selector, dark OK.

### FASE B — Módulos web siguientes (mismo repo)

| Paso | Qué | Dependencia |
|------|-----|-------------|
| B1 | Panel archivos (filemanager source) | A9 |
| B2 | Panel router fichas (UI schema N→N) | A4 |
| B3 | Canvas automatización (xyflow copy) | A9 |
| B4 | MCP client panel (mcp-ui hooks) | B2 |
| B5 | MD artifact editor (mdx-editor) | A7 |
| B6 | Kanban cola tareas UI | B3 |
| B7 | Sandbox Pyodide panel | A9 |
| B8 | Anclas docs ↔ chat ↔ auto | B1 B3 |

### FASE C — App complemento local

| Paso | Qué |
|------|-----|
| C0 | Flutter project shell |
| C1 | fllama / lib_llama_cpp + Gemma 1B Q4 download |
| C2 | Session Controller (simple→local / escala→web) |
| C3 | Chat UI flutter_chat_ui + stream local |
| C4 | OpenClaw como Agent interface (lib) |
| C5 | Model Manager checksum/swap |

### FASE D — Visual polish (PASO 2)

Imágenes diseño + tokens finales + botones de fotos auditados — **después** de A9 mínimo.

---

## 4. Qué NO hacer (anti-sobreingeniería)

- No microservicios nuevos en v1 web  
- No E2B/Linux-in-UI en v1  
- No 50 procesos automatización antes de chat estable  
- No reimplementar LiteLLM/OpenClaw  
- No Flutter y React en el mismo sprint inicial  
- No “framework propio” de agents en el frontend  

---

## 5. Manifest determinista (plantilla)

```text
# DETERMINISTIC EXECUTION SPEC v1.0 (sources FROMTED)
# Cada repo: id, official_repository, branch|commit, destination_path, paths[]

LOAD_MANIFEST → VALIDATE → FOR_EACH → FETCH → CLONE sparse → CHECKOUT → COPY → VERIFY → inventory.json → NEXT → FINISH
```

Primera instalación crea inventory con SHAs. Updates posteriores usan SHA fijado.

---

## 6. Trazabilidad docs

| Doc | Rol |
|-----|-----|
| PROYECTO-FROMTED.md | Spec cerrada |
| PARTE-1-CATALOGO-SOURCES.md | URLs web |
| PARTE-2-HIBRIDO.md | Web + app local |
| FROMTED-CHAT-61-FUNCIONES.md | Checklist 61 |
| INVESTIGACION-1..5 | Trazas research |
| **Este plan** | Orden ejecución |
| TAREAS-EN-CURSO.md | Solo fase activa |

---

## 7. Primer comando tras aprobación

1. Crear/asegurar repo `fromted` en GitHub  
2. Escribir `manifest.sources.json` (lista sección 2 web)  
3. RUN INSTALL determinista → `fromted/sources/` + inventory  
4. Paso A2 shell dark  
5. Paso A3 chat stream  

No diseño visual final hasta A9 + OK usuario.

---

## 8. Mejora tiempo vs plan genérico

| Antes (riesgo) | Ahora |
|----------------|-------|
| Diseñar UI desde 0 | Copy assistant-ui / flutter_chat_ui |
| Investigar eterno | I1–I5 cerradas; plan fijo |
| Todo módulos a la vez | A chat primero → B módulos → C app |
| Embed Gemma web | Solo app Fase C |
| 61 en día 1 | Checklist; EXT diferido |

---

FIN PLAN — esperar **aprobación** o correcciones del usuario antes de A0/A1.
