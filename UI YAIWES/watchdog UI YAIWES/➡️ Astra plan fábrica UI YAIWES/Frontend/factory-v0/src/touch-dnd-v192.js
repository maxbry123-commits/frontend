// YAIWES Factory V1.9.2 — delegated touch/pen movement.
// One delegated adapter avoids races with nodes recreated by render().
(() => {
  let session = null;
  const stats = { pointerDown:0, pointerMove:0, pointerUp:0, touchStart:0, touchMove:0, touchEnd:0, commits:0 };

  const nodeFromTarget = (target) => target instanceof Element ? target.closest('[data-node]') : null;
  const touchPoint = (event) => event.touches?.[0] || event.changedTouches?.[0] || null;
  const nearResizeCorner = (node, x, y) => {
    const r = node.getBoundingClientRect();
    return x >= r.right - 24 && y >= r.bottom - 24;
  };

  function begin(node, x, y, source, pointerId = null) {
    if (!node || session || nearResizeCorner(node, x, y)) return false;
    session = {
      node,
      id: node.dataset.node,
      source,
      pointerId,
      startX:x,
      startY:y,
      x,
      y,
      left:Number.parseFloat(node.style.left) || 0,
      top:Number.parseFloat(node.style.top) || 0
    };
    node.classList.add('selected','is-pointer-moving');
    return true;
  }

  function move(x, y) {
    if (!session) return;
    session.x = x;
    session.y = y;
    session.node.style.left = `${Math.max(0, session.left + x - session.startX)}px`;
    session.node.style.top = `${Math.max(0, session.top + y - session.startY)}px`;
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
    stats.commits += 1;
    canvas.dispatchEvent(new DragEvent('drop', {
      bubbles:true,
      cancelable:true,
      clientX:done.x,
      clientY:done.y,
      dataTransfer:dt
    }));
  }

  document.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') return;
    const node = nodeFromTarget(e.target);
    if (!node) return;
    stats.pointerDown += 1;
    if (begin(node,e.clientX,e.clientY,'pointer',e.pointerId)) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, { capture:true, passive:false });

  document.addEventListener('pointermove', (e) => {
    if (!session || session.source !== 'pointer' || session.pointerId !== e.pointerId) return;
    stats.pointerMove += 1;
    e.preventDefault();
    e.stopPropagation();
    move(e.clientX,e.clientY);
  }, { capture:true, passive:false });

  document.addEventListener('pointerup', (e) => {
    if (!session || session.source !== 'pointer' || session.pointerId !== e.pointerId) return;
    stats.pointerUp += 1;
    e.preventDefault();
    e.stopPropagation();
    move(e.clientX,e.clientY);
    commit();
  }, { capture:true, passive:false });

  document.addEventListener('pointercancel', () => {
    if (session?.source === 'pointer') session = null;
  }, { capture:true });

  document.addEventListener('touchstart', (e) => {
    stats.touchStart += 1;
    if (session) return;
    const node = nodeFromTarget(e.target);
    const p = touchPoint(e);
    if (!node || !p) return;
    if (begin(node,p.clientX,p.clientY,'touch')) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, { capture:true, passive:false });

  document.addEventListener('touchmove', (e) => {
    stats.touchMove += 1;
    if (!session || session.source !== 'touch') return;
    const p = touchPoint(e);
    if (!p) return;
    e.preventDefault();
    e.stopPropagation();
    move(p.clientX,p.clientY);
  }, { capture:true, passive:false });

  document.addEventListener('touchend', (e) => {
    stats.touchEnd += 1;
    if (!session || session.source !== 'touch') return;
    const p = touchPoint(e);
    if (p) move(p.clientX,p.clientY);
    e.preventDefault();
    e.stopPropagation();
    commit();
  }, { capture:true, passive:false });

  document.addEventListener('touchcancel', () => {
    if (session?.source === 'touch') session = null;
  }, { capture:true });

  window.__YAIWES_TOUCH_DND_V192__ = Object.freeze({
    version:'1.9.2',
    getStats:() => ({...stats}),
    active:() => Boolean(session)
  });
})();
