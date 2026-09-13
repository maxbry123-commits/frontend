import assert from 'node:assert/strict';
import { createBackendBoundary, createSolContractAdapter } from '../src/backend-adapter.js';

const seen = [];
const transport = async request => {
  seen.push(request);
  return {
    type: 'TASK_EVENT',
    task_id: request.action.task_id,
    action_type: request.action.type,
    status: 'accepted',
    payload: request.action.payload
  };
};

const boundary = createBackendBoundary(createSolContractAdapter({ transport, id: 'factory-router-ui' }));
const action = {
  type: 'RUN_TASK',
  task_id: 'f-ui-049',
  payload: {
    provider: 'huggingface',
    model: 'configured-model',
    secret_ref: 'HF_TOKEN',
    prompt: 'frontend contract probe'
  }
};
const event = await boundary.invoke(action);

assert.equal(seen.length, 1);
assert.equal(seen[0].contract, 'tel.workflow/v3');
assert.deepEqual(seen[0].action, action);
assert.equal(event.adapter_id, 'factory-router-ui');
assert.equal(event.status, 'accepted');
assert.equal(event.payload.secret_ref, 'HF_TOKEN');
assert.equal(Object.prototype.hasOwnProperty.call(event.payload, 'token'), false);
assert.equal(Object.prototype.hasOwnProperty.call(event.payload, 'api_key'), false);

await assert.rejects(
  () => boundary.invoke(null),
  /typed action required/
);

console.log('RESULT PASS F-UI-049 frontend router contract/status + secret_ref fail-closed');
