# P01 — pgvector post-124 revalidation delta

Contrato: `tel.workflow/v3`
Modo: `FAIL_CLOSED_LOOP`
Nodo: `P01_POST_124_INVENTORY_REVALIDATION`

Resultado: `MATERIALIZED_OK_DONOR_ONLY_UNMAPPED`; integración `NOT_WIRED`; cierre `NOT_VERIFIED_CLOSED`.

Evidencia física:
- destino: `UI YAIWES/componentes open soure UI YAIWES/pgvector`
- tree: `dee3af44e7c2b6779d02fa1372c89c9b89809679`
- SOURCE_URL: `https://github.com/pgvector/pgvector`
- SOURCE_COMMIT: `e48241b4dcc045b18902914f668d03d1d399dfbe`
- licencia: PostgreSQL; blob `fc5f177fa5d9c0d20a949f4b4faa028999977008`
- code roots candidatos: `src/`, `sql/`
- META: pgvector/vector `0.8.6`; runtime requerido PostgreSQL `>=13`

Decisión arquitectónica: conservar provenance; no copiar ni montar pgvector en el hot path hasta existir un contrato memory/retrieval explícito y los módulos separados `contract → adapter → plugin/registry → loader → guard → tests`, cableados por el enchufe universal. Metadata/tooling upstream (`.github`, Dockerfile y automatización de build) no constituye integración.

Tres refutaciones: presencia física no prueba integración; code-root no prueba compatibilidad con el enchufe; metadata/build upstream no debe copiarse al runtime sin nodo explícito.

Siguiente cola 1×1: inspeccionar `pytest` post-124 y determinar por SOURCE_COMMIT/tree/code-root si es alias/duplicado del baseline `pytest` antes de cualquier claim de integración.
