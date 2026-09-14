import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const URL = '/index-v194.html';
const OUT = 'test-results/f-int-v194-070';
mkdirSync(OUT, { recursive: true });

async function boot(page) {
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => globalThis.__YAIWES_FACTORY_CANDIDATE_V194__?.version === '1.9.4', null, { timeout: 10_000 });
  await expect(page.locator('#canvas')).toBeVisible();
  await expect(page.locator('.app-shell')).toHaveAttribute('data-workspace-shell', 'v2');
  await expect(page.locator('html')).toHaveAttribute('data-component-browser', 'v2');
  await expect(page.locator('.workspace-shell-controls')).toHaveCount(1);
  await expect(page.locator('.component-browser-v2')).toHaveCount(1);
}

test('V1.9.4 desktop composes released shell-v2 + browser-v2 without duplicate controls', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop integration gate');
  await boot(page);
  const evidence = await page.evaluate(() => globalThis.__YAIWES_FACTORY_CANDIDATE_V194__);
  expect(evidence.capabilities.workspaceShell).toBe('v2');
  expect(evidence.capabilities.componentBrowser).toBe('v2');
  expect(evidence.modules).toContain('../frontend-router-bridge.js');
  expect(evidence.modules).toContain('../hf-jobs-panel-v1.js');
  expect(evidence.modules).not.toContain('../ui/workspace-shell-v1.js');
  expect(evidence.modules).not.toContain('../ui/component-browser-v1.js');

  const search = page.locator('[data-component-search]');
  await search.fill('Botón');
  await expect(page.locator('[data-kind="button"]')).toBeVisible();
  await page.locator('[data-kind="button"]').click();
  await expect(page.locator('[data-component-preview]')).toBeVisible();
  await page.locator('[data-preview-insert]').click();
  await expect(page.locator('[data-node]')).toHaveCount(1);
  await page.screenshot({ path: `${OUT}/desktop-v194.png`, fullPage: true });
});

test('V1.9.4 mobile keeps workspace controls inside viewport and closes drawers', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'mobile integration gate');
  await boot(page);
  await expect(page.locator('.app-shell')).toHaveAttribute('data-workspace-mode', 'mobile');

  const overflow = await page.evaluate(() => ({
    innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
  }));
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.innerWidth + 1);
  expect(overflow.bodyScrollWidth).toBeLessThanOrEqual(overflow.innerWidth + 1);

  const inspector = page.locator('[data-workspace-toggle="right"]');
  await expect(inspector).toBeVisible();
  const box = await inspector.boundingBox();
  expect(box).not.toBeNull();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(overflow.innerWidth + 1);
  const hit = await page.evaluate(({ x, y }) => {
    const target = document.querySelector('[data-workspace-toggle="right"]');
    const el = document.elementFromPoint(x, y);
    return Boolean(target && el && (el === target || target.contains(el)));
  }, { x: Math.round(box.x + box.width / 2), y: Math.round(box.y + box.height / 2) });
  expect(hit).toBe(true);

  await inspector.tap();
  await expect(page.locator('.context-pane')).toHaveAttribute('aria-hidden', 'false');
  await page.keyboard.press('Escape');
  await expect(page.locator('.context-pane')).toHaveAttribute('aria-hidden', 'true');
  await expect(inspector).toHaveAttribute('aria-expanded', 'false');

  const library = page.locator('[data-workspace-toggle="left"]');
  await library.tap();
  await expect(page.locator('.library-pane')).toHaveAttribute('aria-hidden', 'false');
  await page.locator('[data-workspace-close="left"]').tap();
  await expect(page.locator('.library-pane')).toHaveAttribute('aria-hidden', 'true');
  await page.screenshot({ path: `${OUT}/mobile-v194.png`, fullPage: true });
});
