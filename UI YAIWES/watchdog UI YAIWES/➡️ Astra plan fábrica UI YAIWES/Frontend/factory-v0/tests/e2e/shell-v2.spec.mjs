import { test, expect } from '@playwright/test';

const URL = '/tests/e2e/shell-v2-harness.html';

async function boot(page) {
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.app-shell')).toHaveAttribute('data-workspace-shell', 'v2');
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
});

test('desktop resize inside desktop mode preserves user-collapsed drawer', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop-only resize non-reset gate');
  await page.setViewportSize({ width: 1440, height: 900 });
  await boot(page);
  await page.locator('[data-workspace-toggle="left"]').click();
  await expect(page.locator('.studio')).toHaveClass(/workspace-left-collapsed/);
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(page.locator('.app-shell')).toHaveAttribute('data-workspace-mode', 'desktop');
  await expect(page.locator('.studio')).toHaveClass(/workspace-left-collapsed/);
  await expect(page.locator('#canvas')).toBeVisible();
});

test('mobile defaults to canvas-first and drawers overlay canvas', async ({ page }, testInfo) => {
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
  await expect(page.locator('[data-workspace-backdrop]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(studio).toHaveClass(/workspace-right-collapsed/);
  await expect(page.locator('#canvas')).toBeVisible();
});

test('workspace survives mobile desktop mobile mode transitions', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'single-project deterministic resize gate');
  await page.setViewportSize({ width: 412, height: 839 });
  await boot(page);
  const app = page.locator('.app-shell');
  const studio = page.locator('.studio');
  const canvas = page.locator('#canvas');
  await expect(app).toHaveAttribute('data-workspace-mode', 'mobile');
  await expect(studio).toHaveClass(/workspace-left-collapsed/);
  await expect(studio).toHaveClass(/workspace-right-collapsed/);

  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(app).toHaveAttribute('data-workspace-mode', 'desktop');
  await expect(studio).not.toHaveClass(/workspace-left-collapsed/);
  await expect(studio).not.toHaveClass(/workspace-right-collapsed/);
  await expect(canvas).toBeVisible();

  await page.setViewportSize({ width: 412, height: 839 });
  await expect(app).toHaveAttribute('data-workspace-mode', 'mobile');
  await expect(studio).toHaveClass(/workspace-left-collapsed/);
  await expect(studio).toHaveClass(/workspace-right-collapsed/);
  await expect(canvas).toBeVisible();
});
