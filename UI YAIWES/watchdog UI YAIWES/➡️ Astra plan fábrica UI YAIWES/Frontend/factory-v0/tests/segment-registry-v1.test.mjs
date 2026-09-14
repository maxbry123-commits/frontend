import assert from 'node:assert/strict';
import {
  classifyFactoryPath,
  detectConcretePathCollisions,
  validateSegmentClaim,
} from '../src/segments/segment-registry-v1.js';

assert.deepEqual(classifyFactoryPath('index-v19.html'), { state: 'FROZEN', segmentId: null });
assert.deepEqual(classifyFactoryPath('index-v192.html'), { state: 'FROZEN', segmentId: null });
assert.deepEqual(classifyFactoryPath('src/ui/workspace-shell-v2.js'), { state: 'OWNED', segmentId: 'SEG-01-SHELL' });
assert.deepEqual(classifyFactoryPath('src/ui/component-browser-v2.js'), { state: 'OWNED', segmentId: 'SEG-02-BROWSER' });
assert.deepEqual(classifyFactoryPath('src/touch-dnd-v193.js'), { state: 'OWNED', segmentId: 'SEG-04-TOUCH' });
assert.deepEqual(classifyFactoryPath('src/frontend-router-bridge.js'), { state: 'OWNED', segmentId: 'SEG-08-AI-ROUTER' });
assert.deepEqual(classifyFactoryPath('src/hf-jobs-panel-v2.js'), { state: 'OWNED', segmentId: 'SEG-09-HF-JOBS' });
assert.deepEqual(classifyFactoryPath('index-v193.html'), { state: 'OWNED', segmentId: 'SEG-11-INTEGRATOR' });

assert.equal(validateSegmentClaim({
  segmentId: 'SEG-01-SHELL',
  paths: ['src/ui/workspace-shell-v2.js', 'workspace-shell-v2.css'],
}).ok, true);

assert.equal(validateSegmentClaim({
  segmentId: 'SEG-01-SHELL',
  paths: ['src/ui/component-browser-v2.js'],
}).ok, false);

assert.equal(validateSegmentClaim({
  segmentId: 'SEG-11-INTEGRATOR',
  role: 'producer',
  paths: ['index-v193.html'],
}).reason, 'INTEGRATOR_ONLY');

assert.equal(validateSegmentClaim({
  segmentId: 'SEG-11-INTEGRATOR',
  role: 'integrator',
  paths: ['index-v193.html'],
}).ok, true);

assert.deepEqual(detectConcretePathCollisions([
  { nodeId: 'A', paths: ['src/ui/workspace-shell-v2.js'] },
  { nodeId: 'B', paths: ['src/ui/component-browser-v2.js'] },
]), []);

assert.deepEqual(detectConcretePathCollisions([
  { nodeId: 'A', paths: ['src/ui/workspace-shell-v2.js'] },
  { nodeId: 'B', paths: ['src/ui/workspace-shell-v2.js'] },
]), [{ path: 'src/ui/workspace-shell-v2.js', nodes: ['A', 'B'] }]);

console.log('segment-registry-v1: PASS');
