# F-FE-074-LAYER-LOCK-VISIBILITY REPORT

```json
{
  "schema": "tel.workflow/v3",
  "mode": "FAIL_CLOSED_LOOP",
  "node_id": "F-FE-074-LAYER-LOCK-VISIBILITY",
  "segment_id": "SEG-05-CONTROLS",
  "lane": "GROK-A",
  "state": "TESTED_NOT_WIRED",
  "report_state": "PASS_RELEASED",
  "owner": "GROK 3",
  "agent": "GROK",
  "chat_id": "GROK-3-UI-YAIWES-FACTORY",
  "claimed_at": "2026-09-14T12:44:00Z",
  "claim_commit": "99e80654c087827133fb523fb2a1f531eb1db1d6",
  "reported_at": "2026-09-14T12:51:00Z",
  "fresh_main_sha_at_claim": "64454328fa63260eba1e0c74483574e31a78755e",
  "delta_commit": "9a24da93c02ebcb06e6249fc2810092ce69d51e0",
  "spec_commit": "5318a86ae6874ab8ef9f06f4a06e8881e707da0e",
  "tested_sha": "ff8335f006fc650ca79cd1b41189785169befe0b",
  "write_scope": [
    "Frontend/factory-v0/src/layer-reorder-v2.js",
    "Frontend/factory-v0/tests/e2e/f-fe-074-layer-lock-visibility.spec.mjs",
    "Frontend/factory-v0/project-memory/F-FE-074-LAYER-LOCK-VISIBILITY-*.md",
    ".github/workflows/factory-f-fe-074-layer-lock-visibility.yml"
  ],
  "paths": [
    "UI YAIWES/watchdog UI YAIWES/➡️ Astra plan fábrica UI YAIWES/Frontend/factory-v0/src/layer-reorder-v2.js",
    "UI YAIWES/watchdog UI YAIWES/➡️ Astra plan fábrica UI YAIWES/Frontend/factory-v0/tests/e2e/f-fe-074-layer-lock-visibility.spec.mjs",
    ".github/workflows/factory-f-fe-074-layer-lock-visibility.yml"
  ],
  "blob_sha": {
    "layer_reorder_v2": "e4bff9185725935d93c1ea030f0f0b16483dacd6",
    "spec": "aec871281a09a0124176365d00fbcaa679096f9c",
    "workflow": "fdaebd19367b588f4742cc4f787dfde72d2332e6",
    "layer_reorder_v1_preserved": "1dfb5c63d54824674c54b8c2e5167d434c05e64e"
  },
  "strategy": "REUSE_EXISTING layer-reorder-v1 persist/history; ADAPT hide/lock/drag-to-index/keyboard/undo into versioned v2; skip auto if v1 mounted unless force",
  "gap": "v1 only ↑↓ reorder; no hidden/locked canonical fields; no move/resize guard; keyboard and drag reorder were not the same API; producer cannot wire candidate",
  "fix": "layer-reorder-v2: setLayerHidden/setLayerLocked persist visible=!hidden; guardMove/guardResize fail when locked; capture interceptor blocks pointerdown on locked [data-node]; reorderPersistedLayer and reorderPersistedLayerTo agree; undoLayer/redoLayer restore history",
  "test": "npx playwright test tests/e2e/f-fe-074-layer-lock-visibility.spec.mjs — chromium-desktop 6 passed + mobile-chromium Pixel 7 6 passed",
  "run_id": 34845576951,
  "job_id": 103980580745,
  "run_url": "https://github.com/maxbry123-commits/frontend/actions/runs/34845576951",
  "run_status_at_report": "completed_success",
  "wired": false,
  "frozen_untouched": [
    "index-v19.html",
    "index-v192.html",
    "src/touch-dnd-v192.js",
    "src/touch-dnd-v193.js",
    "src/layer-reorder-v1.js",
    "src/bootstrap/candidate-v193.js"
  ],
  "classification": {
    "SOURCE_PRESENT": true,
    "IMPLEMENTED": true,
    "WIRED": false,
    "RUNTIME_TEST_PASS": "SEGMENT_PLAYWRIGHT_PASS",
    "VERIFIED_CLOSED": false
  },
  "remaining_gaps": [
    "integrator must load layer-reorder-v2 from a versioned candidate; producer did not wire",
    "independent review required before VERIFIED_CLOSED"
  ],
  "release": true,
  "next_free_node": "F-FE-075-CANVAS-KEYBOARD-OPS"
}
```
