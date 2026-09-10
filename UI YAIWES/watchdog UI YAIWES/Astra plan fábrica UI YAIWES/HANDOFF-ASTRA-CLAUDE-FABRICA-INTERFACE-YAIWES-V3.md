# HANDOFF V3 — ASTRA / CLAUDE — FÁBRICA + INTERFACE UI YAIWES

Fecha: 2026-09-10
Contrato: `tel.workflow/v3`
Modo: `FAIL_CLOSED_LOOP`
Estado: `ACTIVE_LOOP`
Owner actual: `➡️ Astra plan fábrica UI YAIWES`
Scope: exclusivamente `FÁBRICA UI + INTERFACE UI YAIWES`

> Este archivo es el punto de relevo operativo vigente. No sustituye los INPUT literales; obliga a leerlos. V2 queda como historia.

# 1. MISIÓN DEL WORKER QUE RETOMA

Continuar el trabajo frontend/fábrica YAIWES sin reinterpretar el objetivo, sin invadir backend de Sol y sin declarar tareas cerradas por mera presencia de archivos.

Tarea 1:
construir y certificar la Fábrica UI interna de cero fricción.

Tarea 2:
usar esa fábrica para construir/integrar la Interface UI YAIWES después de que T1 quede `VERIFIED_CLOSED`.

Objetivo permanente:
Work AI-first propietario/SaaS, multiplataforma, con Jarvis Chat/orquestador, workspaces, workflow/agentes, code/design/build, artifacts/files, terminal, task trace, plugins/backend panel, model selector, evidence/checkpoints y operación local+web segura.

# 2. GATE NO NEGOCIABLE

`T1_FACTORY -> VERIFIED_CLOSED -> T2_INTERFACE productive execution`

Mientras T1 no cierre, T2 sólo puede recibir:
- lectura;
- research;
- source cross-check;
- contract/requirement design;
- mocks contractuales;
- GAP discovery.

No escribir producto T2 ni marcarlo ACTIVE antes del gate.

# 3. ORDEN EXACTO DE LECTURA

Antes de cualquier acción leer completos:

1. `INPUT-BLOCK-LITERAL-2026-09-10.md`
2. `INPUT-BLOCK-LITERAL-ADDENDUM-2026-09-10.md`
3. `INPUT-BLOCK-LITERAL-PART-02-2026-09-10.md`
4. `CRAZY-WALL-ASTRA-FABRICA-INTERFACE-UI-YAIWES.json`
5. `STATE.json`
6. `CHECKPOINT.json`
7. `PERFIL-TRABAJO-Y-PERFIL-UI-YAIWES.md`
8. `ARQUITECTURA-DETALLADA-FABRICA-E-INTERFACE-YAIWES-V2.md`
9. `MATRIZ-FUSION-46-COMPONENTES-FRONTEND-BACKEND.md`
10. `PLAN-MAESTRO-TAREA1-TAREA2-ASTRA-V2.md`
11. `AUDITORIA-FORENSE-4-PASADAS-ASTRA-V2.md`
12. `AUDITORIA-4-PASADAS-INPUT-PLAN-ARQUITECTURA-CABLEADO-2026-09-10.md`
13. `RECOVERY-PATCH-ASTRA-FABRICA-INTERFACE-YAIWES-V3.md`
14. este Handoff V3.

Después de leer:
`fetch fresh main HEAD -> compare current_node -> check owner/write_paths -> verify physical evidence -> execute one node/safe task -> tests -> evidence -> update state/checkpoint/handoff`.

# 4. INTEGRACIONES AUTORIZADAS

Este worker sólo puede usar:
- GitHub;
- Hugging Face.

Otros plugins/conectores: `DENY` salvo autorización explícita posterior del Director.

Nunca copiar al repositorio las API keys entregadas en chat. Frontend y manifests usan `secret_ref`.

# 5. RUTAS FÍSICAS

Fábrica actual:
`fabrica de UI INTERFACE fromtend/`

Biblioteca OSS:
`UI YAIWES/componentes open soure UI YAIWES/`

Interface histórica/producto existente:
`UI YAIWES interface/`

Workspace Astra:
`UI YAIWES/watchdog UI YAIWES/Astra plan fábrica UI YAIWES/`

Staging frontend Astra:
`UI YAIWES/watchdog UI YAIWES/Astra plan fábrica UI YAIWES/Frontend/`

Staging backend donor Astra:
`UI YAIWES/watchdog UI YAIWES/Astra plan fábrica UI YAIWES/backend/`

