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
Durante el LOOP se avanzó investigación/diseño/pruebas para P05 Structlog+OpenTelemetry, P06 pytest+Hypothesis, P07 Dagu+redun y P08 PyCasbin. Trabajo preparado/staging no equivale a cierre.

## UI-PLUG-0009 — ACTION 124
Workflow `.github/workflows/ui-yaiwes-124-download-extract-20260906.yml`; run https://github.com/maxbry123-commits/frontend/actions/runs/34060401131.

## UI-PLUG-0010 — INVENTARIO STALE POR CONCURRENCIA
La Action 124 introdujo nuevas carpetas/aliases mientras P01 había sido verificado sobre 14 componentes. No borra evidencia histórica; obliga a revalidar inventario/dedup post-Action.

## UI-PLUG-0011 — LEY DE CONCURRENCIA
Refrescar HEAD; inspeccionar commit; adoptar si cumple; no duplicar; añadir solo gates faltantes; no force.

## UI-PLUG-0012 — ANTI-STALL HISTÓRICO
`ENTENDER MINIMO → DELTA REAL → VERIFY → PERSIST → NEXT` no sustituye el contrato vigente.

## UI-PLUG-0013 — GUIA MAESTRA HISTÓRICA
`GUIA-MAESTRA-EJECUCION-LOOP-SOL-UI-YAIWES.md` queda como handoff histórico cuando contradiga `tel.workflow/v3`.

## UI-PLUG-0014 — STATE/CHECKPOINT/PLAN/RECOVERY HISTÓRICOS
Estados v4 previos quedan como historial; autoridad actual `tel.workflow/v3`.

## UI-PLUG-0015 — INCIDENTE TEMP WRITE
Archivos temporales accidentales fueron eliminados; no usar writes temporales en `main`.

## UI-PLUG-0016 — RUTA DE REINYECCION HISTÓRICA
`verify Action124 → inventory/dedup → P01 → P05 → P06/P07/P08 → flags → dominios → chat API → Stabilize → Router/Memory → E2E → verify_final`.

## UI-PLUG-0017 — REGLA DE HANDOFF
Continuar leyendo arquitectura consolidada + STATE + CHECKPOINT + PLAN + RECOVERY + BITACORA + HEAD real + Actions.

## UI-PLUG-0018 — ACTION 124 CANCELLED / FAIL_CLOSED / v3 RECONCILIADO
Run `34060401131` terminó `completed/cancelled` el `2026-09-07T02:43:53Z`; job `101559786309`; step adquisición `cancelled`, verify final `failure`, fail-closed `failure`. Nodo `P01_POST_124_INVENTORY_REVALIDATION`.

## UI-PLUG-0019 — GVISOR REVALIDADO COMO DONOR_ONLY_UNMAPPED
Búsquedas obligatorias ejecutadas; arquitectura y fuentes del Director revisadas. `gVisor` tree `fa6b9f1ca81285907f24d71ef100410ef48aac1f`; source `https://github.com/google/gvisor`; commit `0a1316b0d180600212bd607aa0ccfe2a9b09a899`; licencia preservada. Resultado `MATERIALIZED_OK_DONOR_ONLY_UNMAPPED`, integración `NOT_WIRED`.

## UI-PLUG-0020 — GFXSTREAM REVALIDADO COMO DONOR_ONLY_UNMAPPED
Búsquedas obligatorias ejecutadas antes del delta: componente físico `gfxstream`, raíces completas de `frontend`, y repos `agentes`, `router-universal-router-inteligente-`, `osquestador-auditor`; no apareció wiring alternativo reutilizable.
Arquitectura revisada en cuatro pasadas lógicas y fuentes de verdad del Director reconciliadas con el GAP documental ya registrado: ownership/invariantes, contratos/seguridad, sandbox/virtualización, closure/evidence.
Evidencia: `gfxstream`, tree `e696264983a685fb44a7b9706bcf35383fd67159`; SOURCE_URL `https://github.com/google/gfxstream`; SOURCE_COMMIT `681d81edd2ec597b055c2fbe99a742d95545722a`; upstream tree `89e6b402afabac2ac63dd293da5c5b643c77c57b`; LICENSE Apache-2.0 blob `7a4a3ea2424c09fbe48d455aed1eaa94d9124835`.
Resultado `MATERIALIZED_OK_DONOR_ONLY_UNMAPPED`, `integration=NOT_WIRED`; no VERIFIED_CLOSED.

