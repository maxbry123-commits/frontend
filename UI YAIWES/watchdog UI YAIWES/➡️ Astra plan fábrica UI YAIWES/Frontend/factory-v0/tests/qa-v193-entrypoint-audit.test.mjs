import { readdirSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import assert from 'node:assert/strict';

const E2E_DIR = new URL('./e2e/', import.meta.url);
const OUT_DIR = new URL('../test-results/', import.meta.url);
const gateIds = Array.from({ length: 11 }, (_, i) => 51 + i);
const files = readdirSync(E2E_DIR, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith('.mjs'))
  .map((entry) => entry.name);

function classify(content) {
  const legacy = [...content.matchAll(/index-v(?:19|192)\.html/g)].map((m) => m[0]);
  const v193 = [...content.matchAll(/index-v193\.html/g)].map((m) => m[0]);
  const liveDynamic = /LIVE_URL|BASE_URL|process\.env\.[A-Z0-9_]*URL|source-sha\.txt|served[_-]sha/i.test(content);
  if (legacy.length) return { state: 'LEGACY_TARGET', legacy: [...new Set(legacy)] };
  if (v193.length) return { state: 'V193', legacy: [] };
  if (liveDynamic) return { state: 'LIVE_DYNAMIC', legacy: [] };
  return { state: 'NO_EXPLICIT_ENTRYPOINT', legacy: [] };
}

const rows = [];
for (const gate of gateIds) {
  const token = String(gate).padStart(3, '0');
  const matching = files.filter((name) => new RegExp(`f-ui-${token}(?:-|\\.)`, 'i').test(name));
  if (!matching.length) {
    rows.push({ gate: `F-UI-${token}`, state: 'MISSING', files: [] });
    continue;
  }
  const fileRows = matching.map((name) => {
    const content = readFileSync(new URL(`./e2e/${name}`, import.meta.url), 'utf8');
    return { file: name, ...classify(content) };
  });
  const states = [...new Set(fileRows.map((row) => row.state))];
  const aggregate = states.includes('LEGACY_TARGET')
    ? 'LEGACY_TARGET'
    : states.includes('V193')
      ? 'V193'
      : states.includes('LIVE_DYNAMIC')
        ? 'LIVE_DYNAMIC'
        : 'NO_EXPLICIT_ENTRYPOINT';
  rows.push({ gate: `F-UI-${token}`, state: aggregate, files: fileRows });
}

mkdirSync(OUT_DIR, { recursive: true });
const output = {
  schema: 'yaiwes.factory.qa-entrypoint-audit/v1',
  candidate: 'index-v193.html',
  gates: rows,
  counts: rows.reduce((acc, row) => {
    acc[row.state] = (acc[row.state] || 0) + 1;
    return acc;
  }, {})
};
writeFileSync(new URL('../test-results/qa-v193-entrypoint-audit.json', import.meta.url), JSON.stringify(output, null, 2));
console.log(`FACTORY_QA_V193_ENTRYPOINT_AUDIT=${JSON.stringify(output)}`);

assert.equal(rows.length, 11, 'F-UI-051..061 denominator must remain 11 gates');
assert.equal(rows.some((row) => row.state === 'NO_EXPLICIT_ENTRYPOINT'), false,
  'Every existing 051..061 gate must explicitly target V193, a live URL, or be marked legacy');
