# PLAN 1×1 — UI YAIWES — tel.workflow/v3

Modo: `FAIL_CLOSED_LOOP`
Arquitectura canónica: `UI YAIWES/readme arquitectura UI YAIWES/ARQUITECTURA-PROGRAMACION-CONSOLIDADA-UI-YAIWES.md`

## Estado reconciliado

1. P01 ⚠️ baseline inicial 14/14 VERIFIED_CLOSED histórico; frescura actual STALE por adquisición 124 cancelada y verificación final fallida.
2. P02A 🚩 CLOSED_UNVERIFIED — Stabilize real-vendor execution pendiente.
3. P02B 🚩 CLOSED_UNVERIFIED — Pydantic/core exact-version flag pendiente.
4. P02C 🚩 CLOSED_UNVERIFIED — Rule Engine real-vendor execution pendiente.
5. P03 ⚠️ PARTIAL_VERIFIED — HTTPX real local PASS; Starlette version flag.
6. P04 🚩 CLOSED_UNVERIFIED — resilient-circuit/Bulkman real-vendor flags.
7. P05 ⏸ PREPARED_BLOCKED — Structlog/OpenTelemetry read-only; no publicar/cerrar hasta reconciliar inventario post-124.
8. P06 PREPARED — TEST_ONLY gate pendiente.
9. P07 PREPARED — DONOR_ONLY gate pendiente.
10. P08 PREPARED — PyCasbin requiere dedup post-124.
11. P09→P14 permanecen pendientes según dependencias arquitectónicas.

## Evidencia Action 124

- Workflow: `.github/workflows/ui-yaiwes-124-download-extract-20260906.yml`
- Run: https://github.com/maxbry123-commits/frontend/actions/runs/34060401131
- Job: `101559786309` / `queue-124`
- Run: `completed / cancelled`
- Step 4 adquisición: `cancelled`
- Step 5 verify final destination: `failure`
- Step 7 fail-closed-until-124-verified: `failure`

## Cola 1×1 vigente

CURRENT — P01_POST_124_INVENTORY_REVALIDATION
1. `gVisor` reconciliado: `MATERIALIZED_OK_DONOR_ONLY_UNMAPPED`; integración `NOT_WIRED`.
2. `gfxstream` reconciliado: `MATERIALIZED_OK_DONOR_ONLY_UNMAPPED`; integración `NOT_WIRED`.
3. `jsPDF` reconciliado: `MATERIALIZED_OK_DONOR_ONLY_UNMAPPED`; tree `b85b001772c33639db82c4c0b64313a37522bbc0`; source commit `a3930ce03a585a26b2c76d12a0f413ce96f6d1a3`; upstream tree `baf4d90e2f5a40eb9f558f616b803dc3fd50f095`; integración `NOT_WIRED`.
4. Avanzar al siguiente componente físico seguro después de `jsPDF`.
5. Cruzar manifest/checkpoint disponible con destino.
6. Verificar `SOURCE_URL`, `SOURCE_COMMIT`, licencia y code-root/tree.
7. Clasificar `MATERIALIZED_OK | PARTIAL | MISSING | DUPLICATE_ALIAS | INCONCLUSIVE` más rol `DONOR_ONLY` cuando corresponda.
8. Deduplicar solo con source commit + code-root/tree; nunca por nombre.
9. Actualizar `COMPONENT-INVENTORY.md` y `COMPONENT-CODE-MAP.md` + STATE/CHECKPOINT/RECOVERY/BITACORA/arquitectura.
10. Revalidar P01 únicamente tras completar reconciliación post-124; después retomar P05.

## Preflight obligatorio para cada nodo

1. input literal + GOALS;
2. componentes open source UI YAIWES;
3. todas las raíces frontend;
4. `agentes`;
5. `router-universal-router-inteligente-`;
6. `osquestador-auditor`;
7. arquitectura ×4;
8. tres fuentes de verdad indicadas por el Director ×4; registrar como GAP documental que la arquitectura consolidada enumera cuatro documentos únicos efectivos;
9. dedup/rank;
10. ejecutar delta mínimo seguro;
11. auditoría instrucciones ×3;
12. GOALS12 + Council12 + 3 refutaciones + cross-check + checklist + CODA + verify_final.

## Invariantes

- Stabilize es único workflow owner.
- código monolítico prohibido: contratos/adapters/plugins/registry/loader/guards/tests separados.
- archivo/repo/import presente ≠ integrado.
- secrets solo `secret_ref`.
- retry idéntico no cuenta.
- sin ruta/diff/SHA/log/test/URL no `VERIFIED_CLOSED`.
- no force sobre `main`; reconciliar commits concurrentes preservando historiales.
