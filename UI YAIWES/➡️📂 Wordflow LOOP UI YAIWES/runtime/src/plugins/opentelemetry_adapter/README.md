# OpenTelemetry Python Adapter — P05

Contrato: `tel.workflow/v3` · modo `FAIL_CLOSED_LOOP`.
Fuente: https://github.com/open-telemetry/opentelemetry-python
Commit fuente: `96df63add12f6e0453b265ac34c5c07ec7b9267e` · catálogo tree `2a74339d862124f2637247862f53497448619d49` · API code-only tree `6b978f11923255b723f51a93168fa5c2d9752b4d`.
Licencia: Apache-2.0; copia preservada en `runtime/vendor/_licenses/opentelemetry/LICENSE`.
Responsabilidad única: traces/metrics API read-only mediante factory `opentelemetry.observability`; no exporter externo, no workflow ownership, no canonical-state mutation.
