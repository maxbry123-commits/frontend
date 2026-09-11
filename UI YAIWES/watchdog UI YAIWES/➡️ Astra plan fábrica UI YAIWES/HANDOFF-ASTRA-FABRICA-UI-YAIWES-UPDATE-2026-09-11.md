# HANDOFF UPDATE — ➡️ Astra plan fábrica UI YAIWES — 2026-09-11

Contract: tel.workflow/v3
Mode: FAIL_CLOSED_LOOP
Gate: T1_FACTORY_FRONTEND must be VERIFIED_CLOSED before productive T2_INTERFACE_YAIWES.

## Recovery read order
1. INPUT-BLOCK-LITERAL-2026-09-10.md
2. INPUT-BLOCK-LITERAL-2026-09-11-ADDENDUM.md
3. PLAN-ASTRA-FABRICA-UI-YAIWES.md
4. STATE.json
5. CHECKPOINT vigente
6. Crazy Wall canonical
7. project-memory/README.md
8. project-memory/COMPONENT-AUDIT-2026-09-11.md
9. project-memory/sol-nodes/SOL-FACTORY-NODE-A.json
10. project-memory/sol-nodes/SOL-FACTORY-NODE-B.json

## Current factory truth
- Factory V0 code/tests remain valid evidence, but persistent HF web is still not verified.
- 40+ OSS families are physically present; current runtime does NOT prove integration of those donors. `package.json` only declares Playwright as test dependency.
- Project memory root is now mandatory for each created module/work artifact.
- Two Sol LOOP nodes exist, each max 3 steps and non-overlapping write root under project-memory.
- API keys/credentials are referenced only by `secret_ref`; never persist raw values.

## Future T2 target
After T1 VERIFIED_CLOSED and explicit product-path handoff:
- `UI YAIWES interface/Fromtend/`
- `UI YAIWES interface/Backend/`

Backend OSS donors discovered by Astra/Sol are staged/classified before promotion; no silent writes into Sol production backend.

## Current queue
1. Close persistent Hugging Face factory web: publish -> visible URL -> HTTP/read-back -> deployed E2E -> independent reviewer.
2. Integrate at least one real, traceable OSS frontend donor into Factory Transformer/runtime with URL/ref/license/adapter/test/read-back.
3. Synchronize Crazy Wall/STATE/CHECKPOINT with the new INPUT addendum, project-memory, Sol nodes and component audit.

## Watchdog order every hour
1. Review files + HANDOFF and recover context.
2. Analyze Crazy Wall/STATE/bitácora/tasks pending.
3. Search 10x improvements using existing OSS/APIs first.
4. Execute tasks and resolve GAPs fail-closed.
