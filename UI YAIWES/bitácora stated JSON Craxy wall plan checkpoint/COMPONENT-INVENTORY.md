# INVENTARIO FÍSICO — baseline 14 + revalidación post-124

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

## Revalidación post-124 — cola 1×1

| Entrada | Clasificación | Evidencia | Decisión |
|---|---|---|---|
|gVisor|MATERIALIZED_OK / DONOR_ONLY_UNMAPPED|tree `fa6b9f1ca81285907f24d71ef100410ef48aac1f`; source `https://github.com/google/gvisor`; commit `0a1316b0d180600212bd607aa0ccfe2a9b09a899`; LICENSE blob `f7a006d10464cfe9724b5d687c0013bf982cc66a`; roots `pkg/`, `runsc/`, `sandboxexec/`, `shim/`|Conservar como donor/provenance. NO copiar ni montar en runtime hasta existir contract+adapter+registry+loader+guard+test y ruta universal verificable.|
|gfxstream|MATERIALIZED_OK / DONOR_ONLY_UNMAPPED|tree `e696264983a685fb44a7b9706bcf35383fd67159`; source `https://github.com/google/gfxstream`; commit `681d81edd2ec597b055c2fbe99a742d95545722a`; upstream tree `89e6b402afabac2ac63dd293da5c5b643c77c57b`; LICENSE blob `7a4a3ea2424c09fbe48d455aed1eaa94d9124835`; manifest blob `7dd9632e9ee34d352169ca2af5f7efd141b1686b`; roots `host/`, `guest/`, `common/`, `codegen/`|Conservar como donor/provenance. NO copiar ni montar al hot path sin contrato gráfico explícito y enchufe universal completo; metadata/build/CI/docs/tests/third_party no se copian por defecto.|
|jsPDF|MATERIALIZED_OK / DONOR_ONLY_UNMAPPED|tree `b85b001772c33639db82c4c0b64313a37522bbc0`; source `https://github.com/parallax/jsPDF`; commit `a3930ce03a585a26b2c76d12a0f413ce96f6d1a3`; upstream tree `baf4d90e2f5a40eb9f558f616b803dc3fd50f095`; LICENSE MIT blob `dc7d3a9fa305defebad6cb88ba4cd9776f26fcd3`; `src/` tree `0d1aa3d5dd1af4349b757198f69ff892261d85f6`; `dist/` tree `26ba428becd4bc63059e091bf0a4aa2867fe650b`; `types/` tree `c6567c5a822bfcf0728665675b4f6c0a5b6d9d24`|Conservar como donor/provenance. NO copiar ni montar al runtime sin contrato de exportación PDF y enchufe universal completo; docs/examples/test/build upstream quedan fuera del hot path.|

P01 permanece abierto: estas filas verifican entradas físicas, no el inventario post-124 completo.

Regla de depuración: no copiar `.github`, `.agents`, `.buildkite`, `.claude`, changelogs, badges, docs, release automation ni tests upstream al runtime salvo que el nodo de prueba los necesite. Mantener source URL/SHA/license/provenance en evidencia; una licencia requerida no se clasifica como basura.