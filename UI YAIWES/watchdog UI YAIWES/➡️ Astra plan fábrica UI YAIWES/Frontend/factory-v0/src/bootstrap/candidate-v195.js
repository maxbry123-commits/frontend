// Canonical YAIWES UI Factory candidate V1.9.5 bootstrap.
// Additive integration: preserves V1.9.4 shell/browser composition and replaces
// the candidate touch adapter with the released/tested SEG-04 touch-dnd-v193.
// Historical candidates and producer segment files remain immutable.

export const CANDIDATE_VERSION = '1.9.5';

export const CANDIDATE_MODULES = Object.freeze([
  '../app-v19.js',
  '../file-import-controller-v1.js',
  '../json-roundtrip-v1.js',
  '../touch-dnd-v193.js',
  '../interaction-fix.js',
  '../scroll-preserver.js',
  '../skill-activation-v1.js',
  '../donors/frappe-context-menu-adapter.js',
  '../resize-snap.js',
  '../donors/xyflow-minimap-adapter.js',
  '../ui/workspace-shell-v2.js',
  '../ui/component-browser-v2.js',
  '../frontend-router-bridge.js',
  '../layer-reorder-v1.js',
  '../remote-control-v1.js',
  '../hf-jobs-panel-v1.js',
]);

export const CANDIDATE_CAPABILITIES = Object.freeze({
  editorCore: 'app-v19',
  imports: true,
  jsonRoundtrip: true,
  versions: 'via-json-roundtrip-v1',
  destinations: 'via-json-roundtrip-v1',
  touch: 'touch-dnd-v193',
  skills: true,
  workspaceShell: 'v2',
  componentBrowser: 'v2',
  routerBridge: true,
  layers: true,
  remoteControl: true,
  hfJobs: true,
});

export async function bootCandidate({ importer = (specifier) => import(specifier) } = {}) {
  const loaded = [];
  for (const specifier of CANDIDATE_MODULES) {
    await importer(specifier);
    loaded.push(specifier);
  }
  const touchApi = globalThis.__YAIWES_TOUCH_DND_V193__;
  if (!touchApi || touchApi.version !== '1.9.3') {
    throw new Error('TOUCH_V193_NOT_MOUNTED');
  }
  if (globalThis.__YAIWES_TOUCH_DND_V192__) {
    throw new Error('TOUCH_V192_COLLISION');
  }
  const evidence = Object.freeze({
    schema: 'yaiwes.factory.candidate/v1',
    version: CANDIDATE_VERSION,
    modules: Object.freeze([...loaded]),
    capabilities: CANDIDATE_CAPABILITIES,
    touchRuntimeVersion: touchApi.version,
    bootedAt: new Date().toISOString(),
  });
  globalThis.__YAIWES_FACTORY_CANDIDATE_V195__ = evidence;
  return evidence;
}

if (typeof document !== 'undefined') {
  bootCandidate().catch((error) => {
    globalThis.__YAIWES_FACTORY_CANDIDATE_V195_ERROR__ = String(error?.stack || error);
    console.error('YAIWES_FACTORY_V195_BOOT_FAILED', error);
  });
}
