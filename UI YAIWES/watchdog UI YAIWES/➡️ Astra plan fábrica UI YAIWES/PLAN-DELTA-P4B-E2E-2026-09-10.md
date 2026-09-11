# PLAN DELTA — P4B E2E

Identity: `➡️ Astra plan fábrica UI YAIWES`
Parent plan: `PLAN-ASTRA-FABRICA-UI-YAIWES.md`
Gate: `T1_FACTORY_FRONTEND`

## Current node

`P4B_FACTORY_V0_VISUAL_PREVIEW_E2E`

## Delta

1. Reuse local Playwright donor; do not add a second browser framework.
2. Browser harness is now materialized for desktop Chromium and mobile Chromium.
3. Required scenarios: five-step navigation, visual create/edit, drag/drop, AI delta proposal/apply boundary, undo/redo, V+, export.
4. Do not promote `visual_preview_e2e_pass` until browser execution returns logs/report.
5. Do not write `.github/workflows/` because current T1 Astra ownership excludes that path.
6. While browser runner is blocked, continue safe task: donor source URL + tag/commit + license traceability.
7. T2 remains blocked.

## Exit gate P4B

- `npm run test:logic` PASS;
- `npm run test:e2e` PASS on desktop + mobile profile;
- retained report/log;
- read-back of evidence;
- no console/runtime fatal error.

Then proceed to donor wiring and independent review; never jump directly to T2.
