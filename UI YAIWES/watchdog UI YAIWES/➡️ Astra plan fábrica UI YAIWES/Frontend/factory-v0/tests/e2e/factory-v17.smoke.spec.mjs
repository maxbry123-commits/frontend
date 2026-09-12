import { test, expect } from '@playwright/test';

test.describe('YAIWES Factory V1.7 donor smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await expect(page.getByText('YAIWES UI Factory')).toBeVisible();
  });

  test('loads current shell and donor evidence', async ({ page }) => {
    await expect(page.locator('.component-card')).toHaveCount(10);
    await expect(page.locator('#yaiwes-minimap')).toBeVisible();
    const evidence = await page.evaluate(() => ({
      donors: window.__YAIWES_DONOR_EVIDENCE__,
      interactions: window.__YAIWES_INTERACTIONS__
    }));
    expect(evidence.donors.frappeBuilderContextMenu.name).toBe('Frappe Builder');
    expect(evidence.donors.xyflowMinimap.sourceBlob).toBe('7d02b8ae105f23cf28f6ef91137d067fb27d2574');
    expect(evidence.interactions.resize.donor).toBe('Craft.js');
  });

  test('Frappe context menu reuses duplicate action', async ({ page }) => {
    await page.locator('[data-kind="window"]').click();
    const node = page.locator('[data-node]').first();
    await node.click({ button: 'right' });
    await expect(page.locator('#yaiwes-frappe-context-menu')).toBeVisible();
    await page.locator('#yaiwes-frappe-context-menu [data-existing-action="duplicate-selected"]').click();
    await expect(page.locator('[data-node]')).toHaveCount(2);
  });

  test('Craft-derived resize commits snapped dimensions', async ({ page }) => {
    await page.locator('[data-kind="panel"]').click();
    const node = page.locator('[data-node]').first();
    await node.click();
    const before = await node.boundingBox();
    expect(before).toBeTruthy();
    await page.mouse.move(before.x + before.width - 4, before.y + before.height - 4);
    await page.mouse.down();
    await page.mouse.move(before.x + before.width + 36, before.y + before.height + 28);
    await page.mouse.up();
    const size = await node.evaluate(el => ({
      w: Number.parseFloat(el.style.width),
      h: Number.parseFloat(el.style.height)
    }));
    expect(size.w % 8).toBe(0);
    expect(size.h % 8).toBe(0);
    expect(size.w).toBeGreaterThan(220);
    expect(size.h).toBeGreaterThan(120);
  });

  test('xyflow-derived minimap mirrors nodes and selects from map', async ({ page }) => {
    await page.locator('[data-kind="window"]').click();
    await page.locator('[data-kind="button"]').click();
    await expect(page.locator('[data-minimap-node]')).toHaveCount(2);
    const firstId = await page.locator('[data-minimap-node]').first().getAttribute('data-minimap-node');
    await page.locator('[data-minimap-node]').first().click();
    await expect(page.locator(`[data-node="${firstId}"]`)).toHaveClass(/selected/);
  });
});
