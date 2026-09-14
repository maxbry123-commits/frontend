import assert from 'node:assert/strict';
import {
  ACTION_SCHEMA,
  B_MK_004,
  createCapabilityPort,
  getFablesTrace,
  registerCapabilityPlugin,
  setPluginEnabled,
  unregisterPlugin,
} from './index.js';

const pluginId = `b-mk-004-shadow-${Date.now()}`;
const capability = 'component.normalize';
let adapterCalls = 0;
let lastAction = null;
const coreState = { mutations: 0 };

const registration = registerCapabilityPlugin({
  manifest: {
    id: pluginId,
    version: '1.0.0-shadow',
    capabilities: [capability],
    transport: 'LOCAL',
    permissions: ['component:read'],
  },
  allowedActions: ['NORMALIZE'],
  adapter: {
    async invoke(action) {
      adapterCalls += 1;
      lastAction = action;
      return { ok: true, normalized: String(action.payload?.name || '').trim().toLowerCase() };
    },
    async health() {
      return { adapter: 'OK' };
    },
  },
});

assert.equal(registration.plugin_id, pluginId);
assert.equal(B_MK_004.remote_eval, false);
assert.equal(coreState.mutations, 0);

const port = createCapabilityPort({ pluginId, capability, allowedActions: ['NORMALIZE'] });
const result = await port.invoke({
  schema: ACTION_SCHEMA,
  capability,
  type: 'NORMALIZE',
  payload: { name: '  Button  ' },
});
assert.equal(result.ok, true);
assert.equal(result.normalized, 'button');
assert.equal(adapterCalls, 1);
assert.equal(lastAction.schema, ACTION_SCHEMA);
assert.equal(lastAction.capability, capability);
assert.equal(coreState.mutations, 0);

await assert.rejects(
  () => port.invoke({ schema: ACTION_SCHEMA, capability: 'core.mutate', type: 'NORMALIZE', payload: {} }),
  /CAPABILITY_ACTION_MISMATCH/,
);
assert.equal(adapterCalls, 1);

await assert.rejects(
  () => port.invoke({ schema: 'untyped', capability, type: 'NORMALIZE', payload: {} }),
  /CAPABILITY_ACTION_SCHEMA_INVALID/,
);
assert.equal(adapterCalls, 1);

await assert.rejects(
  () => port.invoke({ schema: ACTION_SCHEMA, capability, type: 'DELETE_CORE', payload: {} }),
  /CAPABILITY_ACTION_NOT_ALLOWED/,
);
assert.equal(adapterCalls, 1);

setPluginEnabled(pluginId, false);
await assert.rejects(
  () => port.invoke({ schema: ACTION_SCHEMA, capability, type: 'NORMALIZE', payload: {} }),
  /CAPABILITY_PLUGIN_DISABLED/,
);
assert.equal(adapterCalls, 1);

setPluginEnabled(pluginId, true);
const health = await port.health();
assert.equal(health.ok, true);
assert.equal(health.state, 'OK');

const trace = getFablesTrace().filter((row) => row.plugin_id === pluginId);
assert.equal(trace.some((row) => row.type === 'REGISTER'), true);
assert.equal(trace.some((row) => row.type === 'INVOKE_OK'), true);
assert.equal(trace.some((row) => row.type === 'DISABLE'), true);

assert.equal(unregisterPlugin(pluginId), true);
await assert.rejects(
  () => port.invoke({ schema: ACTION_SCHEMA, capability, type: 'NORMALIZE', payload: {} }),
  /CAPABILITY_PLUGIN_NOT_FOUND/,
);

console.log(JSON.stringify({
  node: 'B-MK-004',
  status: 'PASS',
  assertions: 20,
  adapterCalls,
  typedPort: true,
  mismatchedCapabilityBlocked: true,
  unknownActionBlocked: true,
  disabledPluginBlocked: true,
  remoteEval: false,
}));
