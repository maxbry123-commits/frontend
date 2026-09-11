export const LUCIDE_PROVENANCE = Object.freeze({
  upstream: 'https://github.com/lucide-icons/lucide',
  sourceCommit: 'a53bd66a03dfd5609c3638379869e83dc207b051',
  license: 'ISC + MIT for Feather-derived icons',
  localSource: 'UI YAIWES/componentes open soure UI YAIWES/Lucide/code/icons/plus.svg',
  capability: 'minimal SVG icon rendering'
});

const ICONS = Object.freeze({
  plus: Object.freeze([
    '<path d="M5 12h14" />',
    '<path d="M12 5v14" />'
  ])
});

export function renderLucideIcon(name, { size = 16, label = '' } = {}) {
  const nodes = ICONS[name];
  if (!nodes) throw new Error(`LUCIDE_ICON_UNAVAILABLE:${name}`);
  const aria = label
    ? `role="img" aria-label="${String(label).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}"`
    : 'aria-hidden="true"';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${Number(size)}" height="${Number(size)}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${aria}>${nodes.join('')}</svg>`;
}
