import { test, expect } from '@playwright/test';

const URL = '/index-v192.html';
const CANDIDATE = 'index-v192.html';
const SELECTOR = "[data-step='3']";
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

async function activateStep(page, selector) {
  const loc = page.locator(selector);
  await expect(loc).toBeVisible();
  await loc.evaluate((el) => {
    const nav = el.closest('.steps');
    if (nav) nav.scrollLeft = Math.max(0, el.offsetLeft - 8);
    el.click();
  });
}

test.describe('F-FE-096 STEP-3 control QA', () => {
  test('clicking [data-step=3] activates step 3 and persists across reload', async ({ page }) => {
    const { pageErrors, failedRequests } = await boot(page, { clearStorage: true });
    const step3 = page.locator(SELECTOR);
    await expect(step3).toBeEnabled();
    await expect(page.locator("[data-step='1']")).toHaveClass(/active/);
    expect(await page.evaluate(() => globalThis.__YAIWES_FACTORY_V19__.getState().step)).toBe(1);

    await activateStep(page, SELECTOR);
    await expect(step3).toHaveClass(/active/);
    await expect(page.locator("[data-step='1']")).not.toHaveClass(/active/);
    await expect(page.locator('#step-kicker')).toHaveText('PASO 3');
    await expect(page.locator('#step-title')).toHaveText('Transformar');
    await expect(page.locator('#context-count')).toHaveText('3/5');
    expect(await page.evaluate(() => globalThis.__YAIWES_FACTORY_V19__.getState().step)).toBe(3);

    await page.locator('#next-step').click();
    await expect(page.locator("[data-step='4']")).toHaveClass(/active/);
    await expect(step3).not.toHaveClass(/active/);
    await expect(page.locator('#step-kicker')).toHaveText('PASO 4');
    expect(await page.evaluate(() => globalThis.__YAIWES_FACTORY_V19__.getState().step)).toBe(4);

    await activateStep(page, SELECTOR);
    await expect(step3).toHaveClass(/active/);
    await expect(page.locator("[data-step='4']")).not.toHaveClass(/active/);
    await expect(page.locator('#step-kicker')).toHaveText('PASO 3');
    await expect(page.locator('#step-title')).toHaveText('Transformar');
    await expect(page.locator('#context-count')).toHaveText('3/5');
    expect(await page.evaluate(() => globalThis.__YAIWES_FACTORY_V19__.getState().step)).toBe(3);

    const persisted = await page.evaluate((key) => {
      const raw = JSON.parse(localStorage.getItem(key) || 'null');
      return raw?.state?.step ?? null;
    }, PROJECT_KEY);
    expect(persisted).toBe(3);

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('#canvas')).toBeVisible();
    await page.waitForFunction(() => Boolean(globalThis.__YAIWES_FACTORY_V19__), null, { timeout: 10_000 });
    await expect(page.locator(SELECTOR)).toHaveClass(/active/);
    await expect(page.locator("[data-step='4']")).not.toHaveClass(/active/);
    await expect(page.locator('#step-kicker')).toHaveText('PASO 3');
    const afterReload = await page.evaluate(() => globalThis.__YAIWES_FACTORY_V19__.getState().step);
    expect(afterReload).toBe(3);

    expect(pageErrors, `critical page errors ${JSON.stringify(pageErrors)}`).toEqual([]);
    expect(failedRequests, `failed document/script ${JSON.stringify(failedRequests)}`).toEqual([]);
    console.log(`F_FE_096_PASS=${JSON.stringify({ candidate: CANDIDATE, selector: SELECTOR, step: afterReload })}`);
  });
});
