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

  const makeButton = (label, side, target) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'workspace-shell-toggle';
    button.dataset.workspaceToggle = side;
    button.setAttribute('aria-expanded', 'true');
    button.textContent = label;
    button.addEventListener('click', () => {
      const collapsed = studio.classList.toggle(`workspace-${side}-collapsed`);
      button.setAttribute('aria-expanded', String(!collapsed));
      target.setAttribute('aria-hidden', String(collapsed));
      window.dispatchEvent(new CustomEvent('yaiwes:workspace-shell-change', { detail: { side, collapsed } }));
    });
    return button;
  };

  controls.append(
    makeButton('Biblioteca', 'left', library),
    makeButton('Inspector', 'right', context)
  );
  toolbar.append(controls);

  const syncMobileDefaults = () => {
    const mobile = window.matchMedia('(max-width: 760px)').matches;
    root.dataset.workspaceMode = mobile ? 'mobile' : 'desktop';
    if (mobile) {
      studio.classList.add('workspace-left-collapsed', 'workspace-right-collapsed');
      controls.querySelectorAll('button').forEach(button => button.setAttribute('aria-expanded', 'false'));
      library.setAttribute('aria-hidden', 'true');
      context.setAttribute('aria-hidden', 'true');
    } else {
      studio.classList.remove('workspace-left-collapsed', 'workspace-right-collapsed');
      controls.querySelectorAll('button').forEach(button => button.setAttribute('aria-expanded', 'true'));
      library.setAttribute('aria-hidden', 'false');
      context.setAttribute('aria-hidden', 'false');
    }
  };

  syncMobileDefaults();
  window.addEventListener('resize', syncMobileDefaults, { passive: true });
}
