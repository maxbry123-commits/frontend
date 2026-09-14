import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  SEGMENT_ID,
  TOUCH_DND_VERSION,
  NODE_TRANSFER_KEY,
  ORIGIN_TRANSFER_KEY,
  canvasLocalPoint,
  clientPointFromCanvasLocal,
  computeMovedOrigin,
  dropClientFromNodeOrigin,
  isNearResizeCorner,
  mountTouchDndV193,
  shouldBeginTouchMove,
} from '../../src/touch-dnd-v193.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const v192 = readFileSync(join(root, 'src/touch-dnd-v192.js'), 'utf8');
const v193 = readFileSync(join(root, 'src/touch-dnd-v193.js'), 'utf8');

assert.equal(TOUCH_DND_VERSION, '1.9.3');
assert.equal(SEGMENT_ID, 'SEG-04-TOUCH');
assert.match(v192, /version:'1\.9\.2'/);
assert.match(v193, /TOUCH_DND_VERSION = '1\.9\.3'/);
assert.equal(v192.includes('1.9.3'), false);
assert.equal(v193.includes('touch-dnd-v192.js'), true);

const canvasStub = {
  scrollLeft: 40,
  scrollTop: 16,
  getBoundingClientRect: () => ({ left: 200, top: 80, right: 900, bottom: 700 }),
};
assert.deepEqual(canvasLocalPoint(canvasStub, 260, 140), { x: 100, y: 76 });
assert.deepEqual(clientPointFromCanvasLocal(canvasStub, 100, 76), { x: 260, y: 140 });

const moved = computeMovedOrigin({
  originLeft: 32,
  originTop: 48,
  startClientX: 80,
  startClientY: 90,
  clientX: 130,
  clientY: 160,
});
assert.deepEqual(moved, { left: 82, top: 118 });

const grabMissIfFingerUsed = 130;
assert.notEqual(grabMissIfFingerUsed, moved.left, 'finger clientX is not node origin');

const nodeRect = { left: 10, top: 10, right: 110, bottom: 90 };
const resizeNode = { getBoundingClientRect: () => nodeRect };
assert.equal(isNearResizeCorner(resizeNode, 100, 80), true);
assert.equal(isNearResizeCorner(resizeNode, 20, 20), false);
assert.equal(shouldBeginTouchMove(null, 20, 20), false);
assert.equal(shouldBeginTouchMove(resizeNode, 100, 80), false);
assert.equal(shouldBeginTouchMove(resizeNode, 20, 20), true);

class FakeClassList {
  constructor() { this._set = new Set(); }
  add(...names) { names.forEach((name) => this._set.add(name)); }
  remove(...names) { names.forEach((name) => this._set.delete(name)); }
  contains(name) { return this._set.has(name); }
}

class FakeDataTransfer {
  constructor() { this._data = new Map(); this.types = []; }
  setData(type, value) {
    this._data.set(type, String(value));
    if (!this.types.includes(type)) this.types.push(type);
  }
  getData(type) { return this._data.get(type) || ''; }
}

class FakeDragEvent {
  constructor(type, init = {}) {
    this.type = type;
    this.bubbles = init.bubbles;
    this.cancelable = init.cancelable;
    this.clientX = init.clientX;
    this.clientY = init.clientY;
    this.dataTransfer = init.dataTransfer;
  }
}

function createDoc() {
  const listeners = new Map();
  const canvasDrops = [];
  const node = {
    dataset: { node: 'n-7' },
    style: { left: '32px', top: '48px' },
    classList: new FakeClassList(),
    getBoundingClientRect: () => ({ left: 232, top: 128, right: 332, bottom: 208 }),
    closest(selector) { return selector === '[data-node]' ? this : null; },
  };
  const canvas = {
    id: 'canvas',
    scrollLeft: 40,
    scrollTop: 16,
    getBoundingClientRect: () => ({ left: 200, top: 80, right: 900, bottom: 700 }),
    dispatchEvent(event) { canvasDrops.push(event); return true; },
  };
  const documentElement = { dataset: {} };
  const doc = {
    documentElement,
    getElementById(id) { return id === 'canvas' ? canvas : null; },
    addEventListener(type, handler, options = {}) {
      const list = listeners.get(type) || [];
      list.push({ handler, options });
      listeners.set(type, list);
    },
    dispatch(type, event) {
      for (const { handler, options } of listeners.get(type) || []) {
        if (options?.signal?.aborted) continue;
        handler(event);
      }
    },
  };
  return { doc, node, canvas, canvasDrops, listeners };
}

