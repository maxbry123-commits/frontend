const clean = (value) => String(value ?? '').trim();

function normalizeTool(tool) {
  if (!tool || typeof tool !== 'object') throw new TypeError('tool object required');
  const name = clean(tool.name);
  const capability = clean(tool.capability);
  if (!name) throw new TypeError('tool.name required');
  if (!capability) throw new TypeError('tool.capability required');
  return Object.freeze({
    name,
    capability,
    description: clean(tool.description),
    provider: clean(tool.provider),
    model: clean(tool.model),
  });
}

export function createFactoryMCPBoundary({ router, tools = [] } = {}) {
  if (!router || typeof router.route !== 'function' || typeof router.listRoutes !== 'function') {
    throw new TypeError('capability router required');
  }
  if (!Array.isArray(tools) || !tools.length) throw new TypeError('at least one MCP tool required');
  const registry = new Map();
  for (const tool of tools.map(normalizeTool)) {
    if (registry.has(tool.name)) throw new Error(`DUPLICATE_MCP_TOOL:${tool.name}`);
    const hasRoute = router.listRoutes().some((route) => route.capability === tool.capability);
    if (!hasRoute) throw new Error(`MCP_TOOL_WITHOUT_ROUTE:${tool.name}`);
    registry.set(tool.name, tool);
  }

  return Object.freeze({
    protocol: 'mcp',
    contract: 'tel.workflow/v3',
    listTools() {
      return [...registry.values()].map((tool) => ({
        name: tool.name,
        description: tool.description,
        capability: tool.capability,
      }));
    },
    async callTool({ name, request_id, arguments: args = {}, secret_ref = null } = {}) {
      const toolName = clean(name);
      const requestId = clean(request_id);
      if (!toolName) throw new TypeError('MCP tool name required');
      if (!requestId) throw new TypeError('MCP request_id required');
      const tool = registry.get(toolName);
      if (!tool) throw new Error(`MCP_TOOL_NOT_REGISTERED:${toolName}`);
      if (!args || typeof args !== 'object' || Array.isArray(args)) throw new TypeError('MCP arguments object required');
      return router.route({
        contract: 'tel.workflow/v3',
        request_id: requestId,
        capability: tool.capability,
        provider: clean(args.provider) || tool.provider || undefined,
        model: clean(args.model) || tool.model || undefined,
        secret_ref: clean(secret_ref) || undefined,
        payload: structuredClone(args),
      });
    },
  });
}

export function createFactoryApiBoundary({ router } = {}) {
  if (!router || typeof router.route !== 'function') throw new TypeError('capability router required');
  return Object.freeze({
    contract: 'tel.workflow/v3',
    async invoke({ request_id, capability, provider, model, route_id, secret_ref, payload } = {}) {
      return router.route({
        contract: 'tel.workflow/v3',
        request_id,
        capability,
        provider,
        model,
        route_id,
        secret_ref,
        payload,
      });
    },
  });
}
