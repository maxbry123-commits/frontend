import { withHistory, undo, redo, STEPS } from './state.js';

export function reduce(state, action) {
  switch (action.type) {
    case 'SET_STEP':
      return withHistory(state, s => { s.step = Math.max(1, Math.min(STEPS.length, action.step)); });
    case 'SET_MODE':
      return withHistory(state, s => { s.mode = action.mode; });
    case 'SELECT':
      return { ...state, selectedId: action.id };
    case 'ADD_COMPONENT':
      return withHistory(state, s => {
        const id = `${action.kind}-${Date.now()}`;
        s.components.push({ id, kind: action.kind, label: action.label || action.kind, x: 80, y: 80, w: 220, h: 120, props: {} });
        s.selectedId = id;
      });
    case 'UPDATE_COMPONENT':
      return withHistory(state, s => {
        const item = s.components.find(c => c.id === action.id);
        if (item) Object.assign(item, action.patch);
      });
    case 'PROPOSE_DELTA':
      return { ...state, proposedDelta: { id: `delta-${Date.now()}`, baseVersion: state.version, reason: action.reason, operations: action.operations || [], status: 'proposed' } };
    case 'APPLY_DELTA':
      if (!state.proposedDelta || state.proposedDelta.baseVersion !== state.version) return state;
      return withHistory(state, s => {
        for (const op of s.proposedDelta.operations) {
          if (op.type === 'ADD_COMPONENT') {
            const id = `${op.kind}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
            s.components.push({ id, kind: op.kind, label: op.label || op.kind, x: 100, y: 100, w: 240, h: 120, props: {} });
          }
        }
        s.proposedDelta.status = 'applied';
      });
    case 'SAVE_VERSION':
      return withHistory(state, s => {
        s.version += 1;
        s.evidence.push({ type: 'version', version: s.version, at: new Date().toISOString() });
        s.proposedDelta = null;
      });
    case 'UNDO': return undo(state);
    case 'REDO': return redo(state);
    default: return state;
  }
}
