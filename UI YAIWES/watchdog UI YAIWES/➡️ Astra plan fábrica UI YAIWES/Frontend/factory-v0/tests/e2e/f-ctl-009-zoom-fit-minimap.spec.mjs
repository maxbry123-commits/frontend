import { test, expect } from '@playwright/test';

const URL = '/index-v192.html';

async function boot(page) {
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#canvas')).toBeVisible();
  await expect(page.locator('#yaiwes-minimap')).toBeVisible();
  await expect(page.locator('#fit-view')).toBeVisible();
}

test.describe('F-CTL-009 zoom / fit view / minimap', () => {
  test('controls produce real reproducible viewport effects', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop viewport contract');
    await boot(page);

    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.locator('[data-kind="window"]').click();
    await page.locator('[data-kind="button"]').click();
    await expect(page.locator('[data-node]')).toHaveCount(2);

    await page.locator('#zoom-reset').click();
    await expect(page.locator('#zoom-label')).toHaveText('100%');
    const z0 = await page.locator('#canvas').evaluate(el => getComputedStyle(el).getPropertyValue('--canvas-zoom').trim());
    await page.locator('#zoom-in').click();
    await expect(page.locator('#zoom-label')).toHaveText('110%');
    const z1 = await page.locator('#canvas').evaluate(el => getComputedStyle(el).getPropertyValue('--canvas-zoom').trim());
    expect(z1).not.toBe(z0);
    await page.locator('#zoom-out').click();
    await expect(page.locator('#zoom-label')).toHaveText('100%');

    const minimapNodes = page.locator('#yaiwes-minimap [data-minimap-node]');
    await expect(minimapNodes).toHaveCount(2);
    const targetId = await minimapNodes.nth(1).getAttribute('data-minimap-node');
    await minimapNodes.nth(1).click();
    await expect(page.locator(`[data-node="${targetId}"]`)).toHaveClass(/selected/);

    await page.locator('[data-node]').nth(1).evaluate(el => {
      el.style.left = '1400px';
      el.style.top = '900px';
    });
    const before = await page.locator('#canvas').evaluate(el => ({
      left: el.scrollLeft,
      top: el.scrollTop,
      zoom: getComputedStyle(el).getPropertyValue('--canvas-zoom').trim()
    }));
    await page.locator('#fit-view').click();
    await expect.poll(async () => {
      const after = await page.locator('#canvas').evaluate(el => ({
        left: el.scrollLeft,
        top: el.scrollTop,
        zoom: getComputedStyle(el).getPropertyValue('--canvas-zoom').trim()
      }));
      return after.zoom !== before.zoom || after.left !== before.left || after.top !== before.top;
    }).toBe(true);

    const viewportRect = page.locator('#yaiwes-minimap .yaiwes-minimap__viewport');
    await expect(viewportRect).toBeVisible();
    const box = await viewportRect.boundingBox();
    expect(box?.width || 0).toBeGreaterThan(0);
    expect(box?.height || 0).toBeGreaterThan(0);
  });
});
