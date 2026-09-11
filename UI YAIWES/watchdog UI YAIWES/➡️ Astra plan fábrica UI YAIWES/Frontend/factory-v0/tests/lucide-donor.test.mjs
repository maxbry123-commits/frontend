import assert from 'node:assert/strict';
import { LUCIDE_PROVENANCE, renderLucideIcon } from '../src/donors/lucide-icons.js';

assert.equal(LUCIDE_PROVENANCE.upstream, 'https://github.com/lucide-icons/lucide');
assert.equal(LUCIDE_PROVENANCE.sourceCommit, 'a53bd66a03dfd5609c3638379869e83dc207b051');
assert.match(LUCIDE_PROVENANCE.license, /ISC/);
assert.match(LUCIDE_PROVENANCE.localSource, /Lucide\/code\/icons\/plus\.svg$/);

const icon = renderLucideIcon('plus', { size: 18, label: 'Añadir' });
assert.match(icon, /width="18"/);
assert.match(icon, /aria-label="Añadir"/);
assert.match(icon, /M5 12h14/);
assert.match(icon, /M12 5v14/);
assert.throws(() => renderLucideIcon('missing'), /LUCIDE_ICON_UNAVAILABLE/);

console.log('LUCIDE_DONOR_TEST=PASS');
