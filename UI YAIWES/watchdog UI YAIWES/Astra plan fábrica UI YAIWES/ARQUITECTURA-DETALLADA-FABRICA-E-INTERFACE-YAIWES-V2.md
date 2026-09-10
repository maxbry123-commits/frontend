# ARQUITECTURA DETALLADA V2 — FÁBRICA + INTERFACE UI YAIWES

Fecha: 2026-09-10
Identidad: `➡️ Astra plan fábrica UI YAIWES`
Contrato: `tel.workflow/v3`
Modo: `FAIL_CLOSED_LOOP`
Estado: `ACTIVE_LOOP / DESIGN_AUDITED / IMPLEMENTATION_PENDING`

V2 conserva V1 como evidencia histórica y corrige rutas, fronteras y contradicciones detectadas por auditoría 4 pasadas. V2 es la arquitectura de decisión vigente para Astra.

---

# 1. OBJETIVO ÚNICO PERSISTENTE

Construir y mejorar continuamente el frontend YAIWES y su Fábrica UI interna. La Fábrica es el instrumento permanente para crear, transformar, integrar, probar, versionar y corregir la Interface YAIWES.

YAIWES final es un Work AI-first propietario/SaaS, multiplataforma, con:
- chat/orquestador central tipo Jarvis;
- múltiples trabajos/workspaces simultáneos;
- agentes y workflows;
- editor/build/design;
- archivos y artefactos;
- terminal/logs/tests;
- panel de plugins/backends;
- model/provider selector;
- task trace/evidencia/checkpoints;
- operación parcial local segura;
- servicios de agentes/LLM desde web;
- almacenamiento local por defecto cuando aplique y conectores opcionales elegidos por el cliente.

Astra es frontend-first. Comprende backend y prepara donors/adapters backend, pero no escribe rutas de Sol sin handoff.

---

# 2. RUTAS FÍSICAS CANÓNICAS

## 2.1 Fábrica real actual

`fabrica de UI INTERFACE fromtend/`

Esta ruta existe en `main` y contiene, entre otros, Craft.js, GrapesJS, Fluent UI, Office-Ribbon-2010, Capacitor, Tauri, Workbox, Dexie y documentación/cableado de fábrica.

## 2.2 Biblioteca OSS YAIWES

`UI YAIWES/componentes open soure UI YAIWES/`

Contiene la biblioteca amplia usada para extraer capacidades frontend/backend. La matriz Astra tiene 46 candidatos iniciales; 46 NO es el inventario total.

## 2.3 Interface producto histórica existente

`UI YAIWES interface/`

Contiene las 39 ventanas históricas, código de versiones, seguridad/empaque, fábrica-ui auxiliar, Crazy Wall histórico y handoff 2026-09-09.

## 2.4 Área de trabajo Astra

`UI YAIWES/watchdog UI YAIWES/Astra plan fábrica UI YAIWES/`

Raíces obligatorias:
- `Frontend/`
- `backend/`

`Frontend/` = staging de frontend Astra.
`backend/` = `DONOR_STAGING_ONLY`, nunca equivalente a backend Sol integrado.

## 2.5 Backend Sol — sólo referencia/contrato hasta handoff

`UI YAIWES/➡️📂 Wordflow LOOP UI YAIWES/wordflow_loop/wordflow_loop/`

---

# 3. PRECEDENCIA DE FUENTES

Cuando dos documentos discrepan:

`INPUT literal más reciente del Director > evidencia física fresca en main > Crazy Wall Astra > STATE/CHECKPOINT Astra > fuentes verdad del proyecto > arquitectura Astra V2 > arquitectura V1 > documentos históricos de fábrica/interface > inferencia`.

Una instrucción posterior puede superar una restricción histórica; la contradicción debe documentarse, no borrarse.

Ejemplo resuelto:
- histórico: fábrica/backend/sandbox “no cloud”;
- INPUT posterior: fábrica privada en Hugging Face + agentes/LLMs web;
- decisión: la fábrica sigue siendo interna/no usuario, pero puede vivir como web privada HF; runtime local y servicios web se separan por contrato seguro.

