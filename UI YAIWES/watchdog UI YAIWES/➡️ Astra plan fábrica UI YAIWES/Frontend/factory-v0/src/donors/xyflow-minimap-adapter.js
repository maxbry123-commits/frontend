import { XYFLOW_DONOR } from './xyflow-patterns.js';

const WIDTH = 180;
const HEIGHT = 120;
const PAD = 10;
const NS = 'http://www.w3.org/2000/svg';
let raf = 0;
let geometry = null;

function canvasZoom(canvas) {
  const raw = Number.parseFloat(canvas.style.getPropertyValue('--canvas-zoom') || '1');
  return Number.isFinite(raw) && raw > 0 ? raw : 1;
}

function ensureMiniMap() {
  const stage = document.querySelector('.canvas-stage');
  if (!stage) return null;
  let root = document.getElementById('yaiwes-minimap');
  if (root) return root;
  root = document.createElement('div');
  root.id = 'yaiwes-minimap';
  root.className = 'yaiwes-minimap';
  root.dataset.donor = XYFLOW_DONOR.name;
  root.innerHTML = `<div class="yaiwes-minimap__head"><span>MAPA</span><small>xyflow donor</small></div><svg class="yaiwes-minimap__svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-label="Minimapa del canvas"></svg>`;
  stage.appendChild(root);
  return root;
}

function ensureFitView() {
  const controls = document.querySelector('.canvas-controls');
  if (!controls || document.getElementById('fit-view')) return;
  const button = document.createElement('button');
  button.id = 'fit-view';
  button.type = 'button';
  button.textContent = 'Ajustar';
  button.title = 'Ajustar todos los elementos a la vista · patrón xyflow';
  button.dataset.donor = XYFLOW_DONOR.name;
  controls.appendChild(button);
}

function svgEl(name, attrs = {}) {
  const node = document.createElementNS(NS, name);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, String(value)));
  return node;
}

function readNodes(canvas) {
  return [...canvas.querySelectorAll('[data-node]')].map(node => ({
    id: node.dataset.node,
    x: Number.parseFloat(node.style.left) || 0,
    y: Number.parseFloat(node.style.top) || 0,
    w: Number.parseFloat(node.style.width) || node.offsetWidth || 1,
    h: Number.parseFloat(node.style.height) || node.offsetHeight || 1,
    selected: node.classList.contains('selected')
  }));
}

function model() {
  const canvas = document.getElementById('canvas');
  if (!canvas) return null;
  const zoom = canvasZoom(canvas);
  const nodes = readNodes(canvas);
  const view = {
    x: canvas.scrollLeft / zoom,
    y: canvas.scrollTop / zoom,
    w: Math.max(1, canvas.clientWidth / zoom),
    h: Math.max(1, canvas.clientHeight / zoom)
  };
  const minX = Math.min(view.x, ...nodes.map(n => n.x), 0);
  const minY = Math.min(view.y, ...nodes.map(n => n.y), 0);
  const maxX = Math.max(view.x + view.w, ...nodes.map(n => n.x + n.w), view.w);
  const maxY = Math.max(view.y + view.h, ...nodes.map(n => n.y + n.h), view.h);
  const worldW = Math.max(1, maxX - minX);
  const worldH = Math.max(1, maxY - minY);
  const scale = Math.min((WIDTH - PAD * 2) / worldW, (HEIGHT - PAD * 2) / worldH);
  const drawW = worldW * scale;
  const drawH = worldH * scale;
  const ox = (WIDTH - drawW) / 2 - minX * scale;
  const oy = (HEIGHT - drawH) / 2 - minY * scale;
  return { canvas, nodes, view, scale, ox, oy, minX, minY, worldW, worldH };
}