function makeEvent(extra = {}) {
  const event = {
    pointerType: 'touch',
    pointerId: 1,
    clientX: 80,
    clientY: 90,
    target: null,
    preventDefault() { this.prevented = true; },
    stopPropagation() { this.stopped = true; },
    prevented: false,
    stopped: false,
    ...extra,
  };
  event.touches = extra.touches || [{ clientX: event.clientX, clientY: event.clientY }];
  event.changedTouches = extra.changedTouches || event.touches;
  return event;
}

globalThis.__YAIWES_TOUCH_DND_V192__ = { version: '1.9.2' };
const blocked = mountTouchDndV193({ document: createDoc().doc, force: false });
assert.equal(blocked.ok, false);
assert.equal(blocked.reason, 'V192_ALREADY_MOUNTED');
delete globalThis.__YAIWES_TOUCH_DND_V192__;

const fixture = createDoc();
const mounted = mountTouchDndV193({
  document: fixture.doc,
  DataTransfer: FakeDataTransfer,
  DragEvent: FakeDragEvent,
  force: true,
});
assert.equal(mounted.ok, true);
assert.equal(fixture.doc.documentElement.dataset.touchDnd, 'v193');

const start = makeEvent({ target: fixture.node, clientX: 80, clientY: 90 });
fixture.doc.dispatch('touchstart', start);
assert.equal(start.prevented, true);
assert.equal(mounted.active(), true);
assert.equal(fixture.node.classList.contains('is-pointer-moving'), true);

const mid = makeEvent({ target: fixture.node, clientX: 130, clientY: 160 });
fixture.doc.dispatch('touchmove', mid);
assert.equal(fixture.node.style.left, '82px');
assert.equal(fixture.node.style.top, '118px');

const end = makeEvent({ target: fixture.node, clientX: 130, clientY: 160 });
fixture.doc.dispatch('touchend', end);
assert.equal(mounted.active(), false);
assert.equal(fixture.canvasDrops.length, 1);
const drop = fixture.canvasDrops[0];
assert.equal(drop.dataTransfer.getData(NODE_TRANSFER_KEY), 'n-7');
assert.deepEqual(JSON.parse(drop.dataTransfer.getData(ORIGIN_TRANSFER_KEY)), { left: 82, top: 118 });
const expectedDrop = dropClientFromNodeOrigin(fixture.canvas, fixture.node);
assert.equal(drop.clientX, expectedDrop.x);
assert.equal(drop.clientY, expectedDrop.y);
assert.notEqual(drop.clientX, 130, 'drop must not use finger clientX');
assert.equal(mounted.getStats().commits, 1);

const scrollEvent = makeEvent({ target: { closest: () => null }, clientX: 10, clientY: 10 });
fixture.doc.dispatch('touchstart', scrollEvent);
assert.equal(scrollEvent.prevented, false);
assert.equal(mounted.getStats().scrollPassthrough > 0, true);

const resizeTarget = {
  dataset: { node: 'n-8' },
  style: { left: '0px', top: '0px' },
  classList: new FakeClassList(),
  getBoundingClientRect: () => ({ left: 0, top: 0, right: 80, bottom: 80 }),
  closest(selector) { return selector === '[data-node]' ? this : null; },
};
const resizeEvent = makeEvent({ target: resizeTarget, clientX: 78, clientY: 78 });
fixture.doc.dispatch('touchstart', resizeEvent);
assert.equal(resizeEvent.prevented, false);
assert.equal(mounted.getStats().blockedResize, 1);
assert.equal(mounted.active(), false);

mounted.destroy();
assert.equal(fixture.doc.documentElement.dataset.touchDnd, undefined);
assert.equal(globalThis.__YAIWES_TOUCH_DND_V193__, undefined);

console.log('f-fe-068-touch-v193: PASS');
