const CONFIG_KEY='yaiwes-factory-config-v13';
const SESSION_KEY='yaiwes-hf-job-v1';
const TERMINAL=new Set(['COMPLETED','CANCELED','CANCELLED','ERROR','FAILED']);

const clone=value=>value==null?value:structuredClone(value);

export function sanitizeJobData(value){
  if(Array.isArray(value)) return value.map(sanitizeJobData);
  if(!value||typeof value!=='object') return value;
  const out={};
  for(const [key,val] of Object.entries(value)){
    if(/^(token|api[_-]?key|authorization|password|access[_-]?token|refresh[_-]?token)$/i.test(key)) out[key]='[REDACTED]';
    else out[key]=sanitizeJobData(val);
  }
  return out;
}

function validHttpUrl(value){
  try{const url=new URL(value);return url.protocol==='http:'||url.protocol==='https:'}catch{return false}
}

export function readHfJobsConfig(storage=globalThis.localStorage){
  try{
    const config=JSON.parse(storage?.getItem?.(CONFIG_KEY)||'{}');
    const jobs=config?.hfJobs||config?.hf_jobs||null;
    if(!jobs||!validHttpUrl(jobs.url)) return null;
    return {url:jobs.url.replace(/\/$/,''),secret_ref:jobs.secretRef||jobs.secret_ref||null};
  }catch{return null}
}

export function buildJobUrl(base,jobId,suffix=''){
  const root=base.replace(/\/$/,'');
  if(!jobId) return `${root}/run`;
  const encoded=encodeURIComponent(jobId);
  return `${root}/jobs/${encoded}${suffix?`/${suffix}`:''}`;
}

async function parseResponse(response){
  const text=await response.text();
  let body=text;
  try{body=text?JSON.parse(text):null}catch{}
  if(!response.ok) throw new Error(`HF_JOBS_HTTP_${response.status}`);
  return sanitizeJobData(body);
}

export function createHfJobsClient({config,fetchImpl=globalThis.fetch}={}){
  if(!config||!validHttpUrl(config.url)) throw new TypeError('valid HF Jobs proxy URL required');
  if(typeof fetchImpl!=='function') throw new TypeError('fetch implementation required');
  const headers={'accept':'application/json','content-type':'application/json'};
  const post=async(url,payload)=>parseResponse(await fetchImpl(url,{method:'POST',headers,body:JSON.stringify(payload)}));
  const get=async url=>parseResponse(await fetchImpl(url,{method:'GET',headers:{accept:'application/json'}}));
  return {
    async run(spec={}){
      const payload={
        command:String(spec.command||'').trim(),
        image:String(spec.image||'python:3.12-slim').trim(),
        flavor:String(spec.flavor||'cpu-basic').trim(),
        secret_ref:config.secret_ref||null
      };
      if(!payload.command) throw new TypeError('HF Job command required');
      return post(buildJobUrl(config.url),payload);
    },
    status(jobId){if(!jobId)throw new TypeError('job_id required');return get(buildJobUrl(config.url,jobId));},
    logs(jobId){if(!jobId)throw new TypeError('job_id required');return get(buildJobUrl(config.url,jobId,'logs'));},
    cancel(jobId){if(!jobId)throw new TypeError('job_id required');return post(buildJobUrl(config.url,jobId,'cancel'),{secret_ref:config.secret_ref||null});}
  };
}

export function normalizeJobState(payload,prior={}){
  const data=sanitizeJobData(payload||{});
  const job_id=data.job_id||data.id||prior.job_id||null;
  const rawStage=data.stage||data.status||prior.stage||'UNKNOWN';
  const stage=String(rawStage).toUpperCase();
  return {
    ...prior,
    ...data,
    job_id,
    stage,
    terminal:TERMINAL.has(stage),
    updated_at:new Date().toISOString()
  };
}

function safeStore(storage,state){
  try{storage?.setItem?.(SESSION_KEY,JSON.stringify(sanitizeJobData(state)))}catch{}
}
function safeLoad(storage){
  try{return normalizeJobState(JSON.parse(storage?.getItem?.(SESSION_KEY)||'{}'))}catch{return normalizeJobState({})}
}

