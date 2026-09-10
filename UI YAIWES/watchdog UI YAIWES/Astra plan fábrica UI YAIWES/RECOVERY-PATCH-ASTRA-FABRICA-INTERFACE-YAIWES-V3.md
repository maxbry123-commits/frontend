# RECOVERY PATCH V3 — ➡️ ASTRA PLAN FÁBRICA UI YAIWES

Fecha: 2026-09-10
Contrato: `tel.workflow/v3`
Modo: `FAIL_CLOSED_LOOP`
Estado al emitir: `ACTIVE_LOOP`
Scope exclusivo: `FÁBRICA UI + INTERFACE UI YAIWES`
Repositorio: `maxbry123-commits/frontend`
Branch: `main`

> Este V3 sustituye V2 únicamente como punto de recuperación operativo. V1/V2 se conservan como historia. No borra ni reinterpreta los INPUT literales del Director.

# 0. IDENTIDAD

Identidad obligatoria del worker que retoma:

`➡️ Astra plan fábrica UI YAIWES`

Responsabilidad primaria:
- Fábrica UI;
- frontend YAIWES;
- arquitectura visual/UX;
- contratos frontend;
- transformación/integración de componentes;
- pruebas, evidence, versión y rollback;
- después del gate de T1, Interface UI YAIWES.

Responsabilidad secundaria:
- leer backend Sol;
- derivar requisitos/contratos que necesite frontend;
- separar código OSS backend encontrado;
- preparar donor backend en staging propio;
- no escribir rutas backend Sol sin handoff explícito.

Allowlist de integraciones/conectores del worker:

`GitHub + Hugging Face`

Cualquier otro plugin/conector: `DENY` hasta autorización posterior explícita del Director.

# 1. INPUT LITERAL — FUENTE PRIMARIA

Nunca reconstruir las instrucciones desde este Recovery. Leer literalmente los tres archivos, completos y en orden:

1. `INPUT-BLOCK-LITERAL-2026-09-10.md`
2. `INPUT-BLOCK-LITERAL-ADDENDUM-2026-09-10.md`
3. `INPUT-BLOCK-LITERAL-PART-02-2026-09-10.md`

Los valores de credenciales/API keys aportados en chat no fueron copiados al repositorio deliberadamente. Sólo se persiste el requisito funcional de usar `secret_ref`/secret store.

Si un futuro resumen discrepa del literal INPUT, manda el INPUT más reciente compatible con evidencia física y se abre GAP por la contradicción.

# 2. OBJETIVO PERMANENTE DE PRODUCTO

Construir YAIWES como Work AI-first propietario/SaaS, con una experiencia unificada de:

`JARVIS CHAT + MULTI-WORKSPACES + WORKFLOW/AGENTS + DESIGN/BUILD + CODE + ARTIFACTS + FILES + TERMINAL + TASK TRACE + PLUGINS/BACKENDS + MODEL SELECTOR + EVIDENCE`.

El agente YAIWES principal debe poder direccionar y controlar paneles/capabilities autorizadas mediante contratos, no mediante acceso opaco e ilimitado al estado.

Plataformas objetivo:
- web;
- Windows;
- Linux;
- Android;
- iOS;
- smartphone;
- PC.

Modelo local/web:
- UI y parte del workflow/AI pueden funcionar localmente cuando corresponda;
- agentes/LLMs principales viven como servicios web;
- almacenamiento local por defecto para datos apropiados, cifrado cuando sea sensible;
- conectores opcionales elegidos por el cliente;
- código/producto propietario;
- componentes y servicios gestionados desde web bajo control del producto.

Fábrica:
- interna/privada;
- no es un constructor público para el usuario final;
- es el instrumento permanente para crear, probar, corregir, versionar y mejorar la Interface YAIWES.

# 3. GATE ABSOLUTO T1 → T2

`TAREA 1 = FÁBRICA UI`
`TAREA 2 = INTERFACE UI YAIWES`

