# PROYECTO FROMTED — PARTE 1: CATÁLOGO SOURCES (trazabilidad completa)

Fecha: 2026-07-27 21:15 -05  
Estado: PRE-SALIDA 4 — catálogo + auditoría (sin consolidar estrategia de fusión)  
Fuentes: `fromted-research/INVESTIGACION-1.md` + `2` + `3`  
Spec: `PROYECTO-FROMTED.md` (CERRADA)

Este documento expone **todas las URLs** investigadas y audita qué falta para programar.
No es aún la estrategia de fusión (eso es salida 4).

---

## A. CHAT / STREAM / MULTI-MODEL / COUNCIL

| # | Nombre | URL | Módulo FROMTED |
|---|--------|-----|----------------|
| 1 | assistant-ui | https://github.com/assistant-ui/assistant-ui | Chat base |
| 2 | multi-model-chat | https://github.com/seehiong/multi-model-chat | AI Council |
| 3 | talkio | https://github.com/llt22/talkio | Council + Tauri + MCP |
| 4 | react-ai-stream | https://github.com/trimooo/react-ai-stream | Stream + interrupt/abort |
| 5 | nexus-chat | https://github.com/HyxiaoGe/nexus-chat | Multi-LLM orchestrator UI |
| 6 | chat-panels | https://github.com/lnkiai/chat-panels | Multi-panel side-by-side |
| 7 | AIXpo | https://github.com/MasirJafri1/AIXpo | Multi-model compare |
| 8 | gpt-4-chat-ui | https://github.com/hillis/gpt-4-chat-ui | Selector providers dark |
| 9 | ai-platform (Polychat) | https://github.com/nicholasgriffintn/ai-platform | Council + agents + MCP |
| 10 | reachat | https://github.com/reaviz/reachat | Building blocks LLM chat |
| 11 | shadcn-chatbot-kit | https://github.com/Blazity/shadcn-chatbot-kit | Chat shadcn + cancel tools |
| 12 | run-llama/chat-ui | https://github.com/run-llama/chat-ui | Chat UI + model selector pattern |
| 13 | chatcn | https://github.com/leonickson1/chatcn | Chat shadcn search/threads |
| 14 | KChat | https://github.com/KuekHaoYang/KChat | Historial searchable + folders |
| 15 | openClaw-web-interface | https://github.com/knightafter/openClaw-web-interface | UI OpenClaw stream+skills |
| 16 | openclaw ui/chat (oficial) | https://github.com/openclaw/openclaw/tree/main/ui/src/ui/chat | Source oficial (ya en agents/) |

Atrium (@lacneu/atrium npm): UI gateway OpenClaw/Hermes sobre assistant-ui — útil como patrón, no repo primario obligatorio.

---

## B. AUTOMATIZACIÓN / CANVAS / KANBAN

| # | Nombre | URL | Módulo FROMTED |
|---|--------|-----|----------------|
| 17 | xyflow (React Flow) | https://github.com/xyflow/xyflow | Canvas automatización |
| 18 | awesome-node-based-uis | https://github.com/xyflow/awesome-node-based-uis | Índice libs canvas |
| 19 | react-workflow-editor | https://github.com/koolii/react-workflow-editor | n8n-compatible UI |
| 20 | reaflow | https://github.com/reaviz/reaflow | Workflow editor |
| 21 | openflow | https://github.com/nazihkhelifa/openflow | AI pipeline canvas |
| 22 | n8n-project AgentFlow | https://github.com/divu777/n8n-project | AI workflow + LangGraph UI |
| 23 | plat | https://github.com/zackham/plat | Canvas embed agentes |
| 24 | react-kanban-dnd | https://github.com/lucasbesen/react-kanban-dnd | Vista kanban tasks |
| 25 | Kanban-Task-Management-System | https://github.com/its-rath/Kanban-Task-Management-System | Kanban dnd-kit a11y |
| 26 | KanbanBoard | https://github.com/lovro-git/KanbanBoard | Kanban dark local |
| 27 | kanban-pwa | https://github.com/arunkmr08/kanban-pwa | Kanban PWA dark |

Graphiti / Graphify: ya en `comand-Center/programs/` (inventory determinista previo) — motor fuera de UI; solo conectar.

---

## C. SANDBOX / PYTHON IN UI

| # | Nombre | URL | Módulo FROMTED |
|---|--------|-----|----------------|
| 28 | pyodide | https://github.com/pyodide/pyodide | Sandbox Python WASM |
| 29 | python-code-container | https://www.npmjs.com/package/@examples-ai/python-code-container | Wrapper React Pyodide |

Linux embebido (v86/WebVM): **no investigado en profundidad** — ver auditoría abajo.

---

## D. FILE BROWSER / AUDITOR DOCS

