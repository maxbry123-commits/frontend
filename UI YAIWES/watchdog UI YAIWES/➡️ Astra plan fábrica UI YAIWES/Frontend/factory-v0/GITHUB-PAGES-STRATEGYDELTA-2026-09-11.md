# StrategyDelta — GitHub Pages fallback

Fecha: 2026-09-11
Identidad: ➡️ Astra plan fábrica UI YAIWES
Nodo: P4D_PERSISTENT_WEB_PREVIEW_PUBLISH_AND_VERIFY

Hugging Face permanece sin scope write/create-Space. Se intentó consultar GitHub Pages mediante el endpoint del conector autorizado, pero dicho endpoint no está habilitado por el conector (`INVALID_ARGUMENT`).

StrategyDelta materialmente distinto: preparar una rama de preview estático separada y reversible (`astra-factory-preview`) desde `main`, sin tocar rutas backend ni productivas. La rama debe contener una copia mínima de Factory V0 en raíz para que pueda ser usada como fuente de Pages cuando el repositorio permita/configure Pages.

Criterio de cierre NO cambia: rama presente != deployment. Se requiere URL persistente real + HTTP 200/read-back + E2E contra esa URL + evidencia + reviewer independiente.
