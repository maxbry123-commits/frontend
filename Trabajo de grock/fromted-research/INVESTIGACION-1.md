# FROMTED PASO 1 — INVESTIGACIÓN 1

Fecha: 2026-07-27 20:55 -05  
Estado: COMPLETADA (salida 1 de 3)  
Siguiente: INVESTIGACION-2 (áreas faltantes)

Regla: solo trazabilidad de hallazgos. Sin consolidar estrategia final. Sin build.

---

## Cobertura de esta pasada

| Área | Estado pasada 1 |
|------|-----------------|
| Chat UI streaming / multi-model | Cubierta |
| AI Council / multi-AI misma conversación | Cubierta parcial |
| Workflow canvas (React Flow / n8n-like) | Cubierta |
| Sandbox Python browser (Pyodide) | Cubierta |
| File browser estilo iOS / web | Cubierta parcial (más nativo iOS que web React) |
| Connectors panel / MCP client UI | **Falta** → pasada 2 |
| Model selector / dark design system | **Falta** → pasada 2 |
| Capacitor/Tauri / PWA | **Falta** → pasada 2 |
| Plugin/skill directory UI | **Falta** → pasada 2 |
| Tagging + historial search | **Falta** → pasada 3 |
| Interruptible stream clients | Parcial (hooks abort) |
| LiteLLM / proxy UIs | **Falta** → pasada 2 |

---

## Hallazgos — Chat / multi-model / Council

| # | Repo | URL | Encaje FROMTED | Notas |
|---|------|-----|----------------|-------|
| 1 | assistant-ui | https://github.com/assistant-ui/assistant-ui | **Chat base prioritario** | Primitivas Thread/Message/Composer; streaming; AI SDK; shadcn; no monólito |
| 2 | multi-model-chat | https://github.com/seehiong/multi-model-chat | AI Council / comparar | Hasta 5 modelos a la vez; React+TS+Tailwind; OpenRouter/Ollama |
| 3 | talkio | https://github.com/llt22/talkio | AI Council + desktop | Multi-AI group chat; Tauri 2 + React 19; MCP SDK; personas |
| 4 | atrium (@lacneu) | npm / OpenClaw+Hermes UI | Chat gateway agentes | UI capability-driven; OpenClaw/Hermes; basado en assistant-ui |
| 5 | react-ai-stream | https://github.com/trimooo/react-ai-stream | Stream + **abort** | useAIChat + abort; UI opcional; ~12kB; SSE |
| 6 | nexus-chat | https://github.com/HyxiaoGe/nexus-chat | Multi-LLM orchestrator | Streaming SSE; privacy local; React+Vite+Tailwind |
| 7 | chat-panels | https://github.com/lnkiai/chat-panels | Multi-panel side-by-side | Hasta 4 paneles; Cloudflare Pages; zero server storage |
| 8 | AIXpo | https://github.com/MasirJafri1/AIXpo | Multi-model compare | Next 15; muchos providers; dark mode |
| 9 | gpt-4-chat-ui (hillis) | https://github.com/hillis/gpt-4-chat-ui | Selector multi-provider | Dark theme; OpenAI/Claude/Gemini/Ollama |
| 10 | ai-platform (Polychat) | https://github.com/nicholasgriffintn/ai-platform | Council + agents + MCP | Monorepo amplio; tag council; iOS en dev |

---

## Hallazgos — Automatización / canvas

| # | Repo | URL | Encaje FROMTED | Notas |
|---|------|-----|----------------|-------|
| 11 | xyflow / React Flow | https://github.com/xyflow/xyflow (awesome list) | **Canvas estándar** | Base de casi todos los editores node-based |
| 12 | react-workflow-editor | https://github.com/koolii/react-workflow-editor | n8n-compatible UI | ReactFlow + formato n8n |
| 13 | reaflow | https://github.com/reaviz/reaflow | Workflow editor lib | ELK layout; mismo org tiene Reachat |
| 14 | openflow | https://github.com/nazihkhelifa/openflow | AI canvas multi-provider | @xyflow/react; pipelines gen AI |
| 15 | n8n-project / AgentFlow | https://github.com/divu777/n8n-project | AI workflow + LangGraph | React Flow + LangChain |
| 16 | plat | https://github.com/zackham/plat | Canvas embeddable agentes | Host-agnostic; runtime API para agents |

---

## Hallazgos — Sandbox code

| # | Repo | URL | Encaje FROMTED | Notas |
|---|------|-----|----------------|-------|
| 17 | pyodide | https://github.com/pyodide/pyodide | **Sandbox Python in-browser** | CPython en WASM; micropip; FFI JS↔Python |
| 18 | python-code-container | npm @examples-ai/python-code-container | Wrapper React Pyodide | Hooks React; virtual FS |
| — | WebContainers (StackBlitz) | docs comerciales/OS limits | Node in browser | Alternativa a Pyodide para Node; no priorizar Python |

---

## Hallazgos — File browser / auditor docs (parcial)

| # | Repo | URL | Encaje FROMTED | Notas |
|---|------|-----|----------------|-------|
| 19 | filebrowser (ya en agents/programs) | inventory previo Command Center | Backend file UI | Ya descargado en install determinista |
| 20 | FileBrowser (Swift iOS) | https://github.com/marmelroy/FileBrowser | UX iOS nativo | Referencia visual, no web |
| 21 | FileManagerUI | https://github.com/noppefoxwolf/FileManagerUI | SwiftUI file UI | Referencia iOS |
| 22 | expo-file-manager | https://github.com/martymfly/expo-file-manager | RN file manager | Móvil; no panel web Anthropic-like |

**Gap:** falta un file browser **web React** estilo panel Anthropic / lista+preview. Buscar en pasada 2.

---

## Candidatos prioritarios tentativos (solo nota; no decidir aún)

- Chat shell: **assistant-ui**
- Council / multi-stream: **talkio** o **multi-model-chat** + primitives assistant-ui
- Stream abort: **react-ai-stream** o runtime assistant-ui
- Canvas auto: **@xyflow/react** (+ plantilla n8n-like si hace falta)
- Sandbox: **pyodide** (+ wrapper React)
- Files: filebrowser ya en inventario + buscar React web en I2

---

## Qué falta explícitamente para INVESTIGACIÓN 2

1. MCP client UIs / connectors panel open source
2. Model selector components dark
3. Plugin / skill directory UI (tipo Claude Directorio)
4. File browser web React (no solo iOS)
5. Capacitor / Tauri / PWA shells
6. LiteLLM UI o admin proxies
7. Markdown artifact editors
8. Tagging + search historial components
9. shadcn/ui dark minimal systems / design tokens

---

## Contador

Repos revisados con URL esta pasada: **22** (incluye gaps documentados y filebrowser previo).
Áreas plan ≥20: chat+canvas+sandbox cubiertas; resto en I2/I3.

FIN INVESTIGACIÓN 1 — no consolidar hasta salida 4.
