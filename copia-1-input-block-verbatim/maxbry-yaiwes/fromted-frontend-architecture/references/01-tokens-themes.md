# FROMTED DESIGN SYSTEM — Tokens & Themes (IMMUTABLE)

**Version:** 1.0.0-immutable  
**Date:** 2026-08-23  
**Audience:** Claude · Grok · GPT · any agent generating UI for FROMTED  
**Status:** LOCKED — do not invent new palettes

---

## Purpose

This document is the single source of truth for **color, typography hierarchy, and accent rules** across three approved themes:

1. Negro + Grises (Matte / Grok-style)
2. Little (Warm / Claude-style)
3. Blanco (Light)

Any generated HTML, React, CSS, or mock **must** map to one of these three themes.  
Do not mix tokens across themes unless the product explicitly supports theme switching.

---

## 1. Theme 1 — Negro + Grises (Matte)

### CSS custom properties (canonical)

```css
:root {
  /* Background layers (dark → elevated) */
  --pure:        #000000;
  --bg:          #0a0a0d;
  --surface:     #141417;
  --panel:       #1a1a1e;
  --card:        #202025;
  --card-hover:  #282830;

  /* Borders */
  --border:       #2a2a33;
  --border-light: #3f3f4e;

  /* Text scale (bright → muted) */
  --text-bright:   #ffffff;
  --text-primary:  #e4e4e7;
  --text-secondary:#a1a1aa;
  --text-tertiary: #71717a;
  --text-muted:    #52525b;

  /* Restricted accents */
  --blue:   #2563eb;   /* selection / check / active border ONLY */
  --orange: #ff5500;   /* text "Descargar" / "Cargar" ONLY */
}
```

### TypeScript tokens

```ts
export const matte = {
  pure: "#000000",
  bg: "#0a0a0d",
  surface: "#141417",
  panel: "#1a1a1e",
  card: "#202025",
  cardHover: "#282830",
  border: "#2a2a33",
  borderLight: "#3f3f4e",
  textBright: "#ffffff",
  textPrimary: "#e4e4e7",
  textSecondary: "#a1a1aa",
  textTertiary: "#71717a",
  textMuted: "#52525b",
  blue: "#2563eb",
  orange: "#ff5500",
} as const;
```

### Usage rules (Matte)

| Token / role        | Allowed use                                      | Forbidden                          |
|---------------------|--------------------------------------------------|------------------------------------|
| `--bg` / `--surface`| Page background, sheets, elevated panels         | —                                  |
| `--card`            | File rows, list items, cards                     | Filled primary buttons             |
| `--blue`            | Selected card border, checkmark icon             | Brand fill, primary CTA background |
| `--orange`          | Text link/button label "Descargar" / "Cargar"    | Any other UI element               |
| Green / lime / purple | Do not introduce                              | Status text, icons as brand        |

**Feel:** cold, technical, Grok-like. Matte blacks and multiple gray levels. No warm brown undertone.

---

## 2. Theme 2 — Little (Warm)

### CSS custom properties (canonical)

```css
:root {
  --bg:            #1C1B1A;
  --surface:       #2A2927;
  --card:          #2A2927;
  --card-hover:    #353330;

  --border:        rgba(255,255,255,0.1);
  --border-strong: rgba(255,255,255,0.18);

  --text-bright:   #F5F4F0;
  --text-primary:  #F5F4F0;
  --text-secondary:#A8A29E;
  --text-tertiary: #9C9590;

  --accent:        #C65D3B;   /* terracotta — primary CTAs */
  --accent-hover:  #b05031;
  --accent-light:  rgba(198,93,59,0.15);
}
```

### TypeScript tokens

```ts
export const little = {
  bg: "#1C1B1A",
  surface: "#2A2927",
  card: "#2A2927",
  cardHover: "#353330",
  border: "rgba(255,255,255,0.1)",
  borderStrong: "rgba(255,255,255,0.18)",
  textBright: "#F5F4F0",
  textPrimary: "#F5F4F0",
  textSecondary: "#A8A29E",
  textTertiary: "#9C9590",
  accent: "#C65D3B",
  accentHover: "#b05031",
  accentLight: "rgba(198,93,59,0.15)",
} as const;
```

### Usage rules (Little)

| Token / role   | Allowed use                                      | Forbidden                    |
|----------------|--------------------------------------------------|------------------------------|
| `--accent`     | Primary filled buttons (`+ Nuevo proyecto`, Guardar, Aplicar) | Selection-only indicators that should stay neutral |
| `--accent-light` | Soft background for active module chips, icon wells | Full-page backgrounds        |
| Blue / orange (Grok) | Do not use                                   | —                            |

**Feel:** warm charcoal, soft beige-gray text, terracotta CTAs. Claude-project aesthetic.

---

