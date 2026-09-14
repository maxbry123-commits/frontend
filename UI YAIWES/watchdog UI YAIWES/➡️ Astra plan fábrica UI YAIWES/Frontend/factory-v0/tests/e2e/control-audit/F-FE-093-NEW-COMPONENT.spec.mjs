import { test, expect } from '@playwright/test';

const URL = '/index-v192.html';
const CANDIDATE = 'index-v192.html';
const SELECTOR = '#new-component';
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
  await revealNewComponent(page);
  return { pageErrors, failedRequests };
}

async function revealNewComponent(page) {
  const control = page.locator(SELECTOR);
  if (await control.isVisible()) return;
  const toggle = page.locator('[data-workspace-toggle="left"]');
  await expect(toggle, 'mobile shell must expose Biblioteca toggle to reach #new-component').toBeVisible();
  await toggle.click();
  await expect(control).toBeVisible();
}

test.describe('F-FE-093 NEW-COMPONENT control QA', () => {
  test('clicking #new-component adds a window block and persists across reload', async ({ page }) => {
    const { pageErrors, failedRequests } = await boot(page, { clearStorage: true });
    const create = page.locator(SELECTOR);
    await expect(create).toBeEnabled();
    await expect(page.locator('#canvas-empty')).toBeVisible();
    expect(await page.locator('[data-node]').count()).toBe(0);
    expect(await page.evaluate(() => globalThis.__YAIWES_FACTORY_V19__.getState().components.length)).toBe(0);

    await create.click();
    await expect(page.locator('[data-node]')).toHaveCount(1);
    await expect(page.locator('[data-node] strong')).toHaveText('Nueva ventana');
    await expect(page.locator('[data-node] small')).toContainText('window');
    await expect(page.locator('#canvas-empty')).toBeHidden();

    const created = await page.evaluate(() => {
      const state = globalThis.__YAIWES_FACTORY_V19__.getState();
      return { count: state.components.length, item: state.components[0], selectedId: state.selectedId };
    });
    expect(created.count).toBe(1);
    expect(created.item).toMatchObject({ kind: 'window', label: 'Nueva ventana' });
    expect(created.selectedId).toBe(created.item.id);

    const persisted = await page.evaluate((key) => {
      const raw = JSON.parse(localStorage.getItem(key) || 'null');
      return {
        count: raw?.state?.components?.length || 0,
        item: raw?.state?.components?.[0] || null,
      };
    }, PROJECT_KEY);
    expect(persisted.count).toBe(1);
    expect(persisted.item).toMatchObject({ kind: 'window', label: 'Nueva ventana' });

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('#canvas')).toBeVisible();
    await page.waitForFunction(() => Boolean(globalThis.__YAIWES_FACTORY_V19__), null, { timeout: 10_000 });
    await revealNewComponent(page);
    await expect(page.locator('[data-node]')).toHaveCount(1);
    await expect(page.locator('[data-node] strong')).toHaveText('Nueva ventana');
    const afterReload = await page.evaluate(() => {
      const state = globalThis.__YAIWES_FACTORY_V19__.getState();
      return { count: state.components.length, label: state.components[0]?.label, kind: state.components[0]?.kind };
    });
    expect(afterReload).toEqual({ count: 1, label: 'Nueva ventana', kind: 'window' });

    expect(pageErrors, `critical page errors ${JSON.stringify(pageErrors)}`).toEqual([]);
    expect(failedRequests, `failed document/script ${JSON.stringify(failedRequests)}`).toEqual([]);
    console.log(`F_FE_093_PASS=${JSON.stringify({ candidate: CANDIDATE, selector: SELECTOR, count: afterReload.count })}`);
  });
});
