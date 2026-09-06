# UI YAIWES — Auditoría de arquitectura y catálogo OSS 1×1

Fecha de consolidación: 2026-09-06
Contrato operativo: `tel.workflow/v3`
Modo: `FAIL_CLOSED_LOOP`

## Fuente de verdad auditada

Esta consolidación parte de los documentos de arquitectura entregados para UI YAIWES: MAX-SYSTEM-100X-FINAL-1, memoria del Wordflow, arquitectura Virtual Computer multiplataforma/14 objetivos y especificación funcional del Command Center/chat. Un enlace de MAX-SYSTEM estaba duplicado, por lo que el conjunto efectivo fue de cuatro documentos únicos.

## Método aplicado

Se aplicaron 8 pasadas por documento: literal/contrato; funciones; flujo de información; persistencia; fallos/recovery; plataforma+seguridad; reutilización OSS; X-Ray cruzado. Se aplicaron además 12 GOALS entrada→salida y Council-12 para descartar duplicados, agentes innecesarios, segundos schedulers y componentes sin GAP arquitectónico concreto.

## 12 GOALS entrada → salida

1. Chat universal: mensaje/texto/archivo/voz → conversación persistente, streaming, cancelable y recuperable.
2. Work/Artifacts: tarea/documento/código/diseño → artifact separado, editable, versionado y previsualizable.
3. Model Router: tarea+capacidades → proveedor/modelo/key seleccionado con health y failover.
4. Workflow determinista: Master Input → contrato→DAG/FSM→tareas→Judge→estado.
5. Paralelismo: tareas independientes → fan-out→workers/pools→fan-in sin duplicación.
6. Memoria: tarea actual → Minimal Sufficient Context con evidencia y provenance.
7. Persistencia/recovery: estado parcial → checkpoint→restore/resume sin repetir trabajo válido.
8. Sandbox/Virtual Computer: unidad ejecutable → ejecución aislada con CPU/RAM/files/network delimitados.
9. Multiplataforma: misma sesión/proyecto → web+Android+iOS+Windows+Linux según capacidades reales.
10. Herramientas/ventanas: acción autorizada → Files/Terminal/Browser/Linux/Android/Artifact por contratos comunes.
11. Seguridad/IP: secreto/artifact/paquete/sesión → autenticación+cifrado+firmas+permisos+provenance.
12. Verificación: resultado candidato → test+evidence+cross-check+coverage+Judge antes de canonical state.

## Council-12 — decisiones congeladas

1. Stabilize es el único owner del Wordflow; Dagu/redun/otros son donors o referencias.
2. React/Vite cubre Command Center web; Flutter cubre la app nativa Virtual Computer.
3. La UI no posee canonical state.
4. La LLM no escribe directamente memoria canónica.
5. Memory no equivale a vector DB: exige lexical+semantic+tags+graph+temporal+history+evidence.
6. Sandbox remoto y Virtual Computer local son capas diferentes.
7. Mirror y migración son funciones diferentes.
8. Termux queda fuera del CORE; solo podría existir como modo Lite explícitamente autorizado.
9. Agentes adicionales quedan fuera del CORE si no cubren un GAP nuevo.
10. URL privada no sustituye autenticación/autorización.
11. iOS no se promete equivalente a Android; se valida por capacidades reales del host.
12. Ningún repositorio entra por nombre: debe aportar función, contrato, GAP o bloque de código reutilizable.

## Arquitectura consolidada

`WEB/ANDROID/iOS/WINDOWS/LINUX → Command Center React/Vite + Native App Flutter → Session/Project → Chat/Work/Artifacts/Windows → Contract Layer → Stabilize Wordflow → Queues + Memory + Sandbox → Audit/Judge → PASS|GAP → StateDelta/StrategyDelta → Consolidator → Memory + Checkpoint`.

---

# CATÁLOGO OSS AUDITADO 1×1

## A. Backend determinista

### 1. Stabilize CORE — YA PRESENTE
Aporte: workflow durable, stages/DAG, persistencia y reanudación.
Encaje: único propietario del flujo canónico YAIWES.
Límite: ningún segundo scheduler debe gobernar el mismo flujo.
URL: https://github.com/rodmena-limited/stabilize

### 2. Pydantic — YA PRESENTE
Aporte: contratos, modelos tipados, parsing y validación.
Encaje: MasterInput, TaskContract, AgentResult, StateDelta y GAP.
Límite: validar estructura no demuestra que una tarea ocurrió.
URL: https://github.com/pydantic/pydantic

### 3. Starlette — YA PRESENTE
Aporte: ASGI ligero para API, streaming, WebSocket/SSE.
Encaje: Chat API y eventos de progreso.
Límite: transporta; Stabilize controla ejecución.
URL: https://github.com/encode/starlette

