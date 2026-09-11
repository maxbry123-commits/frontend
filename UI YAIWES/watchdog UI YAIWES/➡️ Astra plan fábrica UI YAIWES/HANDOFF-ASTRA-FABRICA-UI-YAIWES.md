# HANDOFF — ➡️ Astra plan fábrica UI YAIWES

Fecha: 2026-09-10
Proyecto: UI YAIWES
Repositorio: maxbry123-commits/frontend
Branch: main
Contrato: tel.workflow/v3
Modo: FAIL_CLOSED_LOOP
Identidad: `➡️ Astra plan fábrica UI YAIWES`
Estado al emitir: ACTIVE_LOOP

## 1. MISIÓN

Astra mantiene la Fábrica UI YAIWES y el frontend como objetivo principal. Debe comprender el backend de Sol para diseñar contratos/adapters compatibles, pero no escribir en rutas backend ajenas. Donors backend OSS se guardan en `backend/` como `DONOR_STAGING_ONLY` hasta handoff explícito.

Gate obligatorio: `T1_FACTORY_FRONTEND` debe llegar a `VERIFIED_CLOSED` antes de iniciar productivamente `T2_INTERFACE_YAIWES`.

## 2. ARCHIVOS QUE DEBEN LEERSE AL RECUPERAR

Orden obligatorio:
1. `INPUT-BLOCK-LITERAL-2026-09-10.md`
2. `NOTAS-INSTRUCCIONES-1A1-ASTRA-2026-09-10.md`
3. `ARQUITECTURA-PERFIL-TRABAJO-ASTRA-FABRICA-UI-YAIWES.md`
4. `PLAN-ASTRA-FABRICA-UI-YAIWES.md`
5. `STATE.json`
6. CHECKPOINT Astra vigente
7. `RECOVERY-PATCH-ASTRA-FABRICA-UI-YAIWES.md`
8. `AUDITORIA-5-PASADAS-CROSSCHECK-2026-09-10.md`
9. Crazy Wall canónico de UI YAIWES
10. main HEAD actual

## 3. RUTAS DE ASTRA

Raíz de trabajo:
`UI YAIWES/watchdog UI YAIWES/➡️ Astra plan fábrica UI YAIWES/`

Frontend staging:
`UI YAIWES/watchdog UI YAIWES/➡️ Astra plan fábrica UI YAIWES/Frontend/`

Backend donor staging:
`UI YAIWES/watchdog UI YAIWES/➡️ Astra plan fábrica UI YAIWES/backend/`

Regla: `backend/` no autoriza escrituras en rutas de backend Sol.

## 4. FRONTERA DE OWNERSHIP

- `➡️ Astra plan fábrica UI YAIWES`: fábrica/frontend staging, planificación, contratos frontend, pruebas, evidencia y preparación donor backend.
- `➡️🤯 sol plan 1 UI YAIWES backend`: backend productivo/cableado backend según Crazy Wall.
- Otros owners: respetar Crazy Wall vigente.

Antes de escribir:
`read main -> HEAD/base SHA -> Crazy Wall -> STATE/CHECKPOINT -> owner path check`.

Si HEAD cambió durante operación:
`STALE_LOCK_GAP_REBASE_REBUILD_DELTA`.

Nunca force push. Nunca LFS.

## 5. ALLOWLIST

Integraciones/conectores autorizados para este worker:
- GitHub
- Hugging Face

Cualquier otro plugin/conector: DENY hasta autorización explícita posterior del Director.

## 6. OBJETIVO PRODUCTO YAIWES

YAIWES = Work multiplataforma + Jarvis Chat/orquestador + workflows/agentes + design/build + code + artifacts + files + terminal + task trace + multiagent.

Plataformas: web, Windows, Linux, Android, iOS, smartphone, PC.

Principios:
- almacenamiento local por defecto;
- conectores opcionales del usuario;
- operación parcial local;
- IA embebida/local cuando corresponda;
- agentes/LLMs principales servidos desde web;
- código/componentes alojados en web;
- producto SaaS propietario;
- seguridad/cifrado fuertes;
- frontend no contiene secretos.

## 7. FÁBRICA — CINCO STEPS

1. CREATE: primitive/window/button/selector/segment -> props/tokens -> live preview -> ComponentDraft.
2. COMPOSE: canvas -> drag/drop -> resize -> constraints/layout -> responsive/navigation -> UIScene.
3. TRANSFORM: OSS/local -> scanner -> capability -> ficha/contract -> adapter -> sandbox preview -> registry.
4. AI/AUTOPILOT: goal -> context -> router -> proposed StateDelta -> visual diff -> validator -> preview -> apply/rollback.
5. VALIDATE/EXIT: contract -> tests -> build -> private preview -> evidence -> V+ -> export/reopen.

Modos: MANUAL | AI_ASSIST | AUTOPILOT.

## 8. MÓDULOS

M1 Component Maker.
M2 UI Composer.
M3 Component Transformer.
M4 AI Intervention.
M5 Deterministic Toolbox.

## 9. COMPONENTES OSS Y POLÍTICA

Más de 40 componentes fueron inventariados. No integrar repos completos por disponibilidad.

Regla:
`REUSE > COPY > PATCH > ADAPT > GENERATE`.

Cada donor que se integre exige:
- source URL;
- source commit/ref;
- licencia;
- capacidad exacta extraída;
- destino;
- adapter/contract;
- test;
- evidencia/read-back.

## 10. LOOP

`INPUT literal -> GOALS12 -> prioridades -> plan -> queue1x1 -> execute/review -> verify/refute -> GAP/FLAG -> research hasta 20 soluciones -> StrategyDelta -> retry/continue safe task -> Council12 -> 3 simulaciones -> 3 refutaciones -> cross-check -> CODA -> verify_final`.

GAP no se convierte en PASS. FLAG no paraliza safe tasks independientes.

## 11. ESTADO T1 AL HANDOFF

No asumir cierre. Recalcular siempre desde main.

Condiciones mínimas faltantes que deben verificarse antes de VERIFIED_CLOSED:
- Factory ejecutable real.
- Drag/drop E2E.
- Inspector/edición/reopen.
- Component Transformer con donor OSS trazable.
- AI StateDelta apply/rollback real.
- Build + preview privado.
- Tests unit/contract/E2E/visual/responsive/security/recovery.
- 3 simulaciones ejecutadas.
- 3 refutaciones PASS.
- Cross-check global PASS.
- reviewer independiente.

## 12. PUNTO DE REANUDACIÓN

Nodo recomendado al recuperar:
`T1_FACTORY_FRONTEND_VERIFY_CURRENT_MAIN_AND_CLOSE_RUNTIME_GAPS`

Secuencia:
`read INPUT -> read main/Crazy Wall/STATE/CHECKPOINT -> inspect Factory current physical state -> recalc missing closure gates -> queue1x1 -> execute minimal StrategyDelta -> test -> evidence -> update state/checkpoint -> repeat until reviewer can certify`.

No volver a planificación genérica mientras exista un nodo de cierre físico verificable pendiente.

## 13. CIERRE

Estados permitidos:
- ACTIVE_LOOP
- GAP
- INCONCLUSIVE
- CLOSED_UNVERIFIED
- VERIFIED_CLOSED

El productor no se autocertifica. `VERIFIED_CLOSED` sólo después de evidencia objetiva y revisión independiente.
