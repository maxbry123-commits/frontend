import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  GESTURE,
  LONG_PRESS_MS,
  MOVE_THRESHOLD_PX,
  NODE_TRANSFER_KEY,
  ORIGIN_TRANSFER_KEY,
  RESIZE_CORNER_PAD,
  SEGMENT_ID,
  TOUCH_DND_VERSION,
  classifyGesture,
  computeMovedOrigin,
  dropClientFromNodeOrigin,
  mountTouchDndV195,
} from '../../src/touch-dnd-v195.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const v192 = readFileSync(join(root, 'src/touch-dnd-v192.js'), 'utf8');
const v193 = readFileSync(join(root, 'src/touch-dnd-v193.js'), 'utf8');
const v194 = readFileSync(join(root, 'src/touch-dnd-v194.js'), 'utf8');
const v195 = readFileSync(join(root, 'src/touch-dnd-v195.js'), 'utf8');

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

function createClock() {
  let t = 0;
  const timers = new Map();
  let seq = 0;
  return {
    now: () => t,
    setTimeout(fn, ms) {
      seq += 1;
      timers.set(seq, { fn, due: t + Number(ms) });
      return seq;
    },
    clearTimeout(id) { timers.delete(id); },
    advance(ms) {
      t += Number(ms);
      for (const [id, timer] of [...timers.entries()]) {
        if (timer.due <= t) {
          timers.delete(id);
          timer.fn();
        }
      }
    },
  };
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

function mount(fixture, clock) {
  return mountTouchDndV195({
    document: fixture.doc,
    DataTransfer: FakeDataTransfer,
    DragEvent: FakeDragEvent,
    force: true,
    now: clock.now,
    setTimeout: clock.setTimeout,
    clearTimeout: clock.clearTimeout,
  });
}

function harnessHtml() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    html, body { margin: 0; height: 100%; background: #111; }
    #canvas { width: 100vw; height: 100vh; overflow: auto; position: relative; }
    .spacer { width: 1800px; height: 2400px; }
    [data-node] { position: absolute; width: 120px; height: 80px; background: #2563eb; color: #fff; }
  </style>
</head>
<body>
  <div id="canvas">
    <div class="spacer"></div>
    <div data-node="n-1" id="node-1" style="left:40px;top:80px;">node</div>
  </div>
  <script type="module">
    import { mountTouchDndV195 } from '/src/touch-dnd-v195.js';
    window.__YAIWES_F_FE_073__ = mountTouchDndV195({ force: true });
  </script>
</body>
</html>`;
}

async function dispatchTouch(page, sx, sy, ex, ey, steps = 8, holdMs = 0) {
  const session = await page.context().newCDPSession(page);
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: sx, y: sy, radiusX: 5, radiusY: 5, force: 1 }],
  });
  if (holdMs) await page.waitForTimeout(holdMs);
  for (let i = 1; i <= steps; i += 1) {
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{
        x: Math.round(sx + ((ex - sx) * i) / steps),
        y: Math.round(sy + ((ey - sy) * i) / steps),
        radiusX: 5,
        radiusY: 5,
        force: 1,
      }],
    });
    await page.waitForTimeout(16);
  }
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
}

test.describe('F-FE-073 unit drag intent', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium-desktop', 'run unit once on desktop project');
  });

  test('versions stay disjoint and v195 does not import v194', () => {
    expect(TOUCH_DND_VERSION).toBe('1.9.5');
    expect(SEGMENT_ID).toBe('SEG-04-TOUCH');
    expect(RESIZE_CORNER_PAD).toBe(22);
    expect(MOVE_THRESHOLD_PX).toBe(10);
    expect(LONG_PRESS_MS).toBe(350);
    expect(v192).toContain("version:'1.9.2'");
    expect(v193).toContain("TOUCH_DND_VERSION = '1.9.3'");
    expect(v194).toContain("TOUCH_DND_VERSION = '1.9.4'");
    expect(v195).toContain("TOUCH_DND_VERSION = '1.9.5'");
    expect(v192.includes('1.9.5')).toBe(false);
    expect(v193.includes('1.9.5')).toBe(false);
    expect(v194.includes('1.9.5')).toBe(false);
    expect(v195.includes("from './touch-dnd-v194.js'")).toBe(false);
  });

  test('classifyGesture threshold vs long-press', () => {
    const node = { getBoundingClientRect: () => ({ left: 0, top: 0, right: 100, bottom: 80 }) };
    expect(classifyGesture({ node, clientX: 20, clientY: 20, phase: 'down' })).toBe(GESTURE.PENDING);
    expect(classifyGesture({
      node, startX: 20, startY: 20, clientX: 24, clientY: 22, heldMs: 40, phase: 'move',
    })).toBe(GESTURE.PENDING);
    expect(classifyGesture({
      node, startX: 20, startY: 20, clientX: 21, clientY: 21, heldMs: LONG_PRESS_MS, phase: 'move',
    })).toBe(GESTURE.MOVE);
    expect(classifyGesture({
      node, startX: 20, startY: 20, clientX: 40, clientY: 40, heldMs: 0, phase: 'move',
    })).toBe(GESTURE.MOVE);
  });

  test('skips auto if v194 already mounted', () => {
    globalThis.__YAIWES_TOUCH_DND_V194__ = { version: '1.9.4' };
    const blocked = mountTouchDndV195({ document: createDoc().doc, force: false });
    expect(blocked.ok).toBe(false);
    expect(blocked.reason).toBe('V194_ALREADY_MOUNTED');
    delete globalThis.__YAIWES_TOUCH_DND_V194__;
  });

  test('tap below threshold does not move or commit', () => {
    const fixture = createDoc();
    const clock = createClock();
    const mounted = mount(fixture, clock);
    fixture.doc.dispatch('touchstart', makeEvent({ target: fixture.node, clientX: 80, clientY: 90 }));
    fixture.doc.dispatch('touchmove', makeEvent({ target: fixture.node, clientX: 84, clientY: 93 }));
    fixture.doc.dispatch('touchend', makeEvent({ target: fixture.node, clientX: 84, clientY: 93 }));
    expect(fixture.node.style.left).toBe('32px');
    expect(fixture.canvasDrops.length).toBe(0);
    expect(mounted.getStats().taps).toBe(1);
    expect(mounted.getStats().commits).toBe(0);
    mounted.destroy();
  });

  test('long-press promotes without crossing 10px', () => {
    const fixture = createDoc();
    const clock = createClock();
    const mounted = mount(fixture, clock);
    fixture.doc.dispatch('touchstart', makeEvent({ target: fixture.node, clientX: 80, clientY: 90 }));
    expect(mounted.sessionKind()).toBe(GESTURE.PENDING);
    clock.advance(LONG_PRESS_MS);
    expect(mounted.sessionKind()).toBe(GESTURE.MOVE);
    expect(mounted.getStats().longPressPromoted).toBe(1);
    fixture.doc.dispatch('touchend', makeEvent({ target: fixture.node, clientX: 80, clientY: 90 }));
    expect(mounted.getStats().commits).toBe(1);
    mounted.destroy();
  });

  test('pointercancel restores origin after move', () => {
    const fixture = createDoc();
    const clock = createClock();
    const mounted = mount(fixture, clock);
    fixture.doc.dispatch('pointerdown', makeEvent({ target: fixture.node, clientX: 80, clientY: 90 }));
    const steal = makeEvent({ target: fixture.node, clientX: 130, clientY: 160 });
    fixture.doc.dispatch('pointermove', steal);
    expect(steal.prevented).toBe(true);
    expect(fixture.node.style.left).toBe('82px');
    fixture.doc.dispatch('pointercancel', makeEvent({ target: fixture.node, clientX: 130, clientY: 160 }));
    expect(mounted.active()).toBe(false);
    expect(fixture.node.style.left).toBe('32px');
    expect(fixture.node.style.top).toBe('48px');
    expect(mounted.getStats().cancels).toBe(1);
    expect(mounted.getStats().restored).toBe(1);
    expect(fixture.canvasDrops.length).toBe(0);
    expect(computeMovedOrigin({
      originLeft: 32, originTop: 48, startClientX: 80, startClientY: 90, clientX: 130, clientY: 160,
    })).toEqual({ left: 82, top: 118 });
    mounted.destroy();
  });

  test('touchcancel restores pending session cleanly', () => {
    const fixture = createDoc();
    const clock = createClock();
    const mounted = mount(fixture, clock);
    fixture.doc.dispatch('touchstart', makeEvent({ target: fixture.node, clientX: 80, clientY: 90 }));
    fixture.doc.dispatch('touchcancel', makeEvent({ target: fixture.node }));
    expect(mounted.active()).toBe(false);
    expect(fixture.node.style.left).toBe('32px');
    expect(mounted.getStats().cancels).toBe(1);
    mounted.destroy();
  });

  test('20 repeated tap/move/cancel cycles stay clean', () => {
    const fixture = createDoc();
    const clock = createClock();
    const mounted = mount(fixture, clock);
    for (let i = 0; i < 20; i += 1) {
      fixture.doc.dispatch('touchstart', makeEvent({ target: fixture.node, clientX: 80, clientY: 90 }));
      if (i % 3 === 0) {
        fixture.doc.dispatch('touchend', makeEvent({ target: fixture.node, clientX: 82, clientY: 91 }));
      } else if (i % 3 === 1) {
        fixture.doc.dispatch('touchmove', makeEvent({ target: fixture.node, clientX: 130, clientY: 160 }));
        fixture.doc.dispatch('touchend', makeEvent({ target: fixture.node, clientX: 130, clientY: 160 }));
        fixture.node.style.left = '32px';
        fixture.node.style.top = '48px';
      } else {
        fixture.doc.dispatch('touchmove', makeEvent({ target: fixture.node, clientX: 130, clientY: 160 }));
        fixture.doc.dispatch('touchcancel', makeEvent({ target: fixture.node }));
      }
      expect(mounted.active()).toBe(false);
    }
    const stats = mounted.getStats();
    expect(stats.cycles).toBe(20);
    expect(stats.taps).toBeGreaterThan(0);
    expect(stats.commits).toBeGreaterThan(0);
    expect(stats.cancels).toBeGreaterThan(0);
    expect(dropClientFromNodeOrigin(fixture.canvas, fixture.node).x).toBeTruthy();
    mounted.destroy();
    expect(globalThis.__YAIWES_TOUCH_DND_V195__).toBeUndefined();
  });
});

test.describe('F-FE-073 android-size playwright', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-chromium', 'Pixel 7 gate');
    await page.route('**/f-fe-073-harness.html', async (route) => {
      await route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: harnessHtml() });
    });
    await page.goto('/f-fe-073-harness.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.__YAIWES_F_FE_073__?.ok === true);
  });

  test('node tap does not move; long-press promotes', async ({ page }) => {
    const node = page.locator('#node-1');
    const box = await node.boundingBox();
    const sx = Math.round(box.x + 24);
    const sy = Math.round(box.y + 24);
    await dispatchTouch(page, sx, sy, sx + 3, sy + 2, 2, 0);
    expect(await node.evaluate((el) => el.style.left)).toBe('40px');
    await dispatchTouch(page, sx, sy, sx + 2, sy + 1, 2, 400);
    const stats = await page.evaluate(() => window.__YAIWES_F_FE_073__.getStats());
    expect(stats.longPressPromoted + stats.commits).toBeGreaterThan(0);
  });

  test('20 browser touch cycles remain cancel-safe', async ({ page }) => {
    const node = page.locator('#node-1');
    const box = await node.boundingBox();
    const sx = Math.round(box.x + 24);
    const sy = Math.round(box.y + 24);
    for (let i = 0; i < 20; i += 1) {
      await dispatchTouch(page, sx, sy, sx + (i % 2 === 0 ? 4 : 70), sy + (i % 2 === 0 ? 3 : 40), 6, 0);
    }
    const stats = await page.evaluate(() => window.__YAIWES_F_FE_073__.getStats());
    expect(stats.pointerDown + stats.touchStart).toBeGreaterThanOrEqual(20);
    const active = await page.evaluate(() => window.__YAIWES_F_FE_073__.active());
    expect(active).toBe(false);
  });
});
