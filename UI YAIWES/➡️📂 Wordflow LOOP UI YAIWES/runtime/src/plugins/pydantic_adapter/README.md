# Pydantic Contract Adapter — UI YAIWES

Nodo: `P02B_PYDANTIC_CONTRACT_PLUGIN`
Contrato: `tel.workflow/v3`

## Responsabilidad
Validación tipada y JSON Schema mediante Pydantic. Este plugin no gobierna workflow, Router, Memory ni policy.

## Fuente fijada
- URL: https://github.com/pydantic/pydantic
- SOURCE_COMMIT: `c23cb86ef197693fc016437614f174252a3d189a`
- Pydantic source tree: `c04b6070f1a19b5c7dfdecc10ce28ba1a4afee9b`
- Pydantic version: `2.14.0b1`
- pydantic-core requerido: `2.48.0`
- pydantic-core source tree: `8a42ba89d1cf33ad1b9996f348283ef3f8058554`

## Code-only vendor
- `runtime/vendor/pydantic/` ← tree `c04b607...`
- `runtime/vendor/pydantic_core_source/src/` ← Rust source tree `2c9531d...`
- `runtime/vendor/pydantic_core_source/python/` ← bindings tree `7405da2...`
No se copian `.github`, docs, HISTORY, tests ni locks al hot path.

## Version gate
El plugin exige exactamente `2.14.0b1 / 2.48.0`. El runtime local auditado expone `2.13.4 / 2.46.4`, por lo que el montaje real debe fallar cerrado hasta corregir el runtime. Esta incompatibilidad se registra como flag; nunca se fuerza la carga.

## API del adapter
- `validate(model_type, payload)` → `model_validate`
- `dump(instance)` → `model_dump(mode="json")`
- `schema(model_type)` → `model_json_schema`

## No monolito
`compatibility.py`, `dependencies.py`, `runtime.py`, `factory.py` y tests permanecen separados. Los contratos concretos del proyecto se definen en nodos propios y consumen este adapter.
