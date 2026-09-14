import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');

const registry = await import(pathToFileURL(path.join(root, 'src/segments/segment-registry-v1.js')).href);
const bootstrap = await import(pathToFileURL(path.join(root, 'src/bootstrap/candidate-v193.js')).href);

assert.deepEqual([...registry.FROZEN_PATHS], ['index-v19.html', 'index-v192.html']);
assert.equal(registry.FRONTEND_SEGMENTS.length, 11);
assert.equal(registry.classifyFactoryPath('index-v19.html').state, 'FROZEN');
assert.equal(registry.classifyFactoryPath('index-v192.html').state, 'FROZEN');
assert.deepEqual(registry.classifyFactoryPath('src/ui/workspace-shell-v1.js'), { state: 'OWNED', segmentId: 'SEG-01-SHELL' });
assert.deepEqual(registry.classifyFactoryPath('src/ui/component-browser-v1.js'), { state: 'OWNED', segmentId: 'SEG-02-BROWSER' });
assert.deepEqual(registry.classifyFactoryPath('src/touch-dnd-v192.js'), { state: 'OWNED', segmentId: 'SEG-04-TOUCH' });
assert.deepEqual(registry.classifyFactoryPath('src/hf-jobs-panel-v1.js'), { state: 'OWNED', segmentId: 'SEG-09-HF-JOBS' });
assert.deepEqual(registry.classifyFactoryPath('src/bootstrap/candidate-v193.js'), { state: 'OWNED', segmentId: 'SEG-11-INTEGRATOR' });

const producerIntegratorClaim = registry.validateSegmentClaim({
  segmentId: 'SEG-11-INTEGRATOR',
  role: 'producer',
  paths: ['src/bootstrap/candidate-v193.js'],
});
assert.equal(producerIntegratorClaim.ok, false);
assert.equal(producerIntegratorClaim.reason, 'INTEGRATOR_ONLY');

const integratorClaim = registry.validateSegmentClaim({
  segmentId: 'SEG-11-INTEGRATOR',
  role: 'integrator',
  paths: ['src/bootstrap/candidate-v193.js', 'index-v193.html'],
});
assert.equal(integratorClaim.ok, true);

const requiredModules = [
  '../app-v19.js',
  '../file-import-controller-v1.js',
  '../json-roundtrip-v1.js',
  '../touch-dnd-v192.js',
  '../skill-activation-v1.js',
  '../ui/workspace-shell-v1.js',
  '../ui/component-browser-v1.js',
  '../frontend-router-bridge.js',
  '../layer-reorder-v1.js',
  '../remote-control-v1.js',
  '../hf-jobs-panel-v1.js',
];
for (const modulePath of requiredModules) {
  assert.ok(bootstrap.CANDIDATE_MODULES.includes(modulePath), `missing module ${modulePath}`);
}
assert.equal(bootstrap.CANDIDATE_CAPABILITIES.editorCore, 'app-v19');
assert.equal(bootstrap.CANDIDATE_CAPABILITIES.workspaceShell, true);
assert.equal(bootstrap.CANDIDATE_CAPABILITIES.componentBrowser, true);
assert.equal(bootstrap.CANDIDATE_CAPABILITIES.routerBridge, true);
assert.equal(bootstrap.CANDIDATE_CAPABILITIES.layers, true);
assert.equal(bootstrap.CANDIDATE_CAPABILITIES.hfJobs, true);

const preview = fs.readFileSync(path.join(root, 'index-v193-preview.html'), 'utf8');
const scripts = [...preview.matchAll(/<script[^>]+src="([^"]+)"/g)].map(match => match[1]);
assert.deepEqual(scripts, ['./src/bootstrap/candidate-v193.js']);
assert.match(preview, /data-candidate="v193-segmented-preview"/);

const v19 = fs.readFileSync(path.join(root, 'index-v19.html'), 'utf8');
const v192 = fs.readFileSync(path.join(root, 'index-v192.html'), 'utf8');
assert.match(v19, /YAIWES UI Factory V1\.9/);
assert.match(v192, /YAIWES UI Factory V1\.9\.2/);
assert.doesNotMatch(v19, /candidate-v193/);
assert.doesNotMatch(v192, /candidate-v193/);

console.log(JSON.stringify({
  status: 'PASS',
  schema: 'yaiwes.factory.segment-architecture-test/v1',
  candidate: bootstrap.CANDIDATE_VERSION,
  segments: registry.FRONTEND_SEGMENTS.length,
  frozen: [...registry.FROZEN_PATHS],
  convergedModules: requiredModules.length,
}));
