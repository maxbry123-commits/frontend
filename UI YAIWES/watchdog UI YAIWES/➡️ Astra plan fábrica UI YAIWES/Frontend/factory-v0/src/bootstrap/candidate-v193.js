// Canonical YAIWES UI Factory candidate V1.9.3 bootstrap.
// Historical entrypoints remain frozen. This file only composes already-existing modules.
// Module specifiers are relative to this file in src/bootstrap/, therefore Factory modules
// located in src/ must be addressed through ../ so browser/runtime resolution is real.

export const CANDIDATE_VERSION = '1.9.3';

export const CANDIDATE_MODULES = Object.freeze([
  '../app-v19.js',
  '../file-import-controller-v1.js',
  '../json-roundtrip-v1.js',
  '../touch-dnd-v192.js',
  '../interaction-fix.js',
  '../scroll-preserver.js',
  '../skill-activation-v1.js',
  '../donors/frappe-context-menu-adapter.js',
  '../resize-snap.js',
  '../donors/xyflow-minimap-adapter.js',
  '../ui/workspace-shell-v1.js',
  '../ui/component-browser-v1.js',
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
  touch: 'touch-dnd-v192',
  skills: true,
  workspaceShell: true,
  componentBrowser: true,
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
  const evidence = Object.freeze({
    schema: 'yaiwes.factory.candidate/v1',
    version: CANDIDATE_VERSION,
    modules: Object.freeze([...loaded]),
    capabilities: CANDIDATE_CAPABILITIES,
    bootedAt: new Date().toISOString(),
  });
  globalThis.__YAIWES_FACTORY_CANDIDATE_V193__ = evidence;
  return evidence;
}

if (typeof document !== 'undefined') {
  bootCandidate().catch((error) => {
    globalThis.__YAIWES_FACTORY_CANDIDATE_V193_ERROR__ = String(error?.stack || error);
    console.error('YAIWES_FACTORY_V193_BOOT_FAILED', error);
  });
}
