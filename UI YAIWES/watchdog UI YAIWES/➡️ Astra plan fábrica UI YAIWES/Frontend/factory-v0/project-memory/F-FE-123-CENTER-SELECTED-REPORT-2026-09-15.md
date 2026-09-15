# F-FE-123-CENTER-SELECTED REPORT

```json
{
  "schema": "tel.workflow/v3",
  "mode": "FAIL_CLOSED_LOOP",
  "node_id": "F-FE-123-CENTER-SELECTED",
  "segment_id": "SEG-03-EDITOR-CORE",
  "lane": "GROK-C",
  "type": "CONTROL_QA",
  "state": "PASS_RELEASED",
  "report_state": "PASS_SEGMENT_PLAYWRIGHT",
  "owner": "GROK 4",
  "agent": "GROK",
  "chat_id": "GROK-4-UI-YAIWES-WATCHDOG-HORARIO",
  "claimed_at": "2026-09-15T01:48:45Z",
  "claim_commit": "1955d73a94987dd8220921154a12debe11bfa6b6",
  "spec_commit": "03d71109889e05e4de9fcb0e15cd54be7d80e6f0",
  "delta_commit": "5cef3323a072b2b106ada40231e2a6e1660aa829",
  "fixup_commit": "8f9d24ee6bad8549141db75b1826f0a25b6ea04f",
  "reported_at": "2026-09-15T01:54:33Z",
  "fresh_main_sha_at_claim": "553f695947d6e67fb12c7e31573cf22cc57f8f94",
  "fresh_main_sha_at_report": "8f9d24ee6bad8549141db75b1826f0a25b6ea04f",
  "selector": "#center-selected",
  "candidate": "index-v192.html",
  "candidate_blob": "e3d68e1063cd37c2a59d91911f071fda304e4695",
  "product_patched": false,
  "skipped_claimed": "F-FE-110 CLAIMED by GPT-5.6-SOL; disjoint write_scope",
  "write_scope": [
    "Frontend/factory-v0/tests/e2e/control-audit/F-FE-123-CENTER-SELECTED.spec.mjs",
    "Frontend/factory-v0/project-memory/F-FE-123-CENTER-SELECTED-*",
    ".github/workflows/factory-F-FE-123-CENTER-SELECTED.yml",
    "UI YAIWES/bitácora stated JSON Craxy wall plan checkpoint/claims/frontend-workpack-100/F-FE-123.json"
  ],
  "blob_sha": {
    "spec": "71b8939a3f30d60bc88f58ab8420e7902888af0e",
    "workflow": "14198f3eacff5b9d9f9a2c53119965f16ac66c2b",
    "index_v192_frozen": "e3d68e1063cd37c2a59d91911f071fda304e4695",
    "app_v19_frozen": "1aab6ebec09a8e6a14f221b83226cf92552b4526",
    "actions_frozen": "5d5617507b3cd2e02e397f6e973e79adfb8297b1"
  },
  "strategy": "REUSE_EXISTING step-2 #center-selected -> MOVE_COMPONENT to canvas center; no product patch",
  "gap": "CONTROL_QA for #center-selected after F-FE-122. Control lives in step 2 Inspector. Insert already lands at canvas center, so click is formula-idempotent from insert origin.",
  "fix": "CONTROL_QA only: insert button; go PASO 2; Centrar seleccionado applies MOVE_COMPONENT formula; persist/reload. First CI failed on hardcoded 80,80; spec patched to live origin.",
  "test": "npx playwright test tests/e2e/control-audit/F-FE-123-CENTER-SELECTED.spec.mjs — chromium-desktop PASS (1.9s, 237,249) + mobile-chromium Pixel 7 PASS (1.9s, 183,147)",
  "run_id": 34918948509,
  "job_id": 104222548727,
  "failed_first_run_id": 34918810970,
  "run_url": "https://github.com/maxbry123-commits/frontend/actions/runs/34918948509",
  "job_url": "https://github.com/maxbry123-commits/frontend/actions/runs/34918948509/job/104222548727",
  "run_status_at_report": "completed_success",
  "wired": false,
  "classification": {
    "SOURCE_PRESENT": true,
    "IMPLEMENTED": true,
    "WIRED": "N/A_CONTROL_QA",
    "RUNTIME_TEST_PASS": "SEGMENT_PLAYWRIGHT_PASS",
    "VERIFIED_CLOSED": false
  },
  "remaining_gaps": [
    "independent review required before VERIFIED_CLOSED",
    "F-FE-110 CLAIMED by GPT-5.6-SOL — do not touch",
    "F-FE-124-DUPLICATE-SELECTED is next GROK-C FREE node"
  ],
  "release": true,
  "next_free_node": "F-FE-124-DUPLICATE-SELECTED"
}
```
