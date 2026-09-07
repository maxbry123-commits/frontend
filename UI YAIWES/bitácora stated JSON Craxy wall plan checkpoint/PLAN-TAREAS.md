# PLAN 1×1 — UI YAIWES — tel.workflow/v4

Guía maestra obligatoria:
`UI YAIWES/readme arquitectura UI YAIWES/GUIA-MAESTRA-EJECUCION-LOOP-SOL-UI-YAIWES.md`

## Estado de nodos

1. P01 ⚠️ BASELINE VERIFIED_CLOSED / FRESHNESS STALE — inventario/provenance/dedup inicial 14/14 fue verificado; debe revalidarse después de la Action 124 porque la raíz de componentes está cambiando.
2. P02A 🚩 CLOSED_UNVERIFIED — Stabilize adapter/factory/DI cableado; ejecución real del vendor pendiente.
3. P02B 🚩 CLOSED_UNVERIFIED — Pydantic adapter + vendor + version gate; mismatch Pydantic/core pendiente.
4. P02C 🚩 CLOSED_UNVERIFIED — Rule Engine adapter/vendor/read-back; ejecución real vendor pendiente.
5. P03 ⚠️ PARTIAL_VERIFIED — HTTPX 0.28.1 PASS real local; Starlette 1.6.0 mantiene version flag.
6. P04 🚩 CLOSED_UNVERIFIED — resilient-circuit 0.7.0 + Bulkman 2.0.3 cableados; ejecución real vendors pendiente.
7. P05 ACTIVE — Structlog + OpenTelemetry separados y read-only; trabajo avanzado/preparado debe reconciliarse contra `main` antes de afirmar publicación.
8. P06 PREPARED — pytest + Hypothesis TEST_ONLY; cerrar únicamente con gate explícito de no-montaje en producción.
9. P07 PREPARED — Dagu + redun DONOR_ONLY; cerrar únicamente demostrando que no pueden convertirse en workflow owner/productive mount.
10. P08 PREPARED — PyCasbin policy; reconciliar vendor/aliases/dependencias después de Action 124 antes de publicación/cierre.

## Proceso concurrente prioritario

- Workflow: `.github/workflows/ui-yaiwes-124-download-extract-20260906.yml`
- Run: https://github.com/maxbry123-commits/frontend/actions/runs/34060401131
- Job: `queue-124`
- Última evidencia: `in_progress`; step 4 `Process 124 components sequentially with pinned source SHA`; verify final del destino pendiente.

Mientras esté activo: NO dedup destructivo de `UI YAIWES/componentes open soure UI YAIWES/`.

## Cola ejecutable 1×1

CURRENT A1 — Consultar estado real de Action 124.
- PASS si terminó: ir A2.
- Si sigue activa: registrar evidencia y ejecutar únicamente tarea runtime independiente segura.

A2 — Verificar destino físico post-124.
- contar carpetas materializadas;
- comparar queue/manifiesto/log;
- comprobar SOURCE_URL/SOURCE_COMMIT;
- identificar fallidos/ausentes.

A3 — Dedup post-124.
- comparar aliases por source commit + code-root/tree SHA;
- no borrar por nombre solamente;
- preservar versión/código más canónico;
- actualizar COMPONENT-INVENTORY y COMPONENT-CODE-MAP.

A4 — Revalidar P01 con inventario fresco.
- solo entonces devolver P01 a VERIFIED_CLOSED fresco.

A5 — Reconciliar P05 con `main`.
- buscar código ya publicado;
- adoptar equivalentes;
- publicar únicamente faltantes;
- Structlog separado de OTel API/SDK;
- observabilidad nunca gobierna workflow.

A6 — Cerrar P06 gate TEST_ONLY.
- probar rechazo production mount de pytest/Hypothesis.

A7 — Cerrar P07 gate DONOR_ONLY.
- probar rechazo production mount/owner para Dagu/redun.

A8 — Reconciliar y publicar P08 PyCasbin.
- evitar alias duplicado post-124;
- verificar dependencias;
- policy adapter separado;
- no declarar PASS con injection-only si se requiere vendor real.

A9 — Volver a flags heredados en orden de independencia:
- P02A real Stabilize mount;
- P02B versiones exactas Pydantic/core;
- P02C real Rule Engine vendor;
- P03 Starlette compatible;
- P04 real Bulkman/resilient-circuit.

A10 — Contratos de dominio UI YAIWES.
A11 — Chat API stream/cancel/status.
A12 — Workflow Stabilize completo.
A13 — Router/Memory adapters, no workflow ownership.
A14 — health/observability read-only.
A15 — E2E.
A16 — recovery/failure tests.
A17 — repeat checks para flakiness.
A18 — verify_final global.

## Preflight obligatorio para CADA nodo

1. chat/checkpoint;
2. `componentes open soure UI YAIWES/`;
3. todas las raíces frontend;
4. agentes;
5. router-universal-router-inteligente-;
6. osquestador-auditor;
7. arquitectura ×4;
8. fuentes de verdad;
9. dedup/rank;
10. PLAN 1×1 → ejecutar.

## Anti-stall

Después de 1–3 lecturas útiles debe aparecer delta físico o BLOCK sustentado. Cinco lecturas/análisis sin delta = `STALL_DETECTED` → ejecutar delta mínimo.

## Cierre

`SOURCE+SHA → adapter/factory → activation → registry → mount_guard → loader → test/health → read-back → STATE/CHECKPOINT/RECOVERY → JUDGE`.

Nada de lo preparado, staged, mocked o simplemente presente equivale por sí solo a `VERIFIED_CLOSED`.
