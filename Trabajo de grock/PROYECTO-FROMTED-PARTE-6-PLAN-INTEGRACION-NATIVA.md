# FROMTED PARTE 6 — SALIDA 3/3: CONSOLIDACIÓN, PLAN DE INTEGRACIÓN NATIVA, TRAZABILIDAD, TAREAS

Fecha: 2026-07-28 03:40 -05  
Garantías pedidas:
1. Todo en documentos (PARTE-5 S1/S2 + esta PARTE-6).  
2. Descarga **determinista** igual agentes.  
3. Plan de integración diseñado.  
4. Trazabilidad por componente + pasos de tareas.

---

## 1. Principio de “se ve nativo”

No se abren UIs ajenas con otro look. Cada capacidad es:

- Un **PluginModule** registrado en `plugin registry` local.  
- UI chrome FROMTED (tokens, Lucide, toasts Notyf/sonner skin).  
- Entrada: botón toolbar / command palette / tool call del modelo.  
- Salida: **FromtedArtifact** o panel dock (Dockview/Golden Layout).  

```
PluginManifest {
  id, title, icon, permissions[],
  ui: { slot: 'panel'|'modal'|'artifact'|'inline' },
  runtime: 'wasm'|'native'|'api',
  entry
}
```

---

## 2. Método de descarga determinista

Igual Command Center / agentes:

1. `manifest.plugins.json` (o sección en `manifest.sources.json`):  
   `id`, `official_repository`, `commit` (o HEAD primera vez → fijar SHA), `destination_path`, `paths[]` sparse.  
2. GitHub Action: clone → sparse checkout → verify SHA → copy → `inventory.plugins.json`.  
3. No main ciego en updates.  
4. Fallo opcional → LOG NEXT; crítico → STOP.  
5. Código de producto en `src/` solo **adapta** theme + wire; no reescribe libs enteras.

---

## 3. Tiers de incorporación

### Tier A — Web/PWA (Vercel, rápido, nativo visual)

xterm.js, Dockview o Golden Layout, Lucide, hotkeys-js, Notyf/sonner, interact/DnD, getUserMedia, MediaRecorder, WebRTC share, video element, pdf.js, mermaid, leaflet, tldraw o fabric (elegir uno pizarra), mdx-editor, jsqr, cmdk, react-markdown, whisper **API o wasm ligero**, TTS API o Fish vía API.

### Tier B — Tools cloud/API (pago servicio)

Qwen Omni, FLUX, Wan 2.7, Fish Speech, ACE-Step, ComfyUI **host** (usuario o nuestro GPU service), Whisper large API.

### Tier C — Nativo app (móvil-first / desktop)

OpenCV bindings, FFmpeg, InsightFace, SAM2, GStreamer, PortAudio, WebView nativo, Playwright/Browser Use side process, yt-dlp binary, engine cerrado IP (PARTE-4).

### Explicitamente NO en este plan de plugins

Motor Obsidian+Graphify+Graphiti+OCR Baidu (otro sistema 90%).  
Router orquestador completo.  
Memoria/RAG como servicio nuestro.

---

## 4. Trazabilidad componente → source → slot UI → tarea

| id | Componente | Source URL | Slot UI | Tier | Tarea |
|----|------------|------------|---------|------|-------|
| art-shell | FromtedArtifact | propio | panel derecho / tab | A | T-40 |
| dock | Dockview | https://github.com/mathuo/dockview | layout root | A | T-20 |
| term | xterm.js | https://github.com/xtermjs/xterm.js | panel Terminal | A | T-50 |
| icons | Lucide | https://github.com/lucide-icons/lucide | global | A | T-10 |
| hotkeys | hotkeys-js | https://github.com/jaywcjlove/hotkeys-js | global | A | T-11 |
| toast | notyf/sonner | caroso1222/notyf | global | A | T-12 |
| md | mdx-editor | mdx-editor/editor | Notepad + artifact | A | T-30 |
| pdf | pdf.js | mozilla/pdf.js | artifact | A | T-31 |
| mermaid | mermaid | mermaid-js/mermaid | artifact | A | T-32 |
| map | leaflet | Leaflet/Leaflet | panel Map | A | T-51 |
| draw | tldraw | tldraw/tldraw | panel Draw | A | T-52 |
| cam | getUserMedia | estándar | CameraPanel | A | T-33 |
| mic | MediaRecorder | estándar | chat | A | T-34 |
| qr | jsQR/zxing | zxing | modal | A | T-35 |
| files | svar-filemanager | PARTE-1 | panel Files | A | T-36 |
| notepad | md-editor / propio | PARTE-1 | panel Notes | A | T-37 |
| open-codesign-ref | open-codesign | OpenCoworkAI/open-codesign | referencia UX only | A | T-05 |
| flux | FLUX API/weights | HF/black-forest | tool→artifact | B | T-60 |
| wan | Wan 2.7 | HF/vendor | tool→artifact | B | T-61 |
| fish | Fish Speech | HF/repo Fish | tool→audio | B | T-62 |
| whisper | Whisper v3 | openai/whisper o API | STT chat | B/A | T-63 |
| ace | ACE-Step | HF | tool audio | B | T-64 |
| qwen-omni | Qwen 3.5 Omni | Alibaba/HF | model registry | B | T-65 |
| comfy | ComfyUI | comfyanonymous/ComfyUI | tool host | B/C | T-66 |
| gemma-e2b | Gemma Q4_K_M GGUF | HF fix URL | app local | C | T-70 |
| browser-use | Browser Use | repo vigente | panel Browser | C | T-71 |
| playwright | Playwright | microsoft/playwright | engine | C | T-72 |
| ytdlp | yt-dlp | yt-dlp/yt-dlp | tool | C | T-73 |
| mediapipe | MediaPipe | google-ai-edge/mediapipe | vision plugins | C | T-74 |
| insightface | InsightFace | deepinsight/insightface | vision | C | T-75 |
| sam2 | SAM 2 | facebookresearch/sam2 | vision | C | T-76 |
| ffmpeg | FFmpeg | FFmpeg/FFmpeg | media native | C | T-77 |

