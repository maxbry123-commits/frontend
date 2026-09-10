# ARQUITECTURA DETALLADA — FÁBRICA + INTERFACE UI YAIWES V1

Estado: ACTIVE_LOOP / diseño ejecutable, pendiente de implementación y validación
Owner de este documento: `➡️ Astra plan fábrica UI YAIWES`
Contrato: `tel.workflow/v3`
Regla: `SOURCE_PRESENT != WIRED != RUNTIME_TEST_PASS != VERIFIED_CLOSED`

# 1. OBJETIVO

Crear una fábrica visual de fricción mínima que sirva para construir, abrir, editar, transformar y versionar la propia Interface YAIWES y cualquier ventana/módulo futuro. Después de cerrar la fábrica, utilizarla como herramienta primaria para construir la interfaz productiva.

YAIWES se define como workbench AI-first multiplataforma con chat/orquestador central, superficies modulares, workflow/task trace, artifacts/files, canvas visual, plugins/adapters y runtime local+web. La UI no es estado canónico: representa y opera contratos del runtime.

# 2. REGLAS ARQUITECTÓNICAS NO AMBIGUAS

1. Prohibido monolito.
2. Un solo writer por ruta.
3. Un solo component registry canónico.
4. Un solo canvas principal activo; motores adicionales entran como adapters/donantes.
5. Un solo contrato universal para conectar componentes/capacidades.
6. Frontend nunca recibe API keys reales si puede usar `secret_ref`/capability token.
7. Todo componente externo entra por sandbox y test antes de promoción.
8. Todo cambio visual es un `UIStateDelta` reversible/versionado.
9. Todo vínculo backend es un `BackendBinding` declarativo; no llamadas ad-hoc escondidas en componentes.
10. Todo paso debe tener entrada, salida, condición PASS/FAIL y evidencia.
11. Tarea 2 productiva bloqueada hasta Tarea 1 `VERIFIED_CLOSED`.
12. Código OSS de backend descubierto se almacena en staging `backend/`; no se escribe en backend Sol sin handoff.
13. Código de frontend descubierto se almacena/clasifica en staging `frontend/` y sólo se promueve después de adaptación/test.
14. `REUSE > PATCH > ADAPT > GENERATE`.
15. No integrar repositorios completos cuando sólo hace falta una capacidad.

# 3. TOPOLOGÍA HORIZONTAL

`USER/AI -> INTENT -> FACTORY SHELL -> STEP ENGINE -> COMPONENT REGISTRY -> CANVAS/INSPECTOR -> UNIVERSAL CONTRACT -> ADAPTER/PLUGIN -> PREVIEW SANDBOX -> TEST/VERIFIER -> VERSION/EVIDENCE -> EXPORT/PROMOTE`

En paralelo, para integraciones:

`UI EVENT -> UI ACTION CONTRACT -> BACKEND BINDING -> AUTH/CAPABILITY -> API|MCP|LOCAL BRIDGE -> SOL RUNTIME CONTRACT -> RESULT EVENT -> NORMALIZER -> STATE DELTA -> UI RENDER`

Nunca:

`UI COMPONENT -> hardcoded backend secret/endpoint -> mutable canonical state`

# 4. LAS 5 CAPACIDADES OBLIGATORIAS DE LA FÁBRICA

## M1 — ELEMENT BUILDER

Responsabilidad: crear ventana, botón, selector, segmento, toolbar, ribbon item, panel, modal, card, input, command item, list/table/tree node.

Entrada:
- tipo de elemento;
- template opcional;
- design tokens;
- constraints;
- estado inicial.

Salida:
- `ComponentDefinition`;
- `ComponentInstance`;
- preview;
- tests de estructura/accesibilidad básicos.

No contiene lógica backend directa.

## M2 — UI COMPOSER

Responsabilidad: unir elementos en ventanas/apps completas y permitir abrirlas/editarla después.

Incluye:
- canvas;
- layers tree;
- drag/drop;
- resize;
- snap/grid/guides;
- responsive constraints;
- docking/panels;
- navigation/route map;
- state bindings;
- templates;
- undo/redo;
- snapshots.

Salida: `UIDocument` versionado.

## M3 — COMPONENT TRANSFORMER / COMPONENT INBOX

Responsabilidad: recibir un componente externo y convertirlo en pieza YAIWES.

Pipeline determinista:

`SOURCE -> HASH/LICENSE/METADATA -> STATIC ANALYSIS -> EXPORT MAP -> FRONTEND/BACKEND SPLIT -> CONTRACT -> ADAPTER -> SANDBOX PREVIEW -> TEST -> REGISTRY CANDIDATE`

No promociona automáticamente si falla licencia, sandbox, build, tipos o contrato.

## M4 — AI OPERATOR

Responsabilidad: permitir que una IA intervenga en cualquier paso sin saltarse controles.

