import assert from 'node:assert/strict';
import { initialState, snapshot } from '../../src/state.js';
import { reduce } from '../../src/actions.js';

const clone = value => structuredClone(value);
const clean = state => snapshot(state);

function addWindow(state, x = 80, y = 80) {
  return reduce(state, { type: 'ADD_COMPONENT', kind: 'window', label: 'History target', x, y, w: 220, h: 120 });
}

let passed = 0;
const check = (name, fn) => {
  fn();
  passed += 1;
  console.log(`PASS ${name}`);
};

check('SIM1 undo restores exact previous project snapshot', () => {
  let state = addWindow(clone(initialState));
  const id = state.components[0].id;
  const beforeMove = clean(state);
  state = reduce(state, { type: 'MOVE_COMPONENT', id, x: 333, y: 222 });
  const moved = clean(state);
  assert.equal(state.components[0].x, 333);
  state = reduce(state, { type: 'UNDO' });
  assert.deepEqual(clean(state), beforeMove);
  assert.equal(state.future.length, 1);
  state = reduce(state, { type: 'REDO' });
  assert.deepEqual(clean(state), moved);
});

check('SIM2 redo chain reproduces multiple exact states', () => {
  let state = addWindow(clone(initialState), 10, 20);
  const id = state.components[0].id;
  state = reduce(state, { type: 'UPDATE_COMPONENT', id, patch: { label: 'A' } });
  const a = clean(state);
  state = reduce(state, { type: 'UPDATE_COMPONENT', id, patch: { label: 'B', w: 444 } });
  const b = clean(state);
  state = reduce(state, { type: 'UNDO' });
  assert.deepEqual(clean(state), a);
  state = reduce(state, { type: 'REDO' });
  assert.deepEqual(clean(state), b);
});

check('SIM3 history is bounded to 50 snapshots without state corruption', () => {
  let state = clone(initialState);
  for (let i = 0; i < 60; i += 1) state = reduce(state, { type: 'SET_MODE', mode: `MODE_${i}` });
  assert.equal(state.history.length, 50);
  assert.equal(state.mode, 'MODE_59');
  for (const entry of state.history) {
    assert.deepEqual(entry.history, []);
    assert.deepEqual(entry.future, []);
  }
});

check('REFUTE1 new mutation after undo invalidates redo future', () => {
  let state = addWindow(clone(initialState));
  const id = state.components[0].id;
  state = reduce(state, { type: 'MOVE_COMPONENT', id, x: 200, y: 210 });
  state = reduce(state, { type: 'UNDO' });
  assert.equal(state.future.length, 1);
  state = reduce(state, { type: 'UPDATE_COMPONENT', id, patch: { label: 'branch' } });
  assert.equal(state.future.length, 0);
  const branched = clean(state);
  state = reduce(state, { type: 'REDO' });
  assert.deepEqual(clean(state), branched);
});

check('REFUTE2 undo/redo on empty stacks are no-op and do not corrupt state', () => {
  const base = clone(initialState);
  assert.deepEqual(reduce(base, { type: 'UNDO' }), base);
  assert.deepEqual(reduce(base, { type: 'REDO' }), base);
});

check('REFUTE3 snapshots never recursively retain history/future', () => {
  let state = addWindow(clone(initialState));
  const id = state.components[0].id;
  state = reduce(state, { type: 'MOVE_COMPONENT', id, x: 101, y: 202 });
  state = reduce(state, { type: 'UPDATE_COMPONENT', id, patch: { h: 321 } });
  for (const entry of [...state.history, ...state.future]) {
    assert.deepEqual(entry.history, []);
    assert.deepEqual(entry.future, []);
  }
});

assert.equal(passed, 6);
console.log('F_CTL_010_RESULT=PASS_6_OF_6');
