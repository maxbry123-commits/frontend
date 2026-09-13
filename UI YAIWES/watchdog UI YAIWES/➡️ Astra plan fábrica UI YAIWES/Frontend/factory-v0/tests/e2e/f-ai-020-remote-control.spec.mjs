import { test, expect } from '@playwright/test';

test('F-AI-020 MCP_HTTP connect status cancel uses secret_ref only',async({page})=>{
  const requests=[];
  await page.route('https://remote.test/api/**',async route=>{
    const req=route.request();
    const url=new URL(req.url());
    const action=url.pathname.split('/').at(-1);
    let body=null;try{body=req.postDataJSON()}catch{}
    requests.push({action,method:req.method(),body});
    const payload=action==='status'?{state:'connected',jobs:1}:{state:action==='connect'?'connected':'cancelled'};
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(payload)});
  });

  await page.goto('/index-v192.html',{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>localStorage.clear());
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('[data-step="4"]').click();
  await page.locator('#remote-protocol').selectOption('MCP_HTTP');
  await page.locator('#remote-secret-ref').fill('secret://router-test');
  await page.locator('#remote-url').fill('https://remote.test/api');
  await page.locator('#save-remote').click();

  await expect(page.locator('#remote-connect')).toBeVisible();
  await expect(page.locator('#remote-get-status')).toBeVisible();
  await expect(page.locator('#remote-cancel')).toBeVisible();

  await page.locator('#remote-connect').click();
  await expect(page.locator('#remote-status')).toContainText('REMOTE_CONNECT=OK');
  await page.locator('#remote-get-status').click();
  await expect(page.locator('#remote-status')).toContainText('REMOTE_STATUS=OK');
  await page.locator('#remote-cancel').click();
  await expect(page.locator('#remote-status')).toContainText('REMOTE_CANCEL=OK');

  expect(requests.map(x=>[x.action,x.method])).toEqual([['connect','POST'],['status','GET'],['cancel','POST']]);
  expect(requests[0].body).toEqual({protocol:'MCP_HTTP',secret_ref:'secret://router-test',action:'connect'});
  expect(requests[1].body).toBeNull();
  expect(requests[2].body).toEqual({protocol:'MCP_HTTP',secret_ref:'secret://router-test',action:'cancel'});
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('yaiwes-factory-config-v13')||'{}').remote);
  expect(saved).toEqual({protocol:'MCP_HTTP',url:'https://remote.test/api',secretRef:'secret://router-test'});
  const events=await page.evaluate(()=>window.__YAIWES_REMOTE_CONTROL_V1__.getEvents());
  expect(events).toHaveLength(3);
  expect(events.every(e=>e.ok&&e.status===200)).toBe(true);
  console.log('F_AI_020_REMOTE_CONTROL=PASS');
});
