import { test, expect } from '@playwright/test';

const URL = '/index-v192.html';
const SELECTOR = "[data-kind='window']";
const PROJECT_KEY = 'yaiwes-factory-project-v19';
const BROWSER_KEY = 'yaiwes-factory-component-browser-v1';

async function boot(page) {
  const pageErrors = [];
  const failedRequests = [];
  page.on('pageerror', err => pageErrors.push(String(err)));
  page.on('requestfailed', req => {
    if (req.resourceType() === 'document' || req.resourceType() === 'script') {
      failedRequests.push({ url: req.url(), error: req.failure()?.errorText || 'failed' });
    }
  });
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await page.evaluate(([projectKey, browserKey]) => {
    try { localStorage.removeItem(projectKey); localStorage.removeItem(browserKey); } catch {}
  }, [PROJECT_KEY, BROWSER_KEY]);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => Boolean(globalThis.__YAIWES_FACTORY_V19__), null, { timeout: 10_000 });
  await expect(page.locator('#canvas')).toBeVisible();
  await expect(page.locator(SELECTOR)).toBeVisible();
  return { pageErrors, failedRequests };
}

test.describe('F-FE-110 ELEMENT-WINDOW control QA', () => {
  test('window card has a real browser-selection effect without bypassing canonical preview flow', async ({ page }, testInfo) => {
    const { pageErrors, failedRequests } = await boot(page);
    const card = page.locator(SELECTOR);
    const preview = page.locator('[data-component-preview]');

    await expect(page.locator('[data-node]')).toHaveCount(0);
    await card.click();

    await expect(card).toHaveClass(/browser-selected/);
    await expect(preview).toBeVisible();
    await expect(page.locator('[data-preview-title]')).toHaveText('Ventana');
    await expect(page.locator('[data-preview-meta]')).toContainText('window');
    await expect(page.locator('[data-preview-insert]')).toHaveAttribute('data-selected-kind', 'window');
    await expect(page.locator('[data-node]')).toHaveCount(0);

    const persistedProject = await page.evaluate(key => localStorage.getItem(key), PROJECT_KEY);
    expect(persistedProject).toBeNull();

    expect(pageErrors, `critical page errors ${JSON.stringify(pageErrors)}`).toEqual([]);
    expect(failedRequests, `failed document/script ${JSON.stringify(failedRequests)}`).toEqual([]);
    console.log(`F_FE_110_PASS=${JSON.stringify({ selector: SELECTOR, effect: 'preview-selection', project: testInfo.project.name })}`);
  });
});
