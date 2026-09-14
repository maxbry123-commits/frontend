# F-FE-074-LAYER-LOCK-VISIBILITY CLAIM

```json
{
  "schema": "tel.workflow/v3",
  "mode": "FAIL_CLOSED_LOOP",
  "node_id": "F-FE-074-LAYER-LOCK-VISIBILITY",
  "segment_id": "SEG-05-CONTROLS",
  "lane": "GROK-A",
  "state": "CLAIMED",
  "owner": "GROK 3",
  "agent": "GROK",
  "chat_id": "GROK-3-UI-YAIWES-FACTORY",
  "fresh_main_sha": "64454328fa63260eba1e0c74483574e31a78755e",
  "claimed_at": "2026-09-14T12:44:00Z",
  "depends_on": ["F-FE-073-TOUCH-DRAG-INTENT"],
  "dependency_status": "SATISFIED F-FE-073 PASS_RELEASED GROK 1 delta 1f98920 report 66cd425e run 34840094615",
  "write_scope": [
    "Frontend/factory-v0/src/layer-reorder-v2.js",
    "Frontend/factory-v0/tests/e2e/f-fe-074-layer-lock-visibility.spec.mjs",
    "Frontend/factory-v0/project-memory/F-FE-074-LAYER-LOCK-VISIBILITY-*.md",
    ".github/workflows/factory-f-fe-074-layer-lock-visibility.yml"
  ],
  "frozen": [
    "index-v19.html",
    "index-v192.html",
    "src/touch-dnd-v192.js",
    "src/touch-dnd-v193.js",
    "src/layer-reorder-v1.js",
    "src/bootstrap/candidate-v193.js"
  ],
  "skipped": {
    "F-FE-069": "CLAIMED GPT-5.6-SOL integrator",
    "F-FE-070": "BLOCKED_DEPENDENCY F-FE-076",
    "F-FE-071": "BLOCKED_DEPENDENCY F-FE-070",
    "F-FE-073": "PASS_RELEASED GROK 1 first-writer; NO WRITE touch-dnd-v195"
  },
  "strategy": "REUSE_EXISTING layer-reorder-v1 then ADAPT hide/lock/drag-reorder/undo into versioned v2; preserve v1",
  "acceptance": "Layer hide/show and lock/unlock produce canonical visible state; locked nodes cannot move/resize; keyboard reorder and drag reorder agree; undo/redo PASS.",
  "base_blobs": {
    "layer_reorder_v1": "1dfb5c63d54824674c54b8c2e5167d434c05e64e",
    "index_v192": "e3d68e1063cd37c2a59d91911f071fda304e4695"
  },
  "release": false
}
```