---

## 5. Diseño de incorporación (pasos de tareas por ejecutar)

### Fase P0 — Base UI (antes plugins pesados)

| Tarea | Descripción |
|-------|-------------|
| T-01 | Repo fromted + structure sources/ src/ |
| T-02 | manifest.sources.json prioritario chat (PARTE-1) |
| T-03 | Action determinista install sources chat |
| T-04 | tokens.css dark mate naranja azul verde |
| T-05 | Auditar open-codesign (sparse clone) solo patrones layout; no fork visual clon |
| T-10 | Lucide + icon map |
| T-11 | hotkeys + command palette shell |
| T-12 | Toasts theme |
| T-20 | Dockview/Golden Layout: zonas Chat / Artifact / Tools |
| T-21 | Chat stream+stop (plan detallado previo) |
| T-22 | Deploy Vercel preview |

### Fase P1 — Artifacts y notas/archivos (UI)

| Tarea | Descripción |
|-------|-------------|
| T-30 | Notepad panel (MD) |
| T-31 | pdf.js artifact |
| T-32 | mermaid artifact |
| T-33 | CameraPanel |
| T-34 | Mic STT wire (API o wasm) |
| T-35 | QR modal |
| T-36 | Files panel (filemanager source) |
| T-37 | Ancla file id → mensaje chat |
| T-40 | FromtedArtifact host unificado |

### Fase P2 — Plugins interacción

| Tarea | Descripción |
|-------|-------------|
| T-50 | xterm panel |
| T-51 | leaflet map panel |
| T-52 | tldraw/fabric draw panel |
| T-53 | Plugin registry UI on/off |
| T-54 | Event console panel |

### Fase P3 — Generative tools (API)

| Tarea | Descripción |
|-------|-------------|
| T-60…T-66 | Wire tools FLUX/Wan/Fish/Whisper/ACE/Qwen/Comfy a artifact; botones nativos; env keys |
| T-67 | Tool picker en chat (el modelo o el usuario elige) |

### Fase P4 — Nativo / mobile

| Tarea | Descripción |
|-------|-------------|
| T-70…T-77 | GGUF, Browser Use, Playwright, yt-dlp, visión pesada, FFmpeg |
| T-80 | IP engine cerrado (PARTE-4) en paralelo release |

---

## 6. Mejoras aplicadas a las listas del usuario

1. **Un solo Artifact shell** en lugar de ventanas sueltas por modelo.  
2. **Plugin registry** para que 50+ funciones no saturen la toolbar (command palette + categorías).  
3. **Tier A primero** en Vercel para ver interfaz real sin GPU.  
4. **Open CoDesign = referencia**, no skin clon; identidad FROMTED.  
5. **WebView/Browser** como panel dock, no app externa.  
6. **Tokens obligatorios** en todo plugin (checklist PR).  
7. **Deterministic inventory** evita “npm random latest” en CI.  
8. Separar **tool cloud** de **panel UI** para no mezclar ComfyUI server dentro del bundle web.

---

## 7. Manifest mínimo a crear (siguiente acción de código)

Archivo: `fromted/manifest.plugins.json` (Tier A primero)

Entradas iniciales: dockview, xterm.js, lucide, hotkeys-js, mdx-editor, pdf.js, mermaid, leaflet, tldraw, svar-filemanager (o del catálogo PARTE-1), open-codesign (paths docs/ui only).

SHA se fija en primer RUN INSTALL.

---

## 8. Checklist garantías

| # | Garantía | Evidencia |
|---|----------|-----------|
| 1 | Todo documentado | PARTE-5 S1, PARTE-5 S2, PARTE-6 |
| 2 | Download determinista | §2 y §7 este doc |
| 3 | Plan integración | §1, §3, §5 |
| 4 | Trazabilidad + tareas | §4 tabla id→URL→slot→T-xx |

---

FIN SALIDA 3/3 — consolidación lista para ejecución cuando se ordene T-01.