T2 productiva NO se inicia hasta que T1 alcance `VERIFIED_CLOSED` por reviewer independiente.

Durante T1 sí se permite para T2:
- leer fuentes;
- leer backend;
- definir requirement matrix;
- definir contratos/adapters frontend;
- hacer mocks contractuales;
- detectar GAPs.

Eso NO cambia T2 a ACTIVE ni autoriza escribir su producto final.

# 4. RUTAS FÍSICAS ACTUALES VERIFICADAS

Fábrica física real:
`fabrica de UI INTERFACE fromtend/`

Biblioteca OSS amplia:
`UI YAIWES/componentes open soure UI YAIWES/`

Interface histórica/producto existente:
`UI YAIWES interface/`

Área segura Astra:
`UI YAIWES/watchdog UI YAIWES/Astra plan fábrica UI YAIWES/`

Frontend staging Astra, spelling/case canónico:
`UI YAIWES/watchdog UI YAIWES/Astra plan fábrica UI YAIWES/Frontend/`

Backend donor staging Astra:
`UI YAIWES/watchdog UI YAIWES/Astra plan fábrica UI YAIWES/backend/`

Backend Sol, read-only para este worker hasta handoff:
`UI YAIWES/➡️📂 Wordflow LOOP UI YAIWES/wordflow_loop/wordflow_loop/`

Ruta histórica/esperada `UI YAIWES/Fabrica UI YAIWES/` fue comprobada y no existe en el read-back actual. No usarla como ruta física sin nueva evidencia.

# 5. FUENTES CANÓNICAS ASTRA — ORDEN DE RECUPERACIÓN

Después de los tres INPUT literales leer:

4. `CRAZY-WALL-ASTRA-FABRICA-INTERFACE-UI-YAIWES.json`
5. `STATE.json`
6. `CHECKPOINT.json`
7. `PERFIL-TRABAJO-Y-PERFIL-UI-YAIWES.md`
8. `ARQUITECTURA-DETALLADA-FABRICA-E-INTERFACE-YAIWES-V2.md`
9. `MATRIZ-FUSION-46-COMPONENTES-FRONTEND-BACKEND.md`
10. `PLAN-MAESTRO-TAREA1-TAREA2-ASTRA-V2.md`
11. `AUDITORIA-FORENSE-4-PASADAS-ASTRA-V2.md`
12. `AUDITORIA-4-PASADAS-INPUT-PLAN-ARQUITECTURA-CABLEADO-2026-09-10.md`
13. este Recovery V3
14. `HANDOFF-ASTRA-CLAUDE-FABRICA-INTERFACE-YAIWES-V3.md`

Luego:
`fetch fresh HEAD/main -> verify current_node -> verify file/path ownership -> rebuild delta if HEAD moved -> execute one canonical write at a time`.

# 6. PRECEDENCIA DE VERDAD

En conflicto:

`INPUT literal más reciente > evidencia física fresca main > Crazy Wall Astra > STATE/CHECKPOINT Astra > fuentes verdad proyecto > Arquitectura V2 > Plan V2 > documentos históricos > inferencia`.

No borrar historia para resolver contradicción; registrar `SUPERSEDED`/GAP.

# 7. CRAZY WALL CORRECTO

Crazy Wall exclusivo de este trabajo:

`CRAZY-WALL-ASTRA-FABRICA-INTERFACE-UI-YAIWES.json`

Scope permitido:
- T1 Fábrica;
- T2 Interface;
- componentes necesarios;
- requisitos frontend hacia backend como dependencias externas;
- evidence/checkpoints/recovery/handoff Astra.

No convertir el Crazy Wall global multi-AI en el state machine de Astra. El global sólo sirve para coordinación/ownership cross-team.

# 8. ESTADO ACTUAL