---

# 4. DOS NIVELES FUNCIONALES, SIN CONTRADICCIÓN

## Nivel de producto

F1 — FÁBRICA INTERNA: usada por Director/Astra/IA autorizada para construir el producto.
F2 — RUNTIME/INTERFACE: usada por el cliente; no expone el taller interno.

## Submódulos obligatorios dentro de F1

M1 `ELEMENT_BUILDER`
M2 `UI_COMPOSER`
M3 `COMPONENT_TRANSFORMER`
M4 `AI_OPERATOR`
M5 `DETERMINISTIC_MODULE_KIT`

Los 5 módulos no reemplazan la separación F1/F2: viven dentro de F1.

---

# 5. PRINCIPIO 0-FRICCIÓN

Toda acción frecuente puede entrar por tres superficies:

`DRAG/DROP | COMMAND PALETTE | JARVIS PROMPT`

Las tres deben converger en la MISMA `TypedAction`. No se permiten tres implementaciones funcionales paralelas.

Flujo único:

`intent -> TypedAction -> FrontendGuard -> Factory/Surface Router -> StateDelta/BackendBinding -> preview/test -> apply|reject|rollback -> evidence`.

Objetivo UX:
- acción primaria visible;
- configuración avanzada progresiva;
- defaults seguros;
- preview inmediato;
- undo/redo;
- V+ inmutable/reversible;
- errores explicados como acción correctiva, con evidencia técnica expandible.

---

# 6. SHELL DE FÁBRICA

## Top Ribbon contextual

Grupos:
`Insert | Layout | Style | Data/Bindings | AI | Test | Version/Publish`.

El ribbon sólo muestra comandos válidos para la selección/step actual.

## Left Rail

`Projects | Pages/Windows | Components | Component Inbox | Files/Assets | Workflow | History`.

## Center Canvas

`zoom/pan | frames desktop/tablet/mobile | guides/grid | selection | drag/drop | resize | inline edit | preview`.

## Right Inspector

`Properties | Style | Layout | State | Events | Backend | Accessibility | Evidence`.

## Bottom Workbench

`Jarvis/AI | Tasks | Terminal | Logs | Tests | Network/Bindings | Diff`.

---

# 7. STATE MACHINE DE LOS 5 PASOS

Cada paso tiene entrada, salida, PASS, FAIL/GAP y rollback.

## S1 DESIGN/CREATE

Entrada:
`Goal | TemplateRef | ComponentRef | blank`.

Ejecución:
`ElementBuilder -> design tokens -> props schema -> local preview`.

Salida:
`ComponentDraft`.

PASS:
- schema válido;
- renderer carga;
- preview mínimo;
- IDs únicos.

FAIL:
`GAP_S1 -> evidence -> rollback/no promotion`.

## S2 COMPOSE

Entrada: `ComponentDraft[] + UIDocument base`.
Ejecución: palette -> drag/drop -> layout -> slots -> responsive -> navigation.
Salida: `UIDocument@Vn+1 DRAFT`.

PASS:
- árbol acíclico;
- constraints resolubles;
- responsive baseline;
- undo/redo round-trip.

## S3 CONNECT

Entrada: `UIDocument + UI events + capability requirements`.
Ejecución:
`UI event -> TypedAction -> BackendBinding/local binding -> policy -> mock/real capability check`.
Salida: `BoundUIDocument`.

Preview PASS permite mock explícito.
Productive PASS exige backend/capability real y test.

## S4 AI/TRANSFORM

Entrada:
`component source | UI goal | existing UIDocument`.

Transform component:
`source -> provenance -> static analysis -> split -> manifest -> adapter -> sandbox -> tests`.

AI improvement:
`goal -> context pack -> model/provider ref -> PlanProposal -> UIStateDelta -> preview/diff -> guards -> tests`.

Salida:
`RegistryCandidate | ProposedDelta`.

PASS sólo si reversible y testable.

## S5 VALIDATE/PUBLISH/EDIT

