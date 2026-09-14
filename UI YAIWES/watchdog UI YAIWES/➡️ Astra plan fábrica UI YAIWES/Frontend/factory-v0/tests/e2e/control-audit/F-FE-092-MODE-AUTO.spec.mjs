import { test, expect } from '@playwright/test';

const URL = '/index-v192.html';
const CANDIDATE = 'index-v192.html';
const SELECTOR = "[data-mode='AUTOPILOT']";
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

test.describe('F-FE-092 AUTOPILOT mode control QA', () => {
  test('clicking AUTOPILOT activates mode and persists across reload', async ({ page }) => {
    const { pageErrors, failedRequests } = await boot(page, { clearStorage: true });
    const manual = page.locator("[data-mode='MANUAL']");
    const assist = page.locator("[data-mode='AI_ASSIST']");
    const auto = page.locator(SELECTOR);

    await expect(manual).toHaveClass(/active/);
    await expect(auto).not.toHaveClass(/active/);
    expect(await page.evaluate(() => globalThis.__YAIWES_FACTORY_V19__.getState().mode)).toBe('MANUAL');

    await auto.click();
    await expect(auto).toHaveClass(/active/);
    await expect(manual).not.toHaveClass(/active/);
    await expect(assist).not.toHaveClass(/active/);
    await expect(page.locator('#status')).toContainText('AUTOPILOT');
    expect(await page.evaluate(() => globalThis.__YAIWES_FACTORY_V19__.getState().mode)).toBe('AUTOPILOT');

    const persisted = await page.evaluate((key) => {
      const raw = JSON.parse(localStorage.getItem(key) || 'null');
      return raw?.state?.mode || null;
    }, PROJECT_KEY);
    expect(persisted).toBe('AUTOPILOT');

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('#canvas')).toBeVisible();
    await page.waitForFunction(() => Boolean(globalThis.__YAIWES_FACTORY_V19__), null, { timeout: 10_000 });
    await expect(page.locator(SELECTOR)).toHaveClass(/active/);
    await expect(page.locator("[data-mode='MANUAL']")).not.toHaveClass(/active/);
    await expect(page.locator('#status')).toContainText('AUTOPILOT');
    const afterReload = await page.evaluate(() => globalThis.__YAIWES_FACTORY_V19__.getState().mode);
    expect(afterReload).toBe('AUTOPILOT');

    expect(pageErrors, `critical page errors ${JSON.stringify(pageErrors)}`).toEqual([]);
    expect(failedRequests, `failed document/script ${JSON.stringify(failedRequests)}`).toEqual([]);
    console.log(`F_FE_092_PASS=${JSON.stringify({ candidate: CANDIDATE, selector: SELECTOR, mode: afterReload })}`);
  });
});
