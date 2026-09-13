const CONFIG_KEY='yaiwes-factory-config-v13';
const SUPPORTED=new Set(['MCP_HTTP','HTTP','API']);
const events=[];

const readConfig=(storage=globalThis.localStorage)=>{try{return JSON.parse(storage?.getItem?.(CONFIG_KEY)||'{}')}catch{return {}}};
export function buildRemoteActionUrl(base,action){
  const u=new URL(base);
  u.pathname=`${u.pathname.replace(/\/$/,'')}/${action}`;
  return u.toString();
}

export async function invokeRemote(action,{storage=globalThis.localStorage,fetchImpl=globalThis.fetch}={}){
  if(!['connect','status','cancel'].includes(action))throw new Error('INVALID_REMOTE_ACTION');
  const remote=readConfig(storage).remote;
  if(!remote?.url)return {ok:false,state:'INVALID_CONFIG',action};
  if(!SUPPORTED.has(remote.protocol))return {ok:false,state:'UNSUPPORTED_PROTOCOL',action,protocol:remote.protocol};
  let url;
  try{url=buildRemoteActionUrl(remote.url,action)}catch{return {ok:false,state:'INVALID_URL',action}};
  const init={method:action==='status'?'GET':'POST',headers:{'Accept':'application/json'}};
  if(init.method==='POST'){
    init.headers['Content-Type']='application/json';
    init.body=JSON.stringify({protocol:remote.protocol,secret_ref:remote.secretRef||null,action});
  }
  try{
    const response=await fetchImpl(url,init);
    const text=await response.text();
    let data=text;try{data=text?JSON.parse(text):null}catch{}
    const result={ok:response.ok,state:response.ok?'OK':`HTTP_${response.status}`,status:response.status,action,protocol:remote.protocol,url,data};
    events.push({...result,at:new Date().toISOString()});
    if(events.length>50)events.shift();
    return result;
  }catch(error){
    const result={ok:false,state:'UNREACHABLE',action,protocol:remote.protocol,url,error:error?.name||'Error'};
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
  wrap.innerHTML='<button id="remote-connect">Conectar</button><button id="remote-get-status">Estado</button><button id="remote-cancel">Cancelar</button>';
  probe.insertAdjacentElement('afterend',wrap);
}

function renderResult(result){
  const status=document.getElementById('remote-status');
  if(status)status.textContent=`REMOTE_${result.action.toUpperCase()}=${result.state}${result.status?` HTTP_${result.status}`:''}`;
}

function bindRemoteControl(){
  document.addEventListener('click',async event=>{
    const target=event.target?.closest?.('#remote-connect,#remote-get-status,#remote-cancel');
    if(!target)return;
    event.preventDefault();event.stopImmediatePropagation();
    const action=target.id==='remote-connect'?'connect':target.id==='remote-get-status'?'status':'cancel';
    const result=await invokeRemote(action);
    globalThis.__YAIWES_REMOTE_LAST__=Object.freeze(result);
    renderResult(result);
  },true);
  new MutationObserver(decorateRemoteControls).observe(document.documentElement,{subtree:true,childList:true});
  queueMicrotask(decorateRemoteControls);
}

if(typeof document!=='undefined')bindRemoteControl();
globalThis.__YAIWES_REMOTE_CONTROL_V1__=Object.freeze({buildRemoteActionUrl,invokeRemote,getEvents:()=>structuredClone(events)});
