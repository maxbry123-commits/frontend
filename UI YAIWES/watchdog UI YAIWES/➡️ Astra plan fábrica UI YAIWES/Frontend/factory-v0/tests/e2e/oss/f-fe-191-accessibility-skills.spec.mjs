import { test, expect } from '@playwright/test';

test.describe('F-FE-191 accessibility-skills QA adapter', () => {
  test('detects missing rules that F-UI-056 does not centralize', async ({ page }) => {
    await page.setContent(`<!doctype html>
      <meta name="viewport" content="width=device-width,maximum-scale=1,user-scalable=no">
      <style>button,[role=button]{display:inline-block;width:20px;height:20px}</style>
      <button id="positive" tabindex="3">A</button>
      <div id="custom" role="button">B</div>
      <button id="disabled" disabled>C</button>
      <button id="unnamed" aria-label=""></button>`);
    const audit = await page.evaluate(async () => {
      const mod = await import(`/src/oss/accessibility-skills-qa-v1.js?t=${Date.now()}`);
      return mod.auditAccessibilitySkills(document);
    });
    const codes = audit.findings.map((finding) => finding.code);
    expect(audit.source.component).toBe('accessibility-skills');
    expect(audit.source.extractionCommit).toBe('0bb892f739f64b7a0183bafeba533b0b7007abd4');
    expect(audit.source.purpose).toBe('QA_ONLY');
    expect(audit.source.wired).toBe(false);
    expect(codes).toContain('VIEWPORT_ZOOM_BLOCKED');
    expect(codes).toContain('POSITIVE_TABINDEX');
    expect(codes).toContain('CUSTOM_BUTTON_NOT_FOCUSABLE');
    expect(codes).toContain('DISABLED_REASON_MISSING');
    expect(codes).toContain('UNNAMED_INTERACTIVE');
    expect(codes.filter((code) => code === 'TOUCH_TARGET_BELOW_PROJECT_DEFAULT').length).toBeGreaterThanOrEqual(3);
    expect(audit.pass).toBe(false);
  });

  test('passes a semantic keyboard/touch fixture and supports explicit disabled reason', async ({ page }) => {
    await page.setContent(`<!doctype html>
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <style>button,input{display:inline-flex;min-width:44px;min-height:44px}</style>
      <label for="name">Name</label><input id="name">
      <button id="save">Save</button>
      <button id="blocked" disabled data-disabled-reason="Requires project">Publish</button>`);
    const audit = await page.evaluate(async () => {
      const mod = await import(`/src/oss/accessibility-skills-qa-v1.js?t=${Date.now()}`);
      return mod.auditAccessibilitySkills(document, { minTouchTarget: 44 });
    });
    expect(audit.findings).toEqual([]);
    expect(audit.inspected).toBe(3);
    expect(audit.pass).toBe(true);
  });

  test('fails closed for invalid touch target policy', async ({ page }) => {
    await page.goto('/');
    const error = await page.evaluate(async () => {
      const mod = await import(`/src/oss/accessibility-skills-qa-v1.js?t=${Date.now()}`);
      try { mod.auditAccessibilitySkills(document, { minTouchTarget: 10 }); }
      catch (e) { return e.message; }
      return null;
    });
    expect(error).toBe('A11Y_MIN_TARGET_INVALID');
  });
});
