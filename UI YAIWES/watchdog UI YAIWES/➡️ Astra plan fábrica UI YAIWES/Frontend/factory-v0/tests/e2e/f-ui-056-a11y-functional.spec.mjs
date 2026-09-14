import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const URL='/index-v193.html';
const OUT='test-results/f-ui-056';
mkdirSync(OUT,{recursive:true});

async function boot(page,size){
  await page.setViewportSize(size);
  await page.goto(URL,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>globalThis.__YAIWES_FACTORY_CANDIDATE_V193__?.version==='1.9.3');
  await expect(page.locator('#canvas')).toBeVisible();
}

async function unnamedInteractive(page){
  return page.evaluate(()=>{
    const visible=el=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0;};
    const name=el=>{
      const aria=el.getAttribute('aria-label')||el.getAttribute('aria-labelledby');
      const text=(el.innerText||'').trim();
      const value=(el.value||'').trim();
      const title=el.getAttribute('title');
      const id=el.id;
      const label=id?document.querySelector(`label[for="${CSS.escape(id)}"]`)?.textContent?.trim():'';
      const wrapping=el.closest('label')?.textContent?.trim();
      return aria||text||value||title||label||wrapping||el.getAttribute('data-kind')||el.getAttribute('data-step')||el.getAttribute('data-mode')||el.getAttribute('data-breakpoint')||el.getAttribute('data-workspace-toggle')||el.getAttribute('data-workspace-close');
    };
    return [...document.querySelectorAll('button,input,select,textarea,[role="button"],[tabindex]:not([tabindex="-1"])')]
      .filter(visible).filter(el=>!name(el)).map(el=>({tag:el.tagName,id:el.id,html:el.outerHTML.slice(0,180)}));
  });
}

test.beforeEach(async({page})=>{await page.addInitScript(()=>localStorage.clear());});

test('desktop controls have accessible names and keyboard focus can traverse core actions',async({page},testInfo)=>{
  test.skip(testInfo.project.name!=='chromium-desktop','desktop keyboard gate');
  await boot(page,{width:1440,height:900});
  expect(await unnamedInteractive(page)).toEqual([]);
  const seen=[];
  for(let i=0;i<12;i+=1){
    await page.keyboard.press('Tab');
    seen.push(await page.evaluate(()=>({tag:document.activeElement?.tagName,id:document.activeElement?.id,data:document.activeElement?.getAttribute('data-step')||document.activeElement?.getAttribute('data-mode')||document.activeElement?.getAttribute('data-workspace-toggle')})));
  }
  expect(seen.filter(x=>x.tag==='BUTTON').length).toBeGreaterThan(3);
  const left=page.locator('[data-workspace-toggle="left"]');
  await left.focus(); await page.keyboard.press('Enter');
  await expect(page.locator('.studio')).toHaveClass(/workspace-left-collapsed/);
  await left.focus(); await page.keyboard.press('Space');
  await expect(page.locator('.studio')).not.toHaveClass(/workspace-left-collapsed/);
  await page.screenshot({path:`${OUT}/desktop-keyboard-focus.png`,fullPage:true});
});

test('mobile essential controls remain named, hittable and Escape does not trap focus',async({page},testInfo)=>{
  test.skip(testInfo.project.name!=='mobile-chromium','mobile accessibility gate');
  await boot(page,{width:412,height:839});
  expect(await unnamedInteractive(page)).toEqual([]);
  const toggle=page.locator('[data-workspace-toggle="left"]');
  await toggle.tap();
  await expect(page.locator('.library-pane')).toBeVisible();
  const close=page.locator('[data-workspace-close="left"]');
  const box=await close.boundingBox();
  expect(box?.height||0).toBeGreaterThanOrEqual(44);
  await close.focus();
  await page.keyboard.press('Escape');
  const trapped=await page.evaluate(()=>document.activeElement && document.activeElement.closest('.library-pane') && getComputedStyle(document.activeElement.closest('.library-pane')).visibility!=='hidden');
  expect(Boolean(trapped)).toBe(false);
  await expect(page.locator('#canvas')).toBeVisible();
  await page.screenshot({path:`${OUT}/mobile-a11y.png`,fullPage:true});
});
