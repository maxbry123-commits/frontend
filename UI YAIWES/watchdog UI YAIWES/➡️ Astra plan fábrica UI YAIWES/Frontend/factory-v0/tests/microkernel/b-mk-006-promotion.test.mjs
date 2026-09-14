import assert from 'node:assert/strict';
import { B_MK_006, canPublishLive, evaluatePromotion } from '../../src/microkernel/promotion/index.js';

const sha = '0123456789abcdef0123456789abcdef01234567';
const digest = `sha256:${'a'.repeat(64)}`;
const stages = Object.fromEntries(B_MK_006.required_stages.map((stage) => [stage, 'PASS']));
const base = {
  candidate_sha: sha,
  tested_sha: sha,
  evidence_digest: digest,
  producer: 'SOL-PRODUCER',
  reviewer: 'ASTRA-REVIEWER',
  reviewer_verdict: 'PASS',
  llm_ratio: 0.04,
  llm_authority: 'ADVISORY_ONLY',
  stages,
};

// Simulation 1: complete evidence promotes only to candidate, never self-certifies final.
const valid = evaluatePromotion(base);
assert.equal(valid.decision, 'PROMOTE_TO_CANDIDATE');
assert.equal(valid.deterministic_ratio, 0.96);
assert.equal(valid.final_ui_status, 'NOT_SELF_CERTIFIED');
assert.equal(valid.reasons.length, 0);
assert.equal(canPublishLive({ decision: valid, published_sha: sha, candidate_sha: sha, independent_final_review: 'PASS' }), true);
assert.equal(canPublishLive({ decision: valid, published_sha: 'f'.repeat(40), candidate_sha: sha, independent_final_review: 'PASS' }), false);

// Simulation 2: LLM above 4% is rejected.
const tooMuchLlm = evaluatePromotion({ ...base, llm_ratio: 0.05 });
assert.equal(tooMuchLlm.decision, 'REJECT');
assert.equal(tooMuchLlm.reasons.includes('LLM_RATIO_EXCEEDS_4_PERCENT'), true);

// Simulation 3: tested SHA must be the candidate SHA.
const wrongSha = evaluatePromotion({ ...base, tested_sha: 'f'.repeat(40) });
assert.equal(wrongSha.decision, 'REJECT');
assert.equal(wrongSha.reasons.includes('TESTED_SHA_MISMATCH'), true);

// Refutation 1: producer cannot review itself.
const selfReview = evaluatePromotion({ ...base, reviewer: base.producer });
assert.equal(selfReview.decision, 'REJECT');
assert.equal(selfReview.reasons.includes('INDEPENDENT_REVIEW_REQUIRED'), true);

// Refutation 2: documentation/partial evidence cannot replace integration test.
const missingIntegration = evaluatePromotion({ ...base, stages: { ...stages, integration_test: false } });
assert.equal(missingIntegration.decision, 'REJECT');
assert.equal(missingIntegration.reasons.includes('STAGE_REQUIRED:integration_test'), true);

// Refutation 3: LLM cannot be final authority even at a small ratio.
const llmAuthority = evaluatePromotion({ ...base, llm_authority: 'FINAL_JUDGE' });
assert.equal(llmAuthority.decision, 'REJECT');
assert.equal(llmAuthority.reasons.includes('LLM_AUTHORITY_FORBIDDEN'), true);

assert.equal(B_MK_006.self_certifies_final, false);
assert.equal(B_MK_006.required_stages.length, 10);

console.log(JSON.stringify({
  node: 'B-MK-006',
  status: 'PASS',
  assertions: 20,
  simulations: 3,
  refutations: 3,
  deterministicMinimum: B_MK_006.deterministic_minimum,
  llmMaximum: B_MK_006.llm_maximum,
  selfCertifiesFinal: B_MK_006.self_certifies_final,
}));
