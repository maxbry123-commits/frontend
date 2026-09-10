export const STEPS = [
  { id: 1, key: 'CREATE', title: '1 · Crear' },
  { id: 2, key: 'COMPOSE', title: '2 · Componer' },
  { id: 3, key: 'TRANSFORM', title: '3 · Transformar' },
  { id: 4, key: 'AI', title: '4 · IA / Autopilot' },
  { id: 5, key: 'VALIDATE', title: '5 · Validar / Salir' }
];

export const initialState = {
  version: 1,
  step: 1,
  mode: 'MANUAL',
  selectedId: null,
  components: [
    { id: 'welcome-panel', kind: 'panel', label: 'Panel', x: 60, y: 60, w: 320, h: 180, props: { title: 'YAIWES' } }
  ],
  history: [],
  future: [],
  proposedDelta: null,
  evidence: []
};

const clone = (value) => JSON.parse(JSON.stringify(value));

export function snapshot(state) {
  const next = clone(state);
  next.history = [];
  next.future = [];
  return next;
}

export function withHistory(state, mutate) {
  const previous = snapshot(state);
  const draft = clone(state);
  draft.history = [...state.history, previous].slice(-50);
  draft.future = [];
  mutate(draft);
  return draft;
}

export function undo(state) {
  if (!state.history.length) return state;
  const previous = clone(state.history[state.history.length - 1]);
  previous.history = state.history.slice(0, -1);
  previous.future = [snapshot(state), ...state.future].slice(0, 50);
  return previous;
}

export function redo(state) {
  if (!state.future.length) return state;
  const next = clone(state.future[0]);
  next.history = [...state.history, snapshot(state)].slice(-50);
  next.future = state.future.slice(1);
  return next;
}
