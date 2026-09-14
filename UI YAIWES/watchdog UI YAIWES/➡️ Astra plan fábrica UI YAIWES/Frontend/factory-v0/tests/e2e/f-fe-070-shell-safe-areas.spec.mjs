import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  WORKSPACE_SHELL_BREAKPOINT,
  WORKSPACE_SHELL_VERSION,
  WORKSPACE_SHELL_WIDTHS,
  applySafeAreaInsets,
  classifyViewportWidth,
} from '../../src/ui/workspace-shell-v4.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const v1js = readFileSync(join(root, 'src/ui/workspace-shell-v1.js'), 'utf8');
const v2js = readFileSync(join(root, 'src/ui/workspace-shell-v2.js'), 'utf8');
const v4js = readFileSync(join(root, 'src/ui/workspace-shell-v4.js'), 'utf8');
const v1css = readFileSync(join(root, 'workspace-shell-v1.css'), 'utf8');
const v2css = readFileSync(join(root, 'workspace-shell-v2.css'), 'utf8');
const v3css = readFileSync(join(root, 'workspace-shell-v3.css'), 'utf8');
const v4css = readFileSync(join(root, 'workspace-shell-v4.css'), 'utf8');
const baseCss = readFileSync(join(root, 'styles.css'), 'utf8');

