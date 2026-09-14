// YAIWES Factory SEG-01-SHELL v2.
// Preserves workspace-shell-v1.js. Integrator (SEG-11) wires this into a candidate.
// Canvas-first: mobile drawers start collapsed; user toggles survive resize.

export const WORKSPACE_SHELL_VERSION = 'v2';
export const MOBILE_BREAKPOINT = 760;

export function isMobileWidth(width, breakpoint = MOBILE_BREAKPOINT) {
  return Number(width) <= breakpoint;
}

export function createShellState({ width = 1280, userOverride = false } = {}) {
  const mobile = isMobileWidth(width);
  return {
    version: WORKSPACE_SHELL_VERSION,
    mode: mobile ? 'mobile' : 'desktop',
    leftCollapsed: mobile,
    rightCollapsed: mobile,
    userOverride: Boolean(userOverride),
  };
}

export function reduceShell(state, action = {}) {
  const current = state && typeof state === 'object' ? state : createShellState();
  switch (action.type) {
    case 'TOGGLE': {
      const key = action.side === 'right' ? 'rightCollapsed' : 'leftCollapsed';
      return { ...current, [key]: !current[key], userOverride: true };
    }
    case 'SET': {
      const key = action.side === 'right' ? 'rightCollapsed' : 'leftCollapsed';
      return { ...current, [key]: Boolean(action.collapsed), userOverride: true };
    }
    case 'ESCAPE': {
      if (current.mode !== 'mobile') return current;
      return { ...current, leftCollapsed: true, rightCollapsed: true, userOverride: true };
    }
    case 'RESIZE': {
      const width = Number(action.width);
      const mobile = isMobileWidth(width);
      const mode = mobile ? 'mobile' : 'desktop';
      if (current.userOverride) return { ...current, mode };
      return createShellState({ width, userOverride: false });
    }
    default:
      return current;
  }
}

function requireNodes(doc) {
  const root = doc.querySelector('.app-shell');
  const studio = doc.querySelector('.studio');
  const library = doc.querySelector('.library-pane');
  const context = doc.querySelector('.context-pane');
  const toolbar = doc.querySelector('.canvas-toolbar');
  if (!root || !studio || !library || !context || !toolbar) return null;
  return { root, studio, library, context, toolbar };
}

function applyState(nodes, state, win) {
  const { root, studio, library, context } = nodes;
  root.dataset.workspaceShell = WORKSPACE_SHELL_VERSION;
  root.dataset.workspaceMode = state.mode;
  studio.classList.toggle('workspace-left-collapsed', state.leftCollapsed);
  studio.classList.toggle('workspace-right-collapsed', state.rightCollapsed);
  library.setAttribute('aria-hidden', String(state.leftCollapsed));
  context.setAttribute('aria-hidden', String(state.rightCollapsed));
  const overlay = root.querySelector('[data-workspace-overlay]');
  const drawerOpen = !state.leftCollapsed || !state.rightCollapsed;
  if (overlay) overlay.hidden = !(state.mode === 'mobile' && drawerOpen);
  const leftBtn = root.querySelector('[data-workspace-toggle="left"]');
  const rightBtn = root.querySelector('[data-workspace-toggle="right"]');
  if (leftBtn) leftBtn.setAttribute('aria-expanded', String(!state.leftCollapsed));
  if (rightBtn) rightBtn.setAttribute('aria-expanded', String(!state.rightCollapsed));
  win.dispatchEvent(new CustomEvent('yaiwes:workspace-shell-change', {
    detail: { version: WORKSPACE_SHELL_VERSION, ...state },
  }));
}

function makeButton(doc, label, side) {
  const button = doc.createElement('button');
  button.type = 'button';
  button.className = 'workspace-shell-toggle';
  button.dataset.workspaceToggle = side;
  button.setAttribute('aria-expanded', 'true');
  button.textContent = label;
  return button;
}

function makeDrawerClose(doc, side, label) {
  const close = doc.createElement('button');
  close.type = 'button';
  close.className = 'workspace-drawer-close';
  close.dataset.workspaceClose = side;
  close.setAttribute('aria-label', `Cerrar ${label}`);
  close.textContent = '×';
  return close;
}

export function mountWorkspaceShellV2({
  document: doc = globalThis.document,
  window: win = globalThis.window,
} = {}) {
  if (!doc || !win) return null;
  const nodes = requireNodes(doc);
  if (!nodes) return null;
  if (nodes.root.dataset.workspaceShell === WORKSPACE_SHELL_VERSION && nodes.root.__yaiwesShellV2) {
    return nodes.root.__yaiwesShellV2;
  }

  let state = createShellState({ width: Number(win.innerWidth || 1280) });
  const api = {
    version: WORKSPACE_SHELL_VERSION,
    getState: () => ({ ...state }),
    dispatch(action) {
      state = reduceShell(state, action);
      applyState(nodes, state, win);
      return api.getState();
    },
    destroy() {
      win.removeEventListener('resize', onResize);
      win.removeEventListener('keydown', onKeydown);
      delete nodes.root.__yaiwesShellV2;
    },
  };

  if (!nodes.root.querySelector('.workspace-shell-controls')) {
    const controls = doc.createElement('div');
    controls.className = 'workspace-shell-controls';
    controls.setAttribute('aria-label', 'Controles del workspace');
    controls.append(makeButton(doc, 'Biblioteca', 'left'), makeButton(doc, 'Inspector', 'right'));
    nodes.toolbar.append(controls);
  }
  if (!nodes.library.querySelector('[data-workspace-close="left"]')) {
    nodes.library.prepend(makeDrawerClose(doc, 'left', 'Biblioteca'));
  }
  if (!nodes.context.querySelector('[data-workspace-close="right"]')) {
    nodes.context.prepend(makeDrawerClose(doc, 'right', 'Inspector'));
  }
  if (!nodes.root.querySelector('[data-workspace-overlay]')) {
    const overlay = doc.createElement('div');
    overlay.className = 'workspace-shell-overlay';
    overlay.dataset.workspaceOverlay = 'v2';
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
    nodes.studio.append(overlay);
  }

  nodes.root.addEventListener('click', (event) => {
    const toggle = event.target.closest?.('[data-workspace-toggle]');
    if (toggle) {
      api.dispatch({ type: 'TOGGLE', side: toggle.dataset.workspaceToggle });
      return;
    }
    const closer = event.target.closest?.('[data-workspace-close]');
    if (closer) {
      api.dispatch({ type: 'SET', side: closer.dataset.workspaceClose, collapsed: true });
      return;
    }
    if (event.target.closest?.('[data-workspace-overlay]')) {
      api.dispatch({ type: 'ESCAPE' });
    }
  });

  const onResize = () => api.dispatch({ type: 'RESIZE', width: Number(win.innerWidth || 1280) });
  const onKeydown = (event) => {
    if (event.key === 'Escape') api.dispatch({ type: 'ESCAPE' });
  };
  win.addEventListener('resize', onResize, { passive: true });
  win.addEventListener('keydown', onKeydown);

  nodes.root.__yaiwesShellV2 = api;
  applyState(nodes, state, win);
  return api;
}

if (typeof document !== 'undefined') {
  const boot = () => {
    if (document.querySelector('.app-shell')?.dataset?.workspaceShell === 'v1') return;
    mountWorkspaceShellV2();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
}
