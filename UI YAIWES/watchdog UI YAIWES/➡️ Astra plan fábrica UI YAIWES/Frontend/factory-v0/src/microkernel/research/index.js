// B-MK-002 — deterministic local-first capability source decision.
// This module performs no network access. It prevents external acquisition while
// an equivalent local component exists and fails closed on missing provenance.

export const LOCAL_OSS_ROOT = 'UI YAIWES/componentes open soure UI YAIWES';
const SHA40 = /^[0-9a-f]{40}$/i;

const clean = (value) => String(value ?? '').trim();
const norm = (value) => clean(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function hasCapability(entry, requested) {
  const wanted = norm(requested);
  const capabilities = Array.isArray(entry?.capabilities) ? entry.capabilities : [];
  return capabilities.some((capability) => norm(capability) === wanted);
}

function provenance(entry) {
  const source = clean(entry?.source_url ?? entry?.sourceUrl ?? entry?.source_repo);
  const ref = clean(entry?.source_ref ?? entry?.sourceRef ?? entry?.version);
  const license = clean(entry?.license);
  return { source, ref, license, ok: Boolean(source && ref && license) };
}

function deterministicSort(entries = []) {
  return [...entries].sort((a, b) => {
    const aPriority = Number.isFinite(Number(a?.priority)) ? Number(a.priority) : Number.MAX_SAFE_INTEGER;
    const bPriority = Number.isFinite(Number(b?.priority)) ? Number(b.priority) : Number.MAX_SAFE_INTEGER;
    if (aPriority !== bPriority) return aPriority - bPriority;
    return clean(a?.name ?? a?.slug).localeCompare(clean(b?.name ?? b?.slug));
  });
}

function validExternal(candidate, requested) {
  const p = provenance(candidate);
  const candidateCapability = clean(candidate?.capability);
  return norm(candidateCapability) === norm(requested) && p.ok && SHA40.test(p.ref);
}

export function decideCapabilitySource({ capability, localRegistry = [], externalCandidates = [] } = {}) {
  const requested = clean(capability);
  if (!requested) {
    return Object.freeze({ action: 'REJECT', reason: 'CAPABILITY_REQUIRED' });
  }

  const localMatches = deterministicSort(localRegistry.filter((entry) => hasCapability(entry, requested)));
  if (localMatches.length > 0) {
    const selected = localMatches[0];
    const p = provenance(selected);
    if (!p.ok) {
      return Object.freeze({
        action: 'REJECT',
        reason: 'LOCAL_PROVENANCE_GAP',
        capability: requested,
        local_registry_root: LOCAL_OSS_ROOT,
        local_matches: localMatches.length,
        selected: clean(selected?.name ?? selected?.slug),
      });
    }

    const integrationState = clean(selected?.integration_state ?? selected?.integrationState ?? 'SOURCE_PRESENT');
    return Object.freeze({
      action: 'REUSE_LOCAL',
      reason: 'LOCAL_EQUIVALENT_FOUND',
      capability: requested,
      local_registry_root: LOCAL_OSS_ROOT,
      local_matches: localMatches.length,
      reuse_mode: integrationState === 'WIRED' ? 'USE_WIRED' : 'ADAPT_LOCAL',
      integration_state: integrationState,
      component: Object.freeze({
        name: clean(selected?.name ?? selected?.slug),
        source_url: p.source,
        source_ref: p.ref,
        license: p.license,
        path: clean(selected?.path),
      }),
    });
  }

  const validCandidates = deterministicSort(externalCandidates.filter((candidate) => validExternal(candidate, requested)));
  if (validCandidates.length === 0) {
    return Object.freeze({
      action: 'REJECT',
      reason: 'NO_VERIFIED_CANDIDATE',
      capability: requested,
      local_registry_root: LOCAL_OSS_ROOT,
    });
  }

  const selected = validCandidates[0];
  const p = provenance(selected);
  return Object.freeze({
    action: 'ACQUIRE_EXTERNAL',
    reason: 'LOCAL_GAP_VERIFIED',
    capability: requested,
    local_registry_root: LOCAL_OSS_ROOT,
    local_dedup: 'NO_EQUIVALENT_FOUND',
    component: Object.freeze({
      name: clean(selected?.name ?? selected?.slug),
      source_url: p.source,
      source_ref: p.ref.toLowerCase(),
      license: p.license,
    }),
  });
}

export const B_MK_002 = Object.freeze({
  node: 'B-MK-002',
  policy: 'LOCAL_FIRST_FAIL_CLOSED',
  llm_role: 'NONE_REQUIRED_FOR_DETERMINISTIC_GATE',
});
