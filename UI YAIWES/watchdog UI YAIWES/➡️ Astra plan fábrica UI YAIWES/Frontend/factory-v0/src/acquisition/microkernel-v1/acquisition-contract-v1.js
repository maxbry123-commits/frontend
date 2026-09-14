// Factory acquisition micro-kernel v1.
// IMPORTANT: this module DOES NOT download or extract anything itself.
// It validates a deterministic capability acquisition request and delegates execution
// to the pre-existing canonical YAIWES download/extract motor.

export const CANONICAL_ACQUISITION = Object.freeze({
  schema: 'yaiwes.factory.acquisition-request/v1',
  queueSchema: 'yaiwes.frontend.download-extract-queue.v1',
  contract: 'tel.workflow/v3',
  policy: 'CANONICAL_MOTOR2_DIRECT_PUBLISH_FAIL_CLOSED',
  destinationRoot: 'UI YAIWES/componentes open soure UI YAIWES',
  extractor: 'scripts/ui-yaiwes-grupo-a-14-20260906/extract_existing_parts.py',
  workflowReference: '.github/workflows-paused/ui-yaiwes-124-download-extract-20260906.yml',
  lfs: false,
  force: false,
  overwrite: false,
});

const SHA40 = /^[0-9a-f]{40}$/i;
const SAFE_SLUG = /^[A-Za-z0-9._ -]{1,120}$/;

function clean(value) {
  return String(value ?? '').trim();
}

function officialGithubRepo(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'github.com' && url.pathname.split('/').filter(Boolean).length >= 2;
  } catch {
    return false;
  }
}

export function validateAcquisitionInput(input = {}) {
  const errors = [];
  const capability = clean(input.capability);
  const slug = clean(input.slug);
  const sourceRepo = clean(input.sourceRepo);
  const sourceRef = clean(input.sourceRef);
  const license = clean(input.license);
  const researchEvidence = clean(input.researchEvidence);

  if (input.capabilityGap !== true) errors.push('CAPABILITY_GAP_NOT_PROVEN');
  if (!capability) errors.push('CAPABILITY_REQUIRED');
  if (!slug || !SAFE_SLUG.test(slug)) errors.push('INVALID_SLUG');
  if (!officialGithubRepo(sourceRepo)) errors.push('SOURCE_PROVIDER_GAP');
  if (!SHA40.test(sourceRef)) errors.push('PINNED_SOURCE_SHA_REQUIRED');
  if (!license) errors.push('LICENSE_REQUIRED');
  if (!researchEvidence) errors.push('RESEARCH_EVIDENCE_REQUIRED');
  if (input.localDedup !== 'NO_EQUIVALENT_FOUND') errors.push('LOCAL_DEDUP_REQUIRED');
  if (input.overwrite === true) errors.push('OVERWRITE_FORBIDDEN');
  if (input.gitLfs === true) errors.push('GIT_LFS_FORBIDDEN');
  if (input.force === true) errors.push('FORCE_FORBIDDEN');

  return Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) });
}

export function createAcquisitionRequest(input = {}) {
  const validation = validateAcquisitionInput(input);
  if (!validation.ok) {
    const error = new Error(`ACQUISITION_REQUEST_REJECTED:${validation.errors.join(',')}`);
    error.code = 'ACQUISITION_REQUEST_REJECTED';
    error.reasons = validation.errors;
    throw error;
  }

  return Object.freeze({
    schema: CANONICAL_ACQUISITION.schema,
    contract: CANONICAL_ACQUISITION.contract,
    action: 'CANONICAL_ACQUIRE',
    policy: CANONICAL_ACQUISITION.policy,
    capability: clean(input.capability),
    capability_gap: true,
    local_dedup: 'NO_EQUIVALENT_FOUND',
    research_evidence: clean(input.researchEvidence),
    component: Object.freeze({
      slug: clean(input.slug),
      source_repo: clean(input.sourceRepo),
      source_ref: clean(input.sourceRef).toLowerCase(),
      license: clean(input.license),
      destination_root: CANONICAL_ACQUISITION.destinationRoot,
    }),
    engine: Object.freeze({
      queue_schema: CANONICAL_ACQUISITION.queueSchema,
      extractor: CANONICAL_ACQUISITION.extractor,
      workflow_reference: CANONICAL_ACQUISITION.workflowReference,
      lfs: false,
      force: false,
      overwrite: false,
    }),
    requested_at: clean(input.requestedAt) || new Date().toISOString(),
  });
}

export function validateCanonicalReceipt(receipt = {}, request) {
  const errors = [];
  if (!request || request.schema !== CANONICAL_ACQUISITION.schema) errors.push('REQUEST_REQUIRED');
  if (receipt.policy !== CANONICAL_ACQUISITION.policy) errors.push('POLICY_MISMATCH');
  if (receipt.state !== 'VERIFIED') errors.push('ENGINE_NOT_VERIFIED');
  if (receipt.source_ref !== request?.component?.source_ref) errors.push('SOURCE_REF_MISMATCH');
  if (receipt.destination_root !== CANONICAL_ACQUISITION.destinationRoot) errors.push('DESTINATION_MISMATCH');
  if (!clean(receipt.source_url_readback)) errors.push('SOURCE_URL_READBACK_REQUIRED');
  if (!clean(receipt.source_commit_readback)) errors.push('SOURCE_COMMIT_READBACK_REQUIRED');
  if (receipt.source_commit_readback !== request?.component?.source_ref) errors.push('SOURCE_COMMIT_READBACK_MISMATCH');
  if (!clean(receipt.sha256_manifest)) errors.push('SHA256_MANIFEST_REQUIRED');
  if (receipt.hash_readback !== 'PASS') errors.push('HASH_READBACK_REQUIRED');
  if (receipt.extraction_verified !== true) errors.push('EXTRACTION_NOT_VERIFIED');
  if (receipt.git_lfs_used === true) errors.push('GIT_LFS_RECEIPT_FORBIDDEN');

  return Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) });
}

export function createAcquisitionMicrokernel({ canonicalMotorInvoke } = {}) {
  if (typeof canonicalMotorInvoke !== 'function') throw new TypeError('canonicalMotorInvoke function required');

  return Object.freeze({
    async acquire(input) {
      const request = createAcquisitionRequest(input);
      const receipt = await canonicalMotorInvoke(request);
      const validation = validateCanonicalReceipt(receipt, request);
      if (!validation.ok) {
        const error = new Error(`CANONICAL_MOTOR_RECEIPT_REJECTED:${validation.errors.join(',')}`);
        error.code = 'CANONICAL_MOTOR_RECEIPT_REJECTED';
        error.reasons = validation.errors;
        throw error;
      }
      return Object.freeze({
        schema: 'yaiwes.factory.acquisition-result/v1',
        state: 'VERIFIED',
        capability: request.capability,
        component: request.component,
        receipt: Object.freeze({ ...receipt }),
      });
    },
  });
}
