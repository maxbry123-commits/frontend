import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';

const shotDir='test-results/f-ui-060-v193';
test.beforeAll(async()=>{await fs.mkdir(shotDir,{recursive:true});});

test('F-UI-060 V1.9.3 HF Jobs sync run/status/logs/complete/cancel without secrets',async({page})=>{
  const jobs=new Map(); let seq=0;
  await page.route('https://hf-jobs-proxy.test/**',async route=>{
    const req=route.request(),url=new URL(req.url()),path=url.pathname,method=req.method();
    const body=method==='POST'&&req.postData()?JSON.parse(req.postData()):{};
    expect(JSON.stringify(body)).not.toContain('raw-secret');
    if(path.endsWith('/run')){const id=`job-${++seq}`;jobs.set(id,{stage:'RUNNING',logs:'boot'});return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({job_id:id,stage:'RUNNING',token:'server-secret'})});}
    const match=path.match(/\/jobs\/([^/]+)(?:\/(logs|cancel))?$/); if(!match)return route.fulfill({status:404,body:'{}'});
    const id=decodeURIComponent(match[1]),action=match[2],state=jobs.get(id)||{stage:'UNKNOWN',logs:''};
    if(action==='logs')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({job_id:id,stage:state.stage,logs:state.logs,authorization:'Bearer hidden'})});
    if(action==='cancel'){state.stage='CANCELED';jobs.set(id,state);return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({job_id:id,stage:'CANCELED'})});}
    state.stage='COMPLETED';state.logs='boot\ndone';jobs.set(id,state);return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({job_id:id,stage:'COMPLETED'})});
  });
  await page.goto('/index-v193.html');
  await page.evaluate(()=>localStorage.setItem('yaiwes-factory-config-v13',JSON.stringify({models:[],teamMode:'single',remote:null,skills:[],sources:[],destinations:[],references:[],pages:[],media:[],hfJobs:{url:'https://hf-jobs-proxy.test/api',secretRef:'HF_JOBS_TOKEN'}})));
  await page.reload();
  await page.waitForFunction(()=>globalThis.__YAIWES_FACTORY_CANDIDATE_V193__?.version==='1.9.3');
  await page.locator('#steps button[data-step="4"]').click();
  await expect(page.locator('#hf-jobs-panel-v1')).toBeVisible();
  await page.locator('#hf-job-command').fill('python -c "print(1)"');
  await page.locator('#hf-job-run').click();
  await expect(page.locator('#hf-job-status')).toHaveAttribute('data-hf-stage','RUNNING');
  expect(await page.locator('#hf-job-status').getAttribute('data-hf-job-id')).toBe('job-1');
  await page.locator('#hf-job-logs-btn').click();
  await expect(page.locator('#hf-job-logs')).toContainText('boot');
  await expect(page.locator('#hf-job-logs')).not.toContainText('Bearer hidden');
  await page.locator('#hf-job-status-btn').click();
  await expect(page.locator('#hf-job-status')).toHaveAttribute('data-hf-stage','COMPLETED');
  await page.locator('#hf-job-cancel').click();
  await expect(page.locator('#hf-job-status')).toContainText('CANCEL_IDEMPOTENT_TERMINAL');
  await page.locator('#hf-job-run').click();
  await expect(page.locator('#hf-job-status')).toHaveAttribute('data-hf-stage','RUNNING');
  await page.locator('#hf-job-cancel').click();
  await expect(page.locator('#hf-job-status')).toHaveAttribute('data-hf-stage','CANCELED');
  const browserState=await page.evaluate(()=>({last:window.__YAIWES_HF_JOB_LAST__,config:localStorage.getItem('yaiwes-factory-config-v13'),session:localStorage.getItem('yaiwes-hf-job-v1')}));
  expect(browserState.config).not.toContain('raw-secret');
  expect(browserState.session).not.toContain('server-secret');
  expect(JSON.stringify(browserState.last)).not.toContain('server-secret');
  await page.screenshot({path:`${shotDir}/complete-cancel.png`,fullPage:true});
});
