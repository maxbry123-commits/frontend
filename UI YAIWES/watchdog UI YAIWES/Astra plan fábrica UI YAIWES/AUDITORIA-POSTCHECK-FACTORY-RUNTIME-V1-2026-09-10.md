# AUDITORÍA POST-CHECK — FACTORY RUNTIME V1

Fecha: 2026-09-10
Identidad: `➡️ Astra plan fábrica UI YAIWES`
Contrato: `tel.workflow/v3`
Resultado: `PROTOTYPE_PRESENT / CLOSED_UNVERIFIED / DOES_NOT_ADVANCE_CANONICAL_T1_NODE`

## Motivo

Durante el cierre del paquete Recovery/Handoff un writer concurrente creó:

`UI YAIWES/watchdog UI YAIWES/Astra plan fábrica UI YAIWES/Frontend/factory-v1/index.html`

Commit productor:
`a9f9818dd76025141333df5102fc885646df8d70`

Blob leído:
`a6d078c9accca130344f7ceddefb5482d15c4978`

El CHECKPOINT concurrente avanzó `current_node` a `T1_05_RUNTIME_BROWSER_AND_DEPLOY_VERIFY`. Esta auditoría refuta ese avance porque no existe evidencia de cierre de los gates canónicos T1_03/T1_04 y porque el runtime V1 contradice reglas arquitectónicas obligatorias.

## Qué sí demuestra el prototipo

El archivo fuente contiene de forma visible:
- ribbon de 5 pasos;
- palette de 8 tipos;
- canvas drag/drop desde palette;
- inspector simple;
- span responsive básico;
- undo/redo;
- localStorage;
- modo MANUAL/AI_ASSIST/AUTOPILOT;
- transformación heurística de source a una ficha draft;
- delta candidato antes de apply;
- selector de provider sin API key;
- validación estática local;
- export JSON.

Estado de estas capacidades:
`SOURCE_IMPLEMENTED_IN_PROTOTYPE`, no `RUNTIME_TEST_PASS` ni `VERIFIED_CLOSED`.

## Refutación 1 — arquitectura / monolito

La arquitectura obligatoria exige separar:
`contracts/ adapters/ plugins/ registry/ loader/ guards/ tests/` y prohíbe monolito.

El runtime V1 actual es un único `index.html` con:
- HTML;
- CSS;
- component registry `TYPES`;
- state engine;
- drag/drop;
- importer/transformer;
- AI proposal logic;
- provider UI;
- validation;
- export.

Resultado:
`FAIL_ARCHITECTURE_GATE` para implementación canónica.

No se borra: se conserva como prototipo/donor V1 y debe refactorizarse/extraerse por módulos después de T1_03/T1_04.

## Refutación 2 — componentes / CanvasOwner

T1_03 exige XRAY de las dos raíces físicas y T1_04 exige elegir un CanvasOwner por bakeoff.

El runtime V1 implementa un canvas HTML5 propio antes de cerrar ese análisis y sin evidencia de comparación con Craft.js/GrapesJS/Puck.

Resultado:
`FAIL_CANVAS_OWNER_GATE`.

El canvas inline puede participar como baseline del bakeoff, pero no se convierte automáticamente en owner canónico.

## Refutación 3 — backend / AI / health

El botón `Verificar referencias` sólo escribe texto local indicando `secret_ref only` y que network provider call es responsabilidad backend. No existe llamada real ni health probe.

AI Assist usa reglas locales por keywords y genera un delta simple; no llama a los modelos/proveedores solicitados ni verifica disponibilidad.

Resultado:
- `GAP_PROVIDER_MODEL_AVAILABILITY` sigue abierto;
- `GAP_BACKEND_LLM_CAPABILITY_FOR_FACTORY` sigue abierto;
- `GAP_REAL_BACKEND_BINDINGS_NOT_VERIFIED_T2` sigue abierto.

## Refutación 4 — test/evidence

`validate` sólo comprueba canvas no vacío, IDs duplicados y tipos registrados. El propio output dice que runtime/backend E2E queda pendiente.

No hay evidencia de:
- browser E2E;
- unit tests separados;
- contract tests;
- accessibility test;
- visual regression;
- sandbox containment;
- backend real;
- HF private deployment;
- independent verifier.

Resultado:
`CLOSED_UNVERIFIED_PROTOTYPE`.

## Decisión canónica

No eliminar ni sobrescribir runtime V1.
Clasificar:

`factory-v1 = EXPERIMENTAL_REFERENCE_AND_DONOR / CLOSED_UNVERIFIED`.

No promueve nodos T1.

El `current_node` canónico permanece:
`T1_03_COMPONENT_XRAY`.

Siguiente sólo tras cierre verificable de T1_03:
`T1_04_CANVAS_OWNER_SELECTION`.

## StrategyDelta

Cuando corresponda implementar la fábrica canónica:

1. reutilizar comportamiento útil del prototype;
2. dividirlo según arquitectura en contracts/state/registry/canvas/inspector/transformer/ai/adapters/guards/tests;
3. elegir CanvasOwner después del bakeoff;
4. registrar ComponentManifest y provenance de donors;
5. ejecutar browser E2E/visual/a11y/contract tests;
6. conectar provider/backend por adapters reales/secret_ref;
7. validar HF private preview;
8. mantener V1 intacta como rollback/reference.

## Resultado

`SOURCE_PRESENT = YES`
`PROTOTYPE_FEATURES_PRESENT = YES`
`CANONICAL_ARCHITECTURE_WIRED = NO`
`BROWSER_E2E = NOT_EVIDENCED`
`BACKEND_REAL = NOT_EVIDENCED`
`HF_PRIVATE_DEPLOY = NOT_EVIDENCED`
`VERIFIED_CLOSED = NO`

Estado global T1: `ACTIVE_LOOP`.
