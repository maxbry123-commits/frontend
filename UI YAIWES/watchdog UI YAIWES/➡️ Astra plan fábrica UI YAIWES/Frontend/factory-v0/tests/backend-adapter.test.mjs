import assert from 'node:assert/strict';
import { createBackendBoundary, createMockAdapter } from '../src/backend-adapter.js';

let passed = 0;
const test = async (name, fn) => {
  await fn();
  passed += 1;
  console.log(`PASS ${passed}: ${name}`);
};

await test('mock adapter accepts TypedAction and returns normalized event', async () => {
  const boundary = createBackendBoundary(createMockAdapter());
  const event = await boundary.invoke({ type: 'RUN_TASK', task_id: 't1', payload: { goal: 'preview' } });
  assert.equal(event.type, 'TASK_EVENT');
  assert.equal(event.status, 'accepted');
  assert.equal(event.task_id, 't1');
  assert.equal(event.adapter_id, 'mock-sol-compatible');
});

await test('adapter can be swapped without changing frontend action shape', async () => {
  const boundary = createBackendBoundary(createMockAdapter('mock-a'));
  const action = { type: 'RUN_TASK', task_id: 't2', payload: { goal: 'same-ui-contract' } };
  const first = await boundary.invoke(action);
  boundary.setAdapter({
    id: 'sol-contract-candidate',
    async invoke(input) {
      return { type: 'TASK_EVENT', task_id: input.task_id, action_type: input.type, status: 'accepted', payload: input.payload };
    }
  });
  const second = await boundary.invoke(action);
  assert.equal(first.action_type, second.action_type);
  assert.deepEqual(first.payload, second.payload);
  assert.equal(second.adapter_id, 'sol-contract-candidate');
});

await test('invalid adapter or event fails closed', async () => {
  assert.throws(() => createBackendBoundary({ id: 'broken' }), /adapter.invoke required/);
  const boundary = createBackendBoundary({ id: 'bad-event', async invoke() { return {}; } });
  await assert.rejects(() => boundary.invoke({ type: 'RUN_TASK' }), /normalized event required/);
});

console.log(`RESULT PASS ${passed}/3`);
