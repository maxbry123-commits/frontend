import assert from 'node:assert/strict';
import {
  CANONICAL_ACQUISITION,
  createAcquisitionMicrokernel,
  createAcquisitionRequest,
  validateAcquisitionInput,
  validateCanonicalReceipt,
} from '../src/acquisition/microkernel-v1/acquisition-contract-v1.js';

const base = {
  capabilityGap: true,
  capability: 'visual-layout-donor',
  slug: 'Example OSS',
  sourceRepo: 'https://github.com/example/example-oss',
  sourceRef: '0123456789abcdef0123456789abcdef01234567',
  license: 'MIT',
  localDedup: 'NO_EQUIVALENT_FOUND',
  researchEvidence: 'project-memory/research/F-BE-079-example.json',
  requestedAt: '2026-09-14T08:55:00Z',
};

assert.equal(validateAcquisitionInput(base).ok, true);
assert.equal(validateAcquisitionInput({ ...base, capabilityGap: false }).ok, false);
assert.ok(validateAcquisitionInput({ ...base, sourceRef: 'HEAD' }).errors.includes('PINNED_SOURCE_SHA_REQUIRED'));
assert.ok(validateAcquisitionInput({ ...base, localDedup: 'UNKNOWN' }).errors.includes('LOCAL_DEDUP_REQUIRED'));
assert.ok(validateAcquisitionInput({ ...base, sourceRepo: 'https://gitlab.com/example/repo' }).errors.includes('SOURCE_PROVIDER_GAP'));
assert.ok(validateAcquisitionInput({ ...base, gitLfs: true }).errors.includes('GIT_LFS_FORBIDDEN'));

const request = createAcquisitionRequest(base);
assert.equal(request.action, 'CANONICAL_ACQUIRE');
assert.equal(request.policy, 'CANONICAL_MOTOR2_DIRECT_PUBLISH_FAIL_CLOSED');
assert.equal(request.engine.extractor, 'scripts/ui-yaiwes-grupo-a-14-20260906/extract_existing_parts.py');
assert.equal(request.engine.lfs, false);
assert.equal(request.engine.force, false);
assert.equal(request.engine.overwrite, false);

const goodReceipt = {
  policy: CANONICAL_ACQUISITION.policy,
  state: 'VERIFIED',
  source_ref: base.sourceRef,
  destination_root: CANONICAL_ACQUISITION.destinationRoot,
  source_url_readback: base.sourceRepo,
  source_commit_readback: base.sourceRef,
  sha256_manifest: 'SOURCE_SHA256SUMS.txt',
  hash_readback: 'PASS',
  extraction_verified: true,
  git_lfs_used: false,
};

assert.equal(validateCanonicalReceipt(goodReceipt, request).ok, true);
assert.ok(validateCanonicalReceipt({ ...goodReceipt, state: 'PENDING' }, request).errors.includes('ENGINE_NOT_VERIFIED'));
assert.ok(validateCanonicalReceipt({ ...goodReceipt, extraction_verified: false }, request).errors.includes('EXTRACTION_NOT_VERIFIED'));

let receivedRequest = null;
const kernel = createAcquisitionMicrokernel({
  canonicalMotorInvoke: async (value) => {
    receivedRequest = value;
    return goodReceipt;
  },
});
const result = await kernel.acquire(base);
assert.equal(receivedRequest.action, 'CANONICAL_ACQUIRE');
assert.equal(result.state, 'VERIFIED');
assert.equal(result.component.source_ref, base.sourceRef);

const rejectingKernel = createAcquisitionMicrokernel({
  canonicalMotorInvoke: async () => ({ ...goodReceipt, hash_readback: 'FAIL' }),
});
await assert.rejects(() => rejectingKernel.acquire(base), /CANONICAL_MOTOR_RECEIPT_REJECTED/);

console.log('acquisition-microkernel-v1: PASS');
