# PLAN MAESTRO TAREA 1 + TAREA 2 — ASTRA V3

Fecha: 2026-09-10
Owner: `➡️ Astra plan fábrica UI YAIWES`
Contrato: `tel.workflow/v3`
Modo: `FAIL_CLOSED_LOOP`
Estado: `ACTIVE_LOOP`

V3 supersede V2 como plan operativo porque corrige la cadena de recuperación para incluir INPUT Part-02, Arquitectura V2, CHECKPOINT y Handoff/Recovery V3. No borra V2.

## GATE PRINCIPAL

`T1_FACTORY = ACTIVE_LOOP`
`T2_INTERFACE = BLOCKED_BY_T1_FOR_PRODUCTIVE_EXECUTION`

T2 sólo admite investigación/read-only/contracts durante T1. No implementación productiva antes de T1 `VERIFIED_CLOSED` por auditor independiente.

## CADENA DE RECUPERACIÓN

`INPUT base -> INPUT addendum -> INPUT part-02 -> Crazy Wall Astra -> STATE -> CHECKPOINT -> Perfil -> Arquitectura V2 -> Matriz -> Plan V3 -> Auditorías 4 pasadas -> Recovery V3 -> Handoff V3 -> fresh HEAD -> current_node`.

## TAREA 1 — FÁBRICA UI

`T1_00 INPUT literal` — `VERIFIED_CLOSED documental`.
Salida: tres archivos literales; credenciales excluidas deliberadamente y sustituidas por regla secret_ref.

`T1_01 Perfil Astra/UI` — `VERIFIED_CLOSED documental`.
Salida: identidad, objetivo persistente, UX/referencias, frontera backend.

`T1_02 Arquitectura V2` — `CLOSED_UNVERIFIED`.
Salida: rutas físicas, precedencia, F1/F2, 5 pasos, M1-M5, contracts, cableado, seguridad, multiplataforma, router, HF, tests, gaps y criterios de cierre.
No promover por documentación; requiere implementación y auditor independiente.

`T1_03 COMPONENT_XRAY` — `ACTIVE_LOOP`.
Entradas:
- `fabrica de UI INTERFACE fromtend/`;
- `UI YAIWES/componentes open soure UI YAIWES/`.
Acción: inventario físico completo de candidatos útiles, source/ref/commit/license/entrypoints/capability/test/destination, deduplicación y matriz.
Salida: capability map suficiente para seleccionar owners de capacidades.

`T1_04 CANVAS_OWNER_SELECTION` — `PENDING`.
Bakeoff Craft.js/GrapesJS/Puck si están verificados; un solo CanvasOwner/API.

`T1_05 COMPONENT_REGISTRY_CONTRACT` — `PENDING`.
Cerrar ComponentManifest + ComponentDefinition + ComponentInstance + UIDocument + TypedAction + UIStateDelta + BackendBinding + RuntimeEvent + ProviderRef + ArtifactRef + EvidenceRef + SurfaceCapability.

`T1_06 FACTORY_SHELL_AND_5_STEPS` — `PENDING`.
Implementar `DESIGN/CREATE -> COMPOSE -> CONNECT -> AI/TRANSFORM -> VALIDATE/PUBLISH/EDIT` con input/output/pass/fail/evidence/rollback por step.

`T1_07 M1 ELEMENT_BUILDER` — `PENDING`.
Ventana/botón/selector/segmento/panel/modal/card/input/list/table/tree/command; schema+preview+a11y.

`T1_08 M2 UI_COMPOSER` — `PENDING`.
Canvas, layers, DnD, resize, constraints, responsive, routes, inspector, undo/redo, version.

`T1_09 M3 COMPONENT_TRANSFORMER` — `PENDING`.
`source -> provenance/license/hash -> scan -> split -> manifest -> adapter -> sandbox -> test -> registry candidate`.

`T1_10 M4 AI_OPERATOR` — `PENDING`.
MANUAL|AI_ASSIST|AUTOPILOT; AI sólo produce PlanProposal/UIStateDelta; preview/guards/test/apply|reject|rollback.

