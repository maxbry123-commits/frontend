import assert from 'node:assert/strict';
import { invokeRemote, normalizeRouterReadback } from '../src/remote-control-v1.js';

const storage = { getItem(){ return JSON.stringify({remote:{protocol:'HTTP',url:'https://router.example/api',secretRef:'ROUTER_TOKEN'}}); } };
let clock=100;
const now=()=>{clock+=17;return clock;};
const seen=[];
const fakeFetch=async (url,init)=>{
  seen.push({url,init,body:init.body?JSON.parse(init.body):null});
  return {ok:true,status:200,async text(){return JSON.stringify({health:'healthy',models:['m1','m2'],active_route:'m2'});}};
};

const status=await invokeRemote('status',{storage,fetchImpl:fakeFetch,now});
assert.equal(status.state,'OK');
assert.equal(status.readback.health,'healthy');
assert.deepEqual(status.readback.models,['m1','m2']);
assert.equal(status.readback.active_route,'m2');
assert.equal(status.latency_ms,17);
assert.equal(seen[0].init.method,'GET');

const reconnect=await invokeRemote('reconnect',{storage,fetchImpl:fakeFetch,now});
assert.equal(reconnect.action,'reconnect');
assert.match(seen[1].url,/\/connect$/);
assert.equal(seen[1].body.action,'reconnect');
assert.equal(seen[1].body.secret_ref,'ROUTER_TOKEN');
assert.equal('token' in seen[1].body,false);
assert.equal('api_key' in seen[1].body,false);

const degraded=await invokeRemote('status',{storage,fetchImpl:async()=>({ok:true,status:200,async text(){return JSON.stringify({health:'degraded',models:[{name:'fallback'}],route:'fallback'});}}),now});
assert.equal(degraded.state,'DEGRADED');
assert.equal(degraded.readback.active_route,'fallback');

const unreachable=await invokeRemote('status',{storage,fetchImpl:async()=>{throw new TypeError('offline')},now});
assert.equal(unreachable.state,'UNREACHABLE');
assert.equal(unreachable.ok,false);

assert.deepEqual(normalizeRouterReadback(null),{health:'unknown',models:[],active_route:null});
console.log('RESULT PASS F-UI-059 health/models/route/latency/error/reconnect/readback');
