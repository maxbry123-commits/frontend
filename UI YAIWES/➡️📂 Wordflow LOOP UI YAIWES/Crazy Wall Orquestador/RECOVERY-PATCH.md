# RECOVERY PATCH — Wordflow LOOP UI YAIWES

Contrato: `tel.workflow/v3`
Modo: FAIL-CLOSED

## Anclas canónicas
- Arquitectura UI: `UI YAIWES/Readme arquitectura UI YAIWES.md`
- README Wordflow: `UI YAIWES/➡️📂 Wordflow LOOP UI YAIWES/➡️📂 readme wordflow loop UI YAIWES.md`
- HANDOFF: `UI YAIWES/➡️📂 Wordflow LOOP UI YAIWES/HANDOFF.md`
- STATE: `UI YAIWES/➡️📂 Wordflow LOOP UI YAIWES/Crazy Wall Orquestador/STATE.json`
- CHECKPOINT: `UI YAIWES/➡️📂 Wordflow LOOP UI YAIWES/Crazy Wall Orquestador/CHECKPOINT.json`
- BITÁCORA: `UI YAIWES/➡️📂 Wordflow LOOP UI YAIWES/Crazy Wall Orquestador/BITACORA-CRAZY-WALL.md`
- LEDGER: `UI YAIWES/➡️📂 Wordflow LOOP UI YAIWES/Crazy Wall Orquestador/LEDGER-ARQUITECTURA-UI-YAIWES.md`
- Documentos backend: `UI YAIWES/➡️📂 Wordflow LOOP UI YAIWES/Documentos proyectos wordflow backend UI YAIWES/`
- Documentos UI visible: `UI YAIWES/➡️📂 Wordflow LOOP UI YAIWES/documentos proyectos UI YAIWES/`

Si divergen: `GAP`.

## Reanudación — 3 pasadas
1. Leer Arquitectura UI + README Wordflow + HANDOFF y fijar instrucción literal/nodo activo.
2. Leer STATE + CHECKPOINT + RECOVERY + Crazy Wall + LEDGER; reconciliar estado, pendientes, evidencia y rollback.
3. Leer fuentes reales del nodo: documentos, componentes, código, commits y tests. Ausencia de fuente = GAP.

## Fuente estructural de la réplica
Repositorio: `maxbry123-commits/agentes`
Ruta: `➡️📂 Wordflow LOOP Yaiwes`
Tree fuente: `4d0ed5e0910ca6fe573b7b3dac83d2c451ba49b3`.

Subárboles cuya copia fue verificada por igualdad de tree SHA:
- `wordflow_loop` → `5e06f48dcbb01b17d07240a2b7919d92d0a04f77`
- `📂 Capa de persistencia open mythos` → `99d51adb61db9328fe1cbf4683aa0ee70b4d4abc`
- `📂 Capa workflow GitHub Action` → `76d79758c86beb3856b5b736d434b6095110d13a`
- `📂 Capa workflow evolución` → `cf029c82e8879b3c8c297844d45578b0ff83e925`
- `📂 notas auditoría Claude` → `d07582fe8bc990e5ce5c3a1850956c697feee653`

Exclusión literal: `📂 archivos download` NO se replica; read-back en destino = 404.

`runtime/src` debe conservar las 15 raíces estructurales fuente: `agent, conn, core, governance, install, mission, observability, parallel, preflight, recovery, research, spec, storage, tribunal, uek`; el backend nuevo puede añadir `adapters, tasks, integration` sin borrar las anteriores.

## Pipeline de reinyección
`INPUT_LITERAL + contract + node_id + goal_lock + checkpoint ➡️ SHERIFF ➡️ VALIDATOR ➡️ RESEARCH ➡️ RANK ➡️ EXECUTE DELTA ➡️ VERIFY`

### Si falla
`GAP ➡️ registrar failure_evidence + failed_strategy + checkpoint ➡️ RESEARCH ➡️ seleccionar delta distinto ➡️ repetir mismo nodo`

### Si pasa
`PASS ➡️ CODA ➡️ verify_final independiente`

### Final verification
- todos checks reales PASS → `VERIFIED_CLOSED`
- algún check FAIL → `CLOSED_UNVERIFIED`
- no hay check falsificable suficiente → `INCONCLUSIVE`

## Recuperación por bloque backend

### Stabilize CORE
Recuperar workflow id, stage/task actual, durable store, queue, status, jump/retry/suspend state y último commit durable.

### Memory Adapter
Recuperar context_ref, evidence_refs, memory_version y state/consolidation refs. No reconstruir memoria desde el modelo.

### Router Adapter
Recuperar recurso seleccionado, health observado, routing decision ref y fallback usado.

### Agent Task
Recuperar TaskContract, input fingerprint, attempt, strategy_id y AgentResult/validation result.

### Validator/Judge
Recuperar schema result, evidence checks, critical GAPs, coverage y verdict.

### Consolidator
Recuperar hechos, decisiones, evidencia, dependencias, conflictos e IntegrationState.

## Contrato por nodo
1. `node_id` único.
2. INPUT literal y hash/ref cuando aplique.
3. destino exacto.
4. source refs reales.
5. checkpoint antes de mutación relevante.
6. una tarea/nodo a la vez.
7. verificación/refutación.
8. fallo conserva evidencia.
9. retry requiere estrategia distinta.
10. no avanzar de nodo con GAP crítico.
11. actualizar STATE/CHECKPOINT/Crazy Wall tras avance real.
12. secretos solo por `secret_ref`.

No copiar el estado histórico del proyecto fuente como si fuera estado de UI YAIWES; se replica la arquitectura/método y cada estado operativo se mantiene propio del destino.
