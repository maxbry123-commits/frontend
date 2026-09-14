// YAIWES Factory SEG-01-SHELL workspace v4.
// Reuses v2 mount contract. Does not mutate v1/v2 or frozen entrypoints.
// Adds compact breakpoint 768 and safe-area inset CSS variables.

export const WORKSPACE_SHELL_VERSION = 'v4';
export const WORKSPACE_SHELL_BREAKPOINT = 768;
export const WORKSPACE_SHELL_CHANGE_EVENT = 'yaiwes:workspace-shell-change';
export const WORKSPACE_SHELL_WIDTHS = Object.freeze([360, 390, 412, 768]);

const CONTROLLERS = new WeakMap();

export function classifyViewportWidth(width, breakpoint = WORKSPACE_SHELL_BREAKPOINT) {
  const value = Number(width);
  if (!Number.isFinite(value)) return 'desktop';
  return value <= breakpoint ? 'compact' : 'desktop';
}

export function defaultCollapsedForMode(mode) {
  const compact = mode === 'compact' || mode === 'mobile';
  return { left: compact, right: compact };
}

export function shouldApplyModeDefaults(previousMode, nextMode) {
  return String(previousMode || '') !== String(nextMode || '');
}

export function resolveCollapsedForMode(memory = {}, mode) {
  const remembered = memory?.[mode];
  if (remembered && typeof remembered.left === 'boolean' && typeof remembered.right === 'boolean') {
    return { left: remembered.left, right: remembered.right };
  }
  return defaultCollapsedForMode(mode);
}

export function readSafeAreaInsets(win = globalThis) {
  const source = win?.getComputedStyle?.(win.document?.documentElement) || null;
  const read = (prop, fallback) => {
    const raw = source ? source.getPropertyValue(prop) : '';
    const n = Number.parseFloat(raw);
    return Number.isFinite(n) ? n : fallback;
  };
  return {
    top: read('--yaiwes-safe-top', 0),
    right: read('--yaiwes-safe-right', 0),
    bottom: read('--yaiwes-safe-bottom', 0),
    left: read('--yaiwes-safe-left', 0),
  };
}

export function applySafeAreaInsets(root, insets = {}) {
  if (!root?.style) return null;
  const next = {
    top: Math.max(0, Number(insets.top) || 0),
    right: Math.max(0, Number(insets.right) || 0),
    bottom: Math.max(0, Number(insets.bottom) || 0),
    left: Math.max(0, Number(insets.left) || 0),
  };
  root.style.setProperty('--yaiwes-safe-top', `${next.top}px`);
  root.style.setProperty('--yaiwes-safe-right', `${next.right}px`);
  root.style.setProperty('--yaiwes-safe-bottom', `${next.bottom}px`);
  root.style.setProperty('--yaiwes-safe-left', `${next.left}px`);
  root.dataset.workspaceSafeArea = `${next.top},${next.right},${next.bottom},${next.left}`;
  return next;
}

function query(root, selector) {
  return root.querySelector(selector);
}

export function readWorkspaceShellState(root) {
  if (!root) return null;
  const studio = query(root, '.studio') || root;
  return {
    version: root.dataset?.workspaceShell || null,
    mode: root.dataset?.workspaceMode || null,
    leftCollapsed: studio.classList.contains('workspace-left-collapsed'),
    rightCollapsed: studio.classList.contains('workspace-right-collapsed'),
    safeArea: root.dataset?.workspaceSafeArea || '0,0,0,0',
  };
}

