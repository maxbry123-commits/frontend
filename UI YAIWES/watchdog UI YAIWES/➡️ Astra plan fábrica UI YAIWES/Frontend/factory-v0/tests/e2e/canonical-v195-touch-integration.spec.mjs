import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const URL = '/index-v195.html';
const OUT = 'test-results/f-fe-069-v195';
const PROJECT_KEY = 'yaiwes-factory-project-v19';
mkdirSync(OUT, { recursive: true });

async function boot(page) {
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => globalThis.__YAIWES_FACTORY_CANDIDATE_V195__?.version === '1.9.5', null, { timeout: 10_000 });
  await expect(page.locator('#canvas')).toBeVisible();
  await expect(page.locator('.app-shell')).toHaveAttribute('data-workspace-shell', 'v2');
  await expect(page.locator('html')).toHaveAttribute('data-component-browser', 'v2');
  const runtime = await page.evaluate(() => ({
    candidate: globalThis.__YAIWES_FACTORY_CANDIDATE_V195__,
    touch193: globalThis.__YAIWES_TOUCH_DND_V193__?.version || null,
    touch192: Boolean(globalThis.__YAIWES_TOUCH_DND_V192__),
    bootError: globalThis.__YAIWES_FACTORY_CANDIDATE_V195_ERROR__ || null,
  }));
  expect(runtime.bootError).toBeNull();
  expect(runtime.candidate.capabilities.touch).toBe('touch-dnd-v193');
  expect(runtime.candidate.modules).toContain('../touch-dnd-v193.js');
  expect(runtime.candidate.modules).not.toContain('../touch-dnd-v192.js');
  expect(runtime.touch193).toBe('1.9.3');
  expect(runtime.touch192).toBe(false);
}

async function reset(page) {
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => Boolean(globalThis.__YAIWES_FACTORY_CANDIDATE_V195__), null, { timeout: 10_000 });
  await expect(page.locator('[data-node]')).toHaveCount(0);
}

async function insertButton(page, mobile) {
  if (mobile) {
    const toggle = page.locator('[data-workspace-toggle="left"]');
    await expect(toggle).toBeVisible();
    await toggle.tap();
    await expect(page.locator('.library-pane')).toHaveAttribute('aria-hidden', 'false');
  }
  const card = page.locator('[data-kind="button"]');
  await expect(card).toBeVisible();
  await card.click();
  const insert = page.locator('[data-preview-insert]');
  if (await insert.count()) {
    await expect(insert).toBeVisible();
    await insert.click();
  }
  await expect(page.locator('[data-node]')).toHaveCount(1);
  if (mobile) {
    const close = page.locator('[data-workspace-close="left"]');
    if (await close.count()) await close.tap();
  }
}

async function dispatchTouch(page, start, end) {
  const session = await page.context().newCDPSession(page);
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: start.x, y: start.y, radiusX: 5, radiusY: 5, force: 1 }],
  });
  for (let i = 1; i <= 8; i += 1) {
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{
        x: Math.round(start.x + ((end.x - start.x) * i) / 8),
        y: Math.round(start.y + ((end.y - start.y) * i) / 8),
        radiusX: 5,
        radiusY: 5,
        force: 1,
      }],
    });
    await page.waitForTimeout(20);
  }
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
}

test('V1.9.5 desktop preserves V1.9.4 shell/browser composition with touch v193 only', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop integration gate');
  await boot(page);
  await reset(page);
  await insertButton(page, false);
  const stored = await page.evaluate(key => JSON.parse(localStorage.getItem(key) || 'null'), PROJECT_KEY);
  expect(stored?.state?.components?.length).toBe(1);
  await page.screenshot({ path: `${OUT}/desktop-v195.png`, fullPage: true });
});

test('V1.9.5 mobile touch v193 moves, commits and survives reload', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'mobile integration gate');
  test.setTimeout(60_000);
  await boot(page);
  await reset(page);
  await insertButton(page, true);

  const node = page.locator('[data-node]').first();
  await node.scrollIntoViewIfNeeded();
  const start = await node.evaluate(el => {
    const r = el.getBoundingClientRect();
    const left = Math.max(0, r.left);
    const right = Math.min(innerWidth, r.right);
    const top = Math.max(0, r.top);
    const bottom = Math.min(innerHeight, r.bottom);
    if (right <= left || bottom <= top) return null;
    return {
      x: Math.round(left + Math.min(36, Math.max(4, (right - left) / 3))),
      y: Math.round(top + Math.min(28, Math.max(4, (bottom - top) / 3))),
      vw: innerWidth,
      vh: innerHeight,
    };
  });
  expect(start, 'node must intersect mobile viewport').not.toBeNull();
  const nodeId = await node.getAttribute('data-node');
  const hit = await page.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.closest?.('[data-node]')?.dataset?.node || null, start);
  expect(hit).toBe(nodeId);

  const before = await node.evaluate(el => ({ left: el.style.left, top: el.style.top }));
  const statsBefore = await page.evaluate(() => globalThis.__YAIWES_TOUCH_DND_V193__.getStats());
  const end = { x: Math.min(start.vw - 4, start.x + 72), y: Math.min(start.vh - 4, start.y + 54) };
  await dispatchTouch(page, start, end);

  await expect.poll(() => page.evaluate(() => globalThis.__YAIWES_TOUCH_DND_V193__.getStats().commits), { timeout: 7000 }).toBeGreaterThan(statsBefore.commits);
  const statsAfter = await page.evaluate(() => globalThis.__YAIWES_TOUCH_DND_V193__.getStats());
  expect((statsAfter.pointerMove + statsAfter.touchMove) - (statsBefore.pointerMove + statsBefore.touchMove)).toBeGreaterThan(0);
  const moved = await node.evaluate(el => ({ left: el.style.left, top: el.style.top }));
  expect(moved).not.toEqual(before);

  const stored = await page.evaluate(key => JSON.parse(localStorage.getItem(key) || 'null'), PROJECT_KEY);
  expect(stored?.state?.components?.length).toBe(1);

  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => Boolean(globalThis.__YAIWES_FACTORY_CANDIDATE_V195__), null, { timeout: 10_000 });
  await expect(page.locator('[data-node]')).toHaveCount(1);
  const restored = await page.locator('[data-node]').first().evaluate(el => ({ left: el.style.left, top: el.style.top }));
  expect(restored).toEqual(moved);
  const runtime = await page.evaluate(() => ({ v193: globalThis.__YAIWES_TOUCH_DND_V193__?.version, v192: Boolean(globalThis.__YAIWES_TOUCH_DND_V192__) }));
  expect(runtime).toEqual({ v193: '1.9.3', v192: false });
  await page.screenshot({ path: `${OUT}/mobile-v195.png`, fullPage: true });
});
