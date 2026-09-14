import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const URL='/index-v193.html';
const OUT='test-results/f-ui-055';
mkdirSync(OUT,{recursive:true});

async function boot(page){
  await page.setViewportSize({width:1440,height:900});
  await page.goto(URL,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>globalThis.__YAIWES_FACTORY_CANDIDATE_V193__?.version==='1.9.3');
  await expect(page.locator('#canvas')).toBeVisible();
}

async function addAndSelect(page){
  const card=page.locator('.component-card[data-kind="button"]');
  await card.click();
  await page.locator('[data-preview-insert]').click();
  await expect(page.locator('[data-node]')).toHaveCount(1);
  await page.locator('[data-node]').click();
}

test.beforeEach(async({page})=>{await page.addInitScript(()=>localStorage.clear());});

test('canonical duplicate and delete shortcuts mutate the real project once',async({page},testInfo)=>{
  test.skip(testInfo.project.name!=='chromium-desktop','keyboard command matrix');
  await boot(page); await addAndSelect(page);
  await page.keyboard.press('Control+D');
  await expect(page.locator('[data-node]')).toHaveCount(2);
  await page.keyboard.press('Delete');
  await expect(page.locator('[data-node]')).toHaveCount(1);
  await page.screenshot({path:`${OUT}/shortcut-effects.png`,fullPage:true});
});

test('command palette opens from Ctrl+K, exposes actions and Escape closes it',async({page},testInfo)=>{
  test.skip(testInfo.project.name!=='chromium-desktop','desktop command palette gate');
  await boot(page); await addAndSelect(page);
  await page.keyboard.press('Control+K');
  const palette=page.locator('[data-command-palette],[role="dialog"].command-palette,[role="dialog"][aria-label*="comand" i],[role="dialog"][aria-label*="acción" i]').first();
  await expect(palette,'F-UI-055 requires a real command palette/quick-action surface').toBeVisible({timeout:3000});
  const actions=palette.locator('button,[role="option"],[data-command],[data-quick-action]');
  expect(await actions.count(),'palette must expose at least one auditable command').toBeGreaterThan(0);
  await page.screenshot({path:`${OUT}/command-palette-open.png`,fullPage:true});
  await page.keyboard.press('Escape');
  await expect(palette).toBeHidden();
});
