import { parseFileForCanvas } from './file-import-v1.js';

// F-FE-079 — versioned SEG-07 intake. Reuses v1 parse + canonical canvas drop.
// Classify the whole batch before any mutation. Do not overwrite v1.

const MAX_BYTES = 8 * 1024 * 1024;
const BLOCKED_EXT = new Set(['exe', 'bat', 'cmd', 'com', 'dll', 'so', 'msi', 'scr', 'ps1', 'apk']);
const BLOCKED_MIME = /^(application\/x-msdownload|application\/x-dosexec|application\/x-executable|application\/vnd\.microsoft\.portable-executable)/i;

function extension(name = '') {
  const i = String(name).lastIndexOf('.');
  return i >= 0 ? String(name).slice(i + 1).toLowerCase() : '';
}

function intakeKey(file) {
  return [String(file?.name || ''), Number(file?.size || 0), String(file?.type || '')].join('\u0001');
}

function isSupported(file) {
  const type = String(file?.type || '').toLowerCase();
  const ext = extension(file?.name);
  if (BLOCKED_EXT.has(ext) || BLOCKED_MIME.test(type)) return false;
  if (type.startsWith('image/') || type.startsWith('audio/') || type.startsWith('video/')) return true;
  if (type === 'text/html' || ['html', 'htm'].includes(ext)) return true;
  if (type.startsWith('text/') || ['json', 'css', 'js', 'mjs', 'txt', 'md', 'svg'].includes(ext)) return true;
  if (type.includes('json') || type.includes('javascript')) return true;
  return false;
}

function summarize(item) {
  return Object.freeze({
    index: item.index,
    name: item.name,
    size: item.size,
    mime: item.mime,
    status: item.status,
    reason: item.reason || null,
  });
}

export function classifyIntake(files, { priorKeys } = {}) {
  const seen = new Set(priorKeys || []);
  const queue = [];
  const accepted = [];
  const rejected = [];

  Array.from(files || []).forEach((file, index) => {
    let reason = null;
    if (!file || typeof file.name !== 'string') reason = 'INVALID_FILE';
    else if (!String(file.name).trim()) reason = 'EMPTY_NAME';
    else if (Number(file.size || 0) <= 0) reason = 'EMPTY_FILE';
    else if (Number(file.size || 0) > MAX_BYTES) reason = 'TOO_LARGE';
    else if (!isSupported(file)) reason = 'UNSUPPORTED_TYPE';
    else {
      const key = intakeKey(file);
      if (seen.has(key)) reason = 'DUPLICATE';
      else seen.add(key);
    }

    const item = {
      index,
      name: String(file?.name || ''),
      size: Number(file?.size || 0),
      mime: String(file?.type || ''),
      status: reason ? 'rejected' : 'accepted',
      reason,
      file,
    };
    queue.push(item);
    (reason ? rejected : accepted).push(item);
  });

  return {
    classified: true,
    mutated: false,
    order: accepted.map((item) => item.index),
    accepted,
    rejected,
    queue,
    seenKeys: [...seen],
  };
}

function dropParsedItems(parsed) {
  const canvas = document.getElementById('canvas');
  if (!canvas || !parsed?.length) return 0;
  const rect = canvas.getBoundingClientRect();
  parsed.forEach((item, index) => {
    const dt = new DataTransfer();
    dt.setData('text/yaiwes-kind', item.kind);
    dt.setData('text/yaiwes-label', item.label);
    dt.setData('application/yaiwes-import-summary', JSON.stringify({
      sourceName: item.props?.sourceName,
      mime: item.props?.mime,
      parsedType: item.props?.parsedType,
      size: item.props?.size,
    }));
    const offset = 24 * index;
    canvas.dispatchEvent(new DragEvent('drop', {
      bubbles: true,
      cancelable: true,
      clientX: Math.max(rect.left + 120, rect.left + rect.width / 2 + offset),
      clientY: Math.max(rect.top + 90, rect.top + rect.height / 2 + offset),
      dataTransfer: dt,
    }));
  });
  return parsed.length;
}

export async function importBatchFiles(files, { drop = dropParsedItems, parse = parseFileForCanvas, priorKeys } = {}) {
  const classification = classifyIntake(files, { priorKeys });
  const evidence = {
    schema: 'yaiwes.factory.import-batch/v2',
    classifiedBeforeMutation: true,
    mutated: false,
    imported: 0,
    order: classification.accepted.map((item) => item.name),
    accepted: classification.accepted.map(summarize),
    rejected: classification.rejected.map(summarize),
  };

  const parsed = [];
  for (const item of classification.accepted) {
    parsed.push(await parse(item.file));
  }
  const imported = parsed.length ? Number(drop(parsed) || 0) : 0;
  evidence.imported = imported;
  evidence.mutated = imported > 0;

  const frozen = Object.freeze(evidence);
  if (typeof window !== 'undefined') window.__YAIWES_FILE_IMPORT_V2__ = frozen;
  return frozen;
}

function isOsFileDrop(event) {
  const types = Array.from(event?.dataTransfer?.types || []);
  const files = event?.dataTransfer?.files;
  if (types.includes('text/yaiwes-kind')) return false;
  return Boolean(files && files.length);
}

function bindCanvasFileDrop() {
  if (typeof document === 'undefined') return;
  const onDragOver = (event) => {
    if (!event.target?.closest?.('#canvas')) return;
    if (!isOsFileDrop(event)) return;
    event.preventDefault();
  };
  const onDrop = (event) => {
    if (!event.target?.closest?.('#canvas')) return;
    if (!isOsFileDrop(event)) return;
    event.preventDefault();
    event.stopPropagation();
    importBatchFiles(event.dataTransfer.files).catch((error) => {
      if (typeof window !== 'undefined') {
        window.__YAIWES_FILE_IMPORT_V2__ = Object.freeze({
          schema: 'yaiwes.factory.import-batch/v2',
          imported: 0,
          error: String(error?.message || error),
        });
      }
    });
  };
  document.addEventListener('dragover', onDragOver, { capture: true });
  document.addEventListener('drop', onDrop, { capture: true });
  document.addEventListener('yaiwes:import-batch', (event) => {
    importBatchFiles(event.detail?.files || []).catch(() => {});
  });
}

bindCanvasFileDrop();

export { dropParsedItems, intakeKey, isSupported, MAX_BYTES };
