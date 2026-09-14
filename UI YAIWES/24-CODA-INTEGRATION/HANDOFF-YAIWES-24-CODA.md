# HANDOFF — YAIWES 24 CODA

Origen canónico: `maxbry123-commits/agentes`, `📂coda workflow persistencias/`.

## Objetivo
Usar ocho capacidades seleccionadas (08, 11, 12, 15, 16, 21, 22, 23) como soporte del workflow UI YAIWES, preservando la arquitectura global de 24 CODA en el repo de agentes.

## Contrato
`UI task → queue/steering → memory → supervisor/executor → learned patterns → phase orchestration → DAG scheduler → memory hygiene → plan/observe/summarize → result`

Los componentes copiados son referencias de integración y no se activan automáticamente. Cualquier conexión externa debe usar API/MCP autorizado. La ejecución debe permanecer acotada a tareas benignas del proyecto UI.

## Estrategia
- 08: steering/cola de directivas.
- 11: memoria incremental y detección de repetición.
- 12: loop durable supervisor/executor y recuperación.
- 15: memoria SQLite/patrones; incluye reparación de lectura de sesión de una sola fila.
- 16: máquina de estados por fases.
- 21: selección DAG por dependencias y prioridad.
- 22: higiene de anchors/memoria.
- 23: ciclo planificar→observar→resumir→evaluar.

## Cola + paralelo
La cola decide trabajos independientes. Los trabajos independientes pueden ejecutarse en ramas paralelas; cada rama conserva su orden causal y writer único. El fan-in selecciona resultados por evidencia, tests y estado terminal, no por voto no verificado.

## Activación futura
Frontend debe envolver estas capacidades con adapters explícitos. No ejecutar automáticamente código importado solo por estar presente. Mantener provenance del origen y validar hashes de la copia.
