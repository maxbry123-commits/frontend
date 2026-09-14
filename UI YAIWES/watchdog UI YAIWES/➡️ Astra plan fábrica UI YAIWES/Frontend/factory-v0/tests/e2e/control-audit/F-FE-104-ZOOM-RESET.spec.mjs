import { test, expect } from '@playwright/test';

const URL = '/index-v192.html';
const CANDIDATE = 'index-v192.html';
const SELECTOR = '#zoom-reset';
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

async function viewZoom(page) {
  return page.evaluate(() => globalThis.__YAIWES_FACTORY_V19__.getView().zoom);
}

async function cssZoom(page) {
  return page.locator('#canvas').evaluate((el) => el.style.getPropertyValue('--canvas-zoom'));
}

async function storedZoom(page) {
  return page.evaluate((key) => {
    const raw = JSON.parse(localStorage.getItem(key) || 'null');
    return raw?.zoom ?? null;
  }, PROJECT_KEY);
}

test.describe('F-FE-104 ZOOM-RESET control QA', () => {
  test('ZOOM-RESET restores 1.0 from zoom-in and zoom-out, persists and reloads', async ({ page }, testInfo) => {
    const { pageErrors, failedRequests } = await boot(page, { clearStorage: true });
    const reset = page.locator(SELECTOR);
    const zoomIn = page.locator('#zoom-in');
    const zoomOut = page.locator('#zoom-out');
    const label = page.locator('#zoom-label');

    expect(await viewZoom(page)).toBe(1);
    await expect(label).toHaveText('100%');
    expect(await cssZoom(page)).toBe('1');

    await zoomIn.scrollIntoViewIfNeeded();
    await zoomIn.click();
    await zoomIn.click();
    expect(await viewZoom(page)).toBeCloseTo(1.2, 5);
    await expect(label).toHaveText('120%');
    expect(await cssZoom(page)).toBe('1.2');

    await reset.click();
    expect(await viewZoom(page)).toBe(1);
    await expect(label).toHaveText('100%');
    expect(await cssZoom(page)).toBe('1');
    expect(await storedZoom(page)).toBe(1);

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('#canvas')).toBeVisible();
    await page.waitForFunction(() => Boolean(globalThis.__YAIWES_FACTORY_V19__), null, { timeout: 10_000 });
    expect(await viewZoom(page)).toBe(1);
    await expect(page.locator('#zoom-label')).toHaveText('100%');
    expect(await cssZoom(page)).toBe('1');
    expect(await storedZoom(page)).toBe(1);

    await zoomOut.click();
    expect(await viewZoom(page)).toBeCloseTo(0.9, 5);
    await expect(page.locator('#zoom-label')).toHaveText('90%');
    expect(await cssZoom(page)).toBe('0.9');

    await page.locator(SELECTOR).click();
    expect(await viewZoom(page)).toBe(1);
    await expect(page.locator('#zoom-label')).toHaveText('100%');
    expect(await cssZoom(page)).toBe('1');
    expect(await storedZoom(page)).toBe(1);

    expect(pageErrors, `critical page errors ${JSON.stringify(pageErrors)}`).toEqual([]);
    expect(failedRequests, `failed document/script ${JSON.stringify(failedRequests)}`).toEqual([]);
    console.log(`F_FE_104_PASS=${JSON.stringify({ candidate: CANDIDATE, selector: SELECTOR, zoom: 1, project: testInfo.project.name })}`);
  });
});
