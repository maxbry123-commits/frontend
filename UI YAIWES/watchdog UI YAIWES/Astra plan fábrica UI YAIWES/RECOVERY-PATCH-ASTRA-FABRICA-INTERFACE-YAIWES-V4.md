# RECOVERY PATCH V4 — ➡️ ASTRA PLAN FÁBRICA UI YAIWES

Fecha: 2026-09-10
Contrato: `tel.workflow/v3`
Modo: `FAIL_CLOSED_LOOP`
Estado: `ACTIVE_LOOP`
Scope exclusivo: `FÁBRICA UI + INTERFACE UI YAIWES`
Repositorio: `maxbry123-commits/frontend`
Branch: `main`

V4 es el recovery operativo vigente. Conserva V1/V2/V3 como historia y añade la reconciliación del prototipo `factory-v1` creado concurrentemente.

## 0. Identidad y frontera

Identidad: `➡️ Astra plan fábrica UI YAIWES`.

Objetivo primario: frontend, Fábrica UI, Interface YAIWES después del gate, UX, contracts frontend, component transformation, tests/evidence/versioning.

Objetivo secundario: comprender backend Sol y preparar donors backend OSS en staging Astra sin escribir rutas de Sol hasta handoff explícito.

Allowlist: `GitHub` + `Hugging Face` exclusivamente. Otros conectores/plugins = `DENY` hasta autorización explícita posterior.

Secretos: nunca persistir claves entregadas por el Director. Usar `secret_ref`/secret store.

## 1. Leer INPUT literal completo

No recuperar desde resúmenes. Leer en orden:
1. `INPUT-BLOCK-LITERAL-2026-09-10.md`
2. `INPUT-BLOCK-LITERAL-ADDENDUM-2026-09-10.md`
3. `INPUT-BLOCK-LITERAL-PART-02-2026-09-10.md`

Después leer:
4. `CRAZY-WALL-ASTRA-FABRICA-INTERFACE-UI-YAIWES.json`
5. `STATE.json`
6. `CHECKPOINT.json`
7. `PERFIL-TRABAJO-Y-PERFIL-UI-YAIWES.md`
8. `ARQUITECTURA-DETALLADA-FABRICA-E-INTERFACE-YAIWES-V2.md`
9. `MATRIZ-FUSION-46-COMPONENTES-FRONTEND-BACKEND.md`
10. `PLAN-MAESTRO-TAREA1-TAREA2-ASTRA-V3.md`
11. `AUDITORIA-FORENSE-4-PASADAS-ASTRA-V2.md`
12. `AUDITORIA-4-PASADAS-INPUT-PLAN-ARQUITECTURA-CABLEADO-2026-09-10.md`
13. `AUDITORIA-POSTCHECK-FACTORY-RUNTIME-V1-2026-09-10.md`
14. este Recovery V4
15. `HANDOFF-ASTRA-CLAUDE-FABRICA-INTERFACE-YAIWES-V4.md`.

Luego releer HEAD/main y ownership antes de cualquier write.

## 2. Objetivo permanente YAIWES

YAIWES = Work AI-first propietario/SaaS con:
`Jarvis Chat + multi-workspaces + workflows/agentes + code/design/build + artifacts/files + terminal + task trace + plugin/backend panel + model/provider selector + evidence/checkpoints`.

Plataformas: web, Windows, Linux, Android, iOS, smartphone y PC.

Modelo local/web:
- parte de UI/workflow/AI local cuando convenga;
- datos locales sensibles cifrados;
- agentes/LLMs principales como servicios web;
- almacenamiento local por defecto cuando aplique;
- conectores opcionales elegidos por cliente;
- componentes/servicios gestionados desde web bajo control del producto.

La Fábrica es interna/privada y sirve permanentemente para construir y mejorar la Interface.

## 3. Gate T1/T2

`T1_FACTORY -> independent verification -> VERIFIED_CLOSED -> T2_INTERFACE productive execution`.

T2 productiva sigue `BLOCKED_BY_T1`.
Durante T1 sólo se permite research/read-only/contracts/mocks de T2.

## 4. Rutas físicas canónicas

Fábrica fuente/donors:
`fabrica de UI INTERFACE fromtend/`

OSS library:
`UI YAIWES/componentes open soure UI YAIWES/`

Interface histórica:
`UI YAIWES interface/`

Workspace Astra:
`UI YAIWES/watchdog UI YAIWES/Astra plan fábrica UI YAIWES/`

Frontend staging:
`.../Astra plan fábrica UI YAIWES/Frontend/`

