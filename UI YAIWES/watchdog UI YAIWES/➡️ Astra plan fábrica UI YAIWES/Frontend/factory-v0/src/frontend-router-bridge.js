import { createBackendBoundary, createSolContractAdapter } from './backend-adapter.js';

const CONFIG_KEY = 'yaiwes-factory-config-v13';

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function readRouterConfig(storage = globalThis.localStorage) {
  if (!storage) return null;
  try {
    const parsed = JSON.parse(storage.getItem(CONFIG_KEY) || '{}');
    return parsed?.remote || null;
  } catch {
    return null;
  }
}

export function buildAiAction({ goal, models = [], teamMode = 'single', remote = null } = {}) {
  const cleanGoal = String(goal || '').trim();
  if (!cleanGoal) throw new TypeError('AI goal required');
  return {
    type: 'RUN_TASK',
    task_id: `factory-ui-${Date.now()}`,
    payload: {
      schema: 'yaiwes.ai-job/v1',
      goal: cleanGoal,
      teamMode,
      models: models.map(model => ({
        name: model.name,
        role: model.role,
        endpoint: model.endpoint,
        secret_ref: model.secretRef || null
      })),
      remote: remote ? {
        protocol: remote.protocol,
        url: remote.url,
        secret_ref: remote.secretRef || null
      } : null
    }
  };
}

export function createRemoteTransport({ remote, fetchImpl = globalThis.fetch } = {}) {
  if (!remote || !isHttpUrl(remote.url)) throw new TypeError('valid remote http(s) URL required');
  if (typeof fetchImpl !== 'function') throw new TypeError('fetch implementation required');
  return async request => {
    const response = await fetchImpl(remote.url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(request)
    });
    if (!response || !response.ok) {
      throw new Error(`router HTTP ${response?.status ?? 'ERR'}`);
    }
    const body = await response.json();
    if (!body || typeof body !== 'object') throw new TypeError('router response object required');
    return body;
  };
}

export async function submitAiJob({ goal, config, fetchImpl = globalThis.fetch } = {}) {
  const remote = config?.remote || null;
  if (!remote) throw new TypeError('remote router config required');
  const transport = createRemoteTransport({ remote, fetchImpl });
  const boundary = createBackendBoundary(createSolContractAdapter({ transport, id: 'factory-frontend-router' }));
  const action = buildAiAction({
    goal,
    models: config?.models || [],
    teamMode: config?.teamMode || 'single',
    remote
  });
  return boundary.invoke(action);
}

export function installRouterBridge({ documentRef = globalThis.document, storage = globalThis.localStorage, fetchImpl = globalThis.fetch } = {}) {
  if (!documentRef?.addEventListener) return () => {};
  const handler = async event => {
    const button = event.target?.closest?.('#send-ai-job');
    if (!button) return;
    const status = documentRef.getElementById('delta-preview');
    const goal = documentRef.getElementById('ai-goal')?.value || '';
    let config = {};
    try { config = JSON.parse(storage?.getItem(CONFIG_KEY) || '{}'); } catch {}
    if (!config.remote) {
      if (status) status.textContent = 'ROUTER_STATUS=BLOCKED_NO_REMOTE';
      return;
    }
    try {
      if (status) status.textContent = 'ROUTER_STATUS=SENDING';
      const eventResult = await submitAiJob({ goal, config, fetchImpl });
      if (status) status.textContent = JSON.stringify({ router_status: 'ACCEPTED', event: eventResult }, null, 2);
    } catch (error) {
      if (status) status.textContent = `ROUTER_STATUS=ERROR ${error.message}`;
    }
  };
  documentRef.addEventListener('click', handler);
  return () => documentRef.removeEventListener('click', handler);
}

if (typeof document !== 'undefined') installRouterBridge();
