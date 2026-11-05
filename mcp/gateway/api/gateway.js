const upstreamOrigin = 'https://mac.tailfb765c.ts.net:8443';
const routes = {
  mcp: '/mcp', account: '/mcp/account', authMetadata: '/.well-known/oauth-authorization-server',
  resourceMetadata: '/.well-known/oauth-protected-resource/mcp/account',
  authorize: '/authorize', login: '/login', register: '/register', token: '/token',
  revoke: '/revoke', dashboardData: '/dashboard-data'
};
const forwardedHeaders = ['accept', 'authorization', 'content-type', 'mcp-protocol-version', 'mcp-session-id', 'last-event-id'];
const responseHeaders = ['content-type', 'www-authenticate', 'location', 'allow', 'mcp-session-id', 'cache-control'];

export default async function handler(req, res) {
  const route = routes[String(req.query.route || '')];
  if (!route) return res.status(404).send('Not found');
  const url = new URL(route, upstreamOrigin);
  for (const [key, value] of Object.entries(req.query)) {
    if (key === 'route') continue;
    if (Array.isArray(value)) for (const item of value) url.searchParams.append(key, item);
    else if (value !== undefined) url.searchParams.append(key, value);
  }
  const headers = {};
  for (const key of forwardedHeaders) if (typeof req.headers[key] === 'string') headers[key] = req.headers[key];
  let body;
  if (!['GET', 'HEAD'].includes(req.method)) {
    if (Buffer.isBuffer(req.body)) body = req.body;
    else if (typeof req.body === 'string') body = req.body;
    else if (headers['content-type']?.includes('application/x-www-form-urlencoded')) body = new URLSearchParams(req.body || {}).toString();
    else if (req.body !== undefined) body = JSON.stringify(req.body);
  }
  try {
    const upstream = await fetch(url, { method: req.method, headers, body, redirect: 'manual', signal: AbortSignal.timeout(30000) });
    for (const key of responseHeaders) {
      const value = upstream.headers.get(key);
      if (value) res.setHeader(key, value);
    }
    res.setHeader('Cache-Control', 'no-store');
    res.status(upstream.status);
    if (req.method === 'HEAD') return res.end();
    return res.send(Buffer.from(await upstream.arrayBuffer()));
  } catch {
    return res.status(502).json({ error: 'Kelvin is temporarily unavailable' });
  }
}
