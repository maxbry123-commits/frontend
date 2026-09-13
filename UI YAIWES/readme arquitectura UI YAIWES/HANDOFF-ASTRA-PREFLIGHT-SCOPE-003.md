# ASTRA-PREFLIGHT-SCOPE-003 — 2026-09-13

Sheriff now reuses Supervisor's lexical path predicate before handler invocation. Invalid declared scope returns BLOCKED. Runner order remains Sheriff + Validator → handler → postchecks.

Reproduced before patch: safe/../outside invoked handler once. After patch: six invalid scopes do not invoke handler; three valid scopes execute. Local Wordflow suite: 28 passed. CI not verified; project remains ACTIVE_LOOP.

This is not filesystem confinement: symlink escapes and dishonest handlers remain unproven. Sol: integrate actual effect-path checks through the existing universal adapter, prove no write outside scope, then request Orquestador reconciliation of shared STATE/CHECKPOINT. No additional download is justified by this patch.

Checkpoint: ../bitácora stated JSON Craxy wall plan checkpoint/ASTRA-PREFLIGHT-SCOPE-003.json. Next: CI verification, then remaining effect confinement GAP. Hourly watchdog resumes from role state.
