# T1 VERIFIED_CLOSED — Hugging Face evidence — 2026-09-12

Owner producer: `➡️ Astra plan fábrica UI YAIWES`
Reviewer boundary: independent stateless Hugging Face verification job.
Contract: `tel.workflow/v3`

## Source under test
- GitHub factory source SHA: `8d5a7ed86f9af517b0d42f5aad9e2f7359edd7f0`
- Lucide donor upstream: `https://github.com/lucide-icons/lucide`
- Lucide donor source commit: `a53bd66a03dfd5609c3638379869e83dc207b051`
- Factory local deterministic logic: PASS 6/6
- Current-head local/runtime E2E before deploy: PASS 14/14

## Publish
- Workflow: `.github/workflows/astra-hf-static-space-publish.yml`
- Workflow fix commit: `5965012cff4fd68131dcd4bc14fb9f87ecaadfe2`
- Workflow run: `https://github.com/maxbry123-commits/frontend/actions/runs/34678920062`
- GitHub Actions auth selected: `OIDC`
- OIDC resource: `spaces/COMAND-CENTER-1/yaiwes-ui-factory`
- HF upload result: PASS
- HF Space commit: `9aa43978497e9bd9fba9d9ecea11ac8e83b01764`
- Package files: 8
- Package verify: PASS

## Root-cause resolution of historical 404
The failed URL `https://comand-center-1-yaiwes-ui-factory.hf.space/` was not the host assigned by the current Static Space runtime.
The Hugging Face Space API reports:
- sdk: `static`
- private: `false`
- runtime.stage: `RUNNING`
- subdomain: `comand-center-1-yaiwes-ui-factory`
- host: `https://comand-center-1-yaiwes-ui-factory.static.hf.space`

Correct persistent app URL:
`https://comand-center-1-yaiwes-ui-factory.static.hf.space/`

Read-back:
- Hub page HTTP 200: PASS
- Static host HTTP 200: PASS
- Marker `YAIWES UI Factory`: PASS

## Deployed E2E
Job: `https://huggingface.co/jobs/COMAND-CENTER-1/6aa4f4f15527934177ecd6c9`
Result: `14 passed (6.4s)` desktop + mobile.
Marker: `DEPLOYED_HF_E2E=PASS`.

Covered deployed operations:
- five-step navigation
- create/select/edit component
- component library interaction
- AI Assist proposed delta + explicit apply
- undo/redo + save V+
- JSON export
- responsive/no horizontal overflow

## Independent deployed verifier
Job: `https://huggingface.co/jobs/COMAND-CENTER-1/6aa4f52221047bf1b037b603`
Result: `INDEPENDENT_DEPLOYED_VERIFIER=PASS`.
Verified independently:
- HF API HTTP 200
- sdk static
- public visibility
- runtime RUNNING
- HF commit equals `9aa43978497e9bd9fba9d9ecea11ac8e83b01764`
- root HTTP 200 + YAIWES marker
- `src/app.js` HTTP 200 + Lucide import marker
- `src/donors/lucide-icons.js` HTTP 200 + donor source commit marker
- `styles.css` HTTP 200 + app-shell marker

## Closure decision
`SOURCE_PRESENT -> WIRED -> RUNTIME_TEST_PASS -> PERSISTENT_DEPLOY -> HTTP_READBACK_PASS -> DEPLOYED_E2E_PASS -> INDEPENDENT_VERIFIER_PASS`

T1_FACTORY_FRONTEND = `VERIFIED_CLOSED`.

This certification is specific to Factory V0 at source SHA `8d5a7ed...` and deployed HF SHA `9aa4397...`; future source changes require a new verification cycle.