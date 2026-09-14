import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');

const registry = await import(pathToFileURL(path.join(root, 'src/segments/segment-registry-v1.js')).href);
const shell = await import(pathToFileURL(path.join(root, 'src/ui/workspace-shell-v2.js')).href);

const v1Js = path.join(root, 'src/ui/workspace-shell-v1.js');
const v1Css = path.join(root, 'workspace-shell-v1.css');
const v2Js = path.join(root, 'src/ui/workspace-shell-v2.js');
const v2Css = path.join(root, 'workspace-shell-v2.css');

assert.equal(fs.existsSync(v1Js), true, 'v1 js must remain');
assert.equal(fs.existsSync(v1Css), true, 'v1 css must remain');
assert.match(fs.readFileSync(v1Js, 'utf8'), /dataset\.workspaceShell = 'v1'/);
assert.match(fs.readFileSync(v1Js, 'utf8'), /addEventListener\('resize', syncMobileDefaults/);
assert.equal(fs.existsSync(v2Js), true);
assert.equal(fs.existsSync(v2Css), true);

assert.deepEqual(registry.classifyFactoryPath('src/ui/workspace-shell-v1.js'), { state: 'OWNED', segmentId: 'SEG-01-SHELL' });
assert.deepEqual(registry.classifyFactoryPath('src/ui/workspace-shell-v2.js'), { state: 'OWNED', segmentId: 'SEG-01-SHELL' });
assert.deepEqual(registry.classifyFactoryPath('workspace-shell-v2.css'), { state: 'OWNED', segmentId: 'SEG-01-SHELL' });
assert.equal(registry.classifyFactoryPath('index-v19.html').state, 'FROZEN');
assert.equal(registry.classifyFactoryPath('index-v192.html').state, 'FROZEN');
assert.equal(registry.classifyFactoryPath('src/bootstrap/candidate-v193.js').segmentId, 'SEG-11-INTEGRATOR');

const claim = registry.validateSegmentClaim({
  segmentId: 'SEG-01-SHELL',
  role: 'producer',
  paths: ['src/ui/workspace-shell-v2.js', 'workspace-shell-v2.css'],
});
assert.equal(claim.ok, true);

const integratorLeak = registry.validateSegmentClaim({
  segmentId: 'SEG-01-SHELL',
  role: 'producer',
  paths: ['src/ui/workspace-shell-v2.js', 'src/bootstrap/candidate-v193.js'],
});
assert.equal(integratorLeak.ok, false);

assert.equal(shell.WORKSPACE_SHELL_VERSION, 'v2');
assert.equal(shell.classifyViewportWidth(1440), 'desktop');
assert.equal(shell.classifyViewportWidth(760), 'mobile');
assert.equal(shell.classifyViewportWidth(412), 'mobile');
assert.deepEqual(shell.defaultCollapsedForMode('mobile'), { left: true, right: true });
assert.deepEqual(shell.defaultCollapsedForMode('desktop'), { left: false, right: false });

// GAP reproduction: v1 treated every resize as a mode default reset.
const v1ResizeWouldReset = (userLeftCollapsed, width) => {
  const mode = width <= 760 ? 'mobile' : 'desktop';
  return shell.defaultCollapsedForMode(mode).left !== userLeftCollapsed;
};
assert.equal(v1ResizeWouldReset(true, 1400), true, 'v1 would reopen a user-collapsed desktop drawer on any resize');
assert.equal(shell.shouldApplyModeDefaults('desktop', 'desktop'), false);
assert.equal(shell.shouldApplyModeDefaults('desktop', 'mobile'), true);

const remembered = { desktop: { left: true, right: false } };
assert.deepEqual(shell.resolveCollapsedForMode(remembered, 'desktop'), { left: true, right: false });
assert.deepEqual(shell.resolveCollapsedForMode(remembered, 'mobile'), { left: true, right: true });

assert.equal(shell.mountWorkspaceShell(undefined).reason, 'DOCUMENT_REQUIRED');

const v1Root = { dataset: { workspaceShell: 'v1' }, querySelector() { return this; } };
const fakeDoc = { querySelector: (sel) => (sel === '.app-shell' ? v1Root : { classList: { contains() { return false; }, toggle() {} }, dataset: {}, setAttribute() {}, prepend() {}, append() {} }) };
const skipped = shell.mountWorkspaceShell(fakeDoc);
assert.equal(skipped.reason, 'V1_PRESERVED');

console.log(JSON.stringify({
  status: 'PASS',
  schema: 'yaiwes.factory.shell-v2-test/v1',
  node_id: 'F-FE-066',
  segment_id: 'SEG-01-SHELL',
  preserved_v1: true,
  write_scope_ok: claim.ok,
  gap: 'v1_resize_resets_drawers',
  fix: 'matchMedia_mode_change_only',
}));
