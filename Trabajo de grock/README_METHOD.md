# Método de trabajo

Canónico: `PIPELINE/56_METODO_COPY_MOVE_REUSE_INDEX.md`.

## Procedimiento exacto para copiar un archivo entre repositorios

1. Auditar origen y destino antes de escribir.
2. Identificar la ruta exacta y comprobar si ya existe en destino.
3. Si existe: **NO borrar y NO reescribir**.
4. Si no existe: obtener del origen el blob original y su SHA.
5. Crear en el destino la entrada del archivo en el `tree` de la rama, usando el blob original.
6. Mantener el `base_tree` del destino para conservar todos sus archivos existentes.
7. Crear el commit con el nuevo tree.
8. Actualizar la referencia de la rama destino (push).
9. Verificar existencia y comparar SHA/contenido origen ↔ destino.
10. Registrar el resultado y continuar con el siguiente archivo.

## Reglas

- COPY-FIRST.
- Origen intacto.
- EXTRACT_LITERAL: copiar literalmente; no resumir, reconstruir ni corregir.
- No sobrescribir archivos existentes.
- No borrar archivos existentes.
- No usar workflows/issues como mecanismo de copia si se puede hacer directamente con Git blobs/trees.
- En lotes, varios archivos nuevos pueden entrar en un solo tree/commit, siempre sin sobrescribir existentes.
- GitHub es la fuente de verdad; la tarea no se cierra hasta verificar.

## Flujo GitHub

`origen → blob/SHA → auditoría destino → tree destino → commit → push → verificación SHA`
