import { test, expect } from '@playwright/test';

test.describe('YAIWES Factory V0', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await expect(page.getByText('YAIWES UI Factory')).toBeVisible();
  });

  test('recorre los cinco pasos y conserva navegación acotada', async ({ page }) => {
    await expect(page.locator('#step-title')).toContainText('Crear');
    for (let i = 0; i < 8; i++) await page.locator('#next-step').click();
    await expect(page.locator('#step-title')).toContainText('Validar');
    for (let i = 0; i < 8; i++) await page.locator('#prev-step').click();
    await expect(page.locator('#step-title')).toContainText('Crear');
  });

  test('crea, selecciona y edita un componente desde UI visual', async ({ page }) => {
    await page.locator('#new-component').click();
    const node = page.locator('.node').first();
    await expect(node).toBeVisible();
    await node.click();
    await page.locator('#prop-label').fill('Ventana principal');
    await page.locator('#prop-label').press('Tab');
    await expect(node).toContainText('Ventana principal');
  });

  test('drag and drop añade un componente al canvas', async ({ page }) => {
    const source = page.locator('[data-kind="button"]');
    const canvas = page.locator('#canvas');
    await source.dragTo(canvas);
    await expect(page.locator('.node')).toHaveCount(1);
  });

  test('AI Assist propone delta visible y sólo lo aplica tras acción explícita', async ({ page }) => {
    await page.locator('[data-mode="AI_ASSIST"]').click();
    await expect(page.locator('#status')).toContainText('AI_ASSIST');
    await page.locator('#ai-goal').fill('Añadir panel de trabajo');
    await page.locator('#propose-delta').click();
    await expect(page.locator('#delta-preview')).toContainText('Añadir panel de trabajo');
    await expect(page.locator('.node')).toHaveCount(0);
    await page.locator('#delta-preview').click();
    await expect(page.locator('.node')).toHaveCount(1);
    await expect(page.locator('.node')).toContainText('Propuesta IA');
  });

  test('undo/redo y guardar V+ son observables', async ({ page }) => {
    await page.locator('#new-component').click();
    await expect(page.locator('.node')).toHaveCount(1);
    await page.locator('#undo').click();
    await expect(page.locator('.node')).toHaveCount(0);
    await page.locator('#redo').click();
    await expect(page.locator('.node')).toHaveCount(1);
    await expect(page.locator('#status')).toContainText('V0');
    await page.locator('#save-version').click();
    await expect(page.locator('#status')).toContainText('V1');
  });

  test('exporta JSON como artefacto descargable', async ({ page }) => {
    await page.locator('#new-component').click();
    const downloadPromise = page.waitForEvent('download');
    await page.locator('#export-json').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('yaiwes-ui-v0.json');
  });
});