### 4. HTTPX — YA PRESENTE
Aporte: cliente HTTP async/sync.
Encaje: RouterAdapter y conectores externos.
Límite: timeouts/retries deben venir de política.
URL: https://github.com/encode/httpx

### 5. rule-engine — YA PRESENTE
Aporte: evaluación declarativa de reglas.
Encaje: Sheriff/Judge/Validator.
Límite: evalúa condiciones; no planifica.
URL: https://github.com/zeroSteiner/rule-engine

### 6. PyCasbin — POLICY
Aporte: autorización basada en políticas.
Encaje: ToolPermissionBroker, proyectos, archivos y acciones API.
Límite: authorization separada del razonamiento LLM.
URL: https://github.com/casbin/pycasbin

### 7. OpenTelemetry Python — OBSERVABILIDAD
Aporte: traces, metrics y correlation IDs.
Encaje: session/run/task/attempt end-to-end.
Límite: observabilidad nunca gobierna el flujo.
URL: https://github.com/open-telemetry/opentelemetry-python

### 8. pytest — TEST
Aporte: unit/integration tests y fixtures.
Encaje: contratos, adapters, state y recovery.
Límite: tests verdes no sustituyen evidencia E2E real.
URL: https://github.com/pytest-dev/pytest

### 9. Hypothesis — TEST
Aporte: property-based testing y state machines.
Encaje: detectar secuencias inesperadas de retry/GAP/checkpoint.
Límite: combinar con pruebas deterministas e integración.
URL: https://github.com/HypothesisWorks/hypothesis

### 10. Dagu — DONOR
Aporte: patrones declarativos de workflow y visualización.
Encaje: YAML/spec→IR y UX de workflows.
Límite: no scheduler paralelo a Stabilize.
URL: https://github.com/dagu-org/dagu

### 11. redun — DONOR
Aporte: hashing, provenance, caching y CallGraph.
Encaje: execution fingerprints y trazabilidad.
Límite: donor de provenance, no workflow owner.
URL: https://github.com/insitro/redun

## B. Chats/workspaces OSS para reutilizar código

### 12. LibreChat — DONOR FUERTE
Aporte: multi-provider chat, Artifacts, MCP, Code Interpreter y autenticación.
Encaje: historial, attachments, provider selection y artifact UX.
Límite: reutilizar módulos; no reemplazar Wordflow/Memory.
URL: https://github.com/danny-avila/LibreChat

### 13. big-AGI — DONOR
Aporte: multi-model, Beam/Merge, streaming, mobile UI, voz/PDF y side panels.
Encaje: comparación de respuestas/modelos y UX móvil.
Límite: interfaz/patrones, no autoridad de ejecución.
URL: https://github.com/enricoros/big-AGI

### 14. Open WebUI — REFERENCIA
Aporte: UI provider-agnostic, herramientas, modelos locales y administración.
Encaje: navegación, settings, RBAC y patrones de chat.
Límite: revisar condiciones/licencia de branding antes de white-label.
URL: https://github.com/open-webui/open-webui

### 15. Jan — DONOR LOCAL
Aporte: chat/modelos locales, API OpenAI-compatible, MCP y desktop.
Encaje: almacenamiento local y separación desktop/server.
Límite: no cubre Virtual Computer ni Memory/Audit completa.
URL: https://github.com/janhq/jan

### 16. Grok Build — DONOR FUERTE
Aporte: workspace, checkpoints, plan/review, diffs, tools, skills/plugins/MCP.
Encaje: patrones Work/Build, workspace y review.
Límite: no convertir su agente en segundo orquestador canónico.
URL: https://github.com/xai-org/grok-build

## C. Chat web, controles, ventanas y Artifacts

### 17. React — CORE WEB
Aporte: componentes para chat, sidebars, modals, selectors y workbench.
Encaje: Command Center.
Límite: canonical state vive en backend.
URL: https://github.com/facebook/react

### 18. Vite — CORE WEB
Aporte: build/dev server/HMR.
Encaje: build system del Command Center.
Límite: no contiene lógica de negocio.
URL: https://github.com/vitejs/vite

### 19. Vercel AI SDK — CORE CANDIDATE
Aporte: streaming UI y abstracción de providers/model messages.
Encaje: evita reescribir streaming/messaging/provider plumbing.
Límite: capa UI/API, no Agent/Workflow owner.
URL: https://github.com/vercel/ai

### 20. Zustand — CORE WEB
Aporte: estado React ligero.
Encaje: selector, settings, paneles y drafts.
Límite: store cliente no es canonical state.
URL: https://github.com/pmndrs/zustand

### 21. TanStack Query — CORE CANDIDATE
Aporte: fetching, cache, refetch, cancellation y server-state sync.
Encaje: health, tasks, models, history y artifacts.
Límite: cache cliente, no persistencia autoritativa.
URL: https://github.com/TanStack/query