function renderPanel(documentRef,state,message=''){
  const status=documentRef.getElementById('hf-job-status');
  const logs=documentRef.getElementById('hf-job-logs');
  if(status){
    status.textContent=`HF_JOB=${state.stage||'IDLE'} job_id=${state.job_id||'none'}${message?` ${message}`:''}`;
    status.dataset.hfStage=state.stage||'IDLE';
    status.dataset.hfJobId=state.job_id||'';
    status.dataset.hfTerminal=String(Boolean(state.terminal));
  }
  if(logs&&state.logs!=null) logs.textContent=typeof state.logs==='string'?state.logs:JSON.stringify(sanitizeJobData(state.logs),null,2);
}

export function installHfJobsPanel({documentRef=globalThis.document,storage=globalThis.localStorage,fetchImpl=globalThis.fetch}={}){
  if(!documentRef?.addEventListener) return ()=>{};
  let state=safeLoad(storage);
  const ensure=()=>{
    const anchor=documentRef.getElementById('remote-control-v1')||documentRef.getElementById('probe-remote');
    if(!anchor||documentRef.getElementById('hf-jobs-panel-v1')) return;
    const section=documentRef.createElement('section');
    section.id='hf-jobs-panel-v1';section.className='tool-section';
    section.innerHTML='<h3>Hugging Face Jobs</h3><p>Proxy autorizado: el navegador usa secret_ref, nunca tokens.</p><label>Comando<textarea id="hf-job-command" placeholder="python -c ..."></textarea></label><div class="tool-row"><label>Imagen<input id="hf-job-image" value="python:3.12-slim"></label><label>Flavor<input id="hf-job-flavor" value="cpu-basic"></label></div><div class="tool-row"><button id="hf-job-run">Run</button><button id="hf-job-status-btn">Estado</button><button id="hf-job-logs-btn">Logs</button><button id="hf-job-cancel">Cancelar</button></div><pre id="hf-job-status">HF_JOB=IDLE job_id=none</pre><pre id="hf-job-logs">Sin logs</pre>';
    anchor.insertAdjacentElement('afterend',section);
    renderPanel(documentRef,state);
  };
  const client=()=>createHfJobsClient({config:readHfJobsConfig(storage),fetchImpl});
  const handler=async event=>{
    const button=event.target?.closest?.('#hf-job-run,#hf-job-status-btn,#hf-job-logs-btn,#hf-job-cancel');
    if(!button)return;
    event.preventDefault();event.stopImmediatePropagation();
    try{
      if(button.id==='hf-job-run'){
        const result=await client().run({command:documentRef.getElementById('hf-job-command')?.value,image:documentRef.getElementById('hf-job-image')?.value,flavor:documentRef.getElementById('hf-job-flavor')?.value});
        state=normalizeJobState(result,state);
      }else if(button.id==='hf-job-status-btn'){
        state=normalizeJobState(await client().status(state.job_id),state);
      }else if(button.id==='hf-job-logs-btn'){
        const result=await client().logs(state.job_id);
        state=normalizeJobState({...state,logs:result.logs??result},state);
      }else{
        if(state.terminal){renderPanel(documentRef,state,'CANCEL_IDEMPOTENT_TERMINAL');return;}
        state=normalizeJobState(await client().cancel(state.job_id),state);
      }
      safeStore(storage,state);renderPanel(documentRef,state);
      globalThis.__YAIWES_HF_JOB_LAST__=Object.freeze(clone(state));
    }catch(error){renderPanel(documentRef,state,`ERROR=${error.message}`)}
  };
  documentRef.addEventListener('click',handler,true);
  const observer=new MutationObserver(ensure);observer.observe(documentRef.documentElement,{subtree:true,childList:true});queueMicrotask(ensure);
  return ()=>{observer.disconnect();documentRef.removeEventListener('click',handler,true)};
}

if(typeof document!=='undefined') installHfJobsPanel();
globalThis.__YAIWES_HF_JOBS_V1__=Object.freeze({sanitizeJobData,readHfJobsConfig,buildJobUrl,createHfJobsClient,normalizeJobState});
