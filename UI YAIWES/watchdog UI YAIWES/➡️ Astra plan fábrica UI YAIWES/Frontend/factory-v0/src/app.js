import { STEPS, initialState } from './state.js';
import { reduce } from './actions.js';
import { renderLucideIcon } from './donors/lucide-icons.js';

let state = structuredClone(initialState);
const $ = (id) => document.getElementById(id);

function dispatch(action) {
  state = reduce(state, action);
  render();
}

function renderSteps() {
  $('steps').innerHTML = STEPS.map(step => `<button class="step ${state.step === step.id ? 'active' : ''}" data-step="${step.id}">${step.title}</button>`).join('');
  document.querySelectorAll('[data-step]').forEach(btn => btn.onclick = () => dispatch({ type: 'SET_STEP', step: Number(btn.dataset.step) }));
}

function renderLibrary() {
  const items = [
    ['window', 'Ventana'], ['button', 'Botón'], ['selector', 'Selector'], ['segment', 'Segmento'], ['panel', 'Panel']
  ];
  $('component-library').innerHTML = items.map(([kind, label]) => `<button class="library-item" data-kind="${kind}" draggable="true">${label}</button>`).join('');
  $('new-component').innerHTML = `${renderLucideIcon('plus', { size: 16 })}<span>Crear componente</span>`;
  document.querySelectorAll('[data-kind]').forEach(btn => {
    btn.onclick = () => dispatch({ type: 'ADD_COMPONENT', kind: btn.dataset.kind, label: btn.textContent });
    btn.ondragstart = e => e.dataTransfer.setData('text/yaiwes-kind', btn.dataset.kind);
  });
}

function renderCanvas() {
  $('canvas').innerHTML = state.components.map(c => `
    <article class="node ${state.selectedId === c.id ? 'selected' : ''}" data-id="${c.id}" style="left:${c.x}px;top:${c.y}px;width:${c.w}px;height:${c.h}px">
      <strong>${c.label}</strong><small>${c.kind}</small>
    </article>`).join('');
  document.querySelectorAll('.node').forEach(node => node.onclick = () => dispatch({ type: 'SELECT', id: node.dataset.id }));
  $('canvas').ondragover = e => e.preventDefault();
  $('canvas').ondrop = e => {
    e.preventDefault();
    const kind = e.dataTransfer.getData('text/yaiwes-kind');
    if (kind) dispatch({ type: 'ADD_COMPONENT', kind, label: kind });
  };
}

function renderInspector() {
  const item = state.components.find(c => c.id === state.selectedId);
  if (!item) {
    $('inspector-content').innerHTML = '<p>Selecciona un componente.</p>';
    return;
  }
  $('inspector-content').innerHTML = `
    <label>Etiqueta<input id="prop-label" value="${item.label}"></label>
    <label>Ancho<input id="prop-w" type="number" value="${item.w}"></label>
    <label>Alto<input id="prop-h" type="number" value="${item.h}"></label>`;
  $('prop-label').onchange = e => dispatch({ type: 'UPDATE_COMPONENT', id: item.id, patch: { label: e.target.value } });
  $('prop-w').onchange = e => dispatch({ type: 'UPDATE_COMPONENT', id: item.id, patch: { w: Number(e.target.value) } });
  $('prop-h').onchange = e => dispatch({ type: 'UPDATE_COMPONENT', id: item.id, patch: { h: Number(e.target.value) } });
}

function renderDelta() {
  $('delta-preview').textContent = state.proposedDelta ? JSON.stringify(state.proposedDelta, null, 2) : 'Sin delta propuesto';
}

function render() {
  renderSteps();
  renderLibrary();
  renderCanvas();
  renderInspector();
  renderDelta();
  $('step-title').textContent = STEPS[state.step - 1].title;
  $('status').textContent = `V${state.version} · ${state.mode}`;
  document.querySelectorAll('[data-mode]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === state.mode);
    btn.onclick = () => dispatch({ type: 'SET_MODE', mode: btn.dataset.mode });
  });
}

$('prev-step').onclick = () => dispatch({ type: 'SET_STEP', step: state.step - 1 });
$('next-step').onclick = () => dispatch({ type: 'SET_STEP', step: state.step + 1 });
$('undo').onclick = () => dispatch({ type: 'UNDO' });
$('redo').onclick = () => dispatch({ type: 'REDO' });
$('save-version').onclick = () => dispatch({ type: 'SAVE_VERSION' });
$('new-component').onclick = () => dispatch({ type: 'ADD_COMPONENT', kind: 'window', label: 'Nueva ventana' });
$('propose-delta').onclick = () => {
  const reason = $('ai-goal').value.trim();
  if (!reason) return;
  dispatch({ type: 'PROPOSE_DELTA', reason, operations: [{ type: 'ADD_COMPONENT', kind: 'panel', label: 'Propuesta IA' }] });
};
$('delta-preview').onclick = () => { if (state.proposedDelta) dispatch({ type: 'APPLY_DELTA' }); };
$('export-json').onclick = () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `yaiwes-ui-v${state.version}.json`; a.click(); URL.revokeObjectURL(url);
};

render();
