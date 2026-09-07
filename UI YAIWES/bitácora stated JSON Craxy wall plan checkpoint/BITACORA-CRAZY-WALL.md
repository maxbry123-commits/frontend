# BITÁCORA CRAZY WALL — Integración modular UI YAIWES

## UI-PLUG-0001 — P01 VERIFIED_CLOSED BASELINE
Inventario/provenance/dedup inicial 14/14 con read-back independiente. Después comenzó adquisición masiva 124; por eso el baseline debe revalidarse cuando termine esa Action.

## UI-PLUG-0002 — SOCKET UNIVERSAL
Commit `4960005c12668e9ef843e1a42b842989cca6e338`: contract/catalog/registry/mount_guard/loader separados; Stabilize único workflow owner.

## UI-PLUG-0003 — P02A STABILIZE
Adapter/DI publicado; tests con FakeOrchestrator PASS; ejecución real pendiente. Estado `CLOSED_UNVERIFIED_WITH_FLAG`. Recovery: reutilizar el mismo adapter; prohibido duplicarlo.

## UI-PLUG-0004 — P02B PYDANTIC
Commit `9cc1d0a2e5876b0f87a36a297c65c422be36b7e6`: adapter + vendor. Fuente fijada exige `2.14.0b1/core 2.48.0`; runtime local observado `2.13.4/core 2.46.4`; rechazo fail-closed. Estado `CLOSED_UNVERIFIED_WITH_VERSION_FLAG`.

## UI-PLUG-0005 — P02C RULE ENGINE
Fuente `https://github.com/zeroSteiner/rule-engine`, commit `c166666f66acabfa42856639812a3c20ae04da60`, versión `5.0.3`. Adapter/vendor publicado; read-back PASS; ejecución real pendiente. Estado `CLOSED_UNVERIFIED_WITH_EXECUTION_FLAG`.

## UI-PLUG-0006 — P03 HTTPX + STARLETTE
HTTPX: fuente 0.28.1; adapter publicado; prueba local real sin red mediante MockTransport PASS. Starlette: fuente 1.6.0; runtime local observado 0.50.0; version gate fail-closed. P03 global `PARTIAL_VERIFIED`.

## UI-PLUG-0007 — P04 BULKMAN + RESILIENT-CIRCUIT
Resilient-circuit 0.7.0 + Bulkman 2.0.3; adapters/vendor publicados; compatibilidad declarada satisfecha; injection/read-back PASS; ejecución real vendors pendiente. Estado `CLOSED_UNVERIFIED_WITH_EXECUTION_FLAGS`.

## UI-PLUG-0008 — P05/P06/P07/P08 AVANCE PREPARADO
Durante el LOOP se avanzó investigación/diseño/pruebas para:
- P05 Structlog + OpenTelemetry, separados y read-only;
- P06 pytest + Hypothesis como TEST_ONLY;
- P07 Dagu + redun como DONOR_ONLY;
- P08 PyCasbin policy.
Regla: trabajo preparado/staging no se considera publicado en `main` ni VERIFIED_CLOSED hasta reconciliación/read-back.

## UI-PLUG-0009 — ACTION 124
Workflow: `.github/workflows/ui-yaiwes-124-download-extract-20260906.yml`.
Run: https://github.com/maxbry123-commits/frontend/actions/runs/34060401131
Job: `queue-124`.
Última verificación histórica: `in_progress`; steps 1–3 completados; step 4 activo; verify final destino pendiente en ese momento.

## UI-PLUG-0010 — INVENTARIO STALE POR CONCURRENCIA
La Action 124 introdujo nuevas carpetas/aliases en la raíz de componentes mientras P01 había sido verificado sobre 14 componentes. Clasificación: `P01-FRESHNESS-STALE-AFTER-124-ACQUISITION`. No borra la evidencia histórica, pero obliga a revalidar inventario/dedup post-Action.

## UI-PLUG-0011 — LEY DE CONCURRENCIA
Cuando otro watchdog/chat publica código equivalente:
1. refrescar HEAD;
2. inspeccionar commit;
3. adoptar si cumple contrato;
4. no duplicar;
5. añadir solo gates faltantes;
6. no force.
Esta regla evitó duplicar adapters durante P02C/P03/P04.

## UI-PLUG-0012 — ANTI-STALL HISTÓRICO
Se registró la regla operativa `ENTENDER MINIMO → DELTA REAL → VERIFY → PERSIST → NEXT`. No sustituye el contrato arquitectónico vigente del Director.

## UI-PLUG-0013 — GUIA MAESTRA HISTÓRICA
Publicada `UI YAIWES/readme arquitectura UI YAIWES/GUIA-MAESTRA-EJECUCION-LOOP-SOL-UI-YAIWES.md`, commit `3c2752b9cd74b404cc8d44379b37535a6a295203`. Su referencia `tel.workflow/v4` queda tratada como artefacto de handoff histórico cuando contradiga `ARQUITECTURA-PROGRAMACION-CONSOLIDADA-UI-YAIWES.md` y la instrucción vigente del Director, ambas `tel.workflow/v3`.

## UI-PLUG-0014 — STATE/CHECKPOINT/PLAN/RECOVERY HISTÓRICOS
Se registraron actualizaciones v4 previas. La reconciliación vigente corrige ese drift hacia `tel.workflow/v3` sin borrar historial.

## UI-PLUG-0015 — INCIDENTE TEMP WRITE
Durante una comprobación operativa se crearon accidentalmente archivos temporales `NOOP` y `TEMP` en `main`; fueron eliminados. Regla permanente: nunca probar permisos/escritura creando archivos temporales en `main`.

## UI-PLUG-0016 — RUTA DE REINYECCION HISTÓRICA
`check Action 124 → verify final destino → inventory/dedup fresco → revalidar P01 → reconcile P05 → gates P06/P07 → reconcile P08 → resolver flags heredados → contratos dominio → chat API → Stabilize workflow → Router/Memory adapters → health/observability → E2E → recovery tests → repeat checks → verify_final global`.

## UI-PLUG-0017 — REGLA DE HANDOFF
Un chat nuevo debe continuar leyendo arquitectura consolidada + STATE + CHECKPOINT + PLAN + RECOVERY + BITACORA + HEAD real + Actions; no rehacer investigación ya sustentada.

## UI-PLUG-0018 — ACTION 124 CANCELLED / FAIL_CLOSED / v3 RECONCILIADO
Evidencia nueva: run `34060401131` terminó `completed/cancelled` el `2026-09-07T02:43:53Z`; job `101559786309`. Step 4 `Process 124 components sequentially with pinned source SHA` = `cancelled`; step 5 `Verify final destination and independent read-back snapshot` = `failure`; step 7 `Fail closed until 124 verified` = `failure`.
URL: https://github.com/maxbry123-commits/frontend/actions/runs/34060401131
Contrato canónico reconciliado a `tel.workflow/v3` + `FAIL_CLOSED_LOOP` conforme a `ARQUITECTURA-PROGRAMACION-CONSOLIDADA-UI-YAIWES.md` y la instrucción vigente del Director. Los estados v4 previos quedan como historial, no como autoridad actual.
Nodo actual: `P01_POST_124_INVENTORY_REVALIDATION`. P05 queda preparado/bloqueado para publicación hasta verificar destino físico, provenance y dedup post-cancelación.
StrategyDelta: enumerar destino → cruzar queue/manifiestos/checkpoints → validar URL/SHA/licencia → clasificar materializado/parcial/ausente/alias → dedup por source commit + code-root/tree → actualizar inventory/code-map → revalidar P01 → retomar P05.
