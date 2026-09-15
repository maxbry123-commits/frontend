import { test, expect } from '@playwright/test';

const URL = '/index-v192.html';
const CANDIDATE = 'index-v192.html';
const SELECTOR = '#apply-theme';
const PROJECT_KEY = 'yaiwes-factory-project-v19';
const CONFIG_KEY = 'yaiwes-factory-config-v13';
const NEXT = { bg: '#112233', accent: '#ff8800', radius: 22 };

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
  await expect(toggle, 'mobile shell must expose Inspector toggle to reach #apply-theme').toBeVisible();
  await toggle.click();
  await btn.scrollIntoViewIfNeeded();
  await expect(btn).toBeVisible();
  return btn;
}

async function themeSnap(page) {
  return page.evaluate((configKey) => {
    const style = document.documentElement.style;
    const config = JSON.parse(localStorage.getItem(configKey) || 'null');
    return {
      bg: style.getPropertyValue('--bg'),
      accent: style.getPropertyValue('--accent'),
      radius: style.getPropertyValue('--radius'),
      stored: config?.theme ?? null,
    };
  }, CONFIG_KEY);
}

test.describe('F-FE-122 APPLY-THEME control QA', () => {
  test('Aplicar diseno writes CSS vars and persists theme across reload', async ({ page }, testInfo) => {
    const { pageErrors, failedRequests } = await boot(page);
    const apply = await revealInspector(page);
    await expect(apply).toHaveText('Aplicar diseño');

    const before = await themeSnap(page);
    expect(before.bg.toLowerCase()).toBe('#0b0d10');
    expect(before.accent.toLowerCase()).toBe('#7c9cff');
    expect(before.radius).toBe('14px');

    await page.locator('#theme-bg').fill(NEXT.bg);
    await page.locator('#theme-accent').fill(NEXT.accent);
    await page.locator('#theme-radius').fill(String(NEXT.radius));

    const pending = await themeSnap(page);
    expect(pending.bg.toLowerCase()).toBe('#0b0d10');
    expect(pending.accent.toLowerCase()).toBe('#7c9cff');
    expect(pending.radius).toBe('14px');

    await apply.click();

    const after = await themeSnap(page);
    expect(after.bg.toLowerCase()).toBe(NEXT.bg);
    expect(after.accent.toLowerCase()).toBe(NEXT.accent);
    expect(after.radius).toBe(`${NEXT.radius}px`);
    expect(after.stored.bg.toLowerCase()).toBe(NEXT.bg);
    expect(after.stored.accent.toLowerCase()).toBe(NEXT.accent);
    expect(after.stored.radius).toBe(NEXT.radius);

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('#canvas')).toBeVisible();
    await page.waitForFunction(() => Boolean(globalThis.__YAIWES_FACTORY_V19__), null, { timeout: 10_000 });
    const reloaded = await themeSnap(page);
    expect(reloaded.bg.toLowerCase()).toBe(NEXT.bg);
    expect(reloaded.accent.toLowerCase()).toBe(NEXT.accent);
    expect(reloaded.radius).toBe(`${NEXT.radius}px`);
    expect(reloaded.stored.bg.toLowerCase()).toBe(NEXT.bg);
    expect(reloaded.stored.accent.toLowerCase()).toBe(NEXT.accent);
    expect(reloaded.stored.radius).toBe(NEXT.radius);

    expect(pageErrors, `critical page errors ${JSON.stringify(pageErrors)}`).toEqual([]);
    expect(failedRequests, `failed document/script ${JSON.stringify(failedRequests)}`).toEqual([]);
    console.log(`F_FE_122_PASS=${JSON.stringify({ candidate: CANDIDATE, selector: SELECTOR, theme: NEXT, project: testInfo.project.name })}`);
  });
});
