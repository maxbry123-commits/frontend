import { test, expect } from '@playwright/test';

const URL = '/index-v192.html';
const CANDIDATE = 'index-v192.html';
const SELECTOR = ".canvas-controls button[data-breakpoint='tablet']";
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

test.describe('F-FE-100 TABLET breakpoint control QA', () => {
  test('TABLET control sets canvas breakpoint, persists and reloads', async ({ page }, testInfo) => {
    const { pageErrors, failedRequests } = await boot(page, { clearStorage: true });
    const tablet = page.locator(SELECTOR);
    const desktop = page.locator(".canvas-controls button[data-breakpoint='desktop']");
    const mobile = page.locator(".canvas-controls button[data-breakpoint='mobile']");
    const canvas = page.locator('#canvas');

    await expect(desktop).toHaveClass(/active/);
    await expect(tablet).not.toHaveClass(/active/);
    await expect(mobile).not.toHaveClass(/active/);
    await expect(canvas).toHaveAttribute('data-breakpoint', 'desktop');
    expect(await page.evaluate(() => globalThis.__YAIWES_FACTORY_V19__.getView().breakpoint)).toBe('desktop');

    await tablet.scrollIntoViewIfNeeded();
    await tablet.click();

    await expect(tablet).toHaveClass(/active/);
    await expect(desktop).not.toHaveClass(/active/);
    await expect(mobile).not.toHaveClass(/active/);
    await expect(canvas).toHaveAttribute('data-breakpoint', 'tablet');
    expect(await page.evaluate(() => globalThis.__YAIWES_FACTORY_V19__.getView().breakpoint)).toBe('tablet');

    const metrics = await canvas.evaluate((el) => {
      const cs = getComputedStyle(el);
      const box = el.getBoundingClientRect();
      return { usedWidth: box.width, cssWidth: cs.width, maxWidth: cs.maxWidth, minWidth: cs.minWidth };
    });
    expect(metrics.maxWidth).toBe('100%');
    expect(metrics.minWidth).toBe('0px');
    expect(metrics.usedWidth).toBeGreaterThan(200);
    expect(metrics.usedWidth).toBeLessThanOrEqual(768);
    const width = metrics.usedWidth;

    const persisted = await page.evaluate((key) => {
      const raw = JSON.parse(localStorage.getItem(key) || 'null');
      return raw?.breakpoint || null;
    }, PROJECT_KEY);
    expect(persisted).toBe('tablet');

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('#canvas')).toBeVisible();
    await page.waitForFunction(() => Boolean(globalThis.__YAIWES_FACTORY_V19__), null, { timeout: 10_000 });
    await expect(page.locator(SELECTOR)).toHaveClass(/active/);
    await expect(page.locator(".canvas-controls button[data-breakpoint='desktop']")).not.toHaveClass(/active/);
    await expect(page.locator('#canvas')).toHaveAttribute('data-breakpoint', 'tablet');
    const afterReload = await page.evaluate(() => globalThis.__YAIWES_FACTORY_V19__.getView().breakpoint);
    expect(afterReload).toBe('tablet');
    const persistedAfter = await page.evaluate((key) => {
      const raw = JSON.parse(localStorage.getItem(key) || 'null');
      return raw?.breakpoint || null;
    }, PROJECT_KEY);
    expect(persistedAfter).toBe('tablet');

    expect(pageErrors, `critical page errors ${JSON.stringify(pageErrors)}`).toEqual([]);
    expect(failedRequests, `failed document/script ${JSON.stringify(failedRequests)}`).toEqual([]);
    console.log(`F_FE_100_PASS=${JSON.stringify({ candidate: CANDIDATE, selector: SELECTOR, breakpoint: afterReload, canvasWidth: width, project: testInfo.project.name })}`);
  });
});
