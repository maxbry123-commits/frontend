# Starlette ASGI Adapter — UI YAIWES

Nodo: `P03_HTTPX_STARLETTE_ADAPTERS`
Contrato: `tel.workflow/v3`

Fuente: https://github.com/Kludex/starlette
SOURCE_COMMIT: `0fcaff1d1e1d16a702a06b40d20092cc9d84d4a3`
Versión: `1.6.0`
Code tree: `820b2cdde800811062b2be43abd909e27b38854f`

Responsabilidad: construir la aplicación ASGI. No gobierna workflow, no persiste State y no sustituye Router/Policy.

La factory exige versión exacta `1.6.0`; el runtime local auditado expone `0.50.0`, por lo que el montaje real local se rechaza hasta disponer de la versión fijada. El vendor vive en `runtime/vendor/starlette/` y no incluye docs/tests/CI del repo fuente.
