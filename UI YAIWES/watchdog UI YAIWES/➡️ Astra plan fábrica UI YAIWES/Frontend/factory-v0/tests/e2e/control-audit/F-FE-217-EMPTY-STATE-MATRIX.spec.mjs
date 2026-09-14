import { test, expect } from '@playwright/test';

const URL='/index-v192.html';
const KEYS=['yaiwes-factory-config-v13','yaiwes-factory-project-v19','yaiwes-factory-versions-v1'];

async function boot(page){
  await page.goto(URL,{waitUntil:'domcontentloaded'});
  await page.evaluate(keys=>keys.forEach(k=>localStorage.removeItem(k)),KEYS);
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.locator('#canvas')).toBeVisible();
  await page.waitForFunction(()=>Boolean(globalThis.__YAIWES_FACTORY_V19__));
}
async function step(page,n){await page.locator(`[data-step="${n}"]`).click();}

test('empty layers are explicit and actionable',async({page})=>{
  await boot(page);
  await expect(page.locator('#layer-list')).toContainText('Sin capas todavía');
  const add=page.locator('#new-component');
  await expect(add).toBeEnabled();
  await add.click();
  await expect(page.locator('[data-node]')).toHaveCount(1);
  await expect(page.locator('#layer-list')).not.toContainText('Sin capas todavía');
});

test('empty version history is recoverable through Save version',async({page})=>{
  await boot(page);
  await expect(page.locator('#restore-version')).toHaveCount(0);
  await expect(page.locator('#save-version')).toBeEnabled();
  await page.locator('#save-version').click();
  await expect(page.locator('#restore-version')).toBeVisible();
  await expect(page.locator('#restore-version')).toContainText('Restaurar V1');
});

test('empty AI result has an actionable path to produce a proposal',async({page})=>{
  await boot(page); await step(page,4);
  await expect(page.locator('#delta-preview')).toHaveText('Sin delta propuesto');
  await expect(page.locator('#propose-delta')).toBeEnabled();
  await page.locator('#ai-goal').fill('Añadir un panel de prueba');
  await page.locator('#propose-delta').click();
  await expect(page.locator('#delta-preview')).not.toHaveText('Sin delta propuesto');
});

test('library baseline has usable components instead of a dead empty shell',async({page})=>{
  await boot(page);
  const items=page.locator('#component-library [data-kind]');
  const count=await items.count();
  console.log(`F_FE_217_LIBRARY_COUNT=${count}`);
  expect(count).toBeGreaterThan(0);
  await expect(items.first()).toBeEnabled();
});

test('HF empty state must exist and be actionable',async({page})=>{
  await boot(page); await step(page,4);
  const surface=page.locator('#hf-jobs-panel,#hf-jobs-status,[data-hf-jobs],[data-hf-empty]');
  const count=await surface.count();
  console.log(`F_FE_217_HF_EMPTY_SURFACE=${count}`);
  expect(count,'HF has no empty-state surface in index-v192; user cannot discover/refresh jobs').toBeGreaterThan(0);
  await expect(surface.first()).toBeVisible();
});