T1:
- `T1_00_LITERAL_INPUT`: documentalmente cerrado;
- `T1_01_PROFILE`: documentalmente cerrado;
- `T1_02_ARCHITECTURE`: especificada V2, funcionalmente `CLOSED_UNVERIFIED`;
- `T1_03_COMPONENT_XRAY`: `ACTIVE_LOOP`;
- `T1_04..T1_16`: pendientes según Plan.

T2:
- todos los nodos productivos `BLOCKED_BY_T1`;
- research/read-only permitido.

Estado global correcto:
`ACTIVE_LOOP`.

# 9. NODO EXACTO DE REANUDACIÓN

`T1_03_COMPONENT_XRAY`

No saltar a UI productiva ni a integración T2.

Objetivo de T1_03:
1. recorrer `fabrica de UI INTERFACE fromtend/`;
2. recorrer `UI YAIWES/componentes open soure UI YAIWES/`;
3. separar repos reales, metadata, acquisition internals, duplicates, tooling;
4. por capacidad útil verificar URL fuente, ref/commit, licencia, README/entrypoints y tests;
5. clasificar `FRONTEND | BACKEND_DONOR | FULLSTACK | TOOLING | REFERENCE_ONLY | REJECT`;
6. extraer unidad mínima, no repo completo;
7. detectar redundancias;
8. actualizar matrix/evidence;
9. preparar candidatos al bakeoff de canvas;
10. sólo entonces entrar a T1_04.

La matriz de 46 es `SOURCE_PRESENT_ONLY`; NO es inventario exhaustivo ni integración.

# 10. CANVAS OWNER — SIGUIENTE GATE

T1_04 debe elegir UN `CANVAS_OWNER` canónico.

Comparar como mínimo si están físicamente disponibles/verificados:
- Craft.js;
- GrapesJS;
- Puck.

Criterios:
- licencia compatible con SaaS propietario;
- React/component model fit;
- serialización/versionado;
- nested components/slots;
- DnD/resize;
- custom inspector;
- undo/redo;
- responsive constraints;
- plugin API;
- sandbox/preview isolation;
- footprint;
- testability;
- accessibility hooks.

Los no elegidos quedan donors/reference, no canvases paralelos.

# 11. ARQUITECTURA DE FÁBRICA VIGENTE

Dos niveles:
- F1 Fábrica interna;
- F2 Interface/runtime del usuario.

Dentro de F1 hay cinco módulos:
- M1 Element Builder;
- M2 UI Composer;
- M3 Component Transformer / Inbox;
- M4 AI Operator;
- M5 Deterministic Module Kit.

Cinco pasos visibles:
`DESIGN/CREATE -> COMPOSE -> CONNECT -> AI/TRANSFORM -> VALIDATE/PUBLISH/EDIT`.

Cada paso exige:
`input -> deterministic/controlled operation -> output -> validation -> evidence -> rollback`.

# 12. CABLEADO FRONTEND CANÓNICO

Tres entradas, una implementación:

`drag/drop | Jarvis prompt | command palette`
`-> TypedAction`
`-> Frontend Guard`
`-> Factory Step Engine / Universal Action Bus`
`-> adapter`
`-> BackendBinding si aplica`
`-> backend/local capability`
`-> RuntimeEvent/result`
`-> Normalizer`
`-> UIStateDelta`
`-> verifier/evidence`
`-> frontend store`
`-> render`.

Prohibido:
`component -> secret/endpoint hardcoded -> mutable canonical state`.

# 13. CABLEADO DE IMPORTACIÓN OSS

`SOURCE`
`-> SOURCE_URL/REF/COMMIT`
`-> LICENSE/SBOM/HASH`
`-> STATIC ANALYSIS`
`-> ENTRYPOINT/EXPORT MAP`
`-> CAPABILITY EXTRACTION`
`-> FRONTEND/BACKEND_DONOR split`
`-> ComponentManifest`
`-> universal contract`
`-> adapter`
`-> sandbox preview`
`-> build/test`
`-> RegistryCandidate`
`-> V+ / evidence`.

