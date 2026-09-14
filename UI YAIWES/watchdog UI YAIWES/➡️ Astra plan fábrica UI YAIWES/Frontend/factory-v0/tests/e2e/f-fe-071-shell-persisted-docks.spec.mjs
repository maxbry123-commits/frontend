import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  CANVAS_MIN,
  DOCK_DEFAULTS,
  DOCK_MIN,
  DOCK_STORAGE_KEY,
  WORKSPACE_SHELL_VERSION,
  clampDocks,
} from '../../src/ui/workspace-shell-v5.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const v1js = readFileSync(join(root, 'src/ui/workspace-shell-v1.js'), 'utf8');
const v2js = readFileSync(join(root, 'src/ui/workspace-shell-v2.js'), 'utf8');
const v4js = readFileSync(join(root, 'src/ui/workspace-shell-v4.js'), 'utf8');
const v5js = readFileSync(join(root, 'src/ui/workspace-shell-v5.js'), 'utf8');
const v4css = readFileSync(join(root, 'workspace-shell-v4.css'), 'utf8');
const v5css = readFileSync(join(root, 'workspace-shell-v5.css'), 'utf8');
const baseCss = readFileSync(join(root, 'styles.css'), 'utf8');

function harnessHtml() {
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <title>F-FE-071 shell v5 harness</title>
  <style>${baseCss}\n${v5css}</style>
</head>
<body>
<div id="app" class="app-shell">
  <header class="topbar"><div class="brand"><strong>YAIWES</strong></div></header>
  <main class="studio">
    <aside class="library-pane" aria-label="Elementos"><div class="pane-head"><h2>Elementos</h2></div></aside>
    <section class="canvas-pane">
      <div class="canvas-toolbar"><div><small>PASO 1</small><strong>Crear</strong></div></div>
      <div class="canvas-stage"><div id="canvas" class="canvas"></div></div>
    </section>
    <aside class="context-pane" aria-label="Inspector"><div class="context-head"><h2>Inspector</h2></div></aside>
  </main>
  <footer class="bottom-bar"><button type="button">Deshacer</button></footer>
</div>
</body>
</html>`;
}

async function boot(page, width, height = 800) {
  await page.setViewportSize({ width, height });
  await page.goto('/workspace-shell-v5.css', { waitUntil: 'domcontentloaded' });
  await page.setContent(harnessHtml(), { waitUntil: 'domcontentloaded' });
  await page.addScriptTag({ path: join(root, 'src/ui/workspace-shell-v5.js'), type: 'module' });
  await page.waitForFunction(() => Boolean(globalThis.__YAIWES_WORKSPACE_SHELL_V5__), null, { timeout: 10_000 });
  await expect(page.locator('.app-shell')).toHaveAttribute('data-workspace-shell', 'v5');
}

test.describe('F-FE-071 persisted docks v5', () => {
  test('preserves v1/v2/v4 and versions v5 independently', () => {
    expect(v1js).toContain("dataset.workspaceShell = 'v1'");
    expect(v2js).toContain("WORKSPACE_SHELL_VERSION = 'v2'");
    expect(v4js).toContain("WORKSPACE_SHELL_VERSION = 'v4'");
    expect(v5js).toContain("WORKSPACE_SHELL_VERSION = 'v5'");
    expect(v5js).not.toContain("WORKSPACE_SHELL_VERSION = 'v4'");
    expect(v4css).not.toContain('data-workspace-shell="v5"');
    expect(v5css).toContain('data-workspace-shell="v5"');
    expect(WORKSPACE_SHELL_VERSION).toBe('v5');
    const clamped = clampDocks({ left: 900, right: 900 }, 1280);
    expect(clamped.left + clamped.right).toBeLessThanOrEqual(1280 - CANVAS_MIN);
    expect(clamped.left).toBeGreaterThanOrEqual(DOCK_MIN);
    expect(clamped.right).toBeGreaterThanOrEqual(DOCK_MIN);
  });

  test('desktop dock resize persists, clamps, and reset restores defaults', async ({ page }) => {
    await boot(page, 1280, 800);
    await expect(page.locator('.app-shell')).toHaveAttribute('data-workspace-mode', 'desktop');
    await expect(page.locator('.studio')).toHaveAttribute('data-docks-active', 'true');

    const resized = await page.evaluate(() => globalThis.__YAIWES_WORKSPACE_SHELL_V5__.setDockWidth('left', 300));
    expect(resized.left).toBe(300);
    await expect(page.locator('.app-shell')).toHaveAttribute('data-dock-left', '300');
    const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) || 'null'), DOCK_STORAGE_KEY);
    expect(stored.left).toBe(300);

    const starved = await page.evaluate(() => globalThis.__YAIWES_WORKSPACE_SHELL_V5__.setDockWidth('left', 5000));
    const studioW = await page.locator('.studio').evaluate((el) => el.getBoundingClientRect().width);
    expect(starved.left + starved.right).toBeLessThanOrEqual(studioW - CANVAS_MIN + 1);
    expect(studioW - starved.left - starved.right).toBeGreaterThanOrEqual(CANVAS_MIN - 1);

    const reset = await page.evaluate(() => globalThis.__YAIWES_WORKSPACE_SHELL_V5__.resetDocks());
    expect(reset).toEqual({ ...DOCK_DEFAULTS });
    await expect(page.locator('.app-shell')).toHaveAttribute('data-dock-left', String(DOCK_DEFAULTS.left));
    await page.locator('[data-dock-reset]').click();
    const afterClick = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) || 'null'), DOCK_STORAGE_KEY);
    expect(afterClick.left).toBe(DOCK_DEFAULTS.left);
    expect(afterClick.right).toBe(DOCK_DEFAULTS.right);

    await page.evaluate(() => globalThis.__YAIWES_WORKSPACE_SHELL_V5__.setDockWidth('right', 280));
    await boot(page, 1280, 800);
    const restored = await page.evaluate(() => {
      const shell = document.querySelector('.app-shell');
      return { left: Number(shell.dataset.dockLeft), right: Number(shell.dataset.dockRight), mode: shell.dataset.workspaceMode };
    });
    expect(restored.mode).toBe('desktop');
    expect(restored.right).toBe(280);
  });

  test('compact mode ignores desktop dock widths', async ({ page }) => {
    await boot(page, 1280, 800);
    await page.evaluate(() => globalThis.__YAIWES_WORKSPACE_SHELL_V5__.setDockWidth('left', 300));
    await page.setViewportSize({ width: 390, height: 800 });
    await page.waitForFunction(() => document.querySelector('.app-shell')?.dataset.workspaceMode === 'compact', null, { timeout: 10_000 });
    const compact = await page.evaluate(() => {
      const studio = document.querySelector('.studio');
      return {
        mode: document.querySelector('.app-shell').dataset.workspaceMode,
        docksActive: studio.dataset.docksActive,
        dockLeftVar: getComputedStyle(studio).getPropertyValue('--dock-left').trim(),
      };
    });
    expect(compact.mode).toBe('compact');
    expect(compact.docksActive).toBe('false');
    expect(compact.dockLeftVar).toBe('');
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForFunction(() => document.querySelector('.app-shell')?.dataset.workspaceMode === 'desktop', null, { timeout: 10_000 });
    await expect(page.locator('.app-shell')).toHaveAttribute('data-dock-left', '300');
    await expect(page.locator('.studio')).toHaveAttribute('data-docks-active', 'true');
  });
});
