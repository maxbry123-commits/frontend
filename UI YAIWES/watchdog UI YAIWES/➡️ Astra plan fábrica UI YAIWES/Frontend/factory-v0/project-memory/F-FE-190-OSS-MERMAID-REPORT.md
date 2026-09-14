# F-FE-190 — OSS Mermaid — REPORT

- Node: `F-FE-190-OSS-MERMAID`
- Segment: `SEG-10-OSS`
- Verdict: `PASS_RELEASED`
- Qualification: `ADAPTER_CONTRACT_BROWSER_PASS / SOURCE_RUNTIME_NOT_WIRED`
- Candidate wiring: **NO** (producer rule; SEG-11 only)

## Source truth
- Local extracted tree: `📂componentes open soure fromtend/Fromtend code/Mermaid/`
- Extraction commit: `ba74a2c9a91b7108fe78daf66c3c7e1a897add5c`
- Package: `mermaid-monorepo`
- Version recorded in local `package.json`: `10.2.4`
- Repository recorded by source: `https://github.com/mermaid-js/mermaid`
- License recorded by source: `MIT`
- Decision: `REUSE_LOCAL`; no download, no extraction, no monolith copy.

## Delta
- Adapter: `src/oss/mermaid-adapter-v1.js`
- Adapter commit: `4481ce4cf1fc25c6b734dcd723dd326b7890621e`
- Adapter blob hash from trusted runner: `a485ec8bd3fee8149482cebc1e5b0d777fd4dc07`
- Test: `tests/e2e/oss/f-fe-190-oss-mermaid.spec.mjs`
- Test commit: `5e6db38c59eeb5f76058d562a9061559331df963`
- Test blob hash from trusted runner: `abc4635b48046f062069eb3808c016f468b5df58`
- CI head: `f59741ec3dff15ae2599e1fc57b4eb7eefb06db5`

Adapter properties: dependency-injected Mermaid runtime; no state ownership; strict security initialization; source-size bound; normalized diagram id; unsafe/invalid SVG rejection; `wired:false` evidence retained.

## Trusted CI evidence
- Workflow: `factory-f-fe-190-oss-mermaid`
- Run: `34849117322`
- Job: `103992271688`
- Conclusion: `success`
- Desktop Chromium: `2 passed`
- Pixel 7/mobile Chromium: `2 passed`
- Readback/syntax/hash step: PASS
- Artifact upload: no files emitted because both tests passed and Playwright produced no report/test-results payload under the selected reporter; run/job logs remain the auditable evidence.

## Boundaries
This node does **not** claim `WIRED` or actual Mermaid source runtime execution. It proves the YAIWES thin adapter contract in real desktop/mobile browsers. A later integrator may bind a built/pinned Mermaid runtime only after its own candidate-level test. Therefore:

`SOURCE_PRESENT -> EXTRACTED -> ADAPTER_TEST_PASS`, while `WIRED` and `CANDIDATE_RUNTIME_PASS` remain separate future gates.
