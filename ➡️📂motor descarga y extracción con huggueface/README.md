# Motor combinado de descarga y extracción con Hugging Face

Motor determinista para adquirir un repositorio GitHub por ref exacto, empaquetarlo, fragmentarlo en partes GitHub-safe, reconstruir/verificar el bundle, extraerlo de forma segura, comparar el árbol extraído con el árbol fuente y opcionalmente publicar bundle + árbol extraído en GitHub con read-back remoto.

Flujo: SOURCE_REPO/ref -> partial fetch NO-LFS -> scan -> ZIP determinista -> partes <=12 MiB -> reconstrucción CRC/SHA-256 -> extracción segura -> tree hash fuente=extraído -> publicación sparse -> commit/push NO_FORCE -> read-back -> VERIFIED_CLOSED.

Variables: SOURCE_REPO, SOURCE_REF, SLUG, DEST_REPO, DEST_BRANCH, DEST_ROOT, PART_SIZE_MIB, MAX_GITHUB_BLOB_MIB, PUBLISH, GITHUB_TOKEN.

La publicación usa `_archives/` para las partes del bundle y deja el árbol extraído directamente bajo `DEST_ROOT/SLUG/`. Cualquier LFS pointer, symlink/special file, colisión, path inseguro o blob extraído >=95 MiB falla cerrado.
