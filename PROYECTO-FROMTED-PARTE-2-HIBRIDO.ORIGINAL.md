# PROYECTO FROMTED — PARTE 2: ARQUITECTURA HÍBRIDA WEB + APP LOCAL

Fecha: 2026-07-27 21:50 -05  
Estado: ACTIVO — extensión de la spec cerrada (no la reemplaza)  
Depende de: `PROYECTO-FROMTED.md` (CERRADA) + PARTE-1 catálogo

Input block literal (usuario) — leer sin resumir:

```
Si la interface es un complemento de la web el usuario se conecta en un plan de pago que le da el acceso a las herramientas que se ejecutan como code puro como sofware 90% detrninetista algunos procesos largos o grandes la web los procesas con API de proveedores en la web vive el osquestador y unos agentes más capaces en la app UI o interface para PC o Smartphones vive un complemento de la web de todo el sistema
La ui permite a la web eliminar sobre carga en procesos simples preguntas cortas o tontas o informamcion del sistema
Cuando escala el nivel de razonamiento o otras tareas se dispara el osquestador de la web del sistema y los agentes y API de mejor calidad y resultados y respuestas rápidas
El agente y el modelo es intercambiable en cualquier actualizacion
```

---

## 1. Principio

FROMTED no es solo web ni solo app.

| Capa | Dónde vive | Qué hace |
|------|------------|----------|
| **Web / orquestador** | Vercel + VPS + APIs proveedores | Cerebro: tareas largas, razonamiento alto, agentes potentes, tools deterministas 90%, plan de pago |
| **App UI (PC/móvil)** | Flutter (o shell nativo) descargable | Complemento: offload de preguntas cortas / sistema / chat simple con **Gemma 1B Q4 local** |
| **Escalado** | Session Controller | Si la tarea es simple → runtime local; si escala → dispara orquestador web + agentes + APIs |

La UI **nunca** contiene lógica de IA. Solo paneles + Session Controller.

## 2. Diagrama de capas

```
Usuario
   │
   ├─ Web FROMTED (plan pago)
   │     ├─ Orquestador
   │     ├─ Agentes potentes
   │     ├─ Tools deterministas (code)
   │     └─ APIs proveedores (largos)
   │
   └─ App UI (complemento)
         ├─ Chat / Historial / Config / Modelos / Memoria / Tools / Diagnóstico
         ├─ Session Controller
         │     ├─ ¿simple? → Runtime local (llama.cpp + Gemma 1B Q4)
         │     └─ ¿escala? → cliente orquestador web
         ├─ OpenClaw (lib Agent, intercambiable)
         └─ Model Manager (GGUF descargable, checksum, swap)
```

Gemma **no conoce** el VPS. Solo genera texto.  
OpenClaw decide tools / memoria / orquestador.  
Modelo y agente = intercambiables por config/update.

## 3. Runtime local (app)

| Componente | Responsabilidad |
|------------|-----------------|
| AIEngine (interface) | load / generate / stop / unload |
| llama.cpp vía FFI | Inferencia GGUF mmap |
| Gemma 1B Q4 (~1–2 GB) | Modelo default local |
| Inference Manager | Modelo residente, KV cache, stream token 1, warm pool |
| Resource Governor | RAM/CPU/GPU/NPU/batería → ajusta contexto/hilos |
| Model Manager | Download HF, checksum, multi-modelo, versiones |

No HTTP interno entre módulos de la app: interfaces + event bus + DI.

## 4. Memoria (capas)

1. Runtime RAM: solo KV + contexto activo  
2. Session cache LRU (límite MB)  
3. Persistente intercambiable: SQLite / JSON / Xata / Postgres / Qdrant…  
4. Storage Manager: internal / SD / USB / remoto  

Historial completo **fuera** de la RAM de inferencia.

## 5. OpenClaw en app

Proceso/lib en el mismo app (no microservicio HTTP local):
- Planner → ¿tool? → execute plugin → resultado → Gemma redacta  
- Plugins sandbox + permisos  
- Scheduler + queue para no bloquear UI  

En web: OpenClaw / agentes siguen siendo microservicios conectados por API/MCP.

## 6. Intercambiabilidad

| Qué | Cómo |
|-----|------|
| Modelo | Model Manager + config (Gemma → Phi → Qwen → …) |
| Agente | Interface Agent; OpenClaw u otro implementa |
| Memoria | MemoryProvider factory |
| Orquestador | URL/API key en config; app solo cliente |

Update de app o de config = sin reescribir núcleo.

## 7. Relación con PARTE 1 / PASO 1–2

- PARTE 1 = sources web React (chat, canvas, files, MCP…).  
- PARTE 2 = arquitectura híbrida + sources **app local** (Flutter + llama.cpp + model manager).  
- PASO 2 visual sigue después de sources completos.  
- Web sigue siendo la interface principal de orquestación; app = complemento offload + offline local.

## 8. Criterio de cierre investigación PARTE 2

- [ ] Sources Flutter llama.cpp / GGUF runtime documentados  
- [ ] Sources chat Flutter streaming documentados  
- [ ] Model download/manager patterns documentados  
- [ ] Mapa: simple→local / escala→web orquestador  
- [ ] 100% piezas nombradas con URL o “custom interface”  

Ver `fromted-research/INVESTIGACION-5-RUNTIME-LOCAL.md`.
