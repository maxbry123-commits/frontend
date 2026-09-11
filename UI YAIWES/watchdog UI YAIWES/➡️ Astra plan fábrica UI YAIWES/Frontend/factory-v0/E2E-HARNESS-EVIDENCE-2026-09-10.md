# E2E HARNESS EVIDENCE — YAIWES Factory V0

Identity: `➡️ Astra plan fábrica UI YAIWES`
Gate: `T1_FACTORY_FRONTEND`
Status: `READY_TO_RUN / NOT_YET_EXECUTED`

## Source donor

- Donor: Playwright
- Upstream: https://github.com/microsoft/playwright
- Pinned test package: `@playwright/test ^1.55.0`
- Upstream tag: `v1.55.0`
- Upstream source commit for tag: `f992162f04ae0b0b5a0f4b6114b894215be98995`
- Local donor path: `UI YAIWES/componentes open soure UI YAIWES/Playwright/`
- Local license: Apache License 2.0, verified by read-back from local `LICENSE`.

## Materialized harness

- `package.json`: adds `test:e2e` and Playwright dependency.
- `playwright.config.mjs`: Chromium desktop + Pixel 7 mobile profiles, static local server, trace and failure screenshots.
- `tests/e2e/factory.e2e.spec.mjs`: browser scenarios.

## Covered scenarios

1. Navigate all five factory steps with bounded first/last step behavior.
2. Create/select/edit a component through visual UI.
3. Drag/drop a library component onto canvas.
4. AI Assist proposes a non-canonical delta; state changes only after explicit apply.
5. Undo/redo + V+ save.
6. JSON export download.
7. Same suite declared for desktop Chromium and mobile Chromium profile.

## Evidence boundary

`HARNESS_PRESENT != E2E_PASS`.

No PASS is declared. A real browser run is still required. The current Astra write ownership does not include `.github/workflows/`, so this worker did not create or mutate a GitHub Actions workflow merely to manufacture a PASS.

## Required execution command in an authorized runner

```bash
cd "UI YAIWES/watchdog UI YAIWES/➡️ Astra plan fábrica UI YAIWES/Frontend/factory-v0"
npm install
npx playwright install --with-deps chromium
npm run test:logic
npm run test:e2e
```

Promotion requires retained logs/report and read-back; only then can `visual_preview_e2e_pass` become true.
