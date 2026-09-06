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

---

## DELTA CONSTITUCIONAL 2026-09-06 — LOOP 1 + LOOP 2

Fuente vigente de reconciliación:
- `maxbry123-commits/agentes/➡️📂 Wordflow LOOP Yaiwes/HANDOFF.md`
- `maxbry123-commits/agentes/➡️📂 Wordflow LOOP Yaiwes/Crazy Wall Orquestador/STATE.json`
- `maxbry123-commits/agentes/➡️📂 Wordflow LOOP Yaiwes/Crazy Wall Orquestador/CHECKPOINT.json`

### LOOP 1 — cadena permanente del proyecto UI YAIWES
1. revisar arquitectura;
2. revisar Crazy Wall + BITÁCORA + STATE + CHECKPOINT;
3. planificar tarea y pasos;
4. registrar pendientes en anclas;
5. ejecutar programación pendiente;
6. buscar componentes necesarios en `UI YAIWES/componentes open soure UI YAIWES` y fuentes oficiales;
7. copiar/mover solo con destino y autorización claros;
8. adaptar/cablear/ejecutar código;
9. registrar cambios + evidencia en anclas;
10. revisar arquitectura y faltantes con GOALS 12/12 + Council12;
11. replanificar;
12. registrar nuevas tareas;
13. repetir hasta cierre verificable.

### LOOP 2 — obligatorio dentro de cada nodo/tarea del LOOP 1
1. INPUT literal sin reinterpretar;
2. dos prioridades;
3. plan;
4. cola 1×1;
5. verificar/refutar; hasta 20 soluciones ante GAP real;
6. analizar y volver al LOOP si falla;
7. auditoría de instrucciones ×3;
8. GAP = no stop, no escalar, no declarar listo;
9. RESEARCH mínimo 10 vías cuando aplique: chat/historial → código oficial/docs → comunidad → filtro → dedup → rank+URL/fecha;
10. PRELUDE fijo → intento → GAP persistido → StrategyDelta distinto → mismo nodo → CODA solo tras PASS;
11. GOALS entrada 12 + GOALS salida 12 + post-output 20 + auditor documento 12 = 56 checks;
12. Ask Council/Consilio 12;
13. C01–C06 de persistencia/CODA;
14. ejecutar solución autorizada;
15. verificar INPUT + LOOP;
16. si falla, reinyección al nodo fallido;
17. tres refutaciones: INPUT, tarea/resultado, cumplimiento LOOP;
18. cross-check global;
19. checklist;
20. CODA;
21. `verify_final` independiente y falsificable.

### GOALS de entrada 12
1. objetivo literal;
2. INPUT + hash/version;
3. alcance;
4. repo/rama/ruta/versión;
5. restricciones;
6. autorización;
7. dependencias;
8. fuentes reales;
9. evidencia admisible;
10. pre/postcondiciones;
11. formato/destino;
12. una instrucción = un nodo.

### GOALS de salida 12
1. contrato ejecutado exactamente;
2. literal/trazabilidad preservados;
3. artefactos válidos;
4. pruebas reproducibles;
5. cross-check chat/docs/archivos/código/logs;
6. contradicciones resueltas o declaradas;
7. ningún cierre por supuesto;
8. URL/versión/SHA/run_id registrados cuando existan;
9. ledger/anclas íntegros;
10. cada GAP reparado y reverificado;
11. formato/instrucciones cumplidos;
12. `12/12 + zero critical gaps + verify_final` habilitan cierre.

### Ask Consilio 12
1. ¿Qué afirmo?
2. ¿Qué evidencia lo demuestra?
3. ¿Qué podría demostrar que estoy equivocado?
4. ¿Estoy mirando la fuente correcta?
5. ¿Ruta/versión coinciden?
6. ¿Existe realmente?
7. ¿Hay otra explicación?
8. ¿Qué dependencia falta?
9. ¿Puedo reproducirlo?
10. ¿Contradice algo?
11. ¿Qué GAP permanece?
12. ¿Qué evidencia permite cerrar?

### C01–C06
- C01: recurrencia conserva INPUT/contrato/nodo/goal sin deriva.
- C02: fallo persiste GAP/checkpoint/evidencia/estrategia fallida antes de retry.
- C03: nuevo intento vuelve a RESEARCH con delta distinto y mismo alcance/nodo.
- C04: CODA solo tras 56 checks + Council12 + 3 refutaciones + cross-check en PASS.
- C05: `verify_final` independiente y falsificable.
- C06: fallo final devuelve `CLOSED_UNVERIFIED|INCONCLUSIVE` y reactiva LOOP; nunca falso PASS.

### Regla de evidencia
Todo claim operacional debe tener evidencia real: ruta/diff/SHA/log/run/test/URL según corresponda. Si no existe evidencia citable: `GAP` o `INCONCLUSIVE`.
