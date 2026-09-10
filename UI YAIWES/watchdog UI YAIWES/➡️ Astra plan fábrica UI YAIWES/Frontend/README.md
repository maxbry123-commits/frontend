# Frontend — Astra staging

Owner: `➡️ Astra plan fábrica UI YAIWES`
Status: `STAGING_ONLY`

Objetivo: preparar contratos, adapters, mocks, pruebas y propuestas V+ de frontend para la Fábrica UI sin modificar todavía `UI YAIWES/Interface YAIWES ui/` ni `UI YAIWES/Fabrica UI YAIWES/` mientras exista ownership ajeno/gate.

Reglas:
- REUSE > COPY > PATCH > ADAPT > GENERATE.
- Nunca secretos/API keys.
- Cada propuesta debe ser reversible y versionada.
- Ningún SOURCE_PRESENT equivale a WIRED.
- Contratos compartidos viven en `contracts/` dentro de este staging hasta handoff.

Microflujo: `Intent -> TypedAction -> Guard -> UniversalBus -> Adapter -> Mock/BackendContract -> Event/StateDelta -> Store -> Render`.
