import { test, expect } from '@playwright/test';

const PROJECT_KEY = 'yaiwes-factory-project-v19';

test('F-AI-023 reference URL -> adapter -> editable canvas -> reload', async ({ page }) => {
  await page.goto('/index-v192.html', { waitUntil:'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil:'domcontentloaded' });
  await page.locator('[data-step="3"]').click();

  const referenceUrl = 'https://example.com/reference';
  await page.locator('#reference-url').fill(referenceUrl);
  await page.locator('#add-reference').click();
  await expect(page.locator('[data-node]')).toHaveCount(1);

  const imported = await page.evaluate(() => window.__YAIWES_REFERENCE_IMPORT_V1__ || null);
  expect(imported?.imported).toBe(1);
  expect(imported?.parsedType).toBe('reference');
  expect(imported?.referenceUrl).toBe(referenceUrl);

  const stored = await page.evaluate(key => JSON.parse(localStorage.getItem(key) || 'null'), PROJECT_KEY);
  expect(stored?.state?.components?.length).toBe(1);
  expect(stored.state.components[0].kind).toBe('page');

  await page.locator('[data-step="2"]').click();
  await expect(page.locator('#prop-label')).toBeVisible();
  await page.locator('#prop-label').fill('Referencia editable');
  await page.locator('#prop-label').blur();
  await expect(page.locator('[data-node].selected strong')).toHaveText('Referencia editable');

  await page.reload({ waitUntil:'domcontentloaded' });
  await expect(page.locator('[data-node]')).toHaveCount(1);
  await expect(page.locator('[data-node].selected strong')).toHaveText('Referencia editable');
});
