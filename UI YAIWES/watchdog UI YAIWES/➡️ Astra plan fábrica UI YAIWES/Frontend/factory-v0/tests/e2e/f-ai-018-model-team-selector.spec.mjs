import { test, expect } from '@playwright/test';

const URL='/index-v192.html';
const CONFIG_KEY='yaiwes-factory-config-v13';

test('F-AI-018 selected team mode and model roles drive generated AI job config', async ({page},testInfo)=>{
  test.skip(testInfo.project.name!=='chromium-desktop','desktop AI selector gate');
  await page.goto(URL,{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>localStorage.clear());
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('[data-step="4"]').click();

  await page.locator('#team-mode').selectOption('sequence');
  await page.locator('#model-name').fill('PlannerModel');
  await page.locator('#model-endpoint').fill('https://router.example/planner');
  await page.locator('#model-secret-ref').fill('secret://planner');
  await page.locator('#model-role').selectOption('planner');
  await page.locator('#add-model').click();

  const stored1=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)||'null'),CONFIG_KEY);
  expect(stored1?.teamMode).toBe('sequence');
  expect(stored1?.models?.[0]).toMatchObject({name:'PlannerModel',role:'planner',endpoint:'https://router.example/planner',secretRef:'secret://planner'});

  await page.locator('#model-name').fill('ReviewerModel');
  await page.locator('#model-endpoint').fill('https://router.example/reviewer');
  await page.locator('#model-secret-ref').fill('secret://reviewer');
  await page.locator('#model-role').selectOption('reviewer');
  await page.locator('#add-model').click();
  await page.locator('#ai-goal').fill('Construye una UI verificable');
  await page.locator('#send-ai-job').click();

  const payload1=JSON.parse(await page.locator('#delta-preview').textContent());
  expect(payload1).toMatchObject({teamMode:'sequence',status:'QUEUED_LOCAL_NO_REMOTE'});
  expect(payload1.models).toEqual([
    {name:'PlannerModel',role:'planner',secret_ref:'secret://planner'},
    {name:'ReviewerModel',role:'reviewer',secret_ref:'secret://reviewer'}
  ]);

  await page.locator('#team-mode').selectOption('quorum');
  await page.locator('#send-ai-job').click();
  const payload2=JSON.parse(await page.locator('#delta-preview').textContent());
  expect(payload2.teamMode).toBe('quorum');
  expect(payload2.models).toEqual(payload1.models);

  const stored2=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)||'null'),CONFIG_KEY);
  expect(stored2.teamMode).toBe('quorum');
  expect(stored2.models).toHaveLength(2);
  console.log(`F_AI_018_SELECTOR_PASS=${JSON.stringify({teamMode:payload2.teamMode,models:payload2.models.map(x=>({name:x.name,role:x.role}))})}`);
});
