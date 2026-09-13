const library = document.getElementById('component-library');
const host = library?.closest('.library-pane');
const STORAGE_KEY = 'yaiwes-factory-component-browser-v1';

if (library && host) {
  document.documentElement.dataset.componentBrowser = 'v1';
  let selectedKind = null;
  let allowCanonicalInsert = false;
  let meta = loadMeta();

  const style = document.createElement('style');
  style.id = 'component-browser-v1-style';
  style.textContent = `
    .component-browser-v1{display:grid;gap:8px;margin:8px 0 12px;padding:10px;border:1px solid var(--line);border-radius:12px;background:#0f1319}
    .component-browser-row{display:flex;gap:6px;flex-wrap:wrap}.component-browser-row input,.component-browser-row select{min-width:0;flex:1}
    .component-browser-filter{min-height:38px}.component-browser-filter.active{border-color:var(--accent);background:#20283a}
    .component-browser-preview{display:grid;gap:7px;padding:9px;border:1px solid var(--line);border-radius:10px;background:#151a21}
    .component-browser-preview[hidden]{display:none}.component-browser-preview strong{font-size:13px}.component-browser-preview small{color:var(--muted)}
    .component-browser-actions{display:flex;gap:6px}.component-browser-actions button{flex:1;min-height:44px}
    .component-card.browser-hidden{display:none}.component-card.browser-selected{outline:2px solid var(--accent);outline-offset:2px}
    .component-browser-count{font-size:11px;color:var(--muted)}
  `;
  document.head.append(style);

  const browser = document.createElement('section');
  browser.className = 'component-browser-v1';
  browser.setAttribute('aria-label', 'Browser de componentes');
  browser.innerHTML = `
    <div class="component-browser-row">
      <input data-component-search type="search" placeholder="Buscar componentes" aria-label="Buscar componentes">
      <select data-component-category aria-label="Categoría"><option value="all">Todas</option></select>
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
  host.insertBefore(browser, library);

  const search = browser.querySelector('[data-component-search]');
  const category = browser.querySelector('[data-component-category]');
  const count = browser.querySelector('[data-component-count]');
  const preview = browser.querySelector('[data-component-preview]');
  const previewTitle = browser.querySelector('[data-preview-title]');
  const previewMeta = browser.querySelector('[data-preview-meta]');
  const favoriteButton = browser.querySelector('[data-preview-favorite]');
  const insertButton = browser.querySelector('[data-preview-insert]');
  let activeFilter = 'all';

  function loadMeta() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return { favorites: Array.isArray(raw.favorites) ? raw.favorites : [], recent: Array.isArray(raw.recent) ? raw.recent : [] };
    } catch { return { favorites: [], recent: [] }; }
  }
  function saveMeta() { localStorage.setItem(STORAGE_KEY, JSON.stringify(meta)); }
  function cards() { return [...library.querySelectorAll('.component-card[data-kind]')]; }
  function info(card) {
    return { kind: card.dataset.kind, label: card.querySelector('strong')?.textContent?.trim() || card.dataset.kind, category: card.querySelector('span')?.textContent?.trim() || 'Otros' };
  }
  function rebuildCategories() {
    const current = category.value || 'all';
    const cats = [...new Set(cards().map(c => info(c).category))].sort();
    category.innerHTML = '<option value="all">Todas</option>' + cats.map(x => `<option value="${x.replace(/"/g,'&quot;')}">${x}</option>`).join('');
    category.value = cats.includes(current) ? current : 'all';
  }
  function select(card) {
    cards().forEach(c => c.classList.toggle('browser-selected', c === card));
    const data = info(card); selectedKind = data.kind;
    preview.hidden = false;
    previewTitle.textContent = data.label;
    previewMeta.textContent = `${data.kind} · ${data.category}`;
    favoriteButton.textContent = meta.favorites.includes(data.kind) ? '★ Favorito' : '☆ Favorito';
    insertButton.dataset.selectedKind = data.kind;
  }
  function selectedCard() { return cards().find(c => c.dataset.kind === selectedKind) || null; }
  function markRecent(kind) {
    meta.recent = [kind, ...meta.recent.filter(x => x !== kind)].slice(0, 6);
    saveMeta();
  }
  function applyFilters() {
    const q = search.value.trim().toLocaleLowerCase();
    const cat = category.value;
    let visible = 0;
    cards().forEach(card => {
      const data = info(card);
      const matchesText = !q || `${data.label} ${data.kind} ${data.category}`.toLocaleLowerCase().includes(q);
      const matchesCategory = cat === 'all' || data.category === cat;
      const matchesMode = activeFilter === 'all' || (activeFilter === 'favorites' ? meta.favorites.includes(data.kind) : meta.recent.includes(data.kind));
      const show = matchesText && matchesCategory && matchesMode;
      card.classList.toggle('browser-hidden', !show);
      if (show) visible += 1;
    });
    count.textContent = `${visible}/${cards().length}`;
  }
  function enhanceCards() {
    rebuildCategories();
    cards().forEach(card => {
      if (card.dataset.browserEnhanced === '1') return;
      card.dataset.browserEnhanced = '1';
      card.setAttribute('aria-haspopup', 'dialog');
      card.addEventListener('focus', () => select(card));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); e.stopImmediatePropagation(); select(card); insertButton.focus();
        }
      }, true);
      card.addEventListener('dragstart', e => {
        const data = info(card);
        if (e.dataTransfer) {
          e.dataTransfer.setData('text/yaiwes-kind', data.kind);
          e.dataTransfer.setData('text/yaiwes-label', data.label);
          e.dataTransfer.effectAllowed = 'copyMove';
        }
        const ghost = card.cloneNode(true);
        ghost.classList.remove('browser-hidden');
        ghost.style.cssText='position:fixed;left:-9999px;top:-9999px;width:180px;opacity:.9;pointer-events:none';
        document.body.append(ghost);
        card.__yaiwesDragGhost = ghost;
        e.dataTransfer?.setDragImage?.(ghost, 20, 20);
      });
      card.addEventListener('dragend', () => {
        card.__yaiwesDragGhost?.remove();
        card.__yaiwesDragGhost = null;
      });
    });
    applyFilters();
    if (selectedKind) { const c = selectedCard(); if (c) select(c); }
  }

  library.addEventListener('click', e => {
    const card = e.target.closest('.component-card[data-kind]');
    if (!card || allowCanonicalInsert) return;
    e.preventDefault(); e.stopImmediatePropagation(); select(card);
  }, true);

  search.addEventListener('input', applyFilters);
  category.addEventListener('change', applyFilters);
  browser.querySelectorAll('[data-component-filter]').forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.componentFilter;
    browser.querySelectorAll('[data-component-filter]').forEach(b => b.classList.toggle('active', b === button));
    applyFilters();
  }));
  favoriteButton.addEventListener('click', () => {
    if (!selectedKind) return;
    meta.favorites = meta.favorites.includes(selectedKind) ? meta.favorites.filter(x => x !== selectedKind) : [...meta.favorites, selectedKind];
    saveMeta(); const c = selectedCard(); if (c) select(c); applyFilters();
  });
  insertButton.addEventListener('click', () => {
    const card = selectedCard(); if (!card) return;
    allowCanonicalInsert = true;
    try { card.click(); markRecent(card.dataset.kind); } finally { allowCanonicalInsert = false; }
    queueMicrotask(enhanceCards);
  });

  new MutationObserver(() => queueMicrotask(enhanceCards)).observe(library, { childList: true });
  enhanceCards();
}
