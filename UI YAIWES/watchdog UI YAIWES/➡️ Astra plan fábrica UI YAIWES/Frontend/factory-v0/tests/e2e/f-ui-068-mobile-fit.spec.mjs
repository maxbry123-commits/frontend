import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const URL='/index-v195.html';
const OUT='test-results/f-ui-068-mobile-fit';
mkdirSync(OUT,{recursive:true});

async function bootWithShellV3(page, width=412, height=839) {
  await page.setViewportSize({width,height});
  await page.goto(URL,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>globalThis.__YAIWES_FACTORY_CANDIDATE_V195__?.version==='1.9.5');
  await page.waitForFunction(()=>document.documentElement.dataset.workspaceShell==='v2');
  await page.evaluate(async()=>{
    const link=[...document.querySelectorAll('link[rel="stylesheet"]')].find(el=>el.href.endsWith('/workspace-shell-v2.css'));
    if(!link) throw new Error('workspace-shell-v2.css link missing');
    await new Promise((resolve,reject)=>{
      link.addEventListener('load',resolve,{once:true});
      link.addEventListener('error',()=>reject(new Error('workspace-shell-v3.css failed to load')),{once:true});
      link.href='./workspace-shell-v3.css';
    });
  });
  await expect(page.locator('#canvas')).toBeVisible();
}

async function geometry(page) {
  return page.evaluate(()=>{
    const vw=innerWidth;
    const nodes=[...document.body.querySelectorAll('*')];
    const offenders=nodes.map(el=>{
      const r=el.getBoundingClientRect();
      const s=getComputedStyle(el);
      return {
        tag:el.tagName.toLowerCase(),
        id:el.id||'',
        cls:typeof el.className==='string'?el.className.slice(0,120):'',
        left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width),
        scrollWidth:el.scrollWidth,clientWidth:el.clientWidth,
        position:s.position,visibility:s.visibility,
      };
    }).filter(x=>x.visibility!=='hidden' && x.position!=='fixed' && (x.right>vw+2 || x.left < -2));
    return {
      viewport:vw,
      htmlScrollWidth:document.documentElement.scrollWidth,
      bodyScrollWidth:document.body.scrollWidth,
      htmlOverflowX:getComputedStyle(document.documentElement).overflowX,
      bodyOverflowX:getComputedStyle(document.body).overflowX,
      offenders:offenders.slice(0,25),
    };
  });
}

for (const width of [390,412]) {
  test(`shell v3 fits ${width}px viewport without root clipping`, async({page},testInfo)=>{
    test.skip(testInfo.project.name!=='mobile-chromium','mobile-only');
    await bootWithShellV3(page,width,839);
    const g=await geometry(page);
    console.log('F_UI_068_GEOMETRY',JSON.stringify(g));
    expect(g.htmlOverflowX,'html must not hide/clip overflow as a cosmetic fix').not.toMatch(/hidden|clip/);
    expect(g.bodyOverflowX,'body must not hide/clip overflow as a cosmetic fix').not.toMatch(/hidden|clip/);
    expect(g.htmlScrollWidth).toBeLessThanOrEqual(width+2);
    expect(g.bodyScrollWidth).toBeLessThanOrEqual(width+2);
    expect(g.offenders,`visible elements outside viewport: ${JSON.stringify(g.offenders)}`).toEqual([]);
    await expect(page.locator('.bottom-bar')).toBeInViewport();
    await expect(page.locator('#canvas')).toBeVisible();
    await page.screenshot({path:`${OUT}/fit-${width}.png`,fullPage:true});
  });
}

test('shell v3 drawers and canvas remain usable after geometry fix', async({page},testInfo)=>{
  test.skip(testInfo.project.name!=='mobile-chromium','mobile-only');
  await bootWithShellV3(page,412,839);
  const studio=page.locator('.studio');

  await page.locator('[data-workspace-toggle="left"]').tap();
  await expect(studio).not.toHaveClass(/workspace-left-collapsed/);
  await expect(page.locator('.library-pane')).toBeVisible();
  await page.locator('[data-workspace-close="left"]').tap();
  await expect(studio).toHaveClass(/workspace-left-collapsed/);

  await page.locator('[data-workspace-toggle="right"]').tap();
  await expect(studio).not.toHaveClass(/workspace-right-collapsed/);
  await expect(page.locator('.context-pane')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(studio).toHaveClass(/workspace-right-collapsed/);

  await expect(page.locator('#canvas')).toBeVisible();
  const g=await geometry(page);
  console.log('F_UI_068_POST_DRAWER_GEOMETRY',JSON.stringify(g));
  expect(g.htmlScrollWidth).toBeLessThanOrEqual(g.viewport+2);
  expect(g.bodyScrollWidth).toBeLessThanOrEqual(g.viewport+2);
});

test('shell v3 keeps all bottom actions touch-sized and inside viewport', async({page},testInfo)=>{
  test.skip(testInfo.project.name!=='mobile-chromium','mobile-only');
  await bootWithShellV3(page,412,839);
  const metrics=await page.locator('.bottom-bar button').evaluateAll((buttons)=>buttons.map((button)=>{
    const r=button.getBoundingClientRect();
    return {id:button.id,left:r.left,right:r.right,width:r.width,height:r.height};
  }));
  expect(metrics.length).toBe(5);
  for(const item of metrics){
    expect(item.left,`${item.id} left`).toBeGreaterThanOrEqual(0);
    expect(item.right,`${item.id} right`).toBeLessThanOrEqual(414);
    expect(item.height,`${item.id} touch height`).toBeGreaterThanOrEqual(44);
  }
});
