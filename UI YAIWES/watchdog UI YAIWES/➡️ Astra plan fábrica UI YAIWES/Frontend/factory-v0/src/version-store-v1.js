const PROJECT_KEY='yaiwes-factory-project-v19';
const CONFIG_KEY='yaiwes-factory-config-v13';
const VERSIONS_KEY='yaiwes-factory-versions-v1';

const parse=(raw,fallback)=>{try{return JSON.parse(raw??'')??fallback}catch{return fallback}};

export function listVersionSnapshots(storage=globalThis.localStorage){
  const value=parse(storage?.getItem?.(VERSIONS_KEY),[]);
  return Array.isArray(value)?value:[];
}

export function captureVersionSnapshot(storage=globalThis.localStorage){
  const project=parse(storage?.getItem?.(PROJECT_KEY),null);
  if(!project?.state||!Array.isArray(project.state.components))return {saved:false,reason:'NO_PROJECT'};
  const version=Number(project.state.version);
  if(!Number.isInteger(version)||version<0)return {saved:false,reason:'INVALID_VERSION'};
  const config=parse(storage?.getItem?.(CONFIG_KEY),{});
  const snapshots=listVersionSnapshots(storage).filter(item=>item?.version!==version);
  snapshots.push({version,project,config,savedAt:new Date().toISOString()});
  snapshots.sort((a,b)=>a.version-b.version);
  const retained=snapshots.slice(-20);
  storage.setItem(VERSIONS_KEY,JSON.stringify(retained));
  return {saved:true,version,count:retained.length};
}

export function restoreVersionSnapshot(version,storage=globalThis.localStorage){
  const snapshots=listVersionSnapshots(storage);
  const item=snapshots.find(entry=>entry?.version===Number(version));
  if(!item?.project?.state)return {restored:false,reason:'VERSION_NOT_FOUND'};
  storage.setItem(PROJECT_KEY,JSON.stringify(item.project));
  storage.setItem(CONFIG_KEY,JSON.stringify(item.config||{}));
  return {restored:true,version:item.version,project:item.project,config:item.config||{}};
}

function decorateRestoreControl(){
  const save=document.getElementById('save-version');
  if(!save)return;
  const snapshots=listVersionSnapshots();
  const latest=snapshots.at(-1);
  let restore=document.getElementById('restore-version');
  if(!latest){restore?.remove();return;}
  if(!restore){
    restore=document.createElement('button');
    restore.id='restore-version';
    save.insertAdjacentElement('afterend',restore);
  }
  restore.dataset.version=String(latest.version);
  restore.textContent=`Restaurar V${latest.version}`;
}

function bindVersionStore(){
  document.addEventListener('click',event=>{
    const save=event.target?.closest?.('#save-version');
    if(save){
      queueMicrotask(()=>{captureVersionSnapshot();decorateRestoreControl()});
      return;
    }
    const restore=event.target?.closest?.('#restore-version');
    if(!restore)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const result=restoreVersionSnapshot(Number(restore.dataset.version));
    globalThis.__YAIWES_VERSION_RESTORE_LAST__=Object.freeze(result);
    if(result.restored)globalThis.location.reload();
  },true);
  new MutationObserver(decorateRestoreControl).observe(document.documentElement,{subtree:true,childList:true});
  queueMicrotask(decorateRestoreControl);
}

if(typeof document!=='undefined')bindVersionStore();
globalThis.__YAIWES_VERSION_STORE_V1__=Object.freeze({projectKey:PROJECT_KEY,configKey:CONFIG_KEY,versionsKey:VERSIONS_KEY,listVersionSnapshots,captureVersionSnapshot,restoreVersionSnapshot});