No ejecutar código no confiable con privilegios amplios antes de sandbox/test.

# 14. CABLEADO IA

`AIIntent`
`-> ContextPack`
`-> ProviderRef/ModelRef`
`-> PlanProposal`
`-> UIStateDelta`
`-> visual diff/preview`
`-> policy/guards`
`-> tests`
`-> apply | reject | rollback`
`-> evidence`.

IA no modifica estado canónico directamente.

Modos:
`MANUAL | AI_ASSIST | AUTOPILOT`.

# 15. CROSS-CHECK REAL CON BACKEND SOL

Leído físicamente:

`contracts.py`:
- `Status`: PENDING/RUNNING/PASS/FAIL/BLOCKED/INCONCLUSIVE;
- `Evidence`;
- `NodeContract`;
- `LayerResult`.

Frontend debe mapear:
- PASS backend -> `RUNTIME_PASS`, no `VERIFIED_CLOSED`;
- evidence/gaps -> Task Trace/Evidence UI;
- TypedAction/BackendBinding -> adapter hacia contratos reales sólo cuando el transporte/capability se verifique.

`component_registry.py`:
- `ComponentSpec(id,name,slug,role,mode,status)`;
- mezcla WIRED/DONOR_ONLY/REFERENCE_ONLY/PENDING_SOURCE.

Frontend debe conservar esos estados y no convertir `WIRED` en cierre certificado.

`llm_gate.py`:
- sólo permite `ambiguity_resolution`, `semantic_ranking`, `bounded_summary`;
- presupuesto LLM <=5%;
- caller inyectado.

Consecuencia:
M4 AI Operator/Autopilot general NO está demostrado como capacidad backend Sol. Mantener `GAP_BACKEND_LLM_CAPABILITY_FOR_FACTORY` hasta contrato real.

# 16. MINI ROUTER DE MODELOS

Candidatos solicitados por Director:
- Kimi K;
- MiniMax;
- DeepSeek V4 Pro/Flash;
- GLM-5;
- Meta Glimer — model ID exacto por verificar;
- GPT-OSS.

No asumir disponibilidad.

Router:
`TaskProfile -> candidate list -> provider/model health -> capability match -> policy -> choose -> call -> timeout/error -> circuit state -> next candidate -> evidence`.

Estados mínimos:
`AVAILABLE | DEGRADED | RATE_LIMITED | AUTH_FAIL | MODEL_UNAVAILABLE | PROVIDER_DOWN | UNKNOWN`.

Frontend sólo maneja `provider_id`, `model_id`, `secret_ref`, health/capability metadata.

# 17. HUGGING FACE PRIVATE FACTORY

Objetivo:
fábrica/canvas disponible como web privada HF y uso de cómputo HF cuando corresponda.

Arquitectura:
`authorized browser -> private HF factory service -> frontend bundle/canvas -> secure contract adapters -> approved services -> GitHub V+/evidence storage`.

Antes de READY verificar:
- Space/recurso existe;
- privacidad/auth;
- build reproducible;
- secretos no están en bundle;
- health;
- persistence/versioning;
- rollback;
- E2E.

Estado actual:
`GAP_HF_PRIVATE_FACTORY_DEPLOYMENT_NOT_VERIFIED`.

# 18. SEGURIDAD

Obligatorio:
- AuthN usuario/dispositivo;
- AuthZ capability-based;
- `secret_ref`/capability token;
- TLS;
- local encryption para datos sensibles;
- sandbox imports/previews;
- CSP/Trusted Types/iframe isolation cuando aplique;
- provenance/hash/license/SBOM;
- least privilege;
- audit/evidence log;
- V+ reversible;
- límites size/time/rate;
- nunca credenciales en repo, logs, frontend bundle o manifests.

# 19. PARALELISMO

Permitido:
- reads;
- research;
- static analysis;
- tests independientes;
- generación de reports en paths distintos.

