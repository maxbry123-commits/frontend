import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const PROJECT_KEY='yaiwes-factory-project-v19';
const CONFIG_KEY='yaiwes-factory-config-v13';

test('F-IO-030 configured DOWNLOAD destination exports, reads back and reopens without loss', async ({page})=>{
  await page.goto('/index-v192.html',{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>localStorage.clear());
  await page.reload({waitUntil:'domcontentloaded'});

  await page.locator('[data-kind="button"]').click();
  await page.locator('[data-kind="panel"]').click();
  await expect(page.locator('[data-node]')).toHaveCount(2);
  await page.locator('.canvas-controls button[data-breakpoint="tablet"]').click();
  await page.locator('#zoom-in').click();
  const before=await page.evaluate(()=>({state:window.__YAIWES_FACTORY_V19__.getState(),view:window.__YAIWES_FACTORY_V19__.getView()}));

  await page.locator('[data-step="5"]').click();
  await page.locator('#destination-type').selectOption('DOWNLOAD');
  await page.locator('#destination-path').fill('exports/final');
  await page.locator('#add-destination').click();
  await expect(page.locator('#deliver-output')).toBeVisible();

  const downloadPromise=page.waitForEvent('download');
  await page.locator('#deliver-output').click();
  const download=await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^yaiwes-ui-v\d+-delivery\.json$/);
  const filePath=await download.path();
  expect(filePath).toBeTruthy();
  const text=await readFile(filePath,'utf8');
  const payload=JSON.parse(text);
  expect(payload.schema).toBe('yaiwes.factory.delivery/v1');
  expect(payload.delivery.type).toBe('DOWNLOAD');
  expect(payload.delivery.path).toBe('exports/final');
  expect(payload.state.components).toEqual(before.state.components);
  expect(payload.zoom).toBe(before.view.zoom);
  expect(payload.breakpoint).toBe(before.view.breakpoint);
  expect(payload.config.destinations.some(d=>d.type==='DOWNLOAD'&&d.path==='exports/final')).toBe(true);
  const deliveryReadback=await page.evaluate(()=>JSON.parse(localStorage.getItem('yaiwes-factory-last-delivery-v1')||'null'));
  expect(deliveryReadback.delivery.path).toBe('exports/final');
  expect(deliveryReadback.bytes).toBeGreaterThan(0);

  await page.evaluate(({projectKey,configKey,text})=>{
    localStorage.removeItem(projectKey);
    localStorage.removeItem(configKey);
    window.__YAIWES_JSON_ROUNDTRIP_V1__.restoreFactoryExport(text);
  },{projectKey:PROJECT_KEY,configKey:CONFIG_KEY,text});
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.locator('[data-node]')).toHaveCount(2);
  const after=await page.evaluate(()=>({state:window.__YAIWES_FACTORY_V19__.getState(),view:window.__YAIWES_FACTORY_V19__.getView(),config:JSON.parse(localStorage.getItem('yaiwes-factory-config-v13')||'{}')}));
  expect(after.state).toEqual(payload.state);
  expect(after.view).toEqual({zoom:payload.zoom,breakpoint:payload.breakpoint});
  expect(after.state.components).toEqual(before.state.components);
  expect(after.config).toEqual(payload.config);
  console.log('F_IO_030_DOWNLOAD_ROUNDTRIP=PASS');
});
