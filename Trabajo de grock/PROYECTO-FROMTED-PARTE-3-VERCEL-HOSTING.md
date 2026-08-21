# PROYECTO FROMTED — PARTE 3: VERCEL, PORTABILIDAD Y UI DESCARGABLE

Fecha: 2026-07-27 23:55 -05  
Estado: ACTIVO  
Depende de: PROYECTO-FROMTED.md (cerrada) · PARTE-1 · PARTE-2 · PLAN-DETALLADO

Input usuario (literal, sin resumir el sentido):
- Diseñar todo lo que pueda funcionar en Vercel para usarlo hasta pulir.
- Diseñado para migrar mañana a Cloudflare u otra plataforma.
- Lista de qué sí / qué no corre en Vercel (Router, Graphiti, Graphify, chat, documentos).
- ¿Sistema integral completo en la web?
- Tipo app Anthropic / Grok UI: ¿sin VPS, todo local?
- Incluir dónde se aloja para luego descargar UI en móvil o PC.

---

## 1. Principio de diseño portable (Vercel → cualquier cloud)

FROMTED web se construye como **frontend desacoplado**:

```
Browser (UI FROMTED)
    │
    ├─ static assets (HTML/JS/CSS)     → Vercel / Cloudflare Pages / Netlify / S3+CDN
    ├─ optional Edge/Serverless funcs → Vercel Functions / CF Workers (thin proxy)
    └─ HTTPS APIs externas            → LiteLLM cloud, OpenRouter, HF, VPS futuro
```

Reglas para migrar en un día:
1. **No** acoplar a APIs propietarias solo de Vercel (evitar Vercel KV/Postgres como único store en v1).
2. Config por **env vars** (`ORCHESTRATOR_URL`, `LITELLM_URL`, `API_KEYS` server-side).
3. Build = artefacto estático o SSR portable (Next.js puede exportar o correr en CF via adapter).
4. Historial v1 = **localStorage / IndexedDB** en el cliente (cero dependencia de DB del host).
5. Cuando haya backend propio, solo cambia la URL base; la UI no se reescribe.

Stack recomendado v1 portable:
- **Vite + React + TypeScript** (static) → deploy idéntico en Vercel, Cloudflare Pages, Netlify, GitHub Pages.
- O **Next.js** con salida que permita adapter Cloudflare si más adelante hace falta SSR.

Prioridad: **Vite+React static** = máxima portabilidad y menos magia de plataforma.

---

## 2. Lista SÍ / NO en Vercel (sin VPS)

### SÍ puede correr en Vercel (y en el navegador)

| Pieza FROMTED | Cómo |
|---------------|------|
| Shell UI dark (layout, tokens, botones) | 100% static |
| Chat UI (burbujas, input, markdown) | 100% cliente |
| Streaming token a token | Browser → HTTPS provider (OpenRouter, etc.) o Server Action/proxy fino |
| Stop (AbortController) | Cliente |
| Selector de modelos (lista UI) | Cliente; lista de config o GET a API cloud |
| Settings (temp, tokens, tamaño texto) | localStorage |
| Historial + búsqueda local + tags UI | localStorage / IndexedDB |
| Copy / share / export MD cliente | Cliente |
| Attach imagen (preview local) | Cliente; upload real necesita destino |
| Voice input (Web Speech API) | Cliente (Chrome/Android) |
| Panel documentos **UI** (lista, preview, anclas en estado) | Cliente; archivos en memoria o storage browser |
| Panel router **UI** (fichas dibujadas, formularios N→N) | Cliente; persistencia local o JSON remoto simple |
| Canvas automatización **UI** (React Flow dibujar/export JSON) | Cliente; el motor no ejecuta en Vercel |
| Kanban **UI** | Cliente |
| MCP client **UI** (listar/conectar si el server MCP es HTTPS público) | Cliente + edge proxy si CORS |
| MD artifact editor | Cliente |
| Theme Anthropic/Grok-like | Cliente |
| PWA (instalable en móvil/PC desde el navegador) | manifest + service worker; mismo deploy Vercel/CF |

### NO corre “de verdad” solo en Vercel (necesitan proceso fuera o cloud de terceros)

| Pieza | Por qué | Alternativa sin tu VPS |
|-------|---------|------------------------|
| **Graphiti** (motor knowledge graph) | Servicio Python/proceso largo, no serverless típico | Host dedicado / container / más adelante VPS |
| **Graphify** | Igual, motor fuera de UI | Igual |
| **Router orquestador** (ejecución real de rutas, colas, permisos) | Lógica de servidor + estado | VPS, o producto cloud; en Vercel solo la **UI del router** |
| OpenClaw **kernel** / agentes ejecutores | Runtime agente | Cloud agent host o VPS; UI solo dispara |
| LiteLLM **self-host** completo | Proceso proxy multi-modelo | LiteLLM cloud / OpenRouter / APIs directas |
| Cola de tareas con cron/supervisor | Background workers | VPS, Inngest, CF Queues (después), no v1 |
| Scraper Playwright | Browser automation server | Servicio aparte |
| RAG embeddings pesados + pgvector | DB + compute | Supabase cloud (tercero) o VPS |
| Gemma 1B Q4 **local en dispositivo** | No es Vercel; es app nativa | Fase app Flutter (PARTE-2) |
| Linux-in-browser / E2B cloud | E2B = API cloud de pago; v86 pesado | Opcional después |
| Secrets de producción en cliente | Inseguro | Solo server-side env / proxy |

