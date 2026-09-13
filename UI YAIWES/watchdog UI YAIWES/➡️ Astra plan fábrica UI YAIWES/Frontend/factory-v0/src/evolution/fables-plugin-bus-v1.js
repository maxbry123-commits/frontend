// FABLES = Factory Adapter Bus for Loadable Extension Sockets.
// Project-local deterministic contract; no remote eval and no implicit code loading.
const plugins=new Map();
const trace=[];
const MAX_TRACE=200;

function clone(v){return v==null?v:structuredClone(v)}
function record(type,payload={}){
  const row=Object.freeze({seq:trace.length+1,at:new Date().toISOString(),type,...clone(payload)});
  trace.push(row);if(trace.length>MAX_TRACE)trace.shift();return row;
}
function assertManifest(manifest){
  if(!manifest||typeof manifest!=='object')throw new TypeError('FABLES_MANIFEST_REQUIRED');
  if(!/^[a-z0-9][a-z0-9._-]*$/i.test(String(manifest.id||'')))throw new TypeError('FABLES_ID_INVALID');
  if(!String(manifest.version||'').trim())throw new TypeError('FABLES_VERSION_REQUIRED');
  if(!Array.isArray(manifest.capabilities)||!manifest.capabilities.length)throw new TypeError('FABLES_CAPABILITIES_REQUIRED');
  if(!['LOCAL','MCP','ROUTER','HTTP_API'].includes(manifest.transport))throw new TypeError('FABLES_TRANSPORT_INVALID');
  return Object.freeze({...clone(manifest),permissions:Object.freeze([...(manifest.permissions||[])]),capabilities:Object.freeze([...manifest.capabilities])});
}

export function registerPlugin(manifest,adapter){
  const m=assertManifest(manifest);
  if(!adapter||typeof adapter.invoke!=='function')throw new TypeError('FABLES_ADAPTER_INVOKE_REQUIRED');
  if(plugins.has(m.id))throw new Error(`FABLES_DUPLICATE_PLUGIN:${m.id}`);
  plugins.set(m.id,{manifest:m,adapter,enabled:true,registeredAt:new Date().toISOString()});
  record('REGISTER',{plugin_id:m.id,version:m.version,transport:m.transport});
  return m.id;
}
export function unregisterPlugin(id){const existed=plugins.delete(id);if(existed)record('UNREGISTER',{plugin_id:id});return existed}
export function setPluginEnabled(id,enabled){const p=plugins.get(id);if(!p)throw new Error(`FABLES_PLUGIN_NOT_FOUND:${id}`);p.enabled=Boolean(enabled);record(p.enabled?'ENABLE':'DISABLE',{plugin_id:id});return p.enabled}
export function listPlugins(){return [...plugins.values()].map(p=>({manifest:clone(p.manifest),enabled:p.enabled,registeredAt:p.registeredAt}))}
export function findPlugins(capability){const c=String(capability||'');return listPlugins().filter(p=>p.enabled&&p.manifest.capabilities.includes(c))}
export async function invokePlugin(id,action){
  const p=plugins.get(id);if(!p)throw new Error(`FABLES_PLUGIN_NOT_FOUND:${id}`);if(!p.enabled)throw new Error(`FABLES_PLUGIN_DISABLED:${id}`);
  if(!action||typeof action.type!=='string')throw new TypeError('FABLES_TYPED_ACTION_REQUIRED');
  const started=performance?.now?.()??Date.now();record('INVOKE_START',{plugin_id:id,action_type:action.type});
  try{
    const result=await p.adapter.invoke(clone(action));
    record('INVOKE_OK',{plugin_id:id,action_type:action.type,latency_ms:Math.round((performance?.now?.()??Date.now())-started)});
    return clone(result);
  }catch(error){record('INVOKE_ERROR',{plugin_id:id,action_type:action.type,error:String(error?.message||error)});throw error}
}
export async function healthPlugin(id){
  const p=plugins.get(id);if(!p)return {ok:false,state:'NOT_FOUND'};
  if(!p.enabled)return {ok:false,state:'DISABLED'};
  if(typeof p.adapter.health!=='function')return {ok:true,state:'NO_HEALTH_PROBE'};
  try{return {ok:true,state:'OK',detail:clone(await p.adapter.health())}}catch(error){return {ok:false,state:'ERROR',error:String(error?.message||error)}}
}
export function getFablesTrace(){return clone(trace)}

export const FABLES_CONTRACT=Object.freeze({schema:'yaiwes.fables.plugin/v1',name:'Factory Adapter Bus for Loadable Extension Sockets',deterministic:true,remoteEval:false,requiredManifest:['id','version','capabilities','transport'],lifecycle:['register','enable','invoke','health','disable','unregister']});
globalThis.__YAIWES_FABLES_V1__=Object.freeze({contract:FABLES_CONTRACT,registerPlugin,unregisterPlugin,setPluginEnabled,listPlugins,findPlugins,invokePlugin,healthPlugin,getTrace:getFablesTrace});
