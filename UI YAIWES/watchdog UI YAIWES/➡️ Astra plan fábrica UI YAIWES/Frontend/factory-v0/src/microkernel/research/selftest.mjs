import assert from 'node:assert/strict';
import { B_MK_002, LOCAL_OSS_ROOT, decideCapabilitySource } from './index.js';

const refA = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
const refB = 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';

const local = [{
  name: 'Existing Editor Donor',
  capabilities: ['rich-text-editor', 'code-edit'],
  source_url: 'https://github.com/example/existing-editor',
  source_ref: refA,
  license: 'MIT',
  path: `${LOCAL_OSS_ROOT}/Existing Editor Donor`,
  integration_state: 'SOURCE_PRESENT',
  priority: 1,
}];
const external = [{
  name: 'Duplicate External Editor',
  capability: 'rich-text-editor',
  source_url: 'https://github.com/example/duplicate-editor',
  source_ref: refB,
  license: 'Apache-2.0',
  priority: 1,
}];

const reuse = decideCapabilitySource({ capability: 'rich text editor', localRegistry: local, externalCandidates: external });
assert.equal(reuse.action, 'REUSE_LOCAL');
assert.equal(reuse.reuse_mode, 'ADAPT_LOCAL');
assert.equal(reuse.component.source_ref, refA);
assert.equal(reuse.local_matches, 1);

const acquire = decideCapabilitySource({
  capability: 'diagram-canvas',
  localRegistry: local,
  externalCandidates: [{
    name: 'Diagram Candidate',
    capability: 'diagram canvas',
    source_url: 'https://github.com/example/diagram',
    source_ref: refB,
    license: 'MIT',
  }],
});
assert.equal(acquire.action, 'ACQUIRE_EXTERNAL');
assert.equal(acquire.local_dedup, 'NO_EQUIVALENT_FOUND');
assert.equal(acquire.component.source_ref, refB);

const noCandidate = decideCapabilitySource({ capability: 'unknown-capability', localRegistry: local, externalCandidates: [] });
assert.equal(noCandidate.action, 'REJECT');
assert.equal(noCandidate.reason, 'NO_VERIFIED_CANDIDATE');

const incompleteLocal = decideCapabilitySource({
  capability: 'terminal',
  localRegistry: [{ name: 'Local Terminal', capabilities: ['terminal'], source_url: 'https://github.com/example/terminal' }],
  externalCandidates: [{ name: 'External Terminal', capability: 'terminal', source_url: 'https://github.com/example/ext-terminal', source_ref: refB, license: 'MIT' }],
});
assert.equal(incompleteLocal.action, 'REJECT');
assert.equal(incompleteLocal.reason, 'LOCAL_PROVENANCE_GAP');

const invalidExternal = decideCapabilitySource({
  capability: 'sandbox',
  localRegistry: [],
  externalCandidates: [{ name: 'Unpinned', capability: 'sandbox', source_url: 'https://github.com/example/sandbox', source_ref: 'main', license: 'MIT' }],
});
assert.equal(invalidExternal.action, 'REJECT');
assert.equal(invalidExternal.reason, 'NO_VERIFIED_CANDIDATE');

const wiredLocal = decideCapabilitySource({
  capability: 'code-edit',
  localRegistry: [{ ...local[0], integration_state: 'WIRED' }],
  externalCandidates: external,
});
assert.equal(wiredLocal.action, 'REUSE_LOCAL');
assert.equal(wiredLocal.reuse_mode, 'USE_WIRED');

assert.equal(B_MK_002.policy, 'LOCAL_FIRST_FAIL_CLOSED');
console.log(JSON.stringify({ node: 'B-MK-002', status: 'PASS', assertions: 15, localFirst: true, duplicateDownloadBlocked: true, failClosedProvenance: true }));
