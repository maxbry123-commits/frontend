import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const URL='/index-v193.html';
const OUT='test-results/f-ui-053';
const PROJECT_KEY='yaiwes-factory-project-v19';
mkdirSync(OUT,{recursive:true});

async function boot(page,mobile=false){
  await page.setViewportSize(mobile?{width:412,height:839}:{width:1440,height:900});
  await page.goto(URL,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>globalThis.__YAIWES_FACTORY_CANDIDATE_V193__?.version==='1.9.3');
  if(mobile && await page.locator('.studio').evaluate(el=>el.classList.contains('workspace-left-collapsed'))) await page.locator('[data-workspace-toggle="left"]').tap();
  await expect(page.locator('[data-component-search]')).toBeVisible();
}

async function state(page){return page.evaluate(key=>JSON.parse(localStorage.getItem(key)||'null')?.state||null,PROJECT_KEY);}

test.beforeEach(async({page})=>{await page.addInitScript(()=>localStorage.clear());});

test('desktop search filter preview insert select edit undo redo stays on one canvas',async({page},testInfo)=>{
  test.skip(testInfo.project.name!=='chromium-desktop','desktop journey');
  await boot(page);
  await page.locator('[data-component-search]').fill('Botón');
  const card=page.locator('.component-card[data-kind="button"]');
  await expect(card).toBeVisible();
  await card.click();
  await expect(page.locator('[data-preview-title]')).toHaveText('Botón');
  await page.locator('[data-preview-insert]').click();
  await expect(page.locator('[data-node]')).toHaveCount(1);
  await page.locator('[data-node]').click();
  await expect(page.locator('#prop-label')).toBeVisible();
  await page.locator('#prop-label').fill('Botón editado V193');
  await page.locator('#prop-label').dispatchEvent('change');
  await expect(page.locator('[data-node] strong')).toHaveText('Botón editado V193');
  expect((await state(page)).components[0].label).toBe('Botón editado V193');
  await page.locator('#undo').click();
  await expect(page.locator('[data-node] strong')).not.toHaveText('Botón editado V193');
  await page.locator('#redo').click();
  await expect(page.locator('[data-node] strong')).toHaveText('Botón editado V193');
  await page.locator('[data-component-search]').fill('');
  await page.locator('[data-component-filter="recent"]').click();
  await expect(card).toBeVisible();
  await expect(page.locator('#canvas')).toBeVisible();
  await page.screenshot({path:`${OUT}/desktop-journey.png`,fullPage:true});
});

test('mobile touch preview insert select and edit keep canvas state',async({page},testInfo)=>{
  test.skip(testInfo.project.name!=='mobile-chromium','mobile journey');
  await boot(page,true);
  await page.locator('[data-component-search]').fill('Panel');
  const card=page.locator('.component-card[data-kind="panel"]');
  await card.tap();
  await expect(page.locator('[data-preview-title]')).toHaveText('Panel');
  await page.locator('[data-preview-insert]').tap();
  await expect(page.locator('[data-node]')).toHaveCount(1);
  await page.locator('[data-workspace-close="left"]').tap();
  await page.locator('[data-node]').tap();
  if(await page.locator('.studio').evaluate(el=>el.classList.contains('workspace-right-collapsed'))) await page.locator('[data-workspace-toggle="right"]').tap();
  await expect(page.locator('#prop-label')).toBeVisible();
  await page.locator('#prop-label').fill('Panel móvil editado');
  await page.locator('#prop-label').dispatchEvent('change');
  await expect(page.locator('[data-node] strong')).toHaveText('Panel móvil editado');
  expect((await state(page)).components[0].label).toBe('Panel móvil editado');
  await expect(page.locator('#canvas')).toBeVisible();
  await page.screenshot({path:`${OUT}/mobile-journey.png`,fullPage:true});
});