### 22. React Virtuoso — CORE CANDIDATE
Aporte: listas virtualizadas, tamaños dinámicos e infinite scrolling.
Encaje: conversaciones largas sin degradar DOM/móvil.
Límite: historial real sigue en storage.
URL: https://github.com/petyosi/react-virtuoso

### 23. Radix UI — CORE/DONOR
Aporte: Dialog, Select, Dropdown, Tooltip y primitives accesibles.
Encaje: ModelSelector, Add AI, Settings, permissions y menus.
Límite: styling YAIWES vive encima.
URL: https://github.com/radix-ui/primitives

### 24. shadcn/ui — DONOR FUERTE
Aporte: código reusable de dialogs, buttons, drawers, cards, inputs y sidebars.
Encaje: reduce código UI nuevo.
Límite: el código copiado pasa a mantenimiento propio.
URL: https://github.com/shadcn-ui/ui

### 25. Tailwind CSS — CORE WEB
Aporte: responsive, dark mode, design tokens y estilos dinámicos.
Encaje: móvil/tablet/escritorio y sistema visual.
Límite: styling únicamente.
URL: https://github.com/tailwindlabs/tailwindcss

### 26. react-markdown — CORE
Aporte: renderizado React de Markdown.
Encaje: mensajes, documentos y artifacts.
Límite: sanitizar contenido no confiable.
URL: https://github.com/remarkjs/react-markdown

### 27. Shiki — CORE/ALT PRISM
Aporte: syntax highlighting de alta fidelidad.
Encaje: respuestas de código y Artifact/Code.
Límite: elegir Shiki o Prism según renderer; no duplicar.
URL: https://github.com/shikijs/shiki

### 28. CodeMirror 6 — CORE ARTIFACT
Aporte: editor de código extensible web.
Encaje: panel código/artifact compatible con móvil.
Límite: editor, no sandbox.
URL: https://github.com/codemirror/dev

### 29. Sandpack — CORE ARTIFACT
Aporte: editor+preview/ejecución web en sandbox del navegador.
Encaje: experiencia Build/Artifact sin crear preview desde cero.
Límite: no sustituye sandbox Linux completo.
URL: https://github.com/codesandbox/sandpack

### 30. xterm.js — CORE TERMINAL UI
Aporte: emulador terminal embebible web.
Encaje: Terminal Window→WebSocket/PTY→GuestBridge.
Límite: shell real vive en el guest.
URL: https://github.com/xtermjs/xterm.js

### 31. XYFlow / React Flow — CORE
Aporte: canvas de nodos/edges.
Encaje: DAG, tareas y dependencias visuales.
Límite: visualiza/edita; Stabilize ejecuta.
URL: https://github.com/xyflow/xyflow

### 32. Rete.js — CORE/DONOR
Aporte: visual programming/dataflow.
Encaje: editor visual JSON/flow.
Límite: exportar a IR validado antes de ejecutar.
URL: https://github.com/retejs/rete

### 33. PixiJS — UI
Aporte: canvas/WebGL y efectos visuales.
Encaje: glow, activity visualization y estados activos.
Límite: no gobierna estado funcional.
URL: https://github.com/pixijs/pixijs

### 34. GSAP — UI/REVISAR LICENCIA
Aporte: timelines de animación y transiciones.
Encaje: paneles, mensajes y cambios de modo.
Límite: revisar licencia antes de distribución comercial.
URL: https://github.com/greensock/GSAP

### 35. Lucide — UI
Aporte: iconos consistentes.
Encaje: copy, stop, run, files, health, retry, permissions.
Límite: presentación únicamente.
URL: https://github.com/lucide-icons/lucide

### 36. React-Toastify — UI
Aporte: notificaciones toast.
Encaje: copy/save/failover/upload/error feedback.
Límite: eventos críticos también deben persistir.
URL: https://github.com/fkhadra/react-toastify

### 37. SortableJS — UI
Aporte: drag/drop y reordenamiento.
Encaje: cola/tareas visuales.
Límite: cada movimiento debe ser mutation validada.
URL: https://github.com/SortableJS/Sortable

### 38. Chart.js — UI
Aporte: gráficas y series de estado.
Encaje: API Health, throughput, queue depth, latency y recursos.
Límite: read-only telemetry.
URL: https://github.com/chartjs/Chart.js

### 39. Excalidraw — ARTIFACT OPCIONAL
Aporte: whiteboard/diagram canvas.
Encaje: diagramas de arquitectura y artifacts visuales.
Límite: no representa necesariamente DAG ejecutable.
URL: https://github.com/excalidraw/excalidraw

## D. Archivos/documentos

