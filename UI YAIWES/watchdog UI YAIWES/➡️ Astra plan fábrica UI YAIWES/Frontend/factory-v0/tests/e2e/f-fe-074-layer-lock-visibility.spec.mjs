import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  LAYER_REORDER_VERSION,
  SEGMENT_ID,
  canMoveOrResize,
  getCanonicalLayerState,
  guardMove,
  guardResize,
  mountLayerReorderV2,
  redoLayer,
  reorderPersistedLayer,
  reorderPersistedLayerTo,
  setLayerHidden,
  setLayerLocked,
  undoLayer,
} from '../../src/layer-reorder-v2.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const v1 = readFileSync(join(root, 'src/layer-reorder-v1.js'), 'utf8');
const v2 = readFileSync(join(root, 'src/layer-reorder-v2.js'), 'utf8');
const PROJECT_KEY = 'yaiwes-factory-project-v19';

class FakeStorage {
  constructor(seed) {
    this.map = new Map();
    if (seed) this.setItem(PROJECT_KEY, JSON.stringify(seed));
  }
  getItem(key) { return this.map.has(key) ? this.map.get(key) : null; }
  setItem(key, value) { this.map.set(key, String(value)); }
}

function seedProject(overrides = {}) {
  const components = overrides.components || [
    { id: 'a', kind: 'window', label: 'A', x: 10, y: 10, w: 120, h: 80, hidden: false, locked: false },
    { id: 'b', kind: 'button', label: 'B', x: 40, y: 40, w: 90, h: 40, hidden: false, locked: false },
    { id: 'c', kind: 'image', label: 'C', x: 70, y: 70, w: 60, h: 60, hidden: false, locked: false },
  ];
  return {
    state: {
      version: 0,
      step: 1,
      mode: 'MANUAL',
      selectedId: 'a',
      components,
      history: [],
      future: [],
      ...overrides.state,
    },
  };
}

function orderOf(storage) {
  return JSON.parse(storage.getItem(PROJECT_KEY)).state.components.map((item) => item.id);
}

class FakeClassList {
  constructor() { this._set = new Set(); }
  add(...names) { names.forEach((name) => this._set.add(name)); }
  remove(...names) { names.forEach((name) => this._set.delete(name)); }
  contains(name) { return this._set.has(name); }
}

function createLayer(id) {
  const children = [];
  const layer = {
    dataset: { layer: id },
    className: 'layer-item',
    style: {},
    children,
    attributes: {},
    classList: new FakeClassList(),
    closest(selector) { return selector === '[data-layer]' ? this : null; },
    querySelector(selector) {
      if (selector === '[data-layer-reorder-controls]') {
        return children.find((child) => child.dataset?.layerReorderControls) || null;
      }
      return null;
    },
    appendChild(node) { children.push(node); return node; },
    setAttribute(name, value) { this.attributes[name] = String(value); },
    getAttribute(name) { return this.attributes[name] ?? null; },
  };
  return layer;
}

function createNode(id) {
  return {
    dataset: { node: id },
    style: { display: '', left: '10px', top: '10px' },
    classList: new FakeClassList(),
    closest(selector) { return selector === '[data-node]' ? this : null; },
  };
}

function createDoc(ids = ['a', 'b', 'c']) {
  const listeners = new Map();
  const layers = ids.map((id) => createLayer(id));
  const nodes = Object.fromEntries(ids.map((id) => [id, createNode(id)]));
  const layerList = {
    id: 'layer-list',
    children: layers,
    querySelectorAll(selector) {
      if (selector === '[data-layer]') return layers;
      return [];
    },
  };
  const doc = {
    documentElement: { dataset: {} },
    createElement(tag) {
      return { tagName: tag, dataset: {}, className: '', innerHTML: '', children: [], appendChild() {} };
    },
    querySelector(selector) {
      const layerMatch = selector.match(/^\[data-layer="([^"]+)"\]$/);
      if (layerMatch) return layers.find((layer) => layer.dataset.layer === layerMatch[1]) || null;
      const nodeMatch = selector.match(/^\[data-node="([^"]+)"\]$/);
      if (nodeMatch) return nodes[nodeMatch[1]] || null;
      if (selector === '#layer-list') return layerList;
      return null;
    },
    querySelectorAll(selector) {
      if (selector === '#layer-list [data-layer]') return layers;
      if (selector === '[data-node]') return Object.values(nodes);
      return [];
    },
    addEventListener(type, handler, options = {}) {
      const list = listeners.get(type) || [];
      list.push({ handler, options });
      listeners.set(type, list);
    },
    removeEventListener(type, handler) {
      const list = (listeners.get(type) || []).filter((entry) => entry.handler !== handler);
      listeners.set(type, list);
    },
    dispatch(type, event) {
      for (const { handler, options } of listeners.get(type) || []) {
        if (options?.capture || options === true || !options) handler(event);
      }
    },
  };
  return { doc, layers, nodes, listeners };
}