## UI-PLUG-0021 — JSPDF REVALIDADO COMO DONOR_ONLY_UNMAPPED
Preflight repetido en las cinco ubicaciones obligatorias; no apareció wiring jsPDF alternativo reutilizable en frontend/agentes/router/osquestador. Se mantuvo el GAP documental de fuentes de verdad ya registrado y se aplicaron las cuatro pasadas lógicas de invariantes/ownership, contratos/seguridad, interfaz/exportación y closure/evidence antes del delta.
Evidencia: `UI YAIWES/componentes open soure UI YAIWES/jsPDF`, tree `b85b001772c33639db82c4c0b64313a37522bbc0`; SOURCE_URL `https://github.com/parallax/jsPDF`; SOURCE_COMMIT `a3930ce03a585a26b2c76d12a0f413ce96f6d1a3`; upstream tree `baf4d90e2f5a40eb9f558f616b803dc3fd50f095`; LICENSE MIT blob `dc7d3a9fa305defebad6cb88ba4cd9776f26fcd3`; roots `src/`=`0d1aa3d5dd1af4349b757198f69ff892261d85f6`, `dist/`=`26ba428becd4bc63059e091bf0a4aa2867fe650b`, `types/`=`c6567c5a822bfcf0728665675b4f6c0a5b6d9d24`.
Refutaciones: (1) checkout PDF presente ≠ integración; (2) `src/dist/types` ≠ compatibilidad con enchufe universal; (3) docs/examples/test/build upstream no entra al hot path sin nodo explícito. Resultado `MATERIALIZED_OK_DONOR_ONLY_UNMAPPED`, `integration=NOT_WIRED`; no VERIFIED_CLOSED.
StrategyDelta: conservar provenance y NO copiar/montar jsPDF; avanzar al siguiente componente físico seguro. P01 sigue abierto.

## UI-PLUG-0022 — LIBDATACHANNEL REVALIDADO COMO DONOR_ONLY_UNMAPPED
Preflight repetido en las cinco ubicaciones obligatorias; no apareció wiring libdatachannel reutilizable en frontend/agentes/router/osquestador. Arquitectura consolidada y fuentes de verdad se reconciliaron en cuatro pasadas lógicas: ownership/invariantes, contratos/permisos, sandbox/media/transport y closure/evidence.
Evidencia: ruta `UI YAIWES/componentes open soure UI YAIWES/libdatachannel`, tree `dce2a5f7a935d249b0130cb2c944bee4f06e7016`; SOURCE_URL `https://github.com/paullouisageneau/libdatachannel`; SOURCE_COMMIT `51085b8de4e6185dc019e3705c88b87933d7c3f6`; upstream tree `22d0552fdb095035c0f35049ad04bb5af1982d91`; LICENSE MPL-2.0 blob `14e2f777f6c395e7e04ab4aa306bbcc4b0c1120e`; roots `include/`=`f982e6717e2b7e39ab9cc5722dae4d0d57948144`, `src/`=`80b183c05737c47114dc322346fbb473b4dc1999`.
Refutaciones: (1) checkout WebRTC presente ≠ integración; (2) `include/src` ≠ compatibilidad con enchufe universal; (3) `.github`, examples, pages, test, cmake y build metadata upstream no entra al hot path sin nodo explícito. Resultado `MATERIALIZED_OK_DONOR_ONLY_UNMAPPED`, `integration=NOT_WIRED`; no VERIFIED_CLOSED.
StrategyDelta: conservar provenance y NO copiar/montar libdatachannel; avanzar a `pgvector`. P01 sigue abierto.

## UI-PLUG-0023 — PGVECTOR REVALIDADO COMO DONOR_ONLY_UNMAPPED
Preflight repetido en las cinco ubicaciones obligatorias; no apareció wiring pgvector alternativo reutilizable en frontend/agentes/router/osquestador. Se reconcilió HEAD concurrente sin force y se conservaron historiales.
Evidencia: ruta `UI YAIWES/componentes open soure UI YAIWES/pgvector`, tree `dee3af44e7c2b6779d02fa1372c89c9b89809679`; SOURCE_URL `https://github.com/pgvector/pgvector`; SOURCE_COMMIT `e48241b4dcc045b18902914f668d03d1d399dfbe`; licencia PostgreSQL blob `fc5f177fa5d9c0d20a949f4b4faa028999977008`; code roots candidatos `src/` y `sql/`; META 0.8.6 requiere PostgreSQL >=13.
Refutaciones: (1) checkout vectorial presente ≠ integración; (2) `src/sql` no demuestra adapter/registry/loader/guard; (3) `.github`, Dockerfile y tooling upstream no entran al hot path. Resultado `MATERIALIZED_OK_DONOR_ONLY_UNMAPPED`, `integration=NOT_WIRED`; no VERIFIED_CLOSED.
StrategyDelta: conservar provenance y no montar pgvector hasta existir contrato memory/retrieval verificable; siguiente cola 1×1 = resolver si `pytest` post-124 es alias/duplicado del baseline.
