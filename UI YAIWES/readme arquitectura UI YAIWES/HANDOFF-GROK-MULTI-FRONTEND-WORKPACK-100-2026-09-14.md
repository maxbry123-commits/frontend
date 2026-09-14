# HANDOFF — MULTI GROK — FRONTEND WORKPACK 100 — 2026-09-14

repo: `maxbry123-commits/frontend`  
branch: `main`  
contract: `tel.workflow/v3`  
mode: `FAIL_CLOSED_LOOP`  
domain: `FRONTEND_ONLY`

## Autoridad

Leer fresh, en este orden:

1. `FACTORY-CRAZY-WALL-SEGMENTED-V10-2026-09-14.json`
2. `FACTORY-FRONTEND-GROK-WORKPACK-20-V1-2026-09-14.json`
3. `FACTORY-FRONTEND-GROK-WORKPACK-100-V1-2026-09-14.json`
4. archivo de nodos correspondiente a tu rango
5. `src/segments/segment-registry-v1.js`
6. `src/donors/oss-registry.js` si es OSS
7. `src/microkernel/acquisition/index.js` si requiere adquisición

## Claim sin colisiones

El manifiesto y los tres archivos de nodos son **inmutables para workers**.

Cada chat escribe sólo su archivo:

`UI YAIWES/bitácora stated JSON Craxy wall plan checkpoint/claims/frontend-workpack-100/F-FE-XXX.json`

Campos mínimos:

`node_id, chat_id, agent, state, fresh_main_sha, claimed_at, write_scope, base_blobs`

Antes de escribir:

`READ main fresh → READ claim nodo → READ scopes vecinos → collision check`

Si otro writer ya tiene nodo o path:

`NO WRITE → RELEASE/SKIP → NEXT VALID NODE`

Si `main` cambió:

`STALE_LOCK_GAP_REBUILD_DELTA`

## Reparto escalable — 10 lanes

- GROK-A: `F-FE-090..099`
- GROK-B: `F-FE-100..109`
- GROK-C: `F-FE-110..119`
- GROK-D: `F-FE-120..129`
- GROK-E: `F-FE-130..139`
- GROK-F: `F-FE-140..149`
- GROK-G: `F-FE-150..159`
- GROK-H: `F-FE-160..169`
- GROK-I: `F-FE-170..179`
- GROK-J: `F-FE-180..189`

Nueve lanes tienen un primer nodo inmediatamente ejecutable. GROK-J espera las dependencias declaradas en `F-FE-180`.

**1 chat = 1 nodo activo.**

## Familia 1 — F-FE-090..154 — CONTROL_QA

Cada nodo prueba un solo botón/control real en navegador.

El test debe demostrar:

`control visible/reachable → interacción → cambio observable → persistencia si aplica → console/network critical=0`

Un control deshabilitado sólo pasa si existe razón visible y determinista.

Si falla:

`CONTROL_GAP → reportar al segment owner → NO PATCH desde QA → release`

El productor dueño implementará una versión nueva y otro gate repetirá la prueba.

## Familia 2 — F-FE-155..173 — OSS_FRONTEND_ADAPTER

Primero:

`READ registry → READ árbol local → DEDUP`

- Local/extracted: `REUSE`, cero descarga.
- ZIP_ONLY: sólo `CANONICAL_MOTOR2_EXTRACT_IF_NEEDED`.
- Si ya está probado/wired: `PASS_NO_DELTA`.

Prohibido:

- downloader/copiador alternativo;
- embedding de un monolito;
- segundo editor/state engine/router;
- escribir candidate/live;
- copiar carpetas sin capability gap.

Entregable:

`thin adapter + provenance + licencia + focused browser microtest + PASS_RELEASED`.

## Familia 3 — F-FE-174..189 — FRONTEND_IMPROVEMENT

Respetar `depends_on` del nodo.

Crear siempre versión nueva del segmento. No sobrescribir versiones anteriores.

Productor no integra el candidato. `SEG-11` compone sólo después de `PASS_RELEASED`.

## Pasos obligatorios

Exactamente:

`VERIFY_RESEARCH → EXECUTE_DELTA → TEST_REPORT`

Prioridad:

`REUSE_EXISTING > PATCH > ADAPT > GENERATE > CANONICAL_MOTOR2_ONLY_IF_GAP`

## Cómputo visible

`[NODO][LANE][SEGMENTO][PASO][WRITE_SCOPE][BASE_SHA][ACCIÓN][RESULTADO][GAP][FIX][TEST][PASS/FAIL][RUN/JOB][SIGUIENTE]`

## Cierre

Worker:

`PASS_RELEASED | GAP_RESOLVABLE`

Integrator:

`READ released segments → compose exact candidate → browser regression`

Final:

`F-UI-062 independent review → F-UI-063 → TESTED_SHA == PUBLISHED_SHA → FRONTEND_100`
