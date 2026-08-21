# PROYECTO FROMTED — PARTE 7 COMPLETA
## Razonamiento · Investigación punto a punto · Plan de diseño · Plan de integración

Fecha: 2026-07-28 16:15 -05  
Estado: DOCUMENTO COMPLETO (no resumen)  
Regla: input blocks leídos literales; cada punto del usuario tiene sección propia; método de trabajo aplicado.

---

# BLOQUE 0 — SISTEMA DE RAZONAMIENTO (método de trabajo usuario)

## 0.1 Lectura obligatoria antes de cada fase
1. TAREAS-EN-CURSO.md  
2. BITACORA-RESUMEN.md  
3. LEY-CUADERNO.md  
4. PROYECTO-FROMTED.md + PARTES 1–6 + este documento  

## 0.2 Cadena de pasos aplicada a este documento

**Paso R1 — Auditoría del input**  
Se listó cada requisito del mensaje del usuario (paleta, i18n, control agente UI, teléfono, WhatsApp/Telegram/Gmail/dispositivo, YouTube mini, buscador tipo Perplexity OS, nativo visual, paralelo 20, cola RAM, ventana Paralelas, dual local/web PWA, storage, APIs externas, 4 variantes color, research, plan programación, plan integración).  
Nada se omite en las secciones siguientes.

**Paso R2 — Metas de diseño (6)**  
1. Paleta warm charcoal + temas configurables.  
2. i18n en-US, es-US, fr, pt.  
3. UICommand bus: agente controla 100% tools/paneles por chat o voz.  
4. Comms + YouTube + search OS con chrome FROMTED (nunca UI ajena visible como producto externo).  
5. TaskManager paralelo ≤20 + cola + panel Paralelas.  
6. Misma UI LocalAdapter | CloudAdapter (PWA).

**Paso R3 — Refutación / riesgos**  
- WhatsApp no tiene API OS oficial estable: riesgo ToS si Baileys; preferir Cloud API Meta o bridge documentado.  
- YouTube: solo IFrame API (ToS); no yt-dlp para reproducir dentro del player oficial.  
- 20 tareas en móvil: sin Resource Governor satura RAM → cola obligatoria.  
- Fondo #000 y texto #FFF rechazados por usuario → tokens warm obligatorios.

**Paso R4 — Consejo de fuentes**  
Perplexica + SearxNG + Morphic; Telnyx/Twilio WebRTC; Telegram Bot API; Evolution API/WAHA/Baileys (WhatsApp); Gmail API; YouTube IFrame API; i18next; OpenClaw channels.

**Paso R5 — Salida**  
Este documento = investigación completa + plan diseño + plan integración + índice de tareas numeradas + manifest download determinista.

---

# BLOQUE 1 — INPUT LITERAL: PALETA Y TEMAS

