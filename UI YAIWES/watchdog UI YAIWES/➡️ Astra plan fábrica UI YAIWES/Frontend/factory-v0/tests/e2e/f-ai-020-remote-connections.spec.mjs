import assert from 'node:assert/strict';
import fs from 'node:fs';
import { invokeRemote, buildRemoteActionUrl } from '../../src/remote-control-v1.js';

const CONFIG_KEY = 'yaiwes-factory-config-v13';
const storageFor = remote => ({
  getItem(key) { return key === CONFIG_KEY ? JSON.stringify({ remote }) : null; }
});
const response = (status, payload) => ({
  ok: status >= 200 && status < 300,
  status,
  async text() { return payload == null ? '' : JSON.stringify(payload); }
});

let passed = 0;
async function check(name, fn) {
  await fn();
  passed += 1;
  console.log(`PASS ${name}`);
}

await check('SIM1 MCP_HTTP connect POST uses secret_ref only', async () => {
  let observed;
  const result = await invokeRemote('connect', {
    storage: storageFor({ url: 'https://router.example/mcp', protocol: 'MCP_HTTP', secretRef: 'secret://router/api-key' }),
    fetchImpl: async (url, init) => { observed = { url, init }; return response(200, { connected: true }); }
  });
  assert.equal(result.ok, true);
  assert.equal(result.action, 'connect');
  assert.equal(observed.url, 'https://router.example/mcp/connect');
  assert.equal(observed.init.method, 'POST');
  const body = JSON.parse(observed.init.body);
  assert.deepEqual(body, { protocol: 'MCP_HTTP', secret_ref: 'secret://router/api-key', action: 'connect' });
  assert.equal('token' in body, false);
  assert.equal('api_key' in body, false);
});

await check('SIM2 status uses GET and no request body', async () => {
  let observed;
  const result = await invokeRemote('status', {
    storage: storageFor({ url: 'https://router.example/api/', protocol: 'HTTP', secretRef: 'secret://router/ref' }),
    fetchImpl: async (url, init) => { observed = { url, init }; return response(200, { status: 'ready' }); }
  });
  assert.equal(result.state, 'OK');
  assert.equal(observed.url, 'https://router.example/api/status');
  assert.equal(observed.init.method, 'GET');
  assert.equal(observed.init.body, undefined);
});

await check('SIM3 API cancel POST normalizes non-2xx state', async () => {
  let observed;
  const result = await invokeRemote('cancel', {
    storage: storageFor({ url: 'https://router.example/jobs', protocol: 'API', secretRef: null }),
    fetchImpl: async (url, init) => { observed = { url, init }; return response(409, { cancelled: false }); }
  });
  assert.equal(observed.url, 'https://router.example/jobs/cancel');
  assert.equal(observed.init.method, 'POST');
  assert.equal(result.ok, false);
  assert.equal(result.state, 'HTTP_409');
});

await check('REFUTE1 missing remote config fails closed without network call', async () => {
  let calls = 0;
  const result = await invokeRemote('connect', {
    storage: storageFor(null),
    fetchImpl: async () => { calls += 1; throw new Error('must not call'); }
  });
  assert.equal(result.state, 'INVALID_CONFIG');
  assert.equal(calls, 0);
});

await check('REFUTE2 unsupported protocol fails closed without network call', async () => {
  let calls = 0;
  const result = await invokeRemote('status', {
    storage: storageFor({ url: 'https://router.example', protocol: 'FTP' }),
    fetchImpl: async () => { calls += 1; throw new Error('must not call'); }
  });
  assert.equal(result.state, 'UNSUPPORTED_PROTOCOL');
  assert.equal(calls, 0);
});

await check('REFUTE3 unreachable network is normalized and entrypoint wiring exists', async () => {
  const result = await invokeRemote('cancel', {
    storage: storageFor({ url: 'https://router.example', protocol: 'MCP_HTTP', secretRef: 'secret://ref' }),
    fetchImpl: async () => { const error = new Error('offline'); error.name = 'NetworkError'; throw error; }
  });
  assert.equal(result.state, 'UNREACHABLE');
  assert.equal(result.error, 'NetworkError');
  const index = fs.readFileSync(new URL('../../index-v19.html', import.meta.url), 'utf8');
  assert.match(index, /src\/remote-control-v1\.js/);
});

assert.equal(buildRemoteActionUrl('https://router.example/base/', 'status'), 'https://router.example/base/status');
assert.equal(passed, 6);
console.log('F_AI_020_RESULT=PASS_6_OF_6');
