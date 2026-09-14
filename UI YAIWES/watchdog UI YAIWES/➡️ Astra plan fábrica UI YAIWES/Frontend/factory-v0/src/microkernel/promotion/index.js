const SHA40 = /^[0-9a-f]{40}$/i;
const DIGEST = /^sha256:[0-9a-f]{64}$/i;
const REQUIRED_STAGES = Object.freeze([
  'dedup',
  'acquisition',
  'provenance',
  'adapter',
  'bus',
  'route',
  'isolated_test',
  'integration_test',
  'preview',
  'independent_review',
]);

const clean = (value) => String(value ?? '').trim();

function stagePass(stages, name) {
  const value = stages?.[name];
  return value === true || clean(value).toUpperCase() === 'PASS';
}

export function evaluatePromotion(input = {}) {
  const reasons = [];
  const candidateSha = clean(input.candidate_sha).toLowerCase();
  const testedSha = clean(input.tested_sha).toLowerCase();
  const evidenceDigest = clean(input.evidence_digest).toLowerCase();
  const producer = clean(input.producer);
  const reviewer = clean(input.reviewer);
  const reviewerVerdict = clean(input.reviewer_verdict).toUpperCase();
  const llmRatio = Number(input.llm_ratio ?? 0);
  const llmAuthority = clean(input.llm_authority || 'ADVISORY_ONLY').toUpperCase();

  if (!SHA40.test(candidateSha)) reasons.push('CANDIDATE_SHA_REQUIRED');
  if (!SHA40.test(testedSha)) reasons.push('TESTED_SHA_REQUIRED');
  if (candidateSha && testedSha && candidateSha !== testedSha) reasons.push('TESTED_SHA_MISMATCH');
  if (!DIGEST.test(evidenceDigest)) reasons.push('EVIDENCE_DIGEST_REQUIRED');
  if (!producer) reasons.push('PRODUCER_REQUIRED');
  if (!reviewer) reasons.push('REVIEWER_REQUIRED');
  if (producer && reviewer && producer === reviewer) reasons.push('INDEPENDENT_REVIEW_REQUIRED');
  if (reviewerVerdict !== 'PASS') reasons.push('REVIEWER_PASS_REQUIRED');
  if (!Number.isFinite(llmRatio) || llmRatio < 0 || llmRatio > 0.04) reasons.push('LLM_RATIO_EXCEEDS_4_PERCENT');
  if (llmAuthority !== 'ADVISORY_ONLY') reasons.push('LLM_AUTHORITY_FORBIDDEN');

  for (const stage of REQUIRED_STAGES) {
    if (!stagePass(input.stages, stage)) reasons.push(`STAGE_REQUIRED:${stage}`);
  }

  const decision = reasons.length ? 'REJECT' : 'PROMOTE_TO_CANDIDATE';
  return Object.freeze({
    schema: 'yaiwes.factory.promotion-decision/v1',
    decision,
    candidate_sha: candidateSha || null,
    tested_sha: testedSha || null,
    evidence_digest: evidenceDigest || null,
    deterministic_ratio: Number.isFinite(llmRatio) ? Number((1 - llmRatio).toFixed(4)) : null,
    llm_ratio: Number.isFinite(llmRatio) ? llmRatio : null,
    llm_authority: llmAuthority || null,
    producer: producer || null,
    reviewer: reviewer || null,
    reasons: Object.freeze(reasons),
    final_ui_status: 'NOT_SELF_CERTIFIED',
  });
}

export function canPublishLive({ decision, published_sha, candidate_sha, independent_final_review } = {}) {
  if (decision?.decision !== 'PROMOTE_TO_CANDIDATE') return false;
  const published = clean(published_sha).toLowerCase();
  const candidate = clean(candidate_sha || decision?.candidate_sha).toLowerCase();
  return Boolean(
    SHA40.test(published) &&
    SHA40.test(candidate) &&
    published === candidate &&
    clean(independent_final_review).toUpperCase() === 'PASS'
  );
}

export const B_MK_006 = Object.freeze({
  node: 'B-MK-006',
  deterministic_minimum: 0.96,
  llm_maximum: 0.04,
  llm_authority: 'ADVISORY_ONLY',
  required_stages: REQUIRED_STAGES,
  self_certifies_final: false,
});
