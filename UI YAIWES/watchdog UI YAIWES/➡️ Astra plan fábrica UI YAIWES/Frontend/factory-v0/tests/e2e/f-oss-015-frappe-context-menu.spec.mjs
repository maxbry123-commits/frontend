import { test, expect } from '@playwright/test';

test.describe('F-OSS-015 Frappe Builder donor runtime', () => {
  test('SOURCE_PRESENT -> WIRED -> RUNTIME action duplicates selected node', async ({ page }) => {
    await page.goto('/index-v19.html');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    const evidence = await page.evaluate(() => window.__YAIWES_DONOR_EVIDENCE__?.frappeBuilderContextMenu || null);
    expect(evidence).toBeTruthy();
    expect(evidence.name).toBe('Frappe Builder');

    await page.locator('[data-kind="window"]').click();
    const first = page.locator('[data-node]').first();
    await expect(first).toBeVisible();
    await first.click({ button: 'right' });

    const menu = page.locator('#yaiwes-frappe-context-menu');
    await expect(menu).toBeVisible();
    await expect(menu).toHaveAttribute('data-donor', 'Frappe Builder');

    await menu.locator('[data-existing-action="duplicate-selected"]').click();
    await expect(page.locator('[data-node]')).toHaveCount(2);

    const persisted = await page.evaluate(() => {
      const raw = localStorage.getItem('yaiwes-factory-project-v19');
      return raw ? JSON.parse(raw) : null;
    });
    expect(persisted?.state?.components?.length).toBe(2);
  });
});
