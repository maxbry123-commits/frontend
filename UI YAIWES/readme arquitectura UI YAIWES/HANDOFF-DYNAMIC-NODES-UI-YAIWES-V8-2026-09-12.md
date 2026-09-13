# HANDOFF DINÁMICO DE NODOS — UI YAIWES — V8

Fecha base: 2026-09-12  
Reconciliación N04: 2026-09-13  
Repo: `maxbry123-commits/frontend`  
Branch: `main`  
Contrato: `tel.workflow/v3`  
Modo: `FAIL_CLOSED_LOOP`  
Estado: `ACTIVE_LOOP_NOT_CLOSED`

## Autoridad operativa vigente

1. Cola autoritativa: `UI YAIWES/bitácora stated JSON Craxy wall plan checkpoint/CRAZY-WALL-TASK-NODES-DYNAMIC-V5-2026-09-12.json`.
2. Estado operativo: `UI YAIWES/bitácora stated JSON Craxy wall plan checkpoint/STATE.json`.
3. Checkpoint operativo: `UI YAIWES/bitácora stated JSON Craxy wall plan checkpoint/CHECKPOINT.json`.
4. Arquitectura: `UI YAIWES/readme arquitectura UI YAIWES/ARQUITECTURA-WORDFLOW-PYTHON-DSL-DAG-96-4-V7-2026-09-12.md`.
5. Código, tests y logs actuales tienen mayor autoridad que documentación histórica.

## Coordinación

`READ FRESH -> IDENTIFY FREE/GAP_RESOLVABLE -> CLAIM -> VERIFY_RESEARCH -> EXECUTE_DELTA -> TEST_REPORT -> VERIFIED_CLOSED|GAP -> READ FRESH`

Un chat sólo puede tener un nodo activo. No reclamar `CLAIMED|EXECUTING` de otro SOL ni escribir fuera de `write_scope`.

Claim mínimo: `fresh_main_sha + chat_id + node_id + write_scope + claimed_at`.

Cada nodo usa exactamente tres pasos:

1. `VERIFY_RESEARCH`
2. `EXECUTE_DELTA`
3. `TEST_REPORT`

Prioridad: `REUSE_EXISTING > PATCH > ADAPT > GENERATE > NEW_DOWNLOAD`.

`stabilize_core` continúa como único workflow owner. Prohibidos Git LFS, force y motor alternativo.

## Reconciliación N04 — vigente

N02 `N02-TRACEABILITY-BIDIRECTIONAL` y N03 `N03-AUTO-AUDITOR-EVIDENCE` están `VERIFIED_CLOSED` en la Crazy Wall fresca. N04 quedó habilitado por esas dependencias y fue reclamado por `SOL GPT <10>` mediante claim aditivo fusionado en `e4d860f6d6fed9b744af5d43a63b813a522719a7`.

`STATE.json` y `CHECKPOINT.json` dejaron de presentar el contexto V5/Action124 como verdad operativa vigente. Los snapshots anteriores permanecen preservados por sus blobs Git exactos y sólo son evidencia histórica.

No se publican conteos históricos de nodos como porcentaje funcional del producto. La cola dinámica es la fuente para el estado individual de cada nodo y debe releerse antes de cada claim o cierre.

N03 ya no debe tratarse como GAP histórico. Del mismo modo, cualquier afirmación previa sobre N21/N32/N33 u otros nodos debe validarse contra la Crazy Wall y contra claims/código actuales antes de actuar; un estado `FREE` desfasado no autoriza sobrescribir evidencia de un claim real.

El proyecto **no** está cerrado. `SOURCE_PRESENT != IMPLEMENTED != WIRED != RUNTIME_TEST_PASS != VERIFIED_CLOSED`. N17 E2E, N31 UI FINAL y Final Judge siguen siendo gates downstream según sus dependencias actuales.

## Evidencia de reconciliación

- Claim N04 merge: `e4d860f6d6fed9b744af5d43a63b813a522719a7`.
- STATE reconciliado: commit `ab0276dae9f09ed0488250772728e16c6184c2a3`.
- CHECKPOINT reconciliado: commit `678f587289ac6f59a01f6d7034eec1bbf34a30ce`.
- Snapshot histórico completo de este Handoff antes de N04: blob `060062ab78a9f29839f6de2f7a356b637e61f696`.
- Snapshot histórico STATE anterior: blob `6e9ba8cd30279fab0fca79381af31e2d55f64f54`.
- Snapshot histórico CHECKPOINT anterior: blob `99f09dca8cb5bd3415506a9cadfc5152606eee41`.

## Cierre operativo

N04 sólo puede marcarse `VERIFIED_CLOSED` después de readback de Crazy Wall + STATE + CHECKPOINT + Handoff y de demostrar que los cuatro expresan la misma autoridad operativa, dependencias N02/N03 cerradas y proyecto global todavía abierto.
