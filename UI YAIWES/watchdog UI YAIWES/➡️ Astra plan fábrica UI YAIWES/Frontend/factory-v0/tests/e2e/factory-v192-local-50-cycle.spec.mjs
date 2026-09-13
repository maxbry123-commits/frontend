import { test, expect } from '@playwright/test';

const CYCLES = 50;
const URL = '/index-v192.html';
const PROJECT_KEY = 'yaiwes-factory-project-v19';

async function boot(page, { expectContextVisible = true } = {}) {
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(/YAIWES UI Factory V1\.9\.2/);
  await expect(page.locator('#canvas')).toBeVisible();
  await expect(page.locator('#context-scroll')).toHaveCount(1);
  if (expectContextVisible) await expect(page.locator('#context-scroll')).toBeVisible();
}

async function hardReset(page) {
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-node]')).toHaveCount(0);
}

async function addAndMoveWithMouse(page) {
  const source = page.locator('[data-kind="window"]');
  const canvas = page.locator('#canvas');
  await source.dragTo(canvas, { targetPosition: { x: 180, y: 160 } });
  await expect(page.locator('[data-node]')).toHaveCount(1);
  const node = page.locator('[data-node]').first();
  const before = await node.evaluate(el => ({ left: el.style.left, top: el.style.top }));
  await node.dragTo(canvas, { targetPosition: { x: 420, y: 260 } });
  const after = await node.evaluate(el => ({ left: el.style.left, top: el.style.top }));
  expect(after).not.toEqual(before);
  return after;
}

async function verifyReloadRecovery(page, position) {
  const stored = await page.evaluate(key => JSON.parse(localStorage.getItem(key) || 'null'), PROJECT_KEY);
  expect(stored?.state?.components?.length).toBe(1);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-node]')).toHaveCount(1);
  const restored = await page.locator('[data-node]').first().evaluate(el => ({ left: el.style.left, top: el.style.top }));
  expect(restored).toEqual(position);
}

async function verifySingleContextScroll(page) {
  await page.locator('[data-step="3"]').click();
  const panel = page.locator('#context-scroll');
  const nested = page.locator('.oss-grid');
  await expect(nested).toHaveCSS('overflow-y', 'visible');
  const metrics = await panel.evaluate(el => ({ top: el.scrollTop, height: el.scrollHeight, client: el.clientHeight }));
  expect(metrics.height).toBeGreaterThan(metrics.client);
  await panel.hover();
  await page.mouse.wheel(0, 900);
  await expect.poll(() => panel.evaluate(el => el.scrollTop)).toBeGreaterThan(metrics.top);
}

async function verifyControls(page) {
  await page.locator('[data-step="2"]').click();
  for (const bp of ['desktop', 'tablet', 'mobile']) {
    await page.locator(`.canvas-controls button[data-breakpoint="${bp}"]`).click();
    await expect(page.locator('#canvas')).toHaveAttribute('data-breakpoint', bp);
  }
  await page.locator('.canvas-controls button[data-breakpoint="desktop"]').click();
  await page.locator('#zoom-reset').click();
  await expect(page.locator('#zoom-label')).toHaveText('100%');
  await page.locator('#zoom-in').click();
  await expect(page.locator('#zoom-label')).not.toHaveText('100%');
  await page.locator('#zoom-out').click();
  await page.locator('#undo').click();
  await page.locator('#redo').click();
  await page.locator('#save-version').click();
  await expect(page.locator('#status')).toContainText('RECOVERY');
}

async function dispatchSyntheticTouch(page, sx, sy, ex, ey) {
  const session = await page.context().newCDPSession(page);
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: sx, y: sy, radiusX: 5, radiusY: 5, force: 1 }] });
  for (let i = 1; i <= 10; i += 1) {
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: Math.round(sx + ((ex - sx) * i) / 10), y: Math.round(sy + ((ey - sy) * i) / 10), radiusX: 5, radiusY: 5, force: 1 }]
    });
    await page.waitForTimeout(25);
  }
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
}

