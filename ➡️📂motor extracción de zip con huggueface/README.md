# Motor extracción de ZIP con Hugging Face

Motor externo de cómputo para `maxbry123-commits/frontend` sin GitHub Actions.

## Arquitectura

`HF Scheduled Job -> hf_zip_engine.py -> GitHub main -> auditoría -> EXTRACT_ONLY -> read-back`

## Reglas

- GitHub sigue siendo la fuente de verdad.
- Hugging Face Jobs aporta el cómputo.
- No usa `.github/workflows`.
- No usa Git LFS.
- Conserva ZIP/partes.
- Audita primero; solo repara gaps reintentables.
- `SOURCE_LFS_POINTER_GAP`, `UNSAFE_ZIP`, colisiones y blobs >=100 MiB quedan fail-closed.
- Single writer: no ejecuta reparación si detecta otro writer activo según el checkpoint local.
- El push autónomo requiere `GITHUB_TOKEN` disponible como secreto del Job de Hugging Face. Sin ese secreto el motor queda en modo supervisor/read-only y no intenta publicar.

## Raíces vigiladas

1. `📂componentes open soure fromtend/Fromtend code`
2. `UI YAIWES/Interface YAIWES ui/ENGINE ADAPTER`

## Ejecución

El Job descarga de forma sparse únicamente las dos raíces vigiladas, el extractor canónico existente y la evidencia forense necesaria. Evita el checkout completo de ~457k archivos.

Variables:

- `MODE=supervise|repair` (default `supervise`)
- `LIMIT=10`
- `REPO=maxbry123-commits/frontend`
- `BRANCH=main`
- `GITHUB_TOKEN` opcional para publicación autónoma
