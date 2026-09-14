# F-FE-191 — accessibility-skills QA adapter — REPORT

- Node: `F-FE-191-OSS-ACCESSIBILITY-SKILLS`
- Segment: `SEG-10-OSS`
- Verdict: `PASS_RELEASED`
- Qualification: `QA_ADAPTER_BROWSER_PASS / NOT_PRODUCT_WIRED`
- Product patched: **NO**
- Candidate wiring: **NO**

## Source truth
- Local extracted tree: `📂componentes open soure fromtend/Fromtend code/accessibility-skills/`
- Extraction commit: `0bb892f739f64b7a0183bafeba533b0b7007abd4`
- Source skills used as QA rules: `keyboard`, `touch-pointer`
- Decision: `REUSE_EXTRACTED_SOURCE`; no download, no extraction, no monolith copy.

## Dedup against existing Factory QA
Existing `F-UI-056` already checks accessible names, basic keyboard traversal, Enter/Space on workspace toggle, one mobile 44px target and Escape/no trapped focus.

This node therefore adds only missing reusable QA assertions:
- blocked browser zoom (`user-scalable=no` / restrictive maximum-scale);
- positive `tabindex`;
- unnamed interactive controls;
- custom `role=button` not focusable;
- disabled controls without deterministic reason;
- project-default 44x44 touch target matrix.

## Delta
- Adapter: `src/oss/accessibility-skills-qa-v1.js`
- Adapter commit: `ce3222f05848d02fd5ab91797e2aa471e76a3882`
- Adapter blob from trusted runner: `d6d5d88196823e106fa8f3f9b65b96cee75148e1`
- Initial test commit: `97b604a3bff06cf593fcd40be537428d92e7b0ef`
- Final test: `tests/e2e/oss/f-fe-191-accessibility-skills.spec.mjs`
- StrategyDelta commit: `5f458e13f430d311b589c52e3f071f5e9eb17877`
- Final test blob from trusted runner: `54e6f1464f52f8a892ec5d8d660dbd79400a9c7d`
- Workflow: `.github/workflows/factory-f-fe-191-accessibility-skills.yml`
- Workflow commit: `749064f20b9f6ed4b5a7b5dc5a652b91a2ac6a36`

## Fail → StrategyDelta → PASS evidence
### Attempt 1 — kept as real failure
- Run: `34849854182`
- Job: `103994738847`
- Verdict: `FAIL`
- Cause: first two fixtures used `page.setContent()`, leaving an `about:blank` origin; browser dynamic import `/src/oss/accessibility-skills-qa-v1.js` could not resolve.
- Classification: test-harness origin gap; no product or adapter mutation was justified by this failure.

### StrategyDelta
The fixture now first loads `/` from the Factory web server and then replaces fixture DOM, preserving a valid HTTP origin before dynamic import.

### Attempt 2 — trusted PASS
- Tested SHA: `5f458e13f430d311b589c52e3f071f5e9eb17877`
- Run: `34850017641`
- Job: `103995297038`
- Conclusion: `success`
- Desktop Chromium: `3 passed`
- Mobile Chromium / Pixel 7 profile: `3 passed`
- Syntax/readback/hash gate: PASS

## Boundary
This proves the reusable QA adapter in real desktop/mobile browser runs. It does not alter Factory product code and is not wired as a runtime feature. Future candidate-level accessibility findings must remain separate GAP/fix nodes owned by the relevant frontend segment.
