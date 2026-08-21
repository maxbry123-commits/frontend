# INVESTIGACIÓN 5 — Runtime local app (Flutter + llama.cpp + GGUF)

Fecha: 2026-07-27 21:50 -05  
Objetivo: 100% sources para complemento app (PARTE 2 híbrida)

---

## A. Motor llama.cpp / GGUF en Flutter

| # | Nombre | URL | Encaje |
|---|--------|-----|--------|
| 74 | ggml-org/llama.cpp | https://github.com/ggml-org/llama.cpp | Motor C++ GGUF estándar |
| 75 | Telosnex/fllama | https://github.com/Telosnex/fllama | llama.cpp Flutter multiplataforma + OpenAI compat |
| 76 | lib_llama_cpp (pub) | https://pub.dev/packages/lib_llama_cpp | Facade + server local OpenAI-shaped |
| 77 | Llama-Flutter (Android) | https://github.com/dragneel2074/Llama-Flutter | Android GGUF + Vulkan |
| 78 | llm_llamacpp (pub) | https://pub.dev/packages/llm_llamacpp | Stream + multi-OS + model mgmt hooks |
| 79 | llamafu | https://github.com/neul-labs/llamafu (docs pub) | FFI mobile local AI |
| 80 | maathai_llamma | https://pub.dev/packages/maathai_llamma | Plugin Android offline |

**Prioritario tentativo:** fllama o lib_llama_cpp (stream + multiplataforma + API OpenAI-local).

---

## B. Chat UI Flutter (stream, historial)

| # | Nombre | URL | Encaje |
|---|--------|-----|--------|
| 81 | flyerhq/flutter_chat_ui | https://github.com/flyerhq/flutter_chat_ui | Chat UI modular cross-platform + stream message |
| 82 | PradyX/pocket_llm | https://github.com/PradyX/pocket_llm | App local GGUF + stream + model download |
| 83 | mhingston/openchat | https://github.com/mhingston/openchat | Chat Flutter multi-provider + historial |
| 84 | extrawest/local-llm-flutter-chat | https://github.com/extrawest/local-llm-flutter-chat | Ollama/llama.cpp/LM Studio client |
| 85 | stream-chat-flutter | https://github.com/GetStream/stream-chat-flutter | SDK chat rico (ref UX; backend Stream) |

---

## C. Model manager / download GGUF

| # | Nombre | URL | Encaje |
|---|--------|-----|--------|
| 86 | pocket_llm (arriba) | incluye download + checksum GGUF | Patrón app |
| 87 | llm_llamacpp | HF download + discovery + metadata GGUF | |
| 88 | hfdesk / topics model-manager | https://github.com/topics/model-manager | Índice gestores locales |
| — | HuggingFace Hub API | descarga resumible GGUF | Implementación Model Manager |

Checksum + multi-modelo + swap = **custom** sobre estos patrones (interface ModelManager).

---

## D. Memoria local / SQLite Flutter

| Pieza | Enfoque |
|-------|---------|
| SQLite | `sqflite` / `drift` (estándar Flutter) |
| JSON files | path_provider + dart:io |
| Remoto | mismos providers PARTE 1 (Xata/Postgres) vía API |

No requiere repo extra crítico; interface MemoryProvider.

---

## E. Mapa simple → local / escala → web

| Señal (Session Controller) | Destino |
|----------------------------|---------|
| Pregunta corta / info sistema / offline | AIEngine local (Gemma 1B Q4) |
| Razonamiento largo / tools / multi-agente / pago | Cliente orquestador web + agentes + APIs |
| Tool local (calendario, FS device) | OpenClaw plugins sandbox |
| Tool pesado / VPS | Orquestador web |

Heurística = reglas config (longitud prompt, keywords, flag usuario “forzar cloud”, plan activo).

---

## F. Cobertura PARTE 2

| Pieza arquitectura | Source / plan |
|--------------------|---------------|
| UI paneles app | flutter_chat_ui + pantas FROMTED web |
| AIEngine + stream | fllama / lib_llama_cpp / llm_llamacpp |
| GGUF Gemma 1B Q4 | HF GGUF + Model Manager |
| mmap / Resource Governor | llama.cpp nativo + custom governor |
| OpenClaw lib | agents/OpenClaw inventory + interface Agent |
| Event bus / DI | custom (dart) |
| Orquestador cliente | HTTPS al backend web ya definido |
| Intercambiabilidad modelo/agente | config + interfaces |

**Huecos de URL: 0 para piezas nombradas.**  
Custom documentado: Governor, Session routing rules, DI container, Plugin sandbox API.

---

## G. ¿Más investigación?

Opcional posterior (no bloquea 100% diseño):
- Gemma 1B Q4 GGUF **URL exacta de release** en HF (elegir quant al construir Model Manager)
- NPU Android (MediaTek/Qualcomm) backends específicos llama.cpp

**I5 cierra el runtime local al 100% para consolidar.**
