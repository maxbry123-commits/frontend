import { test, expect } from '@playwright/test';

test('F-IO-027 saved version restores and reopens without loss', async ({page})=>{
  await page.goto('/index-v192.html',{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>localStorage.clear());
  await page.reload({waitUntil:'domcontentloaded'});

  await page.locator('[data-kind="button"]').click();
  await expect(page.locator('[data-node]')).toHaveCount(1);
  const original=await page.evaluate(()=>window.__YAIWES_FACTORY_V19__.getState().components);

  await page.locator('#save-version').click();
  await expect(page.locator('#restore-version')).toBeVisible();
  await expect(page.locator('#restore-version')).toHaveText(/Restaurar V1/);
  const snapshots=await page.evaluate(()=>window.__YAIWES_VERSION_STORE_V1__.listVersionSnapshots());
  expect(snapshots).toHaveLength(1);
  expect(snapshots[0].version).toBe(1);
  expect(snapshots[0].project.state.components).toEqual(original);

  await page.locator('[data-kind="window"]').click();
  await expect(page.locator('[data-node]')).toHaveCount(2);
  await page.locator('#restore-version').click();
  await page.waitForLoadState('domcontentloaded');
  await expect(page.locator('[data-node]')).toHaveCount(1);
  const restored=await page.evaluate(()=>window.__YAIWES_FACTORY_V19__.getState());
  expect(restored.version).toBe(1);
  expect(restored.components).toEqual(original);

  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.locator('[data-node]')).toHaveCount(1);
  const reopened=await page.evaluate(()=>window.__YAIWES_FACTORY_V19__.getState());
  expect(reopened.components).toEqual(original);
  expect(reopened.version).toBe(1);
  console.log('F_IO_027_VERSION_REOPEN=PASS');
});
