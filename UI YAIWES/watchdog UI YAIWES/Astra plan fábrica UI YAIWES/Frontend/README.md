# 📂 Frontend — Astra plan fábrica UI YAIWES

Estado: ACTIVE_LOOP

Esta raíz es staging/trabajo de Astra para capacidades FRONTEND detectadas, diseñadas o preparadas durante T1. No sustituye las rutas productivas `UI YAIWES/Fabrica UI YAIWES/` ni `UI YAIWES/Interface YAIWES ui/` mientras no exista handoff explícito y `single_writer_per_path=true`.

Microflujo canónico:

`UI intent -> TypedAction -> Frontend Guard -> Universal Plugin/Action Bus -> adapter -> backend contract -> event/StateDelta -> verifier/evidence -> frontend store -> render`

Capas previstas:

- `shell`: workspace, ventanas/docks, navegación, command palette.
- `factory`: Create -> Compose -> Transform -> AI -> Validate/Exit.
- `canvas`: drag/drop, resize, constraints, responsive, preview.
- `components`: primitives y componentes registrados.
- `chat`: Jarvis, multi-work, agentes, tareas, streaming/cancel.
- `artifacts`: code/docs/PDF/charts/previews.
- `adapters`: contratos tipados con backend.
- `state`: estado visual derivado, nunca estado canónico del runtime.
- `guards`: permisos/capabilities/no-secret boundary.
- `tests`: unit/contract/E2E/visual/responsive/accessibility.

Reglas: V+ siempre; preview+undo/rollback; ninguna API key en frontend; sólo `secret_ref`; reutilizar capacidad mínima OSS mediante ficha/adapter; PASS exige test + evidencia + read-back.
