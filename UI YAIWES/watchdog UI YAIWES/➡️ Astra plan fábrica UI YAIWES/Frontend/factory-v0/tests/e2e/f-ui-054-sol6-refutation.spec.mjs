import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const URL='/index-v193.html';
const OUT='test-results/f-ui-054';
const KEY='yaiwes-factory-project-v19';
mkdirSync(OUT,{recursive:true});

async function boot(page,size={width:1440,height:900}){
  await page.setViewportSize(size);
  await page.goto(URL,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>globalThis.__YAIWES_FACTORY_CANDIDATE_V193__?.version==='1.9.3');
  await expect(page.locator('#canvas')).toBeVisible();
}
async function addWindow(page){
  const studio=page.locator('.studio');
  if(await studio.evaluate(el=>el.classList.contains('workspace-left-collapsed'))) await page.locator('[data-workspace-toggle="left"]').click();
  await page.locator('.component-card[data-kind="window"]').click();
  await page.locator('[data-preview-insert]').click();
  await expect(page.locator('[data-node]')).toHaveCount(1);
}

test.beforeEach(async({page})=>{await page.addInitScript(()=>localStorage.clear());});

for(const [name,size] of [['desktop',{width:1440,height:900}],['compact',{width:900,height:640}],['mobile',{width:412,height:839}]]){
  test(`simulation ${name}: candidate keeps canvas and deterministic state`,async({page})=>{
    await boot(page,size); await addWindow(page);
    await expect(page.locator('#canvas')).toBeVisible();
    const stored=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)||'null'),KEY);
    expect(stored.state.components).toHaveLength(1);
    await page.screenshot({path:`${OUT}/simulation-${name}.png`,fullPage:true});
  });
}

test('refutation 1: reload has no ghost or duplicate component',async({page})=>{
  await boot(page); await addWindow(page);
  const before=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)).state.components.map(x=>x.id),KEY);
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.locator('[data-node]')).toHaveCount(1);
  const after=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)).state.components.map(x=>x.id),KEY);
  expect(after).toEqual(before);
});

test('refutation 2: repeated drawer transitions do not hide canvas or double-act',async({page})=>{
  await boot(page,{width:412,height:839});
  const studio=page.locator('.studio');
  // This suite is executed by the desktop Playwright project and changes the viewport
  // to mobile dimensions. Use the universal click action instead of tap(), which
  // requires a hasTouch browser context and otherwise creates a harness-only failure.
  for(let i=0;i<3;i+=1){
    await page.locator('[data-workspace-toggle="left"]').click();
    await expect(page.locator('.library-pane')).toBeVisible();
    await expect(page.locator('#canvas')).toBeVisible();
    await page.locator('[data-workspace-close="left"]').click();
    await expect(studio).toHaveClass(/workspace-left-collapsed/);
  }
  expect(await page.locator('.library-pane').count()).toBe(1);
  expect(await page.locator('.context-pane').count()).toBe(1);
});

test('refutation 3: desktop→mobile→desktop preserves exact project and active step',async({page})=>{
  await boot(page); await addWindow(page);
  await page.locator('#steps [data-step="3"]').click();
  const snapshot=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);
  await page.setViewportSize({width:412,height:839});
  await expect(page.locator('.app-shell')).toHaveAttribute('data-workspace-mode','mobile');
  await page.setViewportSize({width:1440,height:900});
  await expect(page.locator('.app-shell')).toHaveAttribute('data-workspace-mode','desktop');
  const after=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);
  expect(after.state.components).toEqual(snapshot.state.components);
  expect(after.state.step).toBe(3);
  await expect(page.locator('#context-count')).toHaveText('3/5');
  await page.screenshot({path:`${OUT}/refutation-responsive.png`,fullPage:true});
});
