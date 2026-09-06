# P05/P08 REAL-VENDOR ATTEMPT — 2026-09-06

Contract: `tel.workflow/v3`
Branch: `yaiwes-runtime-staging-20260906`

## Objective
Validate staged P05/P08 adapters against the exact upstream source commits instead of relying only on dependency injection tests.

## Environment preflight
- `typing_extensions`: present.
- `structlog`: not installed locally.
- `opentelemetry`: namespace present locally, but earlier audit established installed API/SDK versions differ from the pinned source versions.
- `casbin`: not installed locally.
- `simpleeval`: not installed locally.
- `wcmatch`: not installed locally.

## Structlog pinned-source attempt
Source: https://github.com/hynek/structlog
Pinned commit: `73393f34b40c15688b3fdd0982889b225f11b59b`
Expected code tree: `d64c15da142a3dae10dd1559661c53dd70a521e2`

Attempted an isolated Git checkout/fetch of the exact pinned commit for execution outside `main`.
Result: **BLOCKED**.
Observed error: `fatal: unable to access 'https://github.com/hynek/structlog.git/': Could not resolve host: github.com`

## Classification
- Adapter deterministic/injection suite: PASS.
- Canonical loader/catalog/mount_guard suite: `PASS_6_OF_6_LOCAL_DETERMINISTIC`.
- Exact real-vendor execution: **NOT PROVEN**.
- P05 Structlog flag remains open; this attempt MUST NOT be converted to `VERIFIED_CLOSED`.
- P05 OpenTelemetry real-vendor flag remains open because local installed versions do not match pinned `1.45.0.dev / 0.66b0.dev`.
- P08 PyCasbin real-vendor flag remains open because local `casbin`, `simpleeval`, and `wcmatch` are absent.

## Recovery
Use an execution environment with working GitHub DNS/network or the completed GitHub Action acquisition, materialize the exact pinned code trees, then execute the staged factories against those physical vendor trees. Preserve version/provenance gates and re-run real checks before closing flags.