### 40. Uppy — CORE CANDIDATE
Aporte: uploads modulares, progreso y recuperación.
Encaje: imágenes/audio/documentos/attachments.
Límite: storage/policy sigue en backend.
URL: https://github.com/transloadit/uppy

### 41. tusd — CORE CANDIDATE
Aporte: servidor de uploads reanudables.
Encaje: archivos grandes en conexiones móviles inestables.
Límite: puede omitirse si storage elegido ya resuelve resumability.
URL: https://github.com/tus/tusd

### 42. PDF.js — CORE ARTIFACT
Aporte: visor/render PDF web.
Encaje: preview de adjuntos y resultados.
Límite: extracción semántica la hace ingestion layer.
URL: https://github.com/mozilla/pdf.js

### 43. docx — CORE EXPORT
Aporte: generación/modificación DOCX JS/TS.
Encaje: exportar resultados del chat.
Límite: no usar para comprensión semántica.
URL: https://github.com/dolanmiu/docx

### 44. Mammoth.js — DONOR/PREVIEW
Aporte: DOCX→HTML.
Encaje: preview Office dentro de Work/Artifact.
Límite: no es renderer pixel-perfect de Word.
URL: https://github.com/mwilliamson/mammoth.js

### 45. jsPDF — CORE EXPORT
Aporte: generación PDF cliente.
Encaje: exportar conversaciones/artifacts.
Límite: documentos complejos pueden requerir renderer server-side.
URL: https://github.com/parallax/jsPDF

## E. Persistencia y Memory/Audit

### 46. Supabase — CORE CANDIDATE
Aporte: Postgres, Auth, Storage, realtime y RLS.
Encaje: conversaciones, tasks, notes, files y permisos.
Límite: acceso siempre por contratos del sistema.
URL: https://github.com/supabase/supabase

### 47. pgvector — CORE
Aporte: vector similarity en PostgreSQL.
Encaje: semantic retrieval junto al estado relacional.
Límite: no implementa lexical+graph+evidence por sí solo.
URL: https://github.com/pgvector/pgvector

### 48. PGMQ — QUEUE OPTION
Aporte: message queue sobre PostgreSQL.
Encaje: cola persistente sin servidor extra en MVP.
Límite: benchmark antes de usar en cargas extremas.
URL: https://github.com/pgmq/pgmq

### 49. Qdrant — CORE MEMORY CANDIDATE
Aporte: dense+sparse+multi-vector+filtros+hybrid fusion.
Encaje: retrieval semántico y sparse con metadata.
Límite: Evidence Graph/canonical state siguen separados.
URL: https://github.com/qdrant/qdrant

### 50. FastEmbed — CORE MEMORY
Aporte: embeddings, sparse BM25 y soporte de reranking.
Encaje: reduce código propio de retrieval.
Límite: registrar modelo/versión/provenance.
URL: https://github.com/qdrant/fastembed

### 51. Tantivy — CORE/ALT LEXICAL
Aporte: full-text Rust y scoring BM25.
Encaje: lexical retrieval embebido/local.
Límite: elegirlo frente a sparse Qdrant/ParadeDB según deployment.
URL: https://github.com/quickwit-oss/tantivy

### 52. Oxigraph — CORE EVIDENCE GRAPH CANDIDATE
Aporte: RDF store + SPARQL.
Encaje: Claim→Source→Evidence→Artifact→Requirement y relaciones.
Límite: no usar como vector store.
URL: https://github.com/oxigraph/oxigraph

### 53. Tree-sitter — CORE CHUNKING
Aporte: parsing incremental y syntax trees.
Encaje: chunking por función/clase/símbolo.
Límite: sintaxis, no semántica.
URL: https://github.com/tree-sitter/tree-sitter

### 54. Docling — CORE DOCUMENT INGESTION
Aporte: estructura documental y chunking jerárquico con metadata.
Encaje: PDF/DOCX largos→unidades estructuradas→Memory.
Límite: conservar Raw Source original.
URL: https://github.com/docling-project/docling

### 55. Apache Tika — DONOR/INGESTION
Aporte: detección de formatos, metadata y extracción de texto.
Encaje: fallback universal de ingestion.
Límite: Docling es preferible para estructura rica.
URL: https://github.com/apache/tika

### 56. DuckDB — ANALYTICS CANDIDATE
Aporte: SQL analítico embebido.
Encaje: logs, artifacts, historial, CSV/Parquet.
Límite: no canonical transaction store.
URL: https://github.com/duckdb/duckdb

### 57. sqlite-vec — EDGE MEMORY ALT
Aporte: vector search sobre SQLite.
Encaje: retrieval local pequeño/offline en dispositivo.
Límite: no Memory global.
URL: https://github.com/asg017/sqlite-vec

