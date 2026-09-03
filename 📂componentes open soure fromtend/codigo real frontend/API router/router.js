const ROUTER_API_URL = process.env.ROUTER_API_URL;

function json(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (!ROUTER_API_URL) {
    return json(res, 503, { ok: false, error: 'ROUTER_API_URL is not configured' });
  }

  const path = typeof req.query?.path === 'string' ? req.query.path : 'health';
  const allowed = new Set(['health', 'providers', 'models', 'processors']);
  if (!allowed.has(path)) {
    return json(res, 404, { ok: false, error: 'unsupported route' });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const upstream = await fetch(`${ROUTER_API_URL.replace(/\/$/, '')}/${path}`, {
      method: 'GET',
      headers: { accept: 'application/json' },
      signal: controller.signal,
    });
    const text = await upstream.text();
    let body;
    try { body = JSON.parse(text); } catch { body = { ok: upstream.ok, raw: text }; }
    return json(res, upstream.status, body);
  } catch (error) {
    return json(res, 502, { ok: false, error: 'router_unreachable' });
  } finally {
    clearTimeout(timer);
  }
}
