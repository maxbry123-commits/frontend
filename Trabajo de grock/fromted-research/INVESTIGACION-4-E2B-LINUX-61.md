# INVESTIGACIÓN 4 — E2B / Linux-in-UI + Mapa 61 funciones (100%)

Fecha: 2026-07-27 21:20 -05  
Objetivo: cerrar huecos aspiracionales + checklist 61 sin gaps.

---

## 1. E2B / code interpreter (Gemma/MAXBRY path)

| Recurso | URL | Uso en FROMTED |
|---------|-----|----------------|
| e2b-dev/code-interpreter | https://github.com/e2b-dev/code-interpreter | SDK JS/Python ejecutar código en sandbox cloud |
| e2b-dev (org) | https://github.com/e2b-dev | Infra OS sandboxes |
| e2b-dev/fragments | https://github.com/e2b-dev/fragments | Template Next.js artifacts + E2B (ref UI) |
| e2b-desktop | PyPI e2b-desktop | Desktop GUI sandbox (computer use) |
| EdgeBox | https://github.com/BIGPPWONG/EdgeBox | E2B-like **local** + GUI + MCP |
| Docs connect LLMs | https://e2b.dev/docs/quickstart/connect-llms | Patrón tool-calling → sandbox |

**Conclusión programación FROMTED:**
- E2B **no vive dentro del bundle UI**. UI llama API/SDK (o microservicio bridge).
- “Gemma 4 E2B embebida como MAXBRY” = (a) bridge a E2B cloud, o (b) EdgeBox local, o (c) Pyodide solo-Python sin Gemma completa.
- Gemma pesos en browser: **no viable** como modelo full en v1; responder “como MAXBRY” = system prompt + modelo vía LiteLLM/registry, no pesos embebidos.

---

## 2. Linux dentro de la UI

| Recurso | URL | Uso |
|---------|-----|-----|
| copy/v86 | https://github.com/copy/v86 | Emulador x86→WASM en browser |
| leaningtech/webvm | https://github.com/leaningtech/webvm | Linux VM client-side (CheerpX) |
| humphd/browser-vm | https://github.com/humphd/browser-vm | Buildroot Linux para v86 |
| JackSuuu/Linux-In-Web | https://github.com/JackSuuu/Linux-In-Web | Desktop Linux GUI en browser (v86) |
| Mini.WebVM | docs Leaning Tech | Dockerfile → WebVM deploy |

**Conclusión:**
- Linux-in-UI es **iframe/panel opcional** (v86 o WebVM), no kernel del producto.
- Pesado (ISO/WASM); activar solo en sandbox creator avanzado.
- v1: Pyodide (Python) prioritario; Linux panel = fase posterior opcional.

---

## 3. MAPA 61 FUNCIONES → FROMTED (UI) vs EXTERNO

Fuente literal: TAREA Command Center Fase 3 DeepSeek (bloques A–M).

Leyenda cobertura:
- **UI** = implementar/conectar en FROMTED interface
- **EXT** = microservicio/backend/fuera (UI solo dispara o muestra estado)
- **SRC** = repo/lib del catálogo que cubre o aproxima

### BLOQUE A — Chat Base (1–7)

| # | Función | UI/EXT | SRC / cómo |
|---|---------|--------|------------|
| 1 | Chat texto input multilínea | UI | assistant-ui Composer / ChatInput |
| 2 | Selector visual modelos | UI | chat-ui model-selector / ModelSelector + registry API |
| 3 | Historial persistente | UI+EXT | UI lista; EXT Supabase/store |
| 4 | Selección/copia respuestas asistente | UI | CSS + Clipboard; ActionBar assistant-ui |
| 5 | System prompt personalizable | UI+EXT | Modal editor; persist EXT |
| 6 | Streaming token a token | UI | SSE/WS; react-ai-stream / assistant-ui runtime |
| 7 | Botón stop generación | UI | AbortController; react-ai-stream abort |

### BLOQUE B — Configuración (8–11)

| # | Función | UI/EXT | SRC |
|---|---------|--------|-----|
| 8 | Toggle stream, idioma, tokens, temp | UI | ChatSettings + Zustand/store |
| 9 | Modo oscuro/claro | UI | shadcn dark + toggle (spec: dark mate prioritario) |
| 10 | Idioma respuesta | UI→EXT | Parámetro en request al gateway |
| 11 | Selector tamaño texto | UI | CSS vars / Tailwind |

### BLOQUE C — Integraciones (12–15)

| # | Función | UI/EXT | SRC |
|---|---------|--------|-----|
| 12 | Conexión Claude Code | UI ficha router | open-connector / deep link |
| 13 | Conexión OpenRouter | UI+EXT | Ficha router; proxy EXT |
| 14 | Conexión HF Spaces | UI+EXT | Ficha router; proxy EXT |
| 15 | LiteLLM router | UI+EXT | Ya programs/; selector consume registry |

### BLOQUE D — UI/UX (16–23)

| # | Función | UI/EXT | SRC |
|---|---------|--------|-----|
| 16 | Responsive mobile-first | UI | Tailwind + Capacitor shell |
| 17 | Loading skeleton | UI | shadcn Skeleton |
| 18 | Markdown + syntax highlight | UI | react-markdown / assistant-ui / reachat |
| 19 | Teclado virtual optimizado | UI | inputmode / enterkeyhint |
| 20 | Estética aprobada dark mate | UI | PASO 2 tokens (naranja/azul/verde) |
| 21 | Burbujas user/asistente | UI | Chat bubbles components |
| 22 | Marco input negro mate glow | UI | CSS custom PASO 2 |
| 23 | Botones copia historial/fragmentos | UI | Clipboard API |

### BLOQUE E — Historial (24–26)

