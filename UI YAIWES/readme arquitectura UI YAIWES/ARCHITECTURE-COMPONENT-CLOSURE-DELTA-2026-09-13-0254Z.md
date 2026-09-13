# Architecture Component Closure Delta — 2026-09-13 02:54Z

Contract: `tel.workflow/v3` · Mode: `FAIL_CLOSED_LOOP`

This file is an additive architecture delta to `ARQUITECTURA-WORDFLOW-PYTHON-DSL-DAG-96-4-V7-2026-09-12.md`. It does not replace the base architecture.

## N07 — Vite acquisition

- Required destination from runtime integration manifest: `runtime/vendor/vite`.
- Official source verified: `vitejs/vite`, `v8.3.0`, commit `434e8e9495436a60789f2b588a04a6a24a3d1661`.
- Canonical immutable Motor2/engine blobs verified before effect: `84d566e...` / `91e6e44...`.
- Action run `34732661919`, job `103658218081`: FAIL-CLOSED at source scan with `SOURCE_SPECIAL_FILE_GAP` caused by upstream symlink/special-file fixtures.
- No LFS, no force, no sanitization, no mirror and no motor mutation are authorized.
- N07 remains `GAP_RESOLVABLE`; source presence is not claimed.

## N13 — Vercel AI SDK

- Official source: `vercel/ai`.
- Pinned source ref: `ai@5.0.257`; signed commit `82137ec13283bb0f72d89f192403ab7378194a37`.
- License: Apache-2.0 (official repository LICENSE and package metadata).
- Destination: `runtime/vendor/vercel_ai_sdk`.
- Canonical Motor2 execution launched in workflow `ui-yaiwes-vercel-ai-sdk-canonical-motor2-20260913.yml`, run `34734135513`.
- At this delta, bootstrap and immutable-motor verification are PASS; acquisition/extraction/publish step is still executing. Do not promote N13 until independent readback succeeds and integration/streaming tests pass.

## Invariants

`REUSE_EXISTING > PATCH > ADAPT > GENERATE > NEW_DOWNLOAD`.

`SOURCE_PRESENT != IMPLEMENTED != WIRED != RUNTIME_TEST_PASS != VERIFIED_CLOSED`.

Stabilize CORE remains the only workflow owner; this component lane does not introduce a scheduler/orchestrator/recovery owner.
