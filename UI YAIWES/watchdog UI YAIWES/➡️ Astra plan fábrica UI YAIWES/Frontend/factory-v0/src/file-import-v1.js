// YAIWES Factory F-AI-021 — file -> parse -> editable canvas descriptor.
const TEXT_LIMIT = 256 * 1024;
const DATA_URL_LIMIT = 1024 * 1024;

function extension(name='') {
  const i = String(name).lastIndexOf('.');
  return i >= 0 ? String(name).slice(i + 1).toLowerCase() : '';
}

function kindFor(file) {
  const type = String(file.type || '').toLowerCase();
  const ext = extension(file.name);
  if (type.startsWith('image/')) return 'image';
  if (type.startsWith('audio/')) return 'audio';
  if (type.startsWith('video/')) return 'video';
  if (type === 'text/html' || ['html','htm'].includes(ext)) return 'page';
  return 'panel';
}

function bytesToBase64(bytes) {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function hexSignature(bytes, limit = 32) {
  return Array.from(bytes.subarray(0, limit), b => b.toString(16).padStart(2,'0')).join('');
}

export async function parseFileForCanvas(file) {
  if (!file || typeof file.name !== 'string') throw new TypeError('INVALID_FILE');
  const type = String(file.type || 'application/octet-stream');
  const size = Number(file.size || 0);
  const ext = extension(file.name);
  const props = { sourceName:file.name, mime:type, size, importedAt:new Date().toISOString() };

  const isText = type.startsWith('text/') || ['html','htm','json','css','js','mjs','txt','md','svg'].includes(ext);
  if (isText && typeof file.text === 'function') {
    const text = String(await file.text());
    props.content = text.slice(0, TEXT_LIMIT);
    props.truncated = text.length > TEXT_LIMIT;
    props.parsedType = ext === 'json' || type.includes('json') ? 'json' : (['html','htm'].includes(ext) || type === 'text/html' ? 'html' : 'text');
    if (props.parsedType === 'json') {
      try { props.parsed = JSON.parse(text); }
      catch (error) { props.parseError = `JSON:${error?.message || 'invalid'}`; }
    }
  } else if (typeof file.arrayBuffer === 'function') {
    const bytes = new Uint8Array(await file.arrayBuffer());
    props.parsedType = 'binary';
    props.byteLength = bytes.byteLength;
    props.byteSignature = hexSignature(bytes);
    if (/^(image|audio|video)\//.test(type) && bytes.byteLength <= DATA_URL_LIMIT) {
      props.dataUrl = `data:${type};base64,${bytesToBase64(bytes)}`;
    }
  } else {
    props.parsedType = 'metadata-only-fallback';
  }

  return {
    kind: kindFor(file),
    label: file.name,
    w: kindFor(file) === 'page' ? 420 : 260,
    h: kindFor(file) === 'image' ? 220 : 160,
    props
  };
}

export async function parseFilesForCanvas(files) {
  const out = [];
  for (const file of Array.from(files || [])) out.push(await parseFileForCanvas(file));
  return out;
}