| # | Función | UI/EXT | SRC |
|---|---------|--------|-----|
| 24 | Búsqueda historial | UI+EXT | chatcn/KChat patterns; query EXT |
| 25 | Exportar MD/PDF | UI | jspdf + markdown-editor export |
| 26 | Auto-save 30s | UI+EXT | interval + persist store |

### BLOQUE F — Errores/Infra (27–33)

| # | Función | UI/EXT | SRC |
|---|---------|--------|-----|
| 27 | ErrorBoundary global | UI | React ErrorBoundary |
| 28 | Rate limit handler | EXT+UI toast | Backend; UI muestra error |
| 29 | Reconnect automático | UI | useEffect retry / gateway status |
| 30 | Keep-alive HF | EXT | UptimeRobot / externo |
| 31 | Health check | EXT+UI panel | Endpoint /health; panel API Health |
| 32 | Logs centralizados | EXT | Backend logs |
| 33 | CORS | EXT | FastAPI/proxy |

### BLOQUE G — Seguridad (34–35)

| # | Función | UI/EXT | SRC |
|---|---------|--------|-----|
| 34 | Sin auth pública / URL privada | EXT | Deploy config |
| 35 | Secrets entorno | EXT | Vault/HF secrets; UI no guarda plain |

### BLOQUE H — Multimodal (36–40)

| # | Función | UI/EXT | SRC |
|---|---------|--------|-----|
| 36 | Input imagen | UI | dropzone / assistant-ui attachments |
| 37 | Input audio file | UI | dropzone |
| 38 | Input voz vivo | UI | react-web-speech / MediaRecorder |
| 39 | Anclar archivos a tareas | UI+EXT | Storage EXT; anclas UI |
| 40 | Output PDF/Doc/MD | UI | jspdf + docx + md-editor |

### BLOQUE I — Knowledge Base (41–43)

| # | Función | UI/EXT | SRC |
|---|---------|--------|-----|
| 41 | Base conocimiento | EXT+UI | UI busca/ancla; pgvector EXT |
| 42 | Embeddings automáticos | EXT | LangChain/pipeline fuera |
| 43 | Recuperación semántica | EXT+UI | UI dispara; RPC EXT |

### BLOQUE J — Agentes (44–46)

| # | Función | UI/EXT | SRC |
|---|---------|--------|-----|
| 44 | Ventana Agregar AI sin código | UI | Modal + ficha router |
| 45 | Agregar agentes vía API | UI+EXT | Modal; API registry EXT |
| 46 | Selector agentes lateral | UI | Sidebar Osquestador pattern |

### BLOQUE K — Verificación en cadena (47–49)

| # | Función | UI/EXT | SRC |
|---|---------|--------|-----|
| 47 | Verificación cadena DSL/JSON | EXT+UI | UI edita grafo; LangGraph EXT |
| 48 | Config langgraph.json | EXT+UI | Editor JSON en UI; file EXT |
| 49 | Ejecutar tareas en cadena | UI+EXT | Botón + polling; motor EXT |

### BLOQUE L — Cola de tareas (50–55)

| # | Función | UI/EXT | SRC |
|---|---------|--------|-----|
| 50 | Cola persistente | EXT+UI | Kanban/lista UI; tabla EXT |
| 51 | Prioridades + reintentos | EXT+UI | Campos UI; lógica EXT |
| 52 | Notificaciones Telegram | EXT | Bot fuera; UI toggle |
| 53 | Agente Scraper Playwright | EXT | Space/Docker separado |
| 54 | Dependencias entre tareas | EXT+UI | JSONB; UI muestra grafo |
| 55 | Supervisor cola Cron | EXT | Backend cron |

### BLOQUE M — Ventanas y proyectos (56–61)

| # | Función | UI/EXT | SRC |
|---|---------|--------|-----|
| 56 | Ventana tarea formato preset | UI | Form React |
| 57 | Motor Python + DSL + JSON | EXT | FastAPI; UI solo envía |
| 58 | Ventana tareas pendientes | UI | Kanban/lista filtros |
| 59 | Selector proyectos GitHub | UI+EXT | GitHub API via conector |
| 60 | Conectar repos GitHub | UI+EXT | OAuth conector GitHub |
| 61 | Blocs notas + carpetas + pizarra state.json | UI+EXT | Docs panel + Supabase state |

---

## 4. Cobertura 61/61

| Tipo | Cantidad |
|------|----------|
| Cubiertas en UI (componente/conexión) | 61 |
| Huecos sin plan UI ni EXT | **0** |
| Solo EXT (UI muestra/dispara) | 27, 28, 30–35, 41–43, 47–48, 50–55, 57 parcial |
| Implementación UI custom (sin lib OS única) | Loop continuo, tags mensaje, ficha router N→N, filtros sandbox, tokens color |

**100% de las 61 tienen destino UI y/o EXT documentado.**

---

## 5. Añadidos al catálogo sources (I4)

| # | Nombre | URL |
|---|--------|-----|
| 67 | e2b code-interpreter | https://github.com/e2b-dev/code-interpreter |
| 68 | e2b fragments | https://github.com/e2b-dev/fragments |
| 69 | EdgeBox | https://github.com/BIGPPWONG/EdgeBox |
| 70 | v86 | https://github.com/copy/v86 |
| 71 | webvm | https://github.com/leaningtech/webvm |
| 72 | browser-vm | https://github.com/humphd/browser-vm |
| 73 | Linux-In-Web | https://github.com/JackSuuu/Linux-In-Web |

---

## 6. ¿Más investigación?

**No.** Con I1–I4 + mapa 61:
- Sources para programar UI cubiertos
- E2B/Linux con estrategia clara (bridge/opcional)
- 61 funciones sin huecos de responsabilidad

Listo para **salida 4 consolidación** cuando el usuario ordene.
