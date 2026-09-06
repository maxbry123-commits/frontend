# 00_METODO_TRABAJO_Y_ARQUITECTURA — UI YAIWES

Estado: CANONICAL BRIDGE / FAIL-CLOSED
Contrato: `tel.workflow/v3`

Este método replica el patrón canónico de YAIWES y lo adapta al backend de `frontend/UI YAIWES/` sin crear una arquitectura paralela.

## Fuentes que gobiernan
1. `UI YAIWES/Readme arquitectura UI YAIWES.md`
2. `UI YAIWES/➡️📂 Wordflow LOOP UI YAIWES/HANDOFF.md`
3. `Crazy Wall Orquestador/STATE.json`
4. `Crazy Wall Orquestador/CHECKPOINT.json`
5. `Crazy Wall Orquestador/RECOVERY-PATCH.md`
6. `Crazy Wall Orquestador/BITACORA-CRAZY-WALL.md`
7. documentos/componentes exactos del nodo activo.

Fuente histórica recuperada:
https://github.com/maxbry123-commits/agentes/blob/8024e57606cedc34592ef18b3565c624b1e6d676/PIPELINE/00_METODO_TRABAJO_Y_ARQUITECTURA.md

## Cadena obligatoria
`GOALS/INPUT literal ➡️ prioridades ➡️ plan ➡️ cola 1×1 ➡️ SHERIFF ➡️ VALIDATOR ➡️ RESEARCH ➡️ RANK ➡️ EXECUTE delta ➡️ VERIFY/REFUTE ➡️ GAP? LOOP : CHECKPOINT ➡️ CODA ➡️ verify_final`

## Principios
- 1 instrucción literal = 1 nodo.
- `REUSE > COPY/MOVE > PATCH PEQUEÑO > ADAPTER > GENERATE DELTA`.
- Stabilize CORE es el único owner del workflow.
- Router/Memory existentes se adaptan; no se duplican.
- LLM no declara PASS.
- GitHub = fuente operativa del repo.
- Archivo presente ≠ integrado.
- Secrets solo como `secret_ref`.
- Todo cambio real conserva rollback/evidencia.

## Roles
- Director: autoridad de objetivo/destino/autorización.
- ChatGPT/Sol: arquitectura, integración backend, X-Ray, reconciliación y verificación.
- Codex: tareas de código/descarga/integración acotadas según contrato.
- Grok: frontend visual.
- Stabilize: runtime durable, no autoridad semántica final.
- Rule/Judge: decide transitions de negocio según reglas y evidencia.

## Cierre
Solo `VERIFIED_CLOSED` con evidencia reproducible; falta de fuente, contrato, wiring, test o evidencia = `GAP`.
