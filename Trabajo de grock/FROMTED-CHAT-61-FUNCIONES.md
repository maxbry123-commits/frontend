# FROMTED — CHECKLIST 61 FUNCIONES DEL CHAT

Fuente: Command Center Fase 3 DeepSeek (literal).  
Uso: checklist de capacidades UI a conectar; kernels fuera.

| # | Bloque | Función | Capa |
|---|--------|---------|------|
| 1 | A | Chat texto input multilínea | UI |
| 2 | A | Selector visual modelos | UI+registry |
| 3 | A | Historial persistente | UI+store |
| 4 | A | Copia respuestas asistente | UI |
| 5 | A | System prompt personalizable | UI+store |
| 6 | A | Streaming token | UI |
| 7 | A | Stop generación | UI |
| 8 | B | Toggle stream/idioma/tokens/temp | UI |
| 9 | B | Modo oscuro/claro | UI |
| 10 | B | Idioma respuesta | UI→API |
| 11 | B | Tamaño texto | UI |
| 12 | C | Claude Code | UI router |
| 13 | C | OpenRouter | UI+proxy |
| 14 | C | HF Spaces | UI+proxy |
| 15 | C | LiteLLM router | UI+proxy |
| 16 | D | Responsive mobile | UI |
| 17 | D | Loading skeleton | UI |
| 18 | D | Markdown + highlight | UI |
| 19 | D | Teclado virtual | UI |
| 20 | D | Estética dark mate | UI |
| 21 | D | Burbujas | UI |
| 22 | D | Input negro mate glow | UI |
| 23 | D | Botones copia | UI |
| 24 | E | Búsqueda historial | UI+store |
| 25 | E | Export MD/PDF | UI |
| 26 | E | Auto-save 30s | UI+store |
| 27 | F | ErrorBoundary | UI |
| 28 | F | Rate limit handler | EXT+toast |
| 29 | F | Reconnect auto | UI |
| 30 | F | Keep-alive HF | EXT |
| 31 | F | Health check | EXT+panel |
| 32 | F | Logs | EXT |
| 33 | F | CORS | EXT |
| 34 | G | Auth/URL privada | EXT |
| 35 | G | Secrets | EXT |
| 36 | H | Input imagen | UI |
| 37 | H | Input audio file | UI |
| 38 | H | Voz vivo | UI |
| 39 | H | Anclar archivos tareas | UI+storage |
| 40 | H | Output PDF/Doc/MD | UI |
| 41 | I | Knowledge base | EXT+UI |
| 42 | I | Embeddings | EXT |
| 43 | I | Recuperación semántica | EXT+UI |
| 44 | J | Agregar AI sin código | UI |
| 45 | J | Agregar agentes API | UI+API |
| 46 | J | Selector agentes lateral | UI |
| 47 | K | Verificación cadena | EXT+UI |
| 48 | K | langgraph.json | EXT+UI |
| 49 | K | Ejecutar cadena | UI+EXT |
| 50 | L | Cola persistente | EXT+UI |
| 51 | L | Prioridades reintentos | EXT+UI |
| 52 | L | Notif Telegram | EXT |
| 53 | L | Scraper Playwright | EXT |
| 54 | L | Dependencias tareas | EXT+UI |
| 55 | L | Supervisor cron | EXT |
| 56 | M | Ventana tarea preset | UI |
| 57 | M | Motor Python DSL JSON | EXT |
| 58 | M | Tareas pendientes global | UI |
| 59 | M | Selector proyectos GitHub | UI+API |
| 60 | M | Conectar repos GitHub | UI+OAuth |
| 61 | M | Notas + carpetas + pizarra | UI+store |

Detalle SRC por función: `fromted-research/INVESTIGACION-4-E2B-LINUX-61.md`
