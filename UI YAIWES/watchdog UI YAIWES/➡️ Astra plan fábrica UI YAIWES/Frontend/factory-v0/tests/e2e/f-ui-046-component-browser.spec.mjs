import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const URL = '/index-v192.html';
const PROJECT_KEY = 'yaiwes-factory-project-v19';
const SHOTS = 'test-results/f-ui-046';
mkdirSync(SHOTS, { recursive: true });

async function boot(page, mobile = false) {
  await page.setViewportSize(mobile ? { width: 412, height: 839 } : { width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-component-browser', 'v1');
  if (mobile) {
    const studio = page.locator('.studio');
    if (await studio.evaluate(el => el.classList.contains('workspace-left-collapsed'))) {
      await page.locator('[data-workspace-toggle="left"]').tap();
    }
  }
  await expect(page.locator('[data-component-search]')).toBeVisible();
  await expect(page.locator('[data-component-category]')).toBeVisible();
}

async function resetProject(page) {
  await page.evaluate(key => localStorage.removeItem(key), PROJECT_KEY);
  await page.reload({ waitUntil: 'domcontentloaded' });
}

async function projectComponents(page) {
  return page.evaluate(key => JSON.parse(localStorage.getItem(key) || 'null')?.state?.components || [], PROJECT_KEY);
}

test('search select preview insert changes canonical project and recent filter', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop browser journey');
  await boot(page);
  await resetProject(page);
  await boot(page);
  const before = await projectComponents(page);
  expect(before).toHaveLength(0);

  await page.locator('[data-component-search]').fill('Botón');
  const buttonCard = page.locator('.component-card[data-kind="button"]');
  await expect(buttonCard).toBeVisible();
  await expect(page.locator('.component-card[data-kind="window"]')).toBeHidden();
  await buttonCard.click();
  await expect(page.locator('[data-component-preview]')).toBeVisible();
  await expect(page.locator('[data-preview-title]')).toHaveText('Botón');
  expect(await projectComponents(page)).toHaveLength(0);
  await page.screenshot({ path: `${SHOTS}/desktop-search-preview.png`, fullPage: true });

  await page.locator('[data-preview-insert]').click();
  await expect(page.locator('[data-node]')).toHaveCount(1);
  const after = await projectComponents(page);
  expect(after).toHaveLength(1);
  expect(after[0].kind).toBe('button');

  await page.locator('[data-component-search]').fill('');
  await page.locator('[data-component-filter="recent"]').click();
  await expect(buttonCard).toBeVisible();
  await expect(page.locator('.component-card[data-kind="window"]')).toBeHidden();
  await page.screenshot({ path: `${SHOTS}/desktop-insert-recent.png`, fullPage: true });
});

test('category favorite persistence and physical drag instrumentation', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop category/favorite/physical drag diagnostic');
  await boot(page);
  const category = page.locator('[data-component-category]');
  await category.selectOption({ label: 'Media' });
  await expect(page.locator('.component-card[data-kind="image"]')).toBeVisible();
  await expect(page.locator('.component-card[data-kind="button"]')).toBeHidden();
  await category.selectOption('all');

  const image = page.locator('.component-card[data-kind="image"]');
  await image.click();
  await page.locator('[data-preview-favorite]').click();
  await page.locator('[data-component-filter="favorites"]').click();
  await expect(image).toBeVisible();
  await expect(page.locator('.component-card[data-kind="window"]')).toBeHidden();
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('[data-component-filter="favorites"]').click();
  await expect(page.locator('.component-card[data-kind="image"]')).toBeVisible();
  await page.locator('[data-component-filter="all"]').click();

  await page.evaluate(() => {
    const card = document.querySelector('.component-card[data-kind="window"]');
    const canvas = document.querySelector('#canvas');
    window.__FUI046_DRAG_DIAG__ = { dragstart: 0, dragover: 0, drop: 0, types: [], kindAtStart: '', kindAtDrop: '' };
    card.addEventListener('dragstart', e => {
      const d = window.__FUI046_DRAG_DIAG__; d.dragstart += 1; d.types = [...(e.dataTransfer?.types || [])]; d.kindAtStart = e.dataTransfer?.getData('text/yaiwes-kind') || '';
    });
    canvas.addEventListener('dragover', () => { window.__FUI046_DRAG_DIAG__.dragover += 1; });
    canvas.addEventListener('drop', e => { const d=window.__FUI046_DRAG_DIAG__; d.drop += 1; d.kindAtDrop = e.dataTransfer?.getData('text/yaiwes-kind') || ''; });
  });
  const beforeCount = await page.locator('[data-node]').count();
  await page.locator('.component-card[data-kind="window"]').dragTo(page.locator('#canvas'), { targetPosition: { x: 250, y: 180 } });
  const diag = await page.evaluate(() => window.__FUI046_DRAG_DIAG__);
  console.log(`FUI046_PHYSICAL_DRAG_DIAG=${JSON.stringify(diag)}`);
  expect(diag.dragstart).toBeGreaterThan(0);
  expect(diag.kindAtStart).toBe('window');
  await expect(page.locator('[data-node]')).toHaveCount(beforeCount + 1);
  const components = await projectComponents(page);
  expect(components.some(x => x.kind === 'window')).toBeTruthy();
  await page.screenshot({ path: `${SHOTS}/desktop-favorite-drag.png`, fullPage: true });
});

