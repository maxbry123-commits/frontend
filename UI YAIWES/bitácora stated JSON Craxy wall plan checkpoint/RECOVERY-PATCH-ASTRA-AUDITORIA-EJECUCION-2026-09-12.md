# RECOVERY PATCH — ASTRA GPT — AUDITORÍA + EJECUCIÓN UI YAIWES

Contrato: `tel.workflow/v3`
Modo: `FAIL_CLOSED_LOOP`
Estado inicial: `ACTIVE_LOOP_NOT_CLOSED`
Handoff obligatorio: `UI YAIWES/readme arquitectura UI YAIWES/HANDOFF-ASTRA-AUDITORIA-EJECUCION-UI-YAIWES-V6.md`

## INPUT LITERAL PARA ASTRA

Audita exhaustivamente UI YAIWES desde las 3 fuentes funcionales principales y cruza cada requisito contra código ejecutable, tests y evidencia actual. No asumas que una ruta, README, vendor o test parcial equivale a implementación global. Ejecuta únicamente deltas faltantes probados, un nodo a la vez, máximo 3 pasos por tarea, respetando ownership/write_scope de Sol1/Sol2/Sol3.

## PASO 1 — AUDITORÍA X-RAY

Lee literalmente los 3 documentos fuente fijados en el Handoff V6 y realiza 4 pasadas por cada documento + 4 pasadas por:
- `wordflow_loop/wordflow_loop/**`
- `runtime/src/**`
- `runtime/tests/**`
- Crazy Wall/GAP ledger/role states

Construye matriz:
`GOAL → REQUIREMENT → LAYER → FILE/FUNCTION → TEST → EVIDENCE → STATUS`.
Luego haz el cross-check inverso:
`ARTIFACT → TASK → REQUIREMENT → GOAL`.

## PASO 2 — CLASIFICACIÓN/DEDUPE

Para cada hueco decide y prueba:
`REUSE_EXISTING | PATCH | ADAPT | GENERATE | PROVIDER_GAP`.
No escribas código grande si una capacidad equivalente ya existe. No descargues componente nuevo sin GAP funcional único demostrado. Los motores canónicos son inmutables; no LFS, no force, no sanitización para saltar guards.

GAPs de atención prioritaria:
1. Memory/Audit + Context Fabric.
2. Agent↔Memory↔Tools↔Workflow.
3. Integration/Consolidator/Coverage/Final Judge.
4. Recovery/UEK/Sandbox lifecycle.
5. VM Manager/platform routing Android/Windows/Linux; iOS/Web sólo con evidencia.
6. Memory API GET_CONTEXT/GET_MEMORY/GET_EVIDENCE/... + canonical write pipeline.
7. G12 global coverage matrix.
8. 5 OSS bloqueados: Litestream, Tempo, Schemathesis, Kata, Grype; preferir REUSE probado si cubre objetivo.

## PASO 3 — EJECUCIÓN

Por nodo:
1. `VERIFY`: relee HEAD/Crazy Wall; reclama sólo FREE; declara `owner,node_id,base_sha,write_scope`.
2. `DELTA`: cambio mínimo autorizado, preservando fronteras Workflow/Memory/Sandbox/LLM/Consolidator.
3. `TEST+REPORT`: CI/runtime/read-back; registrar SHA/run/job/log. Si falla: GAP + StrategyDelta materialmente distinto; continuar con siguiente FREE.

## ANTI-COLISIÓN

- No escribir en nodo/path CLAIMED por Sol1/Sol2/Sol3.
- Si un nodo ajeno tiene GAP, puedes auditar/refutar pero no apropiarte del write_scope.
- Escribe primero en `UI YAIWES/bitácora stated JSON Craxy wall plan checkpoint/roles/ASTRA-CROSSCHECK-EXECUTION-STATE.json` y artefactos `ASTRA-XRAY-*`.
- Shared files sólo se consolidan con fresh read-back y merge aditivo.

## EVIDENCIA YA VÁLIDA — NO REPETIR SIN MOTIVO

- Wordflow runner fail-closed + governance + ledger + L01–L06.
- Fables socket + Stabilize bridge tested.
- OPA/OpenFGA `SOURCE_PRESENT + FABLES_WIRED + LIVE_RUNTIME_PASS` en sublane policy.
- 6/11 OSS nuevos `SOURCE_PRESENT_READBACK_VERIFIED`: OPA, OpenFGA, rqlite, OpenTelemetry Collector, ORAS, Testcontainers Python.
- Los otros 5 no están listos; conservan `PROVIDER_SPECIAL_FILE_GAP` mientras no exista REUSE o provider compatible probado.

## SALIDA OBLIGATORIA

Por nodo reporta:
`NODO | PASS/GAP | requisito | file/function | SHA | test/run | evidencia | next`.

Cierre global sólo cuando G12 esté 100% evidenciado y Memory/Audit + Agent + Sandbox/UEK + Recovery + Integration/Consolidation + platform routing estén implementados o cerrados por equivalencia probada. Sin evidencia = GAP.