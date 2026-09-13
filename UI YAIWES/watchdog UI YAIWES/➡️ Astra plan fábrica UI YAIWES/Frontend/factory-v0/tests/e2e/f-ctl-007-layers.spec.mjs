import { test, expect } from '@playwright/test';

const PROJECT_KEY='yaiwes-factory-project-v19';
const project=page=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)||'null'),PROJECT_KEY);

test('F-CTL-007 layers select, reorder, persist and undo', async ({ page }) => {
  await page.goto('/index-v19.html');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await page.locator('[data-kind="window"]').click();
  await page.locator('[data-kind="button"]').click();
  await expect(page.locator('#layer-list [data-layer]')).toHaveCount(2);

  const before=await project(page);
  const firstId=before.state.components[0].id;
  const secondId=before.state.components[1].id;

  await page.locator(`#layer-list [data-layer="${firstId}"]`).click();
  await expect(page.locator(`#layer-list [data-layer="${firstId}"]`)).toHaveClass(/active/);
  const selected=await project(page);
  expect(selected.state.selectedId).toBe(firstId);

  await page.locator(`#layer-list [data-layer="${firstId}"] [data-layer-move="1"]`).click();
  await page.waitForLoadState('domcontentloaded');
  await expect(page.locator('#layer-list [data-layer]')).toHaveCount(2);

  const reordered=await project(page);
  expect(reordered.state.components.map(x=>x.id)).toEqual([secondId,firstId]);
  expect(reordered.state.selectedId).toBe(firstId);
  expect(reordered.state.history.length).toBeGreaterThan(0);
  await expect(page.locator('#layer-list [data-layer]').nth(1)).toHaveAttribute('data-layer',firstId);

  await page.locator('#undo').click();
  const undone=await project(page);
  expect(undone.state.components.map(x=>x.id)).toEqual([firstId,secondId]);
});
