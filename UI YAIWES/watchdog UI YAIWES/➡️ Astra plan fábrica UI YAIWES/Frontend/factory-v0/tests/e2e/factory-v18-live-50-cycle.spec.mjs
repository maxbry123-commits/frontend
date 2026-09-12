import { test, expect } from '@playwright/test';

const LIVE_URL = 'https://comand-center-1-yaiwes-ui-factory.static.hf.space/';
const CYCLES = 50;

async function boot(page) {
  await page.goto(LIVE_URL, { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(/YAIWES UI Factory V1\.8/);
  await expect(page.getByText('YAIWES UI Factory')).toBeVisible();
  await expect(page.locator('#canvas')).toBeVisible();
  await expect(page.locator('#component-library')).toBeVisible();
  await expect(page.locator('#layer-list')).toBeVisible();
  await expect(page.locator('#context-scroll')).toBeVisible();
  await expect(page.locator('#fit-view')).toBeVisible();
}

async function reset(page) {
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#canvas')).toBeVisible();
}

async function verifyStepNavigation(page) {
  const expected = ['Crear', 'Componer', 'Transformar', 'IA', 'Validar'];
  for (let i = 1; i <= 5; i += 1) {
    await page.locator(`[data-step="${i}"]`).click();
    await expect(page.locator('#context-count')).toHaveText(`${i}/5`);
    await expect(page.locator('#step-title')).toContainText(expected[i - 1]);
    await expect(page.locator('#canvas')).toBeVisible();
  }
  await page.locator('[data-step="1"]').click();
}

async function verifyRealDragDrop(page) {
  const source = page.locator('[data-kind="window"]');
  const canvas = page.locator('#canvas');
  const before = await page.locator('[data-node]').count();
  await source.dragTo(canvas, { targetPosition: { x: 180, y: 160 } });
  await expect(page.locator('[data-node]')).toHaveCount(before + 1);
  await expect(page.locator('#layer-count')).toHaveText(String(before + 1));

  const node = page.locator('[data-node]').last();
  const initial = await node.evaluate(el => ({ left: el.style.left, top: el.style.top }));
  const canvasBox = await canvas.boundingBox();
  if (!canvasBox) throw new Error('canvas bounding box unavailable');
  await node.dragTo(canvas, { targetPosition: { x: Math.min(canvasBox.width - 80, 420), y: Math.min(canvasBox.height - 80, 260) } });
  const moved = await node.evaluate(el => ({ left: el.style.left, top: el.style.top }));
  expect(moved).not.toEqual(initial);
}

async function verifyMouseScroll(page) {
  await page.locator('[data-step="3"]').click();
  const panel = page.locator('#context-scroll');
  const metrics = await panel.evaluate(el => ({ top: el.scrollTop, height: el.scrollHeight, client: el.clientHeight }));
  expect(metrics.height).toBeGreaterThan(metrics.client);
  await panel.hover();
  await page.mouse.wheel(0, 900);
  await expect.poll(() => panel.evaluate(el => el.scrollTop)).toBeGreaterThan(metrics.top);
}

async function verifyBreakpointsZoomAndFit(page) {
  await page.locator('[data-step="2"]').click();
  for (const bp of ['desktop', 'tablet', 'mobile']) {
    await page.locator(`.canvas-controls button[data-breakpoint="${bp}"]`).click();
    await expect(page.locator('#canvas')).toHaveAttribute('data-breakpoint', bp);
  }
  await page.locator('.canvas-controls button[data-breakpoint="desktop"]').click();

  await page.locator('#zoom-reset').click();
  await expect(page.locator('#zoom-label')).toHaveText('100%');
  await page.locator('#zoom-in').click();
  await expect(page.locator('#zoom-label')).not.toHaveText('100%');
  await page.locator('#zoom-out').click();
  await page.locator('#fit-view').click();
  await expect(page.locator('#yaiwes-minimap')).toBeVisible();
}

async function verifyShellButtonsHaveObservableEffects(page) {
  await page.locator('[data-step="1"]').click();
  await page.locator('#new-component').click();
  await expect(page.locator('[data-node]')).toHaveCount(1);
  await page.locator('#undo').click();
  await expect(page.locator('[data-node]')).toHaveCount(0);
  await page.locator('#redo').click();
  await expect(page.locator('[data-node]')).toHaveCount(1);
  await page.locator('#save-version').click();
  await expect(page.locator('#status')).toContainText('V');

  const start = await page.locator('#context-count').textContent();
  await page.locator('#next-step').click();
  await expect(page.locator('#context-count')).not.toHaveText(start || '1/5');
  await page.locator('#prev-step').click();
  await expect(page.locator('#context-count')).toHaveText('1/5');

  for (const mode of ['MANUAL', 'AI_ASSIST', 'AUTOPILOT']) {
    await page.locator(`[data-mode="${mode}"]`).click();
    await expect(page.locator(`[data-mode="${mode}"]`)).toHaveClass(/active/);
  }
}

test.describe('YAIWES Factory V1.8 live human-like regression gate', () => {
  test('50 live interaction cycles: steps/buttons/canvas/drag-drop/scroll/breakpoints/zoom/fit', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium-desktop', '50-cycle gate executes once on desktop project');
    await boot(page);

    for (let cycle = 1; cycle <= CYCLES; cycle += 1) {
      await reset(page);
      await verifyStepNavigation(page);
      await verifyRealDragDrop(page);
      await verifyMouseScroll(page);
      await verifyBreakpointsZoomAndFit(page);
      await verifyShellButtonsHaveObservableEffects(page);

      await expect(page.locator('#canvas')).toBeVisible();
      await expect(page.locator('#component-library')).toBeVisible();
      await expect(page.locator('#layer-list')).toBeVisible();
      await expect(page.locator('#context-scroll')).toBeVisible();

      console.log(`FACTORY_V1_8_LIVE_CYCLE=${cycle}/${CYCLES} PASS`);
    }
  });

  test('mobile touch surface and contextual panel remain usable', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-chromium', 'mobile gate executes only on touch project');
    await boot(page);
    await page.locator('[data-step="3"]').tap();
    await expect(page.locator('#context-count')).toHaveText('3/5');
    await page.locator('[data-kind="button"]').tap();
    await expect(page.locator('[data-node]')).toHaveCount(1);

    const panel = page.locator('#context-scroll');
    const metrics = await panel.evaluate(el => ({ top: el.scrollTop, height: el.scrollHeight, client: el.clientHeight }));
    expect(metrics.height).toBeGreaterThan(metrics.client);
    const box = await panel.boundingBox();
    if (!box) throw new Error('context panel bounding box unavailable');
    const session = await page.context().newCDPSession(page);
    const x = Math.round(box.x + box.width / 2);
    const startY = Math.round(box.y + Math.min(box.height - 30, box.height * 0.82));
    const endY = Math.round(box.y + Math.max(30, box.height * 0.2));
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: startY }] });
    for (let i = 1; i <= 8; i += 1) {
      const y = Math.round(startY + ((endY - startY) * i) / 8);
      await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y }] });
      await page.waitForTimeout(25);
    }
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect.poll(() => panel.evaluate(el => el.scrollTop), { timeout: 7000 }).toBeGreaterThan(metrics.top);

    await expect(page.locator('#canvas')).toBeVisible();
    await expect(page.locator('#component-library')).toBeVisible();
    await expect(page.locator('#layer-list')).toBeVisible();
  });
});
