const CORE_OSS = [
['Apache PyCasbin','backend','policy'],['Apache Tika','backend','documents'],['Apprise','backend','notifications'],['Bulkman','backend','bulk-jobs'],['Chart.js','frontend','charts'],['CodeMirror 6','frontend','code-editor'],['Cosign','backend','supply-chain'],['Dagu','backend','workflow'],['Debezium','backend','cdc'],['Docling','backend','documents'],['Excalidraw','frontend','visual-canvas'],['FastEmbed','backend','embeddings'],['Firecracker','backend','sandbox'],['Flutter','reference','cross-platform'],['GSAP','frontend','motion'],['Grafana','backend','observability'],['Grok Build','reference','workspace'],['HTTPX','backend','http'],['Hypothesis','backend','testing'],['Jan','reference','ai-workspace'],['LanceDB','backend','vector-db'],['LibreChat','reference','chat-workspace'],['LiteLLM','backend','model-router'],['LiveKit','backend','realtime-media'],['Loguru','backend','logging'],['Loki','backend','logs'],['Lucide','runtime','icons'],['MCP Python SDK','backend','mcp'],['MCP TypeScript SDK','backend','mcp'],['MSW','frontend','api-mocking'],['Mammoth.js','frontend','doc-preview'],['Meilisearch','backend','search'],['Mesa','backend','agents-sim'],['Moby','backend','containers'],['NATS','backend','events'],['Open WebUI','reference','ai-workspace'],['OpenBao','backend','secrets'],['OpenTelemetry Python','backend','telemetry'],['Oxigraph','backend','graph'],['PDF.js','frontend','pdf-preview'],['PGMQ','backend','queue'],['PGlite','frontend','local-db'],['ParadeDB','backend','search'],['Piper','backend','tts'],['PixiJS','frontend','high-density-canvas'],['Playwright','test','browser-e2e']
].map(([name,layer,capability])=>({name,layer,capability,status:name==='Lucide'?'RUNTIME_ACTIVE':name==='Playwright'?'TEST_ACTIVE':'AVAILABLE_LOCAL'}));

const VISUAL_OSS = [
  ['OpenPencil','frontend','design-canvas · ZIP_ONLY','AVAILABLE_ZIP'],
  ['OpenDesign','reference','agent-design-workspace · ZIP_ONLY','AVAILABLE_ZIP'],
  ['Onlook','reference','visual-react-editor · ZIP_ONLY','AVAILABLE_ZIP'],
  ['Penpot','reference','design-system-prototyping · ZIP_ONLY','AVAILABLE_ZIP'],
  ['Webstudio','frontend','webflow-like-builder · ZIP_ONLY','AVAILABLE_ZIP'],
  ['Silex','frontend','visual-site-builder · EXTRACTED','AVAILABLE_EXTRACTED'],
  ['Frappe Builder','frontend','block-context-menu · EXTRACTED · DONOR','DONOR_ACTIVE'],
  ['BESSER','reference','model-driven-low-code · EXTRACTED','AVAILABLE_EXTRACTED'],
  ['tldraw','frontend','infinite-canvas · EXTRACTED','AVAILABLE_EXTRACTED'],
  ['draw.io','frontend','diagram-editor · EXTRACTED','AVAILABLE_EXTRACTED'],
  ['xyflow','frontend','node-workflow-canvas · EXTRACTED · minimap DONOR','DONOR_ACTIVE'],
  ['Craft.js','frontend','react-page-editor · EXTRACTED · DONOR','DONOR_ACTIVE'],
  ['assistant-ui','frontend','ai-chat-components · EXTRACTED','AVAILABLE_EXTRACTED'],
  ['Dockview','frontend','dockable-panels-tabs · EXTRACTED','AVAILABLE_EXTRACTED'],
  ['i18next','frontend','internationalization · EXTRACTED','AVAILABLE_EXTRACTED'],
  ['react-i18next','frontend','react-i18n · EXTRACTED','AVAILABLE_EXTRACTED'],
  ['Appsmith','reference','low-code-app-builder · LOCAL_TREE','AVAILABLE_LOCAL'],
  ['Builder.io','reference','visual-builder-patterns · LOCAL_TREE','AVAILABLE_LOCAL'],
  ['FullCalendar','frontend','calendar-workspace · LOCAL_TREE','AVAILABLE_LOCAL'],
  ['MaoMao Window Manager','reference','window-management-patterns · LOCAL_TREE','AVAILABLE_LOCAL']
].map(([name,layer,capability,status])=>({name,layer,capability,status}));

export const OSS_COMPONENTS = [...CORE_OSS, ...VISUAL_OSS];
export const ossCounts=()=>OSS_COMPONENTS.reduce((a,x)=>{a[x.layer]=(a[x.layer]||0)+1;return a},{});
