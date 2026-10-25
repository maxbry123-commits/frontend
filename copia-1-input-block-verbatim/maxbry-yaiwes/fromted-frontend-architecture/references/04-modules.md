# FROMTED — Architecture & Design Base

**Version:** 1.0.0  
**Date:** 2026-08-23  
**Status:** Canonical base for product + AI agents  
**Depends on:**  
- `01-DESIGN-TOKENS-THEMES-IMMUTABLE.md`  
- `02-UI-COMPONENT-CATALOG-SKILL.md`  
- `03-FUNCTIONAL-INTERACTION-SKILL.md`  
- `04-AGENT-PROTOCOL-SKILL.md`  

---

## 0. Purpose of this document

This markdown is the **architectural and design base** for the entire FROMTED / MAXBRY product family.  
It defines:

1. Which products sit on this base  
2. How design (3 themes) works  
3. Which languages the UI must support  
4. Exact prompts agents must follow when generating frontend code  

All frontend code for these products lives in the **GitHub frontend repository**.  
Attached documents, mocks, or legacy HTML are **mapped** to this architecture; they never replace it.

---

## 1. Product modules (base of the project)

Every screen, panel, or web surface belongs to one of these seven modules:

| # | Module | Role | Primary consumers |
|---|--------|------|-------------------|
| 1 | **MAXBRY AGI** | Core intelligence layer, model routing, reasoning modes | Internal + power users |
| 2 | **AGENTE TEAM YAIWES UI** | Multi-agent team interface, task assignment, agent status | Operators / builders |
| 3 | **ROUTER INTELIGENTE UNIVERSAL** | Universal request router, mode selection (Rápido / Pensar / Auto), bridges to runtime | All clients |
| 4 | **ORQUESTADOR MAXBRY — Panel de ventanas de documentos** | Document windows, file browser, artifacts, pin/search/preview | Users + agents |
| 5 | **ORQUESTADOR AUDITOR Y MEMORIA** | Audit trails, memory graphs, verification dashboards | Ops / compliance |
| 6 | **WEB MAXBRY USUARIO** | End-user web app (chat, files, projects) | End users |
| 7 | **WEB CONFIGURACIÓN INTERNA / COMMAND CENTER** | Internal config, command center, system toggles | Admins |

### Design layer mapping

| Module type | Design system to use |
|-------------|----------------------|
| End-user surfaces (6, parts of 3–4) | **FROMTED themes:** Matte · Little · Blanco |
| Internal ops / Router panels / Auditor (1, 2, 5, 7, engineering zones) | **Operator lock** (carbon + lime `#d9ff43` + IBM Plex Mono) — see `DESIGN-SYSTEM-LOCK-RECOVERY` |
| Shared interaction patterns | Document 03 (Zustand, sheets, lists) — behavior only |

**Rule:** Do not paint end-user FROMTED screens with Operator lime.  
**Rule:** Do not paint internal Command Center with Little terracotta as brand primary.

---

## 2. Design architecture — three immutable themes

The product UI (especially modules 3, 4, 6) supports **exactly three** visual themes.  
Structure (layout, radii, component shapes) is shared. Only tokens change.

### 2.1 Theme Matte (Negro + Grises)

```css
--pure: #000000;
--bg: #0a0a0d;
--surface: #141417;
--panel: #1a1a1e;
--card: #202025;
--card-hover: #282830;
--border: #2a2a33;
--text-bright: #ffffff;
--text-primary: #e4e4e7;
--text-secondary: #a1a1aa;
--text-tertiary: #71717a;
--text-muted: #52525b;
--blue: #2563eb;    /* selection only */
--orange: #ff5500;  /* text "Descargar" / "Cargar" only */
```

**Feel:** cold, technical, Grok-like.

### 2.2 Theme Little (Cálido)

```css
--bg: #1C1B1A;
--surface: #2A2927;
--card: #2A2927;
--card-hover: #353330;
--border: rgba(255,255,255,0.1);
--text-bright: #F5F4F0;
--text-primary: #F5F4F0;
--text-secondary: #A8A29E;
--text-tertiary: #9C9590;
--accent: #C65D3B;       /* primary CTAs only */
--accent-hover: #b05031;
--accent-light: rgba(198,93,59,0.15);
```

**Feel:** warm charcoal, Claude-project aesthetic.

### 2.3 Theme Blanco (Light)

```css
--bg: #f4f4f5;
--surface: #ffffff;
--card: #ffffff;
--card-hover: #f8f8f9;
--border: #e4e4e7;
--border-strong: #d4d4d8;
--text-bright: #18181b;
--text-primary: #3f3f46;
--text-secondary: #71717a;
--text-tertiary: #a1a1aa;
--blue: #2563eb;
--blue-soft: rgba(37,99,235,0.08);
```

**Feel:** clean light UI, gray type hierarchy (no pure black body text).

### 2.4 Shared geometry

```
phone frame radius: 24px
card radius: 12px
button radius: 10px
sheet top radius: 28px
font: system-ui stack for product UI (Operator internal uses IBM Plex Mono)
```

Full tables: see skill document 01.

---

## 3. Languages (i18n) — mandatory

The UI **must** support these four locales:

