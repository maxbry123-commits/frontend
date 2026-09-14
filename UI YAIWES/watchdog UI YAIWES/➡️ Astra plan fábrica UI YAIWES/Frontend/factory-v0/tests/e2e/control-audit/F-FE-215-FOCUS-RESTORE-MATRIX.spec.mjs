import { test, expect } from '@playwright/test';

const URL = '/index-v192.html';
const CANDIDATE = 'index-v192.html';

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
  await expect(page.locator('#canvas')).toBeVisible();
  await page.waitForFunction(() => document.querySelector('.app-shell')?.dataset.workspaceShell === 'v1', null, { timeout: 10_000 });
  return { pageErrors, failedRequests };
}

for (const side of ['left', 'right']) {
  test(`F-FE-215 ${side} drawer close restores focus to invoker`, async ({ page }) => {
    await page.setViewportSize({ width: 412, height: 915 });
    const { pageErrors, failedRequests } = await boot(page);
    const toggle = page.locator(`[data-workspace-toggle="${side}"]`);
    const close = page.locator(`[data-workspace-close="${side}"]`);
    const pane = side === 'left' ? page.locator('.library-pane') : page.locator('.context-pane');

    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await toggle.focus();
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(pane).toHaveAttribute('aria-hidden', 'false');
    await expect(close).toBeVisible();

    await close.focus();
    await expect(close).toBeFocused();
    await close.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(pane).toHaveAttribute('aria-hidden', 'true');

    const focus = await page.evaluate(() => {
      const el = document.activeElement;
      return {
        tag: el?.tagName || null,
        workspaceToggle: el?.getAttribute?.('data-workspace-toggle') || null,
        workspaceClose: el?.getAttribute?.('data-workspace-close') || null,
        ariaHiddenAncestor: el?.closest?.('[aria-hidden="true"]')?.className || null,
      };
    });
    console.log(`F_FE_215_FOCUS=${JSON.stringify({ candidate: CANDIDATE, side, focus })}`);

    await expect(toggle, `focus must return to ${side} drawer invoker; actual=${JSON.stringify(focus)}`).toBeFocused();
    expect(focus.ariaHiddenAncestor, `focus cannot remain inside aria-hidden drawer: ${JSON.stringify(focus)}`).toBeNull();
    expect(pageErrors, `critical page errors ${JSON.stringify(pageErrors)}`).toEqual([]);
    expect(failedRequests, `failed document/script ${JSON.stringify(failedRequests)}`).toEqual([]);
  });
}