### 58. PGlite — WEB/OFFLINE ALT
Aporte: PostgreSQL embebible en WASM/browser.
Encaje: estado offline/local web sincronizable.
Límite: no reemplaza Postgres central en multiusuario grande.
URL: https://github.com/electric-sql/pglite

## F. Router, APIs y herramientas

### 59. LiteLLM — CORE ROUTER
Aporte: interfaz común de proveedores/modelos.
Encaje: routing, keys, health y model registry.
Límite: Policy/Sheriff decide autorización.
URL: https://github.com/BerriAI/litellm

### 60. MCP Python SDK — CORE TOOL ADAPTER
Aporte: protocolo tools/resources/prompts para Python.
Encaje: Tool Registry y adapters comunes.
Límite: PermissionBroker siempre delante de tools sensibles.
URL: https://github.com/modelcontextprotocol/python-sdk

### 61. MCP TypeScript SDK — CORE TOOL ADAPTER
Aporte: MCP para TS/Node.
Encaje: bridges web y herramientas TypeScript.
Límite: no exponer tools sensibles directamente al navegador.
URL: https://github.com/modelcontextprotocol/typescript-sdk

### 62. Loguru — BACKEND LOG
Aporte: logging Python sencillo/estructurable.
Encaje: errores y eventos del backend.
Límite: integrar correlation IDs/OpenTelemetry.
URL: https://github.com/Delgan/loguru

### 63. workerd — EDGE/DONOR
Aporte: runtime OSS del modelo Workers.
Encaje: estudiar proxy/edge execution y routing.
Límite: deployment gestionado es servicio externo.
URL: https://github.com/cloudflare/workerd

## G. Virtual Computer Android/iOS/Windows/Linux

### 64. QEMU — CORE
Aporte: virtualización/emulación y QCOW2/snapshots.
Encaje: backend universal/fallback y desktop.
Límite: preferir aceleración nativa cuando exista.
URL: https://github.com/qemu/qemu

### 65. crosvm — CORE ANDROID/LINUX
Aporte: VMM Rust y dispositivos virtio.
Encaje: primera ruta Android junto a AVF.
Límite: no asumir soporte idéntico multiplataforma.
URL: https://github.com/google/crosvm

### 66. Android Virtualization Framework — CORE ANDROID
Aporte: VMs protegidas, lifecycle y host↔guest Android.
Encaje: ruta oficial Android antes de fallback QEMU.
Límite: depende de hardware/versión/capacidades.
URL: https://android.googlesource.com/platform/packages/modules/Virtualization/

### 67. Flutter — CORE APP
Aporte: UI común Android/iOS/Windows/Linux/macOS.
Encaje: Window Manager, Chat, Files, Terminal y Settings.
Límite: Flutter es UI, no motor Linux/Android guest.
URL: https://github.com/flutter/flutter

### 68. flutter_rust_bridge — CORE
Aporte: bindings Flutter/Dart↔Rust.
Encaje: Flutter→FFI/IPC→Rust Core.
Límite: contratos estrechos y tipados.
URL: https://github.com/fzyzcjy/flutter_rust_bridge

### 69. UTM — DONOR APPLE
Aporte: QEMU integrado en app y UX de VM.
Encaje: referencia iOS/macOS para VM state/images/UI.
Límite: iOS tiene restricciones distintas a Android.
URL: https://github.com/utmapp/UTM

### 70. Wayland — CORE GUEST DISPLAY
Aporte: protocolo display/input Linux.
Encaje: apps guest→compositor→display bridge.
Límite: no dibuja por sí solo la UI host.
URL: https://gitlab.freedesktop.org/wayland/wayland

### 71. Weston / libweston — CORE/DONOR
Aporte: compositor Wayland de referencia y piezas embebibles.
Encaje: evita construir compositor inicial desde cero.
Límite: UI host sigue siendo Flutter.
URL: https://gitlab.freedesktop.org/wayland/weston

### 72. Mesa — CORE GPU
Aporte: OpenGL/Vulkan userspace Linux.
Encaje: render de apps gráficas guest.
Límite: requiere backend virtual GPU compatible.
URL: https://gitlab.freedesktop.org/mesa/mesa

### 73. gfxstream — CORE GPU CANDIDATE
Aporte: streaming de APIs gráficas guest↔host.
Encaje: DisplayBridge/GPU integration.
Límite: validar plataforma con prototipo.
URL: https://github.com/google/gfxstream

### 74. virglrenderer — ALT GPU
Aporte: virtio-gpu/OpenGL virtualization.
Encaje: backend alternativo para Linux guest.
Límite: elegir ruta GPU según plataforma.
URL: https://gitlab.freedesktop.org/virgl/virglrenderer

