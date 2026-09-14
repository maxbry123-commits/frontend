export const SEGMENT_SCHEMA = 'yaiwes.factory.segment/v1';

const REQUIRED = ['id','name','order','layer','module','writeScope','versionPolicy'];

export function defineSegment(spec) {
  if (!spec || typeof spec !== 'object') throw new TypeError('SEGMENT_SPEC_REQUIRED');
  for (const key of REQUIRED) {
    if (spec[key] === undefined || spec[key] === null || spec[key] === '') {
      throw new Error(`SEGMENT_FIELD_REQUIRED:${key}`);
    }
  }
  if (!/^SEG-\d{2}$/.test(spec.id)) throw new Error(`SEGMENT_ID_INVALID:${spec.id}`);
  if (!Number.isInteger(spec.order) || spec.order < 1) throw new Error(`SEGMENT_ORDER_INVALID:${spec.id}`);
  if (!String(spec.module).startsWith('./seg-')) throw new Error(`SEGMENT_MODULE_INVALID:${spec.id}`);
  if (!String(spec.writeScope).includes('factory-v0')) throw new Error(`SEGMENT_SCOPE_INVALID:${spec.id}`);
  return Object.freeze({ schema: SEGMENT_SCHEMA, ...spec });
}

export function validateSegmentRegistry(segments) {
  if (!Array.isArray(segments) || segments.length === 0) throw new Error('SEGMENT_REGISTRY_EMPTY');
  const ids = new Set();
  const orders = new Set();
  for (const segment of segments) {
    if (segment.schema !== SEGMENT_SCHEMA) throw new Error(`SEGMENT_SCHEMA_MISMATCH:${segment.id}`);
    if (ids.has(segment.id)) throw new Error(`SEGMENT_DUPLICATE_ID:${segment.id}`);
    if (orders.has(segment.order)) throw new Error(`SEGMENT_DUPLICATE_ORDER:${segment.order}`);
    ids.add(segment.id);
    orders.add(segment.order);
  }
  return true;
}
