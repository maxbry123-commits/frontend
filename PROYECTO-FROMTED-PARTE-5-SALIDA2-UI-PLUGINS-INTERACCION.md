# FROMTED PARTE 5 — SALIDA 2/3: PLUGINS UI, INTERACCIÓN, PRODUCTIVIDAD LIGERA

Fecha: 2026-07-28 03:40 -05  
Excluido explícitamente de esta lista como *sistemas*: documentos RAG, flujos, automatización motor, agentes kernel, memoria Runtime, editores de documentos pesados.  
Incluido: módulos que mejoran la **interfaz** y se ven nativos.

---

## 1. Funciones 26–50+ (interfaz / dispositivos / layout)

| # | Función | Proyecto | URL | Cómo se ve nativo en FROMTED |
|---|---------|----------|-----|------------------------------|
| 26 | Terminal embebida | xterm.js | https://github.com/xtermjs/xterm.js | Panel “Terminal” theme dark matte |
| 27 | Navegador embebido | WebView / iframe controlado | plataforma | Panel Browser; chrome UI propia |
| 28 | Screenshot | html2canvas / FFmpeg desktop | FFmpeg repo | Acción toolbar |
| 29 | Screen share | WebRTC | estándar | Botón nativo chat/toolbar |
| 30 | Webcam | getUserMedia | — | CameraPanel |
| 31 | Grabar webcam | MediaRecorder | — | |
| 32 | Mic | MediaRecorder / PortAudio | https://github.com/PortAudio/portaudio | |
| 33 | Player media | video.js / libVLC | VLC repo | Artifact player |
| 34 | Stream | GStreamer | https://github.com/GStreamer/gstreamer | Desktop |
| 35–36 | QR/Barras | ZXing / jsQR | https://github.com/zxing/zxing | Modal scanner |
| 37 | Drag & drop | interact.js / HTML5 DnD | https://github.com/taye/interact.js | Drop zones chat/files |
| 38 | Ventanas acoplables | Golden Layout | https://github.com/golden-layout/golden-layout | Layout paneles FROMTED |
| 39 | Pestañas tipo IDE | Dockview | https://github.com/mathuo/dockview | Tabs chat/artifact/terminal |
| 40 | Temas | DaisyUI / tokens propios | DaisyUI | Preferir **tokens FROMTED** no Daisy skin genérico |
| 41 | Iconos | Lucide | https://github.com/lucide-icons/lucide | Icon set único |
| 42 | Toasts | Notyf / sonner | https://github.com/caroso1222/notyf | Verde éxito / naranja carga |
| 43 | Hotkeys | hotkeys-js | https://github.com/jaywcjlove/hotkeys-js | ⌘K command palette |
| 44 | Gamepad | Gamepad API | estándar | |
| 45 | Joystick | SDL2 | https://github.com/libsdl-org/SDL | Nativo |
| 46 | Bluetooth | Web Bluetooth | estándar | Settings devices |
| 47 | USB | WebUSB | estándar | |
| 48 | Serial | Web Serial | estándar | |
| 49 | HID | WebHID | estándar | |
| 50 | NFC | Web NFC | estándar | Móvil |

### Extensiones adicionales (input usuario)

| Función | Proyecto | URL / tech | UI nativa |
|---------|----------|------------|-----------|
| Grid widgets | GridStack.js | https://github.com/gridstack/gridstack.js | Panel widgets |
| Pizarra infinita | tldraw | https://github.com/tldraw/tldraw | Panel Draw (no Obsidian) |
| Canvas editable | Fabric.js | https://github.com/fabricjs/fabric.js | Lienzo agente |
| Timeline | vis-timeline | https://github.com/visjs/vis-timeline | |
| Mapas | Leaflet | https://github.com/Leaflet/Leaflet | Panel Map |
| Mapas GL | MapLibre GL | https://github.com/maplibre/maplibre-gl-js | |
| Geocode | Nominatim OSM | https://nominatim.org | |
| Rutas | GraphHopper | https://github.com/graphhopper/graphhopper | |
| Diagramas | Mermaid | https://github.com/mermaid-js/mermaid | Artifact diagram |
| Markdown render | markdown-it / react-markdown | ya en chat | |
| PDF view | pdf.js | https://github.com/mozilla/pdf.js | Artifact PDF |
| Command palette | cmdk / kbar | patrón shadcn | Centro comandos |
| Diff visual | diff2html / monaco diff | | Artifact diff |
| Event console | panel propio | | Debug eventos UI |

---

## 2. Capacidades “tipo Claude artifacts” en UI

Sin ser el motor de automatización:

- Vista dividida chat | resultado  
- Pestañas de trabajo (Dockview)  
- Historial de acciones (lista local)  
- Diff visual  
- Panel plugins on/off (registry local de módulos)  
- Consola de eventos  
- Command palette  
- Panel recursos (cámara, mapas, música, imágenes)

Todo skinneado con tokens: bg mate, acentos naranja/azul/verde.

---

## 3. Markdown / PDF / Artifact (solo capa UI)

| Capacidad | Source | Notas |
|-----------|--------|-------|
| MD preview/edit ligero | mdx-editor / md-editor-rt (PARTE-1) | Bloc notas panel |
| PDF | pdf.js | Ver/export lado cliente |
| Artifact shell | componente propio FromtedArtifact | Host de imagen/video/md/pdf/html |

No sustituye sistema de documentos enterprise.

---

## 4. Buscadores web editables

| Enfoque | Implementación |
|---------|----------------|
| Barra búsqueda UI | Input nativo + provider configurable (URL template) |
| Providers | DuckDuckGo HTML/API, SearxNG self-host **del usuario**, Google CSE si él pone key |
| Agente browse | Browser Use + Playwright (engine); UI WebView + log pasos |

Editable = el usuario cambia endpoint/provider en Settings; no hardcode un único buscador cerrado.

---

FIN SALIDA 2/3.