## 1.1 Problema
Los HTML previos usaban negro puro (#0d0d0d / #000) y blanco puro. El usuario exige gris carbón cálido (matiz marrón/oliva) y texto tipo papel.

## 1.2 Especificación de color (obligatoria)

| Elemento | Hex | Descripción usuario |
|----------|-----|---------------------|
| Fondo principal | `#1A1A19` a `#1E1D1B` | Warm charcoal / dark taupe / antracita cálido |
| Superficie / elev | `#252422` | Cards, sheets |
| Borde | `#2E2D2A` | |
| Texto principal (títulos y párrafos default) | `#BCBCB0` | Gris claro cálido, papel envejecido |
| Texto secundario | `#A8A59C` | Más apagado |
| Variantes texto cercanas | `#C3C1B8`, `#BDB8AE`, `#C8C4BA` | Permitidas en config |
| Naranja | `#ff6b1a` | Solo textos Cargar / Descargar / Agregar |
| Azul eléctrico | `#2f6bff` | Títulos seleccionados, toggles on, focus |
| Verde | `#22c55e` | Letras de notificación / status |

## 1.3 Temas que la UI DEBE poder cambiar
1. Dark warm (default) — fondo `#1A1A19`, texto `#BCBCB0`  
2. Gray warm — fondo más claro tipo `#2A2926`  
3. Light — fondo `#F3F1EA`, texto oscuro `#3D3C38`  
4. (Opcional) blanco puro de accesibilidad  

## 1.4 Cuatro variantes de color de título (config)
| Variante | Color título | Uso |
|----------|--------------|-----|
| T1 | `#BCBCB0` | Default cálido |
| T2 | `#2f6bff` | Azul eléctrico |
| T3 | `#22c55e` | Verde notificación |
| T4 | `#C8C4BA` / blanco suave en light | Tema claro |

Letras del chat (input/salida): configurables en hasta 5 colores; default 2 tonos grises cálidos (`#BCBCB0` / `#A8A59C`).

## 1.5 Artefactos HTML de las 4 variantes
- `fromted-design/v3-var1-warm-default.html`  
- `fromted-design/v3-var2-title-blue.html`  
- `fromted-design/v3-var3-title-green.html`  
- `fromted-design/v3-var4-light.html`  

Implementación código: CSS variables en `:root` + `data-theme` + `data-title-color`.

---

# BLOQUE 2 — INPUT LITERAL: i18n (4 IDIOMAS MÍNIMO)

## 2.1 Idiomas obligatorios
| Code | Nombre |
|------|--------|
| `en-US` | English (United States) |
| `es-US` | Español (Estados Unidos) |
| `fr` | Français |
| `pt` | Português |

## 2.2 Cómo se programa
- Librería: `i18next` + `react-i18next` (o `lingui`).  
- Archivos: `locales/en-US.json`, `es-US.json`, `fr.json`, `pt.json`.  
- Ningún string de UI hardcodeado en JSX.  
- Selector de idioma en Panel Configuración; persistencia LocalAdapter o CloudAdapter.  
- El agente puede emitir `UICommand { action: 'locale.set', payload: { locale: 'fr' } }`.

## 2.3 Source download
- https://github.com/i18next/i18next  
- https://github.com/i18next/react-i18next  

---

# BLOQUE 3 — INPUT LITERAL: AGENTE CON CONTROL TOTAL DE LA UI

## 3.1 Requisito
El agente (OpenClaw mejorado) debe poder activar cualquier herramienta de la UI por input de chat o de voz, sin que el usuario toque cada toggle manualmente.

## 3.2 Diseño: UICommand bus

```
Usuario texto | Voz (STT)
       │
       ▼
OpenClaw Agent (decide tool / panel)
       │
       ▼
UICommand {
  action: string,
  payload: object,
  source: 'chat' | 'voice' | 'user-tap',
  taskId?: string
}
       │
       ▼
UICommandRouter (en la UI)
       │
       ├── tool.enable / tool.disable
       ├── panel.open / panel.close
       ├── task.start / task.cancel
       ├── theme.set / locale.set
       ├── youtube.play
       ├── search.run
       ├── call.start
       └── ...
```

## 3.3 Capacidades que el agente puede activar (mínimo)
Todas las del sheet Capacidades / Herramientas / Agregar al chat: búsqueda web, artefactos, ejecución de código, cámara, fotos, archivos, investigación, conectores, paralelismo, YouTube, teléfono, canales mensajería.

## 3.4 Voz
STT (Whisper API o wasm) → mismo pipeline que texto → UICommand.  
TTS (Fish / API) para respuesta hablada opcional.

---

# BLOQUE 4 — INVESTIGACIÓN COMPLETA: COMUNICACIONES

## 4.1 Llamada de teléfono

### Qué se investigó
- Telnyx WebRTC SDK: https://github.com/team-telnyx/webrtc — MIT, JS/React, llamadas in/out en navegador.  
- Documentación: Make a call to a web browser (Telnyx).  
- Alternativa: Twilio Voice JS SDK (servicio de pago, maduro).

### Cómo se integra en FROMTED (nativo)
- Panel `CallPanel` con chrome FROMTED (warm charcoal, botones neutros, status verde).  
- Tool del agente: `call.start({ to: '+1...' })` → UICommand → TelnyxRTC.  
- No se abre la app Telnyx; el usuario solo ve FROMTED.

### Limitantes
Requiere cuenta Telnyx/Twilio y números. En modo local puro sin backend, solo `tel:` link (abre marcador del SO) como fallback.

---

## 4.2 WhatsApp, Telegram, dispositivo, Gmail

### Telegram
- API oficial Bot API (Tier 1, ToS-compliant).  
- OpenClaw ya documenta canales Telegram/WhatsApp en ecosistema 2026.  
- MCP / bridges: mcp-telegram, bots Claude-Telegram.  
- Integración: tool `telegram.send` / `telegram.read` → log en panel Conectores FROMTED.

### WhatsApp
| Opción | URL / stack | Riesgo |
|--------|-------------|--------|
| Meta Cloud API | oficial | Bajo (ToS ok), requiere Business |
| Evolution API | ecosistema Baileys | Alto self-host, ToS gris |
| WAHA | https://github.com/devlikeapro/waha | Self-host multi-engine |
| Baileys | protocolo multi-device | No oficial |
| whatsapp-mcp (lharries) | MCP local | Personal account |

**Decisión de diseño FROMTED:**  
1) Preferir **WhatsApp Cloud API** cuando el usuario aporta credenciales.  
2) Opcional self-host Evolution/WAHA en VPS del usuario (no nuestro).  
3) UI solo muestra panel “Canal WhatsApp” nativo; nunca el dashboard Evolution como producto visible.

