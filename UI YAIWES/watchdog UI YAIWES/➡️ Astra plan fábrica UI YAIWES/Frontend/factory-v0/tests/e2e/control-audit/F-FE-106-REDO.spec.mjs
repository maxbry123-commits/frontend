import { test, expect } from '@playwright/test';

const URL = '/index-v192.html';
const SELECTOR = '#redo';
const PROJECT_KEY = 'yaiwes-factory-project-v19';

async function boot(page) {
  const pageErrors = [];
  const failedRequests = [];
  page.on('pageerror', e => pageErrors.push(String(e)));
  page.on('requestfailed', r => {
    if (['document','script'].includes(r.resourceType())) failedRequests.push({url:r.url(),error:r.failure()?.errorText||'failed'});
  });
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await page.evaluate(k => { try { localStorage.removeItem(k); } catch {} }, PROJECT_KEY);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => Boolean(globalThis.__YAIWES_FACTORY_V19__), null, { timeout: 10000 });
  await expect(page.locator(SELECTOR)).toBeVisible();
  return { pageErrors, failedRequests };
}

async function revealNewComponent(page) {
  const control = page.locator('#new-component');
  if (await control.isVisible()) return;
  await page.locator('[data-workspace-toggle="left"]').click();
  await expect(control).toBeVisible();
}

test.describe('F-FE-106 REDO control QA', () => {
  test('REDO restores an undone component and persisted state without critical errors', async ({ page }) => {
    const { pageErrors, failedRequests } = await boot(page);
    await revealNewComponent(page);
    await page.locator('#new-component').click();
    await expect(page.locator('[data-node]')).toHaveCount(1);
    const close = page.locator('[data-workspace-close="left"]');
    if (await close.isVisible()) await close.click();
    await page.locator('#undo').click();
    await expect(page.locator('[data-node]')).toHaveCount(0);
    await page.locator(SELECTOR).click();
    await expect(page.locator('[data-node]')).toHaveCount(1);
    await expect(page.locator('#layer-count')).toHaveText('1');
    const beforeReload = await page.evaluate(k => {
      const s = globalThis.__YAIWES_FACTORY_V19__.getState();
      const raw = JSON.parse(localStorage.getItem(k) || 'null');
      return { count:s.components.length, future:s.future.length, storedCount:raw?.state?.components?.length ?? null };
    }, PROJECT_KEY);
    expect(beforeReload.count).toBe(1);
    expect(beforeReload.future).toBe(0);
    expect(beforeReload.storedCount).toBe(1);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => Boolean(globalThis.__YAIWES_FACTORY_V19__), null, { timeout: 10000 });
    await expect(page.locator('[data-node]')).toHaveCount(1);
    expect(pageErrors).toEqual([]);
    expect(failedRequests).toEqual([]);
  });
});
