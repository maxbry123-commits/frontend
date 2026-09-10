# HANDOFF V4 — ASTRA / CLAUDE — FÁBRICA + INTERFACE UI YAIWES

Fecha: 2026-09-10
Contrato: `tel.workflow/v3`
Modo: `FAIL_CLOSED_LOOP`
Estado: `ACTIVE_LOOP`
Owner actual: `➡️ Astra plan fábrica UI YAIWES`
Scope: exclusivamente `FÁBRICA UI + INTERFACE UI YAIWES`

V4 es el handoff vigente. Se emite después de las 4 pasadas de auditoría y de una refutación adicional del runtime `factory-v1` creado concurrentemente. V1/V2/V3 quedan como historia.

## 1. Qué recibe Astra o Claude

Recibe un proyecto frontend/factory, no el backend de Sol.

Responsabilidades del relevo:
- continuar T1 Fábrica desde el nodo canónico;
- mantener objetivo de cero fricción;
- usar componentes OSS como capacidades donantes, no pegar apps completas;
- mantener `Frontend/` y `backend/` donor staging separados;
- entender backend Sol para contratos frontend sin escribirlo sin handoff;
- después de T1 `VERIFIED_CLOSED`, poder tomar un nodo explícito de T2 Interface.

## 2. Objetivo persistente

YAIWES final debe ser un Work AI-first propietario/SaaS y multiplataforma:

`Jarvis Chat/Command Center`
`+ multiple Workspaces`
`+ workflows/agentes`
`+ code/design/build`
`+ files/artifacts`
`+ terminal/logs/tests`
`+ task trace/evidence/checkpoints`
`+ plugins/backend panel`
`+ model/provider selector`
`+ local/web capability model`.

El agente principal YAIWES controla superficies autorizadas mediante `SurfaceCapability`, TypedActions, contracts y policy; no por mutaciones opacas.

Plataformas: web, Windows, Linux, Android, iOS, PC y smartphone.

Seguridad/producto:
- código propietario;
- secretos nunca en frontend;
- local storage sensible cifrado;
- agentes/LLMs principales web;
- conectores cliente opt-in;
- componentes/servicios bajo control web del producto.

## 3. Allowlist

Integraciones/conectores de este worker:
`GitHub` y `Hugging Face` solamente.

Todo otro plugin/conector: `DENY` hasta autorización posterior explícita.

## 4. Gate

T1 = Fábrica.
T2 = Interface.

`T1 VERIFIED_CLOSED by independent reviewer` es requisito para implementación productiva T2.

Durante T1 se puede estudiar T2/backend y preparar contracts/mocks, sin cambiar T2 a ACTIVE.

## 5. Orden de lectura obligatorio

Leer completos, no sustituir por este Handoff:

1. `INPUT-BLOCK-LITERAL-2026-09-10.md`
2. `INPUT-BLOCK-LITERAL-ADDENDUM-2026-09-10.md`
3. `INPUT-BLOCK-LITERAL-PART-02-2026-09-10.md`
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
14. `RECOVERY-PATCH-ASTRA-FABRICA-INTERFACE-YAIWES-V4.md`
15. este Handoff V4.

Después:
`fetch HEAD -> fetch destination -> verify owner/path/base SHA -> verify current_node -> execute one canonical write -> read-back -> evidence`.

## 6. Rutas físicas canónicas

Fábrica fuente/donors:
`fabrica de UI INTERFACE fromtend/`

Biblioteca OSS:
`UI YAIWES/componentes open soure UI YAIWES/`

Interface histórica/producto:
`UI YAIWES interface/`

Workspace Astra:
`UI YAIWES/watchdog UI YAIWES/Astra plan fábrica UI YAIWES/`

Frontend staging canónico:
`.../Astra plan fábrica UI YAIWES/Frontend/`

Backend donor staging:
`.../Astra plan fábrica UI YAIWES/backend/`

Sol backend read-only:
`UI YAIWES/➡️📂 Wordflow LOOP UI YAIWES/wordflow_loop/wordflow_loop/`

La ruta `UI YAIWES/Fabrica UI YAIWES/` no fue encontrada en el read-back auditado; no usarla sin nueva evidencia.

## 7. Estado canónico ahora

`T1_00_LITERAL_INPUT = VERIFIED_CLOSED documental`
`T1_01_PROFILE = VERIFIED_CLOSED documental`
`T1_02_ARCHITECTURE_V2 = CLOSED_UNVERIFIED`
`T1_03_COMPONENT_XRAY = ACTIVE_LOOP`
`T1_04_CANVAS_OWNER_SELECTION = PENDING`
`T1_05..T1_16 = PENDING`
`T2_PRODUCTIVE = BLOCKED_BY_T1`

Current node:
`T1_03_COMPONENT_XRAY`.

