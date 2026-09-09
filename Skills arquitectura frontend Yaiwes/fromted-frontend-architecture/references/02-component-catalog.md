# FROMTED DESIGN SYSTEM — UI Component Catalog (Skill)

**Version:** 1.0.0  
**Depends on:** `01-DESIGN-TOKENS-THEMES-IMMUTABLE.md`  
**Audience:** Claude · Grok · GPT · frontend engineers  
**Rule:** Structure is shared. Colors come only from the active theme tokens.

---

## Purpose

Catalog of **design concepts** extracted from approved FROMTED / Grok Matte / Little / Blanco prototypes.  
Use these patterns when building screens. Do not invent new component shapes that break the visual language.

All examples below are **structural**. Bind colors via CSS variables from document 01.

---

## 1. Phone frame (mobile shell)

**Concept:** Single-column mobile viewport with optional device chrome.

```html
<div class="phone">
  <!-- status bar optional -->
  <!-- header -->
  <!-- scrollable content -->
  <!-- bottom nav or sheet -->
</div>
```

```css
.phone {
  width: 100%;
  max-width: 390px;
  min-height: 100vh;
  margin: 0 auto;
  background: var(--bg);
  border-radius: 24px; /* desktop preview only */
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
```

**States:** full-bleed on real mobile; framed on desktop preview.

---

## 2. Status bar

**Concept:** Thin top strip: time + system icons.

```html
<div class="status-bar">
  <span class="clock">09:41</span>
  <div class="status-icons">
    <i data-lucide="wifi"></i>
    <i data-lucide="battery"></i>
  </div>
</div>
```

```css
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px 4px;
  font-size: 11px;
  color: var(--text-tertiary);
  flex-shrink: 0;
}
```

---

## 3. App header

**Concept:** Logo / title left, 1–2 icon actions right.

```html
<header class="app-header">
  <div class="brand">
    <span class="brand-mark"></span>
    <span class="brand-name">FROMTED</span>
  </div>
  <div class="header-actions">
    <button type="button" class="icon-btn" aria-label="New"><!-- icon --></button>
    <button type="button" class="icon-btn" aria-label="Profile"><!-- icon --></button>
  </div>
</header>
```

```css
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
  flex-shrink: 0;
}
.brand-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-bright);
}
.icon-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  color: var(--text-tertiary);
  border-radius: 10px;
  display: grid;
  place-items: center;
}
.icon-btn:hover { color: var(--text-bright); background: var(--card-hover); }
```

---

## 4. Segmented tabs / top navigation

**Concept:** Horizontal text tabs with underline on active.

```html
<nav class="top-tabs">
  <button type="button" class="tab active" data-tab="chat">Chat</button>
  <button type="button" class="tab" data-tab="files">Archivos</button>
  <button type="button" class="tab" data-tab="explore">Explorar</button>
</nav>
```

```css
.top-tabs {
  display: flex;
  gap: 20px;
  padding: 0 16px;
  border-bottom: 1px solid var(--border);
  overflow-x: auto;
}
.tab {
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 10px 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-tertiary);
  white-space: nowrap;
}
.tab.active {
  color: var(--text-bright);
  border-bottom-color: var(--blue); /* matte/blanco; little may use --accent */
}
```

**Interaction:** clicking a tab shows the matching view panel; only one active.

---

## 5. Card / list row

**Concept:** Rounded container for one file, folder, or setting row.

```html
<div class="card" data-id="doc1">
  <div class="card-body">
    <div class="name">plan-fromted.md</div>
    <div class="sub">MD · 12 KB</div>
  </div>
  <button type="button" class="icon-btn" aria-label="Download"><!-- icon --></button>
</div>
```

```css
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  transition: background 0.15s ease, border-color 0.15s ease;
}
.card:hover { background: var(--card-hover); }
.card.selected {
  border-color: var(--blue);           /* matte / blanco */
  background: var(--blue-soft);        /* blanco */
  /* little: border-color: var(--accent); background: var(--accent-light); */
}
.name { font-size: 14px; color: var(--text-primary); font-weight: 500; }
.sub  { font-size: 11px; color: var(--text-secondary); margin-top: 2px; }
```

