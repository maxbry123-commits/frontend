import assert from 'node:assert/strict';
import { createCapabilityRouter } from '../src/router/capability-router-v1.js';
import { createFactoryMCPBoundary, createFactoryApiBoundary } from '../src/mcp/factory-mcp-boundary-v1.js';

const calls = [];
const transports = {
  remote: async (request) => {
    calls.push(structuredClone(request));
    return { request_id: request.request_id, status: 'accepted', payload: { route_id: request.route_id } };
  },
  model: async (request) => {
    calls.push(structuredClone(request));
    return { request_id: request.request_id, status: 'completed', payload: { provider: request.provider, model: request.model } };
  },
};

const router = createCapabilityRouter({
  routes: [
    { id: 'api.remote.primary', capability: 'remote.run', kind: 'api', transport_id: 'remote', priority: 10 },
    { id: 'api.remote.fallback', capability: 'remote.run', kind: 'api', transport_id: 'remote', priority: 1 },
    { id: 'model.cerebras.gpt', capability: 'ai.generate', kind: 'model', transport_id: 'model', provider: 'cerebras', model: 'gpt-oss-120b', priority: 10 },
    { id: 'model.cerebras.gemma', capability: 'ai.generate', kind: 'model', transport_id: 'model', provider: 'cerebras', model: 'gemma-4-31b', priority: 5 },
  ],
  transports,
});

assert.equal(router.contract, 'tel.workflow/v3');
assert.equal(router.listRoutes().length, 4);

const deterministic = await router.route({
  request_id: 'req-001',
  capability: 'remote.run',
  secret_ref: 'secret://router/default',
  payload: { command: 'health' },
});
assert.equal(deterministic.route.id, 'api.remote.primary');
assert.equal(deterministic.status, 'accepted');
assert.equal(calls.at(-1).secret_ref, 'secret://router/default');

const model = await router.route({
  request_id: 'req-002',
  capability: 'ai.generate',
  provider: 'cerebras',
  model: 'gemma-4-31b',
  payload: { input: 'hello' },
});
assert.equal(model.route.id, 'model.cerebras.gemma');
assert.equal(model.payload.model, 'gemma-4-31b');

await assert.rejects(
  () => router.route({ request_id: 'req-secret', capability: 'remote.run', payload: { token: 'raw-secret' } }),
  /RAW_SECRET_REJECTED_USE_SECRET_REF/,
);
await assert.rejects(
  () => router.route({ capability: 'remote.run', payload: {} }),
  /request\.request_id required/,
);
await assert.rejects(
  () => router.route({ request_id: 'req-missing', capability: 'does.not.exist' }),
  /NO_ROUTE_FOR_CAPABILITY/,
);

const mcp = createFactoryMCPBoundary({
  router,
  tools: [
    { name: 'factory.remote.run', capability: 'remote.run', description: 'Execute an approved remote Factory action.' },
    { name: 'factory.ai.generate', capability: 'ai.generate', description: 'Route an approved model request.', provider: 'cerebras', model: 'gpt-oss-120b' },
  ],
});
assert.deepEqual(mcp.listTools().map((tool) => tool.name), ['factory.remote.run', 'factory.ai.generate']);
const mcpResult = await mcp.callTool({
  name: 'factory.ai.generate',
  request_id: 'mcp-001',
  arguments: { input: 'build ui' },
  secret_ref: 'secret://models/cerebras',
});
assert.equal(mcpResult.route.id, 'model.cerebras.gpt');
assert.equal(calls.at(-1).secret_ref, 'secret://models/cerebras');

await assert.rejects(
  () => mcp.callTool({ name: 'factory.not.registered', request_id: 'mcp-404', arguments: {} }),
  /MCP_TOOL_NOT_REGISTERED/,
);

const api = createFactoryApiBoundary({ router });
const apiResult = await api.invoke({ request_id: 'api-001', capability: 'remote.run', payload: { operation: 'status' } });
assert.equal(apiResult.route.id, 'api.remote.primary');

assert.throws(
  () => createCapabilityRouter({ routes: [
    { id: 'dup', capability: 'a', kind: 'api', transport_id: 'remote' },
    { id: 'dup', capability: 'b', kind: 'api', transport_id: 'remote' },
  ], transports }),
  /DUPLICATE_ROUTE_ID/,
);

console.log('mcp-router-v1: PASS');
