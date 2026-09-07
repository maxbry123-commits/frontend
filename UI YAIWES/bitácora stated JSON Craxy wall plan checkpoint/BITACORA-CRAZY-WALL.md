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
Última verificación: `in_progress`; steps 1–3 completados; step 4 `Process 124 components sequentially with pinned source SHA` activo; verify final destino pendiente.
Regla: mientras esté activa no deduplicar destructivamente `componentes open soure UI YAIWES/` ni afirmar 124/124 finalizados.

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

## UI-PLUG-0012 — ANTI-STALL
Problema detectado en otros chats: usan LOOP como protocolo de análisis y no como protocolo de ejecución.
Nueva ley v4:
`ENTENDER MINIMO → DELTA REAL → VERIFY → PERSIST → NEXT`.
Después de 1–3 lecturas útiles debe existir acción física o BLOCK sustentado. Cinco lecturas/análisis sin delta = `STALL_DETECTED` → ejecutar el delta mínimo seguro.

## UI-PLUG-0013 — GUIA MAESTRA tel.workflow/v4
Publicada la guía reproducible para cualquier chat Sol:
`UI YAIWES/readme arquitectura UI YAIWES/GUIA-MAESTRA-EJECUCION-LOOP-SOL-UI-YAIWES.md`
Commit: `3c2752b9cd74b404cc8d44379b37535a6a295203`.
Incluye CONTRACT_BLOCK, DSL, DAG, Sheriff, Research-Reuse, Executor, Validator, Verifier, Sentinel, Supervisor, Judge, Guardian, StrategyDelta, anti-stall, concurrencia GitHub, Action 124, Crazy Wall, P01–P08, ruta futura, goals 12/12, Council 12, tres refutaciones, incident recovery y prompt de arranque para otro Sol.

## UI-PLUG-0014 — STATE/CHECKPOINT/PLAN/RECOVERY v4
STATE sincronizado en commit `f372b557e1f1bd043858d0c2ef3465cc792790f7`.
CHECKPOINT sincronizado en commit `3ec09e6dc37bc0ed94b136f7ef6ce176a13e1baf`.
PLAN expandido en commit `439c5d0047e332f43d128852e178058925665146`.
RECOVERY actualizado en commit `cf8eb78a07d3908be1a174480e61a91d53d21b56`.
Todos apuntan a la guía maestra y separan explícitamente VERIFIED / CLOSED_UNVERIFIED / PREPARED / CONCURRENT.

## UI-PLUG-0015 — INCIDENTE TEMP WRITE
Durante una comprobación operativa se crearon accidentalmente archivos temporales `NOOP` y `TEMP` en `main`; fueron eliminados. Regla permanente: nunca probar permisos/escritura creando archivos temporales en `main`. Cualquier error similar debe detener escrituras, limpiar con SHA real y quedar registrado en Recovery/Bitácora.

## UI-PLUG-0016 — RUTA DE REINYECCION ACTUAL
Secuencia autorizada:
`check Action 124 → verify final destino → inventory/dedup fresco → revalidar P01 → reconcile P05 → gates P06/P07 → reconcile P08 → resolver flags P02A/B/C/P03/P04 → contratos dominio → chat API → Stabilize workflow → Router/Memory adapters → health/observability → E2E → recovery tests → repeat checks → verify_final global`.

## UI-PLUG-0017 — REGLA DE HANDOFF
Un chat nuevo debe poder continuar leyendo únicamente:
1. GUIA MAESTRA;
2. STATE;
3. CHECKPOINT;
4. PLAN;
5. RECOVERY;
6. BITACORA;
7. HEAD real;
8. Actions concurrentes.
No debe reconstruir la historia completa del chat ni rehacer investigación cerrada.