function harnessHtml() {
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <title>F-FE-070 shell v4 harness</title>
  <style>${baseCss}\n${v4css}</style>
</head>
<body>
<div id="app" class="app-shell">
  <header class="topbar">
    <div class="brand"><span class="brand-mark">Y</span><div><strong>YAIWES UI Factory</strong><small>SEG-01-SHELL v4</small></div></div>
    <nav id="steps" class="steps" aria-label="Pasos">
      <button data-step="1">1</button><button data-step="2">2</button><button data-step="3">3</button><button data-step="4">4</button><button data-step="5">5</button>
    </nav>
    <div class="mode-switch"><button>Manual</button><button>IA</button><button>Auto</button></div>
  </header>
  <main class="studio">
    <aside class="library-pane" aria-label="Elementos"><div class="pane-head"><small>BIBLIOTECA</small><h2>Elementos</h2></div></aside>
    <section class="canvas-pane">
      <div class="canvas-toolbar"><div><small>PASO 1</small><strong>Crear</strong></div></div>
      <div class="canvas-stage"><div id="canvas" class="canvas"><div class="canvas-empty"><strong>Canvas listo</strong></div></div></div>
    </section>
    <aside class="context-pane" aria-label="Inspector"><div class="context-head"><small>HERRAMIENTAS</small><h2>Inspector</h2></div></aside>
  </main>
  <footer class="bottom-bar">
    <div class="history-actions"><button>Deshacer</button><button>Rehacer</button><button>Guardar</button></div>
    <div class="step-actions"><button>Atrás</button><button class="primary">Siguiente</button></div>
  </footer>
</div>
</body>
</html>`;
}

async function boot(page, width, height = 800) {
  await page.setViewportSize({ width, height });
  await page.setContent(harnessHtml(), { waitUntil: 'domcontentloaded' });
  await page.addScriptTag({ path: join(root, 'src/ui/workspace-shell-v4.js'), type: 'module' });
  await page.waitForFunction(() => Boolean(globalThis.__YAIWES_WORKSPACE_SHELL_V4__), null, { timeout: 10_000 });
  await expect(page.locator('.app-shell')).toHaveAttribute('data-workspace-shell', 'v4');
}

async function geometry(page) {
  return page.evaluate(() => {
    const vw = innerWidth;
    const canvas = document.getElementById('canvas');
    const top = document.querySelector('.topbar');
    const bottom = document.querySelector('.bottom-bar');
    const shell = document.querySelector('.app-shell');
    const offenders = [...document.body.querySelectorAll('*')].map((el) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return {
        tag: el.tagName.toLowerCase(),
        id: el.id || '',
        cls: typeof el.className === 'string' ? el.className.slice(0, 80) : '',
        left: Math.round(r.left),
        right: Math.round(r.right),
        visibility: s.visibility,
        position: s.position,
      };
    }).filter((x) => x.visibility !== 'hidden' && x.position !== 'fixed' && (x.right > vw + 2 || x.left < -2));
    const html = getComputedStyle(document.documentElement);
    const body = getComputedStyle(document.body);
    return {
      viewport: vw,
      htmlScrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      htmlOverflowX: html.overflowX,
      bodyOverflowX: body.overflowX,
      paddingTop: parseFloat(getComputedStyle(shell).paddingTop) || 0,
      paddingBottom: parseFloat(getComputedStyle(shell).paddingBottom) || 0,
      canvasWidth: canvas ? canvas.getBoundingClientRect().width : 0,
      topInView: top ? top.getBoundingClientRect().bottom > 0 && top.getBoundingClientRect().top < innerHeight : false,
      bottomInView: bottom ? bottom.getBoundingClientRect().top < innerHeight && bottom.getBoundingClientRect().bottom > 0 : false,
      offenders: offenders.slice(0, 20),
    };
  });
}

test.describe('F-FE-070 shell safe-areas v4', () => {
  test('preserves v1/v2/v3 and versions v4 independently', () => {
    expect(v1js).toContain("dataset.workspaceShell = 'v1'");
    expect(v2js).toContain("WORKSPACE_SHELL_VERSION = 'v2'");
    expect(v4js).toContain("WORKSPACE_SHELL_VERSION = 'v4'");
    expect(v4js).not.toContain("WORKSPACE_SHELL_VERSION = 'v2'");
    expect(v1css).not.toContain('data-workspace-shell="v4"');
    expect(v2css).not.toContain('data-workspace-shell="v4"');
    expect(v3css).not.toContain('data-workspace-shell="v4"');
    expect(v4css).toContain('data-workspace-shell="v4"');
    expect(v4css).toContain('--yaiwes-safe-top');
    expect(v4css).toContain('(max-width: 768px)');
    expect(v4css).not.toMatch(/overflow-x:\s*(hidden|clip)/);
    expect(WORKSPACE_SHELL_VERSION).toBe('v4');
    expect(WORKSPACE_SHELL_BREAKPOINT).toBe(768);
    expect(classifyViewportWidth(768)).toBe('compact');
    expect(classifyViewportWidth(769)).toBe('desktop');
    const fake = { style: { setProperty() {} }, dataset: {} };
    expect(applySafeAreaInsets(fake, { top: 12 })).toMatchObject({ top: 12 });
  });

  for (const width of WORKSPACE_SHELL_WIDTHS) {
    test(`width ${width} has zero page overflow, reachable chrome, dominant canvas`, async ({ page }) => {
      await boot(page, width, 800);
      const g = await geometry(page);
      expect(g.htmlOverflowX, 'must not mask overflow').not.toMatch(/hidden|clip/);
      expect(g.bodyOverflowX, 'must not mask overflow').not.toMatch(/hidden|clip/);
      expect(g.htmlScrollWidth).toBeLessThanOrEqual(width + 2);
      expect(g.bodyScrollWidth).toBeLessThanOrEqual(width + 2);
      expect(g.offenders, JSON.stringify(g.offenders)).toEqual([]);
      expect(g.topInView).toBe(true);
      expect(g.bottomInView).toBe(true);
      expect(g.canvasWidth).toBeGreaterThan(width * 0.5);
      await expect(page.locator('.topbar')).toBeVisible();
      await expect(page.locator('.bottom-bar')).toBeVisible();
      await expect(page.locator('#canvas')).toBeVisible();
      await expect(page.locator('[data-workspace-toggle="left"]')).toBeVisible();
    });
  }

  test('safe-area insets pad top and bottom without overflow', async ({ page }) => {
    await boot(page, 390, 800);
    await page.evaluate(() => {
      const shell = document.querySelector('.app-shell');
      globalThis.__YAIWES_WORKSPACE_SHELL_V4__.applySafeAreaInsets(shell, { top: 47, right: 0, bottom: 34, left: 0 });
    });
    const g = await geometry(page);
    expect(g.paddingTop).toBeGreaterThanOrEqual(47);
    expect(g.paddingBottom).toBeGreaterThanOrEqual(34);
    expect(g.htmlOverflowX).not.toMatch(/hidden|clip/);
    expect(g.htmlScrollWidth).toBeLessThanOrEqual(390 + 2);
    expect(g.topInView).toBe(true);
    expect(g.bottomInView).toBe(true);
  });
});
