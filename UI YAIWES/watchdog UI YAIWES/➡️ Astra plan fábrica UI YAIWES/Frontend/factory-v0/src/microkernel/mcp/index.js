import {
  createFactoryApiBoundary,
  createFactoryMCPBoundary,
} from '../../mcp/factory-mcp-boundary-v1.js';

export function createMicrokernelIngress({ router, tools = [] } = {}) {
  if (!router || typeof router.route !== 'function' || typeof router.cancel !== 'function') {
    throw new TypeError('MICROKERNEL_ROUTER_REQUIRED');
  }
  const apiBase = createFactoryApiBoundary({ router });
  const mcp = createFactoryMCPBoundary({ router, tools });

  const api = Object.freeze({
    contract: apiBase.contract,
    invoke: (request) => apiBase.invoke(request),
    cancel: (request) => router.cancel(request),
    health: () => router.health(),
  });

  return Object.freeze({
    contract: 'tel.workflow/v3',
    ingress: Object.freeze(['MCP', 'API']),
    mcp,
    api,
    async health() {
      return router.health();
    },
  });
}

export const B_MK_005_INGRESS = Object.freeze({
  node: 'B-MK-005',
  external_ingress: Object.freeze(['MCP', 'API']),
  browser_secret_policy: 'SECRET_REF_ONLY',
  direct_plugin_access: false,
});
