import {
  FABLES_CONTRACT,
  registerPlugin,
  unregisterPlugin,
  setPluginEnabled,
  listPlugins,
  findPlugins,
  invokePlugin,
  healthPlugin,
  getFablesTrace,
} from '../../evolution/fables-plugin-bus-v1.js';

const ACTION_SCHEMA = 'yaiwes.capability.action/v1';
const PORT_SCHEMA = 'yaiwes.capability.port/v1';
const clean = (value) => String(value ?? '').trim();

function freezeList(values = []) {
  return Object.freeze([...new Set(values.map(clean).filter(Boolean))]);
}

function validateAction(action, capability, allowedActions) {
  if (!action || typeof action !== 'object') throw new TypeError('CAPABILITY_ACTION_REQUIRED');
  if (action.schema !== ACTION_SCHEMA) throw new TypeError('CAPABILITY_ACTION_SCHEMA_INVALID');
  if (clean(action.capability) !== capability) throw new Error('CAPABILITY_ACTION_MISMATCH');
  const type = clean(action.type);
  if (!type) throw new TypeError('CAPABILITY_ACTION_TYPE_REQUIRED');
  if (!allowedActions.includes(type)) throw new Error(`CAPABILITY_ACTION_NOT_ALLOWED:${type}`);
  return Object.freeze({ ...structuredClone(action), capability, type, schema: ACTION_SCHEMA });
}

export function registerCapabilityPlugin({ manifest, allowedActions, adapter } = {}) {
  const actions = freezeList(allowedActions);
  if (!actions.length) throw new TypeError('CAPABILITY_ALLOWED_ACTIONS_REQUIRED');
  if (!manifest || typeof manifest !== 'object') throw new TypeError('CAPABILITY_MANIFEST_REQUIRED');
  if (!Array.isArray(manifest.capabilities) || !manifest.capabilities.length) {
    throw new TypeError('CAPABILITY_MANIFEST_CAPABILITIES_REQUIRED');
  }
  if (!adapter || typeof adapter.invoke !== 'function') throw new TypeError('CAPABILITY_ADAPTER_INVOKE_REQUIRED');

  const wrapped = Object.freeze({
    async invoke(action) {
      const capability = clean(action?.capability);
      if (!manifest.capabilities.map(clean).includes(capability)) throw new Error('CAPABILITY_NOT_DECLARED_BY_PLUGIN');
      const typed = validateAction(action, capability, actions);
      return adapter.invoke(structuredClone(typed));
    },
    ...(typeof adapter.health === 'function' ? { health: () => adapter.health() } : {}),
  });

  const pluginId = registerPlugin(manifest, wrapped);
  return Object.freeze({
    schema: PORT_SCHEMA,
    plugin_id: pluginId,
    capabilities: freezeList(manifest.capabilities),
    allowed_actions: actions,
  });
}

export function createCapabilityPort({ pluginId, capability, allowedActions } = {}) {
  const id = clean(pluginId);
  const cap = clean(capability);
  const actions = freezeList(allowedActions);
  if (!id) throw new TypeError('CAPABILITY_PLUGIN_ID_REQUIRED');
  if (!cap) throw new TypeError('CAPABILITY_REQUIRED');
  if (!actions.length) throw new TypeError('CAPABILITY_ALLOWED_ACTIONS_REQUIRED');

  return Object.freeze({
    schema: PORT_SCHEMA,
    plugin_id: id,
    capability: cap,
    allowed_actions: actions,
    async invoke(action) {
      const typed = validateAction(action, cap, actions);
      const plugin = listPlugins().find((entry) => entry.manifest.id === id);
      if (!plugin) throw new Error(`CAPABILITY_PLUGIN_NOT_FOUND:${id}`);
      if (!plugin.enabled) throw new Error(`CAPABILITY_PLUGIN_DISABLED:${id}`);
      if (!plugin.manifest.capabilities.includes(cap)) throw new Error(`CAPABILITY_PLUGIN_MISMATCH:${cap}`);
      return invokePlugin(id, typed);
    },
    async health() {
      return healthPlugin(id);
    },
  });
}

export {
  FABLES_CONTRACT,
  ACTION_SCHEMA,
  PORT_SCHEMA,
  unregisterPlugin,
  setPluginEnabled,
  listPlugins,
  findPlugins,
  getFablesTrace,
};

export const B_MK_004 = Object.freeze({
  node: 'B-MK-004',
  strategy: 'REUSE_FABLES_ADAPT_TYPED_PORT',
  invariant: 'ALL_CAPABILITY_CALLS_VIA_TYPED_FABLES_PORT',
  remote_eval: false,
});
