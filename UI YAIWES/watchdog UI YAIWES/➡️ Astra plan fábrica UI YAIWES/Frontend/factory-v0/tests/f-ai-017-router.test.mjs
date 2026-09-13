import assert from 'node:assert/strict';
import { createFactoryAIRouter } from '../src/ai-router-fai017.js';

let passed = 0;
const test = async (name, fn) => { await fn(); passed += 1; console.log(`PASS ${passed}: ${name}`); };

await test('routes explicit provider/model and returns traceable result', async () => {
  const seen = [];
  const router = createFactoryAIRouter({ providers: { local: async request => { seen.push(request); return { task_id: request.task_id, payload: { text: 'ok' } }; } } });
  const result = await router.route({ provider: 'local', model: 'model-a', task_id: 'ai-1', input: { prompt: 'build' } });
  assert.equal(seen.length, 1);
  assert.equal(seen[0].contract, 'tel.workflow/v3');
  assert.equal(seen[0].provider, 'local');
  assert.equal(seen[0].model, 'model-a');
  assert.equal(result.type, 'AI_RESULT');
  assert.equal(result.payload.text, 'ok');
  assert.equal(result.trace.provider, 'local');
  assert.equal(result.trace.model, 'model-a');
});

await test('fails closed for missing provider/model and unknown provider', async () => {
  const router = createFactoryAIRouter({ providers: { local: async () => ({ payload: null }) } });
  await assert.rejects(() => router.route({ model: 'm' }), /AI provider required/);
  await assert.rejects(() => router.route({ provider: 'local' }), /AI model required/);
  await assert.rejects(() => router.route({ provider: 'missing', model: 'm' }), /not configured/);
});

await test('rejects non-object provider responses', async () => {
  const router = createFactoryAIRouter({ providers: { broken: async () => null } });
  await assert.rejects(() => router.route({ provider: 'broken', model: 'm' }), /response object required/);
});

console.log(`RESULT PASS ${passed}/3`);
