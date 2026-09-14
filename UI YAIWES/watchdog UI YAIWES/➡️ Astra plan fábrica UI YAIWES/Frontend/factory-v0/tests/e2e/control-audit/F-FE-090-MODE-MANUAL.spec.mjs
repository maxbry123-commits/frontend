import { test, expect } from '@playwright/test';

const URL = '/index-v192.html';
const CANDIDATE = 'index-v192.html';
const SELECTOR = "[data-mode='MANUAL']";
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

test.describe('F-FE-090 MANUAL mode control QA', () => {
  test('default MANUAL is active and SET_MODE round-trips with persistence', async ({ page }) => {
    const { pageErrors, failedRequests } = await boot(page, { clearStorage: true });
    const manual = page.locator(SELECTOR);
    const assist = page.locator("[data-mode='AI_ASSIST']");
    const auto = page.locator("[data-mode='AUTOPILOT']");

    await expect(manual).toHaveClass(/active/);
    await expect(assist).not.toHaveClass(/active/);
    await expect(auto).not.toHaveClass(/active/);
    await expect(page.locator('#status')).toContainText('MANUAL');
    expect(await page.evaluate(() => globalThis.__YAIWES_FACTORY_V19__.getState().mode)).toBe('MANUAL');

    await assist.click();
    await expect(assist).toHaveClass(/active/);
    await expect(manual).not.toHaveClass(/active/);
    await expect(page.locator('#status')).toContainText('AI_ASSIST');

    await manual.click();
    await expect(manual).toHaveClass(/active/);
    await expect(assist).not.toHaveClass(/active/);
    await expect(auto).not.toHaveClass(/active/);
    await expect(page.locator('#status')).toContainText('MANUAL');
    expect(await page.evaluate(() => globalThis.__YAIWES_FACTORY_V19__.getState().mode)).toBe('MANUAL');

    const persisted = await page.evaluate((key) => {
      const raw = JSON.parse(localStorage.getItem(key) || 'null');
      return raw?.state?.mode || null;
    }, PROJECT_KEY);
    expect(persisted).toBe('MANUAL');

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('#canvas')).toBeVisible();
    await page.waitForFunction(() => Boolean(globalThis.__YAIWES_FACTORY_V19__), null, { timeout: 10_000 });
    await expect(page.locator(SELECTOR)).toHaveClass(/active/);
    await expect(page.locator("[data-mode='AI_ASSIST']")).not.toHaveClass(/active/);
    await expect(page.locator('#status')).toContainText('MANUAL');
    const afterReload = await page.evaluate(() => globalThis.__YAIWES_FACTORY_V19__.getState().mode);
    expect(afterReload).toBe('MANUAL');

    expect(pageErrors, `critical page errors ${JSON.stringify(pageErrors)}`).toEqual([]);
    expect(failedRequests, `failed document/script ${JSON.stringify(failedRequests)}`).toEqual([]);
    console.log(`F_FE_090_PASS=${JSON.stringify({ candidate: CANDIDATE, selector: SELECTOR, mode: afterReload })}`);
  });
});