Backend donor staging:
`.../Astra plan fábrica UI YAIWES/backend/`

Sol backend read-only:
`UI YAIWES/➡️📂 Wordflow LOOP UI YAIWES/wordflow_loop/wordflow_loop/`

No usar como física la ruta histórica `UI YAIWES/Fabrica UI YAIWES/`: read-back previo devolvió 404.

## 5. Estado reconciliado

T1_00 literal inputs = documentalmente cerrado.
T1_01 profile = documentalmente cerrado.
T1_02 architecture V2 = `CLOSED_UNVERIFIED`.
T1_03 component XRAY = `ACTIVE_LOOP`.
T1_04 CanvasOwner = `PENDING`.
T1_05..T1_16 = `PENDING` salvo artefactos experimentales explícitos.
T2 productiva = `BLOCKED_BY_T1`.

Current node canónico:
`T1_03_COMPONENT_XRAY`.

Siguiente gate:
`T1_04_CANVAS_OWNER_SELECTION` sólo cuando T1_03 tenga evidencia suficiente.

## 6. Prototipo concurrente factory-v1

Artefacto:
`Frontend/factory-v1/index.html`

Commit productor:
`a9f9818dd76025141333df5102fc885646df8d70`

Blob leído:
`a6d078c9accca130344f7ceddefb5482d15c4978`

Clasificación:
`EXPERIMENTAL_REFERENCE_AND_DONOR / CLOSED_UNVERIFIED`.

Características presentes en source:
- ribbon 5 pasos;
- palette + canvas drag/drop;
- inspector simple;
- spans responsive básicos;
- undo/redo/localStorage;
- transform draft;
- MANUAL/AI_ASSIST/AUTOPILOT como modos UI;
- delta local candidato;
- provider selector sin secret plano;
- static validation;
- JSON export.

Por qué NO avanza el current node:
1. un solo `index.html` mezcla HTML/CSS/state/registry/importer/AI/provider/validation/export -> viola `no monolith` y separación contracts/adapters/plugins/registry/loader/guards/tests;
2. T1_03 XRAY no está cerrado;
3. T1_04 CanvasOwner bakeoff no está cerrado;
4. provider health/network real no existe en ese prototipo;
5. AI local por keywords no demuestra modelos/proveedores reales;
6. no hay browser E2E/a11y/visual/sandbox/HF-private evidence;
7. no existe independent verifier.

Fuente de refutación:
`AUDITORIA-POSTCHECK-FACTORY-RUNTIME-V1-2026-09-10.md`.

Regla: conservar V1 como donante/rollback, no destruirla; refactorizar capacidades útiles sólo después de los gates.

## 7. Arquitectura vigente

Dos niveles:
- F1 Factory interna;
- F2 Interface/runtime usuario.

Módulos F1:
M1 Element Builder;
M2 UI Composer;
M3 Component Transformer/Inbox;
M4 AI Operator;
M5 Deterministic Module Kit.

5 steps:
`DESIGN/CREATE -> COMPOSE -> CONNECT -> AI/TRANSFORM -> VALIDATE/PUBLISH/EDIT`.

Todo step:
`input -> operation -> output -> validation -> evidence -> rollback`.

## 8. Cableado frontend canónico

`drag/drop | command palette | Jarvis prompt`
`-> TypedAction`
`-> FrontendGuard`
`-> Factory Step Engine / Universal Action Bus`
`-> adapter`
`-> BackendBinding si aplica`
`-> backend/local capability`
`-> RuntimeEvent`
`-> Normalizer`
`-> UIStateDelta`
`-> verifier/evidence`
`-> frontend store`
`-> render`.

Nunca:
`UI component -> secret/endpoint hardcoded -> canonical mutable state`.

## 9. Import OSS

`source -> URL/ref/commit -> license/SBOM/hash -> static analysis -> entrypoints -> capability extraction -> FRONTEND/BACKEND_DONOR split -> ComponentManifest -> universal contract -> adapter -> sandbox preview -> build/tests -> RegistryCandidate -> V+/evidence`.

La matriz de 46 = `SOURCE_PRESENT_ONLY`, no inventario total ni integración.

## 10. Cross-check backend Sol

Leído:
- `contracts.py`: Status, Evidence, NodeContract, LayerResult;
- `component_registry.py`: ComponentSpec + estados WIRED/DONOR_ONLY/REFERENCE_ONLY/PENDING_SOURCE;
- `llm_gate.py`: ambiguity_resolution, semantic_ranking, bounded_summary, LLM <=5%, caller inyectado.

