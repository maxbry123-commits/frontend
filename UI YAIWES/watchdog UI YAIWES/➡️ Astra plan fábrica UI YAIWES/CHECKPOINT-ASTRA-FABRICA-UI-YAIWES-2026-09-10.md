# CHECKPOINT — ➡️ Astra plan fábrica UI YAIWES

Fecha base: 2026-09-10
Corrección forense: 2026-09-11 UTC
Contrato: tel.workflow/v3
Modo: FAIL_CLOSED_LOOP

## Estado corregido

T1_FACTORY_FRONTEND: `CLOSED_UNVERIFIED / ACTIVE_LOOP`.
T2_INTERFACE_YAIWES: `BLOCKED_UNTIL_T1_VERIFIED_CLOSED`.

La marca previa `VERIFIED_CLOSED` permanece reabierta porque los Jobs de Hugging Face probaron runtime/E2E, pero no existe todavía una web persistente accesible por el Director. El criterio correcto exige URL visible + read-back HTTP + smoke E2E sobre la URL desplegada.

## Evidencia válida

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

## StrategyDelta 1 — Hugging Face Space bundle

Bundle:
`Frontend/factory-v0/hf-space/`

Smoke:
https://huggingface.co/jobs/COMAND-CENTER-1/6aa398225527934177ec4c49

Resultado:
`DEPLOY_BUNDLE_SMOKE=PASS HTTP=200 BYTES=1856`
Job: `COMPLETED`.

HF sigue autenticado como `COMAND-CENTER-1` con scopes `jobs/openid/profile/read-mcp/read-repos`; no expone write/create-Space.

## StrategyDelta 2 — GitHub preview branch

Se intentó consultar el endpoint GitHub Pages mediante el conector GitHub autorizado; el endpoint Pages no está permitido por el conector (`INVALID_ARGUMENT`).

Se creó una alternativa reversible sin tocar `main` productivo:
- rama: `astra-factory-preview`
- base: commit `02cf1677a7326991794cfd149b54051c0b77d238`
- payload mínimo Factory V0 copiado a raíz de la rama:
  - `index.html`
  - `styles.css`
  - `src/app.js`
  - `src/actions.js`
  - `src/state.js`
- HEAD de la rama después de materialización: `bb470f7fd51e5d2c1f7fd3ddd5d3c888156365b3`

Esto prepara una fuente compatible con Pages pero NO prueba que Pages esté habilitado ni crea por sí solo una URL persistente.

Documento StrategyDelta:
`Frontend/factory-v0/GITHUB-PAGES-STRATEGYDELTA-2026-09-11.md`

## GAPs actuales

1. `PERSISTENT_WEB_PREVIEW_NOT_PUBLISHED`
2. `HF_SPACE_WRITE_SCOPE_UNAVAILABLE_IN_CURRENT_CONNECTOR`
3. `GITHUB_PAGES_CONFIGURATION_ENDPOINT_UNAVAILABLE_IN_CURRENT_CONNECTOR`
4. `DEPLOYED_URL_HTTP_READBACK_PENDING`
5. `DEPLOYED_URL_E2E_SMOKE_PENDING`
6. `PRODUCT_FACTORY_PATH_HANDOFF_NOT_EXPLICIT`

## Punto exacto de reanudación

`P4D_PERSISTENT_WEB_PREVIEW_PUBLISH_AND_VERIFY`

Cadena pendiente:
`publish Space/Pages/app -> URL persistente -> HTTP 200/read-back -> smoke E2E sobre URL -> evidencia -> reviewer independiente -> VERIFIED_CLOSED`.

## Regla final

`SOURCE_PRESENT != WIRED != RUNTIME_TEST_PASS != DEPLOYED_VISIBLE != VERIFIED_CLOSED`.
