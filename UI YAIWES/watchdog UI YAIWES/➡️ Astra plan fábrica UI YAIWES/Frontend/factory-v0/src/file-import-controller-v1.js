import { parseFilesForCanvas } from './file-import-v1.js';

// F-AI-021/F-AI-022 wiring deliberately reuses the editor's canonical
// drop -> ADD_COMPONENT -> reducer -> persist path. No second state engine.
function dropParsedItems(parsed) {
  const canvas = document.getElementById('canvas');
  if (!canvas || !parsed?.length) return 0;
  const rect = canvas.getBoundingClientRect();
  parsed.forEach((item, index) => {
    const dt = new DataTransfer();
    dt.setData('text/yaiwes-kind', item.kind);
    dt.setData('text/yaiwes-label', item.label);
    dt.setData('application/yaiwes-import-summary', JSON.stringify({
      sourceName:item.props?.sourceName,
      mime:item.props?.mime,
      parsedType:item.props?.parsedType,
      size:item.props?.size
    }));
    const offset = 24 * index;
    canvas.dispatchEvent(new DragEvent('drop', {
      bubbles:true,
      cancelable:true,
      clientX:Math.max(rect.left + 120, rect.left + rect.width / 2 + offset),
      clientY:Math.max(rect.top + 90, rect.top + rect.height / 2 + offset),
      dataTransfer:dt
    }));
  });
  return parsed.length;
}

async function importSelectedFiles(input) {
  if (!input?.files?.length) return;
  const parsed = await parseFilesForCanvas(input.files);
  const imported = dropParsedItems(parsed);
  window.__YAIWES_FILE_IMPORT_V1__ = Object.freeze({
    imported,
    summaries:parsed.map(item => ({kind:item.kind,label:item.label,parsedType:item.props.parsedType,mime:item.props.mime}))
  });
}

function importInlineHtml(textarea) {
  const html = String(textarea?.value || '');
  if (!html.trim()) return 0;
  const parsed = [{
    kind:'page',
    label:`inline-html-${Date.now()}`,
    props:{sourceName:'inline-html',mime:'text/html',parsedType:'html',size:new Blob([html]).size,content:html}
  }];
  const imported = dropParsedItems(parsed);
  window.__YAIWES_HTML_IMPORT_V1__ = Object.freeze({ imported, parsedType:'html', bytes:parsed[0].props.size });
  return imported;
}

document.addEventListener('change', event => {
  if (event.target?.id !== 'file-input') return;
  importSelectedFiles(event.target).catch(error => {
    window.__YAIWES_FILE_IMPORT_V1__ = Object.freeze({ imported:0, error:String(error?.message || error) });
  });
}, { capture:true });

document.addEventListener('click', event => {
  const button = event.target?.closest?.('#load-html-source');
  if (!button) return;
  const textarea = document.getElementById('html-input');
  // Capture phase runs before the existing metadata-only onclick replaces context DOM.
  importInlineHtml(textarea);
}, { capture:true });

export { dropParsedItems, importSelectedFiles, importInlineHtml };
