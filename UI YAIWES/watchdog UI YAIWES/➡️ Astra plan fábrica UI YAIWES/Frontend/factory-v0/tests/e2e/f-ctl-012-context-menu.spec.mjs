import { test, expect } from '@playwright/test';

const PROJECT_KEY='yaiwes-factory-project-v19';
const readProject=page=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)||'null'),PROJECT_KEY);

async function openMenuOnSelected(page){
  const node=page.locator('[data-node].selected').first();
  await expect(node).toBeVisible();
  await node.click({button:'right'});
  await expect(page.locator('#yaiwes-frappe-context-menu')).toBeVisible();
}

test('F-CTL-012 context menu duplicate, center and remove are live', async ({ page }) => {
  await page.goto('/index-v19.html');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await page.locator('[data-kind="window"]').click();
  await expect(page.locator('[data-node]')).toHaveCount(1);

  await openMenuOnSelected(page);
  await page.locator('[data-existing-action="duplicate-selected"]').click();
  await expect(page.locator('[data-node]')).toHaveCount(2);
  let state=(await readProject(page)).state;
  expect(state.components).toHaveLength(2);

  const selectedId=state.selectedId;
  await page.locator(`[data-node="${selectedId}"]`).click({button:'right'});
  await page.locator('[data-existing-action="center-selected"]').click();
  state=(await readProject(page)).state;
  const centered=state.components.find(c=>c.id===selectedId);
  expect(centered).toBeTruthy();
  expect(centered.x).toBeGreaterThanOrEqual(0);
  expect(centered.y).toBeGreaterThanOrEqual(0);

  await page.locator(`[data-node="${selectedId}"]`).click({button:'right'});
  await page.locator('[data-existing-action="remove-selected"]').click();
  await expect(page.locator('[data-node]')).toHaveCount(1);
  state=(await readProject(page)).state;
  expect(state.components).toHaveLength(1);
  expect(state.selectedId).toBeNull();
});
