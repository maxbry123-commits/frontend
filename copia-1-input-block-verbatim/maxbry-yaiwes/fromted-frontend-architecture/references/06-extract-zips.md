---
description: "How to audit zips, extract one control per file, keep originals, clone OSS 1:1 then FROMTED."
connections: [08-bibliotecas, 05-factory-modular]
---

# Extraer ZIP / clonar / mantener

## Audit (4–5 passes)

1. List every file in the zip.
2. Tag: button | selector | window | chat | backend | other.
3. Copy **source** of each control. Do not summarize.
4. Cross-check vs FROMTED skill (colors later).
5. Confirm backend files go to biblioteca-backend only.

## Per control

```
01-original/<zip>/<control>.<ext>   # exact copy
02-fromted/<control>.html           # tokens only + live events
```

- 1 control = 1 file.
- Test 5 times: click, toggle, open, close, persist.
- Lotes de 10 files then zip.

## Clone protocol

1. Official product URL (open, do not invent HTML).
2. GitHub official or replica: `git clone --depth 1` **zero edits**.
3. If repo already has HTML/CSS/JS: copy to `01-original`.
4. Closed binary (Electron installer): store URL only. No fake replica.
5. Improve FROMTED only in `02-fromted`.

## Official vs OSS (this project)

| Target | Official | OSS allowed |
|--------|----------|-------------|
| Grok Bot | grok.com | grok-web, xAI-desktop, Grok_Cli2Web |
| MiniMax Design | design.minimax.io | OpenRoom, TokenPlan |
| MiniMax Code | agent.minimax.io | — |
| Kimi Code | kimi web local | kimi-cli, Kimi-GUI |
| Claude Work | claude.com | none — URL only |

## Maintain

- Never overwrite `01-original`.
- Changelog per lote in biblioteca README.
- Backend Node/Deno/Python → `biblioteca-backend/01-original`.
