import { test, expect } from '@playwright/test';

const URL = '/index-v192.html';

async function boot(page) {
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.app-shell')).toHaveAttribute('data-workspace-shell', 'v1');
  await expect(page.locator('#canvas')).toBeVisible();
  await expect(page.locator('[data-workspace-toggle="left"]')).toBeVisible();
  await expect(page.locator('[data-workspace-toggle="right"]')).toBeVisible();
}

test('desktop shell collapses panels without hiding canvas', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop-only workspace gate');
  await page.setViewportSize({ width: 1440, height: 900 });
  await boot(page);
  const canvas = page.locator('#canvas');
  const before = await canvas.boundingBox();
  await page.locator('[data-workspace-toggle="left"]').click();
  await expect(page.locator('.studio')).toHaveClass(/workspace-left-collapsed/);
  await expect(canvas).toBeVisible();
  const afterLeft = await canvas.boundingBox();
  expect(afterLeft?.width || 0).toBeGreaterThanOrEqual(before?.width || 0);
  await page.locator('[data-workspace-toggle="right"]').click();
  await expect(page.locator('.studio')).toHaveClass(/workspace-right-collapsed/);
  await expect(canvas).toBeVisible();
  const afterBoth = await canvas.boundingBox();
  expect(afterBoth?.width || 0).toBeGreaterThanOrEqual(afterLeft?.width || 0);
});

test('mobile defaults to canvas-first and drawers do not replace canvas', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'mobile-only touch workspace gate');
  await page.setViewportSize({ width: 412, height: 839 });
  await boot(page);
  await expect(page.locator('.app-shell')).toHaveAttribute('data-workspace-mode', 'mobile');
  const studio = page.locator('.studio');
  await expect(studio).toHaveClass(/workspace-left-collapsed/);
  await expect(studio).toHaveClass(/workspace-right-collapsed/);
  await expect(page.locator('#canvas')).toBeVisible();
  const canvasBox = await page.locator('#canvas').boundingBox();
  expect(canvasBox?.height || 0).toBeGreaterThan(200);

  await page.locator('[data-workspace-toggle="left"]').tap();
  await expect(page.locator('.library-pane')).toBeVisible();
  await expect(page.locator('#canvas')).toBeVisible();
  const libraryBox = await page.locator('.library-pane').boundingBox();
  expect(libraryBox?.width || 9999).toBeLessThanOrEqual(412);
  const leftClose = page.locator('[data-workspace-close="left"]');
  const leftCloseBox = await leftClose.boundingBox();
  expect(leftCloseBox?.height || 0).toBeGreaterThanOrEqual(44);
  await leftClose.tap();
  await expect(studio).toHaveClass(/workspace-left-collapsed/);

  await page.locator('[data-workspace-toggle="right"]').tap();
  await expect(page.locator('.context-pane')).toBeVisible();
  await expect(page.locator('#canvas')).toBeVisible();
  const contextBox = await page.locator('.context-pane').boundingBox();
  expect(contextBox?.width || 9999).toBeLessThanOrEqual(412);
  await page.locator('[data-workspace-close="right"]').tap();
  await expect(studio).toHaveClass(/workspace-right-collapsed/);
  await expect(page.locator('#canvas')).toBeVisible();
});

test('workspace controls keep minimum touch target and panel scrolling', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'mobile-only touch/scroll workspace gate');
  await page.setViewportSize({ width: 412, height: 839 });
  await boot(page);
  const toggle = page.locator('[data-workspace-toggle="left"]');
  const box = await toggle.boundingBox();
  expect(box?.height || 0).toBeGreaterThanOrEqual(44);
  await toggle.tap();
  const library = page.locator('.library-pane');
  await expect(library).toBeVisible();
  const metrics = await library.evaluate(el => ({ scrollHeight: el.scrollHeight, clientHeight: el.clientHeight, top: el.scrollTop }));
  expect(metrics.scrollHeight).toBeGreaterThanOrEqual(metrics.clientHeight);
  if (metrics.scrollHeight > metrics.clientHeight) {
    await library.evaluate(el => { el.scrollTop = Math.min(200, el.scrollHeight - el.clientHeight); });
    await expect.poll(() => library.evaluate(el => el.scrollTop)).toBeGreaterThan(metrics.top);
  }
  await expect(page.locator('#canvas')).toBeVisible();
});
