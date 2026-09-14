import { test, expect } from '@playwright/test';

const URL = '/index-v192.html';
const CANDIDATE = 'index-v192.html';
const SELECTOR = "[data-step='1']";
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

test.describe('F-FE-094 STEP-1 control QA', () => {
  test('clicking [data-step=1] restores step 1 and persists across reload', async ({ page }) => {
    const { pageErrors, failedRequests } = await boot(page, { clearStorage: true });
    const step1 = page.locator(SELECTOR);
    await expect(step1).toBeEnabled();
    await expect(step1).toHaveClass(/active/);
    await expect(page.locator('#step-kicker')).toHaveText('PASO 1');
    await expect(page.locator('#step-title')).toHaveText('Crear');
    expect(await page.evaluate(() => globalThis.__YAIWES_FACTORY_V19__.getState().step)).toBe(1);

    await page.locator('#next-step').click();
    await expect(page.locator("[data-step='2']")).toHaveClass(/active/);
    await expect(step1).not.toHaveClass(/active/);
    await expect(page.locator('#step-kicker')).toHaveText('PASO 2');
    expect(await page.evaluate(() => globalThis.__YAIWES_FACTORY_V19__.getState().step)).toBe(2);

    await activateStep(page, SELECTOR);
    await expect(step1).toHaveClass(/active/);
    await expect(page.locator("[data-step='2']")).not.toHaveClass(/active/);
    await expect(page.locator('#step-kicker')).toHaveText('PASO 1');
    await expect(page.locator('#step-title')).toHaveText('Crear');
    await expect(page.locator('#context-count')).toHaveText('1/5');
    expect(await page.evaluate(() => globalThis.__YAIWES_FACTORY_V19__.getState().step)).toBe(1);

    const persisted = await page.evaluate((key) => {
      const raw = JSON.parse(localStorage.getItem(key) || 'null');
      return raw?.state?.step ?? null;
    }, PROJECT_KEY);
    expect(persisted).toBe(1);

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('#canvas')).toBeVisible();
    await page.waitForFunction(() => Boolean(globalThis.__YAIWES_FACTORY_V19__), null, { timeout: 10_000 });
    await expect(page.locator(SELECTOR)).toHaveClass(/active/);
    await expect(page.locator("[data-step='2']")).not.toHaveClass(/active/);
    await expect(page.locator('#step-kicker')).toHaveText('PASO 1');
    const afterReload = await page.evaluate(() => globalThis.__YAIWES_FACTORY_V19__.getState().step);
    expect(afterReload).toBe(1);

    expect(pageErrors, `critical page errors ${JSON.stringify(pageErrors)}`).toEqual([]);
    expect(failedRequests, `failed document/script ${JSON.stringify(failedRequests)}`).toEqual([]);
    console.log(`F_FE_094_PASS=${JSON.stringify({ candidate: CANDIDATE, selector: SELECTOR, step: afterReload })}`);
  });
});
