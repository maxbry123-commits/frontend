# FROMTED PARTE 5 — SALIDA 1/3: MULTIMEDIA, VISIÓN, AUDIO, MODELOS MULTIMODALES

Fecha: 2026-07-28 03:40 -05  
Método descarga: **determinista** (mismo que agentes: manifest url+commit+paths → sparse → inventory.json)  
Fuera de alcance de este bloque: motor Obsidian/Graphify/Graphiti/OCR Baidu (sistema 90% aparte, luego). Router avanzado y docs RAG/memoria: pendiente.  
Incluye: funciones de panel/chat, audio, fotos, video, markdown/PDF/artifact como **capacidades de UI**.

---

## 1. Pipeline multimodal conversacional (input usuario)

| Función | Modelo / stack | Rol en FROMTED UI |
|---------|----------------|-------------------|
| Agente conversacional multimodal | Qwen 3.5 Omni (API/local según deploy) | Cerebro diálogo; decide tool |
| Imágenes | FLUX | Tool “generar imagen” → artifact panel |
| Video | Wan 2.7 | Tool “generar video” → player/artifact |
| TTS | Fish Speech | Tool voz salida |
| STT | Whisper Large v3 | Mic → texto al chat |
| Audio/música | ACE-Step | Tool música/audio |
| Pipeline visual nodos | ComfyUI | Backend/tool host; UI solo dispara y muestra resultado |
| Conversacional local opcional | Gemma E2B Q4_K_M | Contenedor capacidades on-device (app) |

Flujo UI nativo:

```
Mic/Texto → Whisper (local o API) → mensaje chat
                → modelo (Qwen Omni / Gemma / registry)
                → si tool image → FLUX → ArtifactImage
                → si tool video → Wan → ArtifactVideo
                → si tool speech → Fish → AudioPlayer
                → si tool music → ACE-Step → AudioPlayer
```

La UI **no** reimplementa los modelos: panel nativo de tools + vista de resultado (artifact). Apariencia = mismos tokens dark FROMTED, no ventanas ajenas.

---

## 2. Funciones 1–25 (biometría, visión, captura) — trazabilidad URL

| # | Función | Proyecto | URL oficial | Integración UI nativa |
|---|---------|----------|-------------|----------------------|
| 1 | Reconocimiento facial | InsightFace | https://github.com/deepinsight/insightface | Plugin visión; resultado en panel lateral |
| 2 | Detección rostro | MediaPipe Face | https://github.com/google-ai-edge/mediapipe | Web/WASM o nativo; overlay cámara |
| 3 | Seguimiento facial 3D | OpenSeeFace | https://github.com/emilianavt/OpenSeeFace | Plugin desktop |
| 4 | Detección ojos | MediaPipe Iris | (mismo MediaPipe) | |
| 5 | Seguimiento ocular | OpenSeeFace Eye | (mismo repo) | |
| 6 | Manos | MediaPipe Hands | MediaPipe | Gestos → comandos UI |
| 7 | Gestos | MediaPipe Gesture | MediaPipe | |
| 8 | Cuerpo | MediaPipe Pose | MediaPipe | |
| 9 | Segmentación persona | SAM 2 | https://github.com/facebookresearch/sam2 | Tool imagen |
| 10 | Detección objetos | Grounding DINO | https://github.com/IDEA-Research/GroundingDINO | Tool visión |
| 11 | Quitar fondo | RMBG-2.0 | HF/colecciones RMBG | Tool imagen → artifact |
| 12 | Sustituir fondo | BRIA RMBG | HF BRIA | |
| 13 | Webcam | OpenCV / getUserMedia | https://github.com/opencv/opencv | Componente CameraPanel nativo |
| 14 | Captura pantalla | OBS SDK / browser APIs | https://github.com/obsproject/obs-studio | Desktop plugin |
| 15 | Compartir pantalla | WebRTC | estándar web | Botón chat nativo |
| 16 | Grabación pantalla | FFmpeg | https://github.com/FFmpeg/FFmpeg | Engine nativo / worker |
| 17 | Grabación audio | PortAudio / MediaRecorder | https://github.com/PortAudio/portaudio | Botón mic nativo |
| 18 | Repro audio | Web Audio / SDL2 | https://github.com/libsdl-org/SDL | Player embebido theme FROMTED |
| 19 | Repro video | libVLC / video.js | https://github.com/videolan/vlc | ArtifactVideo |
| 20 | Streaming local | GStreamer | https://github.com/GStreamer/gstreamer | Desktop |
| 21 | Multi-cámara | OpenCV Camera | OpenCV | |
| 22 | QR | ZXing | https://github.com/zxing/zxing | ScannerModal |
| 23 | Barras | ZXing | mismo | |
| 24 | Color | OpenCV | | |
| 25 | Distancia cámara | MediaPipe+OpenCV | | Plugin medición |

Prioridad **web/PWA v1** (sin nativo pesado): 13, 15, 17, 18, 19 (HTML5), 22 (jsqr/zxing-js), getUserMedia, MediaRecorder.  
Prioridad **app nativa después**: InsightFace, SAM2, FFmpeg, GStreamer, OBS.

---

## 3. Chat-related ya en FROMTED (no duplicar motor)

Las 61 funciones chat (FROMTED-CHAT-61-FUNCIONES.md) siguen siendo checklist UI.  
Audio STT/TTS de esta salida se **enchufa** a #38 voz y a artifacts, no crea segundo chat.

---

## 4. Panel documentos / archivos / bloc de notas (mínimo pedido)

| Pieza | Qué sí | Qué no (luego) |
|-------|--------|----------------|
| Ventana archivos | File manager UI (svar/Chonky ya en catálogo PARTE-1) | Graphiti/RAG |
| Bloc de notas | Editor texto/MD ligero en panel (md-editor-rt / textarea + save local) | Sistema Obsidian completo |
| Artifact | Contenedor resultado imagen/video/md/pdf blob | Motor automatización |

---

## 5. Open CoDesign (Claude Design OS chino)

| Campo | Valor |
|-------|-------|
| Repo | https://github.com/OpenCoworkAI/open-codesign |
| Site | https://opencoworkai.github.io/open-codesign/ |
| Licencia | MIT |
| Stack | Electron, BYOK, local-first |
| Uso FROMTED | **Referencia de workspace/plugins/sidebar**; no tragar Electron entero si mobile-first; extraer patrones UI y rediseñar con tokens FROMTED |
| Móvil | No nativo; hay que rehacer shell |

---

## 6. Navegación agente (tools, no panel docs)

| Tool | URL / tech | UI nativa |
|------|------------|-----------|
| Browser Use | investigar repo Browser Use vigente | Estado navegación en panel “Browser” |
| Playwright | https://github.com/microsoft/playwright | Solo engine; UI muestra URL/screenshot |
| yt-dlp | https://github.com/yt-dlp/yt-dlp | Tool metadata YouTube → artifact |
| WebView embebido | WebView2 / WKWebView / iframe controlado | Panel Browser dentro FROMTED |

---

FIN SALIDA 1/3.
