// YAIWES Factory SEG-02 component browser v2.
// REUSE of component-browser-v1.js: search/filter/preview/favorite/recent/insert.
// PATCH: exported mount/engine, isolated text/yaiwes-kind drag payload, v1 preserved.
// Producer does not auto-wire the integrator candidate.

export const COMPONENT_BROWSER_VERSION = 'v2';
export const STORAGE_KEY_V1 = 'yaiwes-factory-component-browser-v1';
export const STORAGE_KEY_V2 = 'yaiwes-factory-component-browser-v2';
export const DRAG_KIND_TYPE = 'text/yaiwes-kind';
export const DRAG_LABEL_TYPE = 'text/yaiwes-label';

const EMPTY_META = () => ({ favorites: [], recent: [] });

function asArray(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === 'string' && item) : [];
}

export function loadBrowserMeta(storage, { migrateV1 = true } = {}) {
  if (!storage || typeof storage.getItem !== 'function') return EMPTY_META();
  try {
    const raw = JSON.parse(storage.getItem(STORAGE_KEY_V2) || 'null');
    if (raw && typeof raw === 'object') {
      return { favorites: asArray(raw.favorites), recent: asArray(raw.recent) };
    }
  } catch {
    /* fail-closed to empty then try v1 */
  }
  if (!migrateV1) return EMPTY_META();
  try {
    const legacy = JSON.parse(storage.getItem(STORAGE_KEY_V1) || 'null');
    if (legacy && typeof legacy === 'object') {
      const migrated = { favorites: asArray(legacy.favorites), recent: asArray(legacy.recent) };
      saveBrowserMeta(storage, migrated);
      return migrated;
    }
  } catch {
    /* ignore corrupt v1 */
  }
  return EMPTY_META();
}

export function saveBrowserMeta(storage, meta) {
  if (!storage || typeof storage.setItem !== 'function') return false;
  storage.setItem(STORAGE_KEY_V2, JSON.stringify({
    favorites: asArray(meta?.favorites),
    recent: asArray(meta?.recent),
  }));
  return true;
}

export function createMemoryDataTransfer() {
  const data = Object.create(null);
  const types = [];
  return {
    effectAllowed: 'none',
    dropEffect: 'none',
    get types() { return types.slice(); },
    setData(type, value) {
      if (!type) return;
      if (!Object.prototype.hasOwnProperty.call(data, type)) types.push(type);
      data[type] = String(value ?? '');
    },
    getData(type) { return Object.prototype.hasOwnProperty.call(data, type) ? data[type] : ''; },
  };
}

