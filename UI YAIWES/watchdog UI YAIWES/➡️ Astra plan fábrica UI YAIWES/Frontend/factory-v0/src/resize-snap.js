import { CRAFTJS_DONOR } from './donors/craftjs-patterns.js';

const SNAP = 8;
const MIN_W = 100;
const MIN_H = 60;
let active = null;

const snap = value => Math.round(value / SNAP) * SNAP;

function canvasZoom() {
  const raw = Number.parseFloat(document.getElementById('canvas')?.style.getPropertyValue('--canvas-zoom') || '1');
  return Number.isFinite(raw) && raw > 0 ? raw : 1;
}

function commitSize(width, height, previousStep) {
  if (!['1', '2'].includes(previousStep)) document.querySelector('[data-step="1"]')?.click();
  let input = document.getElementById('prop-w');
  if (input) {
    input.value = String(width);
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }
  input = document.getElementById('prop-h');
  if (input) {
    input.value = String(height);
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }
  if (!['1', '2'].includes(previousStep)) document.querySelector(`[data-step="${previousStep}"]`)?.click();
}

document.addEventListener('pointerdown', event => {
  const node = event.target.closest('[data-node].selected');
  if (!node) return;
  const rect = node.getBoundingClientRect();
  const hit = event.clientX >= rect.right - 22 && event.clientY >= rect.bottom - 22;
  if (!hit) return;
  event.preventDefault();
  event.stopPropagation();
  active = {
    pointerId: event.pointerId,
    node,
    startX: event.clientX,
    startY: event.clientY,
    width: Number.parseFloat(node.style.width) || node.offsetWidth,
    height: Number.parseFloat(node.style.height) || node.offsetHeight,
    zoom: canvasZoom(),
    previousStep: document.querySelector('[data-step].active')?.dataset.step || '2'
  };
  node.classList.add('is-resizing');
}, true);

document.addEventListener('pointermove', event => {
  if (!active || event.pointerId !== active.pointerId) return;
  const width = Math.max(MIN_W, snap(active.width + (event.clientX - active.startX) / active.zoom));
  const height = Math.max(MIN_H, snap(active.height + (event.clientY - active.startY) / active.zoom));
  active.node.style.width = `${width}px`;
  active.node.style.height = `${height}px`;
}, true);

document.addEventListener('pointerup', event => {
  if (!active || event.pointerId !== active.pointerId) return;
  const done = active;
  const width = Math.max(MIN_W, snap(Number.parseFloat(done.node.style.width) || done.width));
  const height = Math.max(MIN_H, snap(Number.parseFloat(done.node.style.height) || done.height));
  done.node.classList.remove('is-resizing');
  active = null;
  commitSize(width, height, done.previousStep);
}, true);

window.__YAIWES_INTERACTIONS__ = Object.freeze({
  ...(window.__YAIWES_INTERACTIONS__ || {}),
  resize: {
    snap: SNAP,
    minWidth: MIN_W,
    minHeight: MIN_H,
    state: 'UPDATE_COMPONENT',
    donor: CRAFTJS_DONOR.name,
    sourceBlob: CRAFTJS_DONOR.sources.resizer.blob
  }
});