Backend Sol — referencia/read-only hasta handoff:
`UI YAIWES/➡️📂 Wordflow LOOP UI YAIWES/wordflow_loop/wordflow_loop/`

No usar `UI YAIWES/Fabrica UI YAIWES/` como ruta física: en la auditoría devolvió 404.

# 6. QUÉ YA ESTÁ DOCUMENTADO Y QUÉ NO ESTÁ IMPLEMENTADO

Documentado/persistido:
- INPUT literal en tres archivos;
- perfil de trabajo;
- arquitectura V2;
- Crazy Wall dedicado;
- STATE;
- CHECKPOINT;
- matriz inicial 46;
- plan T1/T2;
- auditorías 4 pasadas;
- Recovery V3;
- este Handoff.

No demostrar como terminado:
- XRAY exhaustivo de componentes;
- elección CanvasOwner;
- Component Registry contract final;
- Factory Shell/Step Engine real;
- M1-M5 implementados y cableados;
- sandbox/preview final;
- provider/model router real;
- HF private factory desplegada/probada;
- test suite completa;
- auditoría independiente final;
- T2 productiva.

Estado correcto: `ACTIVE_LOOP`.

# 7. CURRENT NODE

`T1_03_COMPONENT_XRAY`

Siguiente si y sólo si T1_03 pasa:
`T1_04_CANVAS_OWNER_SELECTION`.

T1_03 debe fusionar el conocimiento de DOS fuentes físicas, sin fusionar ciegamente sus repos:

A. `fabrica de UI INTERFACE fromtend/`
B. `UI YAIWES/componentes open soure UI YAIWES/`

Por cada candidato útil:
1. nombre exacto;
2. ruta física;
3. source URL;
4. source ref/commit;
5. licencia;
6. entrypoints/exports;
7. capacidad reutilizable concreta;
8. frontend/backend/fullstack/tooling/reference/reject;
9. dependencias;
10. riesgos/licencia/supply-chain;
11. unidad mínima a reutilizar;
12. contrato/adapter;
13. test requerido;
14. evidence requerido;
15. destino Frontend/backend donor.

La matriz de 46 actual = `SOURCE_PRESENT_ONLY` y NO inventario total.

# 8. FÁBRICA — MODELO FUNCIONAL

Nivel F1: Fábrica interna privada.
Nivel F2: Interface/runtime para usuario.

Dentro de F1:
- M1 Element Builder;
- M2 UI Composer;
- M3 Component Transformer/Inbox;
- M4 AI Operator;
- M5 Deterministic Module Kit.

Flujo visible:
`1 DESIGN/CREATE -> 2 COMPOSE -> 3 CONNECT -> 4 AI/TRANSFORM -> 5 VALIDATE/PUBLISH/EDIT`.

Cada paso conserva estado, permite Back/Next y no destruye V estable.

# 9. UX CERO FRICCIÓN

Tres entradas equivalentes:
`drag/drop | command palette | Jarvis prompt`.

Las tres generan la misma `TypedAction`; no tres implementaciones.

Shell deseado:
- ribbon superior contextual tipo Office mejorado;
- left rail de projects/windows/components/inbox/files/workflow/history;
- center canvas;
- right inspector;
- bottom workbench AI/tasks/terminal/logs/tests/network/diff.

# 10. CABLEADO CANÓNICO

Frontend:

`Human/AI Intent`
`-> TypedAction`
`-> FrontendGuard`
`-> Factory Step Engine / Universal Action Bus`
`-> Adapter`
`-> BackendBinding si aplica`
`-> Backend/Local Capability`
`-> RuntimeEvent`
`-> Normalizer`
`-> UIStateDelta`
`-> Verifier/Evidence`
`-> Frontend Store`
`-> Render`.

Component import:

`Source`
`-> URL/ref/commit/license/hash`
`-> static inspection`
`-> capability extraction`
`-> Frontend/backend split`
`-> ComponentManifest`
`-> universal contract`
`-> adapter`
`-> sandbox preview`
`-> tests`
`-> RegistryCandidate`
`-> V+ + evidence`.

AI edit:

`AIIntent`
`-> ContextPack`
`-> PlanProposal`
`-> UIStateDelta`
`-> diff/preview`
`-> guards`
`-> tests`
`-> apply|reject|rollback`
`-> evidence`.

# 11. BACKEND CROSS-CHECK QUE YA SE HIZO

Sol backend real fue leído para evitar diseñar UI sobre ficción.

`contracts.py`:
- Status PENDING/RUNNING/PASS/FAIL/BLOCKED/INCONCLUSIVE;
- Evidence;
- NodeContract;
- LayerResult.

