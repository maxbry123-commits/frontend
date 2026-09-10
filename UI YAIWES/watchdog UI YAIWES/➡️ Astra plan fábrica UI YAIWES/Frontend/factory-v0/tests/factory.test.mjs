import assert from 'node:assert/strict';
import { initialState, STEPS, undo, redo } from '../src/state.js';
import { reduce } from '../src/actions.js';

const copy = value => JSON.parse(JSON.stringify(value));
let passed = 0;
const test = (name, fn) => {
  fn();
  passed += 1;
  console.log(`PASS ${passed}: ${name}`);
};

test('factory exposes exactly five ordered steps', () => {
  assert.deepEqual(STEPS.map(s => s.key), ['CREATE', 'COMPOSE', 'TRANSFORM', 'AI', 'VALIDATE']);
});

test('SET_STEP clamps below and above valid range', () => {
  assert.equal(reduce(copy(initialState), { type: 'SET_STEP', step: -100 }).step, 1);
  assert.equal(reduce(copy(initialState), { type: 'SET_STEP', step: 999 }).step, 5);
});

test('mode changes are reversible with undo/redo', () => {
  const s1 = reduce(copy(initialState), { type: 'SET_MODE', mode: 'AI_ASSIST' });
  assert.equal(s1.mode, 'AI_ASSIST');
  const s2 = undo(s1);
  assert.equal(s2.mode, 'MANUAL');
  const s3 = redo(s2);
  assert.equal(s3.mode, 'AI_ASSIST');
});

test('AI proposal does not mutate canonical components before APPLY_DELTA', () => {
  const base = copy(initialState);
  const proposed = reduce(base, {
    type: 'PROPOSE_DELTA',
    reason: 'simulation',
    operations: [{ type: 'ADD_COMPONENT', kind: 'button', label: 'Run' }]
  });
  assert.equal(proposed.components.length, initialState.components.length);
  assert.equal(proposed.proposedDelta.status, 'proposed');
  const applied = reduce(proposed, { type: 'APPLY_DELTA' });
  assert.equal(applied.components.length, initialState.components.length + 1);
  assert.equal(applied.proposedDelta.status, 'applied');
});

test('stale delta is rejected when baseVersion differs', () => {
  let state = reduce(copy(initialState), {
    type: 'PROPOSE_DELTA',
    reason: 'stale-check',
    operations: [{ type: 'ADD_COMPONENT', kind: 'panel' }]
  });
  state = { ...state, version: state.version + 1 };
  const after = reduce(state, { type: 'APPLY_DELTA' });
  assert.equal(after.components.length, state.components.length);
});

test('SAVE_VERSION increments version, records evidence and clears delta', () => {
  let state = reduce(copy(initialState), {
    type: 'PROPOSE_DELTA',
    reason: 'version-check',
    operations: []
  });
  state = reduce(state, { type: 'SAVE_VERSION' });
  assert.equal(state.version, 2);
  assert.equal(state.proposedDelta, null);
  assert.equal(state.evidence.at(-1).type, 'version');
  assert.equal(state.evidence.at(-1).version, 2);
});

console.log(`RESULT PASS ${passed}/6`);