function render() {
  raf = 0;
  ensureFitView();
  const root = ensureMiniMap();
  const svg = root?.querySelector('svg');
  geometry = model();
  if (!svg || !geometry) return;
  svg.replaceChildren();

  const { nodes, view, scale, ox, oy } = geometry;
  if (!nodes.length) {
    const empty = svgEl('text', { x: WIDTH / 2, y: HEIGHT / 2, 'text-anchor': 'middle', class: 'yaiwes-minimap__empty' });
    empty.textContent = 'canvas vacío';
    svg.appendChild(empty);
    return;
  }

  const group = svgEl('g');
  nodes.forEach(item => {
    const rect = svgEl('rect', {
      x: ox + item.x * scale,
      y: oy + item.y * scale,
      width: Math.max(3, item.w * scale),
      height: Math.max(3, item.h * scale),
      rx: 2,
      class: item.selected ? 'yaiwes-minimap__node is-selected' : 'yaiwes-minimap__node',
      'data-minimap-node': item.id
    });
    group.appendChild(rect);
  });
  svg.appendChild(group);

  svg.appendChild(svgEl('rect', {
    x: ox + view.x * scale,
    y: oy + view.y * scale,
    width: Math.max(8, view.w * scale),
    height: Math.max(8, view.h * scale),
    rx: 3,
    class: 'yaiwes-minimap__viewport'
  }));
}

function schedule() {
  if (!raf) raf = requestAnimationFrame(render);
}

function fitView() {
  const canvas = document.getElementById('canvas');
  const nodes = canvas ? readNodes(canvas) : [];
  if (!canvas || !nodes.length) return;
  const minX = Math.min(...nodes.map(n => n.x));
  const minY = Math.min(...nodes.map(n => n.y));
  const maxX = Math.max(...nodes.map(n => n.x + n.w));
  const maxY = Math.max(...nodes.map(n => n.y + n.h));
  const contentW = Math.max(1, maxX - minX + 80);
  const contentH = Math.max(1, maxY - minY + 80);
  const target = Math.max(.5, Math.min(2, Math.floor(Math.min(canvas.clientWidth / contentW, canvas.clientHeight / contentH) * 10) / 10));

  document.getElementById('zoom-reset')?.click();
  const controlId = target < 1 ? 'zoom-out' : 'zoom-in';
  for (let i = 0; i < Math.round(Math.abs(target - 1) * 10); i += 1) document.getElementById(controlId)?.click();

  requestAnimationFrame(() => {
    const zoom = canvasZoom(canvas);
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    canvas.scrollTo({
      left: Math.max(0, centerX * zoom - canvas.clientWidth / 2),
      top: Math.max(0, centerY * zoom - canvas.clientHeight / 2),
      behavior: 'smooth'
    });
    schedule();
  });
}

function bindCanvas() {
  const canvas = document.getElementById('canvas');
  if (!canvas || canvas.dataset.minimapBound === '1') return;
  canvas.dataset.minimapBound = '1';
  canvas.addEventListener('scroll', schedule, { passive: true });
  new MutationObserver(schedule).observe(canvas, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
}

document.addEventListener('click', event => {
  if (event.target.closest?.('#fit-view')) {
    fitView();
    return;
  }
  const rect = event.target.closest?.('[data-minimap-node]');
  if (rect) {
    document.querySelector(`[data-node="${CSS.escape(rect.dataset.minimapNode)}"]`)?.click();
    schedule();
    return;
  }
  const svg = event.target.closest?.('.yaiwes-minimap__svg');
  if (!svg || !geometry) return;
  const box = svg.getBoundingClientRect();
  const px = (event.clientX - box.left) * WIDTH / box.width;
  const py = (event.clientY - box.top) * HEIGHT / box.height;
  const worldX = (px - geometry.ox) / geometry.scale;
  const worldY = (py - geometry.oy) / geometry.scale;
  const zoom = canvasZoom(geometry.canvas);
  geometry.canvas.scrollTo({
    left: Math.max(0, (worldX - geometry.view.w / 2) * zoom),
    top: Math.max(0, (worldY - geometry.view.h / 2) * zoom),
    behavior: 'smooth'
  });
});

document.addEventListener('DOMContentLoaded', () => { bindCanvas(); ensureFitView(); schedule(); });
window.addEventListener('resize', schedule);
queueMicrotask(() => { bindCanvas(); ensureFitView(); schedule(); });

window.__YAIWES_DONOR_EVIDENCE__ = Object.freeze({
  ...(window.__YAIWES_DONOR_EVIDENCE__ || {}),
  xyflowMinimap: { donor: XYFLOW_DONOR.name, sourceBlob: XYFLOW_DONOR.minimap.blob, mode: 'native-svg-adapter', capabilities: ['minimap', 'node-navigation', 'fit-view'] }
});
