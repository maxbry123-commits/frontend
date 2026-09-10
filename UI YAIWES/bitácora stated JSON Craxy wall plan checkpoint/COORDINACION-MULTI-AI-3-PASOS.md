# COORDINACIÓN MULTI-AI — CRAZY WALL — 3 PASOS

Este archivo es un gate aditivo de coordinación. NO reemplaza STATE.json, CHECKPOINT.json ni BITACORA-CRAZY-WALL.md.

Antes de cualquier ejecución ASTRA/CLAUDE/GROK/SOL:
1. leer `STATE.json` fresco;
2. leer `CHECKPOINT.json` fresco;
3. leer `BITACORA-CRAZY-WALL.md` fresco;
4. leer el Handoff multi-IA;
5. no tocar nodos/raíces reclamados por otra IA;
6. reclamar un único nodo libre con owner/lock/checkpoint.before;
7. ejecutar solo el paso actual;
8. evidence + checkpoint.after + PASS/GAP + release.

Contrato autorizado único:
`PASO 1 ANALIZAR A/B/C + DESTINO -> PASO 2 MOVER CON MOTOR CANÓNICO -> PASO 3 CABLEAR + PODA MÍNIMA SI HACE FALTA + MICROTEST`

No existe Paso 4. Todo trabajo lateral que no soporte directamente uno de esos tres pasos está NO AUTORIZADO.

Handoff vigente:
`UI YAIWES/readme arquitectura UI YAIWES/HANDOFF-MULTI-AI-3-PASOS-ASTRA-CLAUDE-GROK-SOL-2026-09-10.md`

Recovery vigente:
`UI YAIWES/readme arquitectura UI YAIWES/PARCHE-RECUPERACION-MULTI-AI-3-PASOS-2026-09-10.md`

Regla de versión: nunca destruir una versión funcional; mejora = v+1/delta modular + microtest + promoción solo tras PASS.
