---
name: fromted-frontend-architecture
description: "Arquitectura FROMTED/YAIWES: tokens Matte Little Blanco, 1 ventana=1 archivo, extraer ZIP, clonar OSS 1:1, fabrica UI interna. Use when frontend, chat, clon, zip, biblioteca, fabrica, HTML funcional. NOT for Operator lime UI, NOT for inventing a 4th palette."
type: orchestrator
lifecycle: active
---

# FROMTED Frontend Architecture

Orchestrate FROMTED product UI. Tokens are law. Segments are Lego. Mocks fail.

## Hard lock (read first)

1. Themes only: `matte` | `little` | `blanco`. See `references/01-tokens-themes.md`.
2. Orange `#ff5500` text only on Cargar/Descargar (matte). Blue `#2563eb` selection only.
3. Little CTA fill `#C65D3B` only. Never mix Operator lime `#d9ff43` into product UI.
4. 1 window = 1 file. 1 function = 1 file. No monolith.
5. Original ZIP/OSS code is never overwritten. Copy 1 = original. Copy 2 = FROMTED.
6. A control that does nothing is rejected. Test 5 times before deliver.
7. Closed apps (Grok Bot, MiniMax Design/Code, Claude Cowork): official URL only. Do not fake a clone.
8. Factory UI is internal. End user never opens the factory.
9. i18n: es / en / fr / pt. No hardcoded UI strings in production modules.

Machine law: `FROMTED-FRONTEND-IMMUTABLE-LAW.json`.

## Order of work (do not invert)

**Paso 1 — Skill (this pack).** No components from sandbox zips.

**Paso 2 — Biblioteca.** Extract ZIP + clone OSS into:

- `Skills-arquitectura-frontend-Yaiwes/biblioteca-frontend/01-original|02-fromted`
- `Skills-arquitectura-frontend-Yaiwes/biblioteca-backend/01-original|02-fromted`
- `Skills-arquitectura-frontend-Yaiwes/fabrica-ui-interface/componentes`

## Agent workflow

```
A Identify theme (or ask)
B Identify surface: chat | ventana | boton | selector | sheet | fabrica
C Load tokens from 01 only
D Build ONE segment file
E Wire real events (see 03)
F Accent audit
G Test 5 times
H Save original + fromted + HTML demo
```

## Read on demand

| Need | File |
|------|------|
| Colors | `references/01-tokens-themes.md` |
| Shapes | `references/02-component-catalog.md` |
| JS live | `references/03-interaction.md` |
| Agent tree | `references/04-agent-protocol.md` |
| Modules 1–7 | `references/04-modules.md` |
| Factory Office-style | `references/05-factory-modular.md` |
| Extract ZIP / clone | `references/06-extract-zips.md` |
| 9 HTML | `references/07-nine-html.md` |
| 2 bibliotecas | `references/08-bibliotecas.md` |
| Platforms | `references/09-platforms.md` |
| Graph | `references/INDEX.md` |

MiniMax `frontend-dev` motion/structure may inform motion only. **Never import MiniMax palettes.**

## 9 HTML demos (Paso 2)

1. Chat 2. Ventanas 3. Botones 4. Selectores 5. Lista indice 6. Backend ejecutable 7. Unificado 8. Emojis 9. Animados

## Fail closed

| Fail | Action |
|------|--------|
| 4th color | Delete and rebuild |
| Mock button | Rebuild until event fires |
| Mixed original+fromted in one file | Split |
| Claimed official clone of closed app | Retract. Give URL. |
| Skill ZIP includes zip components | Remove. That is Paso 2. |

## Output

Prefer downloadable HTML + zip lotes de 10. No canvas-only. No markdown instead of the component.