### 75. virtiofsd — CORE FILE BRIDGE
Aporte: compartir directorios host↔guest mediante virtio-fs.
Encaje: workspace compartido acotado.
Límite: roots y permisos pasan PermissionBroker.
URL: https://gitlab.com/virtio-fs/virtiofsd

### 76. Tokio — CORE RUST
Aporte: async I/O, red, timers y tasks Rust.
Encaje: managers/event loops del Rust Core.
Límite: scheduling técnico, no Wordflow semántico.
URL: https://github.com/tokio-rs/tokio

### 77. tokio-vsock — CORE GUEST BRIDGE
Aporte: sockets vsock async Rust.
Encaje: Rust Core↔Linux/Android VM.
Límite: capability/auth checks encima.
URL: https://github.com/rust-vsock/tokio-vsock

### 78. sysinfo — CORE RESOURCE
Aporte: CPU, memoria, procesos y system info.
Encaje: ResourceManager/ExecutionMonitor.
Límite: batería/termales pueden requerir adapters nativos.
URL: https://github.com/GuillaumeGomez/sysinfo

### 79. scrcpy — DONOR FUERTE MIRROR
Aporte: display/control Android por USB/TCP.
Encaje: patrones Mirror/Input/Clipboard/virtual display.
Límite: YAIWES necesita generalizar a otros guests.
URL: https://github.com/Genymobile/scrcpy

### 80. libdatachannel — CORE CANDIDATE MIRROR
Aporte: WebRTC/DataChannel nativo.
Encaje: transporte video/input/eventos/control.
Límite: seguridad/autorización encima.
URL: https://github.com/paullouisageneau/libdatachannel

## H. Paralelismo MAX-SYSTEM

### 81. Ray — COMPUTE POOL
Aporte: distributed tasks, actors y object store.
Encaje: fan-out computacional o pools CPU/GPU.
Límite: no Wordflow owner.
URL: https://github.com/ray-project/ray

### 82. Taskiq — QUEUE/WORKER OPTION
Aporte: task queue Python async y múltiples brokers.
Encaje: pools I/O/workers externos controlados por Stabilize.
Límite: canonical workflow no vive en Taskiq.
URL: https://github.com/taskiq-python/taskiq

### 83. Valkey — STREAM/CACHE OPTION
Aporte: key-value/streams para realtime/cache/colas ligeras.
Encaje: patrón Redis Streams del MAX-SYSTEM.
Límite: no guardar única copia del estado crítico.
URL: https://github.com/valkey-io/valkey

### 84. NATS — EVENT BUS ALT
Aporte: messaging rápido cloud/edge.
Encaje: EventBus entre workers/VPS/dispositivos.
Límite: elegir bus por necesidad; no desplegar varios sin razón.
URL: https://github.com/nats-io/nats-server

### 85. Debezium — CDC
Aporte: Change Data Capture.
Encaje: patrón Outbox+CDC del MAX-SYSTEM.
Límite: añadir solo si outbox simple no basta.
URL: https://github.com/debezium/debezium

## I. Multi-sandbox

### 86. Firecracker — SERVER SANDBOX
Aporte: microVMs aisladas y snapshots.
Encaje: ejecución remota/efímera segura.
Límite: no VMM principal de Android/iOS app.
URL: https://github.com/firecracker-microvm/firecracker

### 87. gVisor — SERVER SANDBOX ALT
Aporte: aislamiento container con userspace kernel.
Encaje: alternativa a microVM cuando se requiere menor peso.
Límite: escoger según threat model.
URL: https://github.com/google/gvisor

### 88. Wasmtime — PLUGIN SANDBOX
Aporte: runtime WebAssembly con capabilities controlables.
Encaje: plugins/tools pequeños aislados.
Límite: no sustituye Linux VM completa.
URL: https://github.com/bytecodealliance/wasmtime

### 89. nsjail — LINUX SANDBOX
Aporte: namespaces, cgroups, rlimits y seccomp.
Encaje: comandos Linux con aislamiento adicional.
Límite: Linux-only.
URL: https://github.com/google/nsjail

### 90. bubblewrap — LINUX SANDBOX ALT
Aporte: sandbox unprivileged con namespaces.
Encaje: herramientas locales pequeñas.
Límite: no microVM; threat model distinto.
URL: https://github.com/containers/bubblewrap

### 91. Moby — CONTAINER DONOR
Aporte: primitives/engine de containers.
Encaje: Docker+bind mount del sandbox VPS.
Límite: containers y Virtual Computer local son capas distintas.
URL: https://github.com/moby/moby

## J. Seguridad, cifrado y supply chain

### 92. OpenBao — CORE SECURITY
Aporte: secretos cifrados, leases, revocation y encryption service.
Encaje: API keys, DB creds, signing credentials y servicios externos.
Límite: proteger bootstrap/root credentials.
URL: https://github.com/openbao/openbao