Entrada: `BoundUIDocument + candidates/deltas`.
Ejecución:
`schema -> type/lint -> unit -> contract -> E2E -> visual -> accessibility -> security -> bundle -> evidence -> version`.

Salida:
`DRAFT | TESTING | CLOSED_UNVERIFIED | VERIFIED_CLOSED | GAP`.

Una publicación privada HF es deployment evidence; no reemplaza tests/verifier.

---

# 8. M1 ELEMENT BUILDER

Genera:
`window | panel | button | selector | segment | toolbar item | ribbon group | modal | card | form/input | list | table | tree | command item`.

Contrato de salida `ComponentDefinition`:
- id;
- version;
- kind;
- renderer_ref;
- props_schema;
- slots;
- states;
- events;
- actions;
- tokens_ref;
- accessibility metadata;
- source/provenance;
- contract_ref;
- hash.

Nunca contiene API key ni endpoint secreto.

---

# 9. M2 UI COMPOSER

Responsable de:
- canvas;
- layer tree;
- selection model;
- drag/drop;
- resize;
- snapping/guides;
- groups;
- responsive constraints;
- docking;
- routes/navigation;
- data/state bindings;
- templates;
- undo/redo;
- snapshots/versioning.

Regla: existe UN `CanvasOwner` canónico. Otros motores son donors/adapters.

Nodo de selección:
`T1_04_CANVAS_OWNER_SELECTION`.

Bakeoff mínimo si están físicamente verificados:
`Craft.js | GrapesJS | Puck`.

Criterios:
license SaaS, React fit, serialización, nesting/slots, DnD/resize, inspector extensible, undo/redo, responsive, plugin API, isolation, footprint, testability, accessibility.

No seleccionar por estrellas/nombre.

---

# 10. M3 COMPONENT TRANSFORMER / COMPONENT INBOX

Entrada: repo/directorio/componente/artefacto.

Pipeline:

`SOURCE`
`-> SOURCE_URL/REF/COMMIT`
`-> LICENSE/SBOM/HASH`
`-> STATIC_ANALYSIS`
`-> EXPORT/ENTRYPOINT MAP`
`-> CAPABILITY MAP`
`-> FRONTEND|BACKEND_DONOR|TOOLING|REFERENCE|REJECT`
`-> MINIMAL EXTRACTION`
`-> ComponentManifest`
`-> adapter`
`-> sandbox preview`
`-> build/test`
`-> RegistryCandidate`.

No se ejecuta código importado con permisos amplios antes del sandbox/test.

---

# 11. M4 AI OPERATOR

Modos:
`MANUAL | AI_ASSIST | AUTOPILOT`.

IA no toca estado canónico directamente.

Contrato:
`AIIntent -> ContextPack -> PlanProposal -> UIStateDelta -> PreviewDiff -> GuardDecision -> Tests -> Apply|Reject|Rollback -> Evidence`.

Autopilot puede avanzar steps sólo mientras:
- capability autorizada;
- path ownership válido;
- tests verdes;
- delta dentro de límites;
- no requiere consentimiento externo pendiente;
- no contiene secreto plano.

---

# 12. M5 DETERMINISTIC MODULE KIT

Operaciones sin LLM cuando son mecánicas:
- scan/inventory;
- copy/move mediante motores canónicos cuando aplique;
- hashing/provenance;
- manifest generation;
- schema validation;
- component registry update;
- build;
- typecheck/lint;
- unit/contract/E2E;
- visual snapshots;
- accessibility checks;
- dependency/license/SBOM checks;
- bundle report;
- version/snapshot;
- evidence pack;
- preview publish;
- rollback.

LLM decide sólo donde agrega valor; lo determinista no se delega a LLM.

---

# 13. CONTRATOS DE CABLEADO FRONTEND

## 13.1 TypedAction

```json
{
  "schema":"yaiwes.ui.action/v1",
  "action_id":"uuid",
  "workspace_id":"...",
  "surface_id":"...",
  "capability":"ui|task|artifact|model|plugin.*",
  "payload":{},
  "actor":{"type":"human|ai|system","ref":"..."},
  "idempotency_key":"...",
  "correlation_id":"...",
  "timestamp":"ISO8601"
}
```

