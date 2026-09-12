import { FRAPPE_BUILDER_DONOR } from './frappe-builder-patterns.js';

const MENU_ID = 'yaiwes-frappe-context-menu';
const ACTIONS = [
  ['duplicate-selected', 'Duplicar'],
  ['center-selected', 'Centrar'],
  ['remove-selected', 'Eliminar'],
];

function ensureMenu() {
  let menu = document.getElementById(MENU_ID);
  if (menu) return menu;
  menu = document.createElement('div');
  menu.id = MENU_ID;
  menu.className = 'yaiwes-context-menu';
  menu.hidden = true;
  menu.setAttribute('role', 'menu');
  menu.dataset.donor = FRAPPE_BUILDER_DONOR.name;
  menu.dataset.sourceBlob = FRAPPE_BUILDER_DONOR.sourceBlob;
  menu.innerHTML = `
    <div class="yaiwes-context-menu__meta">${FRAPPE_BUILDER_DONOR.name} donor</div>
    ${ACTIONS.map(([action,label]) => `<button type="button" role="menuitem" data-existing-action="${action}">${label}</button>`).join('')}
  `;
  document.body.appendChild(menu);
  return menu;
}

function selectedElement() {
  return document.querySelector('[data-node].selected, [data-layer].active');
}

function runExistingAction(controlId) {
  const previousStep = document.querySelector('[data-step].active')?.dataset.step || '2';
  if (!selectedElement()) return;

  let control = document.getElementById(controlId);
  if (!control) {
    document.querySelector('[data-step="2"]')?.click();
    control = document.getElementById(controlId);
  }
  control?.click();

  if (previousStep !== '2') {
    document.querySelector(`[data-step="${previousStep}"]`)?.click();
  }
}

function hideMenu() {
  const menu = document.getElementById(MENU_ID);
  if (menu) menu.hidden = true;
}

function showMenu(event, target) {
  target.click();
  const menu = ensureMenu();
  menu.hidden = false;
  const margin = 8;
  const width = 190;
  const height = 150;
  const left = Math.min(event.clientX, Math.max(margin, window.innerWidth - width - margin));
  const top = Math.min(event.clientY, Math.max(margin, window.innerHeight - height - margin));
  menu.style.left = `${Math.max(margin, left)}px`;
  menu.style.top = `${Math.max(margin, top)}px`;
  menu.querySelector('button')?.focus({ preventScroll: true });
}

const menu = ensureMenu();
menu.addEventListener('click', event => {
  const button = event.target.closest('[data-existing-action]');
  if (!button) return;
  runExistingAction(button.dataset.existingAction);
  hideMenu();
});

document.addEventListener('contextmenu', event => {
  const target = event.target.closest('[data-node], [data-layer]');
  if (!target) return;
  event.preventDefault();
  showMenu(event, target);
});

document.addEventListener('pointerdown', event => {
  if (!event.target.closest(`#${MENU_ID}`)) hideMenu();
});

document.addEventListener('keydown', event => {
  const editing = event.target.closest('input, textarea, select, [contenteditable="true"]');
  if (event.key === 'Escape') hideMenu();
  if (editing || !selectedElement()) return;
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'd') {
    event.preventDefault();
    runExistingAction('duplicate-selected');
  }
  if (event.key === 'Delete' || event.key === 'Backspace') {
    event.preventDefault();
    runExistingAction('remove-selected');
  }
});

document.addEventListener('scroll', hideMenu, true);
window.addEventListener('resize', hideMenu);

window.__YAIWES_DONOR_EVIDENCE__ = Object.freeze({
  ...(window.__YAIWES_DONOR_EVIDENCE__ || {}),
  frappeBuilderContextMenu: FRAPPE_BUILDER_DONOR,
});
