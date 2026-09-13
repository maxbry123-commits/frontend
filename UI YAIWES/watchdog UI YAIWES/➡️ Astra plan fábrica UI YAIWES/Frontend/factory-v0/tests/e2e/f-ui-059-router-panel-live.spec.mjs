import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';

const live=(process.env.FACTORY_LIVE_URL||'').replace(/\/$/,'');
const expectedSha=process.env.FACTORY_EXPECTED_SHA||'';
const shotDir='test-results/f-ui-059-live';

test.beforeAll(async()=>{ if(!live) throw new Error('FACTORY_LIVE_URL required'); await fs.mkdir(shotDir,{recursive:true}); });

test('published candidate serves exact SHA and Router panel state matrix', async ({ page, request }) => {
  const shaResponse=await request.get(`${live}/source-sha.txt`);
  expect(shaResponse.ok()).toBeTruthy();
  expect((await shaResponse.text()).trim()).toBe(expectedSha);

  let mode='healthy';
  await page.route('http://router.test/api/**', async route => {
    const url=new URL(route.request().url());
    if(url.pathname.endsWith('/connect')) return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({health:'healthy',models:['m1','m2'],active_route:'m2'})});
    if(url.pathname.endsWith('/status')){
      const body=mode==='degraded'?{health:'degraded',models:['fallback'],active_route:'fallback'}:mode==='error'?{health:'error',models:[],active_route:null}:{health:'healthy',models:['m1','m2'],active_route:'m2'};
      return route.fulfill({status:mode==='error'?503:200,contentType:'application/json',body:JSON.stringify(body)});
    }
    return route.fulfill({status:200,contentType:'application/json',body:'{}'});
  });

  await page.goto(`${live}/`);
  await expect(page.getByText('YAIWES UI Factory')).toBeVisible();
  await page.evaluate(()=>localStorage.setItem('yaiwes-factory-config-v13',JSON.stringify({models:[{name:'m1',role:'coder',endpoint:'http://router.test/model',secretRef:'MODEL_TOKEN'}],teamMode:'single',remote:{protocol:'HTTP',url:'http://router.test/api',secretRef:'ROUTER_TOKEN'},skills:[],sources:[],destinations:[],references:[],pages:[],media:[]})));
  await page.reload();
  await page.locator('#steps button[data-step="4"]').click();
  await expect(page.locator('#remote-control-v1')).toBeVisible();

  await page.locator('#remote-get-status').click();
  await expect(page.locator('#remote-status')).toHaveAttribute('data-remote-health','healthy');
  await page.screenshot({path:`${shotDir}/01-live-healthy.png`,fullPage:true});

  mode='degraded';
  await page.locator('#remote-get-status').click();
  await expect(page.locator('#remote-status')).toHaveAttribute('data-remote-state','DEGRADED');
  await page.screenshot({path:`${shotDir}/02-live-degraded.png`,fullPage:true});

  mode='error';
  await page.locator('#remote-get-status').click();
  await expect(page.locator('#remote-status')).toHaveAttribute('data-remote-state','HTTP_503');
  await page.screenshot({path:`${shotDir}/03-live-error.png`,fullPage:true});

  await page.locator('#remote-reconnect').click();
  await expect(page.locator('#remote-status')).toContainText('REMOTE_RECONNECT=OK');
  await page.screenshot({path:`${shotDir}/04-live-reconnect.png`,fullPage:true});
});
