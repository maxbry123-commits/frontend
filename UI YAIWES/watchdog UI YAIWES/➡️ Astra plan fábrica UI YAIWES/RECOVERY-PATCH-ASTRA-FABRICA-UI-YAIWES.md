# RECOVERY PATCH — ➡️ Astra plan fábrica UI YAIWES

Fecha: 2026-09-10
Proyecto: UI YAIWES
Repositorio: maxbry123-commits/frontend
Branch: main
Contrato: tel.workflow/v3
Modo: FAIL_CLOSED_LOOP
Identidad fija: `➡️ Astra plan fábrica UI YAIWES`

## 0. USO

Este Recovery Patch permite reconstruir contexto y continuar sin depender del chat. No autoriza declarar estados sin read-back fresco.

## 1. OBJETIVO PRINCIPAL

Cerrar `T1_FACTORY_FRONTEND` de forma verificable y, sólo después de `VERIFIED_CLOSED`, iniciar productivamente `T2_INTERFACE_YAIWES` usando la propia fábrica para construir/mejorar la UI.

Astra es frontend-first. Debe comprender backend de Sol para contratos/adapters y staging de donors, pero no invadir rutas backend de Sol.

## 2. OBJETIVO PRODUCTO

YAIWES objetivo:
`WORK + JARVIS CHAT + WORKFLOW + AGENTS + DESIGN/BUILD + CODE + ARTIFACTS + FILES + TERMINAL + TASK TRACE + MULTIAGENT`.

Multiplataforma: web, Windows, Linux, Android, iOS, smartphone, PC.

Operación parcial local; almacenamiento local por defecto; conectores opcionales del usuario; seguridad/cifrado fuertes; SaaS propietario; agentes/LLMs web; componentes alojados en web.

## 3. ARCHIVOS CANÓNICOS ASTRA

Raíz:
`UI YAIWES/watchdog UI YAIWES/➡️ Astra plan fábrica UI YAIWES/`

Leer en este orden:
1. INPUT-BLOCK-LITERAL-2026-09-10.md
2. NOTAS-INSTRUCCIONES-1A1-ASTRA-2026-09-10.md
3. ARQUITECTURA-PERFIL-TRABAJO-ASTRA-FABRICA-UI-YAIWES.md
4. PLAN-ASTRA-FABRICA-UI-YAIWES.md
5. STATE.json
6. CHECKPOINT Astra vigente
7. HANDOFF-ASTRA-FABRICA-UI-YAIWES.md
8. AUDITORIA-5-PASADAS-CROSSCHECK-2026-09-10.md
9. Crazy Wall YAIWES
10. main HEAD actual

## 4. REGLAS INNEGOCIABLES

- INPUT literal manda sobre interpretaciones.
- GitHub y Hugging Face son los únicos conectores autorizados para Astra.
- single_writer_per_path=true.
- no force push.
- no LFS.
- no secretos en frontend/repo.
- `SOURCE_PRESENT != WIRED != RUNTIME_TEST_PASS != VERIFIED_CLOSED`.
- `REUSE > COPY > PATCH > ADAPT > GENERATE`.
- no monolito.
- proposal/delta IA siempre pasa schema/validator/preview/test antes de apply.
- backend/ Astra = DONOR_STAGING_ONLY hasta handoff.

## 5. ROOTS

Frontend:
`UI YAIWES/watchdog UI YAIWES/➡️ Astra plan fábrica UI YAIWES/Frontend/`

Backend donor staging:
`UI YAIWES/watchdog UI YAIWES/➡️ Astra plan fábrica UI YAIWES/backend/`

Factory V0 existente:
`UI YAIWES/watchdog UI YAIWES/➡️ Astra plan fábrica UI YAIWES/Frontend/factory-v0/`

Contracts:
`UI YAIWES/watchdog UI YAIWES/➡️ Astra plan fábrica UI YAIWES/Frontend/contracts/`

## 6. FÁBRICA CANÓNICA

Cinco steps:
1. CREATE
2. COMPOSE
3. TRANSFORM COMPONENT
4. AI/AUTOPILOT
5. VALIDATE/EXIT

Cinco módulos:
M1 Component Maker
M2 UI Composer
M3 Component Transformer
M4 AI Intervention
M5 Deterministic Toolbox

Tres modos:
MANUAL | AI_ASSIST | AUTOPILOT

## 7. FRONTEND-BACKEND CONTRACT

