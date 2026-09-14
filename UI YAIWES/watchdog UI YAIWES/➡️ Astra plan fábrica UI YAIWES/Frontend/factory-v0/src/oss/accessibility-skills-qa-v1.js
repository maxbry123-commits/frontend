export const ACCESSIBILITY_SKILLS_QA_VERSION = '1.0.0';
export const ACCESSIBILITY_SKILLS_SOURCE = Object.freeze({
  component: 'accessibility-skills',
  sourcePath: '📂componentes open soure fromtend/Fromtend code/accessibility-skills/',
  extractionCommit: '0bb892f739f64b7a0183bafeba533b0b7007abd4',
  skills: ['keyboard', 'touch-pointer'],
  purpose: 'QA_ONLY',
  wired: false,
});

const INTERACTIVE = 'button,a[href],input,select,textarea,[role="button"],[role="link"],[tabindex]';

function visible(element) {
  const style = getComputedStyle(element);
  const rect = element.getBoundingClientRect();
  return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
}

function accessibleName(element) {
  const aria = element.getAttribute('aria-label');
  if (aria?.trim()) return aria.trim();
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const text = labelledBy.split(/\s+/).map((id) => document.getElementById(id)?.textContent || '').join(' ').trim();
    if (text) return text;
  }
  if (element.id) {
    const label = document.querySelector(`label[for="${CSS.escape(element.id)}"]`)?.textContent?.trim();
    if (label) return label;
  }
  const wrapping = element.closest('label')?.textContent?.trim();
  if (wrapping) return wrapping;
  const alt = element.getAttribute('alt')?.trim();
  if (alt) return alt;
  const title = element.getAttribute('title')?.trim();
  if (title) return title;
  const value = ['BUTTON', 'INPUT'].includes(element.tagName) ? String(element.value || '').trim() : '';
  if (value) return value;
  return String(element.textContent || '').trim();
}

function identity(element) {
  return {
    tag: element.tagName.toLowerCase(),
    id: element.id || null,
    role: element.getAttribute('role'),
    name: accessibleName(element) || null,
  };
}

function finding(code, severity, element, detail) {
  return Object.freeze({ code, severity, element: identity(element), detail });
}

function viewportFinding(doc) {
  const viewport = doc.querySelector('meta[name="viewport"]');
  if (!viewport) return null;
  const content = String(viewport.getAttribute('content') || '').toLowerCase().replace(/\s+/g, '');
  if (content.includes('user-scalable=no') || /maximum-scale=(?:1(?:\.0*)?)(?:,|$)/.test(content)) {
    return Object.freeze({
      code: 'VIEWPORT_ZOOM_BLOCKED',
      severity: 'CRITICAL',
      element: { tag: 'meta', id: null, role: null, name: 'viewport' },
      detail: content,
    });
  }
  return null;
}

export function auditAccessibilitySkills(root = document, options = {}) {
  const minTouchTarget = Number(options.minTouchTarget ?? 44);
  if (!Number.isFinite(minTouchTarget) || minTouchTarget < 24) throw new TypeError('A11Y_MIN_TARGET_INVALID');
  const doc = root.nodeType === 9 ? root : root.ownerDocument || document;
  const findings = [];
  const viewport = viewportFinding(doc);
  if (viewport) findings.push(viewport);

  const elements = [...root.querySelectorAll(INTERACTIVE)].filter(visible);
  for (const element of elements) {
    const disabled = element.disabled || element.getAttribute('aria-disabled') === 'true';
    const tabIndexAttr = element.getAttribute('tabindex');
    const tabIndex = tabIndexAttr == null ? null : Number(tabIndexAttr);

    if (Number.isFinite(tabIndex) && tabIndex > 0) {
      findings.push(finding('POSITIVE_TABINDEX', 'SERIOUS', element, `tabindex=${tabIndex}`));
    }
    if (!accessibleName(element)) {
      findings.push(finding('UNNAMED_INTERACTIVE', 'SERIOUS', element, 'Interactive element has no accessible name.'));
    }
    if (!disabled && element.getAttribute('role') === 'button' && element.tabIndex < 0) {
      findings.push(finding('CUSTOM_BUTTON_NOT_FOCUSABLE', 'CRITICAL', element, 'role=button is not keyboard focusable.'));
    }
    if (disabled) {
      const reason = element.getAttribute('data-disabled-reason') || element.getAttribute('aria-describedby') || element.getAttribute('title');
      if (!String(reason || '').trim()) {
        findings.push(finding('DISABLED_REASON_MISSING', 'MODERATE', element, 'Disabled control has no deterministic reason reference.'));
      }
      continue;
    }
    if (element.matches('button,[role="button"],input:not([type="hidden"]),select,textarea')) {
      const rect = element.getBoundingClientRect();
      if (rect.width < minTouchTarget || rect.height < minTouchTarget) {
        findings.push(finding('TOUCH_TARGET_BELOW_PROJECT_DEFAULT', 'MODERATE', element, `${Math.round(rect.width)}x${Math.round(rect.height)} < ${minTouchTarget}x${minTouchTarget}`));
      }
    }
  }

  return Object.freeze({
    source: ACCESSIBILITY_SKILLS_SOURCE,
    minTouchTarget,
    inspected: elements.length,
    findings: Object.freeze(findings),
    pass: findings.length === 0,
  });
}
