import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  GESTURE,
  MOVE_THRESHOLD_PX,
  NODE_TRANSFER_KEY,
  ORIGIN_TRANSFER_KEY,
  RESIZE_CORNER_PAD,
  SEGMENT_ID,
  TOUCH_DND_VERSION,
  classifyGesture,
  computeMovedOrigin,
  dropClientFromNodeOrigin,
  isNearResizeCorner,
  mountTouchDndV194,
} from '../../src/touch-dnd-v194.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const v192 = readFileSync(join(root, 'src/touch-dnd-v192.js'), 'utf8');
const v193 = readFileSync(join(root, 'src/touch-dnd-v193.js'), 'utf8');
const v194 = readFileSync(join(root, 'src/touch-dnd-v194.js'), 'utf8');

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
    [data-node] {
      position: absolute;
      width: 120px;
      height: 80px;
      background: #2563eb;
      color: #fff;
      font: 14px sans-serif;
    }
  </style>
</head>
<body>
  <div id="canvas">
    <div class="spacer"></div>
    <div data-node="n-1" id="node-1" style="left:40px;top:80px;">node</div>
  </div>
  <script type="module">
    import { mountTouchDndV194 } from '/src/touch-dnd-v194.js';
    window.__YAIWES_F_FE_072__ = mountTouchDndV194({ force: true });
  </script>
