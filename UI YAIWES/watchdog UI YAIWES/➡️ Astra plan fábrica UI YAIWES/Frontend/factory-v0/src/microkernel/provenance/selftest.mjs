import assert from 'node:assert/strict';
import { createAcquisitionRequest, CANONICAL_ACQUISITION } from '../acquisition/index.js';
import { B_MK_003, createProvenanceRecord, canPromoteProvenance } from './index.js';

const sourceRef = '0123456789abcdef0123456789abcdef01234567';
const request = createAcquisitionRequest({
  capabilityGap: true,
  capability: 'diagram-canvas',
  slug: 'diagram-component',
  sourceRepo: 'https://github.com/example/diagram-component',
  sourceRef,
  license: 'MIT',
  researchEvidence: 'B-MK-002:LOCAL_GAP_VERIFIED',
  localDedup: 'NO_EQUIVALENT_FOUND',
  requestedAt: '2026-09-14T09:35:00.000Z',
});
const receipt = {
  policy: CANONICAL_ACQUISITION.policy,
  state: 'VERIFIED',
  source_ref: sourceRef,
  destination_root: CANONICAL_ACQUISITION.destinationRoot,
  source_url_readback: request.component.source_repo,
  source_commit_readback: sourceRef,
  sha256_manifest: 'sha256:fixture-manifest',
  hash_readback: 'PASS',
  extraction_verified: true,
  git_lfs_used: false,
};

const record = createProvenanceRecord({
  request,
  receipt,
  adapter: 'DiagramAdapter/v1',
  test: 'diagram-adapter.selftest:PASS',
  readback: 'PASS',
  installedAt: '2026-09-14T09:36:00.000Z',
});
assert.equal(record.source_ref, sourceRef);
assert.equal(record.source_commit_readback, sourceRef);
assert.equal(record.license, 'MIT');
assert.equal(record.adapter, 'DiagramAdapter/v1');
assert.equal(record.readback, 'PASS');
assert.equal(canPromoteProvenance(record), true);

assert.throws(
  () => createProvenanceRecord({ ...{ request, receipt }, receipt: { ...receipt, source_commit_readback: 'ffffffffffffffffffffffffffffffffffffffff' }, adapter: 'DiagramAdapter/v1', test: 'PASS', readback: 'PASS', installedAt: '2026-09-14T09:36:00.000Z' }),
  /SOURCE_COMMIT_READBACK_MISMATCH/,
);
assert.throws(
  () => createProvenanceRecord({ request, receipt, adapter: '', test: 'PASS', readback: 'PASS', installedAt: '2026-09-14T09:36:00.000Z' }),
  /ADAPTER_REQUIRED/,
);
assert.equal(canPromoteProvenance({ ...record, hash_readback: 'FAIL' }), false);
assert.equal(canPromoteProvenance({ ...record, license: '' }), false);
assert.equal(canPromoteProvenance({ ...record, test: '' }), false);
assert.equal(B_MK_003.invariant, 'NO_PROMOTION_WITHOUT_VERIFIED_PROVENANCE');

console.log(JSON.stringify({ node: 'B-MK-003', status: 'PASS', assertions: 12, validPromotion: true, hashMismatchRejected: true, provenanceGapRejected: true }));
