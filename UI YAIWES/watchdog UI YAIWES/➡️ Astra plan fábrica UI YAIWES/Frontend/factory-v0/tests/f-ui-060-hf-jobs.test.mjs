import assert from 'node:assert/strict';
import { sanitizeJobData, buildJobUrl, createHfJobsClient, normalizeJobState } from '../src/hf-jobs-panel-v1.js';

assert.equal(buildJobUrl('https://jobs.example/api',null),'https://jobs.example/api/run');
assert.equal(buildJobUrl('https://jobs.example/api','abc/123','logs'),'https://jobs.example/api/jobs/abc%2F123/logs');

const sanitized=sanitizeJobData({job_id:'j1',token:'raw-secret',nested:{api_key:'hidden',secret_ref:'HF_TOKEN'},logs:['ok']});
assert.equal(sanitized.token,'[REDACTED]');
assert.equal(sanitized.nested.api_key,'[REDACTED]');
assert.equal(sanitized.nested.secret_ref,'HF_TOKEN');

const seen=[];
const queue=[
  {ok:true,status:200,body:{job_id:'j1',stage:'RUNNING'}},
  {ok:true,status:200,body:{job_id:'j1',stage:'COMPLETED'}},
  {ok:true,status:200,body:{job_id:'j1',logs:'hello',authorization:'Bearer forbidden'}},
  {ok:true,status:200,body:{job_id:'j2',stage:'CANCELED'}}
];
const fakeFetch=async(url,init={})=>{
  const item=queue.shift();
  seen.push({url,init,body:init.body?JSON.parse(init.body):null});
  return {ok:item.ok,status:item.status,async text(){return JSON.stringify(item.body)}};
};
const client=createHfJobsClient({config:{url:'https://jobs.example/api',secret_ref:'HF_JOBS_TOKEN'},fetchImpl:fakeFetch});
const run=await client.run({command:'python -c "print(1)"',image:'python:3.12-slim',flavor:'cpu-basic'});
assert.equal(run.job_id,'j1');
assert.equal(seen[0].body.secret_ref,'HF_JOBS_TOKEN');
assert.equal('token' in seen[0].body,false);
assert.equal('api_key' in seen[0].body,false);
const status=await client.status('j1');
assert.equal(status.stage,'COMPLETED');
const logs=await client.logs('j1');
assert.equal(logs.logs,'hello');
assert.equal(logs.authorization,'[REDACTED]');
const canceled=await client.cancel('j2');
assert.equal(canceled.stage,'CANCELED');

const terminal=normalizeJobState({job_id:'j1',stage:'completed'});
assert.equal(terminal.stage,'COMPLETED');
assert.equal(terminal.terminal,true);
const cancelTerminal=normalizeJobState({job_id:'j2',status:'cancelled'});
assert.equal(cancelTerminal.terminal,true);
assert.throws(()=>createHfJobsClient({config:{url:'javascript:alert(1)'},fetchImpl:fakeFetch}),/valid HF Jobs proxy URL/);

console.log('RESULT PASS F-UI-060 run/status/logs/complete/cancel + secret sanitization');
