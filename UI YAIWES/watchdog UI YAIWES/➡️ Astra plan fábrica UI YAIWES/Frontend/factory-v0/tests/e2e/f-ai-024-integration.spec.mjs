import { test, expect } from '@playwright/test';

const PROJECT_KEY='yaiwes-factory-project-v19';
const CONFIG_KEY='yaiwes-factory-config-v13';

test('F-AI-024 source -> adapter -> router -> editable editor state on canonical v19', async ({ page }) => {
  const requests=[];
  await page.route('https://router.example/api', async route => {
    const body = route.request().postDataJSON();
    requests.push(body);
    await route.fulfill({
      status:200,
      contentType:'application/json',
      body:JSON.stringify({type:'TASK_EVENT',task_id:'f-ai-024',status:'completed',payload:{message:'router-ok',suggestedLabel:'Referencia IA'}})
    });
  });

  await page.goto('/index-v19.html', { waitUntil:'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil:'domcontentloaded' });

  await page.locator('[data-step="3"]').click();
  const referenceUrl='https://example.com/reference';
  await page.locator('#reference-url').fill(referenceUrl);
  await page.locator('#add-reference').click();
  await expect(page.locator('[data-node]')).toHaveCount(1);
  const imported=await page.evaluate(() => window.__YAIWES_REFERENCE_IMPORT_V1__ || null);
  expect(imported?.imported).toBe(1);
  expect(imported?.referenceUrl).toBe(referenceUrl);

  await page.locator('[data-step="4"]').click();
  await page.locator('#model-name').fill('Model A');
  await page.locator('#model-endpoint').fill('https://router.example/api');
  await page.locator('#model-role').selectOption('designer');
  await page.locator('#add-model').click();
  await page.locator('#remote-protocol').selectOption('HTTP');
  await page.locator('#remote-url').fill('https://router.example/api');
  await page.locator('#save-remote').click();
  await page.locator('#ai-goal').fill('Mejora la referencia importada y mantenla editable');
  await page.locator('#send-ai-job').click();
  await expect(page.locator('#delta-preview')).toContainText('ACCEPTED');
  await expect(page.locator('#delta-preview')).toContainText('router-ok');
  expect(requests).toHaveLength(1);
  expect(requests[0]?.contract).toBe('tel.workflow/v3');
  expect(requests[0]?.action?.type).toBe('RUN_TASK');
  expect(requests[0]?.action?.payload?.goal).toContain('Mejora la referencia');
  expect(requests[0]?.action?.payload?.models?.[0]?.name).toBe('Model A');

  await page.locator('[data-step="2"]').click();
  await expect(page.locator('#prop-label')).toBeVisible();
  await page.locator('#prop-label').fill('Referencia IA editable');
  await page.locator('#prop-label').blur();
  await expect(page.locator('[data-node].selected strong')).toHaveText('Referencia IA editable');

  const stored=await page.evaluate(key => JSON.parse(localStorage.getItem(key) || 'null'), PROJECT_KEY);
  expect(stored?.state?.components?.length).toBe(1);
  expect(stored.state.components[0].label).toBe('Referencia IA editable');
  const config=await page.evaluate(key => JSON.parse(localStorage.getItem(key) || 'null'), CONFIG_KEY);
  expect(config?.remote?.url).toBe('https://router.example/api');
  expect(config?.models?.[0]?.name).toBe('Model A');

  await page.reload({ waitUntil:'domcontentloaded' });
  await expect(page.locator('[data-node]')).toHaveCount(1);
  await expect(page.locator('[data-node].selected strong')).toHaveText('Referencia IA editable');
});
