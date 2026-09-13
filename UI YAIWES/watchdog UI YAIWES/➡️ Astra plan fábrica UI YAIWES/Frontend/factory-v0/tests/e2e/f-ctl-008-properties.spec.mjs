import { test, expect } from '@playwright/test';

const URL='/index-v192.html';
const PROJECT_KEY='yaiwes-factory-project-v19';

test('F-CTL-008 edits label width height and persists exact state', async ({page},testInfo)=>{
  test.skip(testInfo.project.name!=='chromium-desktop','desktop property gate');
  await page.goto(URL,{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>localStorage.clear());
  await page.reload({waitUntil:'domcontentloaded'});

  await page.locator('[data-kind="window"]').click();
  await expect(page.locator('[data-node]')).toHaveCount(1);
  const node=page.locator('[data-node]').first();
  const id=await node.getAttribute('data-node');

  const label=page.locator('#prop-label');
  const width=page.locator('#prop-w');
  const height=page.locator('#prop-h');
  await expect(label).toBeVisible();

  await label.fill('Panel verificado');
  await label.blur();
  await width.fill('333');
  await width.blur();
  await height.fill('177');
  await height.blur();

  await expect(node.locator('strong')).toHaveText('Panel verificado');
  await expect(node).toHaveCSS('width','333px');
  await expect(node).toHaveCSS('height','177px');

  const stored=await page.evaluate(({key,id})=>{
    const raw=JSON.parse(localStorage.getItem(key)||'null');
    return raw?.state?.components?.find(x=>x.id===id)||null;
  },{key:PROJECT_KEY,id});
  expect(stored).toMatchObject({id,label:'Panel verificado',w:333,h:177});

  await page.reload({waitUntil:'domcontentloaded'});
  const restored=page.locator(`[data-node="${id}"]`);
  await expect(restored.locator('strong')).toHaveText('Panel verificado');
  await expect(restored).toHaveCSS('width','333px');
  await expect(restored).toHaveCSS('height','177px');
  console.log(`F_CTL_008_PROPERTIES_PASS=${JSON.stringify({id,label:stored.label,w:stored.w,h:stored.h})}`);
});
