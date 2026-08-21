# FROMTED PARTE 7B — Addendum post-aprobación chat

Fecha: 2026-07-28 16:35 -05  
Origen: salida aprobada en chat (idiomas, colores Configuración, UI web dev, trazabilidad tech, memoria dispositivo web)

## 1. Configuración → Apariencia (cambio de colores)

```
Configuración
└── Apariencia
    ├── Tema de fondo: Dark warm | Gray warm | Light | Blanco accesibilidad
    ├── Color de títulos: Gris cálido | Azul eléctrico | Verde | Auto
    ├── Letras del chat: input + salida (hasta 5 colores; default 2 grises cálidos)
    └── Vista previa en vivo
```

CSS: `data-theme`, `data-title-color`, `data-chat-in`, `data-chat-out`  
Naranja #ff6b1a no configurable como tema general (solo labels Cargar/Descargar/Agregar).

## 2. i18n (recordatorio operativo)
en-US | es-US | fr | pt → i18next + JSON → selector Configuración → Idioma

## 3. Stack desarrollo UI web
Vite + React 18 + TS · CSS vars · i18next · assistant-ui · dockview · lucide  
CloudAdapter: HTTPS + WS/SSE · auth · object storage · task queue · proxy modelos  
PWA installable · AI modo web = API externa

## 4. Memoria en dispositivo (usuarios UI web)
Default: memoria y archivos del usuario en **su dispositivo**  
IndexedDB + OPFS + Cache Storage + localStorage  
Cloud sync = opt-in (diff only)  
Memory API → Manager → Transaction → StorageAdapter → IDBProvider | OPFSProvider | CloudProvider opcional

## 5. Trazabilidad tech (tabla compacta)
Chat: assistant-ui | Dock: dockview | i18n: i18next | Search: Perplexica/SearxNG | YT: IFrame API | Call: Telnyx WebRTC | TG: Bot API | WA: Cloud API | Gmail: Gmail API | Storage local: IDB/OPFS | Agente: OpenClaw UICommand

FIN 7B
