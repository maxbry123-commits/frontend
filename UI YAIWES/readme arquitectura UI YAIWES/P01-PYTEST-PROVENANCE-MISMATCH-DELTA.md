# P01 — pytest provenance mismatch delta

Contrato: `tel.workflow/v3`  
Modo: `FAIL_CLOSED_LOOP`  
Nodo: `P01_POST_124_INVENTORY_REVALIDATION`

## Resultado
`pytest` queda `PARTIAL_PROVENANCE_MISMATCH_TEST_ONLY`, `integration=NOT_WIRED`, `closure=NOT_VERIFIED_CLOSED`.

## Evidencia
- destino: `UI YAIWES/componentes open soure UI YAIWES/pytest`
- SOURCE_URL: `https://github.com/pytest-dev/pytest`
- SOURCE_COMMIT declarado: `1f787563f0a174f938ad3415c2ecd90ae35f03e2`
- tree upstream de ese commit: `aa19de18166fd2225a0884e809e11a6ef1f0a87c`
- licencia: MIT; blob destino `c3f1657fce94589bd1ec7cead810639047f3d359`
- evidencia física: `src/_pytest/nodeid.py`, blob `f859b15347567130b8537a06604f5b2e16cdfbb2`
- upstream posterior: commit `431f3e1f5fd70b9b0f8afa2d20a10421542e5c6a`, tree `978c5d48fd273d69326a6cd0861198a50c42c62e`, introduce la representación estructurada NodeId.

## Refutaciones
1. mismo nombre/ruta de pytest no prueba `DUPLICATE_ALIAS`;
2. SOURCE_COMMIT declarado no puede representar un árbol que contiene código introducido posteriormente;
3. presencia del framework de tests no prueba wiring mediante enchufe universal.

## StrategyDelta
No borrar, copiar ni montar pytest. Preservar SOURCE_URL/SOURCE_COMMIT/licencia y marcar el provenance declarado como stale hasta identificar el snapshot físico exacto. Este GAP no rompe dependencias del siguiente análisis seguro, por lo que la cola continúa con `redun`.

## Arquitectura
Se mantiene separación estricta contract/adapters/plugins/registry/loader/guards/tests y Stabilize como único workflow owner. Sin ruta+diff+SHA+log+test+URL no existe VERIFIED_CLOSED.
