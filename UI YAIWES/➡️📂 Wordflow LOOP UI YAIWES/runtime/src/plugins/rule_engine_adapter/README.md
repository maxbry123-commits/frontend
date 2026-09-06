# Rule Engine Policy Adapter — UI YAIWES

Nodo: `P02C_RULE_ENGINE_POLICY_PLUGIN`
Contrato: `tel.workflow/v3`

## Responsabilidad
Evaluar reglas deterministas de policy mediante `rule-engine`. Este plugin no posee el workflow, no escribe State y no sustituye Sheriff/Validator.

## Fuente fijada
- URL: https://github.com/zeroSteiner/rule-engine
- SOURCE_COMMIT: `c166666f66acabfa42856639812a3c20ae04da60`
- versión: `5.0.3`
- code-root: `lib/rule_engine`
- code tree: `3ca8717fb4ce3561b1e76053afc487061c76cfe3`
- dependencia declarada: `python-dateutil~=2.7`

## Code-only vendor
`runtime/vendor/rule_engine/` copia directamente el tree `3ca8717...`; no se copian `.github`, docs, examples ni tests del repo fuente.

## Adapter
- `dependencies.py`: Rule class/version inyectables para test.
- `runtime.py`: compile/is_valid/evaluate/matches/filter.
- `factory.py`: import fijo desde `runtime/vendor` + gate `__version__ == 5.0.3`.

## Invariantes
1. `stabilize_core` sigue siendo el único workflow owner.
2. Rule Engine solo decide reglas; no agenda ni persiste workflow.
3. Import vendor fijo; no import path arbitrario.
4. Versión distinta de 5.0.3 falla cerrado.
5. El catálogo estático sigue inerte; activación requiere allowlist explícita.
