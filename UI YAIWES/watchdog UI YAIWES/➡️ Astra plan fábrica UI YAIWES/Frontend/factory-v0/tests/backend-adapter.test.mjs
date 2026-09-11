import assert from 'node:assert/strict';
import { createBackendBoundary, createMockAdapter, createSolContractAdapter } from '../src/backend-adapter.js';

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

await test('frontend swaps mock to Sol contract adapter without changing TypedAction shape', async () => {
  const boundary = createBackendBoundary(createMockAdapter('mock-a'));
  const action = { type: 'RUN_TASK', task_id: 't2', payload: { goal: 'same-ui-contract' } };
  const first = await boundary.invoke(action);
  const seen = [];
  const sol = createSolContractAdapter({
    transport: async request => {
      seen.push(request);
      return {
        type: 'TASK_EVENT',
        task_id: request.action.task_id,
        action_type: request.action.type,
        status: 'accepted',
        payload: request.action.payload
      };
    }
  });
  boundary.setAdapter(sol);
  const second = await boundary.invoke(action);
  assert.equal(seen.length, 1);
  assert.equal(seen[0].contract, 'tel.workflow/v3');
  assert.deepEqual(seen[0].action, action);
  assert.equal(first.action_type, second.action_type);
  assert.deepEqual(first.payload, second.payload);
  assert.equal(second.adapter_id, 'sol-contract-adapter');
});

await test('invalid adapter, transport or event fails closed', async () => {
  assert.throws(() => createBackendBoundary({ id: 'broken' }), /adapter.invoke required/);
  assert.throws(() => createSolContractAdapter(), /transport function required/);
  const boundary = createBackendBoundary({ id: 'bad-event', async invoke() { return {}; } });
  await assert.rejects(() => boundary.invoke({ type: 'RUN_TASK' }), /normalized event required/);
});

console.log(`RESULT PASS ${passed}/3`);
