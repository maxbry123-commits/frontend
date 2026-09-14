// YAIWES Factory frontend segment ownership registry v1.
// Coordination-only runtime-safe module. It does not mutate the historical entrypoints.

export const FROZEN_PATHS = Object.freeze([
  'index-v19.html',
  'index-v192.html',
]);

export const FRONTEND_SEGMENTS = Object.freeze([
  {
    id: 'SEG-01-SHELL',
    title: 'Shell / workspace',
    matchers: [/^src\/ui\/workspace-shell-v\d+\.js$/, /^workspace-shell-v\d+\.css$/],
  },
  {
    id: 'SEG-02-BROWSER',
    title: 'Component browser',
    matchers: [/^src\/ui\/component-browser-v\d+\.js$/],
  },
  {
    id: 'SEG-03-EDITOR-CORE',
    title: 'Canvas / editor core',
    matchers: [/^src\/app-v\d+\.js$/, /^src\/actions\.js$/],
  },
  {
    id: 'SEG-04-TOUCH',
    title: 'Touch / mobile',
    matchers: [/^src\/touch-dnd-v\d+\.js$/, /^src\/scroll-preserver\.js$/, /^src\/interaction-fix\.js$/],
  },
  {
    id: 'SEG-05-CONTROLS',
    title: 'Layers / resize / minimap / context menu',
    matchers: [
      /^src\/layer-reorder-v\d+\.js$/,
      /^src\/resize-snap\.js$/,
      /^src\/donors\/xyflow-minimap-adapter\.js$/,
      /^src\/donors\/frappe-context-menu-adapter\.js$/,
      /^resize-snap\.css$/,
      /^xyflow-minimap\.css$/,
      /^frappe-context-menu\.css$/,
    ],
  },
  {
    id: 'SEG-06-IO',
    title: 'Version / roundtrip / destinations',
    matchers: [
      /^src\/json-roundtrip-v\d+\.js$/,
      /^src\/version-store-v\d+\.js$/,
      /^src\/destination-roundtrip-v\d+\.js$/,
      /^src\/html-export-v\d+\.js$/,
    ],
  },
  {
    id: 'SEG-07-IMPORT',
    title: 'File / HTML / reference import',
    matchers: [/^src\/file-import-controller-v\d+\.js$/, /^src\/file-import-v\d+\.js$/],
  },
  {
    id: 'SEG-08-AI-ROUTER',
    title: 'AI / MCP / router / remote',
    matchers: [
      /^src\/frontend-router-bridge\.js$/,
      /^src\/backend-adapter\.js$/,
      /^src\/remote-control-v\d+\.js$/,
      /^src\/ai-router-[\w-]+\.js$/,
      /^src\/skill-activation-v\d+\.js$/,
    ],
  },
  {
    id: 'SEG-09-HF-JOBS',
    title: 'Hugging Face jobs panel',
    matchers: [/^src\/hf-jobs-panel-v\d+\.js$/],
  },
  {
    id: 'SEG-10-OSS',
    title: 'OSS donors / acquisition adapters',
    matchers: [/^src\/donors\//, /^src\/oss\//, /^src\/acquisition\//],
  },
  {
    id: 'SEG-11-INTEGRATOR',
    title: 'Canonical candidate integration only',
    matchers: [/^index-v(?:19[3-9]|[2-9]\d{2,})\.html$/, /^src\/bootstrap\/candidate-v\d+\.js$/],
    integratorOnly: true,
  },
]);

export function classifyFactoryPath(path) {
  const clean = String(path || '').replace(/^\.\//, '');
  if (FROZEN_PATHS.includes(clean)) return { state: 'FROZEN', segmentId: null };
  const matches = FRONTEND_SEGMENTS.filter((segment) => segment.matchers.some((matcher) => matcher.test(clean)));
  if (matches.length === 1) return { state: 'OWNED', segmentId: matches[0].id };
  if (matches.length === 0) return { state: 'UNMAPPED', segmentId: null };
  return { state: 'COLLISION', segmentId: matches.map((item) => item.id) };
}

export function validateSegmentClaim({ segmentId, paths = [], role = 'producer' } = {}) {
  const segment = FRONTEND_SEGMENTS.find((item) => item.id === segmentId);
  if (!segment) return { ok: false, reason: 'UNKNOWN_SEGMENT' };
  if (segment.integratorOnly && role !== 'integrator') return { ok: false, reason: 'INTEGRATOR_ONLY' };
  if (!Array.isArray(paths) || paths.length === 0) return { ok: false, reason: 'EMPTY_PATHS' };

  const checks = paths.map((path) => ({ path, ...classifyFactoryPath(path) }));
  const invalid = checks.filter((item) => item.state !== 'OWNED' || item.segmentId !== segmentId);
  if (invalid.length) return { ok: false, reason: 'WRITE_SCOPE_VIOLATION', invalid, checks };
  return { ok: true, segmentId, checks };
}

export function detectConcretePathCollisions(claims = []) {
  const ownerByPath = new Map();
  const collisions = [];
  for (const claim of claims) {
    for (const path of claim.paths || []) {
      const existing = ownerByPath.get(path);
      if (existing && existing !== claim.nodeId) collisions.push({ path, nodes: [existing, claim.nodeId] });
      else ownerByPath.set(path, claim.nodeId);
    }
  }
  return collisions;
}