## 13.2 BackendBinding

```json
{
  "schema":"yaiwes.backend.binding/v1",
  "binding_id":"...",
  "action_type":"...",
  "contract_ref":"...",
  "transport":"local|http|mcp|sdk",
  "capability_ref":"...",
  "input_map":{},
  "output_map":{},
  "secret_ref":"...",
  "timeout_ms":30000,
  "fallback":{},
  "health_ref":"..."
}
```

`BackendBinding` es contrato frontend/propuesto hasta que el backend real exponga y pruebe la capability.

## 13.3 RuntimeEvent

```json
{
  "schema":"yaiwes.runtime.event/v1",
  "event_id":"...",
  "correlation_id":"...",
  "node_id":"...",
  "status":"PENDING|RUNNING|PASS|FAIL|BLOCKED|INCONCLUSIVE",
  "output_ref":"...",
  "evidence":[],
  "gaps":[],
  "timestamp":"ISO8601"
}
```

## 13.4 UIStateDelta

```json
{
  "schema":"yaiwes.ui.delta/v1",
  "delta_id":"...",
  "base_version":"...",
  "operations":[],
  "author":{"type":"human|ai|system","ref":"..."},
  "reason":"...",
  "rollback_ref":"...",
  "tests_required":[],
  "evidence_ref":"..."
}
```

## 13.5 ComponentManifest

Debe incluir:
`id/version/source_url/source_ref/source_commit/license/integrity/classification/entrypoint/renderer/props_schema/events/actions/permissions/sandbox/adapter/tests/evidence`.

---

# 14. CROSS-CHECK CON BACKEND SOL REAL

Estado físico observado:

`contracts.py` contiene `Evidence`, `NodeContract`, `LayerResult` y Status:
`PENDING/RUNNING/PASS/FAIL/BLOCKED/INCONCLUSIVE`.

Adaptación:
`TypedAction -> adapter -> NodeContract` donde aplique.
`LayerResult -> RuntimeEvent/TaskTrace`.

Regla crítica:
`Status.PASS` backend se representa como `RUNTIME_PASS`; nunca se traduce automáticamente a `VERIFIED_CLOSED`.

`component_registry.py` contiene `ComponentSpec(id,name,slug,role,mode,status)` y una tabla runtime inicial. Frontend debe preservar role/mode/status y solicitar evidencia física; no inferir cierre.

`llm_gate.py` actual sólo autoriza `ambiguity_resolution`, `semantic_ranking`, `bounded_summary`, con ratio <=5% y caller inyectado.

Consecuencia:
M4 AI Operator / router de diseño NO está verificado como capacidad del backend Sol. Se mantiene `GAP_BACKEND_LLM_CAPABILITY_FOR_FACTORY` hasta contrato/handoff real.

---

# 15. MINI ROUTER DE MODELOS — DISEÑO

Modelos/candidatos solicitados por Director:
1. Kimi K;
2. MiniMax;
3. DeepSeek V4 Pro/Flash;
4. GLM-5;
5. Meta Glimer (nombre exacto/model ID a verificar);
6. GPT-OSS.

El catálogo es intención, NO prueba de disponibilidad.

## ProviderRef

```json
{
  "provider_id":"...",
  "model_id":"...",
  "secret_ref":"...",
  "health_ref":"...",
  "capabilities":["code","reasoning","vision","tool_use"],
  "priority":0,
  "enabled":true
}
```

## Router flow

`TaskProfile -> candidate models -> provider/model health -> capability match -> policy -> choose -> call -> timeout/error? -> circuit mark -> next candidate -> result/evidence`.

Never:
`browser -> raw API key`.

Estados:
`AVAILABLE | DEGRADED | RATE_LIMITED | AUTH_FAIL | MODEL_UNAVAILABLE | PROVIDER_DOWN | UNKNOWN`.

AUTO selecciona automáticamente; MANUAL fija model/provider si policy/health lo permite.

---

# 16. HUGGING FACE PRIVATE FACTORY

Objetivo del INPUT:
usar HF como cómputo y web privada para canvas/fábrica cuando esté preparada.

