import { test, expect } from '@playwright/test';

const URL = '/index-v192.html';
const CANDIDATE = 'index-v192.html';
const SELECTOR = '#save-version';
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

async function versionSnap(page) {
  return page.evaluate((key) => {
    const state = globalThis.__YAIWES_FACTORY_V19__.getState();
    const raw = JSON.parse(localStorage.getItem(key) || 'null');
    const lastEvidence = state.evidence?.[state.evidence.length - 1] || null;
    return {
      version: state.version,
      evidenceCount: Array.isArray(state.evidence) ? state.evidence.length : 0,
      lastEvidenceType: lastEvidence?.type || null,
      lastEvidenceVersion: lastEvidence?.version ?? null,
      storedVersion: raw?.state?.version ?? null,
      storedEvidenceCount: raw?.state?.evidence?.length ?? null,
    };
  }, PROJECT_KEY);
}

test.describe('F-FE-107 SAVE-VERSION control QA', () => {
  test('SAVE-VERSION increments version, records evidence, persists and reloads', async ({ page }, testInfo) => {
    const { pageErrors, failedRequests } = await boot(page, { clearStorage: true });
    const save = page.locator(SELECTOR);
    const status = page.locator('#status');

    let snap = await versionSnap(page);
    expect(snap.version).toBe(0);
    expect(snap.storedVersion).toBe(0);
    await expect(status).toContainText('V0');

    await save.scrollIntoViewIfNeeded();
    await save.click();

    snap = await versionSnap(page);
    expect(snap.version).toBe(1);
    expect(snap.evidenceCount).toBeGreaterThanOrEqual(1);
    expect(snap.lastEvidenceType).toBe('version');
    expect(snap.lastEvidenceVersion).toBe(1);
    expect(snap.storedVersion).toBe(1);
    await expect(status).toContainText('V1');

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('#canvas')).toBeVisible();
    await page.waitForFunction(() => Boolean(globalThis.__YAIWES_FACTORY_V19__), null, { timeout: 10_000 });
    await expect(page.locator(SELECTOR)).toBeVisible();
    snap = await versionSnap(page);
    expect(snap.version).toBe(1);
    expect(snap.storedVersion).toBe(1);
    await expect(page.locator('#status')).toContainText('V1');

    await page.locator(SELECTOR).click();
    snap = await versionSnap(page);
    expect(snap.version).toBe(2);
    expect(snap.lastEvidenceType).toBe('version');
    expect(snap.lastEvidenceVersion).toBe(2);
    expect(snap.storedVersion).toBe(2);
    await expect(page.locator('#status')).toContainText('V2');

    expect(pageErrors, `critical page errors ${JSON.stringify(pageErrors)}`).toEqual([]);
    expect(failedRequests, `failed document/script ${JSON.stringify(failedRequests)}`).toEqual([]);
    console.log(`F_FE_107_PASS=${JSON.stringify({ candidate: CANDIDATE, selector: SELECTOR, version: snap.version, project: testInfo.project.name })}`);
  });
});
