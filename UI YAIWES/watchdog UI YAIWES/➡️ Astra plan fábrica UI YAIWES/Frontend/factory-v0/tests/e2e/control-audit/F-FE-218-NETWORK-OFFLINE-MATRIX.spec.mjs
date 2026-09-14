import { test, expect } from '@playwright/test';

const URL='/index-v192.html';
const KEYS=['yaiwes-factory-config-v13','yaiwes-factory-project-v19','yaiwes-factory-versions-v1'];

async function boot(page){
  await page.goto(URL,{waitUntil:'domcontentloaded'});
  await page.evaluate(keys=>keys.forEach(k=>localStorage.removeItem(k)),KEYS);
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.locator('#canvas')).toBeVisible();
  await page.waitForFunction(()=>Boolean(globalThis.__YAIWES_FACTORY_V19__));
}
async function step(page,n){
  await page.locator(`[data-step="${n}"]`).click();
  await expect(page.locator(`[data-step="${n}"]`)).toHaveClass(/active/);
}

test('local create/edit/version remains usable after network goes offline',async({page,context})=>{
  await boot(page);
  await context.setOffline(true);
  await page.locator('#new-component').click();
  await expect(page.locator('[data-node]')).toHaveCount(1);
  await page.locator('#prop-label').fill('Offline panel');
  await page.locator('#prop-label').blur();
  await expect(page.locator('[data-node]')).toContainText('Offline panel');
  await page.locator('#save-version').click();
  await expect(page.locator('#restore-version')).toBeVisible();
  const stored=await page.evaluate(()=>({project:localStorage.getItem('yaiwes-factory-project-v19'),versions:localStorage.getItem('yaiwes-factory-versions-v1')}));
  expect(stored.project).toContain('Offline panel');
  expect(stored.versions).toContain('Offline panel');
});

test('JSON and HTML export are local downloads while offline',async({page,context})=>{
  await boot(page);
  await page.locator('#new-component').click();
  await context.setOffline(true);
  await step(page,5);
  const jsonDownload=page.waitForEvent('download');
  await page.locator('#export-json').click();
  const json=await jsonDownload;
  expect(json.suggestedFilename()).toMatch(/^yaiwes-ui-v\d+\.json$/);
  const htmlDownload=page.waitForEvent('download');
  await page.locator('#export-html').click();
  const html=await htmlDownload;
  expect(html.suggestedFilename()).toMatch(/^yaiwes-ui-v\d+\.html$/);
});

test('remote probe fails closed with explicit unreachable state while offline',async({page,context})=>{
  await boot(page);
  await step(page,4);
  await page.locator('#remote-url').fill('https://example.invalid/health');
  await page.locator('#remote-secret-ref').fill('secret://offline-test');
  await page.locator('#save-remote').click();
  await expect(page.locator('#remote-status')).toContainText('REMOTE_CONFIG=SAVED');
  await context.setOffline(true);
  await page.locator('#probe-remote').click();
  await expect(page.locator('#remote-status')).toContainText('REMOTE_PROBE=UNREACHABLE');
  await expect(page.locator('#remote-status')).not.toContainText('HTTP_2');
  expect(await page.locator('body').innerText()).not.toContain('secret://offline-test');
});

test('local AI proposal remains explicit and editable offline without claiming remote success',async({page,context})=>{
  await boot(page);
  await step(page,4);
  await context.setOffline(true);
  await page.locator('#ai-goal').fill('Crear panel offline');
  await page.locator('#propose-delta').click();
  await expect(page.locator('#delta-preview')).toContainText('Crear panel offline');
  await expect(page.locator('#delta-preview')).toContainText('ADD_COMPONENT');
  await page.locator('#send-ai-job').click();
  await expect(page.locator('#delta-preview')).toContainText('QUEUED_LOCAL_NO_REMOTE');
  await expect(page.locator('#delta-preview')).not.toContainText('READY_FOR_REMOTE');
});