`T1_11 M5 DETERMINISTIC_KIT` — `PENDING`.
Scan/copy/move/hash/manifest/schema/build/typecheck/lint/unit/contract/E2E/visual/a11y/bundle/version/evidence/rollback sin LLM cuando sea mecánico.

`T1_12 UNIVERSAL_CONTRACT_AND_ADAPTER_BUS` — `PENDING`.
Todo cross-layer por contrato/adapters; no importación ad-hoc.

`T1_13 SANDBOX_PREVIEW_HF_PRIVATE` — `PENDING`.
Aislamiento de imports/previews + fábrica privada HF sólo tras verificar privacy/auth/build/no-secret/health/persistence/rollback.

`T1_14 TESTS_EVIDENCE_ROLLBACK` — `PENDING`.
Unit + schema + contract + E2E + visual + responsive + accessibility + security + rollback + read-back.

`T1_15 THREE_SIMULATIONS_AND_REFUTATIONS` — `PENDING`.
A humano drag/drop; B IA con fallo y rollback; C backend mock->real adapter swap. Cada una con 3 refutaciones.

`T1_16 INDEPENDENT_AUDIT` — `PENDING`.
Owner reviewer Claude/otra AI independiente; productor no auto-certifica.

Cierre T1:
`path + SHA/diff + build/test/log + read-back + no unresolved node GAP + independent reviewer = VERIFIED_CLOSED`.

## TAREA 2 — INTERFACE UI YAIWES

Sólo tras T1_16 PASS + ownership/write paths explícitos:

`T2_00 REQUIREMENTS/SOURCE/BACKEND CROSSCHECK`
-> `T2_01 APPSHELL/WORKSPACES`
-> `T2_02 JARVIS CHAT/COMMAND CENTER`
-> `T2_03 FILES/ARTIFACTS/EDITORS`
-> `T2_04 WORKFLOW/TASK TRACE/EVIDENCE`
-> `T2_05 COMPONENT/PLUGIN/BACKEND PANEL`
-> `T2_06 MODEL/PROVIDER SELECTOR`
-> `T2_07 MULTIPLATFORM/RESPONSIVE/CAPABILITIES`
-> `T2_08 FRONTEND SECURITY`
-> `T2_09 REAL BACKEND BINDINGS`
-> `T2_10 E2E/RELEASE CANDIDATE`
-> independent audit.

## CABLEADO INVARIANTE

`drag/drop | command palette | Jarvis prompt -> TypedAction -> FrontendGuard -> Factory Step Engine/Universal Bus -> adapter -> BackendBinding when applicable -> backend/local capability -> RuntimeEvent -> Normalizer -> UIStateDelta -> verifier/evidence -> frontend store -> render`.

## FRONTERA SOL

Astra puede leer contratos/estado backend, diseñar adapters y preparar donors en `backend/` staging. No escribir rutas Sol sin handoff.

Cross-check vigente:
- NodeContract/Evidence/LayerResult existen;
- ComponentSpec registry existe con estados distintos;
- LLMGate actual no demuestra Autopilot general;
- backend PASS se representa como RUNTIME_PASS, nunca VERIFIED_CLOSED automáticamente.

## OPEN GAPS

1. COMPONENT_XRAY incomplete -> T1_03.
2. CanvasOwner not selected -> T1_04.
3. Provider/model availability not verified -> T1_10/T1_12.
4. HF private factory deployment not verified -> T1_13/T1_14.
5. Backend LLM capability for factory not verified -> external dependency/T1_10/T1_12.
6. Real backend bindings -> T2_09, blocked by T1.

## LOOP / WRITE POLICY

`INPUT literal -> GOALS12 -> priorities -> plan -> queue1x1 -> execute/review -> verify/refute -> GAP/FLAG -> research up to 20 -> StrategyDelta -> retry/continue safe task -> Council12 -> 3 simulations -> 3 refutations -> cross-check -> CODA -> verify_final`.

Reads/research/tests independientes pueden fan-out. Canonical writes permanecen 1×1.
Si HEAD cambia: refetch/rebuild delta; no force.

## CURRENT NODE

`T1_03_COMPONENT_XRAY`

No volver a planificación genérica. No iniciar T2 productiva.
