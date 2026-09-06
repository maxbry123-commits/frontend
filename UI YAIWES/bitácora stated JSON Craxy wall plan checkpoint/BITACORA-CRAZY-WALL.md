# BITÁCORA CRAZY WALL — Integración modular UI YAIWES

## UI-PLUG-0001 — P01 VERIFIED_CLOSED
Inventario/provenance/dedup 14/14 con read-back independiente.

## UI-PLUG-0002 — SOCKET UNIVERSAL
Commit `4960005c12668e9ef843e1a42b842989cca6e338`: contract/catalog/registry/mount_guard/loader separados; Stabilize único workflow owner.

## UI-PLUG-0003 — P02A STABILIZE
Adapter/DI publicado; tests con FakeOrchestrator PASS; ejecución real pendiente por bloqueo de entorno. `CLOSED_UNVERIFIED_WITH_FLAG`.

## UI-PLUG-0004 — P02B PYDANTIC
Commit `9cc1d0a2e5876b0f87a36a297c65c422be36b7e6`: adapter + vendor. Fuente exige `2.14.0b1/core 2.48.0`; runtime local `2.13.4/core 2.46.4`; rechazo fail-closed. `CLOSED_UNVERIFIED_WITH_VERSION_FLAG`.

## UI-PLUG-0005 — P02C RULE ENGINE
Cinco búsquedas completadas. Fuente `https://github.com/zeroSteiner/rule-engine`, commit `c166666f66acabfa42856639812a3c20ae04da60`, versión `5.0.3`, code tree `3ca8717fb4ce3561b1e76053afc487061c76cfe3`. Commit adapter/vendor `a1e6e4a4ac595a7c29e04bbdb150e3c226d116f5`; read-back PASS; ejecución real pendiente por entorno sin paquete/red. `CLOSED_UNVERIFIED_WITH_EXECUTION_FLAG`.

## UI-PLUG-0006 — P03 CINCO BÚSQUEDAS
Revisados componentes UI, frontend completo, agentes, router inteligente universal y osquestador auditor. No apareció adapter HTTPX/Starlette canónico reutilizable.

## UI-PLUG-0007 — P03 HTTPX
Fuente `https://github.com/encode/httpx`, commit `b5addb64f0161ff6bfe94c124ef76f6a1fba5254`, versión `0.28.1`, vendor tree `21eaf49210613909be2f7a864389a312a484d0eb`. Runtime local también `0.28.1`; petición real sin red mediante `MockTransport` PASS. Adapter `httpx.transport` publicado en `85a3f758a4a6228e0d5d030a544365ccdef0a198`.

## UI-PLUG-0008 — P03 STARLETTE
Fuente `https://github.com/Kludex/starlette`, commit `0fcaff1d1e1d16a702a06b40d20092cc9d84d4a3`, versión `1.6.0`, vendor tree `820b2cdde800811062b2be43abd909e27b38854f`. Runtime local `0.50.0`; factory rechaza mismatch. Adapter `starlette.asgi` publicado en el mismo commit `85a3f758...`.

## UI-PLUG-0009 — P03 CLASSIFICATION
HTTPX subnode `VERIFIED_RUNTIME_LOCAL`; Starlette `CLOSED_UNVERIFIED_WITH_VERSION_FLAG`; P03 global `PARTIAL_VERIFIED`. Stabilize sigue siendo único workflow owner.

## UI-PLUG-0010 — P04 BULKMAN + RESILIENT-CIRCUIT
P04 quedó `CLOSED_UNVERIFIED_WITH_EXECUTION_FLAGS`. Commit `b7545ca41ae0012e658d3ab8334cbe5aa98c077b`. Resilient-circuit: fuente `https://github.com/rodmena-limited/resilient-circuit`, commit `c9d80c845df771a9b9d63f9a48e6f24e6ed0b94a`, versión `0.7.0`, vendor tree `61ada5ed0ecf9bad6059645264c9fd5549669715`, adapter injection PASS; ejecución vendor real pendiente. Bulkman: fuente `https://github.com/rodmena-limited/bulkman`, commit `99607f7e1b881a68cc99305ab233299c57469414`, versión `2.0.3`, vendor tree `c964f8b80bb8e9f5492c5a87a3eeb0bdc43f21af`, adapter injection PASS; ejecución vendor real pendiente. Compatibilidad declarada `resilient-circuit>=0.5,<0.8` satisfecha por 0.7.0. Nunca se declara VERIFIED_CLOSED sin ejecución real.

## UI-PLUG-0011 — P05 ACTIVE
`P05_STRUCTLOG_OPENTELEMETRY` es el nodo activo conforme a STATE/CHECKPOINT/PLAN. Preflight obligatorio de reutilización: componentes UI → frontend completo → agentes → `router-universal-router-inteligente-` → `osquestador-auditor`; luego arquitectura/fuentes de verdad. Structlog/OpenTelemetry son logging/observabilidad read-only y no pueden gobernar el workflow. `stabilize_core` permanece como único owner.
