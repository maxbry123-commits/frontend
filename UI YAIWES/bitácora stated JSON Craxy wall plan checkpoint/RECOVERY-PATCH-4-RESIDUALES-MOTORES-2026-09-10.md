# RECOVERY PATCH — 4 RESIDUALES — MOTORES CANÓNICOS — 2026-09-10

**Contrato:** `tel.workflow/v3`  
**Modo:** `FAIL_CLOSED_LOOP`  
**Estado:** `ACTIVE_LOOP`  
**Política de ledger:** este parche `SUPERSEDES` únicamente el conteo operativo actual; no modifica ni borra la evidencia histórica de Action124.

## 1. Estado recuperado

Inventario físico fresco sobre `main`:
- total canónico: `124`;
- presentes físicamente: `120`;
- faltantes físicos: `4`;
- wiring global 21–124: `NO VERIFICADO`;
- presencia física nunca equivale a `WIRED`.

Faltantes exactos:
1. `#18 Vite` — `https://github.com/vitejs/vite` — `MISSING_PHYSICAL`.
2. `#46 Supabase` — `https://github.com/supabase/supabase` — `MISSING_PHYSICAL`.
3. `#56 DuckDB` — `https://github.com/duckdb/duckdb` — `MISSING_PHYSICAL`.
4. `#66 AVF` — `https://android.googlesource.com/platform/packages/modules/Virtualization/` — `MOTOR_PROVIDER_GAP`.

## 2. Motores únicos autorizados

Raíz fijada: `maxbry123-commits/frontend@ef0669bbc753861bfc33b86548f3f90c0f3d8df9/➡️📂motores de descarga extracción copiado movimiento archivos fromtend/`.

Allowlist exclusiva:
- `➡️📂 skills descargar extraer zip copiar mover archivos readme.md`;
- `➡️📂 Motor de extracción zip/motor_1_extract_only.py` — blob `a52d5dc0e6ff26f75d753b848dcc1a40c5dd4500`;
- `📂Motor descarga de componentes y extracción de zip/motor_2_queue_download_extract.py` — blob `84d566e2ee4e98e42eb3a864026d067d48caabd9`;
- `📂Motor descarga de componentes y extracción de zip/hf_download_extract_engine.py` — blob `91e6e4486692eab314be5c7130d8310d3c855397`;
- `➡️📂motor de copiar archivos/motor_3_copy_batches.py` — blob `3689924361ce4a1a9fde4ae2b6f6009c37a6042d`;
- `➡️📂motor de copiar archivos/motor_copy_root_to_repo.py` — blob `8281211da76db3080fe1f1ea38b3eb0c45d655cb`;
- `➡️📂motor de moves archivos/motor_4_move_batches.py` — blob `9a21facfe11327cf60a2afca8f415ad52f0ecbe5`.

Reglas: `COPY_ONLY`, motores inmutables, `NO LFS`, `NO FORCE`, no downloader/extractor/copier/mover alternativo, no PASS sin read-back.

## 3. Evidencia de Actions

Runs observados:
- `34445055183` — `completed/failure` — `https://github.com/maxbry123-commits/frontend/actions/runs/34445055183`;
- `34445142005` — `completed/failure` — `https://github.com/maxbry123-commits/frontend/actions/runs/34445142005`.

Snapshot posterior: `in_progress=0`, `queued=0`. La causa raíz exacta queda `NOT_YET_CLASSIFIED_FROM_LOGS`; está prohibido inventarla.

## 4. Recovery TAREA 1

1. Leer logs reales de ambos runs y clasificar el fallo.
2. Refrescar `main` antes de ejecutar; si alguno de los 4 aparece con evidencia fresca, no duplicarlo.
3. Crear/usar cola únicamente para los gaps físicos que sigan faltando.
4. Para Vite, Supabase y DuckDB usar exclusivamente Motor2 + engine canónico, con `SOURCE_REF` fijado a commit/ref real y destino explícito.
5. Exigir descarga + reconstrucción + extracción + tree/hash + read-back `VERIFIED_CLOSED`; ZIP/archivo presente no es cierre.
6. AVF sólo puede avanzar si el motor canónico puede consumir la fuente `android.googlesource.com` sin modificar su código. Si no puede, conservar `MOTOR_PROVIDER_GAP`; no crear motor sustituto.
7. Si hubo staging, mover exclusivamente con Motor4 y verificar hashes/read-back después del movimiento.
8. Cierre TAREA 1 únicamente con `124/124 PRESENT_PHYSICAL`, `failed=0`, `pending=0` y evidencia real de destino.

## 5. Recovery TAREA 2

Sólo después de TAREA 1 `VERIFIED_CLOSED`:
1. inventariar wiring real actual;
2. cerrar primero el lote 01–20 hasta `20/20` cuando la evidencia lo permita;
3. avanzar 21–124 uno por uno usando adapters/loader/guard/registry/owners existentes;
4. por componente exigir ruta + SHA/diff + conexión real + test/microtest + read-back;
5. actualizar arquitectura, Crazy Wall, STATE, CHECKPOINT/HANDOFF únicamente con evidencia fresca;
6. `presence != WIRED`; no declarar proyecto terminado por materialización física.

## 6. Watchdog

Watchdog solicitado: `6aa237226ad48191b4dc2b1eb07c0400`.
Alcance: 4 residuales de TAREA 1 → después TAREA 2. Operaciones de descarga/extracción/copia/movimiento sólo con los motores canónicos de este parche.

## 7. Punto de reentrada

`CURRENT = J01_CLASSIFY_FAILED_RUNS_THEN_CLOSE_4_RESIDUALS`

Orden de reentrada:
`logs reales → StrategyDelta compatible con motores canónicos → Vite/Supabase/DuckDB → AVF provider check → read-back 124/124 → Motor4 si aplica → TAREA 2 wiring → verify_final`.

**VERDICT:** `ACTIVE_LOOP / CLOSED_UNVERIFIED`; no `VERIFIED_CLOSED` hasta cumplir todos los gates anteriores.
