import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const URL='/index-v193.html';
const OUT='test-results/f-ui-058';
mkdirSync(OUT,{recursive:true});

async function boot(page,size){
  await page.setViewportSize(size);
  await page.goto(URL,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>globalThis.__YAIWES_FACTORY_CANDIDATE_V193__?.version==='1.9.3');
  await expect(page.locator('#canvas')).toBeVisible();
}

async function geometry(page){
  return page.evaluate(()=>{
    const rect=sel=>{const r=document.querySelector(sel)?.getBoundingClientRect();return r?{x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom}:null;};
    const overflow=[...document.querySelectorAll('body *')].filter(el=>{const r=el.getBoundingClientRect();const s=getComputedStyle(el);return s.position!=='fixed'&&r.width>0&&r.height>0&&(r.right>innerWidth+2||r.left<-2);}).slice(0,20).map(el=>({tag:el.tagName,id:el.id,className:el.className,right:el.getBoundingClientRect().right,left:el.getBoundingClientRect().left}));
    return {vw:innerWidth,vh:innerHeight,topbar:rect('.topbar'),studio:rect('.studio'),canvas:rect('#canvas'),bottom:rect('.bottom-bar'),overflow};
  });
}

test('desktop canvas stays dominant with no critical horizontal clipping',async({page},testInfo)=>{
  test.skip(testInfo.project.name!=='chromium-desktop','desktop visual gate');
  await boot(page,{width:1440,height:900});
  const g=await geometry(page);
  expect(g.canvas.w).toBeGreaterThan(400);
  expect(g.canvas.h).toBeGreaterThan(300);
  expect(g.overflow).toEqual([]);
  expect(g.topbar.bottom).toBeLessThanOrEqual(g.studio.y+2);
  expect(g.studio.bottom).toBeLessThanOrEqual(g.bottom.y+2);
  await page.locator('.component-card[data-kind="window"]').click();
  await page.locator('[data-preview-insert]').click();
  await expect(page.locator('[data-node]')).toHaveCount(1);
  await page.screenshot({path:`${OUT}/desktop.png`,fullPage:true});
});

test('mobile canvas-first layout and drawers stay inside viewport without hiding the canvas',async({page},testInfo)=>{
  test.skip(testInfo.project.name!=='mobile-chromium','mobile visual gate');
  await boot(page,{width:412,height:839});
  const base=await geometry(page);
  expect(base.canvas.w).toBeGreaterThan(250);
  expect(base.canvas.h).toBeGreaterThan(200);
  expect(base.overflow).toEqual([]);
  for(const side of ['left','right']){
    await page.locator(`[data-workspace-toggle="${side}"]`).tap();
    const pane=page.locator(side==='left'?'.library-pane':'.context-pane');
    await expect(pane).toBeVisible();
    const box=await pane.boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(-1);
    expect(box.x+box.width).toBeLessThanOrEqual(413);
    await expect(page.locator('#canvas')).toBeVisible();
    await page.screenshot({path:`${OUT}/mobile-${side}-drawer.png`,fullPage:true});
    await page.locator(`[data-workspace-close="${side}"]`).tap();
  }
});
