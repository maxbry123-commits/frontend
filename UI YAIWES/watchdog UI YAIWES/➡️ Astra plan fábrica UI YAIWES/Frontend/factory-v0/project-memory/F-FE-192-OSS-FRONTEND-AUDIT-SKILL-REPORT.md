# F-FE-192 — frontend-audit-skill bounded QA adapter — REPORT

- Node: `F-FE-192-OSS-FRONTEND-AUDIT-SKILL`
- Segment: `SEG-10-OSS`
- Verdict: `PASS_RELEASED`
- Qualification: `QA_VISUAL_POLICY_BROWSER_PASS / NOT_PRODUCT_WIRED`
- Product patched: **NO**
- Candidate wiring: **NO**

## Source truth / bounded reuse
- Extracted donor commit: `3e035c4675ed3d00430e9934d60948b890cfe6c6`
- Donated ideas only: semantic locator preference, visual measurement gate, exact candidate binding.
- Explicitly omitted: autonomous CSS mutation, dependency installer, OmniParser, model weights and any second visual/editor runtime.
- Playwright already exists in Factory, so no browser/test framework was added.

## Delta
- Adapter: `src/oss/frontend-audit-qa-v1.js`
- Adapter commit: `590583cea6490f9d9adfff171369368c434a2c08`
- Adapter runner blob: `92d0f46b1cf306912645cfab3065ee573bb38e6d`
- Test: `tests/e2e/oss/f-fe-192-frontend-audit-skill.spec.mjs`
- Test commit: `fae1538280f7859b0c8c3fdf47c5e4346b79aadc`
- Test runner blob: `db0722d2ed488cafefba22c8e5ca4a58f4dfadfb`
- Workflow: `.github/workflows/factory-f-fe-192-frontend-audit-skill.yml`
- Tested SHA / workflow commit: `1b67447e1dae6961baf03c5bb3bb74a31c2b02e5`

The adapter enforces semantic locators (`role+name`, `testId`, text), rejects brittle CSS/class selectors, requires an exact 40-char candidate SHA and viewport, bounds diff tolerances, fails on candidate SHA drift, critical console errors or failed requests, and never authorizes product mutation.

## Trusted CI evidence
- Run: `34850633072`
- Job: `103997389520`
- Conclusion: `success`
- Desktop Chromium: `3 passed`
- Mobile Chromium / Pixel 7 profile: `3 passed`
- Browser test proves two stable screenshots compare equal, a real style mutation changes screenshot bytes, semantic locator policy is enforced, SHA drift fails closed and invalid tolerance/viewport fail closed.
- Readback/syntax/hash step: PASS.

## Boundary
This node does not claim that a production design baseline exists or that the current candidate visually matches an external design. It proves a bounded reusable QA policy and browser measurement path. Candidate-specific visual baselines and any resulting UI fixes remain separate QA/GAP/fix nodes; only SEG-11 may compose a candidate.
