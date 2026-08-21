# PROYECTO FROMTED — PARTE 7 COMPLETA
## Razonamiento · Investigación punto a punto · Plan de diseño · Plan de integración

Fecha: 2026-07-28 16:15 -05  
Estado: DOCUMENTO COMPLETO (no resumen)  
Regla: input blocks leídos literales; cada punto del usuario tiene sección propia; método de trabajo aplicado.

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
4. Comms + YouTube + search OS con chrome FROMTED.
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

# BLOQUE 1 — INPUT LITERAL: PALETA Y TEMAS

## 1.1 Problema
Los HTML previos usaban negro puro (#0d0d0d / #000) y blanco puro. El usuario exige gris carbón cálido (matiz marrón/oliva) y texto tipo papel.

## 1.2 Especificación de color (obligatoria)

| Elemento | Hex | Descripción usuario |
|----------|-----|---------------------|
| Fondo principal | `#1A1A19` a `#1E1D1B` | Warm charcoal / dark taupe / antracita cálido |
| Superficie / elev | `#252422` | Cards, sheets |
| Borde | `#2E2D2A` | |
| Texto principal | `#BCBCB0` | Gris claro cálido |
| Texto secundario | `#A8A59C` | Más apagado |
| Naranja | `#ff6b1a` | Solo Cargar / Descargar / Agregar |
| Azul eléctrico | `#2f6bff` | Selección/focus |
| Verde | `#22c55e` | Status |

## 1.3 Temas
1. Dark warm — `#1A1A19` / `#BCBCB0`
2. Gray warm — `#2A2926`
3. Light — `#F3F1EA`
4. Blanco puro opcional de accesibilidad

## 1.4 Variantes de título
T1 warm, T2 azul eléctrico, T3 verde, T4 claro.

# BLOQUE 2 — i18n
Idiomas: en-US, es-US, fr, pt. Implementación propuesta: i18next + react-i18next; selector persistente en configuración.

# BLOQUE 3 — AGENTE CON CONTROL TOTAL DE UI

UICommand bus: texto/voz → OpenClaw Agent → UICommandRouter → tools/paneles. Acciones: tool.enable/disable, panel.open/close, task.start/cancel, theme.set, locale.set, youtube.play, search.run, call.start.

# BLOQUE 4 — COMUNICACIONES

Telnyx WebRTC o Twilio para llamadas; Telegram Bot API; WhatsApp Cloud API preferida; Gmail API; Web Share API y intents nativos para dispositivo; OpenClaw como agente conectado.

## YouTube
Usar YouTube IFrame Player API oficial; panel `YoutubePanel` con chrome FROMTED.

## Buscador
Perplexica, Morphic y SearxNG como referencias/servicios; UI muestra resultados y citas con skin FROMTED.

# BLOQUE 5 — PARALELISMO HASTA 20

TaskManager con `maxConcurrent` hasta 20, cola cuando el presupuesto del dispositivo lo requiera, y panel Paralelas. Cada tarea tiene estado queued/running/done/failed.

# BLOQUE 6 — LOCAL Y WEB PWA

Una UI con `LocalAdapter` y `CloudAdapter`; IndexedDB/Cache/localStorage/OPFS local; HTTPS/WebSocket/SSE en cloud. Contratos `ChatPort`, `FilePort`, `SettingsPort`.

# BLOQUE 7 — PLAN DE DISEÑO

Tokens warm charcoal, iconos Lucide, botones neutros, naranja limitado a acciones de carga/descarga/agregar, selección azul por letras/borde, chrome FROMTED para herramientas externas. Pantallas p01–p16 incluyendo Capacidades, Paralelas, YouTube, llamadas, conectores y resultados de búsqueda.

# BLOQUE 8 — PLAN DE INTEGRACIÓN

Manifest determinista con URL + commit/branch + paths; GitHub Action para clone/checkout/copy/inventory. Fases I0–I5: repo/tokens, chat/command bus, files/artifacts/parallel, tools externos, adapters duales y OpenClaw wire.

# BLOQUE 9 — CUMPLIMIENTO

Cubre paleta, temas, i18n, control de UI por agente, comunicaciones, YouTube, búsqueda, natividad, paralelismo 20, local/PWA, storage, APIs externas, variantes visuales, investigación y planes de diseño/integración.

# BLOQUE 10 — PRÓXIMA ACCIÓN

Cuando el usuario ordene INICIA T-01 / I0: crear estructura + manifest + tokens warm + i18n skeleton + Action determinista.

FIN — PARTE 7 COMPLETA SIN RESUMEN OMISIVO
