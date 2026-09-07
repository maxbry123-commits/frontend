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
7. P05 ⏸ PREPARED_BLOCKED — no publicar/cerrar hasta reconciliar inventario post-124.
8. P06 PREPARED — TEST_ONLY gate pendiente; pytest tiene GAP de provenance post-124.
9. P07 PREPARED — DONOR_ONLY gate pendiente.
10. P08 PREPARED — PyCasbin requiere dedup post-124.
11. P09→P14 permanecen pendientes según dependencias arquitectónicas.

## Evidencia Action 124

- Workflow: `.github/workflows/ui-yaiwes-124-download-extract-20260906.yml`
- Run: https://github.com/maxbry123-commits/frontend/actions/runs/34060401131
- Job: `101559786309` / `queue-124`
- Run: `completed / cancelled`
- Step adquisición: `cancelled`; verify final destino: `failure`; fail-closed: `failure`.

## Cola 1×1 vigente

CURRENT — `P01_POST_124_INVENTORY_REVALIDATION`
1. gVisor → `MATERIALIZED_OK_DONOR_ONLY_UNMAPPED / NOT_WIRED`.
2. gfxstream → `MATERIALIZED_OK_DONOR_ONLY_UNMAPPED / NOT_WIRED`.
3. jsPDF → `MATERIALIZED_OK_DONOR_ONLY_UNMAPPED / NOT_WIRED`.
4. libdatachannel → `MATERIALIZED_OK_DONOR_ONLY_UNMAPPED / NOT_WIRED`.
5. pgvector → `MATERIALIZED_OK_DONOR_ONLY_UNMAPPED / NOT_WIRED`.
6. pytest → `PARTIAL_PROVENANCE_MISMATCH_TEST_ONLY / NOT_WIRED`; declarado `1f787563...` tree `aa19de18...`, pero destino contiene `nodeid.py` introducido upstream después en `431f3e1f...` tree `978c5d48...`.
7. NEXT = `redun`.
8. Para redun: repetir cinco búsquedas obligatorias → SOURCE_URL/SOURCE_COMMIT/licencia → code-root/tree → adquisición 124 → 3 refutaciones → classify → persist.
9. No montar/copy donor code salvo contrato+adapter+plugin+registry+loader+guard+tests verificables por enchufe universal.
10. Revalidar P01 solo tras completar toda reconciliación post-124; después retomar P05.

## Preflight obligatorio para cada nodo

INPUT literal→GOALS→2 prioridades→plan→cola1×1→cinco búsquedas→arquitectura ×4→fuentes Director ×4→verify/refute→StrategyDelta distinto si GAP→auditoría instrucciones ×3→GOALS12+Council12→3 refutaciones→cross-check→checklist→CODA→verify_final.

## Invariantes

- Stabilize es único workflow owner.
- Código monolítico prohibido: contratos/adapters/plugins/registry/loader/guards/tests separados.
- Archivo/repo/import presente ≠ integrado.
- Sin ruta/diff/SHA/log/test/URL no `VERIFIED_CLOSED`.
- No force sobre `main`; reconciliar commits concurrentes preservando historiales.
