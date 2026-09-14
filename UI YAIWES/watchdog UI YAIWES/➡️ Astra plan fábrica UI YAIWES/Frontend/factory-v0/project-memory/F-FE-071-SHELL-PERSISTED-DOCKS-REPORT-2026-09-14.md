# F-FE-071-SHELL-PERSISTED-DOCKS REPORT

```json
{
  "schema": "tel.workflow/v3",
  "mode": "FAIL_CLOSED_LOOP",
  "node_id": "F-FE-071-SHELL-PERSISTED-DOCKS",
  "segment_id": "SEG-01-SHELL",
  "lane": "GROK-A",
  "state": "TESTED_NOT_WIRED",
  "report_state": "PASS_RELEASED",
  "owner": "GROK 3",
  "agent": "GROK",
  "chat_id": "GROK-3-UI-YAIWES-FACTORY",
  "claimed_at": "2026-09-14T15:37:20Z",
  "claim_commit": "c79d52df3166801ffacba9d51cbc0a31588c60f1",
  "delta_commit": "4fd8e5f6bf19353e2b4964540fa747053ec0c2b9",
  "css_commit": "8bc75b0e4100fc5f3d3393a6ab6423bad7299233",
  "spec_commit": "2fc52e52fd66ee15f673757af41e1a49daa9e384",
  "tested_sha": "ad7714d5433a439b077912a077ea9a3974ca361f",
  "reported_at": "2026-09-14T15:49:40Z",
  "fresh_main_sha_at_claim": "bb54212b076fe1eb3fc62a689dbb9d0a9ca1002d",
  "fresh_main_sha_at_report": "1d3882576270ba19852895779eb51cb7973e5818",
  "product_patched_frozen": false,
  "wired": false,
  "write_scope": [
    "Frontend/factory-v0/src/ui/workspace-shell-v5.js",
    "Frontend/factory-v0/workspace-shell-v5.css",
    "Frontend/factory-v0/tests/e2e/f-fe-071-shell-persisted-docks.spec.mjs",
    "Frontend/factory-v0/project-memory/F-FE-071-SHELL-PERSISTED-DOCKS-*.md",
    ".github/workflows/factory-f-fe-071-shell-persisted-docks.yml"
  ],
  "blob_sha": {
    "workspace_shell_v5_js": "91498604a0234fa1693a4b3bcd51aa17bcf3e9ff",
    "workspace_shell_v5_css": "845d0e52c3a7254a2e35e5d7d762daf56f610a57",
    "spec": "eff4457e40c751f7d7067d53286bf0d572fec4ad",
    "workflow": "7c184887ab698d88a2285e88d57a0acdbfd851e8",
    "workspace_shell_v4_js_preserved": "0407bced164f8be527cd764d56c93a9bcade4647",
    "workspace_shell_v4_css_preserved": "0caf54388095ad45b5dcc55825b224eb9ce98c7f",
    "index_v192_html_frozen": "e3d68e1063cd37c2a59d91911f071fda304e4695",
    "app_v19_js_frozen": "1aab6ebec09a8e6a14f221b83226cf92552b4526"
  },
  "strategy": "REUSE_EXISTING v4 mount + compact/safe-area; ADAPT versioned v5 persisted docks (localStorage yaiwes-workspace-shell-v5-docks, DOCK_MIN 160, CANVAS_MIN 360, pointer handles, reset); preserve v1/v2/v3/v4; no candidate wire",
  "gap": "Watchdog named F-FE-073 GROK-3 but READ_FRESH: 073 GROK 1 PASS_RELEASED report; 074-076/070 already PASS_RELEASED; 071 FREE then CLAIMED this chat. v4 docks not persisted; starve-left clamp left+right exceeded canvas budget after DOCK_MIN bump (935>920).",
  "fix": "workspace-shell-v5: persist/resize/reset desktop docks; compact strips --dock-*; clampDocks second pass left=max(DOCK_MIN, budget-right) so left+right<=studioW-CANVAS_MIN; http origin boot for localStorage; spec asserts studio rect not viewport",
  "test": "npx playwright test tests/e2e/f-fe-071-shell-persisted-docks.spec.mjs — chromium-desktop 3 passed + mobile-chromium Pixel 7 3 passed (local + GHA)",
  "run_id": 34864461123,
  "job_id": 104044665188,
  "run_url": "https://github.com/maxbry123-commits/frontend/actions/runs/34864461123",
  "job_url": "https://github.com/maxbry123-commits/frontend/actions/runs/34864461123/job/104044665188",
  "run_status_at_report": "completed_success",
  "frozen_untouched": [
    "index-v19.html",
    "index-v192.html",
    "src/touch-dnd-v192.js",
    "src/touch-dnd-v193.js",
    "src/bootstrap/candidate-v193.js",
    "src/ui/workspace-shell-v1.js",
    "src/ui/workspace-shell-v2.js",
    "src/ui/workspace-shell-v4.js",
    "workspace-shell-v1.css",
    "workspace-shell-v2.css",
    "workspace-shell-v4.css"
  ],
  "classification": {
    "SOURCE_PRESENT": true,
    "IMPLEMENTED": true,
    "WIRED": false,
    "RUNTIME_TEST_PASS": "SEGMENT_PLAYWRIGHT_PASS",
    "VERIFIED_CLOSED": false
  },
  "remaining_gaps": [
    "integrator must load workspace-shell-v5.js/.css from a versioned candidate; producer did not wire",
    "independent review required before VERIFIED_CLOSED",
    "workpack-20 GROK-A 072→073→074→075→076→070→071 complete; this chat will not claim another node"
  ],
  "release": true,
  "next_free_node": "NONE — workpack-20 GROK-A closed; skip F-FE-069 SOL; do not steal GROK-B 100-109"
}
```
