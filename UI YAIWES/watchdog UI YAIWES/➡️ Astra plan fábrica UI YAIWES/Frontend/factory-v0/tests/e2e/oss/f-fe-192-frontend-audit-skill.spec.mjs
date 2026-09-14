import { test, expect } from '@playwright/test';

const SHA = 'a'.repeat(40);

async function createCase(page, overrides = {}) {
  return page.evaluate(async ({ sha, overrides }) => {
    const mod = await import(`/src/oss/frontend-audit-qa-v1.js?t=${Date.now()}`);
    return mod.createVisualAuditCase({
      id: 'save-button-visual',
      surface: 'fixture',
      candidateSha: sha,
      viewport: { width: 390, height: 844 },
      locator: { role: 'button', name: 'Save' },
      goalRef: 'design/save-button.png',
      maxDiffPixels: 0,
      maxDiffPixelRatio: 0,
      ...overrides,
    });
  }, { sha: SHA, overrides });
}

test.describe('F-FE-192 frontend-audit-skill bounded QA adapter', () => {
  test('uses semantic locator and detects a real browser visual mutation without editing product', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.evaluate(() => {
      document.body.innerHTML = `<main><button style="width:120px;height:48px;border:2px solid rgb(0,0,0);border-radius:8px;background:rgb(255,255,255)">Save</button></main>`;
    });

    const auditCase = await createCase(page);
    const button = page.getByRole(auditCase.locator.role, { name: auditCase.locator.name });
    await expect(button).toBeVisible();
    const stableA = await button.screenshot();
    const stableB = await button.screenshot();
    expect(stableA.equals(stableB)).toBe(true);

    const stableResult = await page.evaluate(async ({ auditCase, sha }) => {
      const mod = await import(`/src/oss/frontend-audit-qa-v1.js?t=${Date.now()}`);
      return mod.evaluateVisualMeasurement(auditCase, {
        testedSha: sha,
        diffPixels: 0,
        diffPixelRatio: 0,
        criticalConsoleErrors: 0,
        failedRequests: 0,
      });
    }, { auditCase, sha: SHA });
    expect(stableResult.pass).toBe(true);
    expect(stableResult.productMutationAuthorized).toBe(false);

    await button.evaluate((node) => {
      node.style.borderRadius = '24px';
      node.style.background = 'rgb(240, 240, 240)';
    });
    const mutated = await button.screenshot();
    expect(mutated.equals(stableA)).toBe(false);

    const driftResult = await page.evaluate(async ({ auditCase, sha }) => {
      const mod = await import(`/src/oss/frontend-audit-qa-v1.js?t=${Date.now()}`);
      return mod.evaluateVisualMeasurement(auditCase, {
        testedSha: sha,
        diffPixels: 1,
        diffPixelRatio: 0.001,
        criticalConsoleErrors: 0,
        failedRequests: 0,
      });
    }, { auditCase, sha: SHA });
    expect(driftResult.pass).toBe(false);
    expect(driftResult.reasons).toEqual(['DIFF_PIXELS_OVER_BUDGET', 'DIFF_RATIO_OVER_BUDGET']);
  });

  test('rejects brittle class/css locators and candidate SHA drift', async ({ page }) => {
    await page.goto('/');
    const result = await page.evaluate(async (sha) => {
      const mod = await import(`/src/oss/frontend-audit-qa-v1.js?t=${Date.now()}`);
      const errors = {};
      try {
        mod.createVisualAuditCase({
          id: 'bad-selector', surface: 'fixture', candidateSha: sha,
          viewport: { width: 390, height: 844 }, locator: { selector: '.save.primary' },
          goalRef: 'design/save.png',
        });
      } catch (error) { errors.selector = error.message; }
      const good = mod.createVisualAuditCase({
        id: 'good', surface: 'fixture', candidateSha: sha,
        viewport: { width: 390, height: 844 }, locator: { testId: 'save' },
        goalRef: 'design/save.png',
      });
      try {
        mod.evaluateVisualMeasurement(good, {
          testedSha: 'b'.repeat(40), diffPixels: 0, diffPixelRatio: 0,
        });
      } catch (error) { errors.sha = error.message; }
      return { errors, source: mod.FRONTEND_AUDIT_SOURCE, good };
    }, SHA);

    expect(result.errors.selector).toBe('VISUAL_LOCATOR_SEMANTIC_ONLY');
    expect(result.errors.sha).toBe('VISUAL_TESTED_SHA_MISMATCH');
    expect(result.source.extractionCommit).toBe('3e035c4675ed3d00430e9934d60948b890cfe6c6');
    expect(result.source.omitted).toContain('OmniParser');
    expect(result.source.purpose).toBe('QA_ONLY');
    expect(result.good.locator).toEqual({ testId: 'save' });
  });

  test('fails closed on invalid tolerance or viewport', async ({ page }) => {
    await page.goto('/');
    const errors = await page.evaluate(async (sha) => {
      const mod = await import(`/src/oss/frontend-audit-qa-v1.js?t=${Date.now()}`);
      const base = { id: 'x', surface: 'x', candidateSha: sha, locator: { text: 'Save' }, goalRef: 'goal.png' };
      const out = {};
      try { mod.createVisualAuditCase({ ...base, viewport: { width: 100, height: 100 } }); } catch (e) { out.viewport = e.message; }
      try { mod.createVisualAuditCase({ ...base, viewport: { width: 390, height: 844 }, maxDiffPixelRatio: 0.5 }); } catch (e) { out.ratio = e.message; }
      return out;
    }, SHA);
    expect(errors.viewport).toBe('VISUAL_VIEWPORT_INVALID');
    expect(errors.ratio).toBe('VISUAL_MAX_DIFF_RATIO_INVALID');
  });
});
