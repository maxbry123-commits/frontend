// YAIWES Factory V1.9.1 — touch/pen movement adapter.
// Reuses the editor's existing canvas drop contract instead of duplicating state logic.
(() => {
  const bound = new WeakSet();
  let session = null;

  const pointFromTouch = (event) => event.touches?.[0] || event.changedTouches?.[0] || null;
  const nearResizeCorner = (node, x, y) => {
    const r = node.getBoundingClientRect();
    return x >= r.right - 24 && y >= r.bottom - 24;
  };

  function begin(node, x, y, source, pointerId = null) {
    if (session || nearResizeCorner(node, x, y)) return;
    const left = Number.parseFloat(node.style.left) || 0;
    const top = Number.parseFloat(node.style.top) || 0;
    session = { node, id: node.dataset.node, source, pointerId, startX: x, startY: y, x, y, left, top };
    node.classList.add('selected', 'is-pointer-moving');
  }

  function move(x, y) {
    if (!session) return;
    session.x = x;
    session.y = y;
    const dx = x - session.startX;
    const dy = y - session.startY;
    session.node.style.left = `${Math.max(0, session.left + dx)}px`;
    session.node.style.top = `${Math.max(0, session.top + dy)}px`;
  }

  function commit() {
    if (!session) return;
    const done = session;
    session = null;
    done.node.classList.remove('is-pointer-moving');
    const canvas = document.getElementById('canvas');
    if (!canvas || !done.id) return;
    const dt = new DataTransfer();
    dt.setData('text/yaiwes-node', done.id);
    canvas.dispatchEvent(new DragEvent('drop', {
      bubbles: true,
      cancelable: true,
      clientX: done.x,
      clientY: done.y,
      dataTransfer: dt
    }));
  }

  function bind(node) {
    if (bound.has(node)) return;
    bound.add(node);

    node.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse') return;
      begin(node, e.clientX, e.clientY, 'pointer', e.pointerId);
    });
    node.addEventListener('pointermove', (e) => {
      if (!session || session.source !== 'pointer' || session.pointerId !== e.pointerId) return;
      e.preventDefault();
      move(e.clientX, e.clientY);
    }, { passive: false });
    node.addEventListener('pointerup', (e) => {
      if (!session || session.source !== 'pointer' || session.pointerId !== e.pointerId) return;
      e.preventDefault();
      move(e.clientX, e.clientY);
      commit();
    }, { passive: false });
    node.addEventListener('pointercancel', () => {
      if (session?.source === 'pointer') session = null;
    });

    node.addEventListener('touchstart', (e) => {
      if (session) return;
      const t = pointFromTouch(e);
      if (!t) return;
      e.preventDefault();
      begin(node, t.clientX, t.clientY, 'touch');
    }, { passive: false });
    node.addEventListener('touchmove', (e) => {
      if (!session || session.source !== 'touch') return;
      const t = pointFromTouch(e);
      if (!t) return;
      e.preventDefault();
      move(t.clientX, t.clientY);
    }, { passive: false });
    node.addEventListener('touchend', (e) => {
      if (!session || session.source !== 'touch') return;
      const t = pointFromTouch(e);
      if (t) move(t.clientX, t.clientY);
      e.preventDefault();
      commit();
    }, { passive: false });
    node.addEventListener('touchcancel', () => {
      if (session?.source === 'touch') session = null;
    });
  }

  function scan() {
    document.querySelectorAll('[data-node]').forEach(bind);
  }

  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
  scan();
  window.__YAIWES_TOUCH_DND_V191__ = Object.freeze({ version: '1.9.1', rescan: scan });
})();
