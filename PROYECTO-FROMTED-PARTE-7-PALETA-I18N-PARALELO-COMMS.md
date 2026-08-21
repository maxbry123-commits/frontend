# FROMTED PARTE 7 — Paleta, i18n, paralelo, comunicaciones, dual local/web

Fecha: 2026-07-28  
Estado: PLAN + INVESTIGACIÓN (post-aprobación HTML p01–p10 con correcciones)

---

## 1. PALETA CORREGIDA (input usuario)

| Elemento | Valor | Nota |
|----------|-------|------|
| Fondo principal | `#1A1A19` – `#1E1D1B` | Warm charcoal / antracita cálido — **no** #000 |
| Superficie | `#252422` | elev |
| Texto principal | `#BCBCB0` | papel envejecido — **no** #FFF |
| Texto secundario | `#A8A59C` | |
| Naranja acciones | `#ff6b1a` | solo Cargar/Descargar/Agregar textos |
| Azul selección/título opcional | `#2f6bff` | letras, toggles on |
| Verde status | `#22c55e` | notificaciones |

**Temas configurables UI:** dark warm (default) · gray warm · light (`#F3F1EA`) · títulos: gris cálido | azul | verde | (config).

**4 variantes HTML:** `fromted-design/v3-var1` … `v3-var4` (artifacts).

---

## 2. i18n mínimo (4 idiomas)

| Code | Idioma |
|------|--------|
| en-US | English (US) |
| es-US | Español (US) |
| fr | Français |
| pt | Português |

Implementación: `i18next` o `lingui` + JSON por locale; selector en Settings; sin hardcode strings en componentes.

Sources candidatos: `i18next/i18next`, `formatjs/react-intl`.

---

## 3. CONTROL TOTAL UI POR AGENTE (OpenClaw mejorado)

El agente debe poder, por texto o voz:

- Activar/desactivar tools (capacidades sheet)
- Abrir paneles (files, artifact, parallel tasks)
- Lanzar tasks paralelas
- Cambiar tema / idioma

**Contrato UI command bus (nativo):**

```
UICommand {
  action: 'tool.enable' | 'panel.open' | 'task.start' | 'theme.set' | 'locale.set' | ...
  payload: object
  source: 'chat' | 'voice' | 'user'
}
```

Chat input y STT emiten el mismo bus. OpenClaw (lib) no pinta UI: emite comandos; la UI los ejecuta.

---

## 4. INVESTIGACIÓN — COMMS / YOUTUBE / SEARCH (OS, aspecto nativo)

### 4.1 Llamadas telefónicas
| Enfoque | Tech | Nota |
|---------|------|------|
| Web | WebRTC + Twilio/Telnyx Voice API | UI panel Call nativo |
| Móvil nativo | `tel:` / ConnectionService (Android) / CallKit (iOS) | shell nativo después |
| OS UI | botones/sheet estilo Claude tools | no abrir app ajena con otro skin |

### 4.2 WhatsApp / Telegram / Gmail / dispositivo
| Canal | OS / API | Integración |
|-------|----------|-------------|
| Telegram | Bot API / MTProto libs | tool agent → mensajes; UI log nativo |
| WhatsApp | WhatsApp Cloud API (Meta) | no hay WA OS completo libre estable; Cloud API |
| Gmail | Gmail API OAuth | tool send/read |
| SMS/device | Web Share / platform intents | |

Todo como **tools** del agente + paneles FROMTED (no UIs oficiales embebidas con branding ajeno).

### 4.3 Mini YouTube en UI
| Tech | Uso |
|------|-----|
| YouTube IFrame Player API | panel dock `YoutubePanel` |
| yt-dlp (ya en PARTE-5) | metadata/search side process |
| Búsqueda | Data API o scrap metadata vía backend tool |

El agente busca → lista resultados en chat → user/agent elige → reproduce **dentro** del panel (no salir del chat).

### 4.4 Buscador tipo Perplexity OS
| Proyecto | URL | Nota |
|----------|-----|------|
| Perplexica | https://github.com/ItzCrazyKns/Perplexica | OS AI search, self-host |
| SearxNG | https://github.com/searxng/searxng | metasearch |
| Morphic | https://github.com/miurla/morphic | AI search UI |
| Open Perplex | variantes HF/GitHub | evaluar licencia |

