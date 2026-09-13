import { test, expect } from '@playwright/test';

const URL='/index-v192.html';
const PROJECT_KEY='yaiwes-factory-project-v19';

test('F-IO-025 local save/read is exact and F-IO-026 reload recovers it', async ({page})=>{
  await page.goto(URL,{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>localStorage.clear());
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.locator('[data-node]')).toHaveCount(0);

  await page.locator('[data-kind="button"]').click();
  await expect(page.locator('[data-node]')).toHaveCount(1);
  await page.locator('.canvas-controls button[data-breakpoint="tablet"]').click();
  await page.locator('#zoom-in').click();

  const runtime=await page.evaluate(()=>({
    state:window.__YAIWES_FACTORY_V19__.getState(),
    view:window.__YAIWES_FACTORY_V19__.getView(),
    stored:JSON.parse(localStorage.getItem('yaiwes-factory-project-v19')||'null')
  }));
  expect(runtime.stored).not.toBeNull();
  expect(runtime.stored.state.components).toEqual(runtime.state.components);
  expect(runtime.stored.state.selectedId).toBe(runtime.state.selectedId);
  expect(runtime.stored.breakpoint).toBe(runtime.view.breakpoint);
  expect(runtime.stored.zoom).toBe(runtime.view.zoom);
  expect(runtime.stored.state.components[0].kind).toBe('button');

  const exactBefore={state:runtime.state,view:runtime.view};
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.locator('[data-node]')).toHaveCount(1);
  await expect(page.locator('#canvas')).toHaveAttribute('data-breakpoint','tablet');
  const after=await page.evaluate(()=>({state:window.__YAIWES_FACTORY_V19__.getState(),view:window.__YAIWES_FACTORY_V19__.getView()}));
  expect(after).toEqual(exactBefore);
  const reread=await page.evaluate(()=>JSON.parse(localStorage.getItem('yaiwes-factory-project-v19')||'null'));
  expect(reread.state.components).toEqual(after.state.components);
  expect(reread.breakpoint).toBe('tablet');
  expect(reread.zoom).toBe(after.view.zoom);
  console.log('F_IO_025_SAVE_READ_EXACT=PASS F_IO_026_RELOAD_RECOVERY=PASS');
});
