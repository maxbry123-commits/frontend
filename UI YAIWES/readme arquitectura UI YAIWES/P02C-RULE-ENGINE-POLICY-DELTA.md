# P02C — Rule Engine policy adapter

Contrato: `tel.workflow/v3`
Estado: `CLOSED_UNVERIFIED_WITH_EXECUTION_FLAG`
Commit principal: `a1e6e4a4ac595a7c29e04bbdb150e3c226d116f5`

## Búsquedas obligatorias
Se revisaron: componentes UI, frontend completo, agentes, router inteligente universal y osquestador auditor. No apareció otro `rule_engine` reutilizable; la fuente física central fue la única candidata.

## Fuente fijada
- URL: https://github.com/zeroSteiner/rule-engine
- SOURCE_COMMIT: `c166666f66acabfa42856639812a3c20ae04da60`
- versión: `5.0.3`
- code tree `lib/rule_engine`: `3ca8717fb4ce3561b1e76053afc487061c76cfe3`
- dependencia declarada: `python-dateutil~=2.7`

## Diseño modular
`activation → PluginRegistry → MountGuard → PluginLoader → rule_engine_adapter.factory → RuleEngineRuntime`

Archivos:
- `rule_engine_adapter/dependencies.py`
- `rule_engine_adapter/runtime.py`
- `rule_engine_adapter/factory.py`
- `rule_engine_adapter/README.md`
- `test_rule_engine_adapter.py`
- vendor `runtime/vendor/rule_engine/`

## API
`compile`, `is_valid`, `evaluate`, `matches`, `filter`.

## Verificación
- 5/5 checks deterministas del wrapper: PASS.
- GitHub read-back de factory/test/vendor: PASS.
- vendor `__init__.py` leído en `main`: `__version__ = 5.0.3`.
- ejecución independiente del vendor real: BLOQUEADA por entorno local sin resolución DNS a `github.com`.

## Clasificación
No se declara `VERIFIED_CLOSED`. El adapter queda `CLOSED_UNVERIFIED_WITH_EXECUTION_FLAG`; recovery = ejecutar el mismo adapter/vendor cuando exista entorno ejecutable, sin duplicarlo.

## Invariante
Rule Engine no es workflow owner, no escribe State y no sustituye Sheriff/Validator. `stabilize_core` sigue siendo el único owner.
