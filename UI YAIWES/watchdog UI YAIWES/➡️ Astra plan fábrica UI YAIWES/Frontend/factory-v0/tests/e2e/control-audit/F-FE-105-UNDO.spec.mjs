import { test, expect } from '@playwright/test';

const URL = '/index-v192.html';
const CANDIDATE = 'index-v192.html';
const SELECTOR = '#undo';
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

async function revealNewComponent(page) {
  const control = page.locator('#new-component');
  if (await control.isVisible()) return;
  const toggle = page.locator('[data-workspace-toggle="left"]');
  await expect(toggle, 'mobile shell must expose Biblioteca toggle to reach #new-component').toBeVisible();
  await toggle.click();
  await expect(control).toBeVisible();
}

async function closeLeftDrawer(page) {
  const close = page.locator('[data-workspace-close="left"]');
  if (await close.isVisible()) await close.click();
}

async function snapshot(page) {
  return page.evaluate((key) => {
    const state = globalThis.__YAIWES_FACTORY_V19__.getState();
    const raw = JSON.parse(localStorage.getItem(key) || 'null');
    return {
      count: state.components.length,
      history: state.history.length,
      future: state.future.length,
      storedCount: raw?.state?.components?.length ?? null,
      storedHistory: raw?.state?.history?.length ?? null,
      storedFuture: raw?.state?.future?.length ?? null,
    };
  }, PROJECT_KEY);
}

test.describe('F-FE-105 UNDO control QA', () => {
  test('UNDO no-ops on empty history then reverts ADD_COMPONENT and persists', async ({ page }, testInfo) => {
    const { pageErrors, failedRequests } = await boot(page, { clearStorage: true });
    const undo = page.locator(SELECTOR);

    await expect(page.locator('#canvas-empty')).toBeVisible();
    expect(await page.locator('[data-node]').count()).toBe(0);
    let snap = await snapshot(page);
    expect(snap.count).toBe(0);
    expect(snap.history).toBe(0);

    await undo.click();
    snap = await snapshot(page);
    expect(snap.count).toBe(0);
    expect(snap.history).toBe(0);
    await expect(page.locator('#canvas-empty')).toBeVisible();

    await revealNewComponent(page);
    await page.locator('#new-component').click();
    await expect(page.locator('[data-node]')).toHaveCount(1);
    await expect(page.locator('[data-node] strong')).toHaveText('Nueva ventana');
    snap = await snapshot(page);
    expect(snap.count).toBe(1);
    expect(snap.history).toBeGreaterThanOrEqual(1);
    expect(snap.storedCount).toBe(1);

    await closeLeftDrawer(page);
    await expect(undo).toBeVisible();
    await undo.click();

    await expect(page.locator('[data-node]')).toHaveCount(0);
    await expect(page.locator('#canvas-empty')).toBeVisible();
    await expect(page.locator('#layer-count')).toHaveText('0');
    snap = await snapshot(page);
    expect(snap.count).toBe(0);
    expect(snap.history).toBe(0);
    expect(snap.future).toBeGreaterThanOrEqual(1);
    expect(snap.storedCount).toBe(0);
    expect(snap.storedFuture).toBeGreaterThanOrEqual(1);

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('#canvas')).toBeVisible();
    await page.waitForFunction(() => Boolean(globalThis.__YAIWES_FACTORY_V19__), null, { timeout: 10_000 });
    await expect(page.locator(SELECTOR)).toBeVisible();
    await expect(page.locator('[data-node]')).toHaveCount(0);
    await expect(page.locator('#canvas-empty')).toBeVisible();
    const afterReload = await snapshot(page);
    expect(afterReload.count).toBe(0);
    expect(afterReload.storedCount).toBe(0);
    expect(afterReload.future).toBeGreaterThanOrEqual(1);

    expect(pageErrors, `critical page errors ${JSON.stringify(pageErrors)}`).toEqual([]);
    expect(failedRequests, `failed document/script ${JSON.stringify(failedRequests)}`).toEqual([]);
    console.log(`F_FE_105_PASS=${JSON.stringify({ candidate: CANDIDATE, selector: SELECTOR, count: afterReload.count, future: afterReload.future, project: testInfo.project.name })}`);
  });
});
