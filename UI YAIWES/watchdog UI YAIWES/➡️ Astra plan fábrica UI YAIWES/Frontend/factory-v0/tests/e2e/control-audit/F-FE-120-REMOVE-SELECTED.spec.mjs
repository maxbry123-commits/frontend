import { test, expect } from '@playwright/test';

const URL = '/index-v192.html';
const CANDIDATE = 'index-v192.html';
const SELECTOR = '#remove-selected';
const CARD = "[data-kind='button']";
const PROJECT_KEY = 'yaiwes-factory-project-v19';
const BROWSER_KEY = 'yaiwes-factory-component-browser-v1';

async function boot(page) {
  const pageErrors = [];
  const failedRequests = [];
  page.on('pageerror', (err) => pageErrors.push(String(err)));
  page.on('requestfailed', (req) => {
    if (req.resourceType() === 'document' || req.resourceType() === 'script') {
      failedRequests.push({ url: req.url(), error: req.failure()?.errorText || 'failed' });
    }
  });
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await page.evaluate(([projectKey, browserKey]) => {
    try { localStorage.removeItem(projectKey); localStorage.removeItem(browserKey); } catch {}
  }, [PROJECT_KEY, BROWSER_KEY]);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#canvas')).toBeVisible();
  await page.waitForFunction(() => Boolean(globalThis.__YAIWES_FACTORY_V19__), null, { timeout: 10_000 });
  await page.waitForFunction(() => document.documentElement.dataset.componentBrowser === 'v1', null, { timeout: 10_000 });
  return { pageErrors, failedRequests };
}

async function reveal(page, side) {
  const toggle = page.locator(`[data-workspace-toggle="${side}"]`);
  if (await toggle.count()) {
    const expanded = await toggle.getAttribute('aria-expanded');
    if (expanded === 'false') await toggle.click();
  }
}

async function insertButton(page) {
  await reveal(page, 'left');
  const card = page.locator(CARD);
  await card.scrollIntoViewIfNeeded();
  await expect(card).toBeVisible();
  await card.click();
  const insert = page.locator('[data-preview-insert]');
  await expect(insert).toBeVisible();
  await insert.click();
  await expect(page.locator('[data-node]')).toHaveCount(1);
}

async function revealRemove(page) {
  const btn = page.locator(SELECTOR);
  if (!(await btn.isVisible())) {
    await reveal(page, 'right');
    await btn.scrollIntoViewIfNeeded();
  }
  await expect(btn).toBeVisible();
  return btn;
}

test.describe('F-FE-120 REMOVE-SELECTED control QA', () => {
  test('Eliminar elemento removes selected node and persists empty canvas', async ({ page }, testInfo) => {
    const { pageErrors, failedRequests } = await boot(page);

    await expect(page.locator('#canvas-empty')).toBeVisible();
    expect(await page.locator(SELECTOR).count()).toBe(0);
    expect(await page.evaluate(() => globalThis.__YAIWES_FACTORY_V19__.getState().components.length)).toBe(0);

    await insertButton(page);
    const afterInsert = await page.evaluate((key) => {
      const state = globalThis.__YAIWES_FACTORY_V19__.getState();
      const raw = JSON.parse(localStorage.getItem(key) || 'null');
      return {
        count: state.components.length,
        selectedId: state.selectedId,
        storedCount: raw?.state?.components?.length ?? 0,
      };
    }, PROJECT_KEY);
    expect(afterInsert.count).toBe(1);
    expect(afterInsert.selectedId).toBeTruthy();
    expect(afterInsert.storedCount).toBe(1);

    const remove = await revealRemove(page);
    await expect(remove).toHaveText('Eliminar elemento');
    await remove.click();

    await expect(page.locator('[data-node]')).toHaveCount(0);
    await expect(page.locator('#canvas-empty')).toBeVisible();
    expect(await page.locator(SELECTOR).count()).toBe(0);

    const afterRemove = await page.evaluate((key) => {
      const state = globalThis.__YAIWES_FACTORY_V19__.getState();
      const raw = JSON.parse(localStorage.getItem(key) || 'null');
      return {
        count: state.components.length,
        selectedId: state.selectedId,
        storedCount: raw?.state?.components?.length ?? 0,
        storedSelected: raw?.state?.selectedId ?? null,
      };
    }, PROJECT_KEY);
    expect(afterRemove).toEqual({ count: 0, selectedId: null, storedCount: 0, storedSelected: null });

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('#canvas')).toBeVisible();
    await page.waitForFunction(() => Boolean(globalThis.__YAIWES_FACTORY_V19__), null, { timeout: 10_000 });
    await expect(page.locator('[data-node]')).toHaveCount(0);
    await expect(page.locator('#canvas-empty')).toBeVisible();
    expect(await page.locator(SELECTOR).count()).toBe(0);
    const afterReload = await page.evaluate(() => {
      const state = globalThis.__YAIWES_FACTORY_V19__.getState();
      return { count: state.components.length, selectedId: state.selectedId };
    });
    expect(afterReload).toEqual({ count: 0, selectedId: null });

    expect(pageErrors, `critical page errors ${JSON.stringify(pageErrors)}`).toEqual([]);
    expect(failedRequests, `failed document/script ${JSON.stringify(failedRequests)}`).toEqual([]);
    console.log(`F_FE_120_PASS=${JSON.stringify({ candidate: CANDIDATE, selector: SELECTOR, project: testInfo.project.name })}`);
  });
});
