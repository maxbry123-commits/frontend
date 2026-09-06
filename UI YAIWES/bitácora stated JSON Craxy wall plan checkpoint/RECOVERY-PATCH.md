# RECOVERY PATCH — UIYAIWES-P03-PARTIAL-P04-0014

Contrato: `tel.workflow/v3`
Modo: `FAIL_CLOSED_LOOP`
Owner único: `stabilize_core`
Nodo actual: `P04_BULKMAN_RESILIENT_CIRCUIT`

## Estado reconciliado
- P01 `VERIFIED_CLOSED`.
- P02A `CLOSED_UNVERIFIED_WITH_FLAG` — ejecución real vendor pendiente.
- P02B `CLOSED_UNVERIFIED_WITH_VERSION_FLAG` — Pydantic/core mismatch.
- P02C `CLOSED_UNVERIFIED_WITH_EXECUTION_FLAG` — Rule Engine read-back/lógica PASS, ejecución real pendiente.
- P03 `PARTIAL_VERIFIED_WITH_STARLETTE_FLAG` — HTTPX 0.28.1 ejecutó request real con MockTransport PASS; Starlette fuente 1.6.0 vs local 0.50.0, factory fail-closed. Commit P03 `85a3f758a4a6228e0d5d030a544365ccdef0a198`.
- P04 `ACTIVE` — Bulkman/resilient-circuit solo como resiliencia aislada; sin workflow ownership.

## P04 preflight obligatorio
Cinco búsquedas ejecutadas antes de programar: componentes UI, todas las raíces de frontend, agentes, router inteligente universal y osquestador auditor. No apareció adapter canónico Bulkman/resilient-circuit listo para reutilizar.

## GAP concurrente
Workflow `UI YAIWES 124` run `34060401131` observado `in_progress`; escribe componentes en `main`. No borrar/mover/deduplicar rutas de adquisición mientras siga activo. Revalidar al finalizar y preservar ambos historiales.

## Recovery 1×1
1. Releer HEAD, STATE, CHECKPOINT, PLAN, BITACORA y RECOVERY.
2. Auditar SOURCE_URL/SOURCE_COMMIT/licencia/code-root de Bulkman y resilient-circuit.
3. Reutilizar solo código útil; omitir `.github`, docs, examples, tests upstream y release automation del runtime.
4. Separar `bulkman_adapter` y `resilient_circuit_adapter` con dependencies/runtime/factory/registry/loader/guards/tests.
5. Mantener `stabilize_core` como único owner.
6. Ejecutar health/tests reales; cualquier incompatibilidad queda flag, nunca PASS falso.
7. Persistir evidencia/checkpoint/StrategyDelta antes de avanzar P05.

Rollback: historial GitHub; nunca force sobre `main`.