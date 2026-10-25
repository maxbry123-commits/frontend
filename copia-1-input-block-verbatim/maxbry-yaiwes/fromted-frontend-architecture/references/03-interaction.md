# FROMTED DESIGN SYSTEM — Functional Interaction Skill

**Version:** 1.0.0  
**Depends on:** `01-DESIGN-TOKENS-THEMES-IMMUTABLE.md`, `02-UI-COMPONENT-CATALOG-SKILL.md`  
**Audience:** Engineers and AI agents implementing executable UI  
**Rule:** Examples must open and respond to user input — not static mocks.

---

## Purpose

Convert visual components into **interactive, runnable behavior**.  
Every pattern below is written so it can be pasted into a single HTML file or a React module and work without a backend (local state first). Bridges to API are optional layers.

---

## 1. Panel / view switching

**Goal:** One visible panel at a time; tab or bottom-nav drives visibility.

### Vanilla JS pattern

```js
function switchPanel(panelId) {
  document.querySelectorAll(".panel-content").forEach((el) => {
    el.classList.add("hidden");
  });
  const target = document.getElementById(panelId);
  if (target) target.classList.remove("hidden");

  document.querySelectorAll(".nav-item, .tab").forEach((btn) => {
    const isActive = btn.getAttribute("data-target") === panelId
      || btn.getAttribute("data-tab") === panelId.replace("panel-", "");
    btn.classList.toggle("active", Boolean(isActive));
    // Theme-safe: prefer class; color comes from CSS .active rules
  });
}
```

### React + Zustand sketch

```ts
// store slice
activePanel: "files" | "chat" | "settings" | ...
setActivePanel: (id) => set({ activePanel: id })

// component
{activePanel === "files" && <FilesPanel />}
{activePanel === "chat" && <ChatPanel />}
```

**Acceptance:** Clicking every nav item shows a different panel; previous panel is fully hidden (not just opacity 0 without pointer-events none).

---

## 2. Bottom sheet open / close

```js
const sheet = document.getElementById("mode-sheet");
const backdrop = document.getElementById("mode-backdrop");

function openSheet() {
  backdrop.hidden = false;
  sheet.hidden = false;
  requestAnimationFrame(() => {
    sheet.classList.add("is-open"); // CSS: transform translateY(0)
  });
  // optional: trap focus
}

function closeSheet() {
  sheet.classList.remove("is-open");
  window.setTimeout(() => {
    sheet.hidden = true;
    backdrop.hidden = true;
  }, 280); // match CSS transition
}

backdrop?.addEventListener("click", closeSheet);
document.getElementById("close-sheet-btn")?.addEventListener("click", closeSheet);
```

```css
.sheet {
  transform: translateY(100%);
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.sheet.is-open { transform: translateY(0); }
```

---

## 3. Selectable list (single selection)

```js
const items = [
  { id: "doc1", name: "plan-fromted.md", sub: "MD · 12 KB", selected: true },
  { id: "doc2", name: "spec.pdf", sub: "PDF · 3.4 MB", selected: false },
];

function selectItem(id) {
  items.forEach((i) => { i.selected = i.id === id; });
  renderList();
  updateActionBar(); // show Abrir / Descargar when selection exists
}

function renderList() {
  const root = document.getElementById("file-list");
  root.innerHTML = items.map((i) => `
    <div class="card ${i.selected ? "selected" : ""}" data-id="${i.id}">
      <div>
        <div class="name">${escapeHtml(i.name)}</div>
        <div class="sub">${escapeHtml(i.sub)}</div>
      </div>
    </div>
  `).join("");
  root.querySelectorAll(".card").forEach((el) => {
    el.addEventListener("click", () => selectItem(el.dataset.id));
  });
}
```

**Theme note:** `.selected` styles use `var(--blue)` / `var(--blue-soft)` or Little `var(--accent)` — never hardcode.

---

## 4. Mode selector (apply on confirm)

```js
const MODES = {
  fast: { title: "Rápido", desc: "Respuestas instantáneas", icon: "zap" },
  think: { title: "Pensar", desc: "Razonamiento profundo", icon: "brain" },
  balanced: { title: "Equilibrado", desc: "Balance velocidad/profundidad", icon: "compass" },
  auto: { title: "Auto", desc: "Enrutamiento adaptativo", icon: "sparkles" },
};

let draftMode = "fast";
let activeMode = "fast";

function renderModeOptions() {
  // mark .option.selected where key === draftMode
}

function applyMode() {
  activeMode = draftMode;
  // update mode pill in chat header
  document.getElementById("current-mode-title").textContent = MODES[activeMode].title;
  closeSheet();
}
```

**UX:** Selection in sheet is draft until user taps "Aplicar"; cancel restores previous.

---

## 5. Search / filter list

```js
const searchInput = document.getElementById("file-search-input");
searchInput?.addEventListener("input", () => {
  const q = searchInput.value.trim().toLowerCase();
  const filtered = items.filter((i) => i.name.toLowerCase().includes(q));
  renderList(filtered);
});
```

