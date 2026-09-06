# HTTPX Transport Adapter — UI YAIWES

Nodo: `P03_HTTPX_STARLETTE_ADAPTERS`
Contrato: `tel.workflow/v3`

Fuente: https://github.com/encode/httpx
SOURCE_COMMIT: `b5addb64f0161ff6bfe94c124ef76f6a1fba5254`
Versión: `0.28.1`
Code tree: `21eaf49210613909be2f7a864389a312a484d0eb`

Responsabilidad: transporte HTTP cliente sync/async. No gobierna workflow ni State.

El adapter expone `build_client`, `build_async_client`, `request` y `async_request`; la factory exige versión exacta `0.28.1`. El vendor vive en `runtime/vendor/httpx/` y no incluye docs/tests/CI del repo fuente.