| Code | Language |
|------|----------|
| `es` | Español |
| `en` | English |
| `fr` | Français |
| `pt` | Português |

### Rules

1. **No hardcoded user-facing strings** in components. Use keys.  
2. Default locale for this product line: **`es`** unless the host app sets another.  
3. Keys live in a single dictionary per locale, e.g.:

```ts
// i18n/es.ts
export default {
  "files.title": "Archivos",
  "files.meta": "Local · {count} elementos",
  "action.download": "Descargar",
  "action.open": "Abrir",
  "mode.fast": "Rápido",
  "mode.think": "Pensar",
  // ...
} as const;
```

4. Accent words like **Descargar / Cargar / Download / Télécharger / Baixar** still obey theme accent rules (orange text on Matte, blue link on Blanco, terracotta CTA on Little when primary).  
5. RTL is out of scope for v1; LTR only.

### Agent duty

When generating UI copy, always emit **keys + Spanish default**, or a small i18n map for the four languages if the user asks for multi-language screens.

---

## 4. Component & interaction base

- **Components:** catalog in skill `02` (phone, header, tabs, cards, sheets, search, bottom nav, toggles, toast).  
- **Interactions:** skill `03` (panel switch, sheet open/close, single select, search filter, composer, download progress).  
- **Agents:** skill `04` (decision tree, forbidden actions, unlock protocol).

Any new screen is assembled from these pieces + one of the three themes + i18n keys.

---

## 5. Relationship to Operator / Router lock

| Concern | System |
|---------|--------|
| End-user FROMTED / MAXBRY web user UI | Matte · Little · Blanco |
| Router internal zones (MEMORY, RUN, TRAIN, SENTINEL, ENGINEERING, …) | Operator: ink/surface + lime + IBM Plex Mono |
| Chat operator functional code (Zustand, SSE, tools) | Behavior from `CHAT-OPERATOR-FUNCTIONAL-FROM-REPOS.md`; **visual** tokens depend on which surface hosts the chat |

Agents must not collapse these two systems into one palette.

---

## 6. Prompts for AI agents (copy-paste blocks)

### 6.1 Global system prompt (always)

```
You are implementing FROMTED / MAXBRY frontend under an immutable design system.

Themes for product UI (choose exactly one per surface unless theme switcher exists):
- matte  (Negro+Grises)
- little (Warm terracotta)
- blanco (Light)

Tokens and accent rules: skill document 01.
Components: skill document 02.
Interactions must be executable: skill document 03.
Agent protocol: skill document 04.

Languages: es | en | fr | pt — no hardcoded UI strings; use i18n keys.
Frontend code lives in the GitHub frontend repository.
Attached mocks/HTML/docs are MAPPED to this architecture; they do not override tokens or themes.
Operator lime (#d9ff43) is for internal Router/ops panels only, not end-user FROMTED product chrome.
```

### 6.2 When generating a new screen

```
Task: generate [screen name] for module [1-7].
Theme: [matte|little|blanco].
Locale default: es (provide keys for en/fr/pt if multi-language requested).
Requirements:
1. Use only tokens from the chosen theme.
2. Compose from component catalog (cards, sheets, tabs, etc.).
3. Wire at least one real interaction (select / sheet / panel switch / search).
4. Accent audit: Matte orange text only for Descargar; Little terracotta only primary CTAs; Blanco blue only selection + Descargar link.
5. Output executable HTML or React+TS modules suitable for the frontend GitHub repo.
```

### 6.3 When receiving legacy HTML / Gemini / Operator mocks

```
Map structure and behavior to FROMTED architecture.
Replace foreign palettes with Matte, Little, or Blanco as specified by the user.
If the surface is internal Router/Command Center, map to Operator tokens instead.
Strip Christmas/NCT/forest-gold if present.
Keep functional intent (lists, sheets, streaming) from CHAT-OPERATOR patterns when relevant.
```

### 6.4 Work method reminder (see also JSON law document)

```
Paso 1 — Forensic X-Ray audit of prior docs and code.
Paso 2 — Plan task batch + LOOPs; no stop / no escalate until batch is ready for GitHub frontend review.
Paso 3 — Execute LOOPs until completion criteria met.
```

---

## 7. Acceptance criteria (product UI)

A deliverable is accepted only if:

- [ ] Module ownership is clear (1–7)  
- [ ] Exactly one theme applied for product surfaces  
- [ ] Tokens match skill 01  
- [ ] Components match skill 02 shapes  
- [ ] Interactions are executable (skill 03)  
- [ ] i18n keys exist for es (and en/fr/pt when required)  
- [ ] Accent rules not violated  
- [ ] No Operator lime on end-user product chrome  
- [ ] Code is suitable to land in the frontend GitHub repo  

---

## 8. Document index

| File | Role |
|------|------|
| This file | Architecture, modules, themes summary, i18n, AI prompts |
| `01-…IMMUTABLE.md` | Full token tables |
| `02-…CATALOG.md` | Component structures |
| `03-…INTERACTION.md` | Runnable patterns |
| `04-…PROTOCOL.md` | Agent decision tree |
| `FROMTED-FRONTEND-IMMUTABLE-LAW.json` | Machine-readable law / validator |

---

**End of architecture base.**  
All agents and humans building FROMTED frontend start here.
