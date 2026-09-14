import { CANONICAL_ACQUISITION, validateCanonicalReceipt } from '../microkernel-v1/acquisition-contract-v1.js';

const SHA40 = /^[0-9a-f]{40}$/i;

const text = value => String(value ?? '').trim();

export function createProvenanceRecord({ request, receipt, adapter, test, readback, installedAt } = {}) {
  const errors = [];
  const receiptValidation = validateCanonicalReceipt(receipt, request);
  if (!receiptValidation.ok) errors.push(...receiptValidation.errors);
  if (!request?.component?.source_repo) errors.push('SOURCE_URL_REQUIRED');
  if (!SHA40.test(request?.component?.source_ref || '')) errors.push('SOURCE_REF_REQUIRED');
  if (!request?.component?.license) errors.push('LICENSE_REQUIRED');
  if (!request?.component?.destination_root) errors.push('DESTINATION_REQUIRED');
  if (!request?.capability) errors.push('CAPABILITY_REQUIRED');
  if (!text(adapter)) errors.push('ADAPTER_REQUIRED');
  if (!text(test)) errors.push('TEST_REQUIRED');
  if (readback !== 'PASS') errors.push('READBACK_REQUIRED');
  if (!text(installedAt)) errors.push('INSTALLED_AT_REQUIRED');
  if (errors.length) {
    const error = new Error(`PROVENANCE_REJECTED:${[...new Set(errors)].join(',')}`);
    error.code = 'PROVENANCE_REJECTED';
    error.reasons = Object.freeze([...new Set(errors)]);
    throw error;
  }

  return Object.freeze({
    schema: 'yaiwes.factory.provenance/v1',
    policy: CANONICAL_ACQUISITION.policy,
    capability: request.capability,
    source_url: request.component.source_repo,
    source_ref: request.component.source_ref,
    source_commit_readback: receipt.source_commit_readback,
    sha256_manifest: receipt.sha256_manifest,
    hash_readback: receipt.hash_readback,
    license: request.component.license,
    destination: request.component.destination_root,
    slug: request.component.slug,
    adapter: text(adapter),
    test: text(test),
    extraction_verified: receipt.extraction_verified === true,
    readback: 'PASS',
    installed_at: text(installedAt),
  });
}

export function canPromoteProvenance(record = {}) {
  return Boolean(
    record.schema === 'yaiwes.factory.provenance/v1' &&
    record.policy === CANONICAL_ACQUISITION.policy &&
    SHA40.test(record.source_ref || '') &&
    record.source_commit_readback === record.source_ref &&
    text(record.sha256_manifest) &&
    record.hash_readback === 'PASS' &&
    record.extraction_verified === true &&
    record.readback === 'PASS' &&
    text(record.license) &&
    text(record.adapter) &&
    text(record.test) &&
    text(record.installed_at)
  );
}
