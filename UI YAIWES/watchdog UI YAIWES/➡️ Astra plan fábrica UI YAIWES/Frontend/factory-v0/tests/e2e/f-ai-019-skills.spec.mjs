import { test, expect } from '@playwright/test';

const URL='/index-v192.html';
const CONFIG_KEY='yaiwes-factory-config-v13';

async function preview(page){
  return JSON.parse(await page.locator('#delta-preview').textContent());
}

test('F-AI-019 skill activation changes the AI job runtime payload', async ({page},testInfo)=>{
  test.skip(testInfo.project.name!=='chromium-desktop','desktop skill activation gate');
  await page.goto(URL,{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>localStorage.clear());
  await page.reload({waitUntil:'domcontentloaded'});

  await page.locator('[data-step="3"]').click();
  await page.locator('#skill-name').fill('VisualAudit');
  await page.locator('#skill-source').fill('https://example.invalid/skills/visual-audit');
  await page.locator('#skill-purpose').selectOption('principal');
  await page.locator('#add-skill').click();

  const activate=page.locator('[data-skill-activate="0"]');
  await expect(activate).toBeVisible();
  await expect(activate).toHaveText('Inactivo');
  await activate.click();
  await expect(activate).toHaveText('Activo');
  await expect(activate).toHaveAttribute('aria-pressed','true');

  const storedActive=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)||'{}'),CONFIG_KEY);
  expect(storedActive.skills[0]).toMatchObject({name:'VisualAudit',purpose:'principal',active:true});

  await page.locator('[data-step="4"]').click();
  await page.locator('#ai-goal').fill('Audita el diseño');
  await page.locator('#send-ai-job').click();
  await expect.poll(async()=>((await preview(page)).activeSkills||[]).length).toBe(1);
  const activePayload=await preview(page);
  expect(activePayload.activeSkills).toEqual([{name:'VisualAudit',source:'https://example.invalid/skills/visual-audit',purpose:'principal'}]);

  await page.locator('[data-step="3"]').click();
  const deactivate=page.locator('[data-skill-activate="0"]');
  await expect(deactivate).toHaveText('Activo');
  await deactivate.click();
  await expect(deactivate).toHaveText('Inactivo');

  await page.locator('[data-step="4"]').click();
  await page.locator('#ai-goal').fill('Audita sin skills activos');
  await page.locator('#send-ai-job').click();
  await expect.poll(async()=>((await preview(page)).activeSkills||[]).length).toBe(0);
  const inactivePayload=await preview(page);
  expect(inactivePayload.activeSkills).toEqual([]);

  console.log(`F_AI_019_SKILL_PASS=${JSON.stringify({active:activePayload.activeSkills,inactive:inactivePayload.activeSkills})}`);
});
