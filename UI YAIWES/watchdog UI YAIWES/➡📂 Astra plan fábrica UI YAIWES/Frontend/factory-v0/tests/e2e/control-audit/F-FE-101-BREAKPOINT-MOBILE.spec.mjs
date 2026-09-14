import { test, expect } from '@playwright/test';

const URL = '/index-v192.html';
const CANDIDATE = 'index-v192.html';
const SELECTOR = ".canvas-controls button[data-breakpoint='mobile']";
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

test.describe('F-FE-101 MOBILE breakpoint control QA', () => {
  test('MOBILE control sets canvas breakpoint, persists and reloads', async ({ page }, testInfo) => {
    const { pageErrors, failedRequests } = await boot(page, { clearStorage: true });
    const mobile = page.locator(SELECTOR);
    const desktop = page.locator(".canvas-controls button[data-breakpoint='desktop']");
    const tablet = page.locator(".canvas-controls button[data-breakpoint='tablet']");
    const canvas = page.locator('#canvas');

    await expect(desktop).toHaveClass(/active/);
    await expect(tablet).not.toHaveClass(/active/);
    await expect(mobile).not.toHaveClass(/active/);
    await expect(canvas).toHaveAttribute('data-breakpoint', 'desktop');
    expect(await page.evaluate(() => globalThis.__YAIWES_FACTORY_V19__.getView().breakpoint)).toBe('desktop');

    await mobile.scrollIntoViewIfNeeded();
    await mobile.click();

    await expect(mobile).toHaveClass(/active/);
    await expect(desktop).not.toHaveClass(/active/);
    await expect(tablet).not.toHaveClass(/active/);
    await expect(canvas).toHaveAttribute('data-breakpoint', 'mobile');
    expect(await page.evaluate(() => globalThis.__YAIWES_FACTORY_V19__.getView().breakpoint)).toBe('mobile');

    const metrics = await canvas.evaluate((el) => {
      const cs = getComputedStyle(el);
      const box = el.getBoundingClientRect();
      return { usedWidth: box.width, cssWidth: cs.width, maxWidth: cs.maxWidth, minWidth: cs.minWidth };
    });
    expect(metrics.maxWidth).toBe('100%');
    expect(metrics.minWidth).toBe('0px');
    expect(metrics.cssWidth).toBe('390px');
    expect(metrics.usedWidth).toBeGreaterThan(200);
    expect(metrics.usedWidth).toBeLessThanOrEqual(390);
    const width = metrics.usedWidth;

    const persisted = await page.evaluate((key) => {
      const raw = JSON.parse(localStorage.getItem(key) || 'null');
      return raw?.breakpoint || null;
    }, PROJECT_KEY);
    expect(persisted).toBe('mobile');

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('#canvas')).toBeVisible();
    await page.waitForFunction(() => Boolean(globalThis.__YAIWES_FACTORY_V19__), null, { timeout: 10_000 });
    await expect(page.locator(SELECTOR)).toHaveClass(/active/);
    await expect(page.locator(".canvas-controls button[data-breakpoint='desktop']")).not.toHaveClass(/active/);
    await expect(page.locator(".canvas-controls button[data-breakpoint='tablet']")).not.toHaveClass(/active/);
    await expect(page.locator('#canvas')).toHaveAttribute('data-breakpoint', 'mobile');
    const afterReload = await page.evaluate(() => globalThis.__YAIWES_FACTORY_V19__.getView().breakpoint);
    expect(afterReload).toBe('mobile');
    const persistedAfter = await page.evaluate((key) => {
      const raw = JSON.parse(localStorage.getItem(key) || 'null');
      return raw?.breakpoint || null;
    }, PROJECT_KEY);
    expect(persistedAfter).toBe('mobile');

    expect(pageErrors, `critical page errors ${JSON.stringify(pageErrors)}`).toEqual([]);
    expect(failedRequests, `failed document/script ${JSON.stringify(failedRequests)}`).toEqual([]);
    console.log(`F_FE_101_PASS=${JSON.stringify({ candidate: CANDIDATE, selector: SELECTOR, breakpoint: afterReload, canvasWidth: width, project: testInfo.project.name })}`);
  });
});
