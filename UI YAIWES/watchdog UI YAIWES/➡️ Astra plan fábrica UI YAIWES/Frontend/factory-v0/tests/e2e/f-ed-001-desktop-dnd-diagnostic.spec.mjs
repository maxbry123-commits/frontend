import { test, expect } from '@playwright/test';

const URL = '/index-v192.html';

test('F-ED-001 desktop DnD diagnostic preserves real HTML5 contract', async ({ page }) => {
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#canvas')).toBeVisible();
  await expect(page.locator('[data-kind="window"]')).toBeVisible();

  await page.evaluate(() => {
    window.__F_ED_001_DND_DIAG__ = { dragstart: 0, dragover: 0, drop: 0, starts: [], drops: [] };
    document.addEventListener('dragstart', event => {
      const card = event.target?.closest?.('[data-kind]');
      if (!card) return;
      const d = window.__F_ED_001_DND_DIAG__;
      d.dragstart += 1;
      queueMicrotask(() => d.starts.push({ kind: card.dataset.kind, types: [...(event.dataTransfer?.types || [])] }));
    }, true);
    const canvas = document.getElementById('canvas');
    canvas.addEventListener('dragover', () => { window.__F_ED_001_DND_DIAG__.dragover += 1; }, true);
    canvas.addEventListener('drop', event => {
      const d = window.__F_ED_001_DND_DIAG__;
      d.drop += 1;
      d.drops.push({
        types: [...(event.dataTransfer?.types || [])],
        kind: event.dataTransfer?.getData('text/yaiwes-kind') || '',
        label: event.dataTransfer?.getData('text/yaiwes-label') || '',
        targetId: event.target?.id || '',
        x: event.clientX,
        y: event.clientY
      });
    }, true);
  });

  const source = page.locator('[data-kind="window"]');
  const canvas = page.locator('#canvas');
  const sourceInfo = await source.evaluate(el => ({ draggable: el.draggable, attr: el.getAttribute('draggable'), cls: el.className }));
  const sourceBox = await source.boundingBox();
  const canvasBox = await canvas.boundingBox();
  expect(sourceInfo.draggable, `SOURCE_NOT_DRAGGABLE ${JSON.stringify(sourceInfo)}`).toBe(true);
  expect(sourceBox, 'SOURCE_BOX_MISSING').not.toBeNull();
  expect(canvasBox, 'CANVAS_BOX_MISSING').not.toBeNull();

  const sx = sourceBox.x + sourceBox.width / 2;
  const sy = sourceBox.y + sourceBox.height / 2;
  const tx = canvasBox.x + Math.min(180, canvasBox.width * 0.35);
  const ty = canvasBox.y + Math.min(160, canvasBox.height * 0.35);
  await page.mouse.move(sx, sy);
  await page.mouse.down();
  await page.mouse.move(sx + 12, sy + 8, { steps: 4 });
  await page.mouse.move(tx, ty, { steps: 24 });
  await page.mouse.up();
  await page.waitForTimeout(250);

  const diag = await page.evaluate(source => ({
    ...window.__F_ED_001_DND_DIAG__,
    source,
    nodeCount: document.querySelectorAll('[data-node]').length,
    project: JSON.parse(localStorage.getItem('yaiwes-factory-project-v19') || 'null')
  }), sourceInfo);
  console.log(`F_ED_001_DESKTOP_DND_DIAG=${JSON.stringify(diag)}`);

  expect(diag.dragstart, `NO_DRAGSTART ${JSON.stringify(diag)}`).toBeGreaterThan(0);
  expect(diag.dragover, `NO_DRAGOVER ${JSON.stringify(diag)}`).toBeGreaterThan(0);
  expect(diag.drop, `NO_DROP ${JSON.stringify(diag)}`).toBeGreaterThan(0);
  expect(diag.drops.at(-1)?.types || [], `MISSING_DND_KIND ${JSON.stringify(diag)}`).toContain('text/yaiwes-kind');
  expect(diag.drops.at(-1)?.kind, `EMPTY_DND_KIND ${JSON.stringify(diag)}`).toBe('window');
  expect(diag.nodeCount, `PRODUCT_DND_ADD_GAP ${JSON.stringify(diag)}`).toBe(1);
  expect(diag.project?.state?.components?.length, `PRODUCT_DND_PERSIST_GAP ${JSON.stringify(diag)}`).toBe(1);
});
