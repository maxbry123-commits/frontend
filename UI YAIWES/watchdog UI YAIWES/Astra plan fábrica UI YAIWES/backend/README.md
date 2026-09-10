# 📂 backend — Astra plan fábrica UI YAIWES

Estado: ACTIVE_LOOP / DONOR_STAGING_ONLY

Esta raíz recibe únicamente capacidades backend OSS descubiertas durante el trabajo de FRONTEND y las deja separadas, trazables y preparadas para integración posterior por el owner backend correspondiente. No sustituye ni escribe en las rutas backend de `➡️🤯 sol plan 1 UI YAIWES backend`.

Microflujo donante:

`OSS source -> SOURCE_URL/SOURCE_COMMIT/LICENSE -> capability extraction -> minimal donor -> ficha/contract -> adapter candidate -> isolated test -> evidence -> backend staging -> handoff/integration by owner`

Familias previstas:

- `providers-router`: model/provider routing y failover.
- `workflow-events`: colas, eventos, task/runtime donors.
- `realtime-streaming`: streaming, voice/realtime, backpressure.
- `memory-search`: local DB, vector, lexical, graph, retrieval.
- `documents`: parsing/extraction/normalization.
- `security-policy`: authorization, secret store, signatures, sandbox/container donors.
- `observability`: traces, metrics, logs, health.
- `tests`: property/contract fixtures.

Reglas:

- No monolito; una capacidad por unidad/contrato.
- No copiar repo completo al runtime final sólo porque esté disponible.
- No hardcodear secrets; usar `secret_ref`.
- No declarar integración backend: esta raíz es `DONOR_STAGING_ONLY` hasta handoff.
- Evidencia mínima: URL fuente + commit/licencia + ruta + hash/diff + test + read-back.
