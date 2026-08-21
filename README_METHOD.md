# Método de trabajo

Canónico: `PIPELINE/56_METODO_COPY_MOVE_REUSE_INDEX.md`.

## COPY-FIRST — copia literal entre repositorios

1. Auditar primero origen y destino.
2. Identificar la ruta exacta del archivo.
3. Consultar la raíz/árbol del destino y comprobar si esa ruta ya existe.
4. Si existe: **NO borrar y NO reescribir**.
5. Si no existe: obtener del origen el blob original y su SHA.
6. Añadir ese blob al `tree` de la raíz del destino, usando el árbol actual del destino como `base_tree`.
7. Crear el commit con el árbol resultante.
8. Actualizar la referencia de `main`/rama destino (push).
9. Verificar en GitHub que el archivo existe y comparar SHA/contenido con el origen.
10. Registrar el resultado y continuar con el siguiente archivo.

## Lotes

Cuando haya varios archivos nuevos, se pueden preparar varias entradas en un único `tree` y hacer un único commit. Esto conserva el resto del destino y evita commits innecesarios. Nunca se debe incluir en el tree un archivo existente que no deba sobrescribirse.

## Reglas obligatorias

- Origen intacto.
- Copia literal; no resumir, reconstruir, traducir, corregir ni reescribir.
- No borrar.
- No sobrescribir existentes.
- GitHub = verdad.
- La tarea solo pasa a TERMINADA después de la verificación cruzada origen/destino.
- No usar Actions, issues ni workflows para copiar archivos cuando se pueda hacer directamente con Git blobs/trees.

## Flujo canónico

`origen → blob/SHA → auditoría destino → tree → commit → push → verificación SHA`
