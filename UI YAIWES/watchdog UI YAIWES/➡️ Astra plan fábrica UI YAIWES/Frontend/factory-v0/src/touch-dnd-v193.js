// YAIWES Factory V1.9.3 — versioned touch/pen movement.
// Reuses the V1.9.2 delegated adapter. Does not mutate touch-dnd-v192.js.
// Producer segment: do not wire the integrator candidate from this file.

export const TOUCH_DND_VERSION = '1.9.3';
export const SEGMENT_ID = 'SEG-04-TOUCH';
export const NODE_TRANSFER_KEY = 'text/yaiwes-node';
export const ORIGIN_TRANSFER_KEY = 'application/x-yaiwes-node-origin';
export const RESIZE_CORNER_PAD = 24;

export function canvasLocalPoint(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: clientX - rect.left + (Number(canvas.scrollLeft) || 0),
    y: clientY - rect.top + (Number(canvas.scrollTop) || 0),
  };
}

export function clientPointFromCanvasLocal(canvas, localX, localY) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: rect.left + localX - (Number(canvas.scrollLeft) || 0),
    y: rect.top + localY - (Number(canvas.scrollTop) || 0),
  };
}

export function readNodeOrigin(node) {
  return {
    left: Number.parseFloat(node?.style?.left) || 0,
    top: Number.parseFloat(node?.style?.top) || 0,
  };
}

export function computeMovedOrigin({ originLeft, originTop, startClientX, startClientY, clientX, clientY }) {
  return {
    left: Math.max(0, originLeft + clientX - startClientX),
    top: Math.max(0, originTop + clientY - startClientY),
  };
}

export function isNearResizeCorner(node, clientX, clientY, pad = RESIZE_CORNER_PAD) {
  if (!node || typeof node.getBoundingClientRect !== 'function') return false;
  const rect = node.getBoundingClientRect();
  return clientX >= rect.right - pad && clientY >= rect.bottom - pad;
}

export function dropClientFromNodeOrigin(canvas, node) {
  const origin = readNodeOrigin(node);
  return clientPointFromCanvasLocal(canvas, origin.left, origin.top);
}

export function nodeFromTarget(target) {
  if (!target) return null;
  if (typeof target.closest === 'function') return target.closest('[data-node]');
  return null;
}

export function shouldBeginTouchMove(node, clientX, clientY) {
  if (!node) return false;
  if (isNearResizeCorner(node, clientX, clientY)) return false;
  return true;
}

function touchPoint(event) {
  return event.touches?.[0] || event.changedTouches?.[0] || null;
}

export function mountTouchDndV193(options = {}) {
  const doc = options.document || globalThis.document;
  const DataTransferCtor = options.DataTransfer || globalThis.DataTransfer;
  const DragEventCtor = options.DragEvent || globalThis.DragEvent;
  const canvasId = options.canvasId || 'canvas';
  const force = options.force === true;

  if (!doc?.addEventListener) {
    return { ok: false, reason: 'NO_DOCUMENT' };
  }
  if (!force && globalThis.__YAIWES_TOUCH_DND_V192__) {
    return { ok: false, reason: 'V192_ALREADY_MOUNTED', version: TOUCH_DND_VERSION };
  }
  if (!force && doc.documentElement?.dataset?.touchDnd === 'v193') {
    return { ok: false, reason: 'ALREADY_MOUNTED', version: TOUCH_DND_VERSION };
  }

  const abort = new AbortController();
  const capture = { capture: true, passive: false, signal: abort.signal };
  const capturePassive = { capture: true, signal: abort.signal };
  let session = null;
  const stats = {
    pointerDown: 0,
    pointerMove: 0,
    pointerUp: 0,
    touchStart: 0,
    touchMove: 0,
    touchEnd: 0,
    commits: 0,
    blockedResize: 0,
    scrollPassthrough: 0,
  };

  function canvasEl() {
    return doc.getElementById(canvasId);
  }

  function begin(node, clientX, clientY, source, pointerId = null) {
    if (session) return false;
    if (!shouldBeginTouchMove(node, clientX, clientY)) {
      stats.blockedResize += 1;
      return false;
    }
    const origin = readNodeOrigin(node);
    session = {
      node,
      id: node.dataset.node,
      source,
      pointerId,
      startX: clientX,
      startY: clientY,
      x: clientX,
      y: clientY,
      left: origin.left,
      top: origin.top,
    };
    node.classList.add('selected', 'is-pointer-moving');
    return true;
  }

  function move(clientX, clientY) {
    if (!session) return null;
    session.x = clientX;
    session.y = clientY;
    const next = computeMovedOrigin({
      originLeft: session.left,
      originTop: session.top,
      startClientX: session.startX,
      startClientY: session.startY,
      clientX,
      clientY,
    });
    session.node.style.left = `${next.left}px`;
    session.node.style.top = `${next.top}px`;
    return next;
  }

  function commit() {
    if (!session) return null;
    const done = session;
    session = null;
    done.node.classList.remove('is-pointer-moving');
    const canvas = canvasEl();
    if (!canvas || !done.id || typeof DataTransferCtor !== 'function' || typeof DragEventCtor !== 'function') {
      return { ok: false, reason: 'NO_CANVAS_OR_TRANSFER', id: done.id };
    }
    const origin = readNodeOrigin(done.node);
    const dropClient = clientPointFromCanvasLocal(canvas, origin.left, origin.top);
    const dt = new DataTransferCtor();
    dt.setData(NODE_TRANSFER_KEY, done.id);
    dt.setData(ORIGIN_TRANSFER_KEY, JSON.stringify(origin));
    stats.commits += 1;
    canvas.dispatchEvent(new DragEventCtor('drop', {
      bubbles: true,
      cancelable: true,
      clientX: dropClient.x,
      clientY: dropClient.y,
      dataTransfer: dt,
    }));
    return { ok: true, id: done.id, origin, dropClient };
  }

  doc.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse') return;
    const node = nodeFromTarget(event.target);
    if (!node) {
      stats.scrollPassthrough += 1;
      return;
    }
    stats.pointerDown += 1;
    if (begin(node, event.clientX, event.clientY, 'pointer', event.pointerId)) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, capture);

  doc.addEventListener('pointermove', (event) => {
    if (!session || session.source !== 'pointer' || session.pointerId !== event.pointerId) return;
    stats.pointerMove += 1;
    event.preventDefault();
    event.stopPropagation();
    move(event.clientX, event.clientY);
  }, capture);

  doc.addEventListener('pointerup', (event) => {
    if (!session || session.source !== 'pointer' || session.pointerId !== event.pointerId) return;
    stats.pointerUp += 1;
    event.preventDefault();
    event.stopPropagation();
    move(event.clientX, event.clientY);
    commit();
  }, capture);

  doc.addEventListener('pointercancel', () => {
    if (session?.source === 'pointer') session = null;
  }, capturePassive);

  doc.addEventListener('touchstart', (event) => {
    stats.touchStart += 1;
    if (session) return;
    const node = nodeFromTarget(event.target);
    const point = touchPoint(event);
    if (!node || !point) {
      stats.scrollPassthrough += 1;
      return;
    }
    if (begin(node, point.clientX, point.clientY, 'touch')) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, capture);

  doc.addEventListener('touchmove', (event) => {
    stats.touchMove += 1;
    if (!session || session.source !== 'touch') return;
    const point = touchPoint(event);
    if (!point) return;
    event.preventDefault();
    event.stopPropagation();
    move(point.clientX, point.clientY);
  }, capture);

  doc.addEventListener('touchend', (event) => {
    stats.touchEnd += 1;
    if (!session || session.source !== 'touch') return;
    const point = touchPoint(event);
    if (point) move(point.clientX, point.clientY);
    event.preventDefault();
    event.stopPropagation();
    commit();
  }, capture);

  doc.addEventListener('touchcancel', () => {
    if (session?.source === 'touch') session = null;
  }, capturePassive);

  if (doc.documentElement) doc.documentElement.dataset.touchDnd = 'v193';

  const api = {
    version: TOUCH_DND_VERSION,
    segmentId: SEGMENT_ID,
    getStats: () => ({ ...stats }),
    active: () => Boolean(session),
    destroy() {
      abort.abort();
      session = null;
      if (doc.documentElement?.dataset?.touchDnd === 'v193') delete doc.documentElement.dataset.touchDnd;
      if (globalThis.__YAIWES_TOUCH_DND_V193__ === api) delete globalThis.__YAIWES_TOUCH_DND_V193__;
    },
  };
  globalThis.__YAIWES_TOUCH_DND_V193__ = api;
  return { ok: true, ...api };
}

if (typeof document !== 'undefined') {
  mountTouchDndV193({ auto: true });
}
