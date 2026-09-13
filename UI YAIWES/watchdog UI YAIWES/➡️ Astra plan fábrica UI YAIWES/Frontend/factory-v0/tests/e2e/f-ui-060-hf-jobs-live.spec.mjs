import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';

const live=(process.env.FACTORY_LIVE_URL||'').replace(/\/$/,'');
const expectedSha=process.env.FACTORY_EXPECTED_SHA||'';
const shotDir='test-results/f-ui-060-live';
test.beforeAll(async()=>{if(!live)throw new Error('FACTORY_LIVE_URL required');await fs.mkdir(shotDir,{recursive:true});});

test('published exact candidate syncs HF Jobs states without browser secrets',async({page,request})=>{
  const sha=await request.get(`${live}/source-sha.txt`);
  expect(sha.ok()).toBeTruthy();
  expect((await sha.text()).trim()).toBe(expectedSha);
  const jobs=new Map();let seq=0;
  await page.route('https://hf-jobs-proxy.test/**',async route=>{
    const req=route.request();const url=new URL(req.url());const body=req.method()==='POST'&&req.postData()?JSON.parse(req.postData()):{};
    expect(JSON.stringify(body)).not.toContain('raw-secret');
    if(url.pathname.endsWith('/run')){const id=`live-${++seq}`;jobs.set(id,{stage:'RUNNING',logs:'boot'});return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({job_id:id,stage:'RUNNING',token:'server-secret'})});}
    const m=url.pathname.match(/\/jobs\/([^/]+)(?:\/(logs|cancel))?$/);if(!m)return route.fulfill({status:404,body:'{}'});
    const id=decodeURIComponent(m[1]);const action=m[2];const state=jobs.get(id)||{stage:'UNKNOWN',logs:''};
    if(action==='logs')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({job_id:id,stage:state.stage,logs:state.logs,authorization:'Bearer hidden'})});
    if(action==='cancel'){state.stage='CANCELED';jobs.set(id,state);return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({job_id:id,stage:'CANCELED'})});}
    state.stage='COMPLETED';state.logs='boot\ndone';jobs.set(id,state);return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({job_id:id,stage:'COMPLETED'})});
  });
  await page.goto(`${live}/`);
  await page.evaluate(()=>localStorage.setItem('yaiwes-factory-config-v13',JSON.stringify({models:[],teamMode:'single',remote:null,skills:[],sources:[],destinations:[],references:[],pages:[],media:[],hfJobs:{url:'https://hf-jobs-proxy.test/api',secretRef:'HF_JOBS_TOKEN'}})));
  await page.reload();await page.locator('#steps button[data-step="4"]').click();
  await expect(page.locator('#hf-jobs-panel-v1')).toBeVisible();await page.locator('#hf-job-command').fill('python -c "print(1)"');
  await page.locator('#hf-job-run').click();await expect(page.locator('#hf-job-status')).toHaveAttribute('data-hf-stage','RUNNING');await page.screenshot({path:`${shotDir}/01-live-running.png`,fullPage:true});
  await page.locator('#hf-job-logs-btn').click();await expect(page.locator('#hf-job-logs')).toContainText('boot');await expect(page.locator('#hf-job-logs')).not.toContainText('Bearer hidden');
  await page.locator('#hf-job-status-btn').click();await expect(page.locator('#hf-job-status')).toHaveAttribute('data-hf-stage','COMPLETED');await page.screenshot({path:`${shotDir}/02-live-completed.png`,fullPage:true});
  await page.locator('#hf-job-cancel').click();await expect(page.locator('#hf-job-status')).toContainText('CANCEL_IDEMPOTENT_TERMINAL');
  await page.locator('#hf-job-run').click();await page.locator('#hf-job-cancel').click();await expect(page.locator('#hf-job-status')).toHaveAttribute('data-hf-stage','CANCELED');await page.screenshot({path:`${shotDir}/03-live-canceled.png`,fullPage:true});
  const state=await page.evaluate(()=>({last:window.__YAIWES_HF_JOB_LAST__,session:localStorage.getItem('yaiwes-hf-job-v1')}));
  expect(JSON.stringify(state)).not.toContain('server-secret');
});