Debounce optional (150–200 ms) for large lists.

---

## 6. Composer send (local echo, stream-ready)

```js
const form = document.getElementById("chat-form");
const input = document.getElementById("chat-input");
const stream = document.getElementById("chat-messages");

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  appendMessage("user", text);
  input.value = "";
  // Local demo assistant reply:
  appendMessage("assistant", "Recibido. (demo local — conectar stream en producción)");
});

function appendMessage(role, content) {
  const div = document.createElement("div");
  div.className = `msg msg-${role}`;
  div.innerHTML = `<p class="name">${role === "user" ? "Tú" : "Grok"}</p>
                   <p>${escapeHtml(content)}</p>`;
  stream.appendChild(div);
  stream.scrollTop = stream.scrollHeight;
}
```

**Production bridge (optional):** replace local reply with SSE / fetch stream; keep UI tokens append pattern from CHAT-OPERATOR document.

---

## 7. Download action (progress demo)

```js
async function downloadAllFiles() {
  const bar = document.getElementById("download-progress-bar");
  const inner = document.getElementById("download-progress-inner");
  const label = document.getElementById("download-btn-text");
  bar?.classList.remove("hidden");
  label.textContent = "Preparando…";
  for (let p = 0; p <= 100; p += 10) {
    inner.style.width = p + "%";
    await new Promise((r) => setTimeout(r, 80));
  }
  label.textContent = "Listo";
  // Theme: progress fill uses orange soft on matte, blue on blanco, accent on little
}
```

On Matte the trigger control is typically orange **text** "Descargar", not a full-width filled orange bar (unless product decides otherwise for package download).

---

## 8. Toggle switch

```js
document.querySelectorAll(".switch").forEach((el) => {
  el.addEventListener("click", () => {
    const on = el.classList.toggle("on");
    el.setAttribute("aria-checked", String(on));
    // persist: localStorage or store
  });
});
```

---

## 9. Pin / unpin item

```js
function togglePin(id) {
  const item = items.find((i) => i.id === id);
  if (!item) return;
  item.pinned = !item.pinned;
  renderList();
  renderPinnedList();
  showToast(item.pinned ? "Anclado" : "Desanclado");
}
```

---

## 10. Toast helper

```js
let toastTimer;
function showToast(message) {
  let el = document.getElementById("app-toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "app-toast";
    el.className = "toast";
    el.setAttribute("role", "status");
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 2200);
}
```

---

## 11. Minimal executable HTML skeleton (theme-agnostic)

Use this as the base for any demo screen. Swap the `:root` block for Matte, Little, or Blanco from document 01.

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>FROMTED Demo</title>
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    /* PASTE ONE THEME :root FROM DOC 01 */
    * { box-sizing: border-box; }
    body { margin: 0; font-family: system-ui, sans-serif; background: #111; }
    .phone { max-width: 390px; margin: 0 auto; min-height: 100vh; background: var(--bg); color: var(--text-primary); display: flex; flex-direction: column; }
    .hidden { display: none !important; }
    /* import component CSS from doc 02 as needed */
  </style>
</head>
<body>
  <div class="phone">
    <header class="app-header">...</header>
    <main id="view-root" class="flex-1 overflow-y-auto">...</main>
    <nav class="bottom-nav">...</nav>
  </div>
  <script>
    lucide.createIcons();
    // wire switchPanel, selectItem, openSheet, etc.
  </script>
</body>
</html>
```

---

## 12. React operational layer (reference)

When the product needs real state (not only demo HTML), follow the patterns in `CHAT-OPERATOR-FUNCTIONAL-FROM-REPOS.md`:

- Zustand store for threads, messages, input, attachments, streaming
- `useSendMessage` with AbortController
- Composer: Enter send, Shift+Enter newline, file attach
- MessageList: reasoning collapse, tool call cards
- ThreadSidebar: list / open / new chat
- SessionHud: model + runtime health pills

**Mapping to FROMTED themes:**

```
Operator lime / carbon  →  DO NOT use for FROMTED product UI
FROMTED product UI      →  Matte | Little | Blanco only

Operator code is a *behavioral* reference (state, stream, tools).
Visual tokens for FROMTED screens always come from document 01.
```

---

## 13. Interaction acceptance checklist

- [ ] Tabs / bottom nav switch panels without full page reload
- [ ] Sheets open and close with visible motion
- [ ] List selection updates UI immediately
- [ ] Search filters list on input
- [ ] Primary actions have visible pressed/hover feedback
- [ ] "Descargar" respects theme accent rule
- [ ] No dead buttons (every control either works or is clearly disabled)
- [ ] Keyboard: Enter submits composer; Escape closes sheet (recommended)

---

## Agent pseudo-code

```
WHEN asked for an executable demo:
  1. Choose theme (matte | little | blanco)
  2. Build structure from component catalog
  3. Attach JS handlers from this document
  4. Ensure at least: panel switch OR sheet open OR list select works on first load
  5. Do not ship pure static HTML labeled as "functional"
```

End of document 03.