**Variants:**
- With leading icon well (32×32 rounded square)
- With trailing pin / plus / download icon
- Selected state (border + optional soft fill)

---

## 6. Search field

**Concept:** Full-width input with leading search icon.

```html
<div class="search-field">
  <i data-lucide="search" class="search-icon"></i>
  <input type="search" placeholder="Buscar archivo..." />
</div>
```

```css
.search-field {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 12px;
  background: var(--surface);
  border: 1px solid var(--border);
}
.search-field input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 12px;
  color: var(--text-primary);
}
.search-field input::placeholder { color: var(--text-tertiary); }
.search-icon { width: 14px; height: 14px; color: var(--text-tertiary); }
```

---

## 7. Primary button / secondary button / text link

**Concept:** Three action strengths.

```html
<button type="button" class="btn-primary">Abrir</button>
<button type="button" class="btn-secondary">Duplicar</button>
<button type="button" class="btn-link">Descargar</button>
```

```css
.btn-primary {
  border: none;
  border-radius: 10px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  /* matte: rarely filled; prefer link-orange for download */
  /* little: background: var(--accent); color: #fff; */
  /* blanco: background: var(--text-bright); color: #fff; */
}
.btn-secondary {
  background: var(--surface);
  color: var(--text-primary);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 500;
}
.btn-link {
  background: none;
  border: none;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  /* matte: color: var(--orange); */
  /* blanco: color: var(--blue); */
  /* little: often use btn-primary instead */
}
```

**Rule reminder:** on Matte, "Descargar" is almost always `.btn-link` in orange, not a filled bar.

---

## 8. Bottom sheet / modal sheet

**Concept:** Panel sliding up from bottom with drag handle.

```html
<div class="sheet-backdrop" hidden></div>
<div class="sheet" role="dialog" aria-modal="true" hidden>
  <div class="sheet-handle"></div>
  <header class="sheet-header">
    <h2 class="title">Directorio</h2>
    <button type="button" class="icon-btn" aria-label="Close"><!-- x --></button>
  </header>
  <div class="sheet-body"><!-- content --></div>
  <footer class="sheet-footer">
    <button type="button" class="btn-secondary flex-1">Cerrar</button>
    <button type="button" class="btn-primary flex-1">Descargar</button>
  </footer>
</div>
```

```css
.sheet-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.45);
  z-index: 40;
}
.sheet {
  position: fixed; left: 0; right: 0; bottom: 0;
  max-height: 85vh;
  background: var(--surface);
  border-radius: 28px 28px 0 0;
  border-top: 1px solid var(--border);
  z-index: 50;
  display: flex;
  flex-direction: column;
  padding: 8px 16px 16px;
}
.sheet-handle {
  width: 36px; height: 4px;
  border-radius: 4px;
  background: var(--text-muted);
  margin: 4px auto 12px;
  opacity: 0.6;
}
.sheet-footer {
  display: flex;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}
```

**Interaction:**
- Open: remove `hidden`, animate translateY(100% → 0)
- Close: backdrop click, X button, or swipe down (optional)
- Focus trap while open

---

## 9. Mode / option list (selector)

**Concept:** Vertical list of options; one selected with check.

```html
<div class="option-list">
  <button type="button" class="option">
    <i data-lucide="zap"></i>
    <div>
      <div class="name">Rápido</div>
      <div class="sub">Respuestas instantáneas</div>
    </div>
  </button>
  <button type="button" class="option selected">
    <i data-lucide="brain"></i>
    <div>
      <div class="name">Pensar</div>
      <div class="sub">Razonamiento profundo</div>
    </div>
    <i data-lucide="check" class="check"></i>
  </button>
</div>
```

```css
.option-list {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 4px;
}
.option {
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px;
  border: none;
  background: transparent;
  border-radius: 12px;
  text-align: left;
  color: var(--text-primary);
  cursor: pointer;
}
.option.selected {
  background: var(--card-hover);
  /* optional: border: 1px solid var(--blue); */
}
.option .check { color: var(--blue); margin-left: auto; }
```

---

## 10. Quick action grid (4-up)

**Concept:** Equal tiles for camera / photos / files / etc.