export function createComponentBrowserEngine({
  cards = [],
  storage = null,
  now = () => Date.now(),
} = {}) {
  const catalog = cards.map((card) => ({
    kind: String(card.kind || ''),
    label: String(card.label || card.kind || ''),
    category: String(card.category || 'Otros'),
  })).filter((card) => card.kind);

  let selectedKind = null;
  let activeFilter = 'all';
  let query = '';
  let category = 'all';
  let meta = loadBrowserMeta(storage);
  let lastDrag = null;

  function persist() { saveBrowserMeta(storage, meta); }

  function info(kind) {
    return catalog.find((card) => card.kind === kind) || null;
  }

  function visibleCards() {
    const q = query.trim().toLocaleLowerCase();
    return catalog.filter((card) => {
      const matchesText = !q || `${card.label} ${card.kind} ${card.category}`.toLocaleLowerCase().includes(q);
      const matchesCategory = category === 'all' || card.category === category;
      const matchesMode = activeFilter === 'all'
        || (activeFilter === 'favorites' ? meta.favorites.includes(card.kind) : meta.recent.includes(card.kind));
      return matchesText && matchesCategory && matchesMode;
    });
  }

  function select(kind) {
    const card = info(kind);
    if (!card) return { ok: false, reason: 'UNKNOWN_KIND', inserted: false };
    selectedKind = card.kind;
    return { ok: true, inserted: false, kind: card.kind, label: card.label, category: card.category };
  }

  function markRecent(kind) {
    meta.recent = [kind, ...meta.recent.filter((item) => item !== kind)].slice(0, 6);
    persist();
  }

  function replaceCatalog(nextCards = []) {
    catalog.splice(0, catalog.length, ...nextCards.map((card) => ({
      kind: String(card.kind || ''),
      label: String(card.label || card.kind || ''),
      category: String(card.category || 'Otros'),
    })).filter((card) => card.kind));
    if (selectedKind && !info(selectedKind)) selectedKind = null;
    return catalog.map((card) => ({ ...card }));
  }

  return {
    version: COMPONENT_BROWSER_VERSION,
    get selectedKind() { return selectedKind; },
    get filter() { return activeFilter; },
    get query() { return query; },
    get category() { return category; },
    get meta() { return { favorites: [...meta.favorites], recent: [...meta.recent] }; },
    get lastDrag() { return lastDrag ? { ...lastDrag } : null; },
    catalog: () => catalog.map((card) => ({ ...card })),
    replaceCatalog,
    visible: () => visibleCards().map((card) => ({ ...card })),
    categories: () => [...new Set(catalog.map((card) => card.category))].sort(),
    setQuery(value) { query = String(value || ''); return visibleCards(); },
    setCategory(value) { category = String(value || 'all'); return visibleCards(); },
    setFilter(value) {
      activeFilter = ['all', 'favorites', 'recent'].includes(value) ? value : 'all';
      return visibleCards();
    },
    select,
    toggleFavorite(kind = selectedKind) {
      const card = info(kind);
      if (!card) return { ok: false, reason: 'UNKNOWN_KIND' };
      meta.favorites = meta.favorites.includes(card.kind)
        ? meta.favorites.filter((item) => item !== card.kind)
        : [...meta.favorites, card.kind];
      persist();
      return { ok: true, kind: card.kind, favorite: meta.favorites.includes(card.kind) };
    },
    insert(kind = selectedKind) {
      const card = info(kind);
      if (!card) return { ok: false, reason: 'UNKNOWN_KIND', inserted: false };
      selectedKind = card.kind;
      markRecent(card.kind);
      return {
        ok: true,
        inserted: true,
        at: now(),
        kind: card.kind,
        label: card.label,
        category: card.category,
        recent: [...meta.recent],
      };
    },
    bindDragStart(event, kind = selectedKind) {
      const card = info(kind);
      const dt = event?.dataTransfer;
      if (!card) return { ok: false, reason: 'UNKNOWN_KIND' };
      if (!dt || typeof dt.setData !== 'function') return { ok: false, reason: 'NO_DATATRANSFER' };
      dt.effectAllowed = 'copy';
      dt.setData(DRAG_KIND_TYPE, card.kind);
      dt.setData(DRAG_LABEL_TYPE, card.label);
      selectedKind = card.kind;
      lastDrag = {
        kind: card.kind,
        label: card.label,
        types: [DRAG_KIND_TYPE, DRAG_LABEL_TYPE],
        preview: `Arrastrando · ${card.kind} · ${card.category}`,
      };
      return { ok: true, ...lastDrag };
    },
  };
}

