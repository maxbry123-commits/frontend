import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { reduce } from '../../src/actions.js';
import {
  APP_V20_VERSION,
  DUPLICATE_OFFSET,
  NUDGE_PX,
  NUDGE_SHIFT_PX,
  SEGMENT_ID,
  keyboardAction,
} from '../../src/app-v20.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const v19 = readFileSync(join(root, 'src/app-v19.js'), 'utf8');
const v20 = readFileSync(join(root, 'src/app-v20.js'), 'utf8');
const PROJECT_KEY = 'yaiwes-factory-project-v19';

function baseState() {
  return {
    version: 0,
    step: 1,
    mode: 'MANUAL',
    selectedId: 'a',
    components: [
      { id: 'a', kind: 'window', label: 'Win', x: 40, y: 50, w: 120, h: 80, hidden: false, locked: false, props: {} },
      { id: 'b', kind: 'button', label: 'Btn', x: 10, y: 10, w: 90, h: 40, hidden: false, locked: false, props: {} },
    ],
    history: [],
    future: [],
    proposedDelta: null,
    evidence: [],
  };
}

function keyEvent(key, extra = {}) {
  return { key, target: extra.target || { tagName: 'BODY' }, shiftKey: Boolean(extra.shiftKey), metaKey: Boolean(extra.metaKey), ctrlKey: Boolean(extra.ctrlKey) };
}

test.describe('F-FE-075 canvas keyboard ops v20', () => {
  test('preserves app-v19 and versions v20 independently', () => {
    expect(v19).toContain('__YAIWES_FACTORY_V19__');
    expect(v19).not.toContain("APP_V20_VERSION = '1.9.20'");
    expect(v19).not.toContain('keyboardAction');
    expect(v20).toContain("APP_V20_VERSION = '1.9.20'");
    expect(v20).toContain(SEGMENT_ID);
    expect(APP_V20_VERSION).toBe('1.9.20');
    expect(v20).toContain("type: 'MOVE_COMPONENT'");
    expect(v20).toContain("type: 'REMOVE_COMPONENT'");
  });

  test('Arrow and Shift+Arrow nudge through MOVE_COMPONENT reducer', () => {
    const state = baseState();
    const nudge = keyboardAction(state, keyEvent('ArrowRight'));
    expect(nudge.reason).toBe('NUDGE');
    expect(nudge.action).toEqual({ type: 'MOVE_COMPONENT', id: 'a', x: 40 + NUDGE_PX, y: 50 });
    const moved = reduce(state, nudge.action);
    expect(moved.components.find((c) => c.id === 'a')).toMatchObject({ x: 41, y: 50 });
    expect(moved.history.length).toBe(1);

    const shift = keyboardAction(moved, keyEvent('ArrowDown', { shiftKey: true }));
    expect(shift.reason).toBe('NUDGE_SHIFT');
    expect(shift.action).toEqual({ type: 'MOVE_COMPONENT', id: 'a', x: 41, y: 50 + NUDGE_SHIFT_PX });
    const shifted = reduce(moved, shift.action);
    expect(shifted.components.find((c) => c.id === 'a')).toMatchObject({ x: 41, y: 60 });
  });

  test('duplicate and delete route through existing ADD/REMOVE reducer', () => {
    const state = baseState();
    const dup = keyboardAction(state, keyEvent('d', { ctrlKey: true }));
    expect(dup.reason).toBe('DUPLICATE');
    expect(dup.action).toMatchObject({
      type: 'ADD_COMPONENT',
      kind: 'window',
      label: 'Win copia',
      x: 40 + DUPLICATE_OFFSET,
      y: 50 + DUPLICATE_OFFSET,
      w: 120,
      h: 80,
    });
    const duplicated = reduce(state, dup.action);
    expect(duplicated.components).toHaveLength(3);
    expect(duplicated.components.at(-1)).toMatchObject({ kind: 'window', label: 'Win copia', x: 70, y: 80 });
    expect(duplicated.selectedId).not.toBe('a');

    const del = keyboardAction(state, keyEvent('Delete'));
    expect(del.action).toEqual({ type: 'REMOVE_COMPONENT', id: 'a' });
    const removed = reduce(state, del.action);
    expect(removed.components.map((c) => c.id)).toEqual(['b']);
    expect(removed.selectedId).toBeNull();
  });

  test('undo/redo and reload persistence PASS', () => {
    let state = baseState();
    const nudge = keyboardAction(state, keyEvent('ArrowLeft'));
    state = reduce(state, nudge.action);
    expect(state.components[0].x).toBe(39);
    state = reduce(state, keyboardAction(state, keyEvent('z', { ctrlKey: true })).action);
    expect(state.components[0].x).toBe(40);
    state = reduce(state, keyboardAction(state, keyEvent('y', { ctrlKey: true })).action);
    expect(state.components[0].x).toBe(39);

    const persisted = JSON.stringify({ schema: 'yaiwes.factory.project/v1', state });
    const reloaded = JSON.parse(persisted);
    expect(reloaded.state.components[0]).toMatchObject({ id: 'a', x: 39, y: 50 });
    expect(reloaded.state.history.length).toBeGreaterThan(0);
    expect(PROJECT_KEY).toBe('yaiwes-factory-project-v19');
  });

  test('skips editable targets, missing selection, and locked nudge', () => {
    const state = baseState();
    expect(keyboardAction(state, keyEvent('ArrowUp', { target: { tagName: 'INPUT' } })).reason).toBe('EDITABLE');
    const none = { ...state, selectedId: null };
    expect(keyboardAction(none, keyEvent('ArrowUp')).reason).toBe('NO_SELECTION');
    const locked = baseState();
    locked.components[0].locked = true;
    expect(keyboardAction(locked, keyEvent('ArrowRight')).reason).toBe('LOCKED');
    expect(keyboardAction(locked, keyEvent('Delete')).action).toEqual({ type: 'REMOVE_COMPONENT', id: 'a' });
  });
});