| # | Nombre | URL | Módulo FROMTED |
|---|--------|-----|----------------|
| 30 | svar react-filemanager | https://github.com/svar-widgets/react-filemanager | Panel files React |
| 31 | OpusCapita react-filemanager | https://github.com/OpusCapita/react-filemanager | FileManager + API |
| 32 | thelicato/react-file-manager | https://github.com/thelicato/react-file-manager | UI + callbacks |
| 33 | Chonky | https://chonky.io (github relacionado) | File browser React agnostic |
| 34 | filebrowser Quantum | https://github.com/gtsteffaniak/filebrowser | Web file browser self-host |
| 35 | filebrowser (inventory) | ya en programs/ | Backend files |
| 36 | FileBrowser Swift | https://github.com/marmelroy/FileBrowser | Ref visual iOS |
| 37 | FileManagerUI | https://github.com/noppefoxwolf/FileManagerUI | Ref SwiftUI |
| 38 | expo-file-manager | https://github.com/martymfly/expo-file-manager | Ref RN móvil |

---

## E. MCP / CONNECTORS / ROUTER UI

| # | Nombre | URL | Módulo FROMTED |
|---|--------|-----|----------------|
| 39 | MCP ext-apps | https://github.com/modelcontextprotocol/ext-apps | Spec + SDK MCP Apps |
| 40 | mcp-ui | https://github.com/idosal/mcp-ui | UIResourceRenderer |
| 41 | use-mcp-react | https://github.com/WebMCP-org/use-mcp-react | Hooks MCP + OAuth |
| 42 | react-mcp-client | https://github.com/Darko-Martinovic/react-mcp-client | Cliente MCP + chat |
| 43 | example-remote-client | https://github.com/modelcontextprotocol/example-remote-client | Multi-server MCP |
| 44 | mcpcn | https://github.com/shadcn-labs/mcpcn | Componentes shadcn MCP Apps |
| 45 | open-connector | https://github.com/oomol-lab/open-connector | Catálogo conectores + dashboard |
| 46 | Connective | https://github.com/use-connective/Connective | Integraciones SaaS |

---

## F. LITELLM / MODEL ROUTER (externo)

| # | Nombre | URL | Módulo FROMTED |
|---|--------|-----|----------------|
| 47 | litellm + ui dashboard | https://github.com/BerriAI/litellm/tree/main/ui/litellm-dashboard | Admin models/keys (fuera UI) |
| — | docs proxy UI | https://docs.litellm.ai/docs/proxy/ui | Conexión /ui |
| — | litellm programs/ | inventory Command Center | Ya descargado |

---

## G. SHELLS MULTIPLATAFORMA

| # | Nombre | URL | Módulo FROMTED |
|---|--------|-----|----------------|
| 48 | tauri | https://github.com/tauri-apps/tauri | Desktop/mobile webview |
| 49 | torii | https://github.com/amajorai/torii | Shell Tauri v2 React 19 dark |
| 50 | capacitor-community/tauri | https://github.com/capacitor-community/tauri | Capacitor→desktop |
| 51 | capacitor-dark-mode | https://github.com/aparajita/capacitor-dark-mode | Dark web/iOS/Android |
| 52 | nextjs-ionic-capacitor starter | https://github.com/mlynch/nextjs-tailwind-ionic-capacitor-starter | PWA+iOS+Android template |

---

## H. DESIGN SYSTEM / DARK / THEMES

| # | Nombre | URL | Módulo FROMTED |
|---|--------|--------|----------------|
| 53 | shadcn/ui | https://ui.shadcn.com | Design system + dark |
| 54 | tweakcn-theme-picker | https://github.com/BankkRoll/tweakcn-theme-picker | 40+ themes dark/light |

---

## I. MARKDOWN ARTEFACTOS

| # | Nombre | URL | Módulo FROMTED |
|---|--------|--------|----------------|
| 55 | mdx-editor | https://github.com/mdx-editor/editor | Editor MD rico |
| 56 | md-editor-rt | https://github.com/imzbf/md-editor-rt | MD dark + preview |
| 57 | jmagly/markdown-editor | https://github.com/jmagly/markdown-editor | Preview + export |
| 58 | react-mde | https://github.com/andrewhead/react-mde | MD editor ligero |
| 59 | markra | https://github.com/markrahq/markra | WYSIWYG MD + AI local |

---

## J. AUDIO

| # | Nombre | URL | Módulo FROMTED |
|---|--------|--------|----------------|
| 60 | react-web-speech | https://github.com/SyntropyLabs/react-web-speech | useSpeechInput |
| 61 | react-dictate-button | https://github.com/compulim/react-dictate-button | Botón dictado |
| 62 | voiceform | https://github.com/sabowaryan/voiceform | Ref UX voice forms |

