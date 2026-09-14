# F-FE-215 — FOCUS RESTORE MATRIX — GAP

- Contract: `tel.workflow/v3`
- Candidate: `index-v192.html`
- QA-only node: no product patch authorized.
- Test commit / tested SHA: `636991d4d2f40b4249ab9d3d8564fe3a73f2f078`
- Run: `34851158701`
- Job: `103999160462`
- Artifact: `10350177781`
- Artifact digest: `sha256:51217beaf183b0f6559ef097ab453572a0d2c165a1e9fb9ea5e7e45f4c7722eb`

## Reproduced GAP

`workspace-shell-v1.js` collapses drawers from their internal close button but does not restore focus to the deterministic invoker.

Mobile Playwright reproduced both directions:

- left/Biblioteca: after close, `document.activeElement` became `BODY`; `[data-workspace-toggle="left"]` was not focused.
- right/Inspector: after close, `document.activeElement` became `BODY`; `[data-workspace-toggle="right"]` was not focused.

Both assertions failed intentionally. Document/script requests remained loadable; the failure is the focus contract itself.

## Classification

- State: `GAP_RESOLVABLE`
- Gap type: `MISSING_WIRING`
- Owner segment: `SEG-01-SHELL`
- Existing planned fix owner: `F-FE-174-SHELL-FOCUS-INERT` (restore focus on drawer close + inert/aria-hidden correctness).
- Strategy: do not patch from QA. Producer node must implement a versioned shell delta and rerun focused mobile + keyboard regression before SEG-11 integration.

`SOURCE_PRESENT != IMPLEMENTED != WIRED != RUNTIME_TEST_PASS != VERIFIED_CLOSED`
