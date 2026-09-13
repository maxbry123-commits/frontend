import { test, expect } from '@playwright/test';

const URL='/index-v192.html';
const VERSIONS_KEY='yaiwes-factory-versions-v1';

test.describe('F-CTL-011 project versions and rollback',()=>{
  test('save snapshot, mutate, restore and reload without loss',async({page},testInfo)=>{
    test.skip(testInfo.project.name!=='chromium-desktop','desktop rollback contract');
    await page.goto(URL,{waitUntil:'domcontentloaded'});
    await page.evaluate(()=>localStorage.clear());
    await page.reload({waitUntil:'domcontentloaded'});

    const storeLoaded=await page.evaluate(()=>Boolean(window.__YAIWES_VERSION_STORE_V1__));
    expect(storeLoaded,'VERSION_STORE_NOT_WIRED').toBe(true);

    await page.locator('[data-kind="window"]').click();
    const node=page.locator('[data-node]').first();
    await expect(node).toHaveCount(1);
    const original=await node.evaluate(el=>({id:el.dataset.node,label:el.querySelector('strong')?.textContent,left:el.style.left,top:el.style.top,width:el.style.width,height:el.style.height}));

    await page.locator('#save-version').click();
    await expect(page.locator('#status')).toContainText('V1');
    await expect(page.locator('#restore-version')).toBeVisible();
    await expect(page.locator('#restore-version')).toHaveText('Restaurar V1');
    await expect.poll(()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)||'[]').length,VERSIONS_KEY)).toBe(1);

    const input=page.locator('#prop-label');
    await input.fill('MUTATED AFTER SNAPSHOT');
    await input.press('Tab');
    await expect(node.locator('strong')).toHaveText('MUTATED AFTER SNAPSHOT');

    await page.locator('#restore-version').click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('[data-node]')).toHaveCount(1);
    const restored=await page.locator('[data-node]').first().evaluate(el=>({id:el.dataset.node,label:el.querySelector('strong')?.textContent,left:el.style.left,top:el.style.top,width:el.style.width,height:el.style.height}));
    expect(restored).toEqual(original);
    await expect(page.locator('#status')).toContainText('V1');

    const snapshots=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)||'[]'),VERSIONS_KEY);
    expect(snapshots).toHaveLength(1);
    expect(snapshots[0]?.version).toBe(1);
  });
});