### Gmail
- Gmail API + OAuth2.  
- Tool `gmail.send` / `gmail.list`.  
- Tokens en LocalAdapter (device) o CloudAdapter (servidor usuario).

### Dispositivo
- Web Share API, file pickers, `tel:`, notificaciones Push (PWA).  
- En app nativa: intents Android / share sheet iOS.

### OpenClaw
- OpenClaw como agente mejorado ya orientado a WhatsApp/Telegram/email/browser.  
- FROMTED no reimplementa el kernel: conecta OpenClaw vía API/MCP/lib y pinta resultados en chrome propio.  
- Existe skill `perplexica-search` para OpenClaw: https://github.com/eplt/perplexica-search

---

## 4.3 Mini ventana YouTube dentro de la UI

### Investigación
- YouTube IFrame Player API (oficial Google): play/pause/load por JS.  
- Requisitos: viewport ≥200px; preferible 480×270 16:9.  
- ToS: no extraer audio fuera del player; no noreferrer que oculte Referer.

### Diseño FROMTED
- `YoutubePanel` dock (Dockview): iframe + controles FROMTED (cerrar, anclar al chat).  
- Agente: busca (Data API o tool search) → propone videoId en chat → `UICommand youtube.play` → panel sin salir del chat.  
- yt-dlp solo para **metadata** en backend tool del usuario, no para saltarse el player embebido.

---

## 4.4 Buscador tipo Perplexity open source

| Proyecto | URL | Licencia | Rol |
|----------|-----|----------|-----|
| **Perplexica** | https://github.com/ItzCrazyKns/Perplexica | MIT | Motor AI search self-host + SearxNG; 31k+ stars |
| **Morphic** | https://github.com/miurla/morphic | Apache-2.0 | AI search + generative UI |
| **SearxNG** | https://github.com/searxng/searxng | AGPL | Metasearch base |
| perplexica-mcp | https://github.com/thetom42/perplexica-mcp | — | MCP tool search |
| perplexica-search (OpenClaw skill) | https://github.com/eplt/perplexica-search | MIT | Puente OpenClaw → Perplexica local |

### Decisión de integración
1. **Backend search (fuera del bundle UI):** Perplexica (Docker) o Morphic en VPS/usuario.  
2. **UI:** resultados y citas en Artifact / mensaje chat con skin FROMTED.  
3. **Agente:** tool `search.web` → Perplexica API/MCP.  
4. Nunca mostrar la UI web de Perplexica como pantalla principal; solo datos.

---

## 4.5 Regla de natividad (input usuario)
> Todas las funciones/programas Open Source deben correr como si fueran nativos de la UI; en ningún momento se debe mostrar el programa/sistema externo que estamos usando.

Aplicación: iframes skinneados o headless tools; branding FROMTED; tokens warm; sin logos de terceros en chrome principal.

---

# BLOQUE 5 — INPUT LITERAL: PARALELISMO HASTA 20 TAREAS

## 5.1 Requisitos exactos
- Hasta **20** tareas de cualquier función del chat al mismo tiempo.  
- Si satura RAM de smartphone o PC → **cola**, no crash.  
- No hace falta terminar una para empezar otra (salvo límite de presupuesto).  
- Ventana **Paralelas**: lista de tareas en curso del chat y de automatización.  
- Cada tarea = ventana que se puede abrir, ver, cambiar, desplegar, ocultar **sin salir del chat**.  
- Resultados también en el chat; compartir / descargar / exportar cuando aplique.

## 5.2 Diseño TaskManager

```
TaskManager {
  maxConcurrent: number  // default min(20, detectBudget())
  running: Map<taskId, Task>
  queue: Task[]
  start(spec) → taskId
  cancel(taskId)
  onComplete → postToChat + updateParallelPanel
}

Task {
  id, title, type, status: queued|running|done|failed
  progress?, resultRef?, windowState: collapsed|expanded
}
```

Resource Governor (PARTE-4): lee `navigator.deviceMemory` / performance; baja maxConcurrent en móviles low-end.

