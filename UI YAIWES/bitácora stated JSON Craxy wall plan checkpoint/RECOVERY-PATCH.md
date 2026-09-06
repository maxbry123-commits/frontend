# RECOVERY PATCH — UIYAIWES-P02C-FLAG-P03-0013

Contrato: `tel.workflow/v3`
Modo: `FAIL_CLOSED_LOOP`
Owner único: `stabilize_core`
Nodo actual: `P03_HTTPX_STARLETTE_ADAPTERS`

## Estado reconciliado
- P01 `VERIFIED_CLOSED`: inventario/provenance/dedup canónico 14/14.
- P02A `CLOSED_UNVERIFIED_WITH_FLAG`: adapter Stabilize cableado; ejecución real pendiente por DNS local.
- P02B `CLOSED_UNVERIFIED_WITH_VERSION_FLAG`: Pydantic adapter/vendor presente; versión runtime incompatible.
- P02C `CLOSED_UNVERIFIED_WITH_EXECUTION_FLAG`: Rule Engine adapter/vendor 5.0.3, lógica 5/5 y GitHub read-back PASS; ejecución real pendiente por DNS local.
- P03 `ACTIVE`: HTTPX/Starlette deben montarse como adapters separados; ninguno puede tomar ownership del workflow.

## Evidencia P03
- HTTPX SOURCE_COMMIT `b5addb64f0161ff6bfe94c124ef76f6a1fba5254`; code-root `httpx/` tree `21eaf49210613909be2f7a864389a312a484d0eb`; versión fuente `0.28.1`.
- Starlette SOURCE_COMMIT `0fcaff1d1e1d16a702a06b40d20092cc9d84d4a3`; code-root `starlette/` tree `820b2cdde800811062b2be43abd909e27b38854f`; versión fuente `1.6.0`.
- Cinco búsquedas obligatorias ejecutadas en componentes UI, frontend, agentes, router inteligente universal y osquestador auditor; no apareció adapter HTTPX/Starlette reutilizable listo.

## GAP concurrente
El workflow `UI YAIWES 124` run `34060401131` sigue `in_progress` y escribe componentes en `main`. Durante la corrida aparecieron duplicados de adquisición (`PyCasbin/`, `rule-engine/`) con SOURCE_COMMIT idénticos a los canónicos. No borrar ni reescribir esas rutas mientras el workflow siga activo; no consumirlas como nuevas fuentes canónicas.

## Recovery 1×1
1. Releer `main`, STATE, CHECKPOINT, PLAN, BITACORA y esta RECOVERY.
2. Confirmar que el workflow concurrente terminó antes de deduplicar adquisición.
3. Revalidar component root y SOURCE_COMMIT de duplicados; si code-root es idéntico, conservar una sola ruta canónica sin perder provenance.
4. Para P03, usar únicamente los code-root SHA canónicos ya fijados de HTTPX y Starlette.
5. Cablear adapters separados mediante registry/loader/guard; prohibido monolito.
6. Ejecutar tests reales/health; version mismatch o dependencia ausente => flag, nunca PASS falso.
7. Persistir StrategyDelta y continuar solo con siguiente tarea segura independiente.

Rollback: historial GitHub; nunca `force` sobre `main` ni borrar cambios concurrentes sin read-back final.