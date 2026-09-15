import { test, expect } from '@playwright/test';

const URL = '/index-v192.html';
const CANDIDATE = 'index-v192.html';
const SELECTOR = '#create-page';
const PROJECT_KEY = 'yaiwes-factory-project-v19';
const CONFIG_KEY = 'yaiwes-factory-config-v13';
const PAGE_NAME = 'Landing QA';

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
  await page.evaluate(([projectKey, configKey]) => {
    try { localStorage.removeItem(projectKey); localStorage.removeItem(configKey); } catch {}
  }, [PROJECT_KEY, CONFIG_KEY]);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#canvas')).toBeVisible();
  await page.waitForFunction(() => Boolean(globalThis.__YAIWES_FACTORY_V19__), null, { timeout: 10_000 });
  return { pageErrors, failedRequests };
}

async function revealInspector(page) {
  const btn = page.locator(SELECTOR);
  if (await btn.isVisible()) return btn;
  const toggle = page.locator('[data-workspace-toggle="right"]');
  await expect(toggle, 'mobile shell must expose Inspector toggle to reach #create-page').toBeVisible();
  await toggle.click();
  await btn.scrollIntoViewIfNeeded();
  await expect(btn).toBeVisible();
  return btn;
}

test.describe('F-FE-121 CREATE-PAGE control QA', () => {
  test('Crear pagina en canvas adds page node, config.pages and persists', async ({ page }, testInfo) => {
    const { pageErrors, failedRequests } = await boot(page);

    await expect(page.locator('#canvas-empty')).toBeVisible();
    expect(await page.locator('[data-node]').count()).toBe(0);

    const create = await revealInspector(page);
    await expect(create).toHaveText('Crear página en canvas');
    await page.locator('#page-name').fill(PAGE_NAME);
    await page.locator('#page-template').selectOption('landing');
    await create.click();

    await expect(page.locator('[data-node]')).toHaveCount(1);
    await expect(page.locator('[data-node] strong')).toHaveText(PAGE_NAME);
    await expect(page.locator('[data-node] small')).toContainText('page');
    await expect(page.locator('#canvas-empty')).toBeHidden();
    await expect(page.locator('.tool-card')).toContainText(`${PAGE_NAME} · landing`);

    const created = await page.evaluate(([projectKey, configKey]) => {
      const state = globalThis.__YAIWES_FACTORY_V19__.getState();
      const project = JSON.parse(localStorage.getItem(projectKey) || 'null');
      const config = JSON.parse(localStorage.getItem(configKey) || 'null');
      return {
        count: state.components.length,
        item: state.components[0],
        selectedId: state.selectedId,
        storedCount: project?.state?.components?.length ?? 0,
        storedKind: project?.state?.components?.[0]?.kind ?? null,
        storedLabel: project?.state?.components?.[0]?.label ?? null,
        pages: config?.pages ?? null,
      };
    }, [PROJECT_KEY, CONFIG_KEY]);
    expect(created.count).toBe(1);
    expect(created.item).toMatchObject({ kind: 'page', label: PAGE_NAME });
    expect(created.selectedId).toBe(created.item.id);
    expect(created.storedCount).toBe(1);
    expect(created.storedKind).toBe('page');
    expect(created.storedLabel).toBe(PAGE_NAME);
    expect(created.pages).toEqual([{ name: PAGE_NAME, template: 'landing' }]);

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('#canvas')).toBeVisible();
    await page.waitForFunction(() => Boolean(globalThis.__YAIWES_FACTORY_V19__), null, { timeout: 10_000 });
    await expect(page.locator('[data-node]')).toHaveCount(1);
    await expect(page.locator('[data-node] strong')).toHaveText(PAGE_NAME);
    const afterReload = await page.evaluate(([projectKey, configKey]) => {
      const state = globalThis.__YAIWES_FACTORY_V19__.getState();
      const config = JSON.parse(localStorage.getItem(configKey) || 'null');
      return {
        count: state.components.length,
        kind: state.components[0]?.kind,
        label: state.components[0]?.label,
        pages: config?.pages ?? null,
      };
    }, [PROJECT_KEY, CONFIG_KEY]);
    expect(afterReload).toEqual({
      count: 1,
      kind: 'page',
      label: PAGE_NAME,
      pages: [{ name: PAGE_NAME, template: 'landing' }],
    });

    expect(pageErrors, `critical page errors ${JSON.stringify(pageErrors)}`).toEqual([]);
    expect(failedRequests, `failed document/script ${JSON.stringify(failedRequests)}`).toEqual([]);
    console.log(`F_FE_121_PASS=${JSON.stringify({ candidate: CANDIDATE, selector: SELECTOR, kind: 'page', project: testInfo.project.name })}`);
  });
});
