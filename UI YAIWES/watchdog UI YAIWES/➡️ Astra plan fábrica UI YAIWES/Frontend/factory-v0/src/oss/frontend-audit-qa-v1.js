export const FRONTEND_AUDIT_QA_VERSION = '1.0.0';
export const FRONTEND_AUDIT_SOURCE = Object.freeze({
  component: 'frontend-audit-skill',
  extractionCommit: '3e035c4675ed3d00430e9934d60948b890cfe6c6',
  sourcePath: '📂componentes open soure fromtend/Fromtend code/frontend-audit-skill/',
  donation: 'visual-regression-policy-and-semantic-locators',
  omitted: ['autonomous-css-mutation', 'dependency-installer', 'OmniParser', 'model-weights'],
  purpose: 'QA_ONLY',
  wired: false,
});

const SHA40 = /^[0-9a-f]{40}$/i;

function nonEmpty(value, code) {
  const text = String(value ?? '').trim();
  if (!text) throw new TypeError(code);
  return text;
}

export function normalizeSemanticLocator(locator) {
  if (!locator || typeof locator !== 'object' || Array.isArray(locator)) {
    throw new TypeError('VISUAL_LOCATOR_REQUIRED');
  }
  if ('selector' in locator || 'css' in locator || 'className' in locator) {
    throw new TypeError('VISUAL_LOCATOR_SEMANTIC_ONLY');
  }
  const keys = Object.keys(locator).filter((key) => locator[key] != null && locator[key] !== '');
  if (keys.length === 1 && keys[0] === 'testId') {
    return Object.freeze({ testId: nonEmpty(locator.testId, 'VISUAL_TESTID_REQUIRED') });
  }
  if (keys.length === 1 && keys[0] === 'text') {
    return Object.freeze({ text: nonEmpty(locator.text, 'VISUAL_TEXT_REQUIRED') });
  }
  if (keys.every((key) => ['role', 'name'].includes(key)) && keys.includes('role') && keys.includes('name')) {
    return Object.freeze({
      role: nonEmpty(locator.role, 'VISUAL_ROLE_REQUIRED'),
      name: nonEmpty(locator.name, 'VISUAL_NAME_REQUIRED'),
    });
  }
  throw new TypeError('VISUAL_LOCATOR_UNSUPPORTED');
}

function normalizeViewport(viewport) {
  const width = Number(viewport?.width);
  const height = Number(viewport?.height);
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 240 || width > 7680 || height < 240 || height > 7680) {
    throw new TypeError('VISUAL_VIEWPORT_INVALID');
  }
  return Object.freeze({ width, height });
}

function boundedRatio(value, fallback, code) {
  const number = value == null ? fallback : Number(value);
  if (!Number.isFinite(number) || number < 0 || number > 0.05) throw new TypeError(code);
  return number;
}

export function createVisualAuditCase(input = {}) {
  const candidateSha = nonEmpty(input.candidateSha, 'VISUAL_CANDIDATE_SHA_REQUIRED').toLowerCase();
  if (!SHA40.test(candidateSha)) throw new TypeError('VISUAL_CANDIDATE_SHA_INVALID');
  const maxDiffPixels = input.maxDiffPixels == null ? 0 : Number(input.maxDiffPixels);
  if (!Number.isInteger(maxDiffPixels) || maxDiffPixels < 0 || maxDiffPixels > 100000) {
    throw new TypeError('VISUAL_MAX_DIFF_PIXELS_INVALID');
  }
  return Object.freeze({
    id: nonEmpty(input.id, 'VISUAL_CASE_ID_REQUIRED'),
    surface: nonEmpty(input.surface, 'VISUAL_SURFACE_REQUIRED'),
    candidateSha,
    viewport: normalizeViewport(input.viewport),
    locator: normalizeSemanticLocator(input.locator),
    goalRef: nonEmpty(input.goalRef, 'VISUAL_GOAL_REF_REQUIRED'),
    maxDiffPixels,
    maxDiffPixelRatio: boundedRatio(input.maxDiffPixelRatio, 0, 'VISUAL_MAX_DIFF_RATIO_INVALID'),
    source: FRONTEND_AUDIT_SOURCE,
  });
}

export function evaluateVisualMeasurement(auditCase, measurement = {}) {
  if (!auditCase || typeof auditCase !== 'object') throw new TypeError('VISUAL_CASE_REQUIRED');
  const testedSha = nonEmpty(measurement.testedSha, 'VISUAL_TESTED_SHA_REQUIRED').toLowerCase();
  if (testedSha !== auditCase.candidateSha) throw new Error('VISUAL_TESTED_SHA_MISMATCH');
  const diffPixels = Number(measurement.diffPixels);
  const diffPixelRatio = Number(measurement.diffPixelRatio);
  const criticalConsoleErrors = Number(measurement.criticalConsoleErrors ?? 0);
  const failedRequests = Number(measurement.failedRequests ?? 0);
  if (!Number.isInteger(diffPixels) || diffPixels < 0) throw new TypeError('VISUAL_DIFF_PIXELS_INVALID');
  if (!Number.isFinite(diffPixelRatio) || diffPixelRatio < 0 || diffPixelRatio > 1) throw new TypeError('VISUAL_DIFF_RATIO_INVALID');
  if (!Number.isInteger(criticalConsoleErrors) || criticalConsoleErrors < 0 || !Number.isInteger(failedRequests) || failedRequests < 0) {
    throw new TypeError('VISUAL_RUNTIME_COUNTS_INVALID');
  }
  const reasons = [];
  if (diffPixels > auditCase.maxDiffPixels) reasons.push('DIFF_PIXELS_OVER_BUDGET');
  if (diffPixelRatio > auditCase.maxDiffPixelRatio) reasons.push('DIFF_RATIO_OVER_BUDGET');
  if (criticalConsoleErrors > 0) reasons.push('CRITICAL_CONSOLE_ERRORS');
  if (failedRequests > 0) reasons.push('FAILED_REQUESTS');
  return Object.freeze({
    caseId: auditCase.id,
    testedSha,
    diffPixels,
    diffPixelRatio,
    criticalConsoleErrors,
    failedRequests,
    pass: reasons.length === 0,
    reasons: Object.freeze(reasons),
    productMutationAuthorized: false,
  });
}
