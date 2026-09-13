// YAIWES Factory deterministic OSS registry.
// Runtime consumes metadata only; source acquisition is delegated to immutable repository motors via MCP/Router.
export const OSS_EVOLUTION_REGISTRY = Object.freeze([
  {id:'frappe-builder',name:'Frappe Builder',sourceRepo:'frappe/builder',license:'MIT@>=1.31.0',capabilities:['visual-builder','canvas','layers'],localPath:'📂componentes open soure fromtend/Frappe-Builder',localState:'PRESENT',mode:'PATTERN_ADAPTER',priority:10},
  {id:'puck',name:'Puck',sourceRepo:'puckeditor/puck',license:'MIT',capabilities:['react-visual-editor','component-config','publish-render'],localPath:'📂componentes open soure fromtend/Puck',localState:'PRESENT',mode:'PATTERN_ADAPTER',priority:20},
  {id:'radix-ui',name:'Radix UI',sourceRepo:'radix-ui/primitives',license:'MIT',capabilities:['accessible-primitives','focus','keyboard','dialogs'],localPath:'📂componentes open soure fromtend/Radix-UI',localState:'PRESENT',mode:'PATTERN_ADAPTER',priority:30},
  {id:'openpencil',name:'OpenPencil',sourceRepo:'open-pencil/open-pencil',license:'MIT',capabilities:['design-editor','vector-design','figma-style-workflow'],localPath:'📂componentes open soure fromtend/OpenPencil',localState:'PRESENT',mode:'REFERENCE_DONOR',priority:40},
  {id:'onlook',name:'Onlook',sourceRepo:'onlook-dev/onlook',license:'REVERIFY_AT_ACQUISITION',capabilities:['visual-code-editing','web-design','live-edit'],localPath:'📂componentes open soure fromtend/Onlook',localState:'PRESENT',mode:'REFERENCE_DONOR',priority:50},
  {id:'teleporthq',name:'TeleportHQ',sourceRepo:'teleporthq/teleport-code-generators',license:'REVERIFY_AT_ACQUISITION',capabilities:['code-generation','ui-export','multi-framework'],localPath:'📂componentes open soure fromtend/TeleportHQ',localState:'PRESENT',mode:'REFERENCE_DONOR',priority:60},
  {id:'craftjs',name:'Craft.js',sourceRepo:'prevwong/craft.js',license:'MIT',capabilities:['drag-drop-editor','serializable-state','component-editing'],localPath:'📂componentes open soure fromtend/Craft.js',localState:'MISSING',mode:'PATTERN_ADAPTER',priority:70},
  {id:'grapesjs',name:'GrapesJS',sourceRepo:'GrapesJS/grapesjs',license:'BSD-3-Clause',capabilities:['web-builder','blocks','style-manager','plugins'],localPath:'📂componentes open soure fromtend/GrapesJS',localState:'MISSING',mode:'PATTERN_ADAPTER',priority:80},
  {id:'penpot',name:'Penpot',sourceRepo:'penpot/penpot',license:'MPL-2.0',capabilities:['product-design','prototyping','design-code-collaboration'],localPath:'📂componentes open soure fromtend/Penpot',localState:'MISSING',mode:'REFERENCE_DONOR',priority:90},
  {id:'storybook',name:'Storybook',sourceRepo:'storybookjs/storybook',license:'MIT',capabilities:['component-workbench','visual-testing','documentation'],localPath:'📂componentes open soure fromtend/Storybook',localState:'MISSING',mode:'TOOLING_ADAPTER',priority:100},
  {id:'retejs',name:'Rete.js',sourceRepo:'retejs/rete',license:'MIT',capabilities:['node-editor','visual-programming','dataflow','control-flow'],localPath:'📂componentes open soure fromtend/Rete.js',localState:'MISSING',mode:'PATTERN_ADAPTER',priority:110,additional:true},
  {id:'excalidraw',name:'Excalidraw',sourceRepo:'excalidraw/excalidraw',license:'MIT',capabilities:['whiteboard','freeform-canvas','selection','collaboration-patterns'],localPath:'📂componentes open soure fromtend/Excalidraw',localState:'MISSING',mode:'PATTERN_ADAPTER',priority:120,additional:true},
  {id:'lexical',name:'Lexical',sourceRepo:'facebook/lexical',license:'MIT',capabilities:['rich-text','editor-plugins','accessibility','structured-content'],localPath:'📂componentes open soure fromtend/Lexical',localState:'MISSING',mode:'PATTERN_ADAPTER',priority:130,additional:true}
]);

export const BLENDER_EXTENSION_PATTERNS = Object.freeze({
  source:'Blender Extensions model',
  adopted:['manifest','validate-before-install','local-and-remote-repositories','enable-disable','explicit-permissions','namespaced-extensions','self-contained-dependencies'],
  notAdopted:['Blender runtime','GPL source embedding']
});

export function findCandidates(capability,{includeMissing=true}={}){
  const key=String(capability||'').trim().toLowerCase();
  if(!key)return [];
  return OSS_EVOLUTION_REGISTRY
    .filter(x=>includeMissing||x.localState==='PRESENT')
    .filter(x=>x.capabilities.some(c=>c.includes(key)||key.includes(c)))
    .sort((a,b)=>a.priority-b.priority);
}

export function registrySummary(){
  const rows=OSS_EVOLUTION_REGISTRY;
  return Object.freeze({total:rows.length,present:rows.filter(x=>x.localState==='PRESENT').length,missing:rows.filter(x=>x.localState==='MISSING').length,additional:rows.filter(x=>x.additional).length});
}
