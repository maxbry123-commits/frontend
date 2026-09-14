import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { reduce } from '../../src/actions.js';
import {
  APP_V21_VERSION,
  SEGMENT_ID,
  additiveSelectAction,
  groupMoveAction,
  marqueeSelectAction,
  reduceV21,
  selectedIdsOf,
  singleSelectAction,
} from '../../src/app-v21.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const v20 = readFileSync(join(root, 'src/app-v20.js'), 'utf8');
const v21 = readFileSync(join(root, 'src/app-v21.js'), 'utf8');

function baseState() {
  return {
    version: 0,
    step: 1,
    mode: 'MANUAL',
    selectedId: 'a',
    selectedIds: ['a'],
    components: [
      { id: 'a', kind: 'window', label: 'Win', x: 10, y: 10, w: 40, h: 40, hidden: false, locked: false, props: {} },
      { id: 'b', kind: 'button', label: 'Btn', x: 80, y: 10, w: 40, h: 40, hidden: false, locked: false, props: {} },
      { id: 'c', kind: 'panel', label: 'Out', x: 200, y: 200, w: 40, h: 40, hidden: false, locked: false, props: {} },
      { id: 'd', kind: 'window', label: 'Lock', x: 12, y: 80, w: 40, h: 40, hidden: false, locked: true, props: {} },
    ],
    history: [],
    future: [],
    proposedDelta: null,
    evidence: [],
  };
}

test.describe('F-FE-076 canvas multiselect v21', () => {
  test('preserves app-v20 and versions v21 independently', () => {
    expect(v20).toContain("APP_V20_VERSION = '1.9.20'");
    expect(v20).not.toContain("APP_V21_VERSION = '1.9.21'");
    expect(v20).not.toContain('MOVE_COMPONENTS');
    expect(v21).toContain("APP_V21_VERSION = '1.9.21'");
    expect(v21).toContain(SEGMENT_ID);
    expect(APP_V21_VERSION).toBe('1.9.21');
    expect(v21).toContain("type: 'SET_SELECTION'");
    expect(v21).toContain("type: 'MOVE_COMPONENTS'");
  });

  test('marquee selects exact intersecting nodes', () => {
    const state = baseState();
    const marquee = marqueeSelectAction(state, { x: 0, y: 0, w: 130, h: 60 });
    expect(marquee.reason).toBe('MARQUEE');
    expect(marquee.action.ids.sort()).toEqual(['a', 'b']);
    const next = reduceV21(state, marquee.action);
    expect(selectedIdsOf(next).sort()).toEqual(['a', 'b']);
    expect(next.selectedId).toBe('a');
    const miss = reduceV21(state, marqueeSelectAction(state, { x: 300, y: 300, w: 10, h: 10 }).action);
    expect(selectedIdsOf(miss)).toEqual([]);
  });

  test('modifier additive select and single select remain compatible', () => {
    let state = baseState();
    state = reduceV21(state, additiveSelectAction(state, 'b').action);
    expect(selectedIdsOf(state).sort()).toEqual(['a', 'b']);
    state = reduceV21(state, additiveSelectAction(state, 'a').action);
    expect(selectedIdsOf(state)).toEqual(['b']);
    const single = reduceV21(state, singleSelectAction('c').action);
    expect(selectedIdsOf(single)).toEqual(['c']);
    expect(single.selectedId).toBe('c');
    const viaLegacy = reduceV21(single, { type: 'SELECT', id: 'a' });
    expect(selectedIdsOf(viaLegacy)).toEqual(['a']);
    expect(reduce(single, { type: 'SELECT', id: 'a' }).selectedId).toBe('a');
  });

  test('group move preserves relative offsets and undo restores all positions', () => {
    let state = reduceV21(baseState(), { type: 'SET_SELECTION', ids: ['a', 'b'] });
    const origin = state.components.filter((c) => c.id === 'a' || c.id === 'b').map((c) => ({ id: c.id, x: c.x, y: c.y }));
    const move = groupMoveAction(state, 15, 20);
    expect(move.reason).toBe('GROUP_MOVE');
    state = reduceV21(state, move.action);
    const a = state.components.find((c) => c.id === 'a');
    const b = state.components.find((c) => c.id === 'b');
    expect(a).toMatchObject({ x: 25, y: 30 });
    expect(b).toMatchObject({ x: 95, y: 30 });
    expect(b.x - a.x).toBe(origin[1].x - origin[0].x);
    expect(b.y - a.y).toBe(origin[1].y - origin[0].y);
    expect(state.components.find((c) => c.id === 'c')).toMatchObject({ x: 200, y: 200 });
    expect(state.history.length).toBe(1);
    state = reduceV21(state, { type: 'UNDO' });
    expect(state.components.find((c) => c.id === 'a')).toMatchObject({ x: 10, y: 10 });
    expect(state.components.find((c) => c.id === 'b')).toMatchObject({ x: 80, y: 10 });
    state = reduceV21(state, { type: 'REDO' });
    expect(state.components.find((c) => c.id === 'a')).toMatchObject({ x: 25, y: 30 });
    expect(state.components.find((c) => c.id === 'b')).toMatchObject({ x: 95, y: 30 });
  });

  test('locked nodes are skipped by group move; hidden skipped by marquee', () => {
    const state = reduceV21(baseState(), { type: 'SET_SELECTION', ids: ['a', 'd'] });
    const moved = reduceV21(state, groupMoveAction(state, 10, 0).action);
    expect(moved.components.find((c) => c.id === 'a').x).toBe(20);
    expect(moved.components.find((c) => c.id === 'd').x).toBe(12);
    const hidden = baseState();
    hidden.components[1].hidden = true;
    const ids = marqueeSelectAction(hidden, { x: 0, y: 0, w: 130, h: 60 }).action.ids;
    expect(ids).toEqual(['a']);
  });
});
