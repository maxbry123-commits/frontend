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
  const sourceInfo = await source.evaluate(el => {
    const cs = getComputedStyle(el);
    return { draggable: el.draggable, attr: el.getAttribute('draggable'), cls: el.className, pointerEvents: cs.pointerEvents, userSelect: cs.userSelect, webkitUserDrag: cs.webkitUserDrag || '' };
  });
  const sourceBox = await source.boundingBox();
  const canvasBox = await canvas.boundingBox();
  expect(sourceInfo.draggable, `SOURCE_NOT_DRAGGABLE ${JSON.stringify(sourceInfo)}`).toBe(true);
  expect(sourceBox, 'SOURCE_BOX_MISSING').not.toBeNull();
  expect(canvasBox, 'CANVAS_BOX_MISSING').not.toBeNull();

  // Strategy 3: begin inside card padding instead of its child-content center.
  const sx = Math.round(sourceBox.x + Math.min(10, Math.max(3, sourceBox.width * 0.04)));
  const sy = Math.round(sourceBox.y + Math.min(10, Math.max(3, sourceBox.height * 0.12)));
  const tx = Math.round(canvasBox.x + Math.min(180, canvasBox.width * 0.35));
  const ty = Math.round(canvasBox.y + Math.min(160, canvasBox.height * 0.35));
  const startHit = await page.evaluate(({ x, y }) => {
    const el = document.elementFromPoint(x, y);
    const card = el?.closest?.('[data-kind]');
    const cs = el ? getComputedStyle(el) : null;
    return el ? { tag: el.tagName, cls: el.className, kind: card?.dataset?.kind || null, pointerEvents: cs?.pointerEvents || null } : null;
  }, { x: sx, y: sy });
  expect(startHit?.kind, `START_HIT_MISS ${JSON.stringify({ sx, sy, startHit, sourceInfo })}`).toBe('window');

  await page.mouse.move(sx, sy);
  await page.mouse.down();
  await page.mouse.move(sx + 8, sy + 6, { steps: 8 });
  await page.waitForTimeout(80);
  await page.mouse.move(tx, ty, { steps: 36 });
  await page.waitForTimeout(80);
  await page.mouse.up();
  await page.waitForTimeout(250);

  const diag = await page.evaluate(({ source, startHit, sx, sy, tx, ty }) => ({
    ...window.__F_ED_001_DND_DIAG__,
    source,
    startHit,
    gesture: { sx, sy, tx, ty },
    nodeCount: document.querySelectorAll('[data-node]').length,
    project: JSON.parse(localStorage.getItem('yaiwes-factory-project-v19') || 'null')
  }), { source: sourceInfo, startHit, sx, sy, tx, ty });
  console.log(`F_ED_001_DESKTOP_DND_DIAG=${JSON.stringify(diag)}`);

  expect(diag.dragstart, `NO_DRAGSTART ${JSON.stringify(diag)}`).toBeGreaterThan(0);
  expect(diag.dragover, `NO_DRAGOVER ${JSON.stringify(diag)}`).toBeGreaterThan(0);
  expect(diag.drop, `NO_DROP ${JSON.stringify(diag)}`).toBeGreaterThan(0);
  expect(diag.drops.at(-1)?.types || [], `MISSING_DND_KIND ${JSON.stringify(diag)}`).toContain('text/yaiwes-kind');
  expect(diag.drops.at(-1)?.kind, `EMPTY_DND_KIND ${JSON.stringify(diag)}`).toBe('window');
  expect(diag.nodeCount, `PRODUCT_DND_ADD_GAP ${JSON.stringify(diag)}`).toBe(1);
  expect(diag.project?.state?.components?.length, `PRODUCT_DND_PERSIST_GAP ${JSON.stringify(diag)}`).toBe(1);
});
