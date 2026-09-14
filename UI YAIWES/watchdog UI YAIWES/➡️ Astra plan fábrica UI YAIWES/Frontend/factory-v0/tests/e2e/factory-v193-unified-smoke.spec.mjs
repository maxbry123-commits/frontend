import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';

const shots='test-results/factory-v193-unified';

test.beforeAll(async()=>{await fs.mkdir(shots,{recursive:true});});

test.beforeEach(async({page})=>{
  await page.addInitScript(()=>{localStorage.clear();sessionStorage.clear();});
});

test('V1.9.3 loads converged modules and key effects',async({page},testInfo)=>{
  const consoleErrors=[];
  const requestFailures=[];
  page.on('console',msg=>{if(msg.type()==='error')consoleErrors.push(msg.text());});
  page.on('requestfailed',req=>requestFailures.push(`${req.method()} ${req.url()} ${req.failure()?.errorText||''}`));

  await page.goto('/index-v193.html');
  await expect(page).toHaveTitle(/V1\.9\.3/);
  await page.waitForFunction(()=>globalThis.__YAIWES_FACTORY_CANDIDATE_V193__?.version==='1.9.3');

  const boot=await page.evaluate(()=>({
    candidate:globalThis.__YAIWES_FACTORY_CANDIDATE_V193__,
    bootError:globalThis.__YAIWES_FACTORY_CANDIDATE_V193_ERROR__||null,
    touch:globalThis.__YAIWES_TOUCH_DND_V192__?.version||null,
    remote:Boolean(globalThis.__YAIWES_REMOTE_CONTROL_V1__),
    hf:Boolean(globalThis.__YAIWES_HF_JOBS_V1__),
    destination:Boolean(globalThis.__YAIWES_DESTINATION_ROUNDTRIP_V1__),
    skills:Boolean(globalThis.__YAIWES_SKILL_ACTIVATION_V1__),
    layerApi:Boolean(globalThis.__YAIWES_LAYER_REORDER_API_V1__),
    runtime:Boolean(globalThis.__YAIWES_FACTORY_V19__),
    workspace:document.querySelector('.app-shell')?.dataset.workspaceShell||null,
    componentBrowser:document.documentElement.dataset.componentBrowser||null
  }));
  expect(boot.bootError).toBeNull();
  expect(boot.candidate.modules.length).toBeGreaterThanOrEqual(16);
  expect(boot.touch).toBe('1.9.2');
  expect(boot.remote).toBeTruthy();
  expect(boot.hf).toBeTruthy();
  expect(boot.destination).toBeTruthy();
  expect(boot.skills).toBeTruthy();
  expect(boot.layerApi).toBeTruthy();
  expect(boot.runtime).toBeTruthy();
  expect(boot.workspace).toBe('v1');
  expect(boot.componentBrowser).toBe('v1');

  // Mobile starts with drawers collapsed. Open the library when required.
  const library=page.locator('.library-pane');
  if(await library.getAttribute('aria-hidden')==='true'){
    await page.locator('[data-workspace-toggle="left"]').click();
  }
  await expect(page.locator('[data-component-search]')).toBeVisible();

  // Component Browser must select first, then use canonical insertion path.
  const windowCard=page.locator('.component-card[data-kind="window"]');
  await windowCard.click();
  await expect(page.locator('[data-component-preview]')).toBeVisible();
  await page.locator('[data-preview-insert]').click();
  await expect(page.locator('[data-node]')).toHaveCount(1);
  await page.locator('[data-preview-insert]').click();
  await expect(page.locator('[data-node]')).toHaveCount(2);
  await expect(page.locator('#layer-list [data-layer]')).toHaveCount(2);
  await expect(page.locator('[data-layer-reorder-controls]')).toHaveCount(2);

  // Versioning remains on the canonical state owner.
  await page.locator('#save-version').click();
  await expect(page.locator('#status')).toContainText('V1');

  // Skills adapter decorates actual saved skills.
  await page.locator('#steps [data-step="3"]').click();
  if(await page.locator('.context-pane').getAttribute('aria-hidden')==='true'){
    await page.locator('[data-workspace-toggle="right"]').click();
  }
  await page.locator('#skill-name').fill('V193 Smoke Skill');
  await page.locator('#skill-source').fill('local://smoke');
  await page.locator('#add-skill').click();
  await expect(page.locator('[data-skill-activate]')).toHaveCount(1);
  await page.locator('[data-skill-activate]').click();
  expect(await page.evaluate(()=>globalThis.__YAIWES_SKILL_ACTIVATION_LAST__?.active)).toBe(true);

  // Router/remote and HF panel must coexist in the same Step 4 DOM.
  await page.locator('#steps [data-step="4"]').click();
  await expect(page.locator('#remote-control-v1')).toBeAttached();
  await expect(page.locator('#hf-jobs-panel-v1')).toBeAttached();
  await page.locator('#ai-goal').fill('V193 smoke no remote configured');
  await page.locator('#send-ai-job').click();
  await expect(page.locator('#delta-preview')).toContainText('ROUTER_STATUS=BLOCKED_NO_REMOTE');

  // JSON/HTML/output/destination modules must decorate Step 5 without replacing core state.
  await page.locator('#steps [data-step="5"]').click();
  await expect(page.locator('#export-json')).toBeAttached();
  await expect(page.locator('#export-html')).toBeAttached();
  await expect(page.locator('#build-output-plan')).toBeAttached();
  await expect(page.locator('#deliver-output')).toBeAttached();

  const runtimeState=await page.evaluate(()=>({
    components:globalThis.__YAIWES_FACTORY_V19__?.getState?.().components?.length,
    version:globalThis.__YAIWES_FACTORY_V19__?.getState?.().version
  }));
  expect(runtimeState).toEqual({components:2,version:1});

  await page.screenshot({path:`${shots}/${testInfo.project.name}-unified.png`,fullPage:true});
  await testInfo.attach('v193-unified-evidence',{body:Buffer.from(JSON.stringify({project:testInfo.project.name,boot,runtimeState,consoleErrors,requestFailures},null,2)),contentType:'application/json'});

  expect(consoleErrors).toEqual([]);
  expect(requestFailures).toEqual([]);
});
