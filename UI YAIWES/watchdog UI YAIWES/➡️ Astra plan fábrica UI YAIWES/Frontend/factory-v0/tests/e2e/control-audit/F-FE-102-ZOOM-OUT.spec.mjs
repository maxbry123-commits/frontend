import { test, expect } from '@playwright/test';

const URL = '/index-v192.html';
const CANDIDATE = 'index-v192.html';
const SELECTOR = '#zoom-out';
const PROJECT_KEY = 'yaiwes-factory-project-v19';

async function boot(page, { clearStorage = true } = {}) {
  const pageErrors = [];
  const failedRequests = [];
  page.on('pageerror', (err) => pageErrors.push(String(err)));
  page.on('requestfailed', (req) => {
    if (req.resourceType() === 'document' || req.resourceType() === 'script') {
      failedRequests.push({ url: req.url(), error: req.failure()?.errorText || 'failed' });
    }
  });
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  if (clearStorage) {
    await page.evaluate((key) => { try { localStorage.removeItem(key); } catch {} }, PROJECT_KEY);
    await page.reload({ waitUntil: 'domcontentloaded' });
  }
  await expect(page.locator('#canvas')).toBeVisible();
  await page.waitForFunction(() => Boolean(globalThis.__YAIWES_FACTORY_V19__), null, { timeout: 10_000 });
  await expect(page.locator(SELECTOR)).toBeVisible();
  return { pageErrors, failedRequests };
}

test.describe('F-FE-102 ZOOM-OUT control QA', () => {
  test('ZOOM-OUT decrements zoom, updates CSS/label, persists and reloads', async ({ page }, testInfo) => {
    const { pageErrors, failedRequests } = await boot(page, { clearStorage: true });
    const zoomOut = page.locator(SELECTOR);
    const label = page.locator('#zoom-label');
    const canvas = page.locator('#canvas');

    expect(await page.evaluate(() => globalThis.__YAIWES_FACTORY_V19__.getView().zoom)).toBe(1);
    await expect(label).toHaveText('100%');
    expect(await canvas.evaluate((el) => el.style.getPropertyValue('--canvas-zoom'))).toBe('1');

    await zoomOut.scrollIntoViewIfNeeded();
    await zoomOut.click();

    expect(await page.evaluate(() => globalThis.__YAIWES_FACTORY_V19__.getView().zoom)).toBeCloseTo(0.9, 5);
    await expect(label).toHaveText('90%');
    expect(await canvas.evaluate((el) => el.style.getPropertyValue('--canvas-zoom'))).toBe('0.9');

    const persisted = await page.evaluate((key) => {
      const raw = JSON.parse(localStorage.getItem(key) || 'null');
      return raw?.zoom ?? null;
    }, PROJECT_KEY);
    expect(persisted).toBeCloseTo(0.9, 5);

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('#canvas')).toBeVisible();
    await page.waitForFunction(() => Boolean(globalThis.__YAIWES_FACTORY_V19__), null, { timeout: 10_000 });
    const afterReload = await page.evaluate(() => globalThis.__YAIWES_FACTORY_V19__.getView().zoom);
    expect(afterReload).toBeCloseTo(0.9, 5);
    await expect(page.locator('#zoom-label')).toHaveText('90%');
    expect(await page.locator('#canvas').evaluate((el) => el.style.getPropertyValue('--canvas-zoom'))).toBe('0.9');
    const persistedAfter = await page.evaluate((key) => {
      const raw = JSON.parse(localStorage.getItem(key) || 'null');
      return raw?.zoom ?? null;
    }, PROJECT_KEY);
    expect(persistedAfter).toBeCloseTo(0.9, 5);

    await page.locator(SELECTOR).click();
    expect(await page.evaluate(() => globalThis.__YAIWES_FACTORY_V19__.getView().zoom)).toBeCloseTo(0.8, 5);
    await expect(page.locator('#zoom-label')).toHaveText('80%');

    expect(pageErrors, `critical page errors ${JSON.stringify(pageErrors)}`).toEqual([]);
    expect(failedRequests, `failed document/script ${JSON.stringify(failedRequests)}`).toEqual([]);
    console.log(`F_FE_102_PASS=${JSON.stringify({ candidate: CANDIDATE, selector: SELECTOR, zoom: afterReload, project: testInfo.project.name })}`);
  });
});