test('canonical browser DragEvent drop inserts through real canvas handler', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop DOM drag/drop diagnostic');
  await boot(page);
  await resetProject(page);
  await boot(page);
  const result = await page.evaluate(() => {
    const card = document.querySelector('.component-card[data-kind="window"]');
    const canvas = document.querySelector('#canvas');
    const dt = new DataTransfer();
    const rect = canvas.getBoundingClientRect();
    card.dispatchEvent(new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer: dt, clientX: 20, clientY: 20 }));
    const typesAfterStart = [...dt.types];
    const kindAfterStart = dt.getData('text/yaiwes-kind');
    canvas.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer: dt, clientX: rect.left + 250, clientY: rect.top + 180 }));
    canvas.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dt, clientX: rect.left + 250, clientY: rect.top + 180 }));
    card.dispatchEvent(new DragEvent('dragend', { bubbles: true, cancelable: true, dataTransfer: dt }));
    return { typesAfterStart, kindAfterStart };
  });
  console.log(`FUI046_DOM_DRAG_DIAG=${JSON.stringify(result)}`);
  expect(result.kindAfterStart).toBe('window');
  await expect(page.locator('[data-node]')).toHaveCount(1);
  const components = await projectComponents(page);
  expect(components).toHaveLength(1);
  expect(components[0].kind).toBe('window');
  await page.screenshot({ path: `${SHOTS}/desktop-dom-drag-drop.png`, fullPage: true });
});

test('keyboard selection previews first and canonical insert happens only from action', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop keyboard gate');
  await boot(page);
  await resetProject(page);
  await boot(page);
  const card = page.locator('.component-card[data-kind="selector"]');
  await card.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-preview-title]')).toHaveText('Selector');
  await expect(page.locator('[data-preview-insert]')).toBeFocused();
  expect(await projectComponents(page)).toHaveLength(0);
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-node]')).toHaveCount(1);
  const components = await projectComponents(page);
  expect(components[0].kind).toBe('selector');
  await page.screenshot({ path: `${SHOTS}/desktop-keyboard-insert.png`, fullPage: true });
});

test('mobile touch search preview favorite and insert keep real canvas result', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'mobile touch browser gate');
  await boot(page, true);
  await resetProject(page);
  await boot(page, true);
  await page.locator('[data-component-search]').fill('Panel');
  const card = page.locator('.component-card[data-kind="panel"]');
  await card.tap();
  await expect(page.locator('[data-preview-title]')).toHaveText('Panel');
  expect(await projectComponents(page)).toHaveLength(0);
  const insertBox = await page.locator('[data-preview-insert]').boundingBox();
  expect(insertBox?.height || 0).toBeGreaterThanOrEqual(44);
  await page.locator('[data-preview-favorite]').tap();
  await page.locator('[data-preview-insert]').tap();
  await expect(page.locator('[data-node]')).toHaveCount(1);
  const components = await projectComponents(page);
  expect(components[0].kind).toBe('panel');
  await expect(page.locator('#canvas')).toBeVisible();
  await page.screenshot({ path: `${SHOTS}/mobile-touch-insert.png`, fullPage: true });
});