Regla UI:
backend `PASS` = `RUNTIME_PASS`; no `VERIFIED_CLOSED`.

`component_registry.py`:
- ComponentSpec id/name/slug/role/mode/status;
- existen estados WIRED/DONOR_ONLY/REFERENCE_ONLY/PENDING_SOURCE.

Regla UI:
mostrar el estado real y su evidencia; no convertir WIRED en integrado/cerrado.

`llm_gate.py`:
- ambiguity_resolution;
- semantic_ranking;
- bounded_summary;
- ratio LLM <= 5%;
- caller inyectado.

Regla:
no asumir que Sol ya soporta AI design/build/autopilot general.
GAP vigente: `GAP_BACKEND_LLM_CAPABILITY_FOR_FACTORY`.

# 12. FRONTEND CONTRACTS QUE DEBEN SER CANÓNICOS

T1_05/T1_12 debe cerrar:
- `ComponentManifest`;
- `ComponentDefinition`;
- `ComponentInstance`;
- `UIDocument`;
- `TypedAction`;
- `UIStateDelta`;
- `BackendBinding`;
- `RuntimeEvent/TaskEvent`;
- `ProviderRef`;
- `ArtifactRef`;
- `EvidenceRef`;
- `SurfaceCapability`.

`BackendBinding` es un contrato frontend/adaptador propuesto hasta que un backend real pruebe la capability.

# 13. CANVAS BAKEOFF

No integrar múltiples canvases completos.

Cuando T1_03 termine, comparar Craft.js / GrapesJS / Puck si están físicamente verificados.

Elegir UNO por:
- licencia SaaS;
- React fit;
- serialización;
- nesting/slots;
- DnD/resize;
- inspector;
- undo/redo;
- responsive;
- plugin API;
- sandbox isolation;
- footprint;
- tests;
- accessibility.

Resultado:
`CANVAS_OWNER=<one>` + donor list.

# 14. MINI ROUTER / AI OPERATOR

Candidatos del Director:
Kimi K, MiniMax, DeepSeek V4 Pro/Flash, GLM-5, Meta Glimer (ID exacto por verificar), GPT-OSS.

Nunca inferir disponibilidad.

`TaskProfile -> ProviderRef candidates -> health/capability -> policy -> choose -> call -> fail? -> circuit state -> next -> evidence`.

Estados:
`AVAILABLE | DEGRADED | RATE_LIMITED | AUTH_FAIL | MODEL_UNAVAILABLE | PROVIDER_DOWN | UNKNOWN`.

Secrets siempre por `secret_ref` del runtime seguro.

# 15. HUGGING FACE

Objetivo del Director:
Fábrica/canvas como web privada HF y uso de cómputo HF cuando corresponda.

No marcar READY hasta probar:
- recurso/Space real;
- privacidad/auth;
- build;
- no-secret exposure;
- health;
- persistence/version;
- rollback;
- E2E.

GAP vigente:
`GAP_HF_PRIVATE_FACTORY_DEPLOYMENT_NOT_VERIFIED`.

# 16. SEGURIDAD

Obligatorio:
- AuthN;
- AuthZ capability-based;
- secret refs;
- TLS;
- local encryption sensible;
- sandbox;
- CSP/Trusted Types/iframe isolation según plataforma;
- source provenance/license/hash/SBOM;
- minimum privilege;
- evidence/audit log;
- immutable V+ refs;
- rollback;
- size/time/rate limits;
- ningún secreto en repo, frontend bundle, manifest o log.

# 17. LOOP DEL WATCHDOG

Automatización horaria activa para este objetivo.

Cadena:
`INPUT literal -> GOALS12 -> priorities -> plan -> queue1x1 -> execute/review -> verify/refute -> GAP/FLAG -> research hasta 20 -> StrategyDelta -> retry/continue safe task -> Council12 -> 3 simulations -> 3 refutations -> cross-check -> CODA -> verify_final`.

Cuando no haya una tarea de implementación activa, la persistencia significa investigación/mejora útil y propuesta V+ verificable, no cambios vacíos para mantener actividad.

# 18. SINGLE WRITER / ANTI-COLISIÓN

Antes de cada write:
1. fetch HEAD;
2. fetch destination;
3. comprobar blob/base SHA;
4. comprobar owner/path;
5. generar delta;
6. write;
7. read-back;
8. registrar evidence.

Si HEAD cambia:
`STALE_LOCK_GAP_REBASE_REBUILD_DELTA`.

