const CONFIG_KEY='yaiwes-factory-config-v13';
const SUPPORTED=new Set(['MCP_HTTP','HTTP','API']);
const events=[];

const readConfig=(storage=globalThis.localStorage)=>{try{return JSON.parse(storage?.getItem?.(CONFIG_KEY)||'{}')}catch{return {}}};
export function buildRemoteActionUrl(base,action){
  const u=new URL(base);
  u.pathname=`${u.pathname.replace(/\/$/,'')}/${action}`;
  return u.toString();
}

export function normalizeRouterReadback(data){
  const body=data&&typeof data==='object'?data:{};
  const models=Array.isArray(body.models)?body.models:[];
  const activeRoute=body.active_route??body.route??body.model??null;
  const health=String(body.health??body.status??'unknown').toLowerCase();
  return {health,models,active_route:activeRoute};
}

export async function invokeRemote(action,{storage=globalThis.localStorage,fetchImpl=globalThis.fetch,now=()=>globalThis.performance?.now?.()??Date.now()}={}){
  if(!['connect','reconnect','status','cancel'].includes(action))throw new Error('INVALID_REMOTE_ACTION');
  const remote=readConfig(storage).remote;
  if(!remote?.url)return {ok:false,state:'INVALID_CONFIG',action,latency_ms:0,readback:normalizeRouterReadback(null)};
  if(!SUPPORTED.has(remote.protocol))return {ok:false,state:'UNSUPPORTED_PROTOCOL',action,protocol:remote.protocol,latency_ms:0,readback:normalizeRouterReadback(null)};
  const endpointAction=action==='reconnect'?'connect':action;
  let url;
  try{url=buildRemoteActionUrl(remote.url,endpointAction)}catch{return {ok:false,state:'INVALID_URL',action,latency_ms:0,readback:normalizeRouterReadback(null)}};
  const init={method:action==='status'?'GET':'POST',headers:{'Accept':'application/json'}};
  if(init.method==='POST'){
    init.headers['Content-Type']='application/json';
    init.body=JSON.stringify({protocol:remote.protocol,secret_ref:remote.secretRef||null,action});
  }
  const started=now();
  try{
    const response=await fetchImpl(url,init);
    const text=await response.text();
    let data=text;try{data=text?JSON.parse(text):null}catch{}
    const latency_ms=Math.max(0,Math.round(now()-started));
    const readback=normalizeRouterReadback(data);
    let state=response.ok?'OK':`HTTP_${response.status}`;
    if(response.ok&&['degraded','error','unhealthy'].includes(readback.health))state=readback.health.toUpperCase();
    const result={ok:response.ok,state,status:response.status,action,protocol:remote.protocol,url,data,latency_ms,readback};
    events.push({...result,at:new Date().toISOString()});
    if(events.length>50)events.shift();
    return result;
  }catch(error){
    const latency_ms=Math.max(0,Math.round(now()-started));
    const result={ok:false,state:'UNREACHABLE',action,protocol:remote.protocol,url,error:error?.name||'Error',latency_ms,readback:normalizeRouterReadback(null)};
    events.push({...result,at:new Date().toISOString()});
    return result;
  }
}

function decorateRemoteControls(){
  const probe=document.getElementById('probe-remote');
  if(!probe)return;
  let wrap=document.getElementById('remote-control-v1');
  if(wrap)return;
  wrap=document.createElement('div');
  wrap.id='remote-control-v1';wrap.className='tool-row';
  wrap.innerHTML='<button id="remote-connect">Conectar</button><button id="remote-reconnect">Reconectar</button><button id="remote-get-status">Estado</button><button id="remote-cancel">Cancelar</button>';
  probe.insertAdjacentElement('afterend',wrap);
}

function renderResult(result){
  const status=document.getElementById('remote-status');
  if(!status)return;
  const models=result.readback?.models?.map(m=>typeof m==='string'?m:(m?.name||m?.id)).filter(Boolean).join(',')||'none';
  const route=result.readback?.active_route||'none';
  const health=result.readback?.health||'unknown';
  status.textContent=`REMOTE_${result.action.toUpperCase()}=${result.state}${result.status?` HTTP_${result.status}`:''} health=${health} route=${route} models=${models} latency_ms=${result.latency_ms??0}`;
  status.dataset.remoteState=result.state;
  status.dataset.remoteHealth=health;
  status.dataset.remoteRoute=route;
  status.dataset.remoteModels=models;
  status.dataset.remoteLatency=String(result.latency_ms??0);
}

function bindRemoteControl(){
  document.addEventListener('click',async event=>{
    const target=event.target?.closest?.('#remote-connect,#remote-reconnect,#remote-get-status,#remote-cancel');
    if(!target)return;
    event.preventDefault();event.stopImmediatePropagation();
    const action=target.id==='remote-connect'?'connect':target.id==='remote-reconnect'?'reconnect':target.id==='remote-get-status'?'status':'cancel';
    const result=await invokeRemote(action);
    globalThis.__YAIWES_REMOTE_LAST__=Object.freeze(result);
    renderResult(result);
  },true);
  new MutationObserver(decorateRemoteControls).observe(document.documentElement,{subtree:true,childList:true});
  queueMicrotask(decorateRemoteControls);
}

if(typeof document!=='undefined')bindRemoteControl();
globalThis.__YAIWES_REMOTE_CONTROL_V1__=Object.freeze({buildRemoteActionUrl,normalizeRouterReadback,invokeRemote,getEvents:()=>structuredClone(events)});
