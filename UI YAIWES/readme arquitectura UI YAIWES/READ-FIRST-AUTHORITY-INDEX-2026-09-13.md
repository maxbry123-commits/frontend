# UI YAIWES — READ FIRST / ÍNDICE DE AUTORIDAD

Contrato: `tel.workflow/v3` · modo `FAIL_CLOSED_LOOP` · política: **no borrar evidencia histórica; clasificarla**.

## 1. Orden de lectura obligatorio
1. `UI YAIWES/Readme arquitectura UI YAIWES.md` — visión/entrada de producto.
2. `ARQUITECTURA-PROGRAMACION-CONSOLIDADA-UI-YAIWES.md` — arquitectura transversal consolidada.
3. `ARQUITECTURA-WORDFLOW-PYTHON-DSL-DAG-96-4-V7-2026-09-12.md` — Wordflow Python DSL/DAG y límites 96/4.
4. `HANDOFF-DYNAMIC-NODES-UI-YAIWES-V8-2026-09-12.md` + handoff más reciente aplicable.
5. `CRAZY-WALL-TASK-NODES-DYNAMIC-V5-2026-09-12.json` + `CRAZY-WALL-EXTENSION-N34-N35-2026-09-13.json`.
6. `CONTRATO-MAESTRO-FORENSE-XRAY-50-GOALS-UI-YAIWES.md`.
7. Reports/runs/logs y código/tests frescos de `main`.

## 2. Fuentes funcionales efectivas que deben cruzarse
- S1 `📌MAX-SYSTEM-100X-FINAL-1.md`.
- S2 `📌👨‍💻 ULTIMA VERSIÓN ... 14 objetivos...md`.
- S3 `🤯🗃️memoria del Wordflow ...md`.
- S4 `📌👨‍💻➡️TAREA comand Center Fase 1 2 3 de deepseck ...md`.

**GAP abierto:** N01/N02/N30 usaron sólo S1/S2/S3. N34 debe recalcular el denominador con S4 antes de certificar todas las RequirementTrace.

## 3. Clasificación documental
- **CANONICAL/ACTIVE:** documentos del orden de lectura anterior, Crazy Wall/extension vigentes, código/tests y evidencia CI fresca.
- **ACTIVE DELTA:** reportes/nodos actuales y handoffs del día que tengan SHA/readback verificable.
- **HISTORICAL EVIDENCE:** deltas P01/P02/etc., handoffs antiguos, recovery patches, debates y auditorías previas. Se conservan para provenance, pero nunca vencen a código/tests actuales.
- **CATALOG/DONOR:** `README.md` de componentes y documentos de integración modular. Presencia/listado no significa wiring.
- **PLACEHOLDER:** archivos/directorios vacíos o `.gitkeep`; no cuentan como implementación.
- **TEMPORARY:** workflows/claim markers one-shot; se eliminan después de cumplir su propósito si no son evidencia necesaria.

## 4. Regla para reducir ruido
No crear un nuevo README/Handoff si basta un reporte o delta. No duplicar arquitectura. No copiar requisitos ya existentes. Cada archivo nuevo debe declarar: `purpose`, `authority`, `supersedes/extends`, `node`, `evidence`, `remaining_gaps`.

## 5. Verdad de cierre
`SOURCE_PRESENT != IMPLEMENTED != WIRED != RUNTIME_TEST_PASS != VERIFIED_CLOSED`.
La frase de una LLM, un porcentaje histórico o un repo descargado nunca cierran una capability.

## 6. Cierre global requerido
`denominador completo 4 fuentes → implementation/wiring → tests → trusted CI/evidence → RequirementTrace → recovery/security/E2E → 12 GOALS → Council12 → Final Judge → VERIFIED_CLOSED`.