---

## K. YA EN INVENTORY DETERMINISTA (Command Center / agentes)

No re-clonar; reutilizar paths existentes:

- OpenClaw (+ UI paths si aplica)
- LiteLLM
- Graphiti
- Graphify
- filebrowser
- Hermes, Codex, Kimi, Mimo, Claude-Code, etc.

---

# AUDITORÍA vs SPEC FROMTED (antes de consolidar)

## Requisitos spec → cobertura sources

| Requisito spec | ¿Cubierto por catálogo? | Nota para programar |
|----------------|-------------------------|---------------------|
| UI-only, sin backend kernels | Sí (regla de producto) | No mezclar engines en src/ |
| Panel configuración | Parcial | shadcn forms + settings patterns; no repo “settings-only” crítico |
| Chat + agentes + selector modelos | Sí | assistant-ui + chat-ui/reachat patterns |
| Interrupt stream | Sí | react-ai-stream / runtime assistant-ui |
| Loop output continuo | **Parcial** | No hay lib “loop continuo” dedicada; es lógica de cliente sobre stream (implementar) |
| AI Council multi-AI | Sí | talkio / multi-model-chat / chat-panels |
| Módulos + / plugin directory | **Parcial** | mcpcn + open-connector catalog; no clon exacto Claude Directorio |
| Automatización Graphiti+Graphify+Obsidian+n8n+loops | Canvas sí; loops **parcial** | xyflow + workflow-editor; definición JSON loops = custom contrato |
| Hasta 50 procesos / 1000 pasos | UI only | Validación en UI; motor fuera |
| Router 3 paneles fichas N→N | **Parcial** | open-connector dashboard + MCP clients; ficha schema = custom UI |
| Auditor docs Anthropic + iOS files | Sí web + refs iOS | svar-filemanager / Chonky + anclas ID |
| Sandbox Python filtros in/out | Sí runtime | pyodide; **filtros whitelist = custom** |
| Gemma 4 E2B embebida MAXBRY | **No cubierto** | Requiere investigación dedicada E2B/WebGPU/bridge |
| Linux dentro UI | **No cubierto** | v86/WebVM no auditados en I1–I3 |
| Audio | Sí | react-web-speech |
| MD + artefactos | Sí | mdx-editor / md-editor-rt |
| Tags + lupa historial | **Parcial** | chatcn/KChat search; tags = custom shadcn |
| Multiplataforma Android iOS Win Linux | Sí path | Tauri + Capacitor starters |
| Dark mate naranja azul verde | Tokens custom | shadcn dark + theme CSS variables (PASO 2 visual) |
| 61 funciones chat DeepSeek | **No mapeadas 1:1** | Checklist separado pendiente FROMTED-CHAT-61-FUNCIONES.md |

---

## ¿Hace falta más investigación antes de salida 4?

### NO bloqueante para consolidar estrategia de fusión (salida 4)
La base de programación (chat, canvas, files, MCP, sandbox, shells, MD, kanban, audio) está cubierta con URLs.

### SÍ útil como investigación **opcional posterior** (no retrasa salida 4)

1. **E2B / Gemma-in-browser / WebGPU** — requisito aspiracional MAXBRY embebido.  
2. **v86 / WebVM / Linux-in-browser** — solo si se prioriza “Linux dentro UI”.  
3. **Plugin marketplace UI** más cercano a Claude Directorio (cards instalado/no instalado).  
4. **FROMTED-CHAT-61-FUNCIONES.md** — mapear checklist DeepSeek → componentes UI (documento, no repos).  
5. **Obsidian-like dual pane** específico (si se quiere más que canvas+docs separados).

### NO hace falta otra pasada I4 completa
Salvo que el usuario ordene profundizar E2B/Linux o el checklist 61 funciones antes de consolidar.

---

## Recomendación

- **Listo para salida 4** (consolidar candidatos prioritarios + manifest sources sparse + orden de fusión) **si** aceptas que E2B/Linux/61-funciones quedan como backlog post-aprobación.
- Si E2B o Linux-in-UI son **obligatorios en v1**, entonces 1 investigación corta (I4) solo esas 2 áreas antes de consolidar.

---

## Docs relacionados

| Doc | Rol |
|-----|-----|
| PROYECTO-FROMTED.md | Spec cerrada |
| PROYECTO-FROMTED-PASO-1.md | Paso investigación + download |
| PROYECTO-FROMTED-PASO-2.md | Diseño visual (después) |
| fromted-research/INVESTIGACION-1/2/3.md | Pasadas crudas |
| **Este archivo** | Catálogo URL + auditoría pre-consolidación |

FIN — esperando decisión: salida 4 ahora o I4 corta (E2B/Linux/61).