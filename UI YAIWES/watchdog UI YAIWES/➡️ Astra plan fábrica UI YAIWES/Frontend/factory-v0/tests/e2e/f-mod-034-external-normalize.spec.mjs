import { test, expect } from '@playwright/test';
const KEY='yaiwes-factory-project-v19';
const read=page=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)||'null'),KEY);

test('F-MOD-034 external input normalizes into editable Factory components', async ({ page }) => {
  await page.goto('/index-v192.html');
  await page.evaluate(()=>localStorage.clear());
  await page.reload();

  await page.locator('[data-step="3"]').click();
  await page.locator('#file-input').setInputFiles({
    name:'external-card.html',
    mimeType:'text/html',
    buffer:Buffer.from('<section><button>External CTA</button></section>')
  });
  await expect.poll(async()=>page.locator('[data-node]').count()).toBe(1);

  let project=await read(page);
  expect(project.state.components).toHaveLength(1);
  const external=project.state.components[0];
  expect(external.kind).toBe('page');
  expect(external.label).toBe('external-card.html');
  expect(windowless(external.x)).toBeTruthy();

  await page.locator(`[data-layer="${external.id}"]`).click();
  await page.locator('[data-step="2"]').click();
  await page.locator('#prop-label').fill('External normalized editable');
  await page.locator('#prop-label').blur();
  project=await read(page);
  expect(project.state.components.find(c=>c.id===external.id).label).toBe('External normalized editable');

  await page.locator('[data-step="3"]').click();
  await page.locator('#html-input').fill('<article><h1>Inline external</h1></article>');
  await page.locator('#load-html-source').click();
  await expect.poll(async()=>page.locator('[data-node]').count()).toBe(2);
  project=await read(page);
  expect(project.state.components.some(c=>c.kind==='page' && c.id!==external.id)).toBeTruthy();

  await page.reload();
  project=await read(page);
  expect(project.state.components).toHaveLength(2);
  expect(project.state.components.find(c=>c.id===external.id).label).toBe('External normalized editable');
});

function windowless(value){ return Number.isFinite(value) && value >= 0; }