Arquitectura candidata:

`Browser authorized -> Private HF Space Factory -> frontend bundle -> secure API/adapter -> approved backend/model services -> GitHub result/version storage`.

HF nunca recibe secrets embebidos en bundle. Los secretos viven en secret store del servicio/Space y se usan como referencias en frontend.

Gate antes de declarar HF READY:
- existencia/privacidad del Space verificada;
- auth access probado;
- build reproducible;
- secrets no expuestos;
- storage/write policy definida;
- health endpoint;
- rollback/version;
- E2E mínimo.

Estado actual: `GAP_HF_PRIVATE_FACTORY_DEPLOYMENT_NOT_VERIFIED`.

---

# 17. FUSIÓN OSS — REGLA Y LOTES

Fuentes físicas principales:
- `fabrica de UI INTERFACE fromtend/`;
- `UI YAIWES/componentes open soure UI YAIWES/`.

No fusionar aplicaciones completas.

Lotes:
A Shell/Canvas/Editor/Artifact;
B Provider/Realtime/Transport;
C Memory/Search/Documents;
D Security/Isolation;
E Observability/Tests;
F VERIFY_REQUIRED.

Cada capacidad debe declarar:
`source -> commit/license -> function -> extraction unit -> Frontend/backend destination -> manifest -> adapter -> tests -> evidence`.

---

# 18. ALMACENAMIENTO Y LOCAL-FIRST

Frontend local:
- settings no sensibles;
- workspace cache;
- drafts/version refs;
- local artifacts permitidos;
- encrypted local state donde sea sensible.

Web/services:
- agents/LLMs;
- product-controlled component/service delivery;
- optional remote artifacts according to product policy.

Conectores cliente:
se modelan como plugins/capabilities opt-in. Para el trabajo actual de Astra sólo GitHub/Hugging Face están autorizados como integraciones operativas.

---

# 19. MULTIPLATAFORMA

Web: PWA/capability baseline.
Windows/Linux desktop: shell seguro reutilizando UI web + local bridge mínimo.
Android/iOS: responsive shell + platform capabilities; no replicar lógica de negocio en cada cliente.

Regla:
`same TypedAction + capability negotiation`, diferentes adapters de plataforma.

Cada plataforma declara:
- filesystem availability;
- background task availability;
- notifications;
- local model capability;
- secure storage;
- windowing mode;
- offline mode.

---

# 20. SEGURIDAD

Obligatorio:
1. AuthN usuario/dispositivo.
2. AuthZ por capability.
3. secret_ref/capability tokens.
4. TLS.
5. cifrado local sensible.
6. sandbox imports/previews.
7. CSP/Trusted Types/iframe isolation donde aplique.
8. provenance + hash + license + SBOM.
9. least privilege.
10. audit/evidence log.
11. immutable V+ refs y rollback.
12. rate/size/time limits.
13. no secret in logs/manifests/UI bundle.
14. no plugin/conector fuera GitHub/HF en este worker sin autorización posterior.

---

# 21. PRUEBAS OBLIGATORIAS

Por módulo:
`unit + schema + contract`.

Por fábrica:
`E2E + visual + accessibility + responsive + rollback + persistence + sandbox boundary`.

Por backend binding:
`mock contract` durante T1 y `real capability test` para PASS productivo.

Por HF:
`private access + build + health + no-secret exposure + E2E`.

---

# 22. TRES SIMULACIONES GATE

S1 HUMANO:
usuario crea una ventana desde template/drag-drop, conecta una acción, previsualiza, guarda V+, cierra y reabre. PASS si round-trip mantiene estructura y undo/rollback.

S2 AI:
AI recibe goal, propone delta, preview/test falla intencionalmente. PASS si estado estable NO cambia y rollback/evidence quedan correctos.

S3 BACKEND SWAP:
UI se construye contra mock tipado; luego adapter apunta a backend real sin reescribir componentes visuales. PASS si contrato real produce mismos RuntimeEvent normalizados.

---

# 23. T1 — PLAN DETERMINISTA

