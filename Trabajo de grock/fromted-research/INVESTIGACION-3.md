# FROMTED PASO 1 — INVESTIGACIÓN 3

Fecha: 2026-07-27 21:10 -05  
Estado: COMPLETADA (salida 3 de 3)  
Previa: I1 + I2  
Siguiente: **Salida 4 — consolidación + estrategia** (para debatir/aprobar)

Sin build. Sin diseño visual final.

---

## Markdown / artefactos

| # | Repo | URL | Encaje FROMTED |
|---|------|-----|----------------|
| 49 | mdx-editor/editor | https://github.com/mdx-editor/editor | **Editor MD rico React** (Notion-like) |
| 50 | imzbf/md-editor-rt | https://github.com/imzbf/md-editor-rt | MD editor dark theme + preview |
| 51 | jmagly/markdown-editor | https://github.com/jmagly/markdown-editor | Live preview + export PDF/DOCX + dark |
| 52 | react-mde | https://github.com/andrewhead/react-mde | Editor MD ligero controlado |
| 53 | markrahq/markra | https://github.com/markrahq/markra | WYSIWYG MD + AI local (Tauri) |

---

## Kanban (vista automatización / tasks)

| # | Repo | URL | Encaje FROMTED |
|---|------|-----|----------------|
| 54 | lucasbesen/react-kanban-dnd | https://github.com/lucasbesen/react-kanban-dnd | Kanban React DnD |
| 55 | its-rath/Kanban-Task-Management-System | https://github.com/its-rath/Kanban-Task-Management-System | Kanban + dnd-kit + a11y |
| 56 | lovro-git/KanbanBoard | https://github.com/lovro-git/KanbanBoard | Lightweight + dark + localStorage |
| 57 | arunkmr08/kanban-pwa | https://github.com/arunkmr08/kanban-pwa | Kanban PWA + dark + filters |
| — | @dnd-kit/core | librería base | Preferir dnd-kit en implementación |

---

## Historial / search / tags (limitado OS puro)

| # | Repo | URL | Encaje FROMTED |
|---|------|-----|----------------|
| 58 | leonickson1/chatcn | https://github.com/leonickson1/chatcn | Chat UI shadcn: sidebar search, threads, themes |
| 59 | KuekHaoYang/KChat | https://github.com/KuekHaoYang/KChat | Historial searchable + folders + dark |
| 60 | fahdbahri/chatfinder | https://github.com/fahdbahri/findMyChat | Search semántico historial (ref arquitectura) |
| — | Tags por mensaje | — | **Casi siempre custom**: chips shadcn + store externo; no hay lib dominante “message-tags-only” |

Nota: lupa historial + tags por input/output se implementan con componentes shadcn (Badge, Command, Combobox) sobre datos del store; no bloquea sources.

---

## Audio / voice input

| # | Repo | URL | Encaje FROMTED |
|---|------|-----|----------------|
| 61 | SyntropyLabs/react-web-speech | https://github.com/SyntropyLabs/react-web-speech | **useSpeechInput** Web Speech API |
| 62 | compulim/react-dictate-button | https://github.com/compulim/react-dictate-button | Botón dictado Web Speech |
| 63 | sabowaryan/voiceform | https://github.com/sabowaryan/voiceform | Form voice-controlled (ref UX) |
| — | assistant-ui | I1 | Voice dictation en roadmap/features |

---

## OpenClaw UI / Reachat (residuales)

| # | Repo | URL | Encaje FROMTED |
|---|------|-----|----------------|
| 64 | knightafter/openClaw-web-interface | https://github.com/knightafter/openClaw-web-interface | Web UI OpenClaw: stream, MD, skills sidebar, dark |
| 65 | openclaw/openclaw (ui/src/ui/chat) | https://github.com/openclaw/openclaw/tree/main/ui/src/ui/chat | **Source oficial UI chat** (ya en agents/OpenClaw) |
| 66 | reaviz/reachat | https://github.com/reaviz/reachat | Building blocks LLM chat + Tailwind + mentions |

OpenClaw: priorizar código ya descargado en `agentes/agents/OpenClaw` + openClaw-web-interface como ref visual.

---

## Estado gaps globales tras I1+I2+I3

| Área plan ≥20 | Estado |
|---------------|--------|
| Chat streaming multi-model | OK |
| AI Council | OK |
| Canvas React Flow / n8n-like | OK |
| Sandbox Pyodide | OK |
| File browser web | OK |
| MCP / connectors | OK |
| LiteLLM (externo) | OK |
| Shells Tauri/Capacitor | OK |
| Dark shadcn / model selector | OK |
| MD artifacts | OK |
| Kanban | OK |
| Audio | OK |
| OpenClaw UI source | OK (inventory + web-interface) |
| Tags/historial search | Parcial → custom shadcn (documentado) |

---

## Contador final investigación

I1 ≈22 · I2 ≈26 · I3 ≈18  
**Total documentado con URL: ~66**

FIN INVESTIGACIÓN 3.

**Próximo mensaje usuario:** salida 4 = consolidar candidatos prioritarios + estrategia sources determinista + plan de fusión para debatir y aprobar.