No force-push.

Este mecanismo ya evitó una colisión durante la preparación del paquete; un 409 fue tratado con refetch y no con overwrite.

# 19. TAREA 1 COMPLETA — SECUENCIA RESTANTE

`T1_03 COMPONENT XRAY`
-> `T1_04 CANVAS OWNER`
-> `T1_05 CONTRACTS/REGISTRY`
-> `T1_06 FACTORY SHELL + STEP ENGINE`
-> `T1_07 M1`
-> `T1_08 M2`
-> `T1_09 M3`
-> `T1_10 M4`
-> `T1_11 M5`
-> `T1_12 UNIVERSAL ADAPTER BUS`
-> `T1_13 SANDBOX/PREVIEW`
-> `T1_14 TEST/EVIDENCE/VERSION/ROLLBACK`
-> `T1_15 3 SIMULATIONS + REFUTATIONS`
-> `T1_16 INDEPENDENT AUDIT`
-> `VERIFIED_CLOSED`.

No saltar nodos sin evidence explícita.

# 20. TAREA 2 PREDEFINIDA PARA RETOMA

Sólo después de T1_16 PASS y ownership de paths:

`T2_00 requirements/source/backend crosscheck`
-> `T2_01 AppShell/Workspaces`
-> `T2_02 Jarvis Chat/Command Center`
-> `T2_03 Files/Artifacts/Editors`
-> `T2_04 Workflow/Tasks/Evidence`
-> `T2_05 Component/Plugin/Backend Panel`
-> `T2_06 Model/Provider Selector`
-> `T2_07 Multiplatform/Responsive/Capabilities`
-> `T2_08 Frontend Security`
-> `T2_09 Real Backend Bindings`
-> `T2_10 E2E/Release Candidate`
-> independent audit.

Todos los cambios productivos T2 son V+ reversibles. No destruir las 39 ventanas históricas ni otras versiones válidas.

# 21. HANDOFF PARCIAL A CLAUDE

Antes de T1 cierre:
Claude puede:
- auditar independientemente T1;
- verificar T1_03;
- asumir un nodo T1 tras owner/path handoff explícito;
- investigar T2 read-only.

Después de T1 cierre:
Claude puede asumir UN nodo T2 si el Crazy Wall registra:
- owner Claude;
- write paths;
- base SHA;
- input/expected output;
- tests;
- evidence;
- return handoff.

Nunca mandar “haz toda T2” como nodo monolítico.

# 22. GAPS ABIERTOS

1. `GAP_COMPONENT_XRAY_NOT_COMPLETE`.
2. `GAP_CANVAS_OWNER_NOT_SELECTED`.
3. `GAP_PROVIDER_MODEL_AVAILABILITY`.
4. `GAP_HF_PRIVATE_FACTORY_DEPLOYMENT_NOT_VERIFIED`.
5. `GAP_BACKEND_LLM_CAPABILITY_FOR_FACTORY`.
6. `GAP_REAL_BACKEND_BINDINGS_NOT_VERIFIED_T2` — bloqueado hasta T1.

Cada GAP tiene nodo/exit criteria en Recovery V3/Arquitectura V2/Plan.

# 23. REPARACIONES YA VERIFICADAS

- INPUT literal separado de interpretaciones.
- URLs fuente recuperadas en addendum.
- Part-02 literal persistida sin credenciales.
- Crazy Wall exclusivo de Fábrica+Interface creado.
- `Frontend/` fijado como casing único; duplicado lowercase eliminado.
- fábrica física identificada en raíz real.
- documentos históricos separados de estado canónico actual.
- contradicción local-only vs private HF/web services resuelta por precedencia.
- backend Sol cross-check evita asumir endpoints/capabilities inexistentes.
- Arquitectura V2 emitida.
- CHECKPOINT V3 emitido.

# 24. CIERRE / ESTADOS

`SOURCE_PRESENT != WIRED != RUNTIME_TEST_PASS != VERIFIED_CLOSED`.

Estados aceptados:
`ACTIVE_LOOP | GAP | INCONCLUSIVE | CLOSED_UNVERIFIED | VERIFIED_CLOSED`.

T1 al emitir este handoff:
`ACTIVE_LOOP`.

T2 productiva:
`BLOCKED_BY_T1`.

# 25. PRIMERA ACCIÓN DEL NUEVO WORKER

No planificar desde cero.

Ejecutar:
`read canonical 14-file recovery chain -> fresh HEAD -> verify T1_03 current_node -> continue component XRAY -> update matrix/evidence -> only then T1_04`.
