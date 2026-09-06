# HANDOFF — Wordflow LOOP UI YAIWES

## ABRIR PRIMERO
Punto de entrada para Codex/GPT que continúe el backend de `frontend/UI YAIWES/`.

## CONTRATO
- Contrato: `tel.workflow/v3`
- Modo: `FAIL_CLOSED_LOOP`
- Owner del workflow: `Stabilize CORE`
- Frontend visual: fuera de este backend; Grok lo trabaja por separado.
- Router: existente, se adapta.
- Memory: existente, se adapta.

## ORDEN DE LECTURA
1. `UI YAIWES/README arquitectura UI YAIWES.md`
2. este `HANDOFF.md`
3. `Crazy Wall Orquestador/STATE.json`
4. `Crazy Wall Orquestador/CHECKPOINT.json`
5. `Crazy Wall Orquestador/RECOVERY-PATCH.md`
6. `Crazy Wall Orquestador/BITACORA-CRAZY-WALL.md`
7. `PIPELINE/00_METODO_TRABAJO_Y_ARQUITECTURA.md`
8. `PIPELINE/FORENSIC_CODE_AUDIT.md`
9. `PIPELINE/ADVANCED_ENGINEERING_STANDARD_V3.md`
10. documentos y componentes exactos del nodo activo.

## CADENA OBLIGATORIA
`INPUT literal ➡️ SHERIFF ➡️ VALIDATOR ➡️ RESEARCH(chat→código→comunidad→filtra→dedup→rank+URL) ➡️ EXECUTE(delta autorizado) ➡️ SENTINEL ➡️ VERIFY ➡️ JUDGE ➡️ CODA ➡️ verify_final`

Si falla:
`GAP ➡️ persistir evidencia/checkpoint/estrategia fallida ➡️ RESEARCH ➡️ delta distinto ➡️ mismo nodo`

## PRECEDENCIA
No fusionar contradicciones silenciosamente. La instrucción literal más reciente del Director gobierna el nodo activo, preservando las restricciones superiores del proyecto y seguridad.

## CIERRE
`VERIFIED_CLOSED` solo con evidencia reproducible. Archivo presente ≠ integrado. Documento aprobado ≠ runtime probado.

## FUENTE REPLICADA
Arquitectura de trabajo tomada de:
https://github.com/maxbry123-commits/agentes/tree/main/%E2%9E%A1%EF%B8%8F%F0%9F%93%82%20Wordflow%20LOOP%20Yaiwes

Métodos históricos canónicos recuperados por commit cuando `main` no los expone.