export function mountComponentBrowserV2({
  document: doc = globalThis.document,
  library,
  host,
  storage,
  insertHandler,
} = {}) {
  const root = doc || globalThis.document;
  const lib = library || root?.getElementById?.('component-library');
  const pane = host || lib?.closest?.('.library-pane');
  if (!root || !lib || !pane) return { ok: false, reason: 'MISSING_LIBRARY' };

  const readCards = () => [...lib.querySelectorAll('.component-card[data-kind]')].map((card) => ({
    kind: card.dataset.kind,
    label: card.querySelector('strong')?.textContent?.trim() || card.dataset.kind,
    category: card.querySelector('span')?.textContent?.trim() || 'Otros',
    element: card,
  }));

  const store = storage || globalThis.localStorage || null;
  const engine = createComponentBrowserEngine({ cards: readCards(), storage: store });
  root.documentElement.dataset.componentBrowser = COMPONENT_BROWSER_VERSION;

  if (!root.getElementById('component-browser-v2-style')) {
    const style = root.createElement('style');
    style.id = 'component-browser-v2-style';
    style.textContent = `
      .component-browser-v2{display:grid;gap:8px;margin:8px 0 12px;padding:10px;border:1px solid var(--line);border-radius:12px;background:#0f1319}
      .component-browser-row{display:flex;gap:6px;flex-wrap:wrap}.component-browser-row input,.component-browser-row select{min-width:0;flex:1}
      .component-browser-filter{min-height:38px}.component-browser-filter.active{border-color:var(--accent);background:#20283a}
      .component-browser-preview{display:grid;gap:7px;padding:9px;border:1px solid var(--line);border-radius:10px;background:#151a21}
      .component-browser-preview[hidden]{display:none}.component-browser-preview strong{font-size:13px}.component-browser-preview small{color:var(--muted)}
      .component-browser-preview[data-dragging="true"]{border-color:var(--accent);box-shadow:0 0 0 1px var(--accent) inset}
      .component-browser-actions{display:flex;gap:6px}.component-browser-actions button{flex:1;min-height:44px}
      .component-card.browser-hidden{display:none}.component-card.browser-selected{outline:2px solid var(--accent);outline-offset:2px}.component-card.browser-dragging{opacity:.68}
      .component-browser-count{font-size:11px;color:var(--muted)}
    `;
    root.head.append(style);
  }

  const browser = root.createElement('section');
  browser.className = 'component-browser-v2';
  browser.setAttribute('aria-label', 'Browser de componentes');
  browser.innerHTML = `
    <div class="component-browser-row">
      <input data-component-search type="search" placeholder="Buscar componentes" aria-label="Buscar componentes">
      <select data-component-category aria-label="Categoría"></select>
    </div>
    <div class="component-browser-row" role="group" aria-label="Filtros de componentes">
      <button type="button" class="component-browser-filter active" data-component-filter="all">Todos</button>
      <button type="button" class="component-browser-filter" data-component-filter="favorites">Favoritos</button>
      <button type="button" class="component-browser-filter" data-component-filter="recent">Recientes</button>
      <span class="component-browser-count" data-component-count></span>
    </div>
    <div class="component-browser-preview" data-component-preview hidden>
      <strong data-preview-title></strong><small data-preview-meta></small>
      <div class="component-browser-actions">
        <button type="button" data-preview-favorite>☆ Favorito</button>
        <button type="button" class="primary" data-preview-insert>Insertar</button>
      </div>
    </div>`;
  pane.insertBefore(browser, lib);

  const search = browser.querySelector('[data-component-search]');
  const category = browser.querySelector('[data-component-category]');
  const count = browser.querySelector('[data-component-count]');
  const preview = browser.querySelector('[data-component-preview]');
  const previewTitle = browser.querySelector('[data-preview-title]');
  const previewMeta = browser.querySelector('[data-preview-meta]');
  const favoriteButton = browser.querySelector('[data-preview-favorite]');
  const insertButton = browser.querySelector('[data-preview-insert]');
  let allowCanonicalInsert = false;

  function syncCategories() {
    const current = category.value || 'all';
    const cats = engine.categories();
    category.replaceChildren();
    const all = root.createElement('option');
    all.value = 'all';
    all.textContent = 'Todas';
    category.append(all);
    for (const name of cats) {
      const option = root.createElement('option');
      option.value = name;
      option.textContent = name;
      category.append(option);
    }
    category.value = cats.includes(current) ? current : 'all';
    engine.setCategory(category.value);
  }

  function selectedCard() {
    return readCards().find((card) => card.kind === engine.selectedKind) || null;
  }

  function paintPreview(dragging = false) {
    const card = engine.catalog().find((item) => item.kind === engine.selectedKind);
    if (!card) { preview.hidden = true; return; }
    preview.hidden = false;
    previewTitle.textContent = card.label;
    previewMeta.textContent = dragging
      ? `Arrastrando · ${card.kind} · ${card.category}`
      : `${card.kind} · ${card.category}`;
    favoriteButton.textContent = engine.meta.favorites.includes(card.kind) ? '★ Favorito' : '☆ Favorito';
    insertButton.dataset.selectedKind = card.kind;
    preview.dataset.dragging = dragging ? 'true' : '';
    if (!dragging) delete preview.dataset.dragging;
  }

  function applyFilters() {
    const visible = new Set(engine.visible().map((card) => card.kind));
    const cards = readCards();
    cards.forEach((card) => {
      card.element.classList.toggle('browser-hidden', !visible.has(card.kind));
      card.element.classList.toggle('browser-selected', card.kind === engine.selectedKind);
    });
    count.textContent = `${visible.size}/${cards.length}`;
  }

  function enhanceCards() {
    const nextEngineCards = readCards();
    engine.replaceCatalog(nextEngineCards);
    syncCategories();
    nextEngineCards.forEach((card) => {
      const el = card.element;
      if (el.dataset.browserEnhanced === '2') return;
      el.dataset.browserEnhanced = '2';
      el.setAttribute('aria-haspopup', 'dialog');
      el.addEventListener('focus', () => { engine.select(card.kind); paintPreview(); applyFilters(); });
      el.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          event.stopImmediatePropagation();
          engine.select(card.kind);
          paintPreview();
          insertButton.focus();
        }
      }, true);
      el.addEventListener('dragstart', (event) => {
        const bound = engine.bindDragStart(event, card.kind);
        if (!bound.ok) return;
        el.classList.add('browser-dragging');
        paintPreview(true);
      });
      el.addEventListener('dragend', () => {
        el.classList.remove('browser-dragging');
        paintPreview(false);
      });
    });
    applyFilters();
    if (engine.selectedKind) paintPreview();
  }

  lib.addEventListener('click', (event) => {
    const card = event.target.closest('.component-card[data-kind]');
    if (!card || allowCanonicalInsert) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    engine.select(card.dataset.kind);
    paintPreview();
    applyFilters();
  }, true);

  search.addEventListener('input', () => { engine.setQuery(search.value); applyFilters(); });
  category.addEventListener('change', () => { engine.setCategory(category.value); applyFilters(); });
  browser.querySelectorAll('[data-component-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      engine.setFilter(button.dataset.componentFilter);
      browser.querySelectorAll('[data-component-filter]').forEach((item) => {
        item.classList.toggle('active', item === button);
      });
      applyFilters();
    });
  });
  favoriteButton.addEventListener('click', () => {
    engine.toggleFavorite();
    paintPreview();
    applyFilters();
  });
  insertButton.addEventListener('click', () => {
    const card = selectedCard();
    if (!card) return;
    const result = engine.insert(card.kind);
    if (typeof insertHandler === 'function') insertHandler(result);
    allowCanonicalInsert = true;
    try { card.element.click(); } finally { allowCanonicalInsert = false; }
    queueMicrotask(enhanceCards);
  });

  const observer = new MutationObserver(() => queueMicrotask(enhanceCards));
  observer.observe(lib, { childList: true });
  enhanceCards();

  return {
    ok: true,
    version: COMPONENT_BROWSER_VERSION,
    engine,
    element: browser,
    destroy() {
      observer.disconnect();
      browser.remove();
    },
  };
}

export function maybeAutoMountComponentBrowserV2(doc = globalThis.document) {
  if (!doc || typeof doc !== 'object') return { ok: false, reason: 'NO_DOCUMENT' };
  if (doc.documentElement?.dataset?.componentBrowserTarget !== 'v2') {
    return { ok: false, reason: 'NOT_TARGETED' };
  }
  return mountComponentBrowserV2({ document: doc });
}

if (typeof document !== 'undefined') {
  maybeAutoMountComponentBrowserV2(document);
}
