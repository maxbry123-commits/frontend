import { test, expect } from '@playwright/test';

const URL = '/index-v192.html';
const CANDIDATE = 'index-v192.html';
const SELECTOR = "[data-kind='audio']";
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
  await revealCard(page);
  return { pageErrors, failedRequests };
}

async function revealCard(page) {
  const card = page.locator(SELECTOR);
  if (await card.isVisible()) return;
  const toggle = page.locator('[data-workspace-toggle="left"]');
  await expect(toggle, 'mobile shell must expose Biblioteca toggle to reach [data-kind=audio]').toBeVisible();
  await toggle.click();
  await expect(card).toBeVisible();
}

test.describe('F-FE-118 ELEMENT-AUDIO control QA', () => {
  test('audio card selects preview then Insertar adds Audio and persists', async ({ page }, testInfo) => {
    const { pageErrors, failedRequests } = await boot(page);
    const card = page.locator(SELECTOR);
    const preview = page.locator('[data-component-preview]');
    const insert = page.locator('[data-preview-insert]');

    await expect(page.locator('#canvas-empty')).toBeVisible();
    expect(await page.locator('[data-node]').count()).toBe(0);

    await card.click();
    await expect(card).toHaveClass(/browser-selected/);
    await expect(preview).toBeVisible();
    await expect(page.locator('[data-preview-title]')).toHaveText('Audio');
    await expect(page.locator('[data-preview-meta]')).toContainText('audio');
    await expect(insert).toHaveAttribute('data-selected-kind', 'audio');
    await expect(page.locator('[data-node]')).toHaveCount(0);
    expect(await page.evaluate(() => globalThis.__YAIWES_FACTORY_V19__.getState().components.length)).toBe(0);

    await insert.click();
    await expect(page.locator('[data-node]')).toHaveCount(1);
    await expect(page.locator('[data-node] strong')).toHaveText('Audio');
    await expect(page.locator('[data-node] small')).toContainText('audio');
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
        storedLabel: raw?.state?.components?.[0]?.label ?? null,
      };
    }, PROJECT_KEY);
    expect(created.count).toBe(1);
    expect(created.item).toMatchObject({ kind: 'audio', label: 'Audio' });
    expect(created.selectedId).toBe(created.item.id);
    expect(created.storedCount).toBe(1);
    expect(created.storedKind).toBe('audio');
    expect(created.storedLabel).toBe('Audio');

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('#canvas')).toBeVisible();
    await page.waitForFunction(() => Boolean(globalThis.__YAIWES_FACTORY_V19__), null, { timeout: 10_000 });
    await expect(page.locator('[data-node]')).toHaveCount(1);
    await expect(page.locator('[data-node] strong')).toHaveText('Audio');
    const afterReload = await page.evaluate(() => {
      const state = globalThis.__YAIWES_FACTORY_V19__.getState();
      return { count: state.components.length, kind: state.components[0]?.kind, label: state.components[0]?.label };
    });
    expect(afterReload).toEqual({ count: 1, kind: 'audio', label: 'Audio' });

    expect(pageErrors, `critical page errors ${JSON.stringify(pageErrors)}`).toEqual([]);
    expect(failedRequests, `failed document/script ${JSON.stringify(failedRequests)}`).toEqual([]);
    console.log(`F_FE_118_PASS=${JSON.stringify({ candidate: CANDIDATE, selector: SELECTOR, kind: 'audio', project: testInfo.project.name })}`);
  });
});