**Recomendación FROMTED:** Perplexica o Morphic como **backend search tool**; UI solo muestra citas/resultados en artifact nativo.

Regla: ningún sistema se muestra como “app externa”; chrome siempre FROMTED.

---

## 5. PARALELISMO HASTA 20 TAREAS

```
TaskManager
  maxConcurrent: min(20, resourceBudget)
  queue: FIFO cuando RAM/CPU alto
  each task → TaskWindow { id, title, status, resultRef }
```

**UI:**
- Panel **Paralelas** (drawer/tabs)
- Botón por tarea en curso → expand/collapse sin salir del chat
- Resultados también en el hilo (share / Descargar / export)
- Mismo sistema alimenta automatización (más adelante)

Programación: Web Workers / pool en web; isolates/threads en app nativa; Resource Governor (PARTE-4) decide queue vs run.

---

## 6. DUAL LOCAL + WEB (misma UI)

```
Navegador / PWA
    │
Frontend FROMTED (mismo código)
    │
ServiceAdapter
    ├── LocalAdapter  (IndexedDB, OPFS, llama local opcional, tools locales)
    └── CloudAdapter  (HTTPS, WebSocket/SSE, backend, object storage)
```

| Capacidad | Local | Web avanzada |
|---|---|---|
| Chat stream | API keys user / local model | Backend + WS/SSE |
| Archivos | OPFS / IndexedDB | Object storage remoto |
| Auth | device profile | backend session |
| AI | API externa (siempre servicio) | mismo, vía backend |
| Config | localStorage/IDB | DB usuario |

**Infra orientativa web (usuario):** 16–32 vCPU, 64–128 GB RAM, NVMe, 1 Gbps — backend orquestador, no la UI.

PWA: installable Android/iOS/desktop; Cache Storage + offline shell.

---

## 7. PLAN DE PROGRAMACIÓN E INTEGRACIÓN (download OS primero)

### Fase A — Shell + tema + i18n (días 1–2)
1. Repo `fromted` + Vite/React/TS  
2. CSS tokens warm charcoal + theme switcher (4 variantes)  
3. i18n en-US, es-US, fr, pt  
4. Chat stream + stop (sources assistant-ui)  
5. Deploy Vercel PWA preview  

### Fase B — Paneles nativos (días 2–4)
6. Files mobile + iPad layout  
7. Sheets: Agregar, Herramientas, Capacidades (toggles)  
8. Artifact host + lista  
9. Parallel Tasks panel (UI mock → TaskManager real)  
10. Command bus UICommand  

### Fase C — Tools agente (días 4–7)
11. Wire OpenClaw lib → UICommand  
12. YouTube panel (IFrame API)  
13. Search tool → Perplexica/SearxNG (self-host o user)  
14. Telegram bot tool; Gmail OAuth tool; WhatsApp Cloud (si credenciales)  
15. Call panel stub (WebRTC/Telnyx)  

### Fase D — Dual adapters
16. LocalAdapter OPFS/IDB  
17. CloudAdapter WS + auth  
18. Feature flags same UI  

### Download determinista (igual agentes)
`manifest.sources.json` + Action sparse → `fromted/sources/` + inventory.  
Prioridad: assistant-ui, dockview, i18next, youtube iframe types, perplexica (ref), searxng (ref).

---

## 8. TRAZABILIDAD NUEVAS FUNCIÓNES → UI

| Función | Panel / mecanismo | Nativo |
|---|---|---|
| Teléfono | CallPanel + tool | sí chrome FROMTED |
| WhatsApp/TG/Gmail | tools + log panel | sí |
| YouTube mini | YoutubePanel dock | iframe skinneado |
| Search Perplexity-like | artifact citas + tool | Perplexica/Searx backend |
| Parallel 20 | Paralelas drawer | TaskManager |
| Agent control UI | UICommand bus | chat/voz |
| i18n 4 | Settings | i18next |
| Theme 4 | Settings | CSS vars |

---

## 9. CHECKLIST