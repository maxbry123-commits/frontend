# FROMTED DESIGN SYSTEM — Agent Protocol Skill

**Version:** 1.0.0  
**Depends on:** documents 01, 02, 03  
**Audience:** Claude · Grok · GPT · any model generating UI for FROMTED  
**Language:** imperative instructions + pseudo-code for models

---

## Purpose

This is the **operating manual** for AI agents.  
When the user asks for screens, HTML, React, or redesigns, the agent must follow this protocol so outputs stay inside the locked design system.

---

## 1. Always-on preamble (paste into agent context)

```
DESIGN LOCK ACTIVE — FROMTED

Themes (immutable):
- matte   (Negro + Grises)
- little  (Warm terracotta)
- blanco  (Light)

Source of truth:
- 01-DESIGN-TOKENS-THEMES-IMMUTABLE.md  → colors + accent rules
- 02-UI-COMPONENT-CATALOG-SKILL.md      → structure of components
- 03-FUNCTIONAL-INTERACTION-SKILL.md    → executable behavior

Hard rules:
1. Never invent a fourth palette.
2. Never use lime #d9ff43 or Operator carbon as product UI for FROMTED.
3. Blue is selection-only (matte/blanco). Orange text only for Descargar on matte.
4. Little uses terracotta #C65D3B only on primary CTAs.
5. Blanco titles are #18181b gray, not pure black body text.
6. Same layout geometry across themes; only tokens change.
7. Prefer executable demos over static screenshots of HTML.
```

---

## 2. Decision tree when user requests UI

```
INPUT: user request (screen, component, full app, "improve design")

STEP A — Identify theme
  IF user names theme → use it
  ELSE IF context has last approved theme → reuse
  ELSE ASK which theme: matte | little | blanco

STEP B — Identify surface type
  chat | files/directory | mode-sheet | settings | multi-panel | other
  Map to components in document 02

STEP C — Load tokens
  Copy :root block for that theme from document 01 ONLY

STEP D — Build structure
  Phone frame + header + content + (sheet | bottom nav)
  Use class roles: title, meta, name, sub, card, btn-primary, btn-link

STEP E — Wire interaction
  At minimum one of: panel switch, sheet open/close, list select, search filter
  Follow document 03

STEP F — Accent audit
  matte:   no filled orange buttons; Descargar = orange text
  little:  primary buttons = terracotta fill
  blanco:  Descargar = blue link; selection = blue border + soft fill

STEP G — Output
  Prefer single-file HTML executable OR React modules with clear token imports
  Do not claim "final production" if only static markup
```

---

## 3. Forbidden actions

| Action | Why forbidden |
|--------|----------------|
| Introduce lime / neon green as brand | Belongs to Operator lock, not FROMTED product themes |
| Mix Matte orange with Little terracotta on same screen | Themes are exclusive unless product implements theme switcher |
| Use pure `#000000` as default body text on Blanco | Violates approved gray hierarchy |
| Fill primary buttons blue on Matte | Blue is selection only |
| Drop Lucide / system icons for emoji-heavy chrome | Breaks line-icon aesthetic |
| Rewrite geometry (radii 24 / 12 / 10) without explicit user request | Structure is part of lock |
| Summarize away token tables when user asks for skill docs | User required engineering detail |

---

## 4. Mapping legacy / Gemini / Operator code

When input HTML uses another palette:

```
IF sees --lime or #d9ff43 or IBM Plex Mono as brand
  → treat as Operator behavioral reference only
  → rebuild visuals with Matte | Little | Blanco tokens

IF sees warm #1C1B1A + #C65D3B
  → map to Little (already approved)

IF sees #0a0a0d + #ff5500 + #2563eb
  → map to Matte

IF sees light #f4f4f5 + gray text + #2563eb
  → map to Blanco

IF sees forest green / gold / Christmas
  → REJECT palette; map structure only to Matte as default
```

Pseudo-code:

```
function mapLegacyColors(html: string, targetTheme: ThemeId): string {
  // parse style blocks
  // replace hex and var names according to target theme table
  // keep class structure and JS behavior
  // return transformed document
}
```

---

## 5. Output formats the agent should prefer

### A. Single-file executable demo (default for design review)

- One HTML file
- Tailwind optional; prefer CSS variables from theme
- Lucide CDN allowed
- Inline JS for switchPanel / sheet / select
- Works offline after load

### B. Token module + components (for production handoff)

```ts
// tokens.ts
export { matte, little, blanco, geometry } from "./fromted-tokens";

// Button.tsx
export function Button({ variant, theme, ... }) {
  // reads theme tokens; no hardcoded brand colors
}
```

### C. Skill update (when user asks to extend the system)

- Edit only the relevant document 01–04
- Bump version
- Never weaken immutable tables without explicit user unlock

---

## 6. Response shape when delivering UI

Agents should structure answers as:

```
1. Theme in use: <matte|little|blanco>
2. Screens / components included: <list>
3. Interactions wired: <list>
4. Code block(s) or file paths
5. Accent rule confirmation (one line)
```

Example:

```
Theme: matte
Includes: Archivos list, search, selection, Descargar link
Interactions: selectItem, filter, download progress demo
Accent: blue selection border; orange text Descargar only
```

---

## 7. When user says "improve design" or "70%"

```
DO:
  - Tighten spacing to catalog values
  - Fix gray hierarchy (more text-secondary / tertiary)
  - Remove illegal accent colors
  - Make controls interactive

DO NOT:
  - Replace the approved theme with a new look
  - Add decorative gradients not in catalog
  - Change corner radii globally
```

---

## 8. Collaboration with Operator / Router codebases

FROMTED product UI (this skill) and Operator (lime + IBM Plex Mono) can coexist in a monorepo:

| Layer | Design system |
|-------|----------------|
| Router internal ops / train panels | Operator lock (lime) |
| End-user FROMTED mobile / chat / files | Matte · Little · Blanco |

Agents must not paint end-user FROMTED screens with Operator lime.

---

## 9. Validation script (mental checklist before send)

```
[ ] Theme declared
[ ] Tokens only from that theme
[ ] Components from catalog
[ ] At least one real interaction
[ ] Descargar / CTA accent correct
[ ] No lime / no pure-black body on light
[ ] Radii 24 / 12 / 10 respected
[ ] Spanish UI strings preserved if user is in Spanish
```

---

## 10. Unlock protocol

Themes are immutable until the user explicitly says:

```
"unlock theme <name>" 
or 
"we are changing the palette"
```

Without that phrase, agents refuse palette changes and only adjust structure, interaction, or content.

---

## 11. Document set index

| File | Role |
|------|------|
| `01-DESIGN-TOKENS-THEMES-IMMUTABLE.md` | Colors, text scale, accent law |
| `02-UI-COMPONENT-CATALOG-SKILL.md` | Buttons, cards, sheets, tabs, grids |
| `03-FUNCTIONAL-INTERACTION-SKILL.md` | Runnable JS/React behavior |
| `04-AGENT-PROTOCOL-SKILL.md` | This file — how models must behave |

Load order for a full task: 04 → 01 → 02 → 03.

---

## 12. Closing directive for models

```
You are implementing FROMTED UI.
You do not freestyle brand colors.
You implement the locked system with engineering precision.
When uncertain, prefer Matte tokens and ask for theme confirmation.
Deliver executable results, not decorative static pages.
```

End of document 04.
