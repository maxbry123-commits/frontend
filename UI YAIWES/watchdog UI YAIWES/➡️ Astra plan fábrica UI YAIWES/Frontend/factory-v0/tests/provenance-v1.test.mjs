import assert from 'node:assert/strict';
import { createAcquisitionRequest, CANONICAL_ACQUISITION } from '../src/acquisition/microkernel-v1/acquisition-contract-v1.js';
import { canPromoteProvenance, createProvenanceRecord } from '../src/acquisition/provenance-v1/provenance-v1.js';

const input = {
  capabilityGap: true,
  capability: 'design-asset-browser',
  slug: 'Example OSS',
  sourceRepo: 'https://github.com/example/example-oss',
  sourceRef: 'fedcba9876543210fedcba9876543210fedcba98',
  license: 'MIT',
  localDedup: 'NO_EQUIVALENT_FOUND',
  researchEvidence: 'project-memory/research/F-BE-079-example.json',
  requestedAt: '2026-09-14T09:00:00Z',
};
const request = createAcquisitionRequest(input);
const receipt = {
  policy: CANONICAL_ACQUISITION.policy,
  state: 'VERIFIED',
  source_ref: input.sourceRef,
  destination_root: CANONICAL_ACQUISITION.destinationRoot,
  source_url_readback: input.sourceRepo,
  source_commit_readback: input.sourceRef,
  sha256_manifest: 'SOURCE_SHA256SUMS.txt',
  hash_readback: 'PASS',
  extraction_verified: true,
  git_lfs_used: false,
};

const provenance = createProvenanceRecord({
  request,
  receipt,
  adapter: 'src/oss/example/adapter-v1.js',
  test: 'tests/example-adapter-v1.test.mjs:PASS',
  readback: 'PASS',
  installedAt: '2026-09-14T09:01:00Z',
});
assert.equal(provenance.source_ref, input.sourceRef);
assert.equal(provenance.source_commit_readback, input.sourceRef);
assert.equal(provenance.license, 'MIT');
assert.equal(provenance.readback, 'PASS');
assert.equal(canPromoteProvenance(provenance), true);
assert.equal(canPromoteProvenance({ ...provenance, test: '' }), false);
assert.equal(canPromoteProvenance({ ...provenance, source_commit_readback: '0'.repeat(40) }), false);
assert.throws(() => createProvenanceRecord({
  request,
  receipt: { ...receipt, extraction_verified: false },
  adapter: 'adapter.js',
  test: 'PASS',
  readback: 'PASS',
  installedAt: '2026-09-14T09:01:00Z',
}), /PROVENANCE_REJECTED/);
assert.throws(() => createProvenanceRecord({
  request,
  receipt,
  adapter: '',
  test: 'PASS',
  readback: 'PASS',
  installedAt: '2026-09-14T09:01:00Z',
}), /ADAPTER_REQUIRED/);

console.log('provenance-v1: PASS');
