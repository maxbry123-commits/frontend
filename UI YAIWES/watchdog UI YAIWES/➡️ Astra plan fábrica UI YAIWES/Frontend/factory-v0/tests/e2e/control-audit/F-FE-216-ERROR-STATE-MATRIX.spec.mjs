import { test, expect } from '@playwright/test';

const URL = '/index-v192.html';
const CONFIG_KEY = 'yaiwes-factory-config-v13';
const PROJECT_KEY = 'yaiwes-factory-project-v19';

async function boot(page) {
  const pageErrors = [];
  page.on('pageerror', (err) => pageErrors.push(String(err)));
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await page.evaluate(({ configKey, projectKey }) => {
    localStorage.removeItem(configKey);
    localStorage.removeItem(projectKey);
  }, { configKey: CONFIG_KEY, projectKey: PROJECT_KEY });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#canvas')).toBeVisible();
  await page.waitForFunction(() => Boolean(globalThis.__YAIWES_FACTORY_V19__), null, { timeout: 10_000 });
  return { pageErrors };
}

async function goStep(page, step) {
  await page.locator(`[data-step="${step}"]`).click();
  await expect(page.locator(`[data-step="${step}"]`)).toHaveClass(/active/);
}

async function projectState(page) {
  return page.evaluate(() => JSON.stringify(globalThis.__YAIWES_FACTORY_V19__.getState()));
}

test('remote invalid config is explicit and does not mutate canonical project', async ({ page }) => {
  const { pageErrors } = await boot(page);
  await goStep(page, 4);
  const before = await projectState(page);
  await page.locator('#remote-url').fill('not-a-url');
  await page.locator('#remote-secret-ref').fill('secret://f-fe-216-test');
  await page.locator('#save-remote').click();
  await page.locator('#probe-remote').click();
  await expect(page.locator('#remote-status')).toHaveText('REMOTE_PROBE=INVALID_CONFIG');
  expect(await projectState(page)).toBe(before);
  expect(await page.locator('body').innerText()).not.toContain('secret://f-fe-216-test');
  expect(pageErrors).toEqual([]);
});

test('invalid reference import must expose an actionable visible error', async ({ page }) => {
  await boot(page);
  await goStep(page, 3);
  const before = await projectState(page);
  await page.locator('#reference-url').fill('javascript:alert(1)');
  await page.locator('#add-reference').click();
  await page.waitForTimeout(100);
  expect(await projectState(page)).toBe(before);
  const errorSurface = page.locator('#import-status,[data-import-status],[data-import-error]');
  const count = await errorSurface.count();
  console.log(`F_FE_216_IMPORT_ERROR_SURFACE=${count}`);
  expect(count, 'invalid import is silently ignored; an actionable visible error surface is required').toBeGreaterThan(0);
  await expect(errorSurface.first()).toBeVisible();
});

test('blocked destination delivery must expose an actionable visible error', async ({ page }) => {
  await boot(page);
  await goStep(page, 5);
  await page.waitForFunction(() => Boolean(document.getElementById('deliver-output')));
  const before = await projectState(page);
  await page.locator('#deliver-output').click();
  await page.waitForFunction(() => Boolean(globalThis.__YAIWES_LAST_DELIVERY__));
  const delivery = await page.evaluate(() => globalThis.__YAIWES_LAST_DELIVERY__);
  expect(delivery.ok).toBe(false);
  expect(delivery.reason).toBe('NO_DOWNLOAD_DESTINATION');
  expect(await projectState(page)).toBe(before);
  const errorSurface = page.locator('#delivery-status,[data-delivery-status],[data-delivery-error]');
  const count = await errorSurface.count();
  console.log(`F_FE_216_DELIVERY_ERROR=${JSON.stringify({ delivery, visibleSurfaces: count })}`);
  expect(count, 'delivery failure exists only in console/global state; visible actionable status is required').toBeGreaterThan(0);
  await expect(errorSurface.first()).toBeVisible();
});

test('HF jobs failure/status surface must be wired before HF error handling can pass', async ({ page }) => {
  await boot(page);
  await goStep(page, 4);
  const hfSurface = page.locator('#hf-jobs-panel,#hf-jobs-status,[data-hf-jobs],[data-hf-status]');
  const count = await hfSurface.count();
  console.log(`F_FE_216_HF_SURFACE=${count}`);
  expect(count, 'index-v192 has no HF jobs/status surface; HF failures cannot be actionable').toBeGreaterThan(0);
  await expect(hfSurface.first()).toBeVisible();
});
