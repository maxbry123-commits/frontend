import { test, expect } from '@playwright/test';

const URL = '/index-v192.html';
const PROJECT_KEY = 'yaiwes-factory-project-v19';

test('F-AI-021 file -> parse -> canvas editable -> reload', async ({ page }) => {
  await page.goto(URL, { waitUntil:'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil:'domcontentloaded' });
  await page.locator('[data-step="3"]').click();

  await page.locator('#file-input').setInputFiles([
    { name:'imported.html', mimeType:'text/html', buffer:Buffer.from('<main><h1>Hello import</h1></main>') },
    { name:'data.json', mimeType:'application/json', buffer:Buffer.from('{"title":"Imported JSON","ok":true}') }
  ]);

  await expect.poll(() => page.locator('[data-node]').count(), { timeout:10000 }).toBe(2);
  const imported = await page.evaluate(() => window.__YAIWES_FILE_IMPORT_V1__ || null);
  expect(imported?.imported).toBe(2);
  expect(imported?.summaries?.map(x => x.parsedType)).toEqual(['html','json']);

  const stored = await page.evaluate(key => JSON.parse(localStorage.getItem(key) || 'null'), PROJECT_KEY);
  expect(stored?.state?.components?.length).toBe(2);
  expect(stored.state.components.map(x => x.label)).toEqual(['imported.html','data.json']);
  expect(stored.state.components[0].kind).toBe('page');

  await page.locator('[data-step="2"]').click();
  await expect(page.locator('#prop-label')).toBeVisible();
  await page.locator('#prop-label').fill('Archivo editable');
  await page.locator('#prop-label').blur();
  await expect(page.locator('[data-node].selected strong')).toHaveText('Archivo editable');

  await page.reload({ waitUntil:'domcontentloaded' });
  await expect(page.locator('[data-node]')).toHaveCount(2);
  await expect(page.locator('[data-node].selected strong')).toHaveText('Archivo editable');
});
