import { createCapabilityRouter } from '../../router/capability-router-v1.js';
import { ACTION_SCHEMA } from '../bus/index.js';

const clean = (value) => String(value ?? '').trim();

function providerSets(routes, providerAllowlist = {}) {
  const byCapability = new Map();
  for (const route of routes) {
    const capability = clean(route?.capability);
    if (!capability) continue;
    if (!byCapability.has(capability)) byCapability.set(capability, new Set());
    const provider = clean(route?.provider);
    if (provider) byCapability.get(capability).add(provider);
  }
  for (const [capability, providers] of Object.entries(providerAllowlist || {})) {
    if (!byCapability.has(capability)) byCapability.set(capability, new Set());
    for (const provider of Array.isArray(providers) ? providers : [providers]) {
      const normalized = clean(provider);
      if (normalized) byCapability.get(capability).add(normalized);
    }
  }
  return byCapability;
}

function assertKnownProvider(knownProviders, capability, provider) {
  const requested = clean(provider);
  if (!requested) return;
  const known = knownProviders.get(clean(capability));
  if (!known || !known.has(requested)) throw new Error(`UNKNOWN_PROVIDER:${requested}`);
}

function resolvePort(ports, transportId, capability) {
  return ports[`${transportId}:${capability}`] || ports[capability] || ports[transportId] || null;
}

export function createMicrokernelCapabilityRouter({ routes = [], ports = {}, providerAllowlist = {} } = {}) {
  if (!Array.isArray(routes) || !routes.length) throw new TypeError('MICROKERNEL_ROUTES_REQUIRED');
  const knownProviders = providerSets(routes, providerAllowlist);
  const transports = {};

  for (const route of routes) {
    const transportId = clean(route?.transport_id ?? route?.transportId);
    const capability = clean(route?.capability);
    if (!transportId) throw new TypeError('MICROKERNEL_TRANSPORT_ID_REQUIRED');
    const routePort = resolvePort(ports, transportId, capability);
    if (!routePort || typeof routePort.invoke !== 'function') throw new TypeError(`MICROKERNEL_PORT_REQUIRED:${transportId}:${capability}`);
    if (routePort.capability && clean(routePort.capability) !== capability) {
      throw new Error(`MICROKERNEL_PORT_CAPABILITY_MISMATCH:${transportId}:${capability}`);
    }
    if (!transports[transportId]) {
      transports[transportId] = async (request) => {
        assertKnownProvider(knownProviders, request.capability, request.provider);
        const port = resolvePort(ports, transportId, clean(request.capability));
        if (!port || typeof port.invoke !== 'function') throw new Error(`MICROKERNEL_PORT_NOT_FOUND:${transportId}:${request.capability}`);
        if (port.capability && clean(port.capability) !== clean(request.capability)) {
          throw new Error(`MICROKERNEL_PORT_CAPABILITY_MISMATCH:${transportId}:${request.capability}`);
        }
        const operation = clean(request?.payload?.operation).toUpperCase();
        const type = operation === 'CANCEL' ? 'CANCEL' : 'ROUTE_REQUEST';
        const response = await port.invoke({
          schema: ACTION_SCHEMA,
          capability: request.capability,
          type,
          request_id: request.request_id,
          secret_ref: request.secret_ref || null,
          payload: structuredClone(request.payload ?? null),
          route: Object.freeze({
            id: request.route_id,
            kind: request.route_kind,
            provider: request.provider,
            model: request.model,
          }),
        });
        if (!response || typeof response !== 'object') throw new TypeError('MICROKERNEL_PORT_RESPONSE_REQUIRED');
        return {
          request_id: response.request_id || request.request_id,
          status: clean(response.status) || 'OK',
          payload: structuredClone(response.payload ?? response),
        };
      };
    }
  }

  const base = createCapabilityRouter({ routes, transports });
  return Object.freeze({
    contract: base.contract,
    listRoutes: () => base.listRoutes(),
    async route(input = {}) {
      assertKnownProvider(knownProviders, input.capability, input.provider);
      return base.route(input);
    },
    async cancel({ request_id, capability, provider, model, route_id, secret_ref } = {}) {
      const target = clean(request_id);
      if (!target) throw new TypeError('CANCEL_REQUEST_ID_REQUIRED');
      assertKnownProvider(knownProviders, capability, provider);
      return base.route({
        contract: base.contract,
        request_id: `cancel:${target}`,
        capability,
        provider,
        model,
        route_id,
        secret_ref,
        payload: { operation: 'CANCEL', target_request_id: target },
      });
    },
    async health() {
      const rows = [];
      for (const route of routes) {
        const transportId = clean(route.transport_id ?? route.transportId);
        const capability = clean(route.capability);
        const port = resolvePort(ports, transportId, capability);
        const detail = typeof port?.health === 'function' ? await port.health() : { ok: true, state: 'NO_HEALTH_PROBE' };
        rows.push({ route_id: clean(route.id), transport_id: transportId, capability, detail });
      }
      return Object.freeze({ ok: rows.every((row) => row.detail?.ok !== false), routes: base.listRoutes().length, results: rows });
    },
  });
}

export const B_MK_005_ROUTER = Object.freeze({
  node: 'B-MK-005',
  ingress: Object.freeze(['MCP', 'API']),
  secret_policy: 'SECRET_REF_ONLY',
  unknown_provider: 'FAIL_CLOSED',
  shared_transport_resolution: 'CAPABILITY_FIRST',
});
