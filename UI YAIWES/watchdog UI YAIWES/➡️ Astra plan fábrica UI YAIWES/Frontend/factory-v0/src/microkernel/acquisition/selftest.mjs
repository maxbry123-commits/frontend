import assert from 'node:assert/strict';
import {
  CANONICAL_ACQUISITION,
  createAcquisitionMicrokernel,
  createAcquisitionRequest,
  validateAcquisitionInput,
  validateCanonicalReceipt,
  B_MK_001,
} from './index.js';

const sourceRef = '0123456789abcdef0123456789abcdef01234567';
const validInput = {
  capabilityGap: true,
  capability: 'example-capability',
  slug: 'example-component',
  sourceRepo: 'https://github.com/example/example-component',
  sourceRef,
  license: 'MIT',
  researchEvidence: 'LOCAL_REGISTRY_GAP:example-capability',
  localDedup: 'NO_EQUIVALENT_FOUND',
  requestedAt: '2026-09-14T09:30:00.000Z',
};

assert.equal(B_MK_001.invariant, 'NO_ALTERNATE_DOWNLOADER');
assert.equal(validateAcquisitionInput(validInput).ok, true);
assert.equal(validateAcquisitionInput({ ...validInput, capabilityGap: false }).ok, false);
assert.throws(
  () => createAcquisitionRequest({ ...validInput, localDedup: 'SKIPPED' }),
  /LOCAL_DEDUP_REQUIRED/,
);
assert.throws(
  () => createAcquisitionRequest({ ...validInput, force: true }),
  /FORCE_FORBIDDEN/,
);

const request = createAcquisitionRequest(validInput);
assert.equal(request.policy, CANONICAL_ACQUISITION.policy);
assert.equal(request.component.source_ref, sourceRef);
assert.equal(request.engine.force, false);
assert.equal(request.engine.lfs, false);
assert.equal(request.engine.overwrite, false);

const verifiedReceipt = {
  policy: CANONICAL_ACQUISITION.policy,
  state: 'VERIFIED',
  source_ref: sourceRef,
  destination_root: CANONICAL_ACQUISITION.destinationRoot,
  source_url_readback: validInput.sourceRepo,
  source_commit_readback: sourceRef,
  sha256_manifest: 'sha256:fixture-only',
  hash_readback: 'PASS',
  extraction_verified: true,
  git_lfs_used: false,
};
assert.equal(validateCanonicalReceipt(verifiedReceipt, request).ok, true);
assert.equal(
  validateCanonicalReceipt({ ...verifiedReceipt, source_commit_readback: 'ffffffffffffffffffffffffffffffffffffffff' }, request).ok,
  false,
);

let blockedInvocationCount = 0;
const preGateKernel = createAcquisitionMicrokernel({
  canonicalMotorInvoke: async () => {
    blockedInvocationCount += 1;
    return verifiedReceipt;
  },
});
await assert.rejects(
  () => preGateKernel.acquire({ ...validInput, capabilityGap: false }),
  /CAPABILITY_GAP_NOT_PROVEN/,
);
assert.equal(blockedInvocationCount, 0);

let invocationCount = 0;
const kernel = createAcquisitionMicrokernel({
  canonicalMotorInvoke: async (receivedRequest) => {
    invocationCount += 1;
    assert.equal(receivedRequest.component.source_ref, sourceRef);
    return verifiedReceipt;
  },
});
const result = await kernel.acquire(validInput);
assert.equal(invocationCount, 1);
assert.equal(result.state, 'VERIFIED');
assert.equal(result.component.source_ref, sourceRef);

let rejectedInvocationCount = 0;
const rejectKernel = createAcquisitionMicrokernel({
  canonicalMotorInvoke: async () => {
    rejectedInvocationCount += 1;
    return { ...verifiedReceipt, hash_readback: 'FAIL' };
  },
});
await assert.rejects(() => rejectKernel.acquire(validInput), /HASH_READBACK_REQUIRED/);
assert.equal(rejectedInvocationCount, 1);

console.log(JSON.stringify({
  node: 'B-MK-001',
  status: 'PASS',
  strategy: B_MK_001.strategy,
  canonicalPolicy: CANONICAL_ACQUISITION.policy,
  assertions: 16,
  preGateBlockedInvocations: blockedInvocationCount,
  noAlternateDownloader: true,
  failClosed: true,
}));
