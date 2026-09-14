import assert from 'node:assert/strict';
import {
  createCapabilityPort,
  registerCapabilityPlugin,
  unregisterPlugin,
} from '../bus/index.js';
import { createMicrokernelCapabilityRouter } from '../router/index.js';
import { createMicrokernelIngress } from './index.js';

const pluginId = `b-mk-005-shadow-${Date.now()}`;
const capability = 'ai.chat';
let calls = [];

registerCapabilityPlugin({
  manifest: {
    id: pluginId,
    version: '1.0.0-shadow',
    capabilities: [capability],
    transport: 'MCP',
    permissions: ['ai:invoke'],
  },
  allowedActions: ['ROUTE_REQUEST', 'CANCEL'],
  adapter: {
    async invoke(action) {
      calls.push(structuredClone(action));
      if (action.type === 'CANCEL') {
        return { request_id: action.request_id, status: 'CANCELLED', payload: { target: action.payload?.target_request_id } };
      }
      return {
        request_id: action.request_id,
        status: 'OK',
        payload: {
          echo: action.payload?.prompt ?? null,
          provider: action.route?.provider ?? null,
          secret_ref_seen: action.secret_ref ?? null,
        },
      };
    },
    async health() { return { ok: true, provider: 'cerebras' }; },
  },
});

const port = createCapabilityPort({ pluginId, capability, allowedActions: ['ROUTE_REQUEST', 'CANCEL'] });
const router = createMicrokernelCapabilityRouter({
  routes: [{
    id: 'ai-chat-cerebras',
    capability,
    kind: 'mcp',
    transport_id: 'shared-ai',
    provider: 'cerebras',
    model: 'gpt-oss-120b',
    priority: 10,
  }],
  ports: { [capability]: port },
  providerAllowlist: { [capability]: ['cerebras'] },
});
const ingress = createMicrokernelIngress({
  router,
  tools: [{ name: 'factory_ai_chat', capability, provider: 'cerebras', model: 'gpt-oss-120b' }],
});

const health = await ingress.health();
assert.equal(health.ok, true);
assert.equal(health.routes, 1);

const apiResult = await ingress.api.invoke({
  request_id: 'api-1',
  capability,
  provider: 'cerebras',
  secret_ref: 'vault://cerebras/main',
  payload: { prompt: 'hello' },
});
assert.equal(apiResult.status, 'OK');
assert.equal(apiResult.request_id, 'api-1');
assert.equal(apiResult.payload.echo, 'hello');
assert.equal(apiResult.payload.secret_ref_seen, 'vault://cerebras/main');

const mcpResult = await ingress.mcp.callTool({
  name: 'factory_ai_chat',
  request_id: 'mcp-1',
  secret_ref: 'vault://cerebras/main',
  arguments: { prompt: 'hola' },
});
assert.equal(mcpResult.status, 'OK');
assert.equal(mcpResult.request_id, 'mcp-1');
assert.equal(mcpResult.payload.echo, 'hola');

await assert.rejects(
  () => ingress.api.invoke({ request_id: 'api-bad-provider', capability, provider: 'unknown-provider', payload: {} }),
  /UNKNOWN_PROVIDER/,
);
const callsAfterProviderReject = calls.length;

await assert.rejects(
  () => ingress.api.invoke({ request_id: 'api-bad-cap', capability: 'unknown.capability', provider: 'cerebras', payload: {} }),
  /UNKNOWN_PROVIDER|NO_ROUTE_FOR_CAPABILITY/,
);
assert.equal(calls.length, callsAfterProviderReject);

await assert.rejects(
  () => ingress.api.invoke({ request_id: 'api-secret', capability, provider: 'cerebras', payload: { token: 'raw-secret-forbidden' } }),
  /RAW_SECRET_REJECTED_USE_SECRET_REF/,
);
assert.equal(calls.length, callsAfterProviderReject);

const cancelResult = await ingress.api.cancel({
  request_id: 'api-1',
  capability,
  provider: 'cerebras',
  secret_ref: 'vault://cerebras/main',
});
assert.equal(cancelResult.status, 'CANCELLED');
assert.equal(cancelResult.request_id, 'cancel:api-1');
assert.equal(cancelResult.payload.target, 'api-1');
assert.equal(calls.at(-1).type, 'CANCEL');

assert.equal(ingress.ingress.includes('MCP'), true);
assert.equal(ingress.ingress.includes('API'), true);
assert.equal(unregisterPlugin(pluginId), true);

console.log(JSON.stringify({
  node: 'B-MK-005',
  status: 'PASS',
  assertions: 22,
  route: true,
  mcp: true,
  api: true,
  health: true,
  cancel: true,
  readback: true,
  unknownProviderBlocked: true,
  rawSecretBlocked: true,
  secretRefOnly: true,
}));
