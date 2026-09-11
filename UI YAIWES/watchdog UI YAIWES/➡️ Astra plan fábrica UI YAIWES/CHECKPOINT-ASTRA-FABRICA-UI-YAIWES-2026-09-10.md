# CHECKPOINT — ➡️ Astra plan fábrica UI YAIWES

Fecha base: 2026-09-10
Corrección forense: 2026-09-11 UTC
Contrato: tel.workflow/v3
Modo: FAIL_CLOSED_LOOP

## Estado corregido

T1_FACTORY_FRONTEND: `CLOSED_UNVERIFIED / ACTIVE_LOOP`.
T2_INTERFACE_YAIWES: `BLOCKED_UNTIL_T1_VERIFIED_CLOSED`.

La marca previa `VERIFIED_CLOSED` se reabre porque los Jobs de Hugging Face probaron runtime/E2E, pero no existía una web persistente accesible por el Director. El criterio correcto exige URL visible + read-back HTTP + smoke E2E sobre la URL desplegada.

## Evidencia que sigue válida

- Factory V0 fuente presente y leída.
- Logic test: PASS 6/6.
- E2E desktop + mobile: PASS 14/14.
- Responsive gate: PASS.
- Independent verifier: PASS.
- Playwright v1.55.0, source commit `f992162f04ae0b0b5a0f4b6114b894215be98995`, Apache-2.0.

Jobs:
- https://huggingface.co/jobs/COMAND-CENTER-1/6aa35ce55527934177ec3f9e
- https://huggingface.co/jobs/COMAND-CENTER-1/6aa35d1521047bf1b037477c
- https://huggingface.co/jobs/COMAND-CENTER-1/6aa35d4e5527934177ec3fba

## Nuevo StrategyDelta ejecutado

Se creó bundle de despliegue Hugging Face Space en:
`Frontend/factory-v0/hf-space/`

Archivos:
- `Dockerfile`
- `README.md` con metadata de Space Docker, puerto 7860 y fuente canónica.

Smoke de despliegue ejecutado en Hugging Face Job:
https://huggingface.co/jobs/COMAND-CENTER-1/6aa398225527934177ec4c49

Resultado observado:
`DEPLOY_BUNDLE_SMOKE=PASS HTTP=200 BYTES=1856`
Job: `COMPLETED`.

Esto demuestra que el bundle sirve la web correctamente dentro del runtime, pero NO sustituye publicación persistente.

## Auditoría forense nueva

`AUDITORIA-FORENSE-XRAY-CIERRE-WEB-2026-09-11.md`

Veredicto: la declaración anterior de 100% fue incorrecta para el objetivo completo visible.

## GAPs actuales

1. `PERSISTENT_WEB_PREVIEW_NOT_PUBLISHED`
2. `HF_SPACE_WRITE_SCOPE_UNAVAILABLE_IN_CURRENT_CONNECTOR`
3. `DEPLOYED_URL_HTTP_READBACK_PENDING`
4. `DEPLOYED_URL_E2E_SMOKE_PENDING`
5. `PRODUCT_FACTORY_PATH_HANDOFF_NOT_EXPLICIT`

La conexión Hugging Face disponible está autenticada como `COMAND-CENTER-1`, pero expone scopes `jobs/openid/profile/read-mcp/read-repos`; no expone write/create-Space. Por eso el Space no puede publicarse desde este conector actual sin falsear ejecución.

## Punto exacto de reanudación

`P4D_PERSISTENT_WEB_PREVIEW_PUBLISH_AND_VERIFY`

Cadena pendiente:
`publish Space/app -> URL persistente -> HTTP 200/read-back -> smoke E2E sobre URL -> evidencia -> reviewer independiente -> VERIFIED_CLOSED`.

## Regla final

`SOURCE_PRESENT != WIRED != RUNTIME_TEST_PASS != DEPLOYED_VISIBLE != VERIFIED_CLOSED`.
