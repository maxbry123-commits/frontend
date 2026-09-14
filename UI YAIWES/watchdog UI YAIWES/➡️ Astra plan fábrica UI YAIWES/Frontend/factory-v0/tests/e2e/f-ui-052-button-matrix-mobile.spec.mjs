import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const URL = '/index-v193.html';
const OUT = 'test-results/f-ui-052';
const PROJECT_KEY = 'yaiwes-factory-project-v19';
mkdirSync(OUT, { recursive: true });

async function boot(page) {
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#canvas')).toBeVisible();
  await page.waitForFunction(() => Boolean(globalThis.__YAIWES_FACTORY_CANDIDATE_V193__), null, { timeout: 10_000 });
  await expect(page.locator('.app-shell')).toHaveAttribute('data-workspace-mode', 'mobile');
}

async function dispatchSyntheticTouch(page, sx, sy, ex, ey) {
  const session = await page.context().newCDPSession(page);
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: sx, y: sy, radiusX: 5, radiusY: 5, force: 1 }]
  });
  for (let i = 1; i <= 10; i += 1) {
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{
        x: Math.round(sx + ((ex - sx) * i) / 10),
        y: Math.round(sy + ((ey - sy) * i) / 10),
        radiusX: 5,
        radiusY: 5,
        force: 1
      }]
    });
    await page.waitForTimeout(25);
  }
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
}

async function resetProject(page) {
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => Boolean(globalThis.__YAIWES_FACTORY_CANDIDATE_V193__), null, { timeout: 10_000 });
  await expect(page.locator('[data-node]')).toHaveCount(0);
}

async function assertVisibleTarget(page, selector, label) {
  const locator = page.locator(selector);
  await expect(locator, `${label} must be visible`).toBeVisible();
  const box = await locator.boundingBox();
  expect(box, `${label} needs a bounding box`).not.toBeNull();
  expect(box.width, `${label} width`).toBeGreaterThanOrEqual(24);
  expect(box.height, `${label} height`).toBeGreaterThanOrEqual(24);
  const hit = await page.evaluate(({ selector, x, y }) => {
    const element = document.elementFromPoint(x, y);
    const target = document.querySelector(selector);
    return Boolean(element && target && (element === target || target.contains(element)));
  }, { selector, x: Math.round(box.x + box.width / 2), y: Math.round(box.y + box.height / 2) });
  expect(hit, `${label} center must not be covered by another element`).toBe(true);
}

async function insertButtonFromMobileLibrary(page) {
  const leftToggle = page.locator('[data-workspace-toggle="left"]');
  await expect(leftToggle).toHaveAttribute('aria-expanded', 'false');
  await assertVisibleTarget(page, '[data-workspace-toggle="left"]', 'library toggle');
  await leftToggle.tap();
  await expect(page.locator('.library-pane')).toHaveAttribute('aria-hidden', 'false');
  await assertVisibleTarget(page, '[data-workspace-close="left"]', 'library close');

  const card = page.locator('[data-kind="button"]');
  await expect(card).toBeVisible();
  await card.tap();
  const insert = page.locator('[data-preview-insert]');
  await expect(insert).toBeVisible();
  await insert.tap();
  await expect(page.locator('[data-node]')).toHaveCount(1);

  await page.locator('[data-workspace-close="left"]').tap();
  await expect(page.locator('.library-pane')).toHaveAttribute('aria-hidden', 'true');
}

async function touchMoveAndPersist(page) {
  const node = page.locator('[data-node]').first();
  await node.scrollIntoViewIfNeeded();
  const nodeId = await node.getAttribute('data-node');
  const target = await node.evaluate(el => {
    const r = el.getBoundingClientRect();
    const vw = innerWidth;
    const vh = innerHeight;
    const left = Math.max(0, r.left);
    const right = Math.min(vw, r.right);
    const top = Math.max(0, r.top);
    const bottom = Math.min(vh, r.bottom);
    if (right <= left || bottom <= top) return null;
    return {
      x: Math.round(left + Math.min(40, Math.max(2, (right - left) / 3))),
      y: Math.round(top + Math.min(30, Math.max(2, (bottom - top) / 3))),
      vw,
      vh
    };
  });
  expect(target, 'node must intersect mobile viewport').not.toBeNull();

  const hit = await page.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.closest?.('[data-node]')?.dataset?.node || null, target);
  expect(hit, 'touch start coordinate must hit selected node').toBe(nodeId);

  const before = await node.evaluate(el => ({ left: el.style.left, top: el.style.top }));
  const statsBefore = await page.evaluate(() => globalThis.__YAIWES_TOUCH_DND_V192__?.getStats?.() || null);
  expect(statsBefore).not.toBeNull();

  const ex = Math.min(target.vw - 3, target.x + 80);
  const ey = Math.min(target.vh - 3, target.y + 60);
  await dispatchSyntheticTouch(page, target.x, target.y, ex, ey);
  await page.waitForTimeout(150);

  const statsAfter = await page.evaluate(() => globalThis.__YAIWES_TOUCH_DND_V192__?.getStats?.() || null);
  expect((statsAfter.pointerDown + statsAfter.touchStart) - (statsBefore.pointerDown + statsBefore.touchStart)).toBeGreaterThan(0);
  expect((statsAfter.pointerMove + statsAfter.touchMove) - (statsBefore.pointerMove + statsBefore.touchMove)).toBeGreaterThan(0);
  expect(statsAfter.commits - statsBefore.commits).toBeGreaterThan(0);

  await expect.poll(() => node.evaluate(el => ({ left: el.style.left, top: el.style.top })), { timeout: 7000 }).not.toEqual(before);
  const moved = await node.evaluate(el => ({ left: el.style.left, top: el.style.top }));
  const stored = await page.evaluate(key => JSON.parse(localStorage.getItem(key) || 'null'), PROJECT_KEY);
  expect(stored?.state?.components?.length).toBe(1);

  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => Boolean(globalThis.__YAIWES_FACTORY_CANDIDATE_V193__), null, { timeout: 10_000 });
  await expect(page.locator('[data-node]')).toHaveCount(1);
  const restored = await page.locator('[data-node]').first().evaluate(el => ({ left: el.style.left, top: el.style.top }));
  expect(restored).toEqual(moved);
}

async function verifyInspectorDrawer(page) {
  const rightToggle = page.locator('[data-workspace-toggle="right"]');
  await expect(rightToggle).toHaveAttribute('aria-expanded', 'false');
  await assertVisibleTarget(page, '[data-workspace-toggle="right"]', 'inspector toggle');
  await rightToggle.tap();
  await expect(page.locator('.context-pane')).toHaveAttribute('aria-hidden', 'false');
  await assertVisibleTarget(page, '[data-workspace-close="right"]', 'inspector close');
  await page.locator('[data-workspace-close="right"]').tap();
  await expect(page.locator('.context-pane')).toHaveAttribute('aria-hidden', 'true');
}

test('F-UI-052 mobile/touch controls, drawers, move and reload recovery', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'mobile matrix runs on Pixel 7 project');
  test.setTimeout(60_000);
  await boot(page);
  await resetProject(page);

  await page.screenshot({ path: `${OUT}/portrait-start.png`, fullPage: true });
  await insertButtonFromMobileLibrary(page);
  await verifyInspectorDrawer(page);
  await touchMoveAndPersist(page);

  await page.setViewportSize({ width: 915, height: 412 });
  await page.waitForTimeout(150);
  await expect(page.locator('#canvas')).toBeVisible();
  await page.screenshot({ path: `${OUT}/landscape-after-reload.png`, fullPage: true });
});