Modos:
- MANUAL;
- AI_ASSIST;
- AUTOPILOT.

Contrato:

`AI intent -> PlanProposal -> UIStateDelta -> diff/preview -> guards -> tests -> apply|reject|rollback`

La IA nunca modifica estado canónico directamente.

## M5 — DETERMINISTIC MODULE KIT

Responsabilidad: proveer operaciones listas y preconfiguradas sin LLM cuando la tarea es mecánica.

Mínimo:
- copy/move/import;
- component scan;
- manifest generation;
- schema validation;
- build;
- lint/typecheck;
- unit test;
- screenshot/visual snapshot;
- accessibility check;
- bundle analysis;
- hash/evidence;
- version/snapshot;
- publish preview;
- rollback.

# 5. FLUJO VISIBLE DE 5 PASOS

La interfaz de fábrica presenta una barra/ribbon superior con progreso y botón `Next`, pero permite volver atrás sin perder estado.

## PASO 1 — DISEÑAR

`intent/template -> element builder -> design tokens -> preview`

Usuario puede:
- elegir plantilla;
- describir con texto;
- insertar componente;
- crear control desde cero.

PASS:
- existe definición válida;
- preview renderiza;
- no hay error de schema.

## PASO 2 — COMPONER

`component palette -> drag/drop canvas -> layout -> responsive -> navigation`

PASS:
- árbol UI válido;
- sin IDs duplicados;
- constraints resolubles;
- preview responsive mínimo.

## PASO 3 — CONECTAR

`UI event -> action contract -> backend/local binding -> permissions -> mock/real capability status`

El panel derecho muestra:
- evento;
- contrato;
- transporte;
- estado backend;
- permisos;
- fallback;
- evidencia.

PASS para preview: contrato válido, aunque backend real todavía pueda estar `BLOCKED/UNAVAILABLE` explícitamente.
PASS productivo: endpoint/capability real probado.

## PASO 4 — AI + TRANSFORMAR

`component inbox | AI improvement -> delta -> preview -> tests -> accept/reject`

Aquí se pueden importar capacidades OSS o pedir a una IA mejorar la pantalla.

PASS:
- transformación reversible;
- adapter generado/seleccionado;
- sandbox test aprobado.

## PASO 5 — VALIDAR / PUBLICAR / SEGUIR EDITANDO

`build -> tests -> visual checks -> evidence -> version -> private preview -> promote/export`

Resultados posibles:
- `DRAFT`;
- `TESTING`;
- `CLOSED_UNVERIFIED`;
- `VERIFIED_CLOSED`;
- `GAP`.

No hay botón que convierta manualmente GAP en PASS.

# 6. SHELL DE EXPERIENCIA

## 6.1 Ribbon superior contextual

Inspiración: facilidad de descubrimiento de Office web, reducida a grupos contextuales.

Grupos:
- Insert;
- Layout;
- Style;
- Data/Bindings;
- AI;
- Test;
- Version/Publish.

Los grupos cambian según selección para evitar saturación.

## 6.2 Left Rail

- Projects/Workspaces;
- Pages/Windows;
- Components;
- Component Inbox;
- Files/Assets;
- Workflow;
- History.

## 6.3 Center Canvas

- zoom/pan;
- desktop/tablet/mobile frames;
- rulers/guides;
- selection overlays;
- inline editing;
- live preview.

## 6.4 Right Inspector

Tabs:
- Properties;
- Style;
- Layout;
- State;
- Events;
- Backend;
- Accessibility;
- Evidence.

## 6.5 Bottom Workbench Drawer

Tabs:
- AI Chat;
- Tasks;
- Terminal;
- Logs;
- Tests;
- Network/Bindings;
- Diff.

# 7. CHAT / ORQUESTADOR YAIWES

El chat no es sólo mensajería. Es una superficie de command/control sobre objetos direccionables.

Cada panel registra una `SurfaceCapability`:

```json
{
  "surface_id": "factory.canvas.main",
  "actions": ["open","focus","select","insert","apply_delta","preview"],
  "permissions": ["ui:read","ui:write"],
  "state_ref": "workspace://current/ui/main"
}
```

El agente YAIWES puede pedir acciones; Policy/Guard decide si están autorizadas.

Flujo:
`ChatIntent -> Orchestrator -> SurfaceRouter -> Capability -> Action -> Result -> Evidence -> Chat/Canvas update`

# 8. WORKSPACE MODEL

Cada trabajo vive bajo:

```text
Workspace
├─ metadata
├─ goals
├─ requirements
├─ tasks
├─ ui_documents
├─ components
├─ artifacts
├─ files
├─ bindings
├─ evidence
├─ checkpoints
├─ memory_refs
└─ history
```

No se guarda todo en la ventana de contexto de la LLM. La fuente de verdad del proyecto exige memoria externa/retrieval/context packs.

