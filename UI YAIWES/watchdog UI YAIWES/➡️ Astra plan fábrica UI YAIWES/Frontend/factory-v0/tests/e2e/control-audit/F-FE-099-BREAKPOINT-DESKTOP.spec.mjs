import { test, expect } from '@playwright/test';

const URL = '/index-v192.html';
const CANDIDATE = 'index-v192.html';
const SELECTOR = "[data-breakpoint='desktop']";
const BUTTON = ".canvas-controls button[data-breakpoint='desktop']";
const TABLET = ".canvas-controls button[data-breakpoint='tablet']";
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
  await expect(page.locator(SELECTOR).first()).toBeVisible();
  await expect(page.locator(BUTTON)).toBeVisible();
  return { pageErrors, failedRequests };
}

async function activate(page, selector) {
  const loc = page.locator(selector);
  await expect(loc).toBeVisible();
  await loc.scrollIntoViewIfNeeded();
  await loc.evaluate((el) => el.click());
}

test.describe('F-FE-099 DESKTOP breakpoint control QA', () => {
  test('DESKTOP control restores canvas breakpoint, persists and reloads', async ({ page }) => {
    const { pageErrors, failedRequests } = await boot(page, { clearStorage: true });
    const desktop = page.locator(BUTTON);
    const tablet = page.locator(TABLET);
    const canvas = page.locator('#canvas');

    await expect(desktop).toHaveClass(/active/);
    await expect(tablet).not.toHaveClass(/active/);
    await expect(canvas).toHaveAttribute('data-breakpoint', 'desktop');
    expect(await page.evaluate(() => globalThis.__YAIWES_FACTORY_V19__.getView().breakpoint)).toBe('desktop');

    await activate(page, TABLET);
    await expect(tablet).toHaveClass(/active/);
    await expect(desktop).not.toHaveClass(/active/);
    await expect(canvas).toHaveAttribute('data-breakpoint', 'tablet');
    expect(await page.evaluate(() => globalThis.__YAIWES_FACTORY_V19__.getView().breakpoint)).toBe('tablet');

    await activate(page, BUTTON);
    await expect(desktop).toHaveClass(/active/);
    await expect(tablet).not.toHaveClass(/active/);
    await expect(canvas).toHaveAttribute('data-breakpoint', 'desktop');
    expect(await page.evaluate(() => globalThis.__YAIWES_FACTORY_V19__.getView().breakpoint)).toBe('desktop');

    const persisted = await page.evaluate((key) => {
      const raw = JSON.parse(localStorage.getItem(key) || 'null');
      return raw?.breakpoint || null;
    }, PROJECT_KEY);
    expect(persisted).toBe('desktop');

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('#canvas')).toBeVisible();
    await page.waitForFunction(() => Boolean(globalThis.__YAIWES_FACTORY_V19__), null, { timeout: 10_000 });
    await expect(page.locator(BUTTON)).toHaveClass(/active/);
    await expect(page.locator(TABLET)).not.toHaveClass(/active/);
    await expect(page.locator('#canvas')).toHaveAttribute('data-breakpoint', 'desktop');
    const afterReload = await page.evaluate(() => globalThis.__YAIWES_FACTORY_V19__.getView().breakpoint);
    expect(afterReload).toBe('desktop');

    expect(pageErrors, `critical page errors ${JSON.stringify(pageErrors)}`).toEqual([]);
    expect(failedRequests, `failed document/script ${JSON.stringify(failedRequests)}`).toEqual([]);
    console.log(`F_FE_099_PASS=${JSON.stringify({ candidate: CANDIDATE, selector: SELECTOR, breakpoint: afterReload })}`);
  });
});