async function touchDragNode(page) {
  await hardReset(page);
  await page.locator('[data-kind="button"]').tap();
  await expect(page.locator('[data-node]')).toHaveCount(1);
  const node = page.locator('[data-node]').first();
  const nodeId = await node.getAttribute('data-node');

  // V1.9.2 trace 34732313529 proved the old synthetic start point could be
  // below the visible Pixel 7 viewport (elementFromPoint=null) before the
  // product adapter received any event. Scroll the real node into view and
  // choose a point from the visible node/viewport intersection; this keeps
  // the product assertion strict instead of masking a touch failure.
  await node.scrollIntoViewIfNeeded();
  const target = await node.evaluate(el => {
    const r = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const left = Math.max(0, r.left);
    const right = Math.min(vw, r.right);
    const top = Math.max(0, r.top);
    const bottom = Math.min(vh, r.bottom);
    if (right <= left || bottom <= top) return null;
    const x = Math.round(left + Math.min(45, Math.max(1, (right - left) / 3)));
    const y = Math.round(top + Math.min(35, Math.max(1, (bottom - top) / 3)));
    return { x, y, rect:{x:r.x,y:r.y,width:r.width,height:r.height}, viewport:{width:vw,height:vh} };
  });
  expect(target, 'TEST_INPUT_HARNESS_GAP node has no visible viewport intersection').not.toBeNull();
  const sx = target.x;
  const sy = target.y;
  const ex = Math.min(target.viewport.width - 2, sx + 90);
  const ey = Math.min(target.viewport.height - 2, sy + 70);
  const hit = await page.evaluate(({x,y}) => {
    const el = document.elementFromPoint(x,y);
    const node = el?.closest?.('[data-node]');
    return node ? { id: node.dataset.node, tag: el.tagName, cls: el.className } : null;
  }, {x:sx,y:sy});
  expect(hit?.id, `TOUCH_COORDINATE_MISS ${JSON.stringify({nodeId,hit,sx,sy,target})}`).toBe(nodeId);

  const before = await node.evaluate(el => ({ left: el.style.left, top: el.style.top }));
  const statsBefore = await page.evaluate(() => window.__YAIWES_TOUCH_DND_V192__?.getStats?.() || null);
  expect(statsBefore, 'V192_TOUCH_ADAPTER_NOT_LOADED').not.toBeNull();

  await dispatchSyntheticTouch(page, sx, sy, ex, ey);
  await page.waitForTimeout(150);

  const statsAfter = await page.evaluate(() => window.__YAIWES_TOUCH_DND_V192__?.getStats?.() || null);
  const receivedStart = (statsAfter.pointerDown + statsAfter.touchStart) - (statsBefore.pointerDown + statsBefore.touchStart);
  const receivedMove = (statsAfter.pointerMove + statsAfter.touchMove) - (statsBefore.pointerMove + statsBefore.touchMove);
  const commits = statsAfter.commits - statsBefore.commits;
  console.log(`V192_TOUCH_STATS=${JSON.stringify({before:statsBefore,after:statsAfter,receivedStart,receivedMove,commits,hit,target})}`);
  expect(receivedStart, `TEST_INPUT_HARNESS_GAP no DOM start event ${JSON.stringify(statsAfter)}`).toBeGreaterThan(0);
  expect(receivedMove, `TEST_INPUT_HARNESS_GAP no DOM move event ${JSON.stringify(statsAfter)}`).toBeGreaterThan(0);
  expect(commits, `PRODUCT_TOUCH_COMMIT_GAP ${JSON.stringify(statsAfter)}`).toBeGreaterThan(0);

  await expect.poll(() => node.evaluate(el => ({ left: el.style.left, top: el.style.top })), { timeout: 7000 }).not.toEqual(before);
  const moved = await node.evaluate(el => ({ left: el.style.left, top: el.style.top }));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-node]')).toHaveCount(1);
  const restored = await page.locator('[data-node]').first().evaluate(el => ({ left: el.style.left, top: el.style.top }));
  expect(restored).toEqual(moved);
}

async function touchScrollPanel(page) {
  await page.locator('[data-step="3"]').tap();
  const panel = page.locator('#context-scroll');
  const metrics = await panel.evaluate(el => ({ top: el.scrollTop, height: el.scrollHeight, client: el.clientHeight }));
  expect(metrics.height).toBeGreaterThan(metrics.client);
  const box = await panel.boundingBox();
  if (!box) throw new Error('context panel bounding box unavailable');
  const x = Math.round(box.x + Math.min(80, box.width * 0.25));
  const sy = Math.round(box.y + box.height * 0.8);
  const ey = Math.round(box.y + box.height * 0.2);
  await dispatchSyntheticTouch(page, x, sy, x, ey);
  await expect.poll(() => panel.evaluate(el => el.scrollTop), { timeout: 7000 }).toBeGreaterThan(metrics.top);
}

test.describe('YAIWES Factory V1.9.2 candidate stability', () => {
  test('50 candidate cycles: editor, scroll, controls and reload recovery', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium-desktop', '50-cycle candidate gate runs on desktop project');
    test.setTimeout(120_000);
    await boot(page);
    for (let cycle = 1; cycle <= CYCLES; cycle += 1) {
      await hardReset(page);
      const pos = await addAndMoveWithMouse(page);
      await verifySingleContextScroll(page);
      await verifyControls(page);
      await verifyReloadRecovery(page, pos);
      console.log(`FACTORY_V1_9_2_LOCAL_CYCLE=${cycle}/${CYCLES} PASS`);
    }
  });

  test('mobile touch events, move, persistence and single contextual scroll', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-chromium', 'mobile gate runs on touch project');
    test.setTimeout(45_000);
    await boot(page, { expectContextVisible: false });
    await touchDragNode(page);
    await touchScrollPanel(page);
  });
});
