const CONTRACT = 'tel.workflow/v3';
const ALLOWED_KINDS = new Set(['api', 'mcp', 'model']);
const RAW_SECRET_KEYS = /^(token|api[_-]?key|authorization|password|secret)$/i;

const clean = (value) => String(value ?? '').trim();

function containsRawSecret(value, seen = new Set()) {
  if (!value || typeof value !== 'object') return false;
  if (seen.has(value)) return false;
  seen.add(value);
  for (const [key, nested] of Object.entries(value)) {
    if (key !== 'secret_ref' && RAW_SECRET_KEYS.test(key)) return true;
    if (containsRawSecret(nested, seen)) return true;
  }
  return false;
}

function normalizeRoute(route) {
  if (!route || typeof route !== 'object') throw new TypeError('route object required');
  const id = clean(route.id);
  const capability = clean(route.capability);
  const kind = clean(route.kind).toLowerCase();
  const transportId = clean(route.transport_id || route.transportId);
  if (!id) throw new TypeError('route.id required');
  if (!capability) throw new TypeError('route.capability required');
  if (!ALLOWED_KINDS.has(kind)) throw new TypeError(`unsupported route.kind: ${kind || '<empty>'}`);
  if (!transportId) throw new TypeError('route.transport_id required');
  const priority = Number.isFinite(route.priority) ? Number(route.priority) : 0;
  return Object.freeze({
    id,
    capability,
    kind,
    transport_id: transportId,
    provider: clean(route.provider),
    model: clean(route.model),
    priority,
  });
}

function chooseRoute(routes, request) {
  const routeId = clean(request.route_id);
  const capability = clean(request.capability);
  const provider = clean(request.provider);
  const model = clean(request.model);
  if (!capability) throw new TypeError('request.capability required');

  let candidates = routes.filter((route) => route.capability === capability);
  if (routeId) candidates = candidates.filter((route) => route.id === routeId);
  if (provider) candidates = candidates.filter((route) => !route.provider || route.provider === provider);
  if (model) candidates = candidates.filter((route) => !route.model || route.model === model);
  if (!candidates.length) throw new Error(`NO_ROUTE_FOR_CAPABILITY:${capability}`);

  candidates.sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id));
  return candidates[0];
}

export function createCapabilityRouter({ routes = [], transports = {} } = {}) {
  if (!Array.isArray(routes) || !routes.length) throw new TypeError('at least one route required');
  const normalized = routes.map(normalizeRoute);
  const ids = new Set();
  for (const route of normalized) {
    if (ids.has(route.id)) throw new Error(`DUPLICATE_ROUTE_ID:${route.id}`);
    ids.add(route.id);
    if (typeof transports[route.transport_id] !== 'function') {
      throw new TypeError(`transport not configured: ${route.transport_id}`);
    }
  }

  return Object.freeze({
    contract: CONTRACT,
    listRoutes() {
      return normalized.map((route) => ({ ...route }));
    },
    async route(input = {}) {
      if (input.contract && input.contract !== CONTRACT) throw new Error(`CONTRACT_MISMATCH:${input.contract}`);
      if (containsRawSecret(input)) throw new Error('RAW_SECRET_REJECTED_USE_SECRET_REF');
      const requestId = clean(input.request_id);
      if (!requestId) throw new TypeError('request.request_id required');
      const selected = chooseRoute(normalized, input);
      const request = Object.freeze({
        contract: CONTRACT,
        type: 'CAPABILITY_REQUEST',
        request_id: requestId,
        capability: selected.capability,
        route_id: selected.id,
        route_kind: selected.kind,
        provider: clean(input.provider) || selected.provider || null,
        model: clean(input.model) || selected.model || null,
        secret_ref: clean(input.secret_ref) || null,
        payload: structuredClone(input.payload ?? null),
      });
      const response = await transports[selected.transport_id](request);
      if (!response || typeof response !== 'object') throw new TypeError('transport response object required');
      const status = clean(response.status);
      if (!status) throw new TypeError('transport response.status required');
      return Object.freeze({
        contract: CONTRACT,
        type: 'CAPABILITY_RESULT',
        request_id: response.request_id || request.request_id,
        capability: selected.capability,
        route: { ...selected },
        status,
        payload: structuredClone(response.payload ?? null),
      });
    },
  });
}

export const FACTORY_ROUTER_CONTRACT = CONTRACT;
