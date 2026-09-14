# F-FE-068 — MOBILE FIT — PASS RELEASE EVIDENCE

Date: 2026-09-14
Node: `F-FE-068-MOBILE-FIT`
Segment: `SEG-01-SHELL`
Producer: `GPT-5.6-SOL`
Mode: `FAIL_CLOSED_LOOP`

## Result

`PASS_RELEASED_READY`

The reproduced V1.9.5 mobile horizontal overflow (`body.scrollWidth=604` at a 412px viewport) was corrected in the isolated versioned shell stylesheet without editing frozen entrypoints or hiding root overflow as a cosmetic workaround.

## Delta

- Product: `Frontend/factory-v0/workspace-shell-v3.css`
- Focused gate: `Frontend/factory-v0/tests/e2e/f-ui-068-mobile-fit.spec.mjs`
- Final product commit: `7b1c57267d37646454e4541a0cfbf882a3819eb4`
- Product blob read back by CI: `0ee1ed8d4fcf81c0bbdb64c9d861d6fcf39b50f5`
- Test blob read back by CI: `478d6cd327b98c5cd6d0119b10ffdb6d28ef70ce`

Root causes fixed:
1. base bottom-bar intrinsic nowrap width exceeded the mobile viewport;
2. top steps/mode controls could retain intrinsic horizontal width;
3. canvas toolbar controls, including breakpoint, zoom reset and FitView, remained in an oversized horizontal row.

StrategyDelta: constrain intrinsic widths and lay mobile controls out using bounded grids/wrapping. `html/body` are not set to `overflow-x:hidden/clip`.

## Harness correction

The first focused run failed before geometry because the test read `data-workspace-shell` from `documentElement` although Shell V2 writes it to `.app-shell`. The selector was corrected in commit `95bcfbf3c2e551b7564044aace49b7f1548439f0`; no product behavior was changed by that harness fix.

## Final runtime evidence

Workflow: `Factory F-FE-068 Mobile Fit Gate`
Run: `34837590449`
Job: `103954867553`
Artifact: `10344608599`
Artifact SHA256: `ea8f70e1c8f06378780dbd294f59f389666553b3e27459c9156cbf1a00b4a625`

Focused Playwright: **4/4 PASS**.

- 390px: `htmlScrollWidth=390`, `bodyScrollWidth=390`, `offenders=[]`.
- 412px: `htmlScrollWidth=412`, `bodyScrollWidth=412`, `offenders=[]`.
- root overflow was not hidden/clipped;
- left/right drawers remained usable and Escape closed the right drawer;
- canvas remained visible;
- all five bottom actions remained inside the viewport with touch height >=44px.

## Scope / promotion

This is a producer-segment PASS only. It does not modify/promote the candidate entrypoint. `SEG-11-INTEGRATOR` must wire the released shell version into a later candidate and retest that exact candidate. `F-UI-062` independent review and `F-UI-063` remain required for final frontend closure.