# 9. MODELO DE DATOS FRONTEND

## ComponentDefinition

Campos mínimos:
- `id`;
- `version`;
- `kind`;
- `renderer`;
- `props_schema`;
- `slots`;
- `events`;
- `actions`;
- `design_tokens`;
- `capabilities`;
- `source_ref`;
- `license_ref`;
- `contract_ref`;
- `hash`.

## ComponentInstance

- `instance_id`;
- `definition_ref`;
- `props`;
- `style`;
- `layout`;
- `state_bindings`;
- `event_bindings`;
- `children`.

## UIDocument

- `document_id`;
- `version`;
- `root_instance`;
- `routes`;
- `tokens_ref`;
- `assets`;
- `bindings`;
- `history_ref`;
- `evidence_ref`.

## UIStateDelta

- `delta_id`;
- `base_version`;
- `operations`;
- `author_type` = human|ai|system;
- `author_id`;
- `reason`;
- `rollback_ref`;
- `tests_required`.

## BackendBinding

- `binding_id`;
- `ui_action`;
- `contract_ref`;
- `transport` = local|http|mcp|sdk;
- `capability_ref`;
- `secret_ref`;
- `input_map`;
- `output_map`;
- `timeout`;
- `fallback`;
- `health_ref`.

# 10. CONTRATO CON EL ENCHUFE UNIVERSAL

Todo módulo importado debe declarar:

`consume -> expone -> execution -> permissions -> sandbox -> limits -> health -> evidence -> failover`

La fábrica sólo muestra un componente como `READY` cuando:
- ficha válida;
- contrato compatible;
- adapter disponible;
- build/test mínimo aprobado.

# 11. FRONTEND / BACKEND SPLIT DE COMPONENTES OSS

Todo repositorio/componente investigado se clasifica:

`FRONTEND_ONLY | BACKEND_ONLY | FULLSTACK | TOOLING | DESIGN_ASSET`

Si es FULLSTACK:

```text
source component
    ├─ frontend/ donor capability
    └─ backend/ donor capability
```

Frontend se adapta a la fábrica.
Backend se deja en staging con:
- fuente + commit;
- licencia;
- función;
- entry points;
- dependencias;
- contrato propuesto;
- tests encontrados;
- riesgos;
- destino sugerido para Sol.

No se cablea a Sol hasta ownership/handoff explícito.

# 12. INTEGRACIÓN CON BACKEND SOL

Matriz obligatoria antes de construir T2:

| Necesidad UI | Contrato esperado | Estado real | Mock permitido | PASS productivo |
|---|---|---|---|---|
| Chat streaming | session/message/stream/cancel | verificar runtime | sí | stream real + cancel test |
| Model selector | provider/model list | verificar registry/router | sí | list real + health |
| Plugin panel | plugin registry | verificar component_registry | sí | registry read real |
| Workflow trace | task/state/events | verificar runner/ledger | sí | event/state real |
| Files/artifacts | artifact API | verificar contracts | sí | upload/read/version test |
| Checkpoint | checkpoint/recovery | verificar runtime | sí | create+restore test |
| Health | health endpoint/event | verificar | sí | real heartbeat |
| Evidence | verifier/evidence | verificar | sí | evidence readback |

`Mock permitido` nunca significa `integrado`.

# 13. MULTIPLATAFORMA

## Web
PWA/web app como superficie universal.

## Desktop Windows/Linux
Shell desktop que reutiliza la web UI y añade capabilities locales mediante bridge seguro. No exponer filesystem completo por defecto.

## Android/iOS
UI responsive/adaptativa; acciones complejas pueden delegarse a servicios web, manteniendo controles locales y cache/estado cifrado limitado.

## Contrato común
Misma capa de `SurfaceCapability` y `BackendBinding`; cada plataforma registra sólo capabilities soportadas.

# 14. ALMACENAMIENTO

Default:
- proyecto/config/cache local cuando aplique;
- servidor para agentes, modelos y artefactos web según producto.

Opcional:
- conectores elegidos por cliente.

En el trabajo actual de Astra, cualquier integración operativa externa está restringida a GitHub/Hugging Face hasta nueva autorización.

# 15. SEGURIDAD

Capas obligatorias:

1. AuthN usuario/dispositivo.
2. AuthZ por capability.
3. secret refs, no keys en frontend.
4. TLS en tránsito.
5. cifrado local de datos sensibles.
6. sandbox de preview/import.
7. CSP/Trusted Types donde aplique.
8. dependency/license/SBOM scan.
9. hashes y provenance.
10. audit log.
11. rollback/version immutable ref.
12. minimum privilege para connectors/plugins.
13. no ejecución de código OSS sin clasificación/test.
14. no persistir secretos en repo.

# 16. ROUTER DE MODELOS — VISTA FRONTEND

