import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const URL='/index-v195.html';
const OUT='test-results/f-ui-066-v195';
const PROJECT_KEY='yaiwes-factory-project-v19';
mkdirSync(OUT,{recursive:true});

async function boot(page, mobile=false) {
  await page.setViewportSize(mobile ? {width:412,height:839} : {width:1440,height:900});
  await page.goto(URL,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>globalThis.__YAIWES_FACTORY_CANDIDATE_V195__?.version==='1.9.5');
  await expect(page.locator('#canvas')).toBeVisible();
}

async function openLibrary(page) {
  const studio=page.locator('.studio');
  if (await studio.evaluate(el=>el.classList.contains('workspace-left-collapsed'))) {
    await page.locator('[data-workspace-toggle="left"]').click();
  }
  await expect(page.locator('.library-pane')).toBeVisible();
}

async function insertButton(page) {
  await openLibrary(page);
  await page.locator('[data-component-search]').fill('Botón');
  const card=page.locator('.component-card[data-kind="button"]');
  await expect(card).toBeVisible();
  await card.click();
  await page.locator('[data-preview-insert]').click();
  await expect(page.locator('[data-node]')).toHaveCount(1);
}

// Playwright gives every test a fresh browser context. Do not install an init script
// that clears localStorage on every navigation: it would also run on page.reload()
// and create a false recovery failure.

test('desktop: edit must undo and redo through canonical history', async({page},testInfo)=>{
  test.skip(testInfo.project.name!=='chromium-desktop','desktop-only');
  await boot(page,false);
  await insertButton(page);
  await page.locator('[data-node]').click();
  await expect(page.locator('#prop-label')).toBeVisible();
  await page.locator('#prop-label').fill('Botón editado V195');
  await page.locator('#prop-label').dispatchEvent('change');
  await expect(page.locator('[data-node] strong')).toHaveText('Botón editado V195');
  await page.locator('#undo').click();
  await expect(page.locator('[data-node] strong')).not.toHaveText('Botón editado V195');
  await page.locator('#redo').click();
  await expect(page.locator('[data-node] strong')).toHaveText('Botón editado V195');
});

test('desktop: reload must repaint persisted component', async({page},testInfo)=>{
  test.skip(testInfo.project.name!=='chromium-desktop','desktop-only');
  await boot(page,false);
  await insertButton(page);
  const before=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)||'null')?.state?.components?.length||0,PROJECT_KEY);
  expect(before).toBe(1);
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>globalThis.__YAIWES_FACTORY_CANDIDATE_V195__?.version==='1.9.5');
  const persisted=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)||'null')?.state?.components?.length||0,PROJECT_KEY);
  expect(persisted).toBe(1);
  await expect(page.locator('[data-node]')).toHaveCount(1);
});

test('desktop: Ctrl+K must expose a real command surface', async({page},testInfo)=>{
  test.skip(testInfo.project.name!=='chromium-desktop','desktop-only');
  await boot(page,false);
  await page.keyboard.press(process.platform==='darwin'?'Meta+K':'Control+K');
  const surfaces=page.locator('[data-command-palette],[data-quick-actions],[role="dialog"]:has-text("Comando"),[role="dialog"]:has-text("Acciones")');
  expect(await surfaces.count(),'F-UI-055 requires a real command palette or quick-action surface').toBeGreaterThan(0);
  await expect(surfaces.first()).toBeVisible();
});

test('mobile: shell must fit viewport and Escape close drawers', async({page},testInfo)=>{
  test.skip(testInfo.project.name!=='mobile-chromium','mobile-only');
  await boot(page,true);
  const dimensions=await page.evaluate(()=>({viewport:innerWidth,html:document.documentElement.scrollWidth,body:document.body.scrollWidth}));
  expect(dimensions.html,'html must not overflow mobile viewport').toBeLessThanOrEqual(dimensions.viewport+2);
  expect(dimensions.body,'body must not overflow mobile viewport').toBeLessThanOrEqual(dimensions.viewport+2);
  await page.locator('[data-workspace-toggle="left"]').tap();
  await expect(page.locator('.studio')).not.toHaveClass(/workspace-left-collapsed/);
  await page.keyboard.press('Escape');
  await expect(page.locator('.studio')).toHaveClass(/workspace-left-collapsed/);
  await page.locator('[data-workspace-toggle="right"]').tap();
  await expect(page.locator('.studio')).not.toHaveClass(/workspace-right-collapsed/);
  await page.keyboard.press('Escape');
  await expect(page.locator('.studio')).toHaveClass(/workspace-right-collapsed/);
  await page.screenshot({path:`${OUT}/mobile-shell.png`,fullPage:true});
});

test('mobile: library must release canvas after insert', async({page},testInfo)=>{
  test.skip(testInfo.project.name!=='mobile-chromium','mobile-only');
  await boot(page,true);
  await openLibrary(page);
  await page.locator('[data-component-search]').fill('Panel');
  await page.locator('.component-card[data-kind="panel"]').tap();
  await page.locator('[data-preview-insert]').tap();
  await expect(page.locator('[data-node]')).toHaveCount(1);
  await page.locator('[data-workspace-close="left"]').tap();
  await expect(page.locator('.studio')).toHaveClass(/workspace-left-collapsed/);
  await page.locator('[data-node]').tap();
  await expect(page.locator('[data-node].selected')).toHaveCount(1);
});