### 93. SOPS — CORE DEVSEC
Aporte: cifrado de YAML/JSON/ENV/BINARY compatible con Git.
Encaje: configuración secreta sin plaintext commits.
Límite: claves maestras fuera del repo.
URL: https://github.com/getsops/sops

### 94. SQLCipher — CORE LOCAL SECURITY
Aporte: SQLite AES-256, tamper detection y KDF.
Encaje: conversaciones/cache/checkpoints locales cifrados.
Límite: la clave debe almacenarse de forma segura.
URL: https://github.com/sqlcipher/sqlcipher

### 95. flutter_secure_storage — CORE APP SECURITY
Aporte: almacenamiento seguro sobre mecanismos nativos.
Encaje: session tokens, device keys y secret refs.
Límite: no almacenar API keys maestras/código fuente completo.
URL: https://github.com/juliansteenbakker/flutter_secure_storage

### 96. libsodium — CRYPTO PRIMITIVES
Aporte: authenticated encryption, hashing, signatures y key exchange.
Encaje: payloads/packages donde APIs del SO no alcancen.
Límite: usar APIs high-level, no criptografía propia.
URL: https://github.com/jedisct1/libsodium

### 97. age — FILE ENCRYPTION
Aporte: cifrado moderno de archivos.
Encaje: snapshots/backups/artifacts sensibles.
Límite: diseñar gestión/recovery de claves.
URL: https://github.com/FiloSottile/age

### 98. Cosign — SUPPLY CHAIN
Aporte: firma/verificación de containers, binaries y blobs.
Encaje: packages, builds, VM images y releases.
Límite: firma prueba integridad/procedencia, no ausencia de bugs.
URL: https://github.com/sigstore/cosign

### 99. in-toto — SUPPLY CHAIN/PROVENANCE
Aporte: evidencia firmada de pasos de build/deployment.
Encaje: Ledger y Requirement→Task→Artifact→Evidence.
Límite: definir layouts/policies concretos.
URL: https://github.com/in-toto/in-toto

### 100. Python-TUF — SECURE UPDATE
Aporte: verificación robusta de metadata de actualización.
Encaje: protege updater contra rollback/freeze/repos comprometidos.
Límite: asegura artefactos; no instala por sí mismo.
URL: https://github.com/theupdateframework/python-tuf

### 101. Trivy — SECURITY SCAN
Aporte: escaneo de vulnerabilidades, secrets y configs.
Encaje: gate CI antes de firmar/distribuir.
Límite: scanner, no runtime protection.
URL: https://github.com/aquasecurity/trivy

### 102. Syft — SBOM
Aporte: inventario SBOM de paquetes/filesystems/images.
Encaje: saber exactamente qué OSS/version/licencia entra en cada release.
Límite: combinar con scanner y firmas.
URL: https://github.com/anchore/syft

## K. Voz y comunicaciones

### 103. whisper.cpp — STT LOCAL
Aporte: speech-to-text local en C/C++.
Encaje: voz→transcript sin nube obligatoria.
Límite: modelos grandes consumen recursos.
URL: https://github.com/ggml-org/whisper.cpp

### 104. Piper — TTS LOCAL / REVISAR GPL
Aporte: síntesis de voz local rápida.
Encaje: respuestas habladas sin cloud obligatorio.
Límite: revisar GPL-3.0 antes de integrar/distribuir.
URL: https://github.com/OHF-Voice/piper1-gpl

### 105. RNNoise — VOICE DSP
Aporte: reducción de ruido neural realtime.
Encaje: micrófono→RNNoise→STT.
Límite: preprocesa; no transcribe.
URL: https://github.com/xiph/rnnoise

### 106. LiveKit — REALTIME
Aporte: WebRTC audio/video/data, SDKs y E2EE capabilities.
Encaje: voz live y sesiones multi-dispositivo.
Límite: realtime transport, no Workflow/Memory.
URL: https://github.com/livekit/livekit

### 107. ntfy — NOTIFICATIONS
Aporte: push notifications self-hostable.
Encaje: task complete/fail/HITL al móvil/desktop.
Límite: notificación no es canonical state.
URL: https://github.com/binwiederhier/ntfy

### 108. Apprise — NOTIFICATION ADAPTER
Aporte: capa unificada para múltiples servicios.
Encaje: Telegram y otros canales sin adapter individual.
Límite: credentials por secret_ref.
URL: https://github.com/caronc/apprise

## L. Observabilidad

### 109. Prometheus — METRICS
Aporte: métricas, queries y alerting ecosystem.
Encaje: latency, queue depth, retries, health, CPU/RAM.
Límite: no decide el siguiente nodo.
URL: https://github.com/prometheus/prometheus

