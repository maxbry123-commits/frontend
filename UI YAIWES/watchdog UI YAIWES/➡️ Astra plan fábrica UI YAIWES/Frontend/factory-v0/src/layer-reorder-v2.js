const PROJECT_KEY = 'yaiwes-factory-project-v19';
export const LAYER_REORDER_VERSION = '2.0.0';
export const SEGMENT_ID = 'SEG-05-CONTROLS';
export const PROJECT_KEY_V2 = PROJECT_KEY;

const clone = (value) => JSON.parse(JSON.stringify(value));

function snapshot(state) {
  const next = clone(state);
  next.history = [];
  next.future = [];
  return next;
}

function readProject(storage) {
  const raw = storage?.getItem?.(PROJECT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeProject(storage, project) {
  project.savedAt = new Date().toISOString();
  storage.setItem(PROJECT_KEY, JSON.stringify(project));
}

function withLayerMutation(id, storage, mutate) {
  const project = readProject(storage);
  const state = project?.state;
  if (!project || !state || !Array.isArray(state.components)) {
    return { changed: false, reason: 'INVALID_PROJECT' };
  }
  const index = state.components.findIndex((component) => component.id === id);
  if (index < 0) return { changed: false, reason: 'MISSING' };
  const previous = snapshot(state);
  const components = clone(state.components);
  const result = mutate(components, index, state);
  if (!result || result.changed === false) return result || { changed: false, reason: 'NOOP' };
  project.state = {
    ...state,
    components,
    selectedId: id,
    history: [...(state.history || []), previous].slice(-50),
    future: [],
  };
  writeProject(storage, project);
  return {
    changed: true,
    id,
    order: components.map((component) => component.id),
    hidden: Boolean(components[components.findIndex((component) => component.id === id)]?.hidden),
    locked: Boolean(components[components.findIndex((component) => component.id === id)]?.locked),
    ...result,
  };
}

export function getCanonicalLayerState(id, storage = globalThis.localStorage) {
  const project = readProject(storage);
  const components = project?.state?.components;
  if (!Array.isArray(components)) return null;
  const index = components.findIndex((component) => component.id === id);
  if (index < 0) return null;
  const component = components[index];
  const hidden = Boolean(component.hidden);
  const locked = Boolean(component.locked);
  return {
    id,
    index,
    hidden,
    locked,
    visible: !hidden,
    order: components.map((item) => item.id),
  };
}

export function setLayerHidden(id, hidden, storage = globalThis.localStorage) {
  return withLayerMutation(id, storage, (components, index) => {
    const next = Boolean(hidden);
    if (Boolean(components[index].hidden) === next) return { changed: false, reason: 'NOOP' };
    components[index].hidden = next;
    return { from: index, hidden: next, visible: !next };
  });
}

export function setLayerLocked(id, locked, storage = globalThis.localStorage) {
  return withLayerMutation(id, storage, (components, index) => {
    const next = Boolean(locked);
    if (Boolean(components[index].locked) === next) return { changed: false, reason: 'NOOP' };
    components[index].locked = next;
    return { from: index, locked: next };
  });
}

export function canMoveOrResize(id, storage = globalThis.localStorage) {
  const canonical = getCanonicalLayerState(id, storage);
  if (!canonical) return false;
  return !canonical.locked;
}

export function guardMove(id, x, y, storage = globalThis.localStorage) {
  if (!canMoveOrResize(id, storage)) return { allowed: false, reason: 'LOCKED', id, x, y };
  return { allowed: true, id, x, y };
}

export function guardResize(id, w, h, storage = globalThis.localStorage) {
  if (!canMoveOrResize(id, storage)) return { allowed: false, reason: 'LOCKED', id, w, h };
  return { allowed: true, id, w, h };
}

export function reorderPersistedLayerTo(id, toIndex, storage = globalThis.localStorage) {
  return withLayerMutation(id, storage, (components, from) => {
    const to = Math.max(0, Math.min(components.length - 1, Number(toIndex)));
    if (!Number.isFinite(to) || from === to) return { changed: false, reason: from === to ? 'NOOP' : 'BOUNDARY' };
    const [item] = components.splice(from, 1);
    components.splice(to, 0, item);
    return { from, to };
  });
}

export function reorderPersistedLayer(id, direction, storage = globalThis.localStorage) {
  const canonical = getCanonicalLayerState(id, storage);
  if (!canonical) return { changed: false, reason: 'MISSING' };
  const to = canonical.index + Number(direction);
  if (to < 0 || to >= canonical.order.length) return { changed: false, reason: 'BOUNDARY' };
  return reorderPersistedLayerTo(id, to, storage);
}

function restoreFromStack(storage, stackKey, otherKey) {
  const project = readProject(storage);
  const state = project?.state;
  if (!project || !state || !Array.isArray(state[stackKey]) || !state[stackKey].length) {
    return { changed: false, reason: stackKey === 'history' ? 'NO_HISTORY' : 'NO_FUTURE' };
  }
  const current = snapshot(state);
  const restored = clone(state[stackKey][stackKey === 'history' ? state[stackKey].length - 1 : 0]);
  restored.history = stackKey === 'history' ? state.history.slice(0, -1) : [...(state.history || []), current].slice(-50);
  restored.future = stackKey === 'history'
    ? [current, ...(state.future || [])].slice(0, 50)
    : state.future.slice(1);
  project.state = restored;
  writeProject(storage, project);
  return {
    changed: true,
    order: (restored.components || []).map((component) => component.id),
    selectedId: restored.selectedId,
  };
}

export function undoLayer(storage = globalThis.localStorage) {
  return restoreFromStack(storage, 'history', 'future');
}

export function redoLayer(storage = globalThis.localStorage) {
  return restoreFromStack(storage, 'future', 'history');
}

function applyCanonicalDom(doc, storage) {
  const project = readProject(storage);
  const components = project?.state?.components || [];
  for (const component of components) {
    const hidden = Boolean(component.hidden);
    const locked = Boolean(component.locked);
    const layer = doc.querySelector?.(`[data-layer="${component.id}"]`);
    if (layer) {
      layer.dataset.hidden = hidden ? 'true' : 'false';
      layer.dataset.locked = locked ? 'true' : 'false';
      layer.setAttribute('aria-hidden', hidden ? 'true' : 'false');
    }
    const node = doc.querySelector?.(`[data-node="${component.id}"]`);
    if (node) {
      node.dataset.locked = locked ? 'true' : 'false';
      node.dataset.hidden = hidden ? 'true' : 'false';
      if (node.style) node.style.display = hidden ? 'none' : '';
    }
  }
}

function decorateLayers(doc) {
  const layers = [...(doc.querySelectorAll?.('#layer-list [data-layer]') || [])];
  layers.forEach((layer, index) => {
    if (layer.querySelector?.('[data-layer-reorder-controls]')) return;
    const controls = doc.createElement('span');
    controls.dataset.layerReorderControls = '1';
    controls.className = 'layer-reorder-controls';
    controls.innerHTML = [
      `<span role="button" tabindex="0" aria-label="Ocultar o mostrar capa" data-layer-visibility="toggle">👁</span>`,
      `<span role="button" tabindex="0" aria-label="Bloquear o desbloquear capa" data-layer-lock="toggle">🔒</span>`,
      `<span role="button" tabindex="0" aria-label="Subir capa" data-layer-move="-1" ${index === 0 ? 'aria-disabled="true"' : ''}>↑</span>`,
      `<span role="button" tabindex="0" aria-label="Bajar capa" data-layer-move="1" ${index === layers.length - 1 ? 'aria-disabled="true"' : ''}>↓</span>`,
    ].join('');
    layer.appendChild(controls);
    if (typeof layer.setAttribute === 'function') layer.setAttribute('tabindex', layer.getAttribute?.('tabindex') || '0');
  });
}

export function mountLayerReorderV2(options = {}) {
  const doc = options.document || globalThis.document;
  const storage = options.storage || globalThis.localStorage;
  const location = options.location || globalThis.location;
  const force = Boolean(options.force);
  const reloadOnChange = Boolean(options.reloadOnChange);
  const stats = {
    blockedMove: 0,
    visibilityToggles: 0,
    lockToggles: 0,
    reorders: 0,
    undos: 0,
    redos: 0,
    skipped: false,
    reason: null,
  };

  if (!force && globalThis.__YAIWES_LAYER_REORDER_V1__) {
    stats.skipped = true;
    stats.reason = 'V1_MOUNTED';
    return { skipped: true, reason: 'V1_MOUNTED', stats, version: LAYER_REORDER_VERSION };
  }
  if (!force && globalThis.__YAIWES_LAYER_REORDER_V2__) {
    stats.skipped = true;
    stats.reason = 'V2_MOUNTED';
    return { skipped: true, reason: 'V2_MOUNTED', stats, version: LAYER_REORDER_VERSION };
  }

  const persistResult = (result) => {
    if (!result?.changed) return result;
    applyCanonicalDom(doc, storage);
    decorateLayers(doc);
    if (reloadOnChange) location?.reload?.();
    return result;
  };

  const onPointerGuard = (event) => {
    const target = event.target;
    const node = target?.closest?.('[data-node]');
    if (!node) return;
    const id = node.dataset?.node;
    if (!id) return;
    const resize = Boolean(target?.closest?.('[data-resize],.resize-handle,.resize-corner'));
    if (!canMoveOrResize(id, storage)) {
      stats.blockedMove += 1;
      event.preventDefault?.();
      event.stopPropagation?.();
      event.stopImmediatePropagation?.();
      globalThis.__YAIWES_LAYER_REORDER_V2_LAST_BLOCK__ = Object.freeze({
        id,
        resize,
        reason: 'LOCKED',
        at: Date.now(),
      });
    }
  };

  const activate = (control, layer) => {
    if (!layer) return;
    const id = layer.dataset.layer;
    if (control.dataset.layerVisibility) {
      const current = getCanonicalLayerState(id, storage);
      const result = persistResult(setLayerHidden(id, !(current?.hidden), storage));
      if (result.changed) stats.visibilityToggles += 1;
      return result;
    }
    if (control.dataset.layerLock) {
      const current = getCanonicalLayerState(id, storage);
      const result = persistResult(setLayerLocked(id, !(current?.locked), storage));
      if (result.changed) stats.lockToggles += 1;
      return result;
    }
    if (control.dataset.layerMove) {
      if (control.getAttribute?.('aria-disabled') === 'true') return { changed: false, reason: 'DISABLED' };
      const result = persistResult(reorderPersistedLayer(id, Number(control.dataset.layerMove), storage));
      if (result.changed) stats.reorders += 1;
      return result;
    }
    return { changed: false };
  };

  const onClick = (event) => {
    const control = event.target?.closest?.('[data-layer-move],[data-layer-visibility],[data-layer-lock]');
    if (!control) return;
    event.preventDefault?.();
    event.stopPropagation?.();
    activate(control, control.closest?.('[data-layer]'));
  };

  const onKey = (event) => {
    const layer = event.target?.closest?.('[data-layer]');
    if (!layer) return;
    if (['Enter', ' '].includes(event.key)) {
      const control = event.target?.closest?.('[data-layer-move],[data-layer-visibility],[data-layer-lock]');
      if (!control) return;
      event.preventDefault?.();
      event.stopPropagation?.();
      activate(control, layer);
      return;
    }
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault?.();
      event.stopPropagation?.();
      const result = persistResult(reorderPersistedLayer(layer.dataset.layer, event.key === 'ArrowUp' ? -1 : 1, storage));
      if (result.changed) stats.reorders += 1;
    }
  };

  let dragId = null;
  const onLayerPointerDown = (event) => {
    const grip = event.target?.closest?.('.layer-grip,[data-layer-grip]');
    const layer = event.target?.closest?.('[data-layer]');
    if (!layer) return;
    if (grip || event.target === layer) dragId = layer.dataset.layer;
  };
  const onLayerPointerUp = (event) => {
    if (!dragId) return;
    const targetLayer = event.target?.closest?.('[data-layer]');
    const id = dragId;
    dragId = null;
    if (!targetLayer || targetLayer.dataset.layer === id) return;
    const layers = [...(doc.querySelectorAll?.('#layer-list [data-layer]') || [])];
    const to = layers.findIndex((item) => item.dataset.layer === targetLayer.dataset.layer);
    if (to < 0) return;
    const result = persistResult(reorderPersistedLayerTo(id, to, storage));
    if (result.changed) stats.reorders += 1;
  };

  doc.addEventListener?.('pointerdown', onPointerGuard, true);
  doc.addEventListener?.('mousedown', onPointerGuard, true);
  doc.addEventListener?.('touchstart', onPointerGuard, { capture: true, passive: false });
  doc.addEventListener?.('dragstart', onPointerGuard, true);
  doc.addEventListener?.('click', onClick, true);
  doc.addEventListener?.('keydown', onKey, true);
  doc.addEventListener?.('pointerdown', onLayerPointerDown, true);
  doc.addEventListener?.('pointerup', onLayerPointerUp, true);

  if (typeof MutationObserver === 'function' && doc.documentElement) {
    new MutationObserver(() => {
      decorateLayers(doc);
      applyCanonicalDom(doc, storage);
    }).observe(doc.documentElement, { subtree: true, childList: true });
  }
  decorateLayers(doc);
  applyCanonicalDom(doc, storage);

  const api = Object.freeze({
    version: LAYER_REORDER_VERSION,
    segmentId: SEGMENT_ID,
    projectKey: PROJECT_KEY,
    setLayerHidden,
    setLayerLocked,
    reorderPersistedLayer,
    reorderPersistedLayerTo,
    undoLayer,
    redoLayer,
    canMoveOrResize,
    guardMove,
    guardResize,
    getCanonicalLayerState,
    stats,
    unmount() {
      doc.removeEventListener?.('pointerdown', onPointerGuard, true);
      doc.removeEventListener?.('mousedown', onPointerGuard, true);
      doc.removeEventListener?.('touchstart', onPointerGuard, { capture: true });
      doc.removeEventListener?.('dragstart', onPointerGuard, true);
      doc.removeEventListener?.('click', onClick, true);
      doc.removeEventListener?.('keydown', onKey, true);
      doc.removeEventListener?.('pointerdown', onLayerPointerDown, true);
      doc.removeEventListener?.('pointerup', onLayerPointerUp, true);
    },
  });
  globalThis.__YAIWES_LAYER_REORDER_V2__ = api;
  globalThis.__YAIWES_LAYER_REORDER_API_V2__ = api;
  return api;
}

if (typeof document !== 'undefined') {
  queueMicrotask(() => {
    try { mountLayerReorderV2({ force: false }); } catch {}
  });
}
