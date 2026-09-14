# CLAIM — F-FE-079-IMPORT-BATCH-DROP

```yaml
schema: yaiwes.factory.node-claim/v1
contract: tel.workflow/v3
mode: FAIL_CLOSED_LOOP
node_id: F-FE-079-IMPORT-BATCH-DROP
segment_id: SEG-07-IMPORT
lane: GROK-B
agent: GROK
owner: GROK 4 UI YAIWES
chat_id: GROK-4-UI-YAIWES-WATCHDOG-HORARIO
state: CLAIMED
fresh_main_sha: d9549eef714306922252c4bb3da2924e9acd73e0
claimed_at: 2026-09-14T10:45:00Z
depends_on: [F-INT-CANONICAL-065]
dependency_status: VERIFIED_CLOSED
write_scope:
  - Frontend/factory-v0/src/file-import-controller-v2.js
  - Frontend/factory-v0/tests/e2e/f-fe-079-import-batch-drop.spec.mjs
  - Frontend/factory-v0/project-memory/F-FE-079-IMPORT-BATCH-DROP-*.md
  - .github/workflows/factory-f-fe-079-import-batch-drop*.yml
frozen_untouched:
  - index-v19.html
  - index-v192.html
integrator_paths_untouched:
  - index-v193-preview.html
  - src/bootstrap/candidate-v193.js
collision_check:
  F-FE-072: CLAIMED_BY GROK-3 / RELEASED_COLLISION GROK-1 — skipped
  F-FE-068: CLAIMED GPT-5.6-SOL — skipped
  F-FE-069: FREE but depends_on F-FRONTEND-QA-066 != VERIFIED_CLOSED — skipped
  F-FE-079: no claim file, write_scope exclusive SEG-07-IMPORT, F-INT-CANONICAL-065 closed
steps: [VERIFY_RESEARCH, EXECUTE_DELTA, TEST_REPORT]
strategy: REUSE_EXISTING > PATCH > ADAPT
reuse: src/file-import-controller-v1.js + src/file-import-v1.js (read-only; v1 not overwritten)
