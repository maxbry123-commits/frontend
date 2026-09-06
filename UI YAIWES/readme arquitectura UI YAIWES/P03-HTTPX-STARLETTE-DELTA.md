# P03 — HTTPX + Starlette adapters

Contrato: `tel.workflow/v3`
Estado: `PARTIAL_VERIFIED_WITH_STARLETTE_FLAG`
Commit de código: `85a3f758a4a6228e0d5d030a544365ccdef0a198`

## HTTPX
- Fuente: https://github.com/encode/httpx
- SOURCE_COMMIT: `b5addb64f0161ff6bfe94c124ef76f6a1fba5254`
- versión fuente/local: `0.28.1 / 0.28.1`
- vendor tree: `21eaf49210613909be2f7a864389a312a484d0eb`
- factory: `httpx.transport`
- evidencia ejecutable: request real con `httpx.MockTransport` PASS, sin red externa.

## Starlette
- Fuente: https://github.com/Kludex/starlette
- SOURCE_COMMIT: `0fcaff1d1e1d16a702a06b40d20092cc9d84d4a3`
- versión fuente/local: `1.6.0 / 0.50.0`
- vendor tree: `820b2cdde800811062b2be43abd909e27b38854f`
- factory: `starlette.asgi`
- comportamiento: version gate rechaza 0.50.0; no se fuerza compatibilidad.

## Arquitectura
`PluginLoader → httpx_adapter` maneja transporte cliente sync/async.
`PluginLoader → starlette_adapter` construye servidor/aplicación ASGI.
Ninguno planifica DAG, persiste State o cambia `stabilize_core` como workflow owner.

## Cierre
HTTPX queda verificado en runtime local. Starlette conserva flag hasta ejecutar 1.6.0. Por eso P03 global no se marca VERIFIED_CLOSED todavía.
