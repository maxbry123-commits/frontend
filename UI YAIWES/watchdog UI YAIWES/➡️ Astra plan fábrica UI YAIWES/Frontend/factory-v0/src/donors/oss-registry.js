const CORE_OSS = [
['Apache PyCasbin','backend','policy'],['Apache Tika','backend','documents'],['Apprise','backend','notifications'],['Bulkman','backend','bulk-jobs'],['Chart.js','frontend','charts'],['CodeMirror 6','frontend','code-editor'],['Cosign','backend','supply-chain'],['Dagu','backend','workflow'],['Debezium','backend','cdc'],['Docling','backend','documents'],['Excalidraw','frontend','visual-canvas'],['FastEmbed','backend','embeddings'],['Firecracker','backend','sandbox'],['Flutter','reference','cross-platform'],['GSAP','frontend','motion'],['Grafana','backend','observability'],['Grok Build','reference','workspace'],['HTTPX','backend','http'],['Hypothesis','backend','testing'],['Jan','reference','ai-workspace'],['LanceDB','backend','vector-db'],['LibreChat','reference','chat-workspace'],['LiteLLM','backend','model-router'],['LiveKit','backend','realtime-media'],['Loguru','backend','logging'],['Loki','backend','logs'],['Lucide','runtime','icons'],['MCP Python SDK','backend','mcp'],['MCP TypeScript SDK','backend','mcp'],['MSW','frontend','api-mocking'],['Mammoth.js','frontend','doc-preview'],['Meilisearch','backend','search'],['Mesa','backend','agents-sim'],['Moby','backend','containers'],['NATS','backend','events'],['Open WebUI','reference','ai-workspace'],['OpenBao','backend','secrets'],['OpenTelemetry Python','backend','telemetry'],['Oxigraph','backend','graph'],['PDF.js','frontend','pdf-preview'],['PGMQ','backend','queue'],['PGlite','frontend','local-db'],['ParadeDB','backend','search'],['Piper','backend','tts'],['PixiJS','frontend','high-density-canvas'],['Playwright','test','browser-e2e']
].map(([name,layer,capability])=>({name,layer,capability,status:name==='Lucide'?'RUNTIME_ACTIVE':name==='Playwright'?'TEST_ACTIVE':'AVAILABLE_LOCAL'}));

const VISUAL_OSS = [
  ['OpenPencil','frontend','design-canvas · ZIP_ONLY','AVAILABLE_LOCAL'],
  ['OpenDesign','reference','agent-design-workspace · ZIP_ONLY','AVAILABLE_LOCAL'],
  ['Onlook','reference','visual-react-editor · ZIP_ONLY','AVAILABLE_LOCAL'],
  ['Penpot','reference','design-system-prototyping · ZIP_ONLY','AVAILABLE_LOCAL'],
  ['Webstudio','frontend','webflow-like-builder · ZIP_ONLY','AVAILABLE_LOCAL'],
  ['Silex','frontend','visual-site-builder · ZIP_ONLY','AVAILABLE_LOCAL'],
  ['Frappe Builder','frontend','block-context-menu · LOCAL_SOURCE','DONOR_ACTIVE'],
  ['BESSER','reference','model-driven-low-code · ZIP_ONLY','AVAILABLE_LOCAL'],
  ['tldraw','frontend','infinite-canvas · ZIP_ONLY','AVAILABLE_LOCAL'],
  ['draw.io','frontend','diagram-editor · ZIP_ONLY','AVAILABLE_LOCAL'],
  ['xyflow','frontend','node-workflow-canvas · ZIP_ONLY','AVAILABLE_LOCAL'],
  ['Craft.js','frontend','react-page-editor · ZIP_ONLY','AVAILABLE_LOCAL'],
  ['assistant-ui','frontend','ai-chat-components · EXTRACTED','AVAILABLE_LOCAL'],
  ['Dockview','frontend','dockable-panels-tabs · EXTRACTED','AVAILABLE_LOCAL'],
  ['i18next','frontend','internationalization · EXTRACTED','AVAILABLE_LOCAL'],
  ['react-i18next','frontend','react-i18n · EXTRACTED','AVAILABLE_LOCAL'],
  ['Appsmith','reference','low-code-app-builder · LOCAL_TREE','AVAILABLE_LOCAL'],
  ['Builder.io','reference','visual-builder-patterns · LOCAL_TREE','AVAILABLE_LOCAL'],
  ['FullCalendar','frontend','calendar-workspace · LOCAL_TREE','AVAILABLE_LOCAL'],
  ['MaoMao Window Manager','reference','window-management-patterns · LOCAL_TREE','AVAILABLE_LOCAL']
].map(([name,layer,capability,status])=>({name,layer,capability,status}));

export const OSS_COMPONENTS = [...CORE_OSS, ...VISUAL_OSS];
export const ossCounts=()=>OSS_COMPONENTS.reduce((a,x)=>{a[x.layer]=(a[x.layer]||0)+1;return a},{});
