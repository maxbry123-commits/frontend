import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';

const shotDir='test-results/f-ui-061';
test.beforeAll(async()=>{await fs.mkdir(shotDir,{recursive:true});});

test('F-UI-061 create→compose→edit→save→reload→export→remote from UI only',async({page},testInfo)=>{
  const started=Date.now();let actions=0;const consoleErrors=[];const networkErrors=[];
  page.on('console',msg=>{if(msg.type()==='error')consoleErrors.push(msg.text())});
  page.on('requestfailed',req=>networkErrors.push(`${req.method()} ${req.url()} ${req.failure()?.errorText||''}`));
  await page.route('https://router.test/api',async route=>{
    const body=JSON.parse(route.request().postData()||'{}');
    expect(body.contract).toBe('tel.workflow/v3');
    expect(body.action.type).toBe('RUN_TASK');
    expect(body.action.payload.remote.secret_ref).toBe('ROUTER_TOKEN');
    expect(JSON.stringify(body)).not.toContain('raw-secret');
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({type:'TASK_EVENT',task_id:body.action.task_id,action_type:'RUN_TASK',status:'accepted',payload:{trace_id:'f-ui-061-live'}})});
  });

  await page.goto('/index-v19.html');
  await expect(page.getByText('YAIWES UI Factory')).toBeVisible();

  // Create and compose only through visible UI.
  await page.locator('[data-kind="window"]').click();actions++;
  await expect(page.locator('[data-node]')).toHaveCount(1);
  await page.locator('#steps button[data-step="2"]').click();actions++;
  await page.locator('#duplicate-selected').click();actions++;
  await expect(page.locator('[data-node]')).toHaveCount(2);
  await page.screenshot({path:`${shotDir}/${testInfo.project.name}-01-compose.png`,fullPage:true});

  // Edit selected component through property UI and save a version.
  await page.locator('#prop-label').fill('Journey Card');actions++;
  await page.locator('#prop-label').press('Tab');actions++;
  await expect(page.locator('[data-node].selected strong')).toHaveText('Journey Card');
  await page.locator('#save-version').click();actions++;
  await expect(page.locator('#status')).toContainText('V1');
  await page.screenshot({path:`${shotDir}/${testInfo.project.name}-02-edited-saved.png`,fullPage:true});

  // Reload/reopen without internal state injection.
  await page.reload();actions++;
  await expect(page.locator('[data-node]')).toHaveCount(2);
  await expect(page.getByText('Journey Card',{exact:true})).toBeVisible();
  await expect(page.locator('#status')).toContainText('V1');
  await page.screenshot({path:`${shotDir}/${testInfo.project.name}-03-reloaded.png`,fullPage:true});

  // Export JSON and HTML via UI and validate roundtrip output.
  await page.locator('#steps button[data-step="5"]').click();actions++;
  const jsonDownloadPromise=page.waitForEvent('download');await page.locator('#export-json').click();actions++;
  const jsonDownload=await jsonDownloadPromise;const jsonPath=await jsonDownload.path();const exported=JSON.parse(await fs.readFile(jsonPath,'utf8'));
  expect(exported.state.version).toBe(1);expect(exported.state.components.some(x=>x.label==='Journey Card')).toBeTruthy();
  const htmlDownloadPromise=page.waitForEvent('download');await page.locator('#export-html').click();actions++;
  const htmlDownload=await htmlDownloadPromise;const htmlPath=await htmlDownload.path();const exportedHtml=await fs.readFile(htmlPath,'utf8');expect(exportedHtml).toContain('Journey Card');
  await page.screenshot({path:`${shotDir}/${testInfo.project.name}-04-export.png`,fullPage:true});

  // Configure and use remote integration strictly through the UI.
  await page.locator('#steps button[data-step="4"]').click();actions++;
  await page.locator('#remote-protocol').selectOption('HTTP');actions++;
  await page.locator('#remote-url').fill('https://router.test/api');actions++;
  await page.locator('#remote-secret-ref').fill('ROUTER_TOKEN');actions++;
  await page.locator('#save-remote').click();actions++;
  await expect(page.locator('#remote-status')).toContainText('REMOTE_CONFIG=SAVED');
  await page.locator('#model-name').fill('Journey Model');actions++;
  await page.locator('#model-endpoint').fill('https://router.test/model');actions++;
  await page.locator('#model-secret-ref').fill('MODEL_TOKEN');actions++;
  await page.locator('#add-model').click();actions++;
  await page.locator('#ai-goal').fill('Validate final user journey');actions++;
  await page.locator('#send-ai-job').click();actions++;
  await expect(page.locator('#delta-preview')).toContainText('"router_status": "ACCEPTED"');
  await expect(page.locator('#delta-preview')).toContainText('f-ui-061-live');
  await page.screenshot({path:`${shotDir}/${testInfo.project.name}-05-remote.png`,fullPage:true});

  const metrics={project:testInfo.project.name,duration_ms:Date.now()-started,actions,components:2,version:1,console_errors:consoleErrors,network_errors:networkErrors};
  await testInfo.attach('journey-metrics',{body:Buffer.from(JSON.stringify(metrics,null,2)),contentType:'application/json'});
  expect(consoleErrors).toEqual([]);expect(networkErrors).toEqual([]);expect(actions).toBeLessThanOrEqual(24);
});