No retomar desde un checkpoint experimental que diga T1_05.

## 8. Por qué el runtime `factory-v1` NO cambia ese estado

Existe:
`Frontend/factory-v1/index.html`

Commit:
`a9f9818dd76025141333df5102fc885646df8d70`

Blob:
`a6d078c9accca130344f7ceddefb5482d15c4978`

El source tiene features útiles: 5-step ribbon, palette, drag/drop, inspector simple, responsive spans, undo/redo/localStorage, transform draft, modos MANUAL/AI_ASSIST/AUTOPILOT, delta local, provider selector, static validation y JSON export.

Pero se clasifica:
`EXPERIMENTAL_REFERENCE_AND_DONOR / CLOSED_UNVERIFIED`.

No es implementación canónica porque:
- todo está en un único HTML con CSS+JS+state+registry+AI+validation -> monolito;
- faltan módulos separados contracts/adapters/plugins/registry/loader/guards/tests;
- T1_03 no se cerró;
- T1_04 CanvasOwner no se eligió;
- provider health es texto local, no network/runtime health;
- AI es heurística local, no router/modelos verificados;
- no hay browser E2E/a11y/visual/sandbox/HF private evidence;
- no hay auditor independiente.

Conservarlo intacto como V1 de referencia y extraer capacidades útiles al implementar módulos canónicos.

## 9. T1_03 — trabajo exacto a continuar

Cruzar las dos fuentes:
1. `fabrica de UI INTERFACE fromtend/`;
2. `UI YAIWES/componentes open soure UI YAIWES/`.

Para cada candidato útil registrar:
- nombre/ruta;
- URL fuente;
- ref/commit;
- licencia;
- package/manifest/entrypoints;
- capacidad exacta;
- FRONTEND/BACKEND_DONOR/FULLSTACK/TOOLING/REFERENCE/REJECT;
- dependencias;
- riesgos;
- unidad mínima a reutilizar;
- contract/adapter;
- test;
- evidence;
- destino.

Deduplicar capacidades. 46 mapeados actuales = `SOURCE_PRESENT_ONLY`; no total de inventario.

Exit T1_03:
mapa suficiente y trazable para decidir owners de capacidades sin adivinar.

## 10. T1_04 — CanvasOwner

Después de T1_03 comparar Craft.js, GrapesJS y Puck si están físicamente verificados.

Evaluar:
licencia SaaS, React fit, serialización, nesting/slots, DnD/resize, inspector, undo/redo, responsive, plugin API, isolation, footprint, testability, accessibility.

Elegir un único CanvasOwner/API. Otros quedan donors.

El canvas HTML5 de factory-v1 puede ser baseline comparativo, no owner por defecto.

## 11. Fábrica canónica

Dos niveles:
F1 = Factory interna privada.
F2 = Interface/runtime usuario.

Dentro F1:
- M1 Element Builder;
- M2 UI Composer;
- M3 Component Transformer/Inbox;
- M4 AI Operator;
- M5 Deterministic Module Kit.

5 steps visibles:
`DESIGN/CREATE -> COMPOSE -> CONNECT -> AI/TRANSFORM -> VALIDATE/PUBLISH/EDIT`.

Todo step tiene input/output/pass/fail/evidence/rollback.

## 12. 0 fricción

Tres entradas:
`drag/drop | command palette | Jarvis prompt`.

Una implementación:
`todas -> TypedAction`.

Shell:
- ribbon contextual;
- left rail;
- center canvas;
- right inspector;
- bottom workbench.

No duplicar action paths por modo.

## 13. Cable frontend

`Intent`
`-> TypedAction`
`-> FrontendGuard`
`-> Factory Step Engine / Universal Action Bus`
`-> adapter`
`-> BackendBinding cuando aplique`
`-> backend/local capability`
`-> RuntimeEvent`
`-> Normalizer`
`-> UIStateDelta`
`-> verifier/evidence`
`-> frontend store`
`-> render`.

UI state no es autoridad canónica del backend.

## 14. Component import cable

`source`
`-> source URL/ref/commit/license/hash`
`-> static analysis`
`-> entrypoint/export map`
`-> capability extraction`
`-> Frontend/backend donor split`
`-> ComponentManifest`
`-> universal contract`
`-> adapter`
`-> sandbox preview`
`-> build/tests`
`-> RegistryCandidate`
`-> V+/evidence`.

No ejecutar import no confiable con privilegios amplios antes del sandbox.

## 15. AI cable

`AIIntent`
`-> ContextPack`
`-> ProviderRef/ModelRef`
`-> PlanProposal`
`-> UIStateDelta`
`-> diff/preview`
`-> guards`
`-> tests`
`-> apply|reject|rollback`
`-> evidence`.