export function mountWorkspaceShell(doc = globalThis.document, options = {}) {
  if (!doc?.querySelector) return { ok: false, reason: 'DOCUMENT_REQUIRED' };

  const root = options.root || query(doc, '.app-shell');
  const studio = options.studio || query(doc, '.studio');
  const library = options.library || query(doc, '.library-pane');
  const context = options.context || query(doc, '.context-pane');
  const toolbar = options.toolbar || query(doc, '.canvas-toolbar');
  const win = options.window || doc.defaultView || globalThis;
  const breakpoint = Number(options.breakpoint) > 0 ? Number(options.breakpoint) : WORKSPACE_SHELL_BREAKPOINT;

  if (!root || !studio || !library || !context || !toolbar) {
    return { ok: false, reason: 'SHELL_MARKUP_MISSING' };
  }

  const existingVersion = root.dataset.workspaceShell;
  if (existingVersion && existingVersion !== WORKSPACE_SHELL_VERSION && options.replace !== true) {
    return { ok: false, reason: 'PRIOR_SHELL_PRESERVED', version: existingVersion };
  }

  const reused = CONTROLLERS.get(root);
  if (existingVersion === WORKSPACE_SHELL_VERSION && reused) {
    return { ok: true, reused: true, version: WORKSPACE_SHELL_VERSION, controller: reused };
  }

  root.dataset.workspaceShell = WORKSPACE_SHELL_VERSION;
  applySafeAreaInsets(root, options.safeArea || readSafeAreaInsets(win));
  const memory = { desktop: null, compact: null, mobile: null };
  const buttons = new Map();
  const targets = { left: library, right: context };
  let mode = null;

  const ensureBackdrop = () => {
    let backdrop = query(studio, '[data-workspace-backdrop]');
    if (backdrop) return backdrop;
    backdrop = doc.createElement('button');
    backdrop.type = 'button';
    backdrop.className = 'workspace-shell-backdrop';
    backdrop.dataset.workspaceBackdrop = 'true';
    backdrop.setAttribute('aria-label', 'Cerrar paneles');
    backdrop.addEventListener('click', () => {
      setCollapsed('left', true);
      setCollapsed('right', true);
    });
    studio.append(backdrop);
    return backdrop;
  };

  const syncBackdrop = () => {
    const backdrop = ensureBackdrop();
    const anyOpen = !studio.classList.contains('workspace-left-collapsed') || !studio.classList.contains('workspace-right-collapsed');
    const show = (mode === 'compact' || mode === 'mobile') && anyOpen;
    backdrop.hidden = !show;
    backdrop.setAttribute('aria-hidden', String(!show));
  };

  const setCollapsed = (side, collapsed) => {
    const target = targets[side];
    const button = buttons.get(side);
    studio.classList.toggle(`workspace-${side}-collapsed`, collapsed);
    if (button) button.setAttribute('aria-expanded', String(!collapsed));
    target.setAttribute('aria-hidden', String(collapsed));
    memory[mode] = {
      left: studio.classList.contains('workspace-left-collapsed'),
      right: studio.classList.contains('workspace-right-collapsed'),
    };
    syncBackdrop();
    win.dispatchEvent(new CustomEvent(WORKSPACE_SHELL_CHANGE_EVENT, { detail: { side, collapsed, mode, version: WORKSPACE_SHELL_VERSION } }));
  };

  const applyMode = (nextMode) => {
    const changed = shouldApplyModeDefaults(mode, nextMode);
    mode = nextMode;
    root.dataset.workspaceMode = mode;
    const collapsed = resolveCollapsedForMode(memory, mode);
    if (changed) {
      setCollapsed('left', collapsed.left);
      setCollapsed('right', collapsed.right);
    } else {
      syncBackdrop();
    }
  };

  if (!query(toolbar, '.workspace-shell-controls')) {
    const controls = doc.createElement('div');
    controls.className = 'workspace-shell-controls';
    controls.setAttribute('aria-label', 'Controles del workspace');

    const makeButton = (label, side) => {
      const button = doc.createElement('button');
      button.type = 'button';
      button.className = 'workspace-shell-toggle';
      button.dataset.workspaceToggle = side;
      button.setAttribute('aria-expanded', 'true');
      button.textContent = label;
      button.addEventListener('click', () => {
        setCollapsed(side, !studio.classList.contains(`workspace-${side}-collapsed`));
      });
      buttons.set(side, button);
      return button;
    };

    controls.append(makeButton('Biblioteca', 'left'), makeButton('Inspector', 'right'));
    toolbar.append(controls);
  } else {
    for (const side of ['left', 'right']) {
      const button = query(toolbar, `[data-workspace-toggle="${side}"]`);
      if (button) buttons.set(side, button);
    }
  }

  const addDrawerClose = (side, target, label) => {
    if (query(target, `[data-workspace-close="${side}"]`)) return;
    const close = doc.createElement('button');
    close.type = 'button';
    close.className = 'workspace-drawer-close';
    close.dataset.workspaceClose = side;
    close.setAttribute('aria-label', `Cerrar ${label}`);
    close.textContent = '×';
    close.addEventListener('click', () => setCollapsed(side, true));
    target.prepend(close);
  };

  addDrawerClose('left', library, 'Biblioteca');
  addDrawerClose('right', context, 'Inspector');
  ensureBackdrop();

  const media = win.matchMedia(`(max-width: ${breakpoint}px)`);
  const readMode = () => (media.matches ? 'compact' : 'desktop');
  applyMode(readMode());

  const onMediaChange = () => applyMode(readMode());
  if (typeof media.addEventListener === 'function') media.addEventListener('change', onMediaChange);
  else if (typeof media.addListener === 'function') media.addListener(onMediaChange);

  const onKeydown = (event) => {
    if (event.key !== 'Escape') return;
    if (mode !== 'compact' && mode !== 'mobile') return;
    setCollapsed('left', true);
    setCollapsed('right', true);
  };
  win.addEventListener('keydown', onKeydown);

  const controller = {
    version: WORKSPACE_SHELL_VERSION,
    setCollapsed,
    applySafeAreaInsets: (insets) => applySafeAreaInsets(root, insets),
    getState: () => readWorkspaceShellState(root),
    unmount() {
      if (typeof media.removeEventListener === 'function') media.removeEventListener('change', onMediaChange);
      else if (typeof media.removeListener === 'function') media.removeListener(onMediaChange);
      win.removeEventListener('keydown', onKeydown);
      CONTROLLERS.delete(root);
    },
  };

  CONTROLLERS.set(root, controller);
  if (typeof globalThis !== 'undefined') {
    globalThis.__YAIWES_WORKSPACE_SHELL_V4__ = Object.freeze({
      schema: 'yaiwes.factory.workspace-shell/v4',
      version: WORKSPACE_SHELL_VERSION,
      mode,
      breakpoint,
      applySafeAreaInsets,
      classifyViewportWidth,
    });
  }
  return { ok: true, reused: false, version: WORKSPACE_SHELL_VERSION, controller };
}

if (typeof document !== 'undefined' && document.querySelector?.('.app-shell') && !document.querySelector('.app-shell')?.dataset?.workspaceShell) {
  mountWorkspaceShell(document);
}