`USER/AI -> UI Intent -> TypedAction -> Frontend Guard -> Universal Plugin/Action Bus -> API/MCP Adapter -> Backend Contract -> Runtime/Worker -> Event/StateDelta -> Verifier/Evidence -> Frontend Store -> UI Render`

Secrets: sólo `secret_ref` en cliente.

## 8. LOOP DE RECUPERACIÓN

`AUTO_REBUILD_CONTEXT -> INPUT literal -> GOALS12 -> priorities -> plan -> queue1x1 -> execute/review -> verify/refute -> GAP/FLAG -> research up to 20 -> StrategyDelta -> retry/continue safe task -> Council12 -> simulations3 -> refutations3 -> cross-check -> CODA -> verify_final`

## 9. AUTO_REBUILD_CONTEXT

Al recuperar:
1. Obtener HEAD main fresco.
2. Leer Crazy Wall.
3. Confirmar identity/owner.
4. Leer INPUT literal.
5. Leer PLAN/arquitectura.
6. Leer STATE/CHECKPOINT.
7. Inspeccionar rutas Frontend/backend.
8. Inspeccionar factory-v0 física.
9. Recalcular gates cerrados/abiertos.
10. Continuar único nodo propio queue1x1.

Si HEAD cambió durante trabajo: `STALE_LOCK_GAP_REBASE_REBUILD_DELTA`.

## 10. GATES DE CIERRE T1

No cerrar hasta demostrar todos:

GATE-A INPUT/TRACE
- INPUT literal existe y cubre instrucciones vigentes.
- ledger 1a1 existe.

GATE-B ARCHITECTURE
- arquitectura completa.
- PLAN completo.
- frontera backend clara.

GATE-C FACTORY FUNCTIONAL
- factory ejecutable.
- cinco steps navegables.
- component maker funcional.
- composer drag/drop funcional.
- transform donor funcional.
- AI delta/apply/rollback funcional.
- validate/export/reopen funcional.

GATE-D OSS TRACE
- donor integrado con URL, commit/ref, licencia, capacidad, adapter y test.

GATE-E TEST
- unit PASS.
- contract PASS.
- E2E PASS.
- visual/responsive PASS.
- security PASS.
- recovery/V+ PASS.

GATE-F PREVIEW
- preview privado ejecutable.
- evidencia de build/run.

GATE-G AUDIT
- simulations3 ejecutadas.
- refutations3 PASS.
- cross-check PASS.
- reviewer independiente.

Sólo GATE-A..G completos permiten promoción a `VERIFIED_CLOSED`.

## 11. GAP HANDLING

Para cada GAP:
- registrar evidencia del fallo/faltante;
- generar hasta 20 soluciones si es necesario;
- auditar soluciones contra INPUT/arquitectura;
- elegir StrategyDelta materialmente distinto;
- ejecutar;
- verificar;
- si falla, repetir;
- continuar safe task independiente si existe FLAG no crítico.

No inventar éxito. No escalar como sustituto automático de investigación.

## 12. COMPONENT DONORS

Inventario >40 ya localizado; presencia no equivale a uso.

Priorizar frontend mínimo:
- Craft.js / canvas-builder candidates
- CodeMirror 6
- Excalidraw
- Lucide
- Chart.js
- PDF.js
- Playwright/MSW para pruebas

Backend donor staging candidatos:
- LiteLLM
- LiveKit
- HTTPX
- MCP SDKs
- NATS/PGMQ
- OpenBao/PyCasbin
- OpenTelemetry/Loguru/Loki

Nunca integrar repo completo por disponibilidad; extraer capacidad mínima.

## 13. PUNTO EXACTO DE REANUDACIÓN

`T1_FACTORY_FRONTEND_VERIFY_CURRENT_MAIN_AND_CLOSE_RUNTIME_GAPS`

Secuencia:
`HEAD -> Crazy Wall -> INPUT -> PLAN -> STATE/CHECKPOINT -> inspect factory-v0 -> test current behavior -> identify first failing closure gate -> queue1x1 StrategyDelta -> test -> evidence -> persist -> repeat`.

## 14. T2 POST-GATE

Después de T1 VERIFIED_CLOSED:
- usar fábrica para construir UI YAIWES productiva;
- mantener cambios modulares V+;
- integrar backend mediante adapter/contract;
- cross-check continuo con backend Sol;
- mantener backlog de mejoras y research OSS;
- no modificar por actividad vacía.

## 15. ESTADO DE RECOVERY

Al emitir este parche: `ACTIVE_LOOP`.
No convertir a CLOSED/VERIFIED_CLOSED sin read-back de estado físico y reviewer independiente.
