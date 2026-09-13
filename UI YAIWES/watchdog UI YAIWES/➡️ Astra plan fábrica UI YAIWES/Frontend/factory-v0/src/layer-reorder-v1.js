const PROJECT_KEY='yaiwes-factory-project-v19';
const clone=value=>JSON.parse(JSON.stringify(value));

function snapshot(state){
  const next=clone(state);
  next.history=[];
  next.future=[];
  return next;
}

export function reorderPersistedLayer(id,direction,storage=globalThis.localStorage){
  const raw=storage.getItem(PROJECT_KEY);
  if(!raw)return {changed:false,reason:'NO_PROJECT'};
  const project=JSON.parse(raw);
  const state=project?.state;
  if(!state||!Array.isArray(state.components))return {changed:false,reason:'INVALID_PROJECT'};
  const from=state.components.findIndex(component=>component.id===id);
  const to=from+Number(direction);
  if(from<0||to<0||to>=state.components.length)return {changed:false,reason:'BOUNDARY'};
  const previous=snapshot(state);
  const components=[...state.components];
  [components[from],components[to]]=[components[to],components[from]];
  project.state={...state,components,selectedId:id,history:[...(state.history||[]),previous].slice(-50),future:[]};
  project.savedAt=new Date().toISOString();
  storage.setItem(PROJECT_KEY,JSON.stringify(project));
  return {changed:true,id,from,to,order:components.map(component=>component.id)};
}

function decorateLayers(){
  document.querySelectorAll('#layer-list [data-layer]').forEach((layer,index,layers)=>{
    if(layer.querySelector('[data-layer-reorder-controls]'))return;
    const controls=document.createElement('span');
    controls.dataset.layerReorderControls='1';
    controls.className='layer-reorder-controls';
    controls.innerHTML=`<span role="button" tabindex="0" aria-label="Subir capa" data-layer-move="-1" ${index===0?'aria-disabled="true"':''}>↑</span><span role="button" tabindex="0" aria-label="Bajar capa" data-layer-move="1" ${index===layers.length-1?'aria-disabled="true"':''}>↓</span>`;
    layer.appendChild(controls);
  });
}

function activateMove(control){
  if(control.getAttribute('aria-disabled')==='true')return;
  const layer=control.closest('[data-layer]');
  if(!layer)return;
  const result=reorderPersistedLayer(layer.dataset.layer,Number(control.dataset.layerMove));
  globalThis.__YAIWES_LAYER_REORDER_V1__=Object.freeze({...result,projectKey:PROJECT_KEY});
  if(result.changed)globalThis.location.reload();
}

document.addEventListener('click',event=>{
  const control=event.target?.closest?.('[data-layer-move]');
  if(!control)return;
  event.preventDefault();
  event.stopPropagation();
  activateMove(control);
},true);

document.addEventListener('keydown',event=>{
  const control=event.target?.closest?.('[data-layer-move]');
  if(!control||!['Enter',' '].includes(event.key))return;
  event.preventDefault();
  event.stopPropagation();
  activateMove(control);
},true);

new MutationObserver(decorateLayers).observe(document.documentElement,{subtree:true,childList:true});
queueMicrotask(decorateLayers);

globalThis.__YAIWES_LAYER_REORDER_API_V1__=Object.freeze({reorderPersistedLayer,projectKey:PROJECT_KEY});
