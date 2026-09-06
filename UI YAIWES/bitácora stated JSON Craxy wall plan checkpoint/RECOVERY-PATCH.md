# RECOVERY PATCH — UIYAIWES-P04-FLAGS-P05-0015

Contrato: `tel.workflow/v3`
Modo: `FAIL_CLOSED_LOOP`
Owner único: `stabilize_core`
Nodo actual: `P05_STRUCTLOG_OPENTELEMETRY`

## Estado reconciliado
- P01 `VERIFIED_CLOSED`.
- P02A `CLOSED_UNVERIFIED_WITH_FLAG` — ejecución real vendor pendiente.
- P02B `CLOSED_UNVERIFIED_WITH_VERSION_FLAG` — Pydantic/core mismatch.
- P02C `CLOSED_UNVERIFIED_WITH_EXECUTION_FLAG` — Rule Engine read-back/lógica PASS, ejecución real pendiente.
- P03 `PARTIAL_VERIFIED_WITH_STARLETTE_FLAG` — HTTPX 0.28.1 ejecución local PASS; Starlette fuente 1.6.0 vs local 0.50.0, fail-closed.
- P04 `CLOSED_UNVERIFIED_WITH_EXECUTION_FLAGS` — resilient-circuit 0.7.0 y Bulkman 2.0.3 con adapter injection/read-back PASS; ejecución real de ambos vendors no probada.
- P05 `ACTIVE` — Structlog + OpenTelemetry solo como logging/observabilidad read-only; no workflow ownership.

## Flags heredados
- `P02A-FLAG-REAL-VENDOR-EXECUTION`
- `P02B-FLAG-PYDANTIC-CORE-VERSION-MISMATCH`
- `P02C-FLAG-REAL-VENDOR-EXECUTION`
- `P03-FLAG-STARLETTE-VERSION-MISMATCH`
- `P04-FLAG-RESILIENT-CIRCUIT-REAL-VENDOR-EXECUTION`
- `P04-FLAG-BULKMAN-REAL-VENDOR-EXECUTION`

## P05 preflight obligatorio
Antes de programar: buscar/reconciliar en (1) `UI YAIWES/componentes open soure UI YAIWES/`; (2) todas las raíces de `frontend`; (3) `agentes`; (4) `router-universal-router-inteligente-`; (5) `osquestador-auditor`. Después revisar arquitectura y fuentes de verdad. Reutilizar únicamente código útil con URL/SHA/licencia/destino/dedup.

## Recovery 1×1
1. Confirmar provenance y code roots exactos de Structlog/OpenTelemetry existentes en el catálogo.
2. Confirmar que ninguna de las otras cuatro búsquedas contiene adapter canónico reutilizable.
3. Cablear, solo si el preflight queda completo, adapters separados de Structlog y OpenTelemetry mediante contrato/registry/loader/guards; observabilidad read-only.
4. Ejecutar tests/health contra implementación real disponible; fake/injection aislado no equivale a VERIFIED_CLOSED.
5. Persistir evidencia en STATE/CHECKPOINT/BITACORA/PLAN/arquitectura y hacer read-back independiente.

Rollback: historial GitHub; nunca force sobre `main`.