Reglas frontend:
- backend PASS -> `RUNTIME_PASS`, no VERIFIED_CLOSED;
- WIRED -> WIRED, no cierre;
- AI Operator general/Autopilot NO se considera soportado por Sol hasta capability real verificada.

## 11. AI / router

Candidatos solicitados: Kimi K, MiniMax, DeepSeek V4 Pro/Flash, GLM-5, Meta Glimer (ID exacto pendiente), GPT-OSS.

No asumir disponibilidad.

`TaskProfile -> candidates -> health/capability -> policy -> select -> call -> failure/circuit -> next -> evidence`.

Frontend sólo usa provider/model IDs y `secret_ref`.

## 12. HF private factory

Objetivo:
private HF web/canvas/factory + compute autorizado.

Gate READY:
- recurso real;
- private/auth probado;
- build reproducible;
- no secret exposure;
- health;
- persistence/version;
- rollback;
- browser E2E.

Estado: GAP abierto.

## 13. GAPs abiertos

1. `GAP_COMPONENT_XRAY_NOT_COMPLETE` -> T1_03.
2. `GAP_CANVAS_OWNER_NOT_SELECTED` -> T1_04.
3. `GAP_PROVIDER_MODEL_AVAILABILITY` -> T1_10/T1_12.
4. `GAP_HF_PRIVATE_FACTORY_DEPLOYMENT_NOT_VERIFIED` -> T1_13/T1_14.
5. `GAP_BACKEND_LLM_CAPABILITY_FOR_FACTORY` -> external dependency/T1_10/T1_12.
6. `GAP_REAL_BACKEND_BINDINGS_NOT_VERIFIED_T2` -> T2_09, bloqueado por T1.
7. `GAP_FACTORY_V1_MONOLITHIC_PROTOTYPE` -> no se repara sobrescribiendo; se usa como donor al implementar arquitectura modular.

## 14. Secuencia T1 restante

`T1_03 XRAY`
-> `T1_04 CanvasOwner`
-> `T1_05 contracts/registry`
-> `T1_06 shell/step engine`
-> `T1_07 M1`
-> `T1_08 M2`
-> `T1_09 M3`
-> `T1_10 M4`
-> `T1_11 M5`
-> `T1_12 universal adapters`
-> `T1_13 sandbox/HF preview`
-> `T1_14 tests/evidence/rollback`
-> `T1_15 3 simulations/refutations`
-> `T1_16 independent audit`
-> VERIFIED_CLOSED.

## 15. T2 preparada para relevo

Después de T1_16 + ownership:
`T2_00 requirements`
-> `T2_01 AppShell/Workspaces`
-> `T2_02 Jarvis Command Center`
-> `T2_03 Files/Artifacts/Editors`
-> `T2_04 Workflow/Task Trace/Evidence`
-> `T2_05 Plugin/Backend Panel`
-> `T2_06 Model/Provider Selector`
-> `T2_07 Multiplatform`
-> `T2_08 Security`
-> `T2_09 real backend bindings`
-> `T2_10 E2E/release candidate`
-> independent audit.

Astra o Claude puede retomar un nodo T2 sólo con owner/write_paths/base_sha/input/output/tests/evidence explícitos.

## 16. LOOP / anti-colisión

`INPUT literal -> GOALS12 -> priorities -> plan -> queue1x1 -> execute/review -> verify/refute -> GAP/FLAG -> research up to 20 -> StrategyDelta -> retry/continue safe task -> Council12 -> 3 simulations -> 3 refutations -> cross-check -> CODA -> verify_final`.

Reads/tests independientes pueden paralelizarse. Canonical writes = 1×1.

Si HEAD cambió:
`STALE_LOCK_GAP_REBASE_REBUILD_DELTA`.
Nunca force-push.

## 17. Definición de no huecos

Cada requisito debe quedar en una clase:
`IMPLEMENTED_VERIFIED | IMPLEMENTED_UNVERIFIED | SPECIFIED | PENDING_NODE | GAP_WITH_EXIT_CRITERIA | EXTERNAL_DEPENDENCY | EXPERIMENTAL_REFERENCE`.

No llamar “sin huecos” a algo incompleto escondiendo GAPs.

## 18. Cierre

`SOURCE_PRESENT != WIRED != RUNTIME_TEST_PASS != VERIFIED_CLOSED`.

T1 final requiere:
`path + SHA/diff + test/run/log + read-back + no unresolved node GAP + independent reviewer`.

Al recuperar, primer paso:
`read canonical chain -> fresh HEAD -> verify CrazyWall/STATE/CHECKPOINT agree on T1_03 -> continue XRAY; do not resume from experimental prototype checkpoint`.
