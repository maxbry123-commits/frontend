import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';

const live=(process.env.FACTORY_LIVE_URL||'').replace(/\/$/,'');
const expectedSha=process.env.FACTORY_EXPECTED_SHA||'';
const shotDir='test-results/f-ui-061-live';
test.beforeAll(async()=>{if(!live)throw new Error('FACTORY_LIVE_URL required');await fs.mkdir(shotDir,{recursive:true});});

test('published exact candidate completes full UI journey',async({page,request},testInfo)=>{
  const started=Date.now();let actions=0;const consoleErrors=[];const networkErrors=[];
  page.on('console',msg=>{if(msg.type()==='error')consoleErrors.push(msg.text())});
  page.on('requestfailed',req=>networkErrors.push(`${req.method()} ${req.url()} ${req.failure()?.errorText||''}`));
  const sha=await request.get(`${live}/source-sha.txt`);expect(sha.ok()).toBeTruthy();expect((await sha.text()).trim()).toBe(expectedSha);
  await page.route('https://router.test/api',async route=>{const body=JSON.parse(route.request().postData()||'{}');expect(body.contract).toBe('tel.workflow/v3');expect(body.action.type).toBe('RUN_TASK');expect(body.action.payload.remote.secret_ref).toBe('ROUTER_TOKEN');return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({type:'TASK_EVENT',task_id:body.action.task_id,action_type:'RUN_TASK',status:'accepted',payload:{trace_id:'f-ui-061-live-web'}})});});

  await page.goto(`${live}/`);await expect(page.getByText('YAIWES UI Factory')).toBeVisible();
  await page.locator('[data-kind="window"]').click();actions++;await expect(page.locator('[data-node]')).toHaveCount(1);
  await page.locator('#steps button[data-step="2"]').click();actions++;await page.locator('#duplicate-selected').click();actions++;await expect(page.locator('[data-node]')).toHaveCount(2);
  await page.screenshot({path:`${shotDir}/${testInfo.project.name}-01-compose.png`,fullPage:true});
  await page.locator('#prop-label').fill('Journey Card');actions++;await page.locator('#prop-label').press('Tab');actions++;await expect(page.locator('[data-node].selected strong')).toHaveText('Journey Card');
  await page.locator('#save-version').click();actions++;await expect(page.locator('#status')).toContainText('V1');await page.screenshot({path:`${shotDir}/${testInfo.project.name}-02-save.png`,fullPage:true});
  await page.reload();actions++;await expect(page.locator('[data-node]')).toHaveCount(2);await expect(page.getByText('Journey Card',{exact:true})).toBeVisible();await expect(page.locator('#status')).toContainText('V1');
  await page.screenshot({path:`${shotDir}/${testInfo.project.name}-03-reload.png`,fullPage:true});
  await page.locator('#steps button[data-step="5"]').click();actions++;
  const jsonPromise=page.waitForEvent('download');await page.locator('#export-json').click();actions++;const jd=await jsonPromise;const jp=await jd.path();const exported=JSON.parse(await fs.readFile(jp,'utf8'));expect(exported.state.version).toBe(1);expect(exported.state.components.some(x=>x.label==='Journey Card')).toBeTruthy();
  const htmlPromise=page.waitForEvent('download');await page.locator('#export-html').click();actions++;const hd=await htmlPromise;const hp=await hd.path();expect(await fs.readFile(hp,'utf8')).toContain('Journey Card');
  await page.screenshot({path:`${shotDir}/${testInfo.project.name}-04-export.png`,fullPage:true});
  await page.locator('#steps button[data-step="4"]').click();actions++;await page.locator('#remote-protocol').selectOption('HTTP');actions++;await page.locator('#remote-url').fill('https://router.test/api');actions++;await page.locator('#remote-secret-ref').fill('ROUTER_TOKEN');actions++;await page.locator('#save-remote').click();actions++;await expect(page.locator('#remote-status')).toContainText('REMOTE_CONFIG=SAVED');
  await page.locator('#model-name').fill('Journey Model');actions++;await page.locator('#model-endpoint').fill('https://router.test/model');actions++;await page.locator('#model-secret-ref').fill('MODEL_TOKEN');actions++;await page.locator('#add-model').click();actions++;await page.locator('#ai-goal').fill('Validate final published user journey');actions++;await page.locator('#send-ai-job').click();actions++;
  await expect(page.locator('#delta-preview')).toContainText('"router_status": "ACCEPTED"');await expect(page.locator('#delta-preview')).toContainText('f-ui-061-live-web');await page.screenshot({path:`${shotDir}/${testInfo.project.name}-05-remote.png`,fullPage:true});
  const metrics={project:testInfo.project.name,duration_ms:Date.now()-started,actions,components:2,version:1,source_sha:expectedSha,console_errors:consoleErrors,network_errors:networkErrors};await testInfo.attach('journey-live-metrics',{body:Buffer.from(JSON.stringify(metrics,null,2)),contentType:'application/json'});
  expect(consoleErrors).toEqual([]);expect(networkErrors).toEqual([]);expect(actions).toBeLessThanOrEqual(24);
});
