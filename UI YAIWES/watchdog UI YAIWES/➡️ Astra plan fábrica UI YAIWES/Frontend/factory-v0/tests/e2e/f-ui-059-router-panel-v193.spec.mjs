import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';

const shotDir='test-results/f-ui-059-v193';
test.beforeAll(async()=>{await fs.mkdir(shotDir,{recursive:true});});

test('F-UI-059 V1.9.3 router panel exposes healthy/degraded/error/reconnect readback',async({page})=>{
  let statusMode='healthy';
  await page.route('http://router.test/api/**',async route=>{
    const url=new URL(route.request().url());
    if(url.pathname.endsWith('/connect'))return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({health:'healthy',models:['m1','m2'],active_route:'m2'})});
    if(url.pathname.endsWith('/status')){
      if(statusMode==='http-error')return route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({health:'error',models:[],active_route:null})});
      return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(statusMode==='degraded'?{health:'degraded',models:['fallback'],active_route:'fallback'}:{health:'healthy',models:['m1','m2'],active_route:'m2'})});
    }
    return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({health:'healthy'})});
  });
  await page.goto('/index-v193.html');
  await page.evaluate(()=>localStorage.setItem('yaiwes-factory-config-v13',JSON.stringify({models:[{name:'m1',role:'coder',endpoint:'http://router.test/model',secretRef:'MODEL_TOKEN'}],teamMode:'single',remote:{protocol:'HTTP',url:'http://router.test/api',secretRef:'ROUTER_TOKEN'},skills:[],sources:[],destinations:[],references:[],pages:[],media:[]})));
  await page.reload();
  await page.waitForFunction(()=>globalThis.__YAIWES_FACTORY_CANDIDATE_V193__?.version==='1.9.3');
  await page.locator('#steps button[data-step="4"]').click();
  await expect(page.locator('#remote-control-v1')).toBeVisible();
  await page.locator('#remote-get-status').click();
  await expect(page.locator('#remote-status')).toHaveAttribute('data-remote-health','healthy');
  await expect(page.locator('#remote-status')).toHaveAttribute('data-remote-route','m2');
  await expect(page.locator('#remote-status')).toHaveAttribute('data-remote-models','m1,m2');
  await page.screenshot({path:`${shotDir}/01-healthy.png`,fullPage:true});
  statusMode='degraded';
  await page.locator('#remote-get-status').click();
  await expect(page.locator('#remote-status')).toHaveAttribute('data-remote-state','DEGRADED');
  statusMode='http-error';
  await page.locator('#remote-get-status').click();
  await expect(page.locator('#remote-status')).toHaveAttribute('data-remote-state','HTTP_503');
  await page.locator('#remote-reconnect').click();
  await expect(page.locator('#remote-status')).toHaveAttribute('data-remote-health','healthy');
  const last=await page.evaluate(()=>window.__YAIWES_REMOTE_LAST__);
  expect(last.action).toBe('reconnect');
  expect(last.readback.active_route).toBe('m2');
  expect(JSON.stringify(last)).not.toContain('ROUTER_TOKEN');
  await page.screenshot({path:`${shotDir}/04-reconnect.png`,fullPage:true});
});
