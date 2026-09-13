import { test, expect } from '@playwright/test';

const URL = '/index-v192.html';

test('F-ED-001 desktop DnD diagnostic preserves real HTML5 contract', async ({ page }) => {
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#canvas')).toBeVisible();
  await expect(page.locator('[data-kind="window"]')).toBeVisible();

  const diag = await page.evaluate(() => {
    const source = document.querySelector('[data-kind="window"]');
    const canvas = document.getElementById('canvas');
    if (!source || !canvas) throw new Error('F-ED-001 diagnostic DOM missing');
    const sourceStyle = getComputedStyle(source);
    const sourceInfo = {
      draggable: source.draggable,
      attr: source.getAttribute('draggable'),
      cls: source.className,
      pointerEvents: sourceStyle.pointerEvents,
      userSelect: sourceStyle.userSelect,
      webkitUserDrag: sourceStyle.webkitUserDrag || ''
    };
    const canvasRect = canvas.getBoundingClientRect();
    const tx = Math.round(canvasRect.left + Math.min(180, canvasRect.width * 0.35));
    const ty = Math.round(canvasRect.top + Math.min(160, canvasRect.height * 0.35));
    const dataTransfer = new DataTransfer();
    const counters = { dragstart: 0, dragover: 0, drop: 0 };
    document.addEventListener('dragstart', () => { counters.dragstart += 1; }, true);
    canvas.addEventListener('dragover', () => { counters.dragover += 1; }, true);
    canvas.addEventListener('drop', () => { counters.drop += 1; }, true);

    const dragstart = new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer });
    const dragstartAccepted = source.dispatchEvent(dragstart);
    const afterStart = {
      types: [...dataTransfer.types],
      kind: dataTransfer.getData('text/yaiwes-kind'),
      label: dataTransfer.getData('text/yaiwes-label')
    };
    const dragenter = new DragEvent('dragenter', { bubbles: true, cancelable: true, dataTransfer, clientX: tx, clientY: ty });
    const dragover = new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer, clientX: tx, clientY: ty });
    const drop = new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer, clientX: tx, clientY: ty });
    canvas.dispatchEvent(dragenter);
    const dragoverAccepted = canvas.dispatchEvent(dragover);
    const dropAccepted = canvas.dispatchEvent(drop);

    return {
      source: sourceInfo,
      counters,
      dragstartAccepted,
      dragoverAccepted,
      dropAccepted,
      afterStart,
      nodeCount: document.querySelectorAll('[data-node]').length,
      project: JSON.parse(localStorage.getItem('yaiwes-factory-project-v19') || 'null')
    };
  });

  console.log(`F_ED_001_DESKTOP_DND_DIAG=${JSON.stringify(diag)}`);
  expect(diag.source.draggable, `SOURCE_NOT_DRAGGABLE ${JSON.stringify(diag)}`).toBe(true);
  expect(diag.counters.dragstart, `SOURCE_HANDLER_NOT_REACHED ${JSON.stringify(diag)}`).toBeGreaterThan(0);
  expect(diag.afterStart.types, `MISSING_DND_KIND ${JSON.stringify(diag)}`).toContain('text/yaiwes-kind');
  expect(diag.afterStart.kind, `EMPTY_DND_KIND ${JSON.stringify(diag)}`).toBe('window');
  expect(diag.counters.dragover, `CANVAS_DRAGOVER_NOT_REACHED ${JSON.stringify(diag)}`).toBeGreaterThan(0);
  expect(diag.counters.drop, `CANVAS_DROP_NOT_REACHED ${JSON.stringify(diag)}`).toBeGreaterThan(0);
  expect(diag.nodeCount, `PRODUCT_DND_ADD_GAP ${JSON.stringify(diag)}`).toBe(1);
  expect(diag.project?.state?.components?.length, `PRODUCT_DND_PERSIST_GAP ${JSON.stringify(diag)}`).toBe(1);
});
