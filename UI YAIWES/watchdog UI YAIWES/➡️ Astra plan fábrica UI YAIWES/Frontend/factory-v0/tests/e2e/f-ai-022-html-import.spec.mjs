import { test, expect } from '@playwright/test';

const PROJECT_KEY = 'yaiwes-factory-project-v19';

test('F-AI-022 inline HTML -> canvas editable -> reload', async ({ page }) => {
  await page.goto('/index-v192.html', { waitUntil:'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil:'domcontentloaded' });
  await page.locator('[data-step="3"]').click();

  await page.locator('#html-input').fill('<section><button>CTA</button></section>');
  await page.locator('#load-html-source').click();
  await expect(page.locator('[data-node]')).toHaveCount(1);

  const imported = await page.evaluate(() => window.__YAIWES_HTML_IMPORT_V1__ || null);
  expect(imported?.imported).toBe(1);
  expect(imported?.parsedType).toBe('html');

  const stored = await page.evaluate(key => JSON.parse(localStorage.getItem(key) || 'null'), PROJECT_KEY);
  expect(stored?.state?.components?.length).toBe(1);
  expect(stored.state.components[0].kind).toBe('page');

  await page.locator('[data-step="2"]').click();
  await page.locator('#prop-label').fill('HTML editable');
  await page.locator('#prop-label').blur();
  await expect(page.locator('[data-node].selected strong')).toHaveText('HTML editable');

  await page.reload({ waitUntil:'domcontentloaded' });
  await expect(page.locator('[data-node]')).toHaveCount(1);
  await expect(page.locator('[data-node].selected strong')).toHaveText('HTML editable');
});
