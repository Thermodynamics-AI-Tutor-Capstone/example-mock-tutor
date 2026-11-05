const origin = 'https://mac.tailfb765c.ts.net:8443';
const routes = { register: { method: 'POST', path: '/register' }, token: { method: 'POST', path: '/token' }, data: { method: 'GET', path: '/dashboard-data' } };

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const action = String(req.query.action || '');
  const route = routes[action];
  if (!route || req.method !== route.method) return res.status(404).json({ error: 'Not found' });
  const url = new URL(route.path, origin);
  if (action === 'data' && typeof req.query.student_id === 'string') url.searchParams.set('student_id', req.query.student_id.slice(0, 80));
  const headers = {};
  let body;
  if (action === 'register') { headers['content-type'] = 'application/json'; body = JSON.stringify(req.body); }
  if (action === 'token') { headers['content-type'] = 'application/x-www-form-urlencoded'; body = new URLSearchParams(req.body).toString(); }
  if (action === 'data' && /^Bearer [A-Za-z0-9_-]+$/i.test(req.headers.authorization || '')) headers.authorization = req.headers.authorization;
  try {
    const upstream = await fetch(url, { method: route.method, headers, body, signal: AbortSignal.timeout(10000) });
    const payload = await upstream.text();
    res.status(upstream.status).setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    return res.send(payload);
  } catch {
    return res.status(502).json({ error: 'Kelvin is temporarily unavailable' });
  }
}
