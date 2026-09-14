import { test, expect } from '@playwright/test';

test('canonical v193 boots every integrated module without console/runtime failure', async ({ page }) => {
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => pageErrors.push(String(error)));

  const response = await page.goto('/index-v193.html', { waitUntil: 'domcontentloaded' });
  expect(response?.ok()).toBeTruthy();

  await expect(page.locator('#canvas')).toBeVisible();
  await page.waitForFunction(() => Boolean(globalThis.__YAIWES_FACTORY_CANDIDATE_V193__), null, { timeout: 10_000 });

  const state = await page.evaluate(() => ({
    evidence: globalThis.__YAIWES_FACTORY_CANDIDATE_V193__,
    bootError: globalThis.__YAIWES_FACTORY_CANDIDATE_V193_ERROR__ || null,
    stepCount: document.querySelectorAll('#steps [data-step]').length,
    canvasPresent: Boolean(document.querySelector('#canvas')),
  }));

  expect(state.bootError).toBeNull();
  expect(state.canvasPresent).toBe(true);
  expect(state.stepCount).toBeGreaterThan(0);
  expect(state.evidence.version).toBe('1.9.3');
  expect(state.evidence.modules).toEqual(expect.arrayContaining([
    '../app-v19.js',
    '../json-roundtrip-v1.js',
    '../touch-dnd-v192.js',
    '../skill-activation-v1.js',
    '../ui/workspace-shell-v1.js',
    '../ui/component-browser-v1.js',
    '../frontend-router-bridge.js',
    '../layer-reorder-v1.js',
    '../remote-control-v1.js',
    '../hf-jobs-panel-v1.js',
  ]));
  expect(state.evidence.capabilities.routerBridge).toBe(true);
  expect(state.evidence.capabilities.workspaceShell).toBe(true);
  expect(state.evidence.capabilities.componentBrowser).toBe(true);
  expect(state.evidence.capabilities.jsonRoundtrip).toBe(true);
  expect(state.evidence.capabilities.hfJobs).toBe(true);

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
