import { createBackendBoundary, createSolContractAdapter } from '../backend-adapter.js';

const CONFIG_KEY='yaiwes-factory-config-v13';
const SUPPORTED=new Set(['MCP_HTTP','HTTP','API']);

function readConfig(storage=globalThis.localStorage){try{return JSON.parse(storage?.getItem?.(CONFIG_KEY)||'{}')}catch{return {}}}
function validUrl(value){try{const u=new URL(value);return u.protocol==='http:'||u.protocol==='https:'}catch{return false}}
function endpoint(remote){
  if(!remote||!SUPPORTED.has(remote.protocol)||!validUrl(remote.url))throw new Error('EVOLUTION_REMOTE_CONFIG_INVALID');
  return remote.url;
}

export function buildEvolutionAction(type,payload={},taskId=`factory-evolution-${Date.now()}`){
  const allowed=new Set(['DISCOVER_CAPABILITY','ACQUIRE_ASSET','COPY_ASSET','VERIFY_ASSET','REGISTER_PLUGIN','RESEARCH_GAP']);
  if(!allowed.has(type))throw new TypeError(`EVOLUTION_ACTION_UNSUPPORTED:${type}`);
  return {type,task_id:taskId,payload:{schema:'yaiwes.factory.evolution-action/v1',...structuredClone(payload)}};
}

export function createEvolutionTransport({remote,fetchImpl=globalThis.fetch}={}){
  const url=endpoint(remote);if(typeof fetchImpl!=='function')throw new TypeError('FETCH_REQUIRED');
  return async request=>{
    const response=await fetchImpl(url,{method:'POST',headers:{'content-type':'application/json','accept':'application/json'},body:JSON.stringify(request)});
    if(!response?.ok)throw new Error(`EVOLUTION_ROUTER_HTTP_${response?.status??'ERR'}`);
    const body=await response.json();if(!body||typeof body!=='object')throw new Error('EVOLUTION_ROUTER_RESPONSE_INVALID');return body;
  };
}

export function createEvolutionAdapter({remote,fetchImpl=globalThis.fetch}={}){
  const transport=createEvolutionTransport({remote,fetchImpl});
  return createBackendBoundary(createSolContractAdapter({transport,id:'factory-evolution-mcp-router-v1'}));
}

export async function invokeEvolution(type,payload,{storage=globalThis.localStorage,fetchImpl=globalThis.fetch}={}){
  const config=readConfig(storage);const remote=config?.evolutionRemote||config?.remote;
  const boundary=createEvolutionAdapter({remote,fetchImpl});
  return boundary.invoke(buildEvolutionAction(type,{...structuredClone(payload),transport_protocol:remote.protocol,secret_ref:remote.secretRef||null}));
}

export const EVOLUTION_TRANSPORT_CONTRACT=Object.freeze({schema:'yaiwes.factory.evolution-transport/v1',contract:'tel.workflow/v3',supported:[...SUPPORTED],secretPolicy:'SECRET_REF_ONLY',businessLogicInTransport:false});
globalThis.__YAIWES_EVOLUTION_TRANSPORT_V1__=Object.freeze({contract:EVOLUTION_TRANSPORT_CONTRACT,buildEvolutionAction,invokeEvolution});
