import { test, expect } from '@playwright/test';

const URL = '/index-v192.html';

async function dispatchSyntheticTouch(page, sx, sy, ex, ey) {
  const session = await page.context().newCDPSession(page);
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: sx, y: sy, radiusX: 5, radiusY: 5, force: 1 }] });
  for (let i = 1; i <= 10; i += 1) {
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: Math.round(sx + ((ex - sx) * i) / 10), y: Math.round(sy + ((ey - sy) * i) / 10), radiusX: 5, radiusY: 5, force: 1 }]
    });
    await page.waitForTimeout(25);
  }
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
}

async function openTransform(page, useTap = false) {
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  const step = page.locator('[data-step="3"]');
  useTap ? await step.tap() : await step.click();
  await expect(page.locator('#context-scroll')).toHaveCount(1);
  await expect(page.locator('#context-scroll')).toBeVisible();
}

test('F-ED-006 desktop has one scroll owner and mouse wheel changes it', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop mouse gate');
  await openTransform(page, false);
  const panel = page.locator('#context-scroll');
  const nested = page.locator('.oss-grid');
  await expect(nested).toHaveCSS('overflow-y', 'visible');
  const before = await panel.evaluate(el => ({ top: el.scrollTop, height: el.scrollHeight, client: el.clientHeight }));
  expect(before.height).toBeGreaterThan(before.client);
  await panel.hover();
  await page.mouse.wheel(0, 900);
  await expect.poll(() => panel.evaluate(el => el.scrollTop), { timeout: 7000 }).toBeGreaterThan(before.top);
  console.log(`F_ED_006_MOUSE_SCROLL_PASS=${JSON.stringify({before:before.top,after:await panel.evaluate(el=>el.scrollTop)})}`);
});

test('F-ED-006 mobile context panel touch scroll uses visible viewport coordinates', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'mobile touch gate');
  await openTransform(page, true);
  const panel = page.locator('#context-scroll');
  await panel.scrollIntoViewIfNeeded();

  const target = await panel.evaluate(el => {
    const r = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const left = Math.max(0, r.left);
    const right = Math.min(vw, r.right);
    const top = Math.max(0, r.top);
    const bottom = Math.min(vh, r.bottom);
    if (right <= left || bottom <= top) return null;
    const x = Math.round(left + Math.max(2, Math.min(80, (right - left) * 0.25)));
    const sy = Math.round(bottom - Math.max(2, Math.min(24, (bottom - top) * 0.15)));
    const ey = Math.round(top + Math.max(2, Math.min(24, (bottom - top) * 0.15)));
    return { x, sy, ey, rect:{x:r.x,y:r.y,width:r.width,height:r.height}, viewport:{width:vw,height:vh} };
  });
  expect(target, 'TEST_INPUT_HARNESS_GAP context panel has no visible viewport intersection').not.toBeNull();

  const hit = await page.evaluate(({x,y}) => {
    const el = document.elementFromPoint(x,y);
    const owner = el?.closest?.('#context-scroll');
    return { tag: el?.tagName || null, id: el?.id || null, cls: el?.className || null, inOwner: Boolean(owner) };
  }, { x:target.x, y:target.sy });
  console.log(`F_ED_006_TOUCH_TARGET=${JSON.stringify({target,hit})}`);
  expect(hit.inOwner, `TEST_INPUT_HARNESS_GAP touch start misses #context-scroll ${JSON.stringify({target,hit})}`).toBe(true);

  const metrics = await panel.evaluate(el => ({ top:el.scrollTop, height:el.scrollHeight, client:el.clientHeight }));
  expect(metrics.height).toBeGreaterThan(metrics.client);
  await dispatchSyntheticTouch(page, target.x, target.sy, target.x, target.ey);
  await expect.poll(() => panel.evaluate(el => el.scrollTop), { timeout:7000 }).toBeGreaterThan(metrics.top);
  console.log(`F_ED_006_TOUCH_SCROLL_PASS=${JSON.stringify({before:metrics.top,after:await panel.evaluate(el=>el.scrollTop)})}`);
});
