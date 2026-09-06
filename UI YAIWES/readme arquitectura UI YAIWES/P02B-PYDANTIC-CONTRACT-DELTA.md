# P02B — Pydantic contract adapter

Contrato: `tel.workflow/v3`
Estado: `CLOSED_UNVERIFIED_WITH_VERSION_FLAG`
Commit principal: `9cc1d0a2e5876b0f87a36a297c65c422be36b7e6`

## Reuse / búsquedas
Se ejecutaron las cinco búsquedas obligatorias. No apareció un `MasterInputContract`/BaseModel canónico reutilizable en frontend, agentes, router inteligente universal ni osquestador auditor. El componente central sí contiene `pydantic/` y `pydantic-core/`.

## Fuente fijada
- https://github.com/pydantic/pydantic
- SOURCE_COMMIT `c23cb86ef197693fc016437614f174252a3d189a`
- `pydantic/` tree `c04b6070f1a19b5c7dfdecc10ce28ba1a4afee9b`
- versión fuente `2.14.0b1`
- pydantic-core requerido `2.48.0`
- pydantic-core tree `8a42ba89d1cf33ad1b9996f348283ef3f8058554`

## Code-only vendor
Se copiaron por tree SHA, sin docs/tests/CI/HISTORY:
- `runtime/vendor/pydantic/`
- `runtime/vendor/pydantic_core_source/src/`
- `runtime/vendor/pydantic_core_source/python/`

## Plugin modular
- `pydantic_adapter/compatibility.py`
- `pydantic_adapter/dependencies.py`
- `pydantic_adapter/runtime.py`
- `pydantic_adapter/factory.py`
- `pydantic_adapter/README.md`
- `test_pydantic_contract_adapter.py`

El adapter expone `validate`, `dump` y `schema` y usa el enchufe universal con factory key `pydantic.contracts`.

## Version flag
El entorno de ejecución local auditado tiene Pydantic `2.13.4` y pydantic-core `2.46.4`; la fuente fijada exige `2.14.0b1 / 2.48.0`. El adapter rechaza esa combinación. No se declara runtime integrado hasta disponer de la pareja compatible.

## Verificación
Lógica del adapter: 4/4 tests locales PASS antes de publicación; read-back GitHub del código y tests PASS. El test publicado incluye además montaje por PluginLoader con versiones compatibles inyectadas y rechazo del entorno incompatible.

## Regla
P02B puede servir como contrato preparado, pero `VERIFIED_CLOSED` requiere ejecutar el runtime con la versión/core exactos de la fuente fijada. No se fuerza ni se silencia el mismatch.
