const clean = (value) => String(value ?? '').trim();

export function createFactoryAIRouter({ providers = {}, defaultProvider = '', defaultModel = '' } = {}) {
  const registry = new Map(Object.entries(providers));
  return {
    listProviders() { return [...registry.keys()]; },
    async route({ provider = defaultProvider, model = defaultModel, task_id = 'factory-ai', input } = {}) {
      const providerId = clean(provider);
      const modelId = clean(model);
      if (!providerId) throw new TypeError('AI provider required');
      if (!modelId) throw new TypeError('AI model required');
      const transport = registry.get(providerId);
      if (typeof transport !== 'function') throw new Error(`AI provider not configured: ${providerId}`);
      const request = Object.freeze({ contract: 'tel.workflow/v3', type: 'RUN_AI', task_id, provider: providerId, model: modelId, input: structuredClone(input ?? null) });
      const response = await transport(request);
      if (!response || typeof response !== 'object') throw new TypeError('AI provider response object required');
      return { type: 'AI_RESULT', task_id: response.task_id || task_id, provider: providerId, model: modelId, status: response.status || 'completed', payload: response.payload ?? null, trace: { request_type: request.type, contract: request.contract, provider: providerId, model: modelId } };
    }
  };
}

export function createFactoryAIRouterAdapter(router, id = 'factory-ai-router-fai017') {
  if (!router || typeof router.route !== 'function') throw new TypeError('AI router required');
  return {
    id,
    async invoke(action) {
      if (!action || action.type !== 'RUN_AI') throw new TypeError('RUN_AI action required');
      const result = await router.route({
        provider: action.payload?.provider,
        model: action.payload?.model,
        task_id: action.task_id,
        input: action.payload?.input
      });
      return {
        type: 'TASK_EVENT',
        task_id: result.task_id,
        action_type: action.type,
        status: result.status,
        payload: result
      };
    }
  };
}