## 3. Theme 3 — Blanco (Light)

### CSS custom properties (canonical)

```css
:root {
  --bg:            #f4f4f5;
  --surface:       #ffffff;
  --card:          #ffffff;
  --card-hover:    #f8f8f9;

  --border:        #e4e4e7;
  --border-strong: #d4d4d8;

  --text-bright:   #18181b;   /* titles — dark gray, not pure black */
  --text-primary:  #3f3f46;   /* names */
  --text-secondary:#71717a;   /* meta */
  --text-tertiary: #a1a1aa;   /* labels / placeholders */

  --blue:          #2563eb;   /* selection + "Descargar" link */
  --blue-soft:     rgba(37,99,235,0.08);
}
```

### TypeScript tokens

```ts
export const blanco = {
  bg: "#f4f4f5",
  surface: "#ffffff",
  card: "#ffffff",
  cardHover: "#f8f8f9",
  border: "#e4e4e7",
  borderStrong: "#d4d4d8",
  textBright: "#18181b",
  textPrimary: "#3f3f46",
  textSecondary: "#71717a",
  textTertiary: "#a1a1aa",
  blue: "#2563eb",
  blueSoft: "rgba(37,99,235,0.08)",
} as const;
```

### Usage rules (Blanco)

| Token / role      | Allowed use                                | Forbidden                    |
|-------------------|--------------------------------------------|------------------------------|
| `--text-bright`   | Titles, primary filled button background   | Body text as pure `#000000`  |
| `--blue`          | Selected card border, link "Descargar"     | Large filled brand blocks    |
| `--blue-soft`     | Selected card background wash              | —                            |

**Feel:** clean light UI, gray hierarchy instead of pure black type, electric blue only for selection and download link.

---

## 4. Shared structural constants (all themes)

These are **layout / geometry** rules shared by all three themes. Colors change; structure does not.

```ts
export const geometry = {
  phoneRadius: 24,      // px — outer phone frame
  cardRadius: 12,       // px — cards, list rows
  buttonRadius: 10,     // px — primary / secondary buttons
  sheetRadiusTop: 28,   // px — bottom sheet top corners
  iconSizeSm: 14,       // px
  iconSizeMd: 16,       // px
  titleSize: 16,        // px
  nameSize: 14,         // px
  metaSize: 12,         // px
  subSize: 11,          // px
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
} as const;
```

**Typography roles (same names in every theme):**

- `.title` → section title (`--text-bright`)
- `.meta` → secondary line under title (`--text-tertiary`)
- `.name` → file / item name (`--text-primary`)
- `.sub` → size / type / status under name (`--text-secondary`)

---

## 5. Accent policy (global)

```
IF theme == matte:
  blue   → selection border + check icon only
  orange → text label "Descargar" / "Cargar" only

IF theme == little:
  accent (terracotta) → filled primary CTAs only
  no Grok blue/orange

IF theme == blanco:
  blue → selection border + text link "Descargar"
  filled primary button uses --text-bright (dark gray) on white text

NEVER introduce:
  - lime / neon green as brand
  - pure black (#000) as body text on light theme
  - filled colored buttons for secondary actions
  - green status text as default (use muted gray + optional icon)
```

---

## 6. Theme switch contract (for implementers)

```ts
type ThemeId = "matte" | "little" | "blanco";

function applyTheme(id: ThemeId, root: HTMLElement = document.documentElement) {
  // Clear previous theme attributes
  root.dataset.theme = id;
  // Application loads the matching :root block or CSS module.
  // Do not interpolate hex values at runtime from mixed themes.
}
```

Pseudo-code for agents:

```
WHEN generating a screen:
  1. Ask / read which theme is active (matte | little | blanco)
  2. Load ONLY that theme's token set
  3. Apply shared geometry + role class names
  4. Apply accent rules for that theme
  5. Never invent a fourth palette
```

---

## 7. Acceptance checklist (every new screen)

- [ ] Uses one of the three locked theme token sets only
- [ ] Title / name / meta / sub roles map to the correct text tokens
- [ ] Selection uses blue (matte/blanco) or terracotta wash (little) per rules
- [ ] "Descargar" uses orange text (matte) or blue link (blanco) or terracotta button only if it is primary CTA (little)
- [ ] No pure `#000000` body text on Blanco
- [ ] No lime / forest / gold / Christmas accents
- [ ] Corner radii match geometry constants
- [ ] Font stack is system-ui (or explicit product decision documented)

---

## 8. Immutable declaration

```
DESIGN LOCK ACTIVE.
Themes Matte, Little, Blanco are immutable as of 2026-08-23.
Any HTML, CSS, or React output that introduces a new primary palette
or violates the accent table is REJECTED.
Map legacy mocks to the nearest approved theme; do not preserve wrong colors.
```

End of document 01.
