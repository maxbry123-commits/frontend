const root = document.querySelector('.app-shell');
const studio = document.querySelector('.studio');
const library = document.querySelector('.library-pane');
const context = document.querySelector('.context-pane');
const toolbar = document.querySelector('.canvas-toolbar');

if (root && studio && library && context && toolbar) {
  root.dataset.workspaceShell = 'v1';
  const controls = document.createElement('div');
  controls.className = 'workspace-shell-controls';
  controls.setAttribute('aria-label', 'Controles del workspace');

  const buttons = new Map();
  const targets = { left: library, right: context };

  const setCollapsed = (side, collapsed) => {
    const target = targets[side];
    const button = buttons.get(side);
    studio.classList.toggle(`workspace-${side}-collapsed`, collapsed);
    if (button) button.setAttribute('aria-expanded', String(!collapsed));
    target.setAttribute('aria-hidden', String(collapsed));
    window.dispatchEvent(new CustomEvent('yaiwes:workspace-shell-change', { detail: { side, collapsed } }));
  };

  const makeButton = (label, side) => {
    const button = document.createElement('button');
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

  const addDrawerClose = (side, target, label) => {
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'workspace-drawer-close';
    close.dataset.workspaceClose = side;
    close.setAttribute('aria-label', `Cerrar ${label}`);
    close.textContent = '×';
    close.addEventListener('click', () => setCollapsed(side, true));
    target.prepend(close);
  };

  controls.append(makeButton('Biblioteca', 'left'), makeButton('Inspector', 'right'));
  toolbar.append(controls);
  addDrawerClose('left', library, 'Biblioteca');
  addDrawerClose('right', context, 'Inspector');

  const syncMobileDefaults = () => {
    const mobile = window.matchMedia('(max-width: 760px)').matches;
    root.dataset.workspaceMode = mobile ? 'mobile' : 'desktop';
    setCollapsed('left', mobile);
    setCollapsed('right', mobile);
  };

  syncMobileDefaults();
  window.addEventListener('resize', syncMobileDefaults, { passive: true });
}
