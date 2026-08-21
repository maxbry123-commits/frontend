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

## Procedimiento ZIP → nueva raíz

1. Localizar el ZIP exacto en el repositorio y verificar nombre, ruta, SHA y tamaño.
2. Descargar el ZIP como binario; no leerlo como UTF-8.
3. Extraer todos sus archivos y directorios en un área temporal.
4. Inventariar la extracción y detectar si el ZIP creó una carpeta envolvente.
5. Crear una única raíz nueva con el nombre solicitado.
6. Desplegar dentro de esa raíz TODO el contenido del ZIP, quitando solo la carpeta envolvente si existe.
7. Mantener nombres, rutas internas y contenido sin modificaciones.
8. Comparar inventario ZIP ↔ raíz desplegada: archivos, directorios, tamaños y SHA/contenido cuando sea posible.
9. Crear tree/commit sobre el árbol existente, actualizar la rama y conservar el resto del repositorio.
10. Verificar directamente en GitHub que la nueva raíz contiene todo el contenido del ZIP.

### Reglas ZIP

- No eliminar el ZIP original salvo instrucción expresa.
- No clasificar, mover, borrar ni reescribir documentos ajenos a esta tarea.
- GitHub es la fuente de verdad.
- TERMINADA solo después de la verificación cruzada.

Flujo ZIP: `ZIP → binario → extracción → inventario → nueva raíz → despliegue completo → comparación → commit → push → verificación`.