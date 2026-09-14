import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { classifyFactoryPath, validateSegmentClaim } from '../src/segments/segment-registry-v1.js';
import {
  COMPONENT_BROWSER_VERSION,
  DRAG_KIND_TYPE,
  DRAG_LABEL_TYPE,
  STORAGE_KEY_V1,
  STORAGE_KEY_V2,
  createComponentBrowserEngine,
  createMemoryDataTransfer,
  loadBrowserMeta,
  maybeAutoMountComponentBrowserV2,
} from '../src/ui/component-browser-v2.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
let passed = 0;
const test = (name, fn) => {
  fn();
  passed += 1;
  console.log(`PASS ${passed}: ${name}`);
};

const cards = [
  { kind: 'button', label: 'Botón', category: 'Controles' },
  { kind: 'window', label: 'Ventana', category: 'Layout' },
  { kind: 'image', label: 'Imagen', category: 'Media' },
  { kind: 'panel', label: 'Panel', category: 'Layout' },
  { kind: 'selector', label: 'Selector', category: 'Controles' },
];

function memoryStorage(seed = {}) {
  const map = new Map(Object.entries(seed));
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => { map.set(key, String(value)); },
    removeItem: (key) => { map.delete(key); },
    raw: map,
  };
}

test('v1 historical file is preserved and v2 is a new versioned path', () => {
  assert.equal(fs.existsSync(path.join(root, 'src/ui/component-browser-v1.js')), true);
  assert.equal(fs.existsSync(path.join(root, 'src/ui/component-browser-v2.js')), true);
  const v1 = fs.readFileSync(path.join(root, 'src/ui/component-browser-v1.js'), 'utf8');
  const v2 = fs.readFileSync(path.join(root, 'src/ui/component-browser-v2.js'), 'utf8');
  assert.match(v1, /dataset\.componentBrowser = 'v1'/);
  assert.doesNotMatch(v1, /COMPONENT_BROWSER_VERSION/);
  assert.match(v2, /COMPONENT_BROWSER_VERSION = 'v2'/);
  assert.equal(COMPONENT_BROWSER_VERSION, 'v2');
});

test('write_scope belongs exclusively to SEG-02-BROWSER', () => {
  assert.deepEqual(classifyFactoryPath('src/ui/component-browser-v2.js'), {
    state: 'OWNED',
    segmentId: 'SEG-02-BROWSER',
  });
  assert.equal(validateSegmentClaim({
    segmentId: 'SEG-02-BROWSER',
    paths: ['src/ui/component-browser-v2.js'],
  }).ok, true);
  assert.equal(validateSegmentClaim({
    segmentId: 'SEG-02-BROWSER',
    paths: ['src/ui/workspace-shell-v2.js'],
  }).ok, false);
  assert.equal(validateSegmentClaim({
    segmentId: 'SEG-02-BROWSER',
    role: 'producer',
    paths: ['src/bootstrap/candidate-v193.js'],
  }).ok, false);
});

test('search/category/filter stay isolated from insert', () => {
  const engine = createComponentBrowserEngine({ cards });
  engine.setQuery('Botón');
  assert.deepEqual(engine.visible().map((item) => item.kind), ['button']);
  engine.setQuery('');
  engine.setCategory('Media');
  assert.deepEqual(engine.visible().map((item) => item.kind), ['image']);
  const selected = engine.select('image');
  assert.equal(selected.inserted, false);
  assert.equal(engine.selectedKind, 'image');
  engine.setCategory('all');
  engine.setFilter('favorites');
  assert.equal(engine.visible().length, 0);
});

test('favorite/recent persist on v2 key and migrate v1 storage', () => {
  const storage = memoryStorage({
    [STORAGE_KEY_V1]: JSON.stringify({ favorites: ['image'], recent: ['window'] }),
  });
  const migrated = loadBrowserMeta(storage);
  assert.deepEqual(migrated.favorites, ['image']);
  assert.deepEqual(migrated.recent, ['window']);
  assert.equal(storage.raw.has(STORAGE_KEY_V2), true);

  const engine = createComponentBrowserEngine({ cards, storage });
  engine.select('button');
  engine.toggleFavorite('button');
  const inserted = engine.insert('button');
  assert.equal(inserted.inserted, true);
  assert.deepEqual(inserted.recent[0], 'button');
  engine.setFilter('recent');
  assert.ok(engine.visible().some((item) => item.kind === 'button'));
  engine.setFilter('favorites');
  assert.ok(engine.visible().some((item) => item.kind === 'button'));
  const persisted = JSON.parse(storage.getItem(STORAGE_KEY_V2));
  assert.ok(persisted.favorites.includes('button'));
  assert.equal(persisted.recent[0], 'button');
});

test('isolated drag payload writes text/yaiwes-kind without app-v19', () => {
  const engine = createComponentBrowserEngine({ cards });
  const missing = engine.bindDragStart({}, 'window');
  assert.equal(missing.ok, false);
  assert.equal(missing.reason, 'NO_DATATRANSFER');

  const dt = createMemoryDataTransfer();
  const bound = engine.bindDragStart({ dataTransfer: dt }, 'window');
  assert.equal(bound.ok, true);
  assert.equal(dt.getData(DRAG_KIND_TYPE), 'window');
  assert.equal(dt.getData(DRAG_LABEL_TYPE), 'Ventana');
  assert.ok(dt.types.includes('text/yaiwes-kind'));
  assert.equal(engine.selectedKind, 'window');
  assert.match(bound.preview, /Arrastrando · window · Layout/);
  assert.equal(engine.lastDrag.kind, 'window');
});

test('keyboard-equivalent select does not insert until explicit action', () => {
  const engine = createComponentBrowserEngine({ cards });
  const preview = engine.select('selector');
  assert.equal(preview.inserted, false);
  assert.deepEqual(engine.meta.recent, []);
  const inserted = engine.insert('selector');
  assert.equal(inserted.ok, true);
  assert.equal(inserted.kind, 'selector');
  assert.deepEqual(engine.meta.recent, ['selector']);
});

test('replaceCatalog keeps favorites/recent and drops stale selection', () => {
  const storage = memoryStorage();
  const engine = createComponentBrowserEngine({ cards, storage });
  engine.toggleFavorite('image');
  engine.insert('panel');
  engine.select('window');
  engine.replaceCatalog(cards.filter((card) => card.kind !== 'window'));
  assert.equal(engine.selectedKind, null);
  assert.ok(engine.meta.favorites.includes('image'));
  assert.deepEqual(engine.meta.recent, ['panel']);
  assert.equal(engine.catalog().some((card) => card.kind === 'window'), false);
});

test('node import is side-effect free and does not auto-mount', () => {
  const auto = maybeAutoMountComponentBrowserV2(undefined);
  assert.equal(auto.ok, false);
  assert.equal(auto.reason, 'NO_DOCUMENT');
  const url = pathToFileURL(path.join(root, 'src/ui/component-browser-v2.js')).href;
  assert.match(url, /component-browser-v2\.js$/);
});

console.log(JSON.stringify({
  status: 'PASS',
  schema: 'yaiwes.factory.segment-test/v1',
  node_id: 'F-FE-067',
  segment_id: 'SEG-02-BROWSER',
  version: COMPONENT_BROWSER_VERSION,
  passed,
  expected: 8,
}));
