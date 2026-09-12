# README arquitectura — cierre T1 Factory UI — 2026-09-12

Contrato: `tel.workflow/v3`
Estado certificado: `T1_FACTORY_FRONTEND=VERIFIED_CLOSED`

## Evidencia canónica
- Factory source SHA: `8d5a7ed86f9af517b0d42f5aad9e2f7359edd7f0`
- Hugging Face Space: `COMAND-CENTER-1/yaiwes-ui-factory`
- HF commit desplegado: `9aa43978497e9bd9fba9d9ecea11ac8e83b01764`
- Hub: `https://huggingface.co/spaces/COMAND-CENTER-1/yaiwes-ui-factory`
- App real del Static Space: `https://comand-center-1-yaiwes-ui-factory.static.hf.space/`
- Workflow run PASS: `https://github.com/maxbry123-commits/frontend/actions/runs/34678920062`
- Auth publish: GitHub Actions Trusted Publisher/OIDC, repo-scoped al Space. No se certifica full-account access.
- HTTP read-back del app: 200 + marcador `YAIWES UI Factory`.
- Deployed E2E: 14/14 desktop+mobile PASS, job `https://huggingface.co/jobs/COMAND-CENTER-1/6aa4f4f15527934177ecd6c9`.
- Independent deployed verifier: PASS, job `https://huggingface.co/jobs/COMAND-CENTER-1/6aa4f52221047bf1b037b603`.

## Resolución del 404
El hostname histórico `https://comand-center-1-yaiwes-ui-factory.hf.space/` no era el host asignado por la API del Static Space. La metadata del Hub reporta `host=https://comand-center-1-yaiwes-ui-factory.static.hf.space`, `sdk=static`, `private=false`, `runtime.stage=RUNNING`.

El workflow ahora descubre `meta.host` por API en vez de construir manualmente el hostname.

## Package vigente
El paquete publicado se genera desde el SHA verificado e incluye 8 archivos:
`README.md`, `index.html`, `styles.css`, `src/app.js`, `src/actions.js`, `src/state.js`, `src/backend-adapter.js`, `src/donors/lucide-icons.js`.

## Gate siguiente
Con T1 cerrado, T2 `UI YAIWES interface` puede activarse únicamente respetando Crazy Wall/ownership y la instrucción del Director. Raíces solicitadas para T2: `UI YAIWES interface/Fromtend/` y `UI YAIWES interface/Backend/`. `Backend/` recibe donors/staging y no invade backend productivo de Sol sin handoff.