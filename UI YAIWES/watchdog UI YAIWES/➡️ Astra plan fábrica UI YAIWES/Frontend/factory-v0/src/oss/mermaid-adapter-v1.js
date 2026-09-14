export const MERMAID_ADAPTER_VERSION = '1.0.0';
export const MERMAID_CAPABILITY = Object.freeze({
  component: 'Mermaid',
  capability: 'diagram-from-text',
  sourcePath: '📂componentes open soure fromtend/Fromtend code/Mermaid/',
  sourceCommit: 'ba74a2c9a91b7108fe78daf66c3c7e1a897add5c',
  sourceVersion: '10.2.4',
  license: 'MIT',
  stateOwner: 'YAIWES',
  wired: false,
});

const DEFAULT_MAX_SOURCE_LENGTH = 100_000;
const UNSAFE_SVG = /<(?:script|iframe|object|embed)\b|javascript\s*:|\son[a-z]+\s*=/i;

function normalizeId(value = 'yaiwes-mermaid') {
  const id = String(value).trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
  return (id || 'yaiwes-mermaid').slice(0, 80);
}

export function normalizeMermaidSource(value, maxLength = DEFAULT_MAX_SOURCE_LENGTH) {
  const source = String(value ?? '').trim();
  if (!source) throw new TypeError('MERMAID_SOURCE_REQUIRED');
  if (!Number.isInteger(maxLength) || maxLength < 1) throw new TypeError('MERMAID_MAX_LENGTH_INVALID');
  if (source.length > maxLength) throw new RangeError('MERMAID_SOURCE_TOO_LARGE');
  return source;
}

function assertRuntime(runtime) {
  if (!runtime || typeof runtime.initialize !== 'function' || typeof runtime.render !== 'function') {
    throw new TypeError('MERMAID_RUNTIME_REQUIRED');
  }
}

function assertContainer(container) {
  if (!container || typeof container !== 'object' || !('innerHTML' in container)) {
    throw new TypeError('MERMAID_CONTAINER_REQUIRED');
  }
}

function assertSafeSvg(svg) {
  if (typeof svg !== 'string' || !/^\s*<svg\b/i.test(svg) || UNSAFE_SVG.test(svg)) {
    throw new Error('MERMAID_UNSAFE_OR_INVALID_SVG');
  }
  return svg;
}

export function createMermaidAdapter(runtime, options = {}) {
  assertRuntime(runtime);
  const maxSourceLength = options.maxSourceLength ?? DEFAULT_MAX_SOURCE_LENGTH;
  const initializeOptions = Object.freeze({
    startOnLoad: false,
    securityLevel: 'strict',
    suppressErrorRendering: true,
    ...(options.initialize || {}),
    startOnLoad: false,
    securityLevel: 'strict',
  });
  let initialized = false;
  let renders = 0;

  async function ensureInitialized() {
    if (initialized) return;
    await runtime.initialize(initializeOptions);
    initialized = true;
  }

  async function render(container, rawSource, renderOptions = {}) {
    assertContainer(container);
    const source = normalizeMermaidSource(rawSource, maxSourceLength);
    await ensureInitialized();
    const diagramId = normalizeId(renderOptions.id);
    const rendered = await runtime.render(diagramId, source);
    const svg = assertSafeSvg(typeof rendered === 'string' ? rendered : rendered?.svg);
    container.innerHTML = svg;
    if (rendered && typeof rendered.bindFunctions === 'function') rendered.bindFunctions(container);
    renders += 1;
    if (container.dataset) {
      container.dataset.yaiwesOss = 'mermaid';
      container.dataset.yaiwesMermaidId = diagramId;
    }
    return Object.freeze({
      diagramId,
      sourceLength: source.length,
      renderCount: renders,
      wired: false,
      capability: MERMAID_CAPABILITY.capability,
    });
  }

  return Object.freeze({
    render,
    status: () => Object.freeze({ initialized, renders, wired: false }),
    capability: MERMAID_CAPABILITY,
  });
}
