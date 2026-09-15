# 01_PIPELINE_1_100_ARCHIVOS_PROYECTO_ARQUITECTURA_CODE

Estado: DELTA IMPLEMENTADO / PENDIENTE DE INTEGRACIÓN E2E
Contrato padre: `tel.workflow/v3`

Este archivo EXTIENTE el pipeline canónico existente. No crea un segundo orquestador, router, memoria, Crazy Wall ni sistema de estado.

## Objetivo
Materializar de forma fail-closed el flujo bounded:

`1..100 archivos → MANIFEST → HASH → CLASIFICACIÓN → MODELO DE PROYECTO → ARQUITECTURA → PLAN/CODE DELTA → VALIDATOR/JUDGE → CHECKPOINT`

## Invariantes
- Aceptar mínimo 1 y máximo 100 archivos por lote.
- Rechazar lote vacío o >100 antes de ejecutar transformaciones.
- Preservar ruta relativa, tamaño, tipo detectado y hash por archivo.
- No tratar extensión como prueba suficiente del tipo real.
- Secrets/tokens/credenciales: sólo referencias (`secret_ref`); nunca persistir valores.
- `REUSE > COPY/MOVE > PATCH PEQUEÑO > ADAPTER > GENERATE DELTA`.
- Archivo presente ≠ integrado.
- Ningún LLM puede declarar PASS.
- Todo resultado debe ser reproducible desde manifest + hashes + configuración/versiones.

## Etapa A — Intake 1..100
Entrada mínima:
- `batch_id`
- `files[]` con 1..100 elementos
- `source_ref`
- `requested_goal`
- `constraints`

Salida: `MANIFEST.json` lógico con, por archivo:
- `relative_path`
- `byte_size`
- `sha256`
- `declared_extension`
- `detected_kind`
- `source_ref`
- `status`

Gate A: conteo válido + hashes calculados + rutas normalizadas + sin path traversal.

## Etapa B — Clasificación
Clasificar sin modificar originales:
- código fuente
- configuración
- documentación
- assets
- datos/tablas
- archivos comprimidos/containers
- binarios/no interpretables
- secretos potenciales → cuarentena/redacción; nunca copiar valor a memoria/log.

Gate B: cada archivo tiene clase o `UNKNOWN`; `UNKNOWN` no se inventa ni se descarta.

## Etapa C — Modelo de proyecto
Derivar `PROJECT_MODEL` con:
- lenguajes/frameworks detectados
- entrypoints candidatos
- módulos/paquetes
- dependencias y manifests
- tests
- build/deploy/runtime hints
- relaciones import/include/reference
- documentos arquitectónicos existentes
- gaps/contradicciones

Gate C: cada afirmación incluye `evidence_refs[]` hacia archivos/hashes.

## Etapa D — Arquitectura
Primero buscar arquitectura existente. Si existe, reconciliar; no reemplazarla automáticamente.

Salida `ARCHITECTURE_MODEL`:
- componentes
- interfaces
- data/control flow
- ownership
- boundaries
- invariantes
- riesgos
- gaps
- evidence_refs

Gate D: contradicción no resuelta = GAP, nunca PASS.

## Etapa E — Plan/code delta
Construir únicamente cambios necesarios para el objetivo literal:
1. matriz `requirement → evidence → existing capability → gap`;
2. dedup/reuse check;
3. plan de delta mínimo;
4. archivos a modificar/crear;
5. rollback;
6. tests previstos.

No generar código para capacidades ya cubiertas salvo reparación demostrable.

## Etapa F — Validator/Judge
Validar:
- manifest íntegro
- hashes estables
- cobertura de 1..100 archivos
- trazabilidad requirement→arquitectura→delta
- ausencia de secretos persistidos
- tests del delta
- contradicciones/gaps

Resultado permitido: `PASS | GAP | INCONCLUSIVE`. PASS requiere evidencia mecánica/reproducible.

## Etapa G — Checkpoint
Persistir sólo metadatos/evidencia permitida:
- batch_id
- manifest hash
- input count
- source/version refs
- project model hash
- architecture model hash
- delta refs
- test refs
- unresolved gaps
- rollback refs
- judge result

El checkpoint debe enlazarse al Crazy Wall/STATE existente; no crea un segundo estado.

## Recovery
Ante fallo:
`persist GAP + stage + evidence + failed_strategy → checkpoint → StrategyDelta distinto → reanudar desde último gate válido`.

Nunca repetir ciegamente una estrategia fallida.

## Pruebas mínimas para declarar integración
1. lote de 1 archivo válido;
2. lote de 100 archivos válido;
3. lote de 0 rechazado;
4. lote de 101 rechazado;
5. hash/read-back estable;
6. path traversal rechazado;
7. `UNKNOWN` preservado;
8. secreto potencial no aparece en salida/log/checkpoint;
9. arquitectura existente se reutiliza/reconcilia;
10. requirement→evidence→delta trazable;
11. fallo recuperable desde checkpoint;
12. Judge no acepta PASS sin evidencia.

## Estado de este delta
Este documento cierra únicamente el GAP de **contrato explícito** del pipeline 1..100. No demuestra todavía wiring runtime ni E2E. Esos estados permanecen GAP hasta que exista implementación y prueba reproducible.
