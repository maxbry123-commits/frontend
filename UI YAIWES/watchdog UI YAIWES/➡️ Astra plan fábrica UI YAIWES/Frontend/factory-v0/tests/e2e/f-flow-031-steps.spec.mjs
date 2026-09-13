import { test, expect } from '@playwright/test';
const KEY='yaiwes-factory-project-v19';
const read=page=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)||'null'),KEY);

test('F-FLOW-031 Next/Prev keeps canvas and canonical state', async ({ page }) => {
  await page.goto('/index-v19.html');
  await page.evaluate(()=>localStorage.clear());
  await page.reload();
  await page.locator('[data-kind="window"]').click();
  const initial=await read(page);
  const id=initial.state.selectedId;
  await expect(page.locator(`[data-node="${id}"]`)).toBeVisible();

  for(let expected=2; expected<=5; expected++){
    await page.locator('#next-step').click();
    const project=await read(page);
    expect(project.state.step).toBe(expected);
    expect(project.state.components.some(c=>c.id===id)).toBeTruthy();
    await expect(page.locator(`[data-node="${id}"]`)).toBeVisible();
  }
  for(let expected=4; expected>=1; expected--){
    await page.locator('#prev-step').click();
    const project=await read(page);
    expect(project.state.step).toBe(expected);
    expect(project.state.components.some(c=>c.id===id)).toBeTruthy();
    await expect(page.locator(`[data-node="${id}"]`)).toBeVisible();
  }
  await page.reload();
  const restored=await read(page);
  expect(restored.state.step).toBe(1);
  expect(restored.state.components.some(c=>c.id===id)).toBeTruthy();
  await expect(page.locator(`[data-node="${id}"]`)).toBeVisible();
});
