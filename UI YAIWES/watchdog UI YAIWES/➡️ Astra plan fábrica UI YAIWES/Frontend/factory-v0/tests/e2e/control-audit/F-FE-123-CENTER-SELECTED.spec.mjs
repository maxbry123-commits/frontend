import { test, expect } from '@playwright/test';

const URL = '/index-v192.html';
const CANDIDATE = 'index-v192.html';
const SELECTOR = '#center-selected';
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

async function posSnap(page) {
  return page.evaluate((key) => {
    const state = globalThis.__YAIWES_FACTORY_V19__.getState();
    const view = globalThis.__YAIWES_FACTORY_V19__.getView();
    const item = state.components[0];
    const canvas = document.getElementById('canvas');
    const expected = item ? {
      x: Math.max(0, canvas.scrollLeft + canvas.clientWidth / (2 * view.zoom) - item.w / 2),
      y: Math.max(0, canvas.scrollTop + canvas.clientHeight / (2 * view.zoom) - item.h / 2),
    } : null;
    const raw = JSON.parse(localStorage.getItem(key) || 'null');
    return {
      x: item?.x ?? null,
      y: item?.y ?? null,
      w: item?.w ?? null,
      h: item?.h ?? null,
      zoom: view.zoom,
      expected,
      storedX: raw?.state?.components?.[0]?.x ?? null,
      storedY: raw?.state?.components?.[0]?.y ?? null,
      step: state.step,
    };
  }, PROJECT_KEY);
}

test.describe('F-FE-123 CENTER-SELECTED control QA', () => {
  test('Centrar seleccionado moves selected node to canvas center and persists', async ({ page }, testInfo) => {
    const { pageErrors, failedRequests } = await boot(page);

    expect(await page.locator(SELECTOR).count()).toBe(0);
    await insertButton(page);
    const origin = await posSnap(page);
    expect(origin.x).toEqual(expect.any(Number));
    expect(origin.y).toEqual(expect.any(Number));

    await page.locator('#next-step').click();
    await expect(page.locator('#step-kicker')).toHaveText('PASO 2');

    await reveal(page, 'right');
    const center = page.locator(SELECTOR);
    await center.scrollIntoViewIfNeeded();
    await expect(center).toBeVisible();
    await expect(center).toHaveText('Centrar seleccionado');
    await center.click();

    const moved = await posSnap(page);
    expect(moved.expected).toBeTruthy();
    expect(moved.x).toBeCloseTo(moved.expected.x, 5);
    expect(moved.y).toBeCloseTo(moved.expected.y, 5);
    expect(moved.storedX).toBeCloseTo(moved.expected.x, 5);
    expect(moved.storedY).toBeCloseTo(moved.expected.y, 5);
    expect(moved.x === 80 && moved.y === 80).toBe(false);

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('#canvas')).toBeVisible();
    await page.waitForFunction(() => Boolean(globalThis.__YAIWES_FACTORY_V19__), null, { timeout: 10_000 });
    const reloaded = await posSnap(page);
    expect(reloaded.x).toBeCloseTo(moved.expected.x, 5);
    expect(reloaded.y).toBeCloseTo(moved.expected.y, 5);

    expect(pageErrors, `critical page errors ${JSON.stringify(pageErrors)}`).toEqual([]);
    expect(failedRequests, `failed document/script ${JSON.stringify(failedRequests)}`).toEqual([]);
    console.log(`F_FE_123_PASS=${JSON.stringify({ candidate: CANDIDATE, selector: SELECTOR, from: { x: origin.x, y: origin.y }, to: { x: moved.x, y: moved.y }, project: testInfo.project.name })}`);
  });
});