test.describe('F-FE-074 layer lock/visibility v2', () => {
  test('preserves layer-reorder-v1 and versions v2 independently', () => {
    expect(v1).toContain('__YAIWES_LAYER_REORDER_API_V1__');
    expect(v1).toContain('reorderPersistedLayer');
    expect(v1).not.toContain('LAYER_REORDER_VERSION = \'2.0.0\'');
    expect(v2).toContain("LAYER_REORDER_VERSION = '2.0.0'");
    expect(v2).toContain(SEGMENT_ID);
    expect(LAYER_REORDER_VERSION).toBe('2.0.0');
    expect(v1).not.toContain('setLayerLocked');
  });

  test('hide/show and lock/unlock persist canonical visible state', () => {
    const storage = new FakeStorage(seedProject());
    expect(getCanonicalLayerState('a', storage)).toMatchObject({ visible: true, hidden: false, locked: false, index: 0 });

    const hidden = setLayerHidden('a', true, storage);
    expect(hidden.changed).toBe(true);
    expect(getCanonicalLayerState('a', storage)).toMatchObject({ visible: false, hidden: true, locked: false });

    const shown = setLayerHidden('a', false, storage);
    expect(shown.changed).toBe(true);
    expect(getCanonicalLayerState('a', storage).visible).toBe(true);

    const locked = setLayerLocked('b', true, storage);
    expect(locked.changed).toBe(true);
    expect(getCanonicalLayerState('b', storage).locked).toBe(true);
    expect(canMoveOrResize('b', storage)).toBe(false);
    expect(canMoveOrResize('a', storage)).toBe(true);
  });

  test('locked nodes cannot move or resize', () => {
    const storage = new FakeStorage(seedProject());
    setLayerLocked('c', true, storage);
    expect(guardMove('c', 90, 90, storage)).toEqual({ allowed: false, reason: 'LOCKED', id: 'c', x: 90, y: 90 });
    expect(guardResize('c', 40, 40, storage)).toEqual({ allowed: false, reason: 'LOCKED', id: 'c', w: 40, h: 40 });
    expect(guardMove('a', 12, 12, storage).allowed).toBe(true);
    expect(guardResize('a', 200, 80, storage).allowed).toBe(true);
  });

  test('keyboard reorder and drag reorder agree', () => {
    const storageA = new FakeStorage(seedProject());
    const keyboard = reorderPersistedLayer('a', 1, storageA);
    expect(keyboard.changed).toBe(true);
    expect(orderOf(storageA)).toEqual(['b', 'a', 'c']);

    const storageB = new FakeStorage(seedProject());
    const drag = reorderPersistedLayerTo('a', 1, storageB);
    expect(drag.changed).toBe(true);
    expect(orderOf(storageB)).toEqual(['b', 'a', 'c']);
    expect(orderOf(storageA)).toEqual(orderOf(storageB));

    const downAgain = reorderPersistedLayer('a', 1, storageA);
    expect(downAgain.changed).toBe(true);
    expect(orderOf(storageA)).toEqual(['b', 'c', 'a']);
    expect(reorderPersistedLayerTo('a', 2, new FakeStorage(seedProject())).order).toEqual(['b', 'c', 'a']);
  });

  test('undo/redo restores order, visibility and lock', () => {
    const storage = new FakeStorage(seedProject());
    setLayerHidden('a', true, storage);
    setLayerLocked('b', true, storage);
    reorderPersistedLayerTo('c', 0, storage);
    expect(orderOf(storage)).toEqual(['c', 'a', 'b']);
    expect(getCanonicalLayerState('a', storage).hidden).toBe(true);
    expect(getCanonicalLayerState('b', storage).locked).toBe(true);

    expect(undoLayer(storage).changed).toBe(true);
    expect(orderOf(storage)).toEqual(['a', 'b', 'c']);
    expect(getCanonicalLayerState('b', storage).locked).toBe(true);
    expect(undoLayer(storage).changed).toBe(true);
    expect(getCanonicalLayerState('b', storage).locked).toBe(false);
    expect(undoLayer(storage).changed).toBe(true);
    expect(getCanonicalLayerState('a', storage).visible).toBe(true);

    expect(redoLayer(storage).changed).toBe(true);
    expect(getCanonicalLayerState('a', storage).hidden).toBe(true);
    expect(redoLayer(storage).changed).toBe(true);
    expect(getCanonicalLayerState('b', storage).locked).toBe(true);
    expect(redoLayer(storage).changed).toBe(true);
    expect(orderOf(storage)).toEqual(['c', 'a', 'b']);
  });

  test('mount intercepts locked pointer move and skips v1 unless force', () => {
    const previousV1 = globalThis.__YAIWES_LAYER_REORDER_V1__;
    const previousV2 = globalThis.__YAIWES_LAYER_REORDER_V2__;
    delete globalThis.__YAIWES_LAYER_REORDER_V1__;
    delete globalThis.__YAIWES_LAYER_REORDER_V2__;
    try {
      const storage = new FakeStorage(seedProject());
      setLayerLocked('a', true, storage);
      const { doc, nodes } = createDoc();
      const mounted = mountLayerReorderV2({ document: doc, storage, force: true, reloadOnChange: false });
      expect(mounted.skipped).toBeFalsy();
      expect(nodes.a.dataset.locked).toBe('true');

      let prevented = 0;
      const event = {
        target: nodes.a,
        preventDefault() { prevented += 1; },
        stopPropagation() {},
        stopImmediatePropagation() {},
      };
      doc.dispatch('pointerdown', event);
      expect(mounted.stats.blockedMove).toBe(1);
      expect(prevented).toBe(1);

      globalThis.__YAIWES_LAYER_REORDER_V1__ = { version: '1' };
      delete globalThis.__YAIWES_LAYER_REORDER_V2__;
      const skipped = mountLayerReorderV2({ document: doc, storage, force: false });
      expect(skipped.skipped).toBe(true);
      expect(skipped.reason).toBe('V1_MOUNTED');
    } finally {
      if (previousV1) globalThis.__YAIWES_LAYER_REORDER_V1__ = previousV1;
      else delete globalThis.__YAIWES_LAYER_REORDER_V1__;
      if (previousV2) globalThis.__YAIWES_LAYER_REORDER_V2__ = previousV2;
      else delete globalThis.__YAIWES_LAYER_REORDER_V2__;
    }
  });
});