## 5.3 UI Paralelas
- Drawer o tabs laterales.  
- Card por tarea (icono línea, título, status).  
- Tap → expande panel de detalle (log, preview, Descargar naranja si export).  
- Mismo TaskManager usado por automatización futura.

## 5.4 Programación
- Web: pool de async + Workers para CPU-heavy (Pyodide, etc.).  
- Nativo: isolates / background processes.  
- Cada tool del agente que sea larga llama `task.start` en lugar de bloquear el hilo del chat.

---

# BLOQUE 6 — INPUT LITERAL: UI LOCAL Y UI WEB AVANZADA

## 6.1 Modelo mental del usuario
Misma interfaz. Cambia el **origen de servicios**.

```
Navegador / PWA
      │
Frontend FROMTED (un solo código)
      │
ServiceAdapter
      ├── LocalAdapter
      │     IndexedDB · Cache Storage · localStorage · OPFS
      │     tools locales · API keys del usuario · opcional modelo on-device
      └── CloudAdapter
            HTTPS · WebSocket / SSE
            Backend sesión · auth · object storage · orquestador
```

## 6.2 Web avanzada (cuando hay backend)
- Estado de sesión en servidor.  
- Auth contra backend.  
- Funciones UI llaman APIs.  
- Archivos en storage remoto.  
- Config desde DB.  
- Stream agente por WebSocket o SSE.  
- Sesión aislada por usuario.  
- AI = **servicio API externa** (no modelos locales obligatorios en este modo).  
- Infra orientativa: 16–32 vCPU, 64–128 GB RAM, NVMe, ≥1 Gbps (backend, no la UI).

## 6.3 Local / PWA
- Se ejecuta en Windows, Linux, macOS, Android, iOS/iPadOS.  
- Storage: IndexedDB, Cache Storage, localStorage, OPFS.  
- Guarda: config UI, caché, preferencias, historial local, parte de memoria app.  
- Installable PWA.  
- AI sigue pudiendo ser API externa con keys del usuario.

## 6.4 Diseño de programación
```ts
interface ChatPort { send(messages): AsyncIterable<token>; abort() }
interface FilePort { read; write; list; delete }
interface SettingsPort { get; set }
// LocalChatPort | CloudChatPort implementan ChatPort
```
Feature flag `FROMTED_MODE=local|cloud` en build o runtime Settings.

---

# BLOQUE 7 — PLAN DE DISEÑO (CONFIRMADO)

## 7.1 Principios
1. Tokens warm charcoal obligatorios; temas conmutables.  
2. Iconos línea 2D monocromo (Lucide).  
3. Botones sin relleno de color de marca; naranja solo en labels Cargar/Descargar/Agregar.  
4. Selección = letras o borde azul, no botones azules rellenos (salvo toggle track).  
5. Paneles alineados a fotos Claude / MiniMax / Apple Files / Grok mode (ya en p01–p10).  
6. Todo tool OS → chrome FROMTED.  
7. Agente manda UICommand; UI no es solo display pasivo.

## 7.2 Mapa de pantallas de diseño (existentes + nuevas)
| ID | Pantalla | Estado |
|----|----------|--------|
| p01 | Chat MiniMax-style | HTML hecho → retintar warm |
| p02 | Docs móvil | retintar warm |
| p03 | Docs iPad | retintar warm |
| p04 | Sheet Agregar | retintar |
| p05 | Sheet Herramientas | retintar |
| p06 | Proyecto conocimiento | retintar |
| p07 | Sidebar | retintar |
| p08 | Lista artefactos | retintar |
| p09 | Mode dropdown | retintar |
| p10 | Conocimiento empty | retintar |
| p11 | Capacidades toggles | nuevo (foto Capacidades) |
| p12 | Paralelas drawer | nuevo |
| p13 | YoutubePanel | nuevo |
| p14 | CallPanel | nuevo |
| p15 | Conectores (TG/WA/Gmail) | nuevo |
| p16 | Search results artifact | nuevo |
| v3-1..4 | Temas título/fondo | hechos |

## 7.3 Confirmación plan de diseño
**CONFIRMADO:** diseño visual = paneles p01–p16 + tokens PARTE 7 + fotos usuario; no se rediseña desde cero; se retinta y se añaden p11–p16.

---

# BLOQUE 8 — PLAN DE INTEGRACIÓN (CONFIRMADO)

