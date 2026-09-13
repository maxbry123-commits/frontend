import { test, expect } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const URL = '/index-v192.html';
const OUT = 'test-results/f-ui-051';
mkdirSync(OUT, { recursive: true });

function normalizeText(text='') { return text.replace(/\s+/g, ' ').trim(); }

async function boot(page) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#canvas')).toBeVisible();
}

async function controlInventory(page, step) {
  return page.evaluate(({ step }) => {
    const visible = el => {
      const s = getComputedStyle(el); const r = el.getBoundingClientRect();
      return s.visibility !== 'hidden' && s.display !== 'none' && r.width > 0 && r.height > 0 && r.bottom > 0 && r.right > 0;
    };
    const controls = [...document.querySelectorAll('button,input,select,textarea,[role="button"],[tabindex]:not([tabindex="-1"])')]
      .filter(visible)
      .map((el, index) => ({
        step,
        index,
        tag: el.tagName.toLowerCase(),
        id: el.id || null,
        text: (el.innerText || el.value || el.getAttribute('aria-label') || '').replace(/\s+/g,' ').trim(),
        ariaLabel: el.getAttribute('aria-label'),
        role: el.getAttribute('role'),
        disabled: !!el.disabled || el.getAttribute('aria-disabled') === 'true',
        data: Object.fromEntries([...el.attributes].filter(a => a.name.startsWith('data-')).map(a => [a.name,a.value])),
        className: typeof el.className === 'string' ? el.className : ''
      }));
    return controls;
  }, { step });
}

test('discover exhaustive visible desktop controls for all Factory steps', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop matrix discovery');
  await boot(page);
  const inventory = [];
  const steps = await page.locator('#steps [data-step]').count();
  expect(steps).toBeGreaterThanOrEqual(5);
  for (let i = 0; i < steps; i += 1) {
    await page.locator(`#steps [data-step="${i}"]`).click();
    await expect(page.locator('#context-count')).toContainText(`${i + 1}/`);
    inventory.push(...await controlInventory(page, i));
    await page.screenshot({ path: `${OUT}/step-${i + 1}-controls.png`, fullPage: true });
  }
  const unique = [];
  const seen = new Set();
  for (const row of inventory) {
    const key = JSON.stringify([row.step,row.tag,row.id,row.text,row.ariaLabel,row.data]);
    if (!seen.has(key)) { seen.add(key); unique.push(row); }
  }
  writeFileSync(`${OUT}/desktop-control-inventory.json`, JSON.stringify(unique, null, 2));
  console.log(`FUI051_CONTROL_INVENTORY=${JSON.stringify(unique)}`);
  expect(unique.length).toBeGreaterThan(20);
  const anonymous = unique.filter(x => !x.id && !x.text && !x.ariaLabel && Object.keys(x.data || {}).length === 0);
  expect(anonymous, 'Every interactive control must have an auditable identity').toEqual([]);
});

test('baseline controls produce canonical desktop effects', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop baseline effects');
  await boot(page);

  for (const mode of ['MANUAL','AI_ASSIST','AUTOPILOT']) {
    const button = page.locator(`[data-mode="${mode}"]`);
    await button.click();
    await expect(button).toHaveClass(/active/);
  }
  for (const bp of ['desktop','tablet','mobile']) {
    await page.locator(`[data-breakpoint="${bp}"]`).click();
    await expect(page.locator('#canvas')).toHaveAttribute('data-breakpoint', bp);
  }
  await page.locator('[data-breakpoint="desktop"]').click();
  await page.locator('#zoom-reset').click();
  await expect(page.locator('#zoom-label')).toHaveText('100%');
  await page.locator('#zoom-in').click();
  await expect(page.locator('#zoom-label')).not.toHaveText('100%');
  await page.locator('#zoom-reset').click();

  const studio = page.locator('.studio');
  await page.locator('[data-workspace-toggle="left"]').click();
  await expect(studio).toHaveClass(/workspace-left-collapsed/);
  await page.locator('[data-workspace-toggle="left"]').click();
  await expect(studio).not.toHaveClass(/workspace-left-collapsed/);
  await page.locator('[data-workspace-toggle="right"]').click();
  await expect(studio).toHaveClass(/workspace-right-collapsed/);
  await page.locator('[data-workspace-toggle="right"]').click();
  await expect(studio).not.toHaveClass(/workspace-right-collapsed/);

  const initialStep = await page.locator('#context-count').textContent();
  await page.locator('#next-step').click();
  await expect(page.locator('#context-count')).not.toHaveText(initialStep || '');
  await page.locator('#prev-step').click();
  await expect(page.locator('#context-count')).toHaveText(initialStep || '1/5');
  await page.screenshot({ path: `${OUT}/baseline-effects.png`, fullPage: true });
});
