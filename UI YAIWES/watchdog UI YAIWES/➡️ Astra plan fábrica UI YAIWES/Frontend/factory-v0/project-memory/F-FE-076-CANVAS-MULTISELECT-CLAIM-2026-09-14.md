# F-FE-076-CANVAS-MULTISELECT CLAIM

```json
{
  "schema": "tel.workflow/v3",
  "mode": "FAIL_CLOSED_LOOP",
  "node_id": "F-FE-076-CANVAS-MULTISELECT",
  "segment_id": "SEG-03-EDITOR-CORE",
  "lane": "GROK-A",
  "state": "CLAIMED",
  "owner": "GROK 3",
  "agent": "GROK",
  "chat_id": "GROK-3-UI-YAIWES-FACTORY",
  "fresh_main_sha": "fd4929de2cb87bb9342b9bc070e2fc5385403c94",
  "claimed_at": "2026-09-14T13:43:20Z",
  "depends_on": ["F-FE-075-CANVAS-KEYBOARD-OPS"],
  "dependency_status": "SATISFIED F-FE-075 TESTED_NOT_WIRED PASS_RELEASED GROK 3 delta c9f22e2 run 34846343096",
  "write_scope": [
    "Frontend/factory-v0/src/app-v21.js",
    "Frontend/factory-v0/tests/e2e/f-fe-076-canvas-multiselect.spec.mjs",
    "Frontend/factory-v0/project-memory/F-FE-076-CANVAS-MULTISELECT-*.md",
    ".github/workflows/factory-f-fe-076-canvas-multiselect.yml"
  ],
  "frozen": [
    "index-v19.html",
    "index-v192.html",
    "src/app-v19.js",
    "src/app-v20.js",
    "src/touch-dnd-v192.js",
    "src/touch-dnd-v193.js",
    "src/bootstrap/candidate-v193.js"
  ],
  "skipped": {
    "F-FE-073": "CLAIM file still CLAIMED GROK 1 — not stolen; report PASS_RELEASED",
    "F-FE-074": "PASS_RELEASED GROK 3 not FREE",
    "F-FE-075": "PASS_RELEASED GROK 3 not FREE",
    "F-FE-069": "CLAIMED GPT-5.6-SOL",
    "F-FE-070": "BLOCKED_DEPENDENCY F-FE-076",
    "F-FE-071": "BLOCKED_DEPENDENCY F-FE-070"
  },
  "strategy": "REUSE_EXISTING app-v20 reducer MOVE/SELECT/UNDO; ADAPT marquee+additive selectedIds + MOVE_COMPONENTS overlay into versioned app-v21; no second state engine; no candidate wire",
  "acceptance": "Marquee and modifier selection select exact nodes; group move preserves relative offsets; single select remains compatible; undo restores all positions; desktop+touch selection PASS.",
  "release": false
}
```
