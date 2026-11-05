import { randomUUID } from 'node:crypto';

const upstreamOrigin = 'https://mac.tailfb765c.ts.net:8443';
const forwardedHeaders = ['accept', 'content-type', 'mcp-protocol-version', 'mcp-session-id', 'last-event-id'];
const responseHeaders = ['content-type', 'allow', 'mcp-session-id'];

export default async function handler(req, res) {
  const started = Date.now();
  const requestId = randomUUID();
  res.setHeader('X-Kelvin-Request-Id', requestId);
  res.setHeader('Cache-Control', 'no-store');
  let upstreamStatus;
  try {
    const headers = { 'x-kelvin-request-id': requestId };
    const clientIp = req.headers['x-vercel-forwarded-for'] || req.headers['x-forwarded-for'];
    if (typeof clientIp === 'string') headers['x-kelvin-client-ip'] = clientIp.split(',')[0].trim();
    for (const key of forwardedHeaders) if (typeof req.headers[key] === 'string') headers[key] = req.headers[key];
    const body = ['GET', 'HEAD'].includes(req.method) ? undefined
      : Buffer.isBuffer(req.body) ? req.body : typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const upstream = await fetch(new URL('/mcp', upstreamOrigin), {
      method: req.method, headers, body, redirect: 'manual', signal: AbortSignal.timeout(20000)
    });
    upstreamStatus = upstream.status;
    for (const key of responseHeaders) {
      const value = upstream.headers.get(key);
      if (value) res.setHeader(key, value);
    }
    return res.status(upstream.status).send(Buffer.from(await upstream.arrayBuffer()));
  } catch (error) {
    console.error(JSON.stringify({ event: 'gateway_error', requestId, error: error.name }));
    return res.status(502).json({ error: 'Kelvin is temporarily unavailable' });
  } finally {
    const body = typeof req.body === 'object' && !Buffer.isBuffer(req.body) ? req.body : null;
    console.log(JSON.stringify({ event: 'request', requestId, at: new Date().toISOString(),
      clientIp: req.headers['x-vercel-forwarded-for'] || req.headers['x-forwarded-for'] || null,
      userAgent: String(req.headers['user-agent'] || '').slice(0, 300), method: req.method, path: '/mcp',
      rpcMethod: typeof body?.method === 'string' ? body.method : null,
      tool: body?.method === 'tools/call' && typeof body.params?.name === 'string' ? body.params.name : null,
      contentLength: Number(req.headers['content-length'] || 0), authHeaderPresent: Boolean(req.headers.authorization),
      status: res.statusCode, upstreamStatus: upstreamStatus || null, durationMs: Date.now() - started }));
  }
}
