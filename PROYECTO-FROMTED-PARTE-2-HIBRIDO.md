# PROYECTO FROMTED — PARTE 2: ARQUITECTURA HÍBRIDA WEB + APP LOCAL

Fecha: 2026-07-27 21:50 -05  
Estado: ACTIVO — extensión de la spec cerrada (no la reemplaza)  
Depende de: `PROYECTO-FROMTED.md` (CERRADA) + PARTE-1 catálogo

## 1. Principio

FROMTED no es solo web ni solo app.

| Capa | Dónde vive | Qué hace |
|------|------------|----------|
| **Web / orquestador** | Vercel + VPS + APIs proveedores | Cerebro: tareas largas, razonamiento alto, agentes potentes, tools deterministas 90%, plan de pago |
| **App UI (PC/móvil)** | Flutter (o shell nativo) descargable | Complemento: offload de preguntas cortas / sistema / chat simple con **Gemma 1B Q4 local** |
| **Escalado** | Session Controller | Si la tarea es simple → runtime local; si escala → dispara orquestador web + agentes + APIs |

La UI **nunca** contiene lógica de IA. Solo paneles + Session Controller.

## 2. Runtime local

| Componente | Responsabilidad |
|------------|-----------------|
| AIEngine (interface) | load / generate / stop / unload |
| llama.cpp vía FFI | Inferencia GGUF mmap |
| Gemma 1B Q4 (~1–2 GB) | Modelo default local |
| Inference Manager | Modelo residente, KV cache, stream token 1, warm pool |
| Resource Governor | RAM/CPU/GPU/NPU/batería → ajusta contexto/hilos |
| Model Manager | Download HF, checksum, multi-modelo, versiones |

No HTTP interno entre módulos de la app: interfaces + event bus + DI.

## 3. Memoria

1. Runtime RAM: solo KV + contexto activo  
2. Session cache LRU (límite MB)  
3. Persistente intercambiable: SQLite / JSON / Xata / Postgres / Qdrant…  
4. Storage Manager: internal / SD / USB / remoto

## 4. OpenClaw en app

Proceso/lib en el mismo app (no microservicio HTTP local): Planner → tool → execute plugin → resultado → Gemma redacta. Plugins sandbox + permisos y scheduler + queue para no bloquear UI.

En web: OpenClaw / agentes siguen siendo microservicios conectados por API/MCP.

## 5. Intercambiabilidad

Modelo mediante Model Manager + config; agente mediante Interface Agent; memoria mediante MemoryProvider; orquestador mediante URL/API key en config.

## 6. Relación con PARTE 1 / PASO 1–2

PARTE 1 = sources web React (chat, canvas, files, MCP). PARTE 2 = arquitectura híbrida + sources app local (Flutter + llama.cpp + model manager). PASO 2 visual sigue después de sources completos.

FIN PARTE 2.
