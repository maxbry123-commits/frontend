// B-MK-001 — thin compatibility adapter only.
// Reuses the already-audited acquisition micro-kernel; it deliberately contains
// no downloader, extractor, copier or mover implementation.

export {
  CANONICAL_ACQUISITION,
  validateAcquisitionInput,
  createAcquisitionRequest,
  validateCanonicalReceipt,
  createAcquisitionMicrokernel,
} from '../../acquisition/microkernel-v1/acquisition-contract-v1.js';

export const B_MK_001 = Object.freeze({
  node: 'B-MK-001',
  strategy: 'REUSE_EXISTING_ADAPT_NO_FORK',
  implementation: '../../acquisition/microkernel-v1/acquisition-contract-v1.js',
  invariant: 'NO_ALTERNATE_DOWNLOADER',
});