## 8.1 Método download determinista (igual agentes)
1. Escribir `fromted/manifest.sources.json` con url + commit/branch + paths sparse.  
2. GitHub Action: clone → checkout SHA → copy → `inventory.json`.  
3. Fallo opcional LOG NEXT; crítico STOP.  
4. Código producto solo adapta theme + wire.

### Manifest prioritario (primera oleada)
| id | official_repository |
|----|---------------------|
| assistant-ui | https://github.com/assistant-ui/assistant-ui |
| dockview | https://github.com/mathuo/dockview |
| i18next | https://github.com/i18next/i18next |
| react-i18next | https://github.com/i18next/react-i18next |
| lucide | https://github.com/lucide-icons/lucide |
| perplexica (ref backend) | https://github.com/ItzCrazyKns/Perplexica |
| searxng (ref) | https://github.com/searxng/searxng |
| morphic (ref UI patterns) | https://github.com/miurla/morphic |
| telnyx-webrtc | https://github.com/team-telnyx/webrtc |

## 8.2 Fases de integración numeradas

### Fase I0 — Repo y tokens (tareas 1–15)
1. Crear estructura fromted/  
2. manifest.sources.json oleada 1  
3. Action determinista install  
4. inventory.json  
5. tokens.css warm + data-theme  
6. ThemeSwitcher 4 variantes  
7. i18n 4 locales skeleton  
8. App shell layout  
9. Checkpoint visual Vercel  
10–15. Documentar en bitácora / tareas en curso  

### Fase I1 — Chat + command bus (16–40)
16–25. Chat stream stop history (assistant-ui)  
26–30. UICommandRouter + tipos  
31–35. Capacidades sheet (toggles) cableado a commands  
36–40. STT stub → command  

### Fase I2 — Paneles files/artifact/parallel (41–70)
41–50. Files mobile + iPad  
51–55. Artifact host  
56–65. TaskManager + panel Paralelas  
66–70. Resource Governor básico  

### Fase I3 — Tools externos (71–100)
71–75. YoutubePanel IFrame API  
76–80. search tool → Perplexica/MCP  
81–85. Telegram tool  
86–90. Gmail OAuth tool  
91–95. WhatsApp Cloud tool (credenciales user)  
96–100. CallPanel Telnyx stub  

### Fase I4 — Dual adapters (101–120)
101–110. LocalAdapter IDB/OPFS  
111–120. CloudAdapter WS/SSE + auth  

### Fase I5 — OpenClaw wire (121–140)
121–140. Agente OpenClaw emite UICommand; skill perplexica-search opcional  

## 8.3 Confirmación plan de integración
**CONFIRMADO:** integración = download OS determinista + fases I0–I5 + UICommand + TaskManager + ServiceAdapter dual. No se mezcla kernel OpenClaw/Perplexica dentro del bundle UI; solo clientes y paneles.

---

# BLOQUE 9 — ÍNDICE RÁPIDO DE CUMPLIMIENTO DEL INPUT

| # | Punto del usuario | Sección este doc |
|---|-------------------|------------------|
| 1 | Paleta warm / no negro puro | §1 |
| 2 | Letras título configurables 4 variantes | §1.4 + HTML v3 |
| 3 | Fondo blanco/negro/gris | §1.3 |
| 4 | Chat letras configurables | §1.4 |
| 5 | 4 idiomas | §2 |
| 6 | Agente control total UI chat/voz | §3 |
| 7 | Teléfono | §4.1 |
| 8 | WhatsApp Telegram Gmail dispositivo | §4.2 |
| 9 | YouTube mini en UI | §4.3 |
| 10 | Perplexity-like OS | §4.4 |
| 11 | Nativo sin mostrar sistema externo | §4.5 |
| 12 | Paralelo 20 + cola + ventanas | §5 |
| 13 | Local + Web PWA misma UI | §6 |
| 14 | Storage IDB/OPFS/Cache | §6.3 |
| 15 | AI por API externa en web | §6.2 |
| 16 | 4 variantes UI | §1.5 |
| 17 | Investigación ejecutada | §4 |
| 18 | Plan diseño confirmado | §7 |
| 19 | Plan integración confirmado | §8 |
| 20 | Download code OS determinista | §8.1 |
| 21 | Razonamiento método trabajo | §0 |

---

# BLOQUE 10 — PRÓXIMA ACCIÓN

Cuando el usuario ordene **INICIA T-01 / I0**:  
crear repo estructura + manifest + tokens warm + i18n skeleton + Action determinista.

Hasta entonces este documento es la fuente de verdad de PARTE 7 completa.

FIN — PARTE 7 COMPLETA SIN RESUMEN OMISIVO
