import { test, expect } from '@playwright/test';
const KEY='yaiwes-factory-project-v19';
const read=page=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)||'null'),KEY);

test('F-MOD-032 creates editable window/button/selector/segment primitives', async ({ page }) => {
  await page.goto('/index-v19.html');
  await page.evaluate(()=>localStorage.clear());
  await page.reload();
  for (const kind of ['window','button','selector','segment']) {
    await page.locator(`[data-kind="${kind}"]`).click();
  }
  await expect(page.locator('[data-node]')).toHaveCount(4);
  let project=await read(page);
  expect(project.state.components.map(c=>c.kind)).toEqual(['window','button','selector','segment']);

  const target=project.state.components.find(c=>c.kind==='selector');
  await page.locator(`[data-node="${target.id}"]`).click();
  await page.locator('[data-step="2"]').click();
  await page.locator('#prop-label').fill('Selector editable verificado');
  await page.locator('#prop-label').blur();
  project=await read(page);
  expect(project.state.components.find(c=>c.id===target.id).label).toBe('Selector editable verificado');
  await expect(page.locator(`[data-node="${target.id}"] strong`)).toContainText('Selector editable verificado');

  await page.reload();
  project=await read(page);
  expect(project.state.components).toHaveLength(4);
  expect(project.state.components.find(c=>c.id===target.id).label).toBe('Selector editable verificado');
});