### Resumen una línea

- **UI integral tipo Anthropic/Grok (paneles + chat + docs UI + canvas dibujo + router fichas):** SÍ en Vercel.  
- **Motores Graphiti/Graphify/orquestador/agentes ejecutando:** NO en Vercel; se conectan por API cuando existan.

---

## 3. ¿Sistema integral completo en la web?

**Sí a nivel INTERFACE.**  
Un usuario puede abrir la URL y usar:

- Chat completo visual (stream, stop, modelos vía API cloud, historial local, markdown, attach preview, voz).
- Paneles de configuración, documentos (UI), router (fichas), automatización (dibujar flujos y guardar JSON).
- Aspecto tipo Anthropic / Grok / OpenClaw UI.

**No a nivel “todo el backend MAXBRY dentro de Vercel”.**  
Eso nunca fue el diseño: FROMTED = interface; kernels fuera.

Flujo sin tu VPS:

```
Usuario → FROMTED en Vercel
              → OpenRouter / HF / OpenAI / LiteLLM cloud  (chat real)
              → (opcional) Supabase cloud solo si quieres sync historial
              → más adelante → tu VPS orquestador cuando esté listo
```

---

## 4. Tipo Anthropic / Grok UI sin VPS

| Pregunta | Respuesta |
|----------|-----------|
| ¿Se puede diseñar esa UI sin VPS? | **Sí** |
| ¿Corre “todo en local” del browser? | UI + historial + settings sí; **inferencia del LLM** necesita API cloud **o** app nativa con GGUF |
| ¿Vercel basta para pulir la UI? | **Sí** — es el entorno de diseño/uso hasta migrar |
| ¿Mañana Cloudflare? | Mismo build static → Cloudflare Pages; cambiar DNS/env |

“Todo en local” estricto (sin ninguna API) solo con **app descargable + Gemma GGUF** (PARTE-2 Fase C), no con la web sola.

---

## 5. Dónde se aloja y cómo “descargar” la UI (móvil / PC)

Incluido en el proyecto FROMTED:

### A) Web instalable (PWA) — mismo código Vercel/CF

| Destino | Cómo |
|---------|------|
| Vercel | Deploy preview/prod; usuario abre URL |
| Cloudflare Pages | Mismo artefacto `dist/` |
| Netlify / GitHub Pages | Igual |
| Móvil / PC | **PWA**: “Añadir a pantalla de inicio” / instalar desde Chrome/Edge → se siente app |

No es APK/IPA nativo; es web instalada. Sirve para pulir UI sin stores.

### B) App nativa descargable (complemento PARTE-2)

| Destino | Cómo |
|---------|------|
| Android / iOS / Windows / Linux | Flutter (o Tauri) build → instalador |
| Stores o sideload | APK / TestFlight / .dmg / .exe |
| Gemma local | GGUF en dispositivo |
| Misma “cara” visual | Reutilizar tokens/diseño; chat shell Flutter |

### C) Código fuente UI

| Destino | Cómo |
|---------|------|
| GitHub `fromted` | Clonar / release zip de `src` + `sources` |
| Usuario técnico | `npm install && npm run build` y hostear donde quiera |

---

## 6. Qué diseñamos YA para Vercel (alcance PARTE 3)

Objetivo: **interface integral usable en URL pública**, pulible sin VPS.

1. Shell dark portable (Vite+React+TS preferido).  
2. Chat: stream + stop + markdown + copy + selector + settings + historial local.  
3. Provider cloud configurable por env (sin hardcode de un solo vendor).  
4. Panel docs UI (lista/preview/anclas en estado cliente).  
5. Panel router UI (fichas; sin ejecutar orquestación).  
6. Canvas UI (dibujar + export JSON; sin Graphiti/Graphify runtime).  
7. PWA manifest para instalar en móvil/PC.  
8. Un solo `dist/` desplegable en Vercel **o** Cloudflare Pages sin reescribir.

Graphiti, Graphify, router ejecutor, OpenClaw kernel = **conectores futuros** por URL; no bloquean el diseño ni el uso diario de la UI en Vercel.

---

## 7. Microdiagrama host

```
[FROMTED UI build]
        │
        ├─► Vercel (hoy, pulir)
        ├─► Cloudflare Pages (migración 1 día)
        ├─► Netlify / otro static host
        └─► PWA instalada (móvil/PC)
                │
                ├─ APIs cloud (chat real sin tu VPS)
                └─ más tarde: VPS orquestador / Graphiti / agentes

[FROMTED App nativa] (fase aparte)
        └─► Gemma GGUF local + opcional mismos APIs
```

---

## 8. Trazabilidad

| Doc | Rol |
|-----|-----|
| PROYECTO-FROMTED.md | Spec cerrada |
| PARTE-1 | Catálogo sources web |
| PARTE-2 | Híbrido web + app local |
| **PARTE-3 (este)** | Vercel sí/no · portabilidad · PWA/descarga UI |
| PLAN-DETALLADO | Pasos programación |

---

FIN PARTE 3.
