# Motores operaciones componentes frontend

Suite fail-closed para operaciones repetibles sobre componentes open source del repo frontend.

## Motor 1 — solo extracción
`motor_1_extract_only.py`
- Entrada: ZIP normal o directorio con partes `.zip.part-*`.
- Extracción segura sin path traversal ni symlinks.
- CRC, SHA-256 de árbol y estado reanudable.
- `BATCH_SIZE` configurable de 1 a 100.

## Motor 2 — descarga + extracción en cola persistente
`motor_2_queue_download_extract.py`
- Cola JSON de repositorios.
- Ejecuta en serie el motor combinado existente `hf_download_extract_engine.py`.
- Estado persistente, reintentos limitados y balance descarga/extracción.
- Genera `README-INDICE-COMPONENTES.md` a partir de la cola/estado cuando se indica `INDEX_PATH`.

## Motor 3 — copiar archivos por lotes
`motor_3_copy_batches.py`
- Copia de 1 a 100 archivos por lote.
- `shutil.copy2()` + archivo temporal + `os.replace()`.
- Verificación SHA-256 antes de cerrar cada copia.
- Estado persistente y políticas de colisión `fail|skip|replace`.

## Motor 4 — mover archivos por lotes
`motor_4_move_batches.py`
- Movimiento de 1 a 100 archivos por lote.
- `shutil.move()` hacia staging temporal, verificación SHA-256 y promoción final con `os.replace()`.
- Estado persistente, recuperación de operaciones ya completadas y políticas de colisión `fail|skip|replace`.

## Reglas comunes
- `1 <= BATCH_SIZE <= 100`.
- No se declara PASS sin verificación física.
- No se usa Git LFS.
- No se sobreescriben destinos salvo política explícita.
- Cada motor emite un balance JSON al finalizar.
