import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CANDIDATE_MODULES, CANDIDATE_CAPABILITIES } from '../../src/bootstrap/candidate-v193.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const html = fs.readFileSync(path.join(root, 'index-v193.html'), 'utf8');

assert.match(html, /YAIWES UI Factory V1\.9\.3/);
assert.equal((html.match(/candidate-v193\.js/g) || []).length, 1);
assert.equal((html.match(/app-v19\.js/g) || []).length, 0, 'entrypoint must load only the canonical bootstrap');
assert.match(html, /workspace-shell-v1\.css/);

const required = [
  './app-v19.js',
  './file-import-controller-v1.js',
  './json-roundtrip-v1.js',
  './touch-dnd-v192.js',
  './skill-activation-v1.js',
  './ui/workspace-shell-v1.js',
  './ui/component-browser-v1.js',
  './frontend-router-bridge.js',
  './layer-reorder-v1.js',
  './remote-control-v1.js',
  './hf-jobs-panel-v1.js',
];
for (const modulePath of required) {
  assert.equal(CANDIDATE_MODULES.filter((item) => item === modulePath).length, 1, `${modulePath} must be loaded exactly once`);
}

assert.equal(CANDIDATE_MODULES.filter((item) => /app-v\d+\.js$/.test(item)).length, 1, 'one editor state engine only');
assert.equal(CANDIDATE_CAPABILITIES.routerBridge, true);
assert.equal(CANDIDATE_CAPABILITIES.workspaceShell, true);
assert.equal(CANDIDATE_CAPABILITIES.componentBrowser, true);
assert.equal(CANDIDATE_CAPABILITIES.jsonRoundtrip, true);
assert.equal(CANDIDATE_CAPABILITIES.hfJobs, true);
assert.equal(CANDIDATE_CAPABILITIES.remoteControl, true);
assert.equal(CANDIDATE_CAPABILITIES.layers, true);
assert.equal(CANDIDATE_CAPABILITIES.skills, true);

console.log('canonical-v193-static: PASS');
