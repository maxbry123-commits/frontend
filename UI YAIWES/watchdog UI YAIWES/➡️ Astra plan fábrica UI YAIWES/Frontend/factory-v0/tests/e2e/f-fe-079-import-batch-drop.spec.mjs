import { test, expect } from '@playwright/test';
import { classifyIntake, importBatchFiles } from '../../src/file-import-controller-v2.js';

function file(name, mime, body) {
  return new File([body], name, { type: mime });
}

test('F-FE-079 classifies the whole batch before any drop mutation', async () => {
  const html = file('page.html', 'text/html', '<main><h1>One</h1></main>');
  const json = file('data.json', 'application/json', '{"ok":true}');
  const exe = file('payload.exe', 'application/x-msdownload', 'MZ');
  const dup = file('page.html', 'text/html', '<main><h1>One</h1></main>');
  const empty = file('blank.txt', 'text/plain', '');

  let droppedLabels = [];
  const report = await importBatchFiles([html, exe, json, dup, empty], {
    drop(items) {
      droppedLabels = items.map((item) => item.label);
      return items.length;
    },
  });

  expect(report.classifiedBeforeMutation).toBe(true);
  expect(report.order).toEqual(['page.html', 'data.json']);
  expect(droppedLabels).toEqual(['page.html', 'data.json']);
  expect(report.imported).toBe(2);
  expect(report.rejected.map((item) => [item.name, item.reason])).toEqual([
    ['payload.exe', 'UNSUPPORTED_TYPE'],
    ['page.html', 'DUPLICATE'],
    ['blank.txt', 'EMPTY_FILE'],
  ]);
});

test('F-FE-079 classifyIntake is mutation-free and stable', () => {
  const a = file('a.json', 'application/json', '{"a":1}');
  const b = file('b.html', 'text/html', '<p>b</p>');
  const classified = classifyIntake([b, a]);
  expect(classified.mutated).toBe(false);
  expect(classified.classified).toBe(true);
  expect(classified.accepted.map((item) => item.name)).toEqual(['b.html', 'a.json']);
  expect(classified.order).toEqual([0, 1]);
});

test('F-FE-079 browser batch uses canonical canvas drop without inserting rejects', async ({ page }) => {
  await page.goto('/index-v193.html', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('[data-step="3"]').click();
  await expect(page.locator('#canvas')).toBeVisible();

  const report = await page.evaluate(async () => {
    const mod = await import('./src/file-import-controller-v2.js');
    const html = new File(['<main><h1>Batch</h1></main>'], 'batch.html', { type: 'text/html' });
    const json = new File(['{"title":"batch"}'], 'batch.json', { type: 'application/json' });
    const exe = new File(['MZ'], 'batch.exe', { type: 'application/x-msdownload' });
    const dup = new File(['<main><h1>Batch</h1></main>'], 'batch.html', { type: 'text/html' });
    return mod.importBatchFiles([html, exe, json, dup]);
  });

  expect(report.classifiedBeforeMutation).toBe(true);
  expect(report.imported).toBe(2);
  expect(report.order).toEqual(['batch.html', 'batch.json']);
  expect(report.rejected.some((item) => item.reason === 'UNSUPPORTED_TYPE')).toBe(true);
  expect(report.rejected.some((item) => item.reason === 'DUPLICATE')).toBe(true);
  await expect.poll(() => page.locator('[data-node]').count(), { timeout: 10_000 }).toBe(2);
  const labels = await page.locator('[data-node] strong').allTextContents();
  expect(labels).toEqual(['batch.html', 'batch.json']);
  expect(labels.join(' ')).not.toContain('.exe');
});
