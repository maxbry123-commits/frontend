const CONFIG_KEY='yaiwes-factory-config-v13';
const LAST_DELIVERY_KEY='yaiwes-factory-last-delivery-v1';

const parse=(raw,fallback)=>{try{return JSON.parse(raw??'')??fallback}catch{return fallback}};

export function buildDownloadDelivery(runtime,storage=globalThis.localStorage){
  const state=runtime?.getState?.();
  const view=runtime?.getView?.()||{zoom:1,breakpoint:'desktop'};
  const config=parse(storage?.getItem?.(CONFIG_KEY),{});
  const destinations=Array.isArray(config.destinations)?config.destinations:[];
  const destination=destinations.find(d=>d?.type==='DOWNLOAD');
  if(!destination)return {ok:false,reason:'NO_DOWNLOAD_DESTINATION'};
  if(!state||!Array.isArray(state.components))return {ok:false,reason:'STATE_UNAVAILABLE'};
  const delivery={type:'DOWNLOAD',target:destination.url||'local',path:destination.path||'',createdAt:new Date().toISOString(),version:state.version??0};
  const payload={schema:'yaiwes.factory.delivery/v1',state,config,zoom:view.zoom,breakpoint:view.breakpoint,delivery};
  const text=JSON.stringify(payload,null,2);
  storage?.setItem?.(LAST_DELIVERY_KEY,JSON.stringify({delivery,bytes:new Blob([text]).size}));
  return {ok:true,filename:`yaiwes-ui-v${state.version??0}-delivery.json`,text,payload,delivery};
}

export function downloadDelivery(result){
  if(!result?.ok)throw new Error(result?.reason||'DELIVERY_NOT_READY');
  const blob=new Blob([result.text],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download=result.filename;a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  return result;
}

function decorateDeliveryControl(){
  const anchor=document.getElementById('build-output-plan');
  if(!anchor)return;
  let button=document.getElementById('deliver-output');
  if(!button){button=document.createElement('button');button.id='deliver-output';button.textContent='Entregar salida';anchor.insertAdjacentElement('afterend',button);}
}

function bindDestinationRoundtrip(){
  document.addEventListener('click',event=>{
    const button=event.target?.closest?.('#deliver-output');
    if(!button)return;
    event.preventDefault();event.stopImmediatePropagation();
    const result=buildDownloadDelivery(globalThis.__YAIWES_FACTORY_V19__);
    globalThis.__YAIWES_LAST_DELIVERY__=Object.freeze(result);
    if(result.ok)downloadDelivery(result);
    else console.error('YAIWES_DELIVERY_BLOCKED',result.reason);
  },true);
  new MutationObserver(decorateDeliveryControl).observe(document.documentElement,{subtree:true,childList:true});
  queueMicrotask(decorateDeliveryControl);
}

if(typeof document!=='undefined')bindDestinationRoundtrip();
globalThis.__YAIWES_DESTINATION_ROUNDTRIP_V1__=Object.freeze({configKey:CONFIG_KEY,lastDeliveryKey:LAST_DELIVERY_KEY,buildDownloadDelivery,downloadDelivery});
