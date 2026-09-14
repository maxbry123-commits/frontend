import { test, expect } from '@playwright/test';

const URL = '/index-v192.html';
const CANDIDATE = 'index-v192.html';
const SELECTOR = "[data-kind='segment']";
const PROJECT_KEY = 'yaiwes-factory-project-v19';
const BROWSER_KEY = 'yaiwes-factory-component-browser-v1';

async function revealCard(page) {
  const card = page.locator(SELECTOR);
  if (await card.isVisible()) return;
  const toggle = page.locator('[data-workspace-toggle="left"]');
  await expect(toggle, 'mobile shell must expose Biblioteca toggle').toBeVisible();
  await toggle.click();
  await expect(card).toBeVisible();
}

async function boot(page) {
  const pageErrors = [];
  const failedRequests = [];
  page.on('pageerror', err => pageErrors.push(String(err)));
  page.on('requestfailed', req => {
    if (['document', 'script'].includes(req.resourceType())) {
      failedRequests.push({ url: req.url(), error: req.failure()?.errorText || 'failed' });
    }
  });
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await page.evaluate(([projectKey, browserKey]) => {
    try { localStorage.removeItem(projectKey); localStorage.removeItem(browserKey); } catch {}
  }, [PROJECT_KEY, BROWSER_KEY]);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#canvas')).toBeVisible();
  await page.waitForFunction(() => Boolean(globalThis.__YAIWES_FACTORY_V19__), null, { timeout: 10000 });
  await page.waitForFunction(() => document.documentElement.dataset.componentBrowser === 'v1', null, { timeout: 10000 });
  await revealCard(page);
  return { pageErrors, failedRequests };
}

test.describe('F-FE-113 ELEMENT-SEGMENT control QA', () => {
  test('segment card selects preview, inserts Segmento, and persists after reload', async ({ page }, testInfo) => {
    const { pageErrors, failedRequests } = await boot(page);
    const card = page.locator(SELECTOR);
    const preview = page.locator('[data-component-preview]');
    const insert = page.locator('[data-preview-insert]');

    await expect(page.locator('#canvas-empty')).toBeVisible();
    await expect(page.locator('[data-node]')).toHaveCount(0);
    await card.click();
    await expect(card).toHaveClass(/browser-selected/);
    await expect(preview).toBeVisible();
    await expect(page.locator('[data-preview-title]')).toHaveText('Segmento');
    await expect(page.locator('[data-preview-meta]')).toContainText('segment');
    await expect(insert).toHaveAttribute('data-selected-kind', 'segment');
    await expect(page.locator('[data-node]')).toHaveCount(0);

    await insert.click();
    await expect(page.locator('[data-node]')).toHaveCount(1);
    await expect(page.locator('[data-node] strong')).toHaveText('Segmento');
    await expect(page.locator('[data-node] small')).toContainText('segment');
    await expect(page.locator('#canvas-empty')).toBeHidden();

    const created = await page.evaluate((key) => {
      const state = globalThis.__YAIWES_FACTORY_V19__.getState();
      const raw = JSON.parse(localStorage.getItem(key) || 'null');
      return {
        count: state.components.length,
        item: state.components[0],
        selectedId: state.selectedId,
        storedCount: raw?.state?.components?.length ?? 0,
        storedKind: raw?.state?.components?.[0]?.kind ?? null,
        storedLabel: raw?.state?.components?.[0]?.label ?? null
      };
    }, PROJECT_KEY);
    expect(created.count).toBe(1);
    expect(created.item).toMatchObject({ kind: 'segment', label: 'Segmento' });
    expect(created.selectedId).toBe(created.item.id);
    expect(created.storedCount).toBe(1);
    expect(created.storedKind).toBe('segment');
    expect(created.storedLabel).toBe('Segmento');

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-node]')).toHaveCount(1);
    await expect(page.locator('[data-node] strong')).toHaveText('Segmento');
    const afterReload = await page.evaluate(() => {
      const state = globalThis.__YAIWES_FACTORY_V19__.getState();
      return { count: state.components.length, kind: state.components[0]?.kind, label: state.components[0]?.label };
    });
    expect(afterReload).toEqual({ count: 1, kind: 'segment', label: 'Segmento' });
    expect(pageErrors).toEqual([]);
    expect(failedRequests).toEqual([]);
    console.log(`F_FE_113_PASS=${JSON.stringify({ candidate: CANDIDATE, selector: SELECTOR, kind: 'segment', project: testInfo.project.name })}`);
  });
});