`T1_00 INPUT LOCK` ->
`T1_01 PROFILE` ->
`T1_02 ARCHITECTURE` ->
`T1_03 COMPONENT XRAY` ->
`T1_04 CANVAS OWNER` ->
`T1_05 COMPONENT REGISTRY CONTRACT` ->
`T1_06 FACTORY SHELL/STEP ENGINE` ->
`T1_07 M1` ->
`T1_08 M2` ->
`T1_09 M3` ->
`T1_10 M4` ->
`T1_11 M5` ->
`T1_12 UNIVERSAL ADAPTERS` ->
`T1_13 SANDBOX/PREVIEW` ->
`T1_14 TEST/EVIDENCE/ROLLBACK` ->
`T1_15 3 SIMULATIONS` ->
`T1_16 INDEPENDENT AUDIT`.

T1 sólo `VERIFIED_CLOSED` cuando M1-M5 están realmente cableados y las pruebas/read-back existen.

---

# 24. T2 — PREDEFINIDA PARA RETOMA, BLOQUEADA PARA EJECUCIÓN

Antes de T1 cierre sólo se permite research/read-only contract matrix.

Después de T1 `VERIFIED_CLOSED` + ownership/path handoff:

`T2_00 requirements/source crosscheck`
-> `T2_01 AppShell/WorkspaceManager`
-> `T2_02 Jarvis Command Center`
-> `T2_03 Workspaces/Files/Artifacts`
-> `T2_04 Workflow/Task Trace`
-> `T2_05 Plugin/Backend Panel`
-> `T2_06 Model/Provider Selector`
-> `T2_07 Multiplatform responsive/capabilities`
-> `T2_08 Security/permissions/secret refs`
-> `T2_09 real backend bindings`
-> `T2_10 E2E/release candidate`
-> independent verification.

Cada T2 node debe producir V+; nunca destruir ventanas históricas.

---

# 25. RETOMA ASTRA / CLAUDE

Orden obligatorio de lectura:
1. INPUT literal base;
2. INPUT addendum;
3. INPUT part-02;
4. Crazy Wall Astra;
5. STATE Astra;
6. PERFIL;
7. Arquitectura V2;
8. matriz de componentes;
9. auditoría 4 pasadas vigente;
10. PLAN;
11. CHECKPOINT;
12. RECOVERY;
13. HANDOFF.

Luego:
`read main HEAD -> verify paths/ownership -> verify current_node evidence -> execute only current_node/safe task -> evidence -> update state/checkpoint/handoff`.

Claude puede ser auditor independiente de T1. Puede retomar T2 sólo cuando el gate y ownership lo permitan.

---

# 26. DEFINICIÓN DE “NO HUECOS”

“No huecos” NO significa fingir que todo está implementado. Significa que toda capacidad necesaria está en una de estas clases:

`IMPLEMENTED+VERIFIED | IMPLEMENTED_UNVERIFIED | SPECIFIED | PENDING_NODE | GAP_WITH_OWNER_AND_EXIT_CRITERIA | EXTERNAL_DEPENDENCY`.

Ningún elemento puede quedar “implícito”.

GAPs vigentes al emitir V2:
- `GAP_PROVIDER_MODEL_AVAILABILITY`;
- `GAP_HF_PRIVATE_FACTORY_DEPLOYMENT_NOT_VERIFIED`;
- `GAP_BACKEND_LLM_CAPABILITY_FOR_FACTORY`;
- `GAP_CANVAS_OWNER_NOT_SELECTED`;
- `GAP_COMPONENT_XRAY_NOT_COMPLETE`;
- `GAP_REAL_BACKEND_BINDINGS_NOT_VERIFIED` (T2 blocked).

Todos tienen nodo de salida en T1/T2.

---

# 27. REGLA DE CIERRE

`SOURCE_PRESENT != WIRED != RUNTIME_TEST_PASS != VERIFIED_CLOSED`.

Cierre por nodo requiere combinación suficiente de:
`literal/source -> path -> diff/blob/commit SHA -> test/run/log -> read-back -> verifier/reviewer result`.

El productor no se autocertifica.
