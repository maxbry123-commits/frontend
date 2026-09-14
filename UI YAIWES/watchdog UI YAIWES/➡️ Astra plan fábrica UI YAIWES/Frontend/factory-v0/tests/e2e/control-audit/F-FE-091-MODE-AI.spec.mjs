import { test, expect } from '@playwright/test';

const URL = '/index-v192.html';
const CANDIDATE = 'index-v192.html';
const SELECTOR = "[data-mode='AI_ASSIST']";
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

test.describe('F-FE-091 AI_ASSIST mode control QA', () => {
  test('clicking AI_ASSIST activates mode and persists across reload', async ({ page }) => {
    const { pageErrors, failedRequests } = await boot(page, { clearStorage: true });
    const manual = page.locator("[data-mode='MANUAL']");
    const assist = page.locator(SELECTOR);
    const auto = page.locator("[data-mode='AUTOPILOT']");

    await expect(manual).toHaveClass(/active/);
    await expect(assist).not.toHaveClass(/active/);
    expect(await page.evaluate(() => globalThis.__YAIWES_FACTORY_V19__.getState().mode)).toBe('MANUAL');

    await assist.click();
    await expect(assist).toHaveClass(/active/);
    await expect(manual).not.toHaveClass(/active/);
    await expect(auto).not.toHaveClass(/active/);
    await expect(page.locator('#status')).toContainText('AI_ASSIST');
    expect(await page.evaluate(() => globalThis.__YAIWES_FACTORY_V19__.getState().mode)).toBe('AI_ASSIST');

    const persisted = await page.evaluate((key) => {
      const raw = JSON.parse(localStorage.getItem(key) || 'null');
      return raw?.state?.mode || null;
    }, PROJECT_KEY);
    expect(persisted).toBe('AI_ASSIST');

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('#canvas')).toBeVisible();
    await page.waitForFunction(() => Boolean(globalThis.__YAIWES_FACTORY_V19__), null, { timeout: 10_000 });
    await expect(page.locator(SELECTOR)).toHaveClass(/active/);
    await expect(page.locator("[data-mode='MANUAL']")).not.toHaveClass(/active/);
    await expect(page.locator('#status')).toContainText('AI_ASSIST');
    const afterReload = await page.evaluate(() => globalThis.__YAIWES_FACTORY_V19__.getState().mode);
    expect(afterReload).toBe('AI_ASSIST');

    expect(pageErrors, `critical page errors ${JSON.stringify(pageErrors)}`).toEqual([]);
    expect(failedRequests, `failed document/script ${JSON.stringify(failedRequests)}`).toEqual([]);
    console.log(`F_FE_091_PASS=${JSON.stringify({ candidate: CANDIDATE, selector: SELECTOR, mode: afterReload })}`);
  });
});
