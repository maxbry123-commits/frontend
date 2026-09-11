const REQUIRED = ['id', 'invoke'];

export function assertAdapter(adapter) {
  if (!adapter || typeof adapter !== 'object') throw new TypeError('adapter object required');
  for (const key of REQUIRED) {
    if (!(key in adapter)) throw new TypeError(`adapter.${key} required`);
  }
  if (typeof adapter.id !== 'string' || !adapter.id) throw new TypeError('adapter.id must be non-empty string');
  if (typeof adapter.invoke !== 'function') throw new TypeError('adapter.invoke must be function');
  return adapter;
}

export function createBackendBoundary(initialAdapter) {
  let adapter = assertAdapter(initialAdapter);
  return {
    get adapterId() { return adapter.id; },
    setAdapter(next) { adapter = assertAdapter(next); return adapter.id; },
    async invoke(action) {
      if (!action || typeof action.type !== 'string' || !action.type) throw new TypeError('typed action required');
      const event = await adapter.invoke(structuredClone(action));
      if (!event || typeof event.type !== 'string') throw new TypeError('normalized event required');
      return { ...event, adapter_id: adapter.id };
    }
  };
}

export function createMockAdapter(id = 'mock-sol-compatible') {
  return {
    id,
    async invoke(action) {
      return {
        type: 'TASK_EVENT',
        task_id: action.task_id || 'factory-sim',
        action_type: action.type,
        status: 'accepted',
        payload: action.payload || null
      };
    }
  };
}

export function createSolContractAdapter({ transport, id = 'sol-contract-adapter' } = {}) {
  if (typeof transport !== 'function') throw new TypeError('transport function required');
  return {
    id,
    async invoke(action) {
      const request = {
        contract: 'tel.workflow/v3',
        action: structuredClone(action)
      };
      const response = await transport(request);
      if (!response || typeof response !== 'object') throw new TypeError('transport response object required');
      return {
        type: response.type || 'TASK_EVENT',
        task_id: response.task_id || action.task_id || 'factory-sim',
        action_type: response.action_type || action.type,
        status: response.status || 'accepted',
        payload: response.payload ?? action.payload ?? null
      };
    }
  };
}
