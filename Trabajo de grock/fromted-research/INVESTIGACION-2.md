# FROMTED PASO 1 — INVESTIGACIÓN 2

Fecha: 2026-07-27 21:05 -05  
Estado: COMPLETADA (salida 2 de 3)  
Previa: INVESTIGACION-1.md  
Siguiente: INVESTIGACION-3

Sin consolidar estrategia final. Solo trazabilidad.

---

## Cobertura de esta pasada (gaps I1)

| Área | Estado I2 |
|------|-----------|
| MCP client / Apps UI | Cubierta |
| Connectors / integrations panel | Cubierta parcial |
| File browser web React | Cubierta |
| LiteLLM UI / proxy admin | Cubierta |
| Capacitor / Tauri / PWA shells | Cubierta |
| Dark design system / shadcn chat | Cubierta |
| Model selector components | Cubierta parcial |
| Plugin/skill directory UI | Parcial (mcpcn / patterns) |
| Markdown artifact editors | **Falta** → I3 |
| Tagging + historial search | **Falta** → I3 |

---

## MCP / connectors

| # | Repo | URL | Encaje FROMTED |
|---|------|-----|----------------|
| 23 | modelcontextprotocol/ext-apps | https://github.com/modelcontextprotocol/ext-apps | Spec + SDK MCP Apps (UI en chat) |
| 24 | idosal/mcp-ui | https://github.com/idosal/mcp-ui | UIResourceRenderer client React |
| 25 | react-mcp-client | https://github.com/Darko-Martinovic/react-mcp-client | Cliente MCP + chat |
| 26 | example-remote-client | https://github.com/modelcontextprotocol/example-remote-client | Multi-server MCP + agent loop |
| 27 | use-mcp-react | https://github.com/WebMCP-org/use-mcp-react | Hooks connect MCP runtime + OAuth |
| 28 | shadcn-labs/mcpcn | https://github.com/shadcn-labs/mcpcn | Componentes shadcn para MCP Apps |
| 29 | oomol-lab/open-connector | https://github.com/oomol-lab/open-connector | Catalogo conectores + dashboard + MCP |
| 30 | use-connective/Connective | https://github.com/use-connective/Connective | Integraciones SaaS plug-and-play |

---

## File browser web React

| # | Repo | URL | Encaje FROMTED |
|---|------|-----|----------------|
| 31 | svar-widgets/react-filemanager | https://github.com/svar-widgets/react-filemanager | **Componente React** tree/list/tiles/preview |
| 32 | OpusCapita/react-filemanager | https://github.com/OpusCapita/react-filemanager | FileManager + navigator React |
| 33 | thelicato/react-file-manager | https://github.com/thelicato/react-file-manager | UI + callbacks upload/delete |
| 34 | Chonky | https://chonky.io / github | File browser React, backend-agnostic |
| 35 | gtsteffaniak/filebrowser (Quantum) | https://github.com/gtsteffaniak/filebrowser | Web file browser avanzado (fork) |
| 36 | filebrowser (inventory previo) | ya en Command Center | Backend self-host |

---

## LiteLLM

| # | Repo | URL | Encaje FROMTED |
|---|------|-----|----------------|
| 37 | BerriAI/litellm (ui/litellm-dashboard) | https://github.com/BerriAI/litellm/tree/main/ui/litellm-dashboard | Admin UI models/keys/usage — **ya en programs/** |
| — | docs proxy UI | https://docs.litellm.ai/docs/proxy/ui | /ui en proxy; no reinventar panel admin |

Regla: LiteLLM corre fuera; FROMTED solo se conecta (selector modelos vía API proxy).

---

## Shells multiplataforma

| # | Repo | URL | Encaje FROMTED |
|---|------|-----|----------------|
| 38 | tauri-apps/tauri | https://github.com/tauri-apps/tauri | Desktop (+ mobile path) web frontend |
| 39 | amajorai/torii | https://github.com/amajorai/torii | Shell Tauri v2 + React 19 + dark theme |
| 40 | capacitor-community/tauri | https://github.com/capacitor-community/tauri | Capacitor → desktop Tauri |
| 41 | mlynch nextjs-ionic-capacitor starter | template Next+Ionic+Capacitor | iOS/Android/PWA |
| 42 | aparajita/capacitor-dark-mode | https://github.com/aparajita/capacitor-dark-mode | Dark mode Capacitor web/iOS/Android |

---

## Dark UI / chat kit / model selector

| # | Repo | URL | Encaje FROMTED |
|---|------|-----|----------------|
| 43 | shadcn/ui | https://ui.shadcn.com | Design system + dark mode Vite/Next |
| 44 | Blazity/shadcn-chatbot-kit | https://github.com/Blazity/shadcn-chatbot-kit | Chat components shadcn + tools/cancel |
| 45 | run-llama/chat-ui | https://github.com/run-llama/chat-ui | Chat UI shadcn + model selector pattern |
| 46 | assistant-ui (I1) | ya listado | Primitivas + tema shadcn CLI |
| 47 | tweakcn-theme-picker | https://github.com/BankkRoll/tweakcn-theme-picker | 40+ themes dark/light shadcn |
| 48 | Nexus UI model-selector | registry / articles | Dropdown model selector AI chat |

---

## Gaps residuales → INVESTIGACIÓN 3

1. Markdown artifact editor (MD + preview + export)
2. Tagging system + historial search UI (lupa, tags por mensaje)
3. Kanban board React (para panel automatización vista tareas)
4. Audio/voice input components web (Web Speech / dictation)
5. Confirm path OpenClaw UI source si hay repo público usable
6. Revisar Reachat (reaviz) y cualquier plugin-directory tipo marketplace UI

---

## Contador acumulado

I1: ~22 entradas  
I2: +26 entradas  
Total documentado con URL: **~48**

FIN INVESTIGACIÓN 2 — no consolidar hasta salida 4.
