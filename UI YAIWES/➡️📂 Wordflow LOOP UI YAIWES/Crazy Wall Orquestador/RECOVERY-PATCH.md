# RECOVERY PATCH — Wordflow LOOP UI YAIWES

Contrato: `tel.workflow/v3`
Modo: FAIL-CLOSED

## Anclas canónicas
- README: `UI YAIWES/README arquitectura UI YAIWES.md`
- HANDOFF: `UI YAIWES/➡️📂 Wordflow LOOP UI YAIWES/HANDOFF.md`
- STATE: `UI YAIWES/➡️📂 Wordflow LOOP UI YAIWES/Crazy Wall Orquestador/STATE.json`
- CHECKPOINT: `UI YAIWES/➡️📂 Wordflow LOOP UI YAIWES/Crazy Wall Orquestador/CHECKPOINT.json`
- BITÁCORA: `UI YAIWES/➡️📂 Wordflow LOOP UI YAIWES/Crazy Wall Orquestador/BITACORA-CRAZY-WALL.md`
- LEDGER: `UI YAIWES/➡️📂 Wordflow LOOP UI YAIWES/Crazy Wall Orquestador/LEDGER-ARQUITECTURA-UI-YAIWES.md`

Si divergen: `GAP`.

## Reanudación — 3 pasadas
1. Leer README + HANDOFF y fijar la instrucción literal/nodo activo.
2. Leer STATE + CHECKPOINT + RECOVERY + Crazy Wall; reconciliar estado, pendientes, evidencia y rollback.
3. Leer fuentes reales del nodo: documentos, componentes, código, commits y tests. Ausencia de fuente = GAP.

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
Recuperar:
- workflow id;
- stage/task actual;
- durable store;
- queue;
- status;
- jump/retry/suspend state;
- último commit durable.

### Memory Adapter
Recuperar:
- context_ref;
- evidence_refs;
- memory_version;
- state/consolidation refs.

No reconstruir memoria desde el modelo.

### Router Adapter
Recuperar:
- recurso seleccionado;
- health observado;
- routing decision ref;
- fallback usado, si existe.

### Agent Task
Recuperar:
- TaskContract;
- input fingerprint;
- attempt;
- strategy_id;
- AgentResult/validation result.

### Validator/Judge
Recuperar:
- schema result;
- evidence checks;
- critical GAPs;
- coverage;
- verdict.

### Consolidator
Recuperar:
- hechos;
- decisiones;
- evidencia;
- dependencias;
- conflictos;
- IntegrationState.

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

## Fuente de método replicado
Patrón recuperado desde el Wordflow Yaiwes original:
https://github.com/maxbry123-commits/agentes/tree/main/%E2%9E%A1%EF%B8%8F%F0%9F%93%82%20Wordflow%20LOOP%20Yaiwes

No copiar estado histórico del proyecto fuente como si fuera estado de UI YAIWES; solo se replica el método de recuperación.
