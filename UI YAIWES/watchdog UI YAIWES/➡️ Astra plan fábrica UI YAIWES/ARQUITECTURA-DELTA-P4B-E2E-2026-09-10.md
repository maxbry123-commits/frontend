# ARQUITECTURA DELTA — P4B E2E / VISUAL VERIFICATION

Identity: `➡️ Astra plan fábrica UI YAIWES`
Parent architecture: `ARQUITECTURA-PERFIL-TRABAJO-ASTRA-FABRICA-UI-YAIWES.md`

## Verification layer added

The factory verification architecture now explicitly separates:

`LOGIC_TEST -> BROWSER_E2E -> VISUAL/RESPONSIVE -> EVIDENCE -> INDEPENDENT_REVIEW`.

No layer can promote the next by file presence alone.

### Browser E2E contract

Input: Factory V0 static app + deterministic test data.
Runner: Playwright pinned to a traced version/tag.
Targets: desktop Chromium + mobile Chromium profile.
Artifacts on failure: trace + screenshot; HTML report retained by authorized runner.
Assertions: five-step navigation, component creation/edit, drag/drop, AI proposal/apply boundary, undo/redo, version increment, export artifact.

### Ownership boundary

The E2E suite lives under Astra-owned `Frontend/factory-v0/`. Runner orchestration must not be materialized under another owner's `.github/workflows/` without explicit handoff. This preserves `single_writer_per_path`.

### State promotion

`E2E_HARNESS_READY` means configuration/spec exists.
`E2E_EXECUTED_PASS` requires real browser log/report.
`VERIFIED_CLOSED` additionally requires donor provenance gates, product path handoff and independent reviewer.