### 110. Grafana — DASHBOARD
Aporte: dashboards de metrics/logs/traces.
Encaje: panel técnico del backend y workers.
Límite: observación, no control de Wordflow.
URL: https://github.com/grafana/grafana

### 111. Loki — LOG STORAGE
Aporte: agregación/indexación de logs.
Encaje: logs consultables por RunID/TaskID.
Límite: evidencia crítica también en Ledger/State.
URL: https://github.com/grafana/loki

## M. Simulación y verificación

### 112. Vitest — TEST
Aporte: unit/integration tests integrado con Vite.
Encaje: Zustand stores, validators y frontend logic.
Límite: complementarlo con browser tests.
URL: https://github.com/vitest-dev/vitest

### 113. React Testing Library — TEST
Aporte: pruebas centradas en interacción real de usuario.
Encaje: botones, modals, selectors y 85 funciones del chat.
Límite: backend real requiere integración/E2E.
URL: https://github.com/testing-library/react-testing-library

### 114. MSW — TEST
Aporte: mocks REST/GraphQL/WebSocket a nivel request.
Encaje: 200/401/403/429/500, timeout, streaming y recovery.
Límite: mocks no sustituyen último E2E real.
URL: https://github.com/mswjs/msw

### 115. Playwright — TEST + SCRAPING
Aporte: automatización Chromium/Firefox/WebKit.
Encaje: scraping y pruebas reales de funciones del web chat.
Límite: browser automation sandboxed y separada del Wordflow.
URL: https://github.com/microsoft/playwright

### 116. fast-check — TEST
Aporte: property/model-based testing JS/TS.
Encaje: registry, failover, task state y FSM frontend.
Límite: invariantes deben definirse explícitamente.
URL: https://github.com/dubzzz/fast-check

### 117. k6 — TEST LOAD
Aporte: carga/performance testing.
Encaje: streaming, health, queues, router y fan-out.
Límite: benchmark sobre infraestructura real.
URL: https://github.com/grafana/k6

### 118. Toxiproxy — CHAOS TEST
Aporte: latencia, cortes y fallos de red deterministas.
Encaje: reconnect/retry/failover/recovery.
Límite: desarrollo/CI, no proxy producción.
URL: https://github.com/Shopify/toxiproxy

### 119. axe-core — ACCESSIBILITY TEST
Aporte: auditoría WCAG/ARIA automatizada.
Encaje: selectors, dialogs, keyboard, mobile y screen readers.
Límite: requiere además revisión manual.
URL: https://github.com/dequelabs/axe-core

## N. Alternativas mantenidas en banco

### 120. ParadeDB — ALT SEARCH
Aporte: búsqueda/full-text/BM25 alrededor de PostgreSQL.
Encaje: mantener más Retrieval dentro de Postgres.
Límite: comparar con Tantivy/Qdrant antes de añadir índice nuevo.
URL: https://github.com/paradedb/paradedb

### 121. LanceDB — ALT EMBEDDED RETRIEVAL
Aporte: vector/retrieval embebible.
Encaje: artifacts multimodales/local retrieval.
Límite: no añadir si Qdrant+pgvector ya cubren el caso.
URL: https://github.com/lancedb/lancedb

### 122. Meilisearch — ALT SEARCH
Aporte: búsqueda orientada a UX y baja latencia.
Encaje: historial, archivos y command palette.
Límite: no Evidence Graph ni canonical memory.
URL: https://github.com/meilisearch/meilisearch

### 123. Typesense — ALT SEARCH
Aporte: full-text/typo-tolerant search.
Encaje: alternativa para History/Projects/Artifacts.
Límite: elegir frente a Meilisearch según benchmark.
URL: https://github.com/typesense/typesense

### 124. Unstructured — ALT INGESTION
Aporte: ETL/partitioning de documentos heterogéneos.
Encaje: fallback frente a Docling/Tika para tipos difíciles.
Límite: routing por formato; no tres pipelines activos sin criterio.
URL: https://github.com/Unstructured-IO/unstructured

---

## Componentes explícitamente fuera del CORE actual

Termux, OpenCode, smolagents, Aider, CrewAI, OpenHands, Cua, Browser Use, open-browser-use, n8n, droidVNC-NG y JupyterLab no entran por simple utilidad o porque sean mencionados: requieren un GAP nuevo y verificable. Tauri queda como alternativa mientras Flutter siga siendo la decisión nativa principal. Monaco no es candidato principal para smartphone/web; CodeMirror encaja mejor con móvil.

## Criterio de cierre

`repo encontrado ≠ componente integrado`
`componente descargado ≠ wired`
`import presente ≠ PASS`

El cierre técnico posterior exige: descarga/código real → revisión licencia/SHA → adapter → wiring → unit/contract tests → recovery/chaos/E2E → evidence → VERIFIED_CLOSED.