La fábrica no almacena claves. Renderiza:

`provider -> model -> health -> latency class -> capability tags -> availability`

Selector:
- AUTO;
- MANUAL.

AUTO consulta al backend/router mediante contrato. Si proveedor/modelo falla, frontend sólo refleja el failover decidido por runtime y permite override si Policy lo autoriza.

# 17. REFERENCIAS DE UX EXTERNAS

Patrones verificados a estudiar:

- Grok Build: plan mode, build/preview, subagents, skills, Git integration, sandbox/background tasks. https://x.ai/build
- Grok Bot: agente persistente con cloud computer y handoffs. https://docs.x.ai/grok-bot/overview
- Grok Build web/mobile: app creation, GitHub export, secrets, connectors. https://x.ai/news/grok-build-for-everyone
- Grok Workspace: side panel que trabaja dentro del documento. https://x.ai/grok/workspace
- Claude Cowork: agentic desktop/multitask reference. https://www.anthropic.com/news/introducing-anthropic-labs
- Claude Design: design systems, code import, fine-grained controls, inline comments and collaborative editing. https://www.anthropic.com/news/claude-design-anthropic-labs

Estas son referencias de producto/UX, no dependencias técnicas ni código a copiar.

# 18. 12 GOALS DE ENTRADA/SALIDA

1. Entrada natural o visual -> salida `UIDocument` válido.
2. Crear elemento sin código -> preview inmediato.
3. Componer con drag/drop -> layout responsive válido.
4. Importar componente -> candidato transformado y clasificado.
5. IA interviene -> delta reversible, nunca escritura opaca.
6. Backend se conecta -> binding declarativo verificable.
7. Secretos -> nunca en bundle/browser/repo.
8. Estado -> persistente/versionado/recoverable.
9. Tareas -> trazables a artefactos y evidencia.
10. Plataforma -> comportamiento consistente con capability negotiation.
11. OSS -> provenance/licencia/hash antes de promoción.
12. Cierre -> build+test+readback; nunca PASS por existencia.

# 19. COUNCIL 12 — PREGUNTAS OBLIGATORIAS POR CAMBIO MAYOR

1. ¿Reduce fricción real?
2. ¿Duplica una capacidad existente?
3. ¿Rompe single-writer?
4. ¿Introduce estado canónico en UI?
5. ¿Puede ser determinista?
6. ¿Requiere LLM innecesariamente?
7. ¿Es reversible?
8. ¿Tiene contrato claro?
9. ¿Se puede testear aisladamente?
10. ¿Expone secreto/dato sensible?
11. ¿Funciona cross-platform o declara limitación?
12. ¿La evidencia permite que otro auditor lo certifique?

# 20. TRES SIMULACIONES DE ARQUITECTURA

## S1 — usuario crea dashboard desde cero

`prompt/template -> M1 -> M2 -> data bindings -> preview -> AI polish -> tests -> version`

GAP a vigilar: demasiadas opciones en paso 1. Mitigación: progressive disclosure + Smart Insert.

## S2 — usuario arrastra repo/componente OSS

`inbox -> metadata/hash/license -> split -> contract -> adapter -> sandbox -> preview -> tests -> registry candidate`

GAP: ejecutar código peligroso. Mitigación: static-first, sandbox, deny permissions por defecto.

## S3 — IA mejora una ventana existente

`chat intent -> inspect UIDocument -> plan -> delta -> visual preview -> test -> user/policy approval -> new version`

GAP: cambios amplios difíciles de revisar. Mitigación: deltas pequeños y agrupados por intención.

# 21. TRES REFUTACIONES

1. "Más frameworks = fábrica mejor" -> falso. Más canvases/registries generan conflictos. Seleccionar un owner por capacidad.
2. "La IA puede editar directo porque hay Git" -> falso. Git no sustituye sandbox, schema, policy ni preview.
3. "Podemos hacer UI con mocks y llamarlo integrado" -> falso. Mock sólo permite diseño; PASS requiere backend real probado.

# 22. CRITERIO DE T1 VERIFIED_CLOSED

T1 Factory sólo cierra si existen pruebas de:

- shell usable;
- 5 pasos navegables;
- M1-M5 presentes y cableados;
- canvas drag/drop;
- inspector;
- component registry;
- component inbox;
- AI delta path;
- universal contract path;
- preview sandbox;
- frontend/backend split;
- build;
- tests;
- version/rollback;
- private preview;
- evidence/readback;
- documentación actualizada.

Cada punto debe tener ruta + SHA/diff + test/log + read-back.

# 23. SIGUIENTE NODO

`T1_FACTORY_COMPONENT_XRAY_40_PLUS`

Objetivo: inventariar >40 componentes existentes, clasificarlos por capacidad y elegir donantes para cada módulo antes de escribir implementación nueva.
