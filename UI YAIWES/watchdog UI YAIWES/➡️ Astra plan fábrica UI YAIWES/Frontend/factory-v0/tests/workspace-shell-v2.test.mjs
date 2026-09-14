import assert from 'node:assert/strict';
import {
  WORKSPACE_SHELL_VERSION,
  createShellState,
  isMobileWidth,
  mountWorkspaceShellV2,
  reduceShell,
} from '../src/ui/workspace-shell-v2.js';
import { classifyFactoryPath, validateSegmentClaim } from '../src/segments/segment-registry-v1.js';

assert.equal(WORKSPACE_SHELL_VERSION, 'v2');
assert.equal(isMobileWidth(760), true);
assert.equal(isMobileWidth(761), false);

const desktop = createShellState({ width: 1280 });
assert.equal(desktop.mode, 'desktop');
assert.equal(desktop.leftCollapsed, false);
assert.equal(desktop.rightCollapsed, false);

const mobile = createShellState({ width: 390 });
assert.equal(mobile.mode, 'mobile');
assert.equal(mobile.leftCollapsed, true);
assert.equal(mobile.rightCollapsed, true);

const opened = reduceShell(mobile, { type: 'TOGGLE', side: 'left' });
assert.equal(opened.leftCollapsed, false);
assert.equal(opened.userOverride, true);

const afterResize = reduceShell(opened, { type: 'RESIZE', width: 400 });
assert.equal(afterResize.leftCollapsed, false, 'user toggle survives mobile resize');
assert.equal(afterResize.mode, 'mobile');

const escaped = reduceShell(afterResize, { type: 'ESCAPE' });
assert.equal(escaped.leftCollapsed, true);
assert.equal(escaped.rightCollapsed, true);

const desktopResize = reduceShell(opened, { type: 'RESIZE', width: 1280 });
assert.equal(desktopResize.mode, 'desktop');
assert.equal(desktopResize.leftCollapsed, false, 'user override survives desktop resize');

assert.deepEqual(classifyFactoryPath('src/ui/workspace-shell-v2.js'), { state: 'OWNED', segmentId: 'SEG-01-SHELL' });
assert.deepEqual(classifyFactoryPath('workspace-shell-v2.css'), { state: 'OWNED', segmentId: 'SEG-01-SHELL' });
assert.deepEqual(classifyFactoryPath('src/ui/workspace-shell-v1.js'), { state: 'OWNED', segmentId: 'SEG-01-SHELL' });
assert.equal(validateSegmentClaim({
  segmentId: 'SEG-01-SHELL',
  paths: ['src/ui/workspace-shell-v2.js', 'workspace-shell-v2.css'],
}).ok, true);
assert.equal(validateSegmentClaim({
  segmentId: 'SEG-01-SHELL',
  paths: ['src/bootstrap/candidate-v193.js'],
}).ok, false);

function el(tag, className, attrs = {}) {
  const listeners = [];
  const node = {
    tagName: tag.toUpperCase(),
    className: className || '',
    classList: {
      tokens: new Set((className || '').split(/\s+/).filter(Boolean)),
      toggle(name, force) {
        if (force === false) this.tokens.delete(name);
        else if (force === true) this.tokens.add(name);
        else if (this.tokens.has(name)) this.tokens.delete(name);
        else this.tokens.add(name);
        node.className = [...this.tokens].join(' ');
      },
      contains(name) { return this.tokens.has(name); },
    },
    dataset: {},
    children: [],
    attributes: { ...attrs },
    hidden: false,
    parent: null,
    textContent: '',
    setAttribute(key, value) { this.attributes[key] = String(value); },
    getAttribute(key) { return this.attributes[key]; },
    append(...nodes) { nodes.forEach((child) => { child.parent = this; this.children.push(child); }); },
    prepend(...nodes) { nodes.forEach((child) => { child.parent = this; this.children.unshift(child); }); },
    addEventListener(type, fn) { listeners.push([type, fn]); },
    querySelector(sel) { return query(this, sel); },
    closest(sel) { return matches(this, sel) ? this : this.parent?.closest?.(sel) ?? null; },
    _listeners: listeners,
  };
  return node;
}

function matches(node, sel) {
  if (sel.startsWith('.')) return node.classList.contains(sel.slice(1));
  const data = sel.match(/^\[data-workspace-(\w+)(?:="([^"]+)")?\]$/);
  if (data) {
    const key = data[1] === 'overlay' ? 'workspaceOverlay' : data[1] === 'toggle' ? 'workspaceToggle' : data[1] === 'close' ? 'workspaceClose' : null;
    if (!key) return false;
    if (data[2]) return node.dataset[key] === data[2];
    return Boolean(node.dataset[key]);
  }
  return false;
}

function walk(node, acc = []) {
  acc.push(node);
  for (const child of node.children || []) walk(child, acc);
  return acc;
}

function query(root, sel) {
  return walk(root).find((node) => matches(node, sel)) || null;
}

const root = el('div', 'app-shell');
const studio = el('div', 'studio');
const library = el('aside', 'library-pane');
const canvas = el('section', 'canvas-pane');
const toolbar = el('div', 'canvas-toolbar');
const context = el('aside', 'context-pane');
canvas.append(toolbar);
studio.append(library, canvas, context);
root.append(studio);

const win = {
  innerWidth: 390,
  listeners: {},
  addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn); },
  removeEventListener(type, fn) { this.listeners[type] = (this.listeners[type] || []).filter((item) => item !== fn); },
  dispatchEvent() {},
};

const fakeDoc = {
  querySelector(sel) {
    if (sel === '.app-shell') return root;
    if (sel === '.studio') return studio;
    if (sel === '.library-pane') return library;
    if (sel === '.context-pane') return context;
    if (sel === '.canvas-toolbar') return toolbar;
    return query(root, sel);
  },
  createElement(tag) { return el(tag); },
};

const api = mountWorkspaceShellV2({ document: fakeDoc, window: win });
assert.equal(api.version, 'v2');
assert.equal(root.dataset.workspaceShell, 'v2');
assert.equal(root.dataset.workspaceMode, 'mobile');
assert.equal(api.getState().leftCollapsed, true);
assert.equal(api.getState().rightCollapsed, true);
assert.equal(library.getAttribute('aria-hidden'), 'true');

api.dispatch({ type: 'TOGGLE', side: 'left' });
assert.equal(api.getState().leftCollapsed, false);
assert.equal(library.getAttribute('aria-hidden'), 'false');
assert.equal(studio.classList.contains('workspace-left-collapsed'), false);

api.dispatch({ type: 'RESIZE', width: 390 });
assert.equal(api.getState().leftCollapsed, false, 'mounted shell keeps user drawer open across resize');

api.dispatch({ type: 'ESCAPE' });
assert.equal(api.getState().leftCollapsed, true);
assert.equal(api.getState().rightCollapsed, true);

console.log('workspace-shell-v2: PASS');
