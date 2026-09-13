import assert from 'node:assert/strict';
import { buildAiAction, createRemoteTransport, submitAiJob } from '../src/frontend-router-bridge.js';

const config = {
  teamMode: 'quorum',
  models: [{ name: 'hf-model', role: 'coder', endpoint: 'https://router.example/model', secretRef: 'HF_TOKEN' }],
  remote: { protocol: 'API', url: 'https://router.example/run', secretRef: 'ROUTER_TOKEN' }
};

const action = buildAiAction({ goal: 'build editable card', models: config.models, teamMode: config.teamMode, remote: config.remote });
assert.equal(action.type, 'RUN_TASK');
assert.equal(action.payload.schema, 'yaiwes.ai-job/v1');
assert.equal(action.payload.models[0].secret_ref, 'HF_TOKEN');
assert.equal(action.payload.remote.secret_ref, 'ROUTER_TOKEN');
assert.equal('token' in action.payload.models[0], false);
assert.equal('api_key' in action.payload.models[0], false);

let captured;
const fakeFetch = async (url, init) => {
  captured = { url, init, body: JSON.parse(init.body) };
  return {
    ok: true,
    status: 200,
    async json() {
      return {
        type: 'TASK_EVENT',
        task_id: captured.body.action.task_id,
        action_type: captured.body.action.type,
        status: 'accepted',
        payload: { trace_id: 'trace-f-ui-050' }
      };
    }
  };
};

const event = await submitAiJob({ goal: 'build editable card', config, fetchImpl: fakeFetch });
assert.equal(captured.url, config.remote.url);
assert.equal(captured.init.method, 'POST');
assert.equal(captured.body.contract, 'tel.workflow/v3');
assert.equal(captured.body.action.payload.models[0].secret_ref, 'HF_TOKEN');
assert.equal(captured.body.action.payload.remote.secret_ref, 'ROUTER_TOKEN');
assert.equal(event.adapter_id, 'factory-frontend-router');
assert.equal(event.status, 'accepted');
assert.equal(event.payload.trace_id, 'trace-f-ui-050');

assert.throws(() => createRemoteTransport({ remote: { url: 'javascript:alert(1)' }, fetchImpl: fakeFetch }), /valid remote http/);
await assert.rejects(() => submitAiJob({ goal: '', config, fetchImpl: fakeFetch }), /AI goal required/);
await assert.rejects(() => submitAiJob({ goal: 'x', config: {}, fetchImpl: fakeFetch }), /remote router config required/);

console.log('RESULT PASS F-UI-050 runtime UI→tel.workflow/v3→remote router bridge');
