const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const css=v=>String(v??'').replace(/[<>]/g,'');

export function serializeFactoryHtml(state,config={}){
  const components=Array.isArray(state?.components)?state.components:[];
  const theme=config?.theme||{};
  const bg=css(theme.bg||'#ffffff'),text=css(theme.text||'#111827'),accent=css(theme.accent||'#2563eb');
  const radius=Number.isFinite(Number(theme.radius))?Math.max(0,Math.min(64,Number(theme.radius))):12;
  const body=components.map(c=>{
    const x=Math.max(0,Number(c.x)||0),y=Math.max(0,Number(c.y)||0),w=Math.max(1,Number(c.w)||220),h=Math.max(1,Number(c.h)||120);
    return `<section class="yaiwes-node" data-id="${esc(c.id)}" data-kind="${esc(c.kind)}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"><strong>${esc(c.label||c.kind)}</strong></section>`;
  }).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>YAIWES export</title><style>:root{--bg:${bg};--text:${text};--accent:${accent};--radius:${radius}px}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font-family:system-ui,sans-serif}.yaiwes-canvas{position:relative;min-height:100vh;overflow:auto}.yaiwes-node{position:absolute;border:1px solid var(--accent);border-radius:var(--radius);padding:12px;background:var(--bg);overflow:hidden}</style></head><body><main class="yaiwes-canvas" data-yaiwes-version="${esc(state?.version??0)}">${body}</main></body></html>`;
}

export function downloadFactoryHtml(state,config,downloadFn){
  const html=serializeFactoryHtml(state,config);
  downloadFn(`yaiwes-ui-v${state?.version??0}.html`,html,'text/html');
  return html;
}

globalThis.__YAIWES_HTML_EXPORT_V1__=Object.freeze({serializeFactoryHtml,downloadFactoryHtml});
