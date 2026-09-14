import { test, expect } from '@playwright/test';

const URL = '/index-v192.html';
const CANDIDATE = 'index-v192.html';
const SELECTOR = '#prev-step';
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

async function stepSnap(page) {
  return page.evaluate((key) => {
    const state = globalThis.__YAIWES_FACTORY_V19__.getState();
    const raw = JSON.parse(localStorage.getItem(key) || 'null');
    return {
      step: state.step,
      storedStep: raw?.state?.step ?? null,
    };
  }, PROJECT_KEY);
}

async function expectStep(page, step) {
  const snap = await stepSnap(page);
  expect(snap.step).toBe(step);
  expect(snap.storedStep).toBe(step);
  await expect(page.locator('#step-kicker')).toHaveText(`PASO ${step}`);
  await expect(page.locator('#context-count')).toHaveText(`${step}/5`);
  await expect(page.locator(`[data-step='${step}']`)).toHaveClass(/active/);
  return snap;
}

test.describe('F-FE-108 PREV-STEP control QA', () => {
  test('PREV-STEP clamps at 1, decrements from later steps, persists and reloads', async ({ page }, testInfo) => {
    const { pageErrors, failedRequests } = await boot(page, { clearStorage: true });
    const prev = page.locator(SELECTOR);
    const next = page.locator('#next-step');

    await expectStep(page, 1);
    await prev.click();
    await expectStep(page, 1);

    await next.click();
    await next.click();
    await expectStep(page, 3);

    await prev.scrollIntoViewIfNeeded();
    await prev.click();
    await expectStep(page, 2);

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('#canvas')).toBeVisible();
    await page.waitForFunction(() => Boolean(globalThis.__YAIWES_FACTORY_V19__), null, { timeout: 10_000 });
    await expect(page.locator(SELECTOR)).toBeVisible();
    await expectStep(page, 2);

    await page.locator(SELECTOR).click();
    await expectStep(page, 1);

    expect(pageErrors, `critical page errors ${JSON.stringify(pageErrors)}`).toEqual([]);
    expect(failedRequests, `failed document/script ${JSON.stringify(failedRequests)}`).toEqual([]);
    console.log(`F_FE_108_PASS=${JSON.stringify({ candidate: CANDIDATE, selector: SELECTOR, step: 1, project: testInfo.project.name })}`);
  });
});