No direct canonical mutation.

## 16. Cross-check backend Sol

Físicamente leído:

`contracts.py`:
Status PENDING/RUNNING/PASS/FAIL/BLOCKED/INCONCLUSIVE, Evidence, NodeContract, LayerResult.

`component_registry.py`:
ComponentSpec y estados WIRED/DONOR_ONLY/REFERENCE_ONLY/PENDING_SOURCE.

`llm_gate.py`:
ambiguity_resolution, semantic_ranking, bounded_summary; presupuesto <=5%; caller inyectado.

Implicaciones:
- backend PASS se muestra `RUNTIME_PASS`, no VERIFIED_CLOSED;
- WIRED sigue WIRED;
- BackendBinding es diseño frontend/adaptador hasta real capability test;
- general factory AI/Autopilot no se atribuye a Sol sin evidencia.

## 17. Router/modelos

Candidatos del INPUT:
Kimi K, MiniMax, DeepSeek V4 Pro/Flash, GLM-5, Meta Glimer pendiente de ID exacto, GPT-OSS.

No asumir disponibilidad.

`TaskProfile -> candidates -> provider/model health -> capability match -> policy -> select -> call -> failure/circuit -> next candidate -> evidence`.

Frontend nunca recibe raw key; sólo `secret_ref`.

## 18. Hugging Face private factory

Requisito del Director:
web privada HF para fábrica/canvas + cómputo HF cuando corresponda.

Antes de READY:
- recurso existe;
- private/auth probado;
- build reproducible;
- no secretos en bundle;
- health;
- persistence/version;
- rollback;
- E2E browser.

Actualmente GAP.

## 19. Backend donor staging

Cualquier backend útil descubierto en componentes OSS se deja en `backend/` Astra con:
- source URL/ref/commit;
- license;
- hash/provenance;
- capacidad mínima;
- entrypoint/deps;
- proposed contract;
- isolated test;
- destino sugerido.

No se integra en Sol hasta handoff del owner.

## 20. Seguridad

- secret_ref/capability token;
- TLS;
- local encryption sensible;
- AuthN/AuthZ;
- least privilege;
- sandbox imports;
- CSP/Trusted Types/iframe isolation cuando aplique;
- source/license/hash/SBOM;
- no secret en repo/log/manifest/frontend;
- V+ reversible;
- rollback;
- size/time/rate limits.

## 21. T1 restante

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

## 22. T2 preparada para Astra/Claude

Después del gate:
`T2_00 requirements/crosscheck`
-> `T2_01 AppShell/Workspaces`
-> `T2_02 Jarvis Command Center`
-> `T2_03 Files/Artifacts/Editors`
-> `T2_04 Workflow/Task Trace/Evidence`
-> `T2_05 Plugin/Backend Panel`
-> `T2_06 Model/Provider Selector`
-> `T2_07 Multiplatform`
-> `T2_08 Security`
-> `T2_09 real backend bindings`
-> `T2_10 E2E/release`
-> independent audit.

Claude puede retomar un nodo T2 sólo si T1 está cerrado y el nodo tiene owner/write_paths/base_sha/input/output/tests/evidence explícitos.

Antes del gate Claude sólo audita T1, toma nodo T1 con handoff, o investiga T2 read-only.

## 23. GAPs vigentes

- component XRAY incompleto;
- CanvasOwner no seleccionado;
- provider/model availability no verificada;
- HF private deployment no verificado;
- general backend LLM capability para Factory no verificada;
- real backend bindings T2 no verificados;
- factory-v1 es prototipo monolítico y no implementación canónica.

Cada GAP tiene owner/node/exit en Crazy Wall/State/Recovery.

## 24. LOOP

`INPUT literal -> GOALS12 -> priorities -> plan -> queue1x1 -> execute/review -> verify/refute -> GAP/FLAG -> research up to 20 -> StrategyDelta -> retry/continue safe task -> Council12 -> 3 simulations -> 3 refutations -> cross-check -> CODA -> verify_final`.

Canonical writes 1×1. Reads/tests independientes pueden fan-out.

Si HEAD cambia:
`STALE_LOCK_GAP_REBASE_REBUILD_DELTA`.
Nunca force.

## 25. Evidence rule

`SOURCE_PRESENT != WIRED != RUNTIME_TEST_PASS != VERIFIED_CLOSED`.

Cierre por nodo según aplique:
`literal/source + path + source ref/license/hash + diff/blob/commit + test/run/log + read-back + reviewer`.

## 26. Primera acción del relevo

No crear otro plan genérico.

Ejecutar:
`read 15-file canonical chain -> fresh HEAD -> verify CrazyWall/STATE/CHECKPOINT agree on T1_03 -> continue component XRAY -> update matrix/evidence -> only then T1_04`.
