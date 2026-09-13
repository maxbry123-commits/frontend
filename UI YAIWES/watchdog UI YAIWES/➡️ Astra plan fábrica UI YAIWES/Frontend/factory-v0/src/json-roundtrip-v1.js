import { serializeFactoryHtml } from './html-export-v1.js';

const PROJECT_KEY='yaiwes-factory-project-v19';
const CONFIG_KEY='yaiwes-factory-config-v13';

export function parseFactoryExport(text){
  const payload=JSON.parse(text);
  if(!payload||typeof payload!=='object'||!payload.state||!Array.isArray(payload.state.components)){
    throw new Error('INVALID_YAIWES_FACTORY_EXPORT');
  }
  const config=payload.config&&typeof payload.config==='object'?payload.config:{};
  return {
    project:{schema:'yaiwes.factory.project/v1',state:payload.state,zoom:Number.isFinite(payload.zoom)?payload.zoom:1,breakpoint:['desktop','tablet','mobile'].includes(payload.breakpoint)?payload.breakpoint:'desktop',savedAt:new Date().toISOString()},
    config
  };
}

export function restoreFactoryExport(text,storage=globalThis.localStorage){
  const restored=parseFactoryExport(text);
  storage.setItem(PROJECT_KEY,JSON.stringify(restored.project));
  storage.setItem(CONFIG_KEY,JSON.stringify(restored.config));
  return restored;
}

function downloadHtml(name,content){
  const blob=new Blob([content],{type:'text/html'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download=name;a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}

function bindJsonRoundtrip(){
  const input=document.getElementById('file-input');
  if(!input||input.dataset.jsonRoundtripBound)return;
  input.dataset.jsonRoundtripBound='1';
  input.addEventListener('change',async event=>{
    const file=[...(event.target.files||[])].find(f=>f.name.toLowerCase().endsWith('.json')||f.type==='application/json');
    if(!file)return;
    try{
      restoreFactoryExport(await file.text());
      globalThis.location.reload();
    }catch(error){
      console.error('YAIWES_JSON_IMPORT_REJECTED',error);
    }
  },true);
}

function bindHtmlExport(){
  const button=document.getElementById('export-html');
  if(!button||button.dataset.htmlExportV1Bound)return;
  button.dataset.htmlExportV1Bound='1';
  button.addEventListener('click',event=>{
    event.preventDefault();
    event.stopImmediatePropagation();
    const runtime=globalThis.__YAIWES_FACTORY_V19__;
    const state=runtime?.getState?.();
    const config=JSON.parse(globalThis.localStorage?.getItem(CONFIG_KEY)||'{}');
    if(!state||!Array.isArray(state.components)) throw new Error('YAIWES_HTML_EXPORT_STATE_UNAVAILABLE');
    const html=serializeFactoryHtml(state,config);
    downloadHtml(`yaiwes-ui-v${state.version??0}.html`,html);
  },true);
}

function bindAdapters(){bindJsonRoundtrip();bindHtmlExport()}
document.addEventListener('click',()=>queueMicrotask(bindAdapters),true);
queueMicrotask(bindAdapters);

globalThis.__YAIWES_JSON_ROUNDTRIP_V1__=Object.freeze({parseFactoryExport,restoreFactoryExport,projectKey:PROJECT_KEY,configKey:CONFIG_KEY});