Canonical writes:
`queue 1x1`.

Nunca dos writers sobre el mismo file/state/registry/path.

Si HEAD cambia:
`STALE_LOCK_GAP_REBASE_REBUILD_DELTA`.

Nunca force-push.

# 20. LOOP

`INPUT literal -> GOALS12 -> priorities -> plan -> queue1x1 -> execute/review -> verify/refute -> GAP/FLAG -> research hasta 20 -> StrategyDelta -> retry/continue safe task -> Council12 -> 3 simulations -> 3 refutations -> cross-check -> CODA -> verify_final`.

Si un GAP bloquea una rama, registrar flag y continuar sólo una safe task independiente. No fingir cierre.

# 21. GAPs ABIERTOS AL EMITIR V3

- `GAP_COMPONENT_XRAY_NOT_COMPLETE` -> owner T1_03 -> exit: inventario/capability evidence suficiente para decisiones.
- `GAP_CANVAS_OWNER_NOT_SELECTED` -> owner T1_04 -> exit: bakeoff + un CanvasOwner.
- `GAP_PROVIDER_MODEL_AVAILABILITY` -> T1_10/T1_12 -> exit: provider/model health real y secret refs.
- `GAP_HF_PRIVATE_FACTORY_DEPLOYMENT_NOT_VERIFIED` -> T1_13/T1_14 -> exit: private deployment + auth + E2E.
- `GAP_BACKEND_LLM_CAPABILITY_FOR_FACTORY` -> external contract dependency -> exit: backend compatible/handoff or separate authorized factory AI adapter.
- `GAP_REAL_BACKEND_BINDINGS_NOT_VERIFIED_T2` -> T2_09 -> bloqueado hasta T1.

# 22. GAPs REPARADOS

- Crazy Wall exclusivo Astra creado.
- INPUT URLs omitidos reparados en Addendum.
- INPUT Part-02 persistido sin secretos.
- colisión `Frontend/` vs `frontend/` reparada; usar sólo `Frontend/`.
- ruta física real de fábrica identificada.
- contradicción histórica “todo local/no cloud” resuelta por precedencia del INPUT más reciente.
- arquitectura V2 separa contracts frontend propuestos de capacidades backend realmente verificadas.

# 23. RETOMA POR CLAUDE

Antes de T1 final:
Claude puede ser auditor independiente, revisar T1_03, ejecutar un nodo T1 si se le transfiere owner/path, o investigar T2 read-only.

Después de T1 `VERIFIED_CLOSED`:
Claude/Astra puede tomar UN nodo T2 si se registra:
- owner;
- write_paths;
- base SHA;
- literal input/requirements;
- expected output;
- tests;
- evidence;
- return handoff.

Nunca transferir “T2 completa” como trabajo monolítico.

# 24. DEFINICIÓN DE NO HUECOS

Todo requisito debe estar etiquetado como uno de:
`IMPLEMENTED_VERIFIED | IMPLEMENTED_UNVERIFIED | SPECIFIED | PENDING_NODE | GAP_WITH_EXIT_CRITERIA | EXTERNAL_DEPENDENCY`.

“No huecos” no permite fingir implementación.

# 25. CRITERIO DE CIERRE

`SOURCE_PRESENT != WIRED != RUNTIME_TEST_PASS != VERIFIED_CLOSED`.

Por nodo se exige, según aplique:
`literal/source + path + source commit/license + diff/blob/commit SHA + test/run/log + read-back + verifier/reviewer result`.

T1 final requiere auditor independiente.

# 26. SALIDA AL RECUPERAR

Mantener 10 líneas:
1. avance %;
2. nodo;
3. cerradas;
4. en curso;
5. pendientes;
6. GAP/flags;
7. evidencia;
8. cambios;
9. siguiente acción;
10. estado.

Después, mini-resumen de avances/logros sin sustituir los INPUT literales.
