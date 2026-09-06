# INVENTARIO FÍSICO — 14 componentes

| # | Componente | Tree SHA en destino | Rol inicial |
|---|---|---|---|
|1|Apache PyCasbin|ca8d5efdcb1b63bbfabf07e6679075134391b314|Policy plugin|
|2|Bulkman|271c64e915a38926db06754adc6c20841a4a4dd0|Resilience/bulkhead|
|3|Dagu|766403bfa76c123b3d8bf9f2a9be3008e4e0d2eb|Donor only|
|4|HTTPX|50f3492d7c603cfd94e5029870ac7546666dec5e|HTTP transport adapter|
|5|Hypothesis|c7a0b0e22f5d5b63fd1f97fbd4dbf65a781e865c|Testing|
|6|OpenTelemetry Python|2a74339d862124f2637247862f53497448619d49|Observability|
|7|Pydantic|41f2003ff0dd618e9f0b751b01bcea3f1deb5c6f|Typed contracts|
|8|Rule Engine|ab1bbafa70cc9fb0dc1f82c138e5a6a734e9a882|Deterministic rules|
|9|Stabilize CORE|4698f403b847a5cc7aecd4b6f22a1636ca8be98b|Workflow owner|
|10|Starlette|9d9ad977106de6488276491f051c93a2698954e7|ASGI/API|
|11|pytest|05ba709ff69eab1ecb554ed1da1b7982b36dd64c|Testing|
|12|redun|e301e8967ebdcb0b27734a820bd2608999b08541|Donor provenance/hashing|
|13|resilient-circuit|32c7a96fee897e44e20a85b6e78995cc9bd5a9e3|Circuit breaker|
|14|structlog|5393fcee00ae1ed638601ed9915c78dd862988d5|Structured logging|

Regla de depuración: no copiar `.github`, changelogs, badges, docs, release automation ni tests upstream al runtime salvo que el nodo de prueba los necesite. Mantener source URL/SHA/license/provenance en evidencia; una licencia requerida no se clasifica como basura.