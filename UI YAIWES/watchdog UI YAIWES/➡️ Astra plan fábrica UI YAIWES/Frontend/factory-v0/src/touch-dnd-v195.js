// YAIWES Factory V1.9.5 — touch/pen drag intent (threshold + long-press + cancel-restore).
// Copies V1.9.4 helpers. Does not import touch-dnd-v194.js (that module auto-mounts).
// Does not mutate touch-dnd-v192.js, v193.js, or v194.js.
// Producer segment: do not wire the integrator candidate from this file.

export const TOUCH_DND_VERSION = '1.9.5';
export const SEGMENT_ID = 'SEG-04-TOUCH';
export const NODE_TRANSFER_KEY = 'text/yaiwes-node';
export const ORIGIN_TRANSFER_KEY = 'application/x-yaiwes-node-origin';
export const RESIZE_CORNER_PAD = 22;
export const MOVE_THRESHOLD_PX = 10;
export const LONG_PRESS_MS = 350;
export const GESTURE = Object.freeze({
  PENDING: 'pending',
  MOVE: 'move',
  SCROLL: 'scroll',
  RESIZE: 'resize',
});

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

export function classifyGesture(input = {}) {
  const node = input.node ?? null;
  const clientX = Number(input.clientX) || 0;
  const clientY = Number(input.clientY) || 0;
  const startX = input.startX == null ? clientX : Number(input.startX) || 0;
  const startY = input.startY == null ? clientY : Number(input.startY) || 0;
  const dx = input.dx == null ? clientX - startX : Number(input.dx) || 0;
  const dy = input.dy == null ? clientY - startY : Number(input.dy) || 0;
  const heldMs = Number(input.heldMs) || 0;
  const phase = input.phase === 'down' ? 'down' : 'move';

  if (!node) return GESTURE.SCROLL;
  const cornerX = phase === 'down' ? clientX : startX;
  const cornerY = phase === 'down' ? clientY : startY;
  if (isNearResizeCorner(node, cornerX, cornerY, RESIZE_CORNER_PAD)) return GESTURE.RESIZE;
  if (heldMs >= LONG_PRESS_MS) return GESTURE.MOVE;
  if (Math.hypot(dx, dy) < MOVE_THRESHOLD_PX) return GESTURE.PENDING;
  return GESTURE.MOVE;
}

function touchPoint(event) {
  return event.touches?.[0] || event.changedTouches?.[0] || null;
}

function mountedDataset(doc) {
  return doc?.documentElement?.dataset?.touchDnd || '';
}

export function mountTouchDndV195(options = {}) {
  const doc = options.document || globalThis.document;
  const DataTransferCtor = options.DataTransfer || globalThis.DataTransfer;
  const DragEventCtor = options.DragEvent || globalThis.DragEvent;
  const canvasId = options.canvasId || 'canvas';
  const force = options.force === true;
  const now = typeof options.now === 'function' ? options.now : () => Date.now();
  const schedule = typeof options.setTimeout === 'function' ? options.setTimeout : globalThis.setTimeout.bind(globalThis);
  const unschedule = typeof options.clearTimeout === 'function' ? options.clearTimeout : globalThis.clearTimeout.bind(globalThis);

  if (!doc?.addEventListener) {
    return { ok: false, reason: 'NO_DOCUMENT' };
  }
  if (!force && globalThis.__YAIWES_TOUCH_DND_V192__) {
    return { ok: false, reason: 'V192_ALREADY_MOUNTED', version: TOUCH_DND_VERSION };
  }
  if (!force && globalThis.__YAIWES_TOUCH_DND_V193__) {
    return { ok: false, reason: 'V193_ALREADY_MOUNTED', version: TOUCH_DND_VERSION };
  }
  if (!force && globalThis.__YAIWES_TOUCH_DND_V194__) {
    return { ok: false, reason: 'V194_ALREADY_MOUNTED', version: TOUCH_DND_VERSION };
  }
  const existingMark = mountedDataset(doc);
  if (!force && (existingMark === 'v192' || existingMark === 'v193' || existingMark === 'v194' || existingMark === 'v195')) {
    return { ok: false, reason: 'ALREADY_MOUNTED', version: TOUCH_DND_VERSION, mounted: existingMark };
  }
  if (force && globalThis.__YAIWES_TOUCH_DND_V195__?.destroy) {
    globalThis.__YAIWES_TOUCH_DND_V195__.destroy();
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
    pending: 0,
    promotedMove: 0,
    longPressPromoted: 0,
    taps: 0,
    commits: 0,
    cancels: 0,
    restored: 0,
    blockedResize: 0,
    scrollPassthrough: 0,
    ignoredSecondSession: 0,
    cycles: 0,
  };

  function canvasEl() {
    return doc.getElementById(canvasId);
  }

  function clearLongPress() {
    if (!session?.longPressTimer) return;
    unschedule(session.longPressTimer);
    session.longPressTimer = null;
  }

  function restoreOrigin(target) {
    if (!target?.node) return;
    target.node.style.left = `${target.left}px`;
    target.node.style.top = `${target.top}px`;
    target.node.classList.remove('is-pointer-moving');
    stats.restored += 1;
  }

  function promoteToMove(reason) {
    if (!session || session.kind === GESTURE.MOVE) return false;
    session.kind = GESTURE.MOVE;
    session.promotedBy = reason;
    stats.promotedMove += 1;
    if (reason === 'long-press') stats.longPressPromoted += 1;
    session.node.classList.add('selected', 'is-pointer-moving');
    clearLongPress();
    return true;
  }

  function begin(node, clientX, clientY, source, pointerId = null) {
    if (session) {
      stats.ignoredSecondSession += 1;
      return { accepted: false, reason: 'SESSION_ACTIVE' };
    }
    const kind = classifyGesture({
      node,
      clientX,
      clientY,
      startX: clientX,
      startY: clientY,
      dx: 0,
      dy: 0,
      heldMs: 0,
      phase: 'down',
    });
    if (kind === GESTURE.SCROLL) {
      stats.scrollPassthrough += 1;
      return { accepted: false, reason: 'SCROLL', kind };
    }
    if (kind === GESTURE.RESIZE) {
      stats.blockedResize += 1;
      return { accepted: false, reason: 'RESIZE', kind };
    }
    const origin = readNodeOrigin(node);
    session = {
      node,
      id: node?.dataset?.node,
      source,
      pointerId,
      kind: GESTURE.PENDING,
      startX: clientX,
      startY: clientY,
      x: clientX,
      y: clientY,
      left: origin.left,
      top: origin.top,
      startedAt: now(),
      longPressTimer: null,
      promotedBy: null,
    };
    stats.pending += 1;
    session.longPressTimer = schedule(() => {
      if (!session || session.kind !== GESTURE.PENDING) return;
      promoteToMove('long-press');
    }, LONG_PRESS_MS);
    return { accepted: true, kind: GESTURE.PENDING };
  }

  function matchesSession(source, pointerId) {
    if (!session) return false;
    if (session.source !== source) return false;
    if (session.pointerId != null && pointerId != null) return session.pointerId === pointerId;
    return true;
  }

  function move(clientX, clientY, event) {
    if (!session) return null;
    session.x = clientX;
    session.y = clientY;
    if (session.kind === GESTURE.PENDING) {
      const nextKind = classifyGesture({
        node: session.node,
        clientX,
        clientY,
        startX: session.startX,
        startY: session.startY,
        dx: clientX - session.startX,
        dy: clientY - session.startY,
        heldMs: now() - session.startedAt,
        phase: 'move',
      });
      if (nextKind !== GESTURE.MOVE) {
        return { kind: GESTURE.PENDING, stole: false };
      }
      promoteToMove('threshold');
    }
    if (session.kind === GESTURE.MOVE) {
      event?.preventDefault?.();
      event?.stopPropagation?.();
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
      return { kind: GESTURE.MOVE, origin: next, stole: true };
    }
    return { kind: session.kind, stole: false };
  }

  function commit() {
    if (!session || session.kind !== GESTURE.MOVE) return null;
    clearLongPress();
    const done = session;
    session = null;
    done.node.classList.remove('is-pointer-moving');
    const canvas = canvasEl();
    stats.cycles += 1;
    if (!canvas || !done.id || typeof DataTransferCtor !== 'function' || typeof DragEventCtor !== 'function') {
      return { ok: false, reason: 'NO_CANVAS_OR_TRANSFER', id: done.id, kind: GESTURE.MOVE };
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
    return { ok: true, id: done.id, origin, dropClient, kind: GESTURE.MOVE, committed: true };
  }

  function end(clientX, clientY, event) {
    if (!session) return null;
    if (session.kind === GESTURE.MOVE) {
      if (clientX != null && clientY != null) move(clientX, clientY, event);
      event?.preventDefault?.();
      event?.stopPropagation?.();
      return commit();
    }
    clearLongPress();
    stats.taps += 1;
    stats.cycles += 1;
    const done = session;
    session = null;
    done.node?.classList?.remove?.('is-pointer-moving');
    return { ok: true, kind: GESTURE.PENDING, committed: false, id: done.id };
  }

  function cancel(source) {
    if (!session || (source && session.source !== source)) return false;
    clearLongPress();
    restoreOrigin(session);
    stats.cancels += 1;
    stats.cycles += 1;
    session = null;
    return true;
  }

  doc.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse') return;
    stats.pointerDown += 1;
    if (session) {
      stats.ignoredSecondSession += 1;
      return;
    }
    const node = nodeFromTarget(event.target);
    begin(node, event.clientX, event.clientY, 'pointer', event.pointerId);
  }, capture);

  doc.addEventListener('pointermove', (event) => {
    if (!matchesSession('pointer', event.pointerId)) return;
    stats.pointerMove += 1;
    move(event.clientX, event.clientY, event);
  }, capture);

  doc.addEventListener('pointerup', (event) => {
    if (!matchesSession('pointer', event.pointerId)) return;
    stats.pointerUp += 1;
    end(event.clientX, event.clientY, event);
  }, capture);

  doc.addEventListener('pointercancel', (event) => {
    if (session?.source === 'pointer' && (session.pointerId == null || session.pointerId === event.pointerId)) {
      cancel('pointer');
    }
  }, capturePassive);

  doc.addEventListener('touchstart', (event) => {
    stats.touchStart += 1;
    if (session) {
      stats.ignoredSecondSession += 1;
      return;
    }
    const node = nodeFromTarget(event.target);
    const point = touchPoint(event);
    if (!point) {
      stats.scrollPassthrough += 1;
      return;
    }
    begin(node, point.clientX, point.clientY, 'touch');
  }, capture);

  doc.addEventListener('touchmove', (event) => {
    stats.touchMove += 1;
    if (!matchesSession('touch')) return;
    const point = touchPoint(event);
    if (!point) return;
    move(point.clientX, point.clientY, event);
  }, capture);

  doc.addEventListener('touchend', (event) => {
    stats.touchEnd += 1;
    if (!matchesSession('touch')) return;
    const point = touchPoint(event);
    end(point?.clientX, point?.clientY, event);
  }, capture);

  doc.addEventListener('touchcancel', () => {
    cancel('touch');
  }, capturePassive);

  if (doc.documentElement) doc.documentElement.dataset.touchDnd = 'v195';

  const api = {
    version: TOUCH_DND_VERSION,
    segmentId: SEGMENT_ID,
    getStats: () => ({ ...stats }),
    active: () => Boolean(session),
    sessionKind: () => session?.kind || null,
    fireLongPress() {
      if (!session || session.kind !== GESTURE.PENDING) return false;
      return promoteToMove('long-press');
    },
    destroy() {
      clearLongPress();
      abort.abort();
      session = null;
      if (doc.documentElement?.dataset?.touchDnd === 'v195') delete doc.documentElement.dataset.touchDnd;
      if (globalThis.__YAIWES_TOUCH_DND_V195__ === api) delete globalThis.__YAIWES_TOUCH_DND_V195__;
    },
  };
  globalThis.__YAIWES_TOUCH_DND_V195__ = api;
  return { ok: true, ...api };
}

if (typeof document !== 'undefined') {
  mountTouchDndV195({ auto: true });
}
