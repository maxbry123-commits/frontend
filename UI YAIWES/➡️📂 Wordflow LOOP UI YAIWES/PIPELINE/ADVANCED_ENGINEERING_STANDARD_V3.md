# ADVANCED_ENGINEERING_STANDARD_V3 — UI YAIWES

Estado: CANONICAL BRIDGE / PRODUCTION
Contrato: `tel.workflow/v3`

Fuente histórica recuperada:
https://github.com/maxbry123-commits/agentes/blob/7bc798ad4173f39f758abd3d4e6cbc2d909658e6/PIPELINE/ADVANCED_ENGINEERING_STANDARD_V3.md

## Calidad mínima
Backend de producción. MVP degradado solo con autorización literal del Director.

## Reglas de implementación
- `REUSE > COPY/MOVE > PATCH PEQUEÑO > ADAPTER > GENERATE DELTA`.
- No rediseñar arquitectura global dentro de una task.
- Un owner del workflow: Stabilize CORE.
- Contratos Pydantic versionados.
- Idempotencia, timeout/deadline, errores explícitos, observabilidad, rollback y trazabilidad.
- Secrets solo por referencias protegidas.
- Candidate code se inspecciona antes de ejecutar; sandbox/aislamiento cuando aplique.
- Router/Memory deben conservar interfaces separadas del runtime.

## Gates
`INPUT ➡️ TaskContract ➡️ Sheriff/Policy ➡️ Validator ➡️ Stabilize Execute ➡️ Test/Verify ➡️ Sentinel/Watchdog ➡️ Judge ➡️ Evidence ➡️ Checkpoint`

## Tests mínimos
Según aplique:
- unit;
- schema/contract;
- integration;
- regression;
- recovery;
- stateful/invariant;
- E2E.

## Invariantes
1. No verified claim sin evidencia.
2. No canonical update tras validación fallida.
3. No COMPLETE con critical GAP.
4. Retry cognitivo no puede repetir exactamente el mismo fingerprint/delta fallido.
5. Recovery debe continuar desde estado durable coherente.
6. Frontend no gobierna el workflow.
7. LLM no gobierna el workflow.
8. Observabilidad no gobierna el workflow.

## Deploy
Decisiones de despliegue deterministas: plan/dry-run cuando aplique, commit/push, read-back y evidence. No declarar deploy solo por escritura local.

## Cierre
`VERIFIED_CLOSED` exige evidencia reproducible; cualquier ausencia crítica devuelve `GAP` y recovery.
