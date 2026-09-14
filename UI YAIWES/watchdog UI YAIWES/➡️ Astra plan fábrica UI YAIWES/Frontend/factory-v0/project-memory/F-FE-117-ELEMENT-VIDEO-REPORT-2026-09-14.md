# F-FE-117-ELEMENT-VIDEO REPORT

```json
{
  "schema": "tel.workflow/v3",
  "mode": "FAIL_CLOSED_LOOP",
  "node_id": "F-FE-117-ELEMENT-VIDEO",
  "segment_id": "SEG-02-BROWSER",
  "lane": "GROK-C",
  "type": "CONTROL_QA",
  "state": "PASS_RELEASED",
  "report_state": "PASS_SEGMENT_PLAYWRIGHT",
  "owner": "GROK 4",
  "agent": "GROK",
  "chat_id": "GROK-4-UI-YAIWES-WATCHDOG-HORARIO",
  "claimed_at": "2026-09-14T22:48:04Z",
  "claim_commit": "ec5237c196ed9ec44b553fc2393d9f4ae0895255",
  "spec_commit": "2dd9a64caa71e3b8405d9b5b6136660b0c4229ad",
  "delta_commit": "6fd30de46c76b6db01786a091e06d611cdb3949f",
  "fix_commit": "0f4a6cad12e0c781dfc1bb7f0de0a9b11cf790c6",
  "reported_at": "2026-09-14T22:53:13Z",
  "fresh_main_sha_at_claim": "cc7ce726070b607cf284978b93453a8bb083ce7d",
  "fresh_main_sha_at_report": "0f4a6cad12e0c781dfc1bb7f0de0a9b11cf790c6",
  "selector": "[data-kind='video']",
  "candidate": "index-v192.html",
  "candidate_blob": "e3d68e1063cd37c2a59d91911f071fda304e4695",
  "product_patched": false,
  "skipped_claimed": "F-FE-110 CLAIMED by GPT-5.6-SOL; disjoint write_scope",
  "write_scope": [
    "Frontend/factory-v0/tests/e2e/control-audit/F-FE-117-ELEMENT-VIDEO.spec.mjs",
    "Frontend/factory-v0/project-memory/F-FE-117-ELEMENT-VIDEO-*",
    ".github/workflows/factory-F-FE-117-ELEMENT-VIDEO.yml",
    "UI YAIWES/bitácora stated JSON Craxy wall plan checkpoint/claims/frontend-workpack-100/F-FE-117.json"
  ],
  "blob_sha": {
    "spec": "38d45486b2cb5e9450928abbbfd215e3f3833aa4",
    "workflow": "6f1e4e953ddd4ec786dd8f2f372f60d86dcf0feb",
    "index_v192_frozen": "e3d68e1063cd37c2a59d91911f071fda304e4695",
    "app_v19_frozen": "1aab6ebec09a8e6a14f221b83226cf92552b4526",
    "browser_v1_frozen": "6803afedfd2f6bd08b528d71d6c175747a31bb43"
  },
  "strategy": "REUSE_EXISTING component-browser-v1 capture click -> preview, Insertar allowCanonicalInsert -> ADD_COMPONENT video; no product patch",
  "gap": "CONTROL_QA for [data-kind=video] after F-FE-116 PASS_RELEASED. First run failed: expected Video vs canonical Vídeo.",
  "fix": "CONTROL_QA only: assert canonical label Vídeo; reveal library on mobile; card click selects preview without insert; [data-preview-insert] adds Vídeo; persist/reload.",
  "test": "npx playwright test tests/e2e/control-audit/F-FE-117-ELEMENT-VIDEO.spec.mjs — chromium-desktop PASS (kind=video, 1.7s) + mobile-chromium Pixel 7 PASS (1.6s)",
  "run_id": 34906088470,
  "job_id": 104182960801,
  "run_url": "https://github.com/maxbry123-commits/frontend/actions/runs/34906088470",
  "job_url": "https://github.com/maxbry123-commits/frontend/actions/runs/34906088470/job/104182960801",
  "failed_first_run": 34905925069,
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
    "F-FE-118-ELEMENT-AUDIO is next GROK-C FREE node"
  ],
  "release": true,
  "next_free_node": "F-FE-118-ELEMENT-AUDIO"
}
```