```html
<div class="quick-grid">
  <button type="button" class="quick-tile">
    <i data-lucide="camera"></i>
    <span>Cámara</span>
  </button>
  <!-- ×3 more -->
</div>
```

```css
.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}
.quick-tile {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 12px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-secondary);
}
.quick-tile i { color: var(--text-bright); width: 20px; height: 20px; }
```

---

## 11. Bottom tab bar (app navigation)

**Concept:** Fixed footer with 4–6 icon+label items.

```html
<nav class="bottom-nav">
  <button type="button" class="nav-item active" data-panel="dashboard">
    <i data-lucide="home"></i>
    <span>Inicio</span>
  </button>
  <!-- more items -->
</nav>
```

```css
.bottom-nav {
  position: absolute; left: 0; right: 0; bottom: 0;
  display: flex;
  justify-content: space-around;
  padding: 8px 4px calc(8px + env(safe-area-inset-bottom));
  background: var(--surface);
  border-top: 1px solid var(--border);
  z-index: 30;
}
.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: none;
  border: none;
  color: var(--text-tertiary);
  font-size: 9px;
  font-weight: 600;
}
.nav-item.active { color: var(--text-bright); }
```

---

## 12. Toggle row (settings)

**Concept:** Label + description + switch.

```html
<div class="card toggle-row">
  <div>
    <div class="name">Tema oscuro warm</div>
    <div class="sub">#1C1B1A activo</div>
  </div>
  <button type="button" class="switch on" role="switch" aria-checked="true">
    <span class="switch-knob"></span>
  </button>
</div>
```

```css
.switch {
  width: 32px; height: 16px;
  border-radius: 999px;
  border: none;
  padding: 2px;
  background: #333; /* theme-dependent */
  display: flex;
  justify-content: flex-start;
  cursor: pointer;
}
.switch.on {
  justify-content: flex-end;
  background: var(--accent); /* little */ /* or var(--blue) / var(--text-bright) */
}
.switch-knob {
  width: 12px; height: 12px;
  border-radius: 50%;
  background: #fff;
}
```

---

## 13. Progress / storage bar

**Concept:** Thin track + fill for storage or download progress.

```html
<div class="progress-track">
  <div class="progress-fill" style="width:22%"></div>
</div>
```

```css
.progress-track {
  height: 6px;
  border-radius: 999px;
  background: var(--border);
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: var(--text-bright); /* or var(--accent) / var(--orange) per theme */
  transition: width 0.3s ease;
}
```

---

## 14. Empty state

**Concept:** Centered short message when list is empty.

```html
<div class="empty-state">
  <div class="name">Sin archivos</div>
  <div class="sub">Sube o crea un documento para empezar</div>
</div>
```

```css
.empty-state {
  text-align: center;
  padding: 48px 24px;
  color: var(--text-tertiary);
}
```

---

## 15. Toast (feedback)

**Concept:** Temporary bottom notice.

```html
<div class="toast" role="status">Archivo anclado</div>
```

```css
.toast {
  position: fixed;
  left: 50%;
  bottom: 88px;
  transform: translateX(-50%);
  background: var(--card);
  color: var(--text-primary);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 16px;
  font-size: 12px;
  z-index: 60;
  box-shadow: 0 8px 24px rgba(0,0,0,0.25);
}
```

---

## Component assembly map

| Screen              | Components used                                      |
|---------------------|------------------------------------------------------|
| Chat                | Header, top tabs, mode pill, message cards, composer |
| Archivos / Directorio | Header, search, filter chips, card list, sheet footer |
| Mode selector       | Sheet, option list, apply button                     |
| Agregar al chat     | Sheet, quick grid, tool rows with checks             |
| Ajustes             | Card list, toggle rows, primary/secondary buttons    |
| Multi-panel app     | Bottom nav + panel switcher + phone frame            |

---

## Agent instruction (pseudo-code)

```
WHEN building a new screen:
  1. Identify which components from this catalog apply
  2. Compose HTML structure using the class names above
  3. Apply theme tokens from document 01 (do not hardcode hex outside tokens)
  4. Wire interaction per document 03
  5. Verify accent rules (selection / Descargar / CTA)
```

End of document 02.
