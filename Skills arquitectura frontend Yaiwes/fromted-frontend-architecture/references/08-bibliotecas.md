---
description: "Two libraries: frontend and backend. Original vs FROMTED. Empty in Paso 1."
connections: [06-extract-zips, 05-factory-modular]
---

# 2 bibliotecas

Root: `Skills-arquitectura-frontend-Yaiwes/`

```
biblioteca-frontend/
  01-original/     # zip/git exact
  02-fromted/      # tokens + live
biblioteca-backend/
  01-original/
  02-fromted/
fabrica-ui-interface/
  componentes/     # segments ready to insert
fromted-frontend-architecture/   # this skill
README-ARQUITECTURA-FROMTED-YAIWES.md
```

## Cableado

- Skill tells agent where to write files.
- Factory reads `02-fromted` + `componentes`.
- Backend never mixed into frontend HTML except documented `fetch` to localhost.

## Paso 1 vs 2

- Paso 1 ZIP: skill + README + empty folder markers. **No zip components.**
- Paso 2: fill original/fromted from user zips + clones.