</body>
</html>`;
}

async function dispatchTouch(page, sx, sy, ex, ey, steps = 8) {
  const session = await page.context().newCDPSession(page);
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: sx, y: sy, radiusX: 5, radiusY: 5, force: 1 }],
  });
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

test.describe('F-FE-072 unit arbitration', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium-desktop', 'run unit once on desktop project');
  });

  test('versions pads and frozen files stay disjoint', () => {
    expect(TOUCH_DND_VERSION).toBe('1.9.4');
    expect(SEGMENT_ID).toBe('SEG-04-TOUCH');
    expect(RESIZE_CORNER_PAD).toBe(22);
    expect(MOVE_THRESHOLD_PX).toBe(10);
    expect(v192).toMatch(/version:'1\.9\.2'/);
    expect(v193).toMatch(/TOUCH_DND_VERSION = '1\.9\.3'/);
    expect(v192.includes('1.9.4')).toBe(false);
    expect(v193.includes('1.9.4')).toBe(false);
    expect(v194).toMatch(/TOUCH_DND_VERSION = '1\.9\.4'/);
    expect(v194.includes("from './touch-dnd-v193.js'")).toBe(false);
    expect(v194.includes('RESIZE_CORNER_PAD = 22')).toBe(true);
  });

  test('classifyGesture pending move scroll resize', () => {
    const node = { getBoundingClientRect: () => ({ left: 0, top: 0, right: 100, bottom: 80 }) };
    expect(classifyGesture({ node: null, clientX: 10, clientY: 10, phase: 'down' })).toBe(GESTURE.SCROLL);
    expect(classifyGesture({ node, clientX: 95, clientY: 75, phase: 'down' })).toBe(GESTURE.RESIZE);
    expect(isNearResizeCorner(node, 95, 75)).toBe(true);
    expect(isNearResizeCorner(node, 20, 20)).toBe(false);
    expect(classifyGesture({ node, clientX: 20, clientY: 20, phase: 'down' })).toBe(GESTURE.PENDING);
    expect(classifyGesture({
      node, startX: 20, startY: 20, clientX: 24, clientY: 22, phase: 'move',
    })).toBe(GESTURE.PENDING);
    expect(classifyGesture({
      node, startX: 20, startY: 20, clientX: 40, clientY: 40, phase: 'move',
    })).toBe(GESTURE.MOVE);
    expect(Math.hypot(4, 2) < MOVE_THRESHOLD_PX).toBe(true);
    expect(Math.hypot(20, 20) >= MOVE_THRESHOLD_PX).toBe(true);
  });

  test('skips auto if v192 or v193 already mounted', () => {
    globalThis.__YAIWES_TOUCH_DND_V192__ = { version: '1.9.2' };
    const blocked192 = mountTouchDndV194({ document: createDoc().doc, force: false });
    expect(blocked192.ok).toBe(false);
    expect(blocked192.reason).toBe('V192_ALREADY_MOUNTED');
    delete globalThis.__YAIWES_TOUCH_DND_V192__;

    globalThis.__YAIWES_TOUCH_DND_V193__ = { version: '1.9.3' };
    const blocked193 = mountTouchDndV194({ document: createDoc().doc, force: false });
    expect(blocked193.ok).toBe(false);
    expect(blocked193.reason).toBe('V193_ALREADY_MOUNTED');
    delete globalThis.__YAIWES_TOUCH_DND_V193__;
  });

  test('pending tap does not preventDefault or commit', () => {
    const fixture = createDoc();
    const mounted = mountTouchDndV194({
      document: fixture.doc,
      DataTransfer: FakeDataTransfer,
      DragEvent: FakeDragEvent,
      force: true,
    });
    expect(mounted.ok).toBe(true);
    const start = makeEvent({ target: fixture.node, clientX: 80, clientY: 90 });
    fixture.doc.dispatch('touchstart', start);
    expect(start.prevented).toBe(false);
    expect(mounted.sessionKind()).toBe(GESTURE.PENDING);
    const end = makeEvent({ target: fixture.node, clientX: 82, clientY: 91 });
    fixture.doc.dispatch('touchend', end);
    expect(end.prevented).toBe(false);
    expect(mounted.active()).toBe(false);
    expect(fixture.canvasDrops.length).toBe(0);
    expect(fixture.node.style.left).toBe('32px');
    expect(mounted.getStats().taps).toBe(1);
    expect(mounted.getStats().commits).toBe(0);
    mounted.destroy();
  });

  test('sub-threshold move keeps native scroll and does not steal', () => {
    const fixture = createDoc();
    const mounted = mountTouchDndV194({
      document: fixture.doc,
      DataTransfer: FakeDataTransfer,
      DragEvent: FakeDragEvent,
      force: true,
    });
    const start = makeEvent({ target: fixture.node, clientX: 80, clientY: 90 });
    fixture.doc.dispatch('touchstart', start);
    const mid = makeEvent({ target: fixture.node, clientX: 84, clientY: 94 });
    fixture.doc.dispatch('touchmove', mid);
    expect(mid.prevented).toBe(false);
    expect(mounted.sessionKind()).toBe(GESTURE.PENDING);
    expect(fixture.node.style.left).toBe('32px');
    mounted.destroy();
  });

  test('crossing 10px promotes to move and origin-safe drop', () => {
    const fixture = createDoc();
    const mounted = mountTouchDndV194({
      document: fixture.doc,
      DataTransfer: FakeDataTransfer,
      DragEvent: FakeDragEvent,
      force: true,
    });
    fixture.doc.dispatch('touchstart', makeEvent({ target: fixture.node, clientX: 80, clientY: 90 }));
    const steal = makeEvent({ target: fixture.node, clientX: 130, clientY: 160 });
    fixture.doc.dispatch('touchmove', steal);
    expect(steal.prevented).toBe(true);
    expect(mounted.sessionKind()).toBe(GESTURE.MOVE);
    expect(fixture.node.style.left).toBe('82px');
    expect(fixture.node.style.top).toBe('118px');
    expect(computeMovedOrigin({
      originLeft: 32, originTop: 48, startClientX: 80, startClientY: 90, clientX: 130, clientY: 160,
    })).toEqual({ left: 82, top: 118 });
    fixture.doc.dispatch('touchend', makeEvent({ target: fixture.node, clientX: 130, clientY: 160 }));
    expect(mounted.active()).toBe(false);
    expect(fixture.canvasDrops.length).toBe(1);
    const drop = fixture.canvasDrops[0];
    expect(drop.dataTransfer.getData(NODE_TRANSFER_KEY)).toBe('n-7');
    expect(JSON.parse(drop.dataTransfer.getData(ORIGIN_TRANSFER_KEY))).toEqual({ left: 82, top: 118 });
    const expectedDrop = dropClientFromNodeOrigin(fixture.canvas, fixture.node);
    expect(drop.clientX).toBe(expectedDrop.x);
    expect(drop.clientY).toBe(expectedDrop.y);
    expect(drop.clientX).not.toBe(130);
    expect(mounted.getStats().commits).toBe(1);
    expect(mounted.getStats().promotedMove).toBe(1);
    mounted.destroy();
  });

  test('resize corner and empty canvas are passthrough', () => {
    const fixture = createDoc();
    const mounted = mountTouchDndV194({
      document: fixture.doc,
      DataTransfer: FakeDataTransfer,
      DragEvent: FakeDragEvent,
      force: true,
    });
    const scrollEvent = makeEvent({ target: { closest: () => null }, clientX: 10, clientY: 10 });
    fixture.doc.dispatch('touchstart', scrollEvent);
    expect(scrollEvent.prevented).toBe(false);
    expect(mounted.getStats().scrollPassthrough).toBeGreaterThan(0);

    const resizeTarget = {
      dataset: { node: 'n-8' },
      style: { left: '0px', top: '0px' },
      classList: new FakeClassList(),
      getBoundingClientRect: () => ({ left: 0, top: 0, right: 80, bottom: 80 }),
      closest(selector) { return selector === '[data-node]' ? this : null; },
    };
    const resizeEvent = makeEvent({ target: resizeTarget, clientX: 70, clientY: 70 });
    fixture.doc.dispatch('touchstart', resizeEvent);
    expect(resizeEvent.prevented).toBe(false);
    expect(mounted.getStats().blockedResize).toBe(1);
    expect(mounted.active()).toBe(false);
    expect(isNearResizeCorner(resizeTarget, 70, 70, 22)).toBe(true);
    mounted.destroy();
  });

  test('one pointer/touch/pen session at a time', () => {
    const fixture = createDoc();
    const mounted = mountTouchDndV194({
      document: fixture.doc,
      DataTransfer: FakeDataTransfer,
      DragEvent: FakeDragEvent,
      force: true,
    });
    const first = makeEvent({ target: fixture.node, pointerId: 1, clientX: 80, clientY: 90 });
    fixture.doc.dispatch('pointerdown', first);
    expect(mounted.active()).toBe(true);
    const second = makeEvent({ target: fixture.node, pointerId: 2, clientX: 90, clientY: 100 });
    fixture.doc.dispatch('pointerdown', second);
    expect(mounted.getStats().ignoredSecondSession).toBeGreaterThan(0);
    fixture.doc.dispatch('touchstart', makeEvent({ target: fixture.node, clientX: 90, clientY: 100 }));
    expect(mounted.getStats().ignoredSecondSession).toBeGreaterThan(1);
    expect(mounted.sessionKind()).toBe(GESTURE.PENDING);
    mounted.destroy();
    expect(fixture.doc.documentElement.dataset.touchDnd).toBeUndefined();
    expect(globalThis.__YAIWES_TOUCH_DND_V194__).toBeUndefined();
  });
});

test.describe('F-FE-072 android-size playwright', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-chromium', 'Pixel 7 gate');
    await page.route('**/f-fe-072-harness.html', async (route) => {
      await route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: harnessHtml() });
    });
    await page.goto('/f-fe-072-harness.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.__YAIWES_F_FE_072__?.ok === true);
  });

  test('empty-canvas swipe preserves scroll', async ({ page }) => {
    const canvas = page.locator('#canvas');
    const before = await canvas.evaluate((el) => el.scrollTop);
    await dispatchTouch(page, 300, 500, 300, 120, 10);
    await expect.poll(() => canvas.evaluate((el) => el.scrollTop), { timeout: 7000 }).toBeGreaterThan(before);
    const stats = await page.evaluate(() => window.__YAIWES_F_FE_072__.getStats());
    expect(stats.commits).toBe(0);
    const left = await page.locator('#node-1').evaluate((el) => el.style.left);
    expect(left).toBe('40px');
  });

  test('node tap below threshold does not move', async ({ page }) => {
    const box = await page.locator('#node-1').boundingBox();
    expect(box).toBeTruthy();
    const sx = Math.round(box.x + 24);
    const sy = Math.round(box.y + 24);
    await dispatchTouch(page, sx, sy, sx + 4, sy + 3, 3);
    const left = await page.locator('#node-1').evaluate((el) => el.style.left);
    expect(left).toBe('40px');
    const stats = await page.evaluate(() => window.__YAIWES_F_FE_072__.getStats());
    expect(stats.commits).toBe(0);
  });

  test('node move above threshold relocates and resize corner is not stolen', async ({ page }) => {
    const node = page.locator('#node-1');
    const startBox = await node.boundingBox();
    expect(startBox).toBeTruthy();
    const sx = Math.round(startBox.x + 24);
    const sy = Math.round(startBox.y + 24);
    await dispatchTouch(page, sx, sy, sx + 80, sy + 50, 10);
    await expect.poll(() => node.evaluate((el) => Number.parseFloat(el.style.left)), { timeout: 7000 }).toBeGreaterThan(40);
    const afterMove = await node.evaluate((el) => ({ left: el.style.left, top: el.style.top }));
    expect(afterMove.left).not.toBe('40px');

    const box = await node.boundingBox();
    const rx = Math.round(box.x + box.width - 8);
    const ry = Math.round(box.y + box.height - 8);
    const leftBefore = await node.evaluate((el) => el.style.left);
    await dispatchTouch(page, rx, ry, rx + 40, ry + 40, 6);
    const leftAfter = await node.evaluate((el) => el.style.left);
    expect(leftAfter).toBe(leftBefore);
    const stats = await page.evaluate(() => window.__YAIWES_F_FE_072__.getStats());
    expect(stats.blockedResize).toBeGreaterThan(0);
    expect(stats.promotedMove).toBeGreaterThan(0);
  });
});
