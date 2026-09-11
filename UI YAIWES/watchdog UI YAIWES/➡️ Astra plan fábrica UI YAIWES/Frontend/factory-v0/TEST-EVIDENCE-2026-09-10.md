# Factory V0 — evidencia de prueba determinista

Identidad: `➡️ Astra plan fábrica UI YAIWES`
Nodo: `P4_FACTORY_V0_EXECUTABLE_TEST_AND_PREVIEW`
Base observada antes de persistir evidencia: `e263b086ce99fc190226174c2bbc523f31139c1e`

## Comando ejecutado

`node tests/factory.test.mjs`

## Resultado

```text
PASS 1: factory exposes exactly five ordered steps
PASS 2: SET_STEP clamps below and above valid range
PASS 3: mode changes are reversible with undo/redo
PASS 4: AI proposal does not mutate canonical components before APPLY_DELTA
PASS 5: stale delta is rejected when baseVersion differs
PASS 6: SAVE_VERSION increments version, records evidence and clears delta
RESULT PASS 6/6
```

## Alcance probado

- Cinco pasos ordenados: CREATE → COMPOSE → TRANSFORM → AI → VALIDATE.
- Límites del step.
- Undo/redo para cambio de modo.
- La propuesta IA no modifica componentes canónicos antes de `APPLY_DELTA`.
- Delta con `baseVersion` obsoleto es rechazado.
- `SAVE_VERSION` incrementa versión, registra evidencia y limpia el delta.

## Lo que esta prueba NO certifica

- No certifica preview visual en navegador real.
- No certifica drag/drop E2E.
- No certifica responsive/mobile.
- No certifica integración con backend de Sol.
- No certifica licencias/source commits de donors OSS.
- No certifica `VERIFIED_CLOSED`; falta revisión independiente.

Estado derivado: `RUNTIME_LOGIC_TEST_PASS / ACTIVE_LOOP`.
