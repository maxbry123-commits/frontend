# runtime/src/integration

Integración global y estado canónico de convergencia.

Previstos:
- `contracts_yaiwes.py`
- `validator_rules.py`
- `integration_state.py`
- `coverage.py`
- `finalization.py`

Responsabilidades:
- aplicar StateDelta solo tras validación;
- conservar conflictos explícitos;
- mapear Requirement → Task → Artifact → Evidence → Validation;
- impedir COMPLETE con GAP crítico;
- emitir veredicto final independiente del LLM.
