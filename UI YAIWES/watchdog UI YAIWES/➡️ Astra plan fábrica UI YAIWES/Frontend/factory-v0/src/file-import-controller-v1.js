import { parseFilesForCanvas } from './file-import-v1.js';

// F-AI-021 wiring deliberately reuses the editor's canonical drop -> reducer -> persist path.
// It does not create or mutate a second state engine.
async function importSelectedFiles(input) {
  const canvas = document.getElementById('canvas');
  if (!canvas || !input?.files?.length) return;
  const parsed = await parseFilesForCanvas(input.files);
  const rect = canvas.getBoundingClientRect();

  parsed.forEach((item, index) => {
    const dt = new DataTransfer();
    dt.setData('text/yaiwes-kind', item.kind);
    dt.setData('text/yaiwes-label', item.label);
    dt.setData('application/yaiwes-import-summary', JSON.stringify({
      sourceName:item.props.sourceName,
      mime:item.props.mime,
      parsedType:item.props.parsedType,
      size:item.props.size
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

  window.__YAIWES_FILE_IMPORT_V1__ = Object.freeze({
    imported:parsed.length,
    summaries:parsed.map(item => ({kind:item.kind,label:item.label,parsedType:item.props.parsedType,mime:item.props.mime}))
  });
}

document.addEventListener('change', event => {
  if (event.target?.id !== 'file-input') return;
  importSelectedFiles(event.target).catch(error => {
    window.__YAIWES_FILE_IMPORT_V1__ = Object.freeze({ imported:0, error:String(error?.message || error) });
  });
}, { capture:true });

export { importSelectedFiles };
