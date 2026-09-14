import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const LIVE=(process.env.YAIWES_LIVE_URL||'').replace(/\/$/,'');
const EXPECTED=(process.env.EXPECTED_SOURCE_SHA||'').trim();
const OUT='test-results/f-ui-057';
mkdirSync(OUT,{recursive:true});

test('published V1.9.3 serves exact SHA and navigates all primary steps without critical errors',async({page})=>{
  test.skip(!LIVE||!EXPECTED,'F-UI-057 requires YAIWES_LIVE_URL + EXPECTED_SOURCE_SHA');
  const consoleErrors=[]; const networkFailures=[];
  page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});
  page.on('requestfailed',r=>networkFailures.push(`${r.method()} ${r.url()} ${r.failure()?.errorText||''}`));
  const source=await page.request.get(`${LIVE}/source-sha.txt`,{timeout:20_000});
  expect(source.ok()).toBeTruthy();
  expect((await source.text()).trim()).toBe(EXPECTED);
  await page.goto(LIVE,{waitUntil:'networkidle',timeout:30_000});
  await page.waitForFunction(()=>globalThis.__YAIWES_FACTORY_CANDIDATE_V193__?.version==='1.9.3',null,{timeout:15_000});
  await expect(page.locator('#canvas')).toBeVisible();
  const steps=page.locator('#steps [data-step]');
  expect(await steps.count()).toBe(5);
  for(let i=0;i<5;i+=1){
    const id=await steps.nth(i).getAttribute('data-step');
    await page.locator(`#steps [data-step="${id}"]`).click();
    await expect(page.locator('#context-count')).toContainText(`${i+1}/`);
    await page.screenshot({path:`${OUT}/published-step-${i+1}.png`,fullPage:true});
  }
  for(const side of ['left','right']){
    const toggle=page.locator(`[data-workspace-toggle="${side}"]`);
    if(await toggle.isVisible()){
      await toggle.click();
      await expect(page.locator(side==='left'?'.library-pane':'.context-pane')).toBeVisible();
      await page.locator(`[data-workspace-close="${side}"]`).click();
    }
  }
  expect(consoleErrors).toEqual([]);
  expect(networkFailures).toEqual([]);
});
