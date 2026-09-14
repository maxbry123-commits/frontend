// B-MK-003 — compatibility adapter; reuse existing provenance implementation.
export { createProvenanceRecord, canPromoteProvenance } from '../../acquisition/provenance-v1/provenance-v1.js';

export const B_MK_003 = Object.freeze({
  node: 'B-MK-003',
  strategy: 'REUSE_EXISTING_ADAPT_NO_FORK',
  implementation: '../../acquisition/provenance-v1/provenance-v1.js',
  invariant: 'NO_PROMOTION_WITHOUT_VERIFIED_PROVENANCE',
});
