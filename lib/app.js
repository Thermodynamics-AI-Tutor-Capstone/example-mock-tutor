import crypto from 'node:crypto';
import { waitUntil, getDeadline } from '@vercel/functions';
import { query, ensureSchema, dbKind } from './db.js';
import { llmConfig, runAgentTurn, agentSummary } from './agent.js';
import { loadKnowledge } from './knowledge.js';

const MAX_BODY = 1024 * 1024;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const NEW_TITLE = 'New chat';
const FUNCTION_PATHS = new Set(['/api', '/api/', '/api/handler', '/api/handler.js']);
const DEADLINE_MARGIN_MS = 8000;

let keyResolver = () => {
  const key = (process.env[llmConfig().apiKeyEnvVar] || '').trim();
  return key ? { key, source: 'env' } : { key: null, source: null };
};

export function configure({ resolveKey } = {}) {
  if (typeof resolveKey === 'function') keyResolver = resolveKey;
}

function requiredPasscode() {
  return process.env.APP_PASSCODE || '';
}

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

export function resolveApiPath(rawUrl) {
  let url;
  try {
    url = new URL(rawUrl || '/', 'http://localhost');
  } catch {
    return null;
  }
  const pathname = url.pathname;
  if (FUNCTION_PATHS.has(pathname) && url.searchParams.has('route')) {
    const route = url.searchParams.get('route').replace(/^\/+/, '');
    return route ? `/api/${route}` : '/api';
  }
  return pathname;
}

function passcodeOk(req) {
  const expected = requiredPasscode();
  if (!expected) return true;
  const given = req.headers['x-app-passcode'];
  if (typeof given !== 'string') return false;
  const a = crypto.createHash('sha256').update(given, 'utf8').digest();
  const b = crypto.createHash('sha256').update(expected, 'utf8').digest();
  return crypto.timingSafeEqual(a, b);
}

function sendJson(res, status, body) {
  const data = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(data),
    'Cache-Control': 'no-store',
  });
  res.end(data);
}

function parseJsonText(text) {
  if (!text.trim()) return {};
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw httpError(400, 'Invalid JSON body');
  }
  return parsed && typeof parsed === 'object' ? parsed : {};
}

async function readJsonBody(req) {
  if (Object.getOwnPropertyDescriptor(req, 'body')) {
    let parsed;
    try {
      parsed = req.body;
    } catch {
      throw httpError(400, 'Invalid JSON body');
    }
    if (Buffer.isBuffer(parsed)) parsed = parsed.toString('utf8');
    if (typeof parsed === 'string') {
      if (Buffer.byteLength(parsed) > MAX_BODY) throw httpError(413, 'Request body too large');
      return parseJsonText(parsed);
    }
    if (parsed && typeof parsed === 'object') return parsed;
  }
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    let failed = false;
    req.on('data', (chunk) => {
      if (failed) return;
      size += chunk.length;
      if (size > MAX_BODY) {
        failed = true;
        reject(httpError(413, 'Request body too large'));
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (failed) return;
      try {
        resolve(parseJsonText(Buffer.concat(chunks).toString('utf8')));
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function toIso(value) {
  if (value instanceof Date) return value.toISOString();
  return new Date(value).toISOString();
}

function summary(row) {
  return { id: row.id, title: row.title, createdAt: toIso(row.created_at), updatedAt: toIso(row.updated_at) };
}

function makeTitle(content) {
  const collapsed = content.replace(/\s+/g, ' ').trim();
  const chars = Array.from(collapsed);
  if (chars.length <= 50) return collapsed || NEW_TITLE;
  return chars.slice(0, 50).join('').trimEnd() + '…';
}

async function getConversationRow(id) {
  const { rows } = await query('SELECT id, title, created_at, updated_at FROM conversations WHERE id = $1', [id]);
  return rows[0] || null;
}

async function listConversations() {
  const { rows } = await query(
    'SELECT id, title, created_at, updated_at FROM conversations ORDER BY updated_at DESC, created_at DESC'
  );
  return rows.map(summary);
}

async function createConversation() {
  const { rows } = await query(
    'INSERT INTO conversations (id, title) VALUES ($1, $2) RETURNING id, title, created_at, updated_at',
    [crypto.randomUUID(), NEW_TITLE]
  );
  return { ...summary(rows[0]), messages: [] };
}

async function getConversation(id) {
  const row = await getConversationRow(id);
  if (!row) return null;
  const { rows } = await query(
    'SELECT role, content, created_at FROM messages WHERE conversation_id = $1 ORDER BY id',
    [id]
  );
  return {
    ...summary(row),
    messages: rows.map((m) => ({ role: m.role, content: m.content, createdAt: toIso(m.created_at) })),
  };
}

async function handleHealth(res) {
  const { key, source } = keyResolver();
  const config = llmConfig();
  const body = {
    ok: true,
    model: config.model,
    keySource: source,
    db: dbKind(),
    passcodeRequired: Boolean(requiredPasscode()),
    models: [],
  };

  const agentCheck = agentSummary()
    .then((agent) => {
      body.agent = agent;
    })
    .catch((e) => {
      console.error('Agent summary failed:', e.message);
      body.agent = { name: 'Kelvin AI', skills: 0, knowledgeFiles: 0, knowledgeSkipped: 0, indexBuiltAt: null };
      body.agentError = 'Could not load skills or course materials';
    });

  const dbCheck = ensureSchema()
    .then(() => query('SELECT 1 AS ok'))
    .catch((e) => {
      console.error('Database check failed:', e.message);
      body.dbError = 'Database unavailable';
    });

  const modelsCheck = (async () => {
    if (!key) {
      body.modelsError = `No ${config.provider} API key configured`;
      return;
    }
    try {
      const r = await fetch(`${config.baseUrl}/models`, {
        headers: { Authorization: `Bearer ${key}` },
        signal: AbortSignal.timeout(10000),
      });
      if (!r.ok) {
        const text = await r.text().catch(() => '');
        body.modelsError = `${config.provider} /models returned ${r.status}: ${text.slice(0, 500)}`;
      } else {
        const j = await r.json();
        body.models = Array.isArray(j?.data) ? j.data.map((m) => m.id).filter(Boolean) : [];
      }
    } catch (e) {
      body.modelsError = `${config.provider} /models request failed: ${e.message}`;
    }
  })();

  await Promise.all([dbCheck, modelsCheck, agentCheck]);
  sendJson(res, 200, body);
}

async function handleMessage(req, res, id) {
  let settle;
  const lifetime = new Promise((resolve) => {
    settle = resolve;
  });
  waitUntil(lifetime);
  try {
    await streamMessage(req, res, id);
  } finally {
    settle();
  }
}

async function streamMessage(req, res, id) {
  const convo = await getConversationRow(id);
  if (!convo) return sendJson(res, 404, { error: 'Conversation not found' });
  const body = await readJsonBody(req);
  const content = typeof body.content === 'string' ? body.content : '';
  if (!content.trim()) return sendJson(res, 400, { error: 'content must be a non-empty string' });

  const { rows: existingUser } = await query(
    "SELECT 1 AS found FROM messages WHERE conversation_id = $1 AND role = 'user' LIMIT 1",
    [id]
  );
  const titled = convo.title === NEW_TITLE && existingUser.length === 0;
  const title = titled ? makeTitle(content) : convo.title;

  try {
    await query("INSERT INTO messages (conversation_id, role, content) VALUES ($1, 'user', $2)", [id, content]);
  } catch (e) {
    if (e.code === '23503') return sendJson(res, 404, { error: 'Conversation not found' });
    throw e;
  }
  if (titled) {
    await query('UPDATE conversations SET title = $2, updated_at = now() WHERE id = $1', [id, title]);
  } else {
    await query('UPDATE conversations SET updated_at = now() WHERE id = $1', [id]);
  }

  const { rows: history } = await query(
    'SELECT role, content FROM messages WHERE conversation_id = $1 ORDER BY id',
    [id]
  );

  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders();
  req.socket?.setNoDelay?.(true);

  let finished = false;
  let clientGone = false;
  let timedOut = false;
  const controller = new AbortController();
  const send = (obj) => {
    if (clientGone || res.writableEnded || res.destroyed) return;
    res.write(`data: ${JSON.stringify(obj)}\n\n`);
    if (typeof res.flush === 'function') res.flush();
  };
  const onGone = () => {
    if (!finished && !clientGone) {
      clientGone = true;
      controller.abort();
    }
  };
  res.on('close', onGone);
  req.on('error', onGone);

  let deadlineTimer = null;
  const deadline = getDeadline();
  if (deadline) {
    const ms = Math.max(0, deadline.getTime() - Date.now() - DEADLINE_MARGIN_MS);
    deadlineTimer = setTimeout(() => {
      if (!finished) {
        timedOut = true;
        controller.abort();
      }
    }, ms);
  }

  if (titled) send({ type: 'title', title });

  const { key } = keyResolver();
  if (!key) {
    finished = true;
    clearTimeout(deadlineTimer);
    const envVar = llmConfig().apiKeyEnvVar;
    send({
      type: 'error',
      message: `No API key found. Set the ${envVar} environment variable (locally you can put ${envVar}=... in .env), then restart the server or redeploy.`,
    });
    return res.end();
  }

  let accumulated = '';
  let errorMessage = null;
  try {
    const turn = await runAgentTurn({ history, apiKey: key, signal: controller.signal, emit: send });
    accumulated = turn.text;
    errorMessage = turn.error;
    if (turn.exception) {
      if (timedOut) errorMessage = 'The response was cut off because it reached the server time limit.';
      else if (!clientGone) errorMessage = `${llmConfig().provider} request failed: ${turn.exception.message}`;
    }
  } catch (e) {
    if (timedOut) errorMessage = 'The response was cut off because it reached the server time limit.';
    else if (!clientGone) errorMessage = `Could not start the reply: ${e.message}`;
  }

  finished = true;
  clearTimeout(deadlineTimer);
  if (accumulated) {
    try {
      await query("INSERT INTO messages (conversation_id, role, content) VALUES ($1, 'assistant', $2)", [
        id,
        accumulated,
      ]);
      await query('UPDATE conversations SET updated_at = now() WHERE id = $1', [id]);
    } catch (e) {
      console.error('Failed to save assistant message:', e.message);
    }
  }
  if (clientGone) return;
  if (errorMessage) send({ type: 'error', message: errorMessage });
  else send({ type: 'done' });
  res.end();
}

async function route(req, res, pathname) {
  const method = req.method;

  if (pathname === '/api/conversations') {
    if (method === 'GET') return sendJson(res, 200, await listConversations());
    if (method === 'POST') return sendJson(res, 201, await createConversation());
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  const m = pathname.match(/^\/api\/conversations\/([^/]+)(\/messages)?$/);
  if (m) {
    const id = m[1];
    if (!UUID_RE.test(id)) return sendJson(res, 404, { error: 'Conversation not found' });
    if (m[2]) {
      if (method === 'POST') return handleMessage(req, res, id);
      return sendJson(res, 405, { error: 'Method not allowed' });
    }
    if (method === 'GET') {
      const c = await getConversation(id);
      return c ? sendJson(res, 200, c) : sendJson(res, 404, { error: 'Conversation not found' });
    }
    if (method === 'PATCH') {
      if (!(await getConversationRow(id))) return sendJson(res, 404, { error: 'Conversation not found' });
      const body = await readJsonBody(req);
      const title = typeof body.title === 'string' ? body.title.replace(/\s+/g, ' ').trim() : '';
      if (!title) return sendJson(res, 400, { error: 'title must be a non-empty string' });
      const { rows } = await query(
        'UPDATE conversations SET title = $2, updated_at = now() WHERE id = $1 RETURNING id, title, created_at, updated_at',
        [id, Array.from(title).slice(0, 200).join('')]
      );
      return rows[0] ? sendJson(res, 200, summary(rows[0])) : sendJson(res, 404, { error: 'Conversation not found' });
    }
    if (method === 'DELETE') {
      const { rows } = await query('DELETE FROM conversations WHERE id = $1 RETURNING id', [id]);
      if (!rows.length) return sendJson(res, 404, { error: 'Conversation not found' });
      res.writeHead(204, { 'Cache-Control': 'no-store' });
      return res.end();
    }
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  return sendJson(res, 404, { error: 'Not found' });
}

export async function handle(req, res) {
  try {
    const pathname = resolveApiPath(req.url);
    if (pathname === null) return sendJson(res, 400, { error: 'Bad request' });
    if (pathname === '/api/health') {
      if (req.method !== 'GET') return sendJson(res, 405, { error: 'Method not allowed' });
      return await handleHealth(res);
    }
    if (!passcodeOk(req)) return sendJson(res, 401, { error: 'passcode_required' });
    if (pathname !== '/api' && !pathname.startsWith('/api/')) return sendJson(res, 404, { error: 'Not found' });
    if (pathname === '/api/knowledge') {
      if (req.method !== 'GET') return sendJson(res, 405, { error: 'Method not allowed' });
      return sendJson(res, 200, (await loadKnowledge()).publicIndex());
    }
    try {
      await ensureSchema();
    } catch (e) {
      console.error('Database unavailable:', e.message);
      return sendJson(res, 503, { error: 'Database unavailable' });
    }
    return await route(req, res, pathname);
  } catch (e) {
    console.error('Request error:', e.message);
    if (!res.headersSent) sendJson(res, e.status || 500, { error: e.status ? e.message : 'Internal server error' });
    else if (!res.writableEnded) res.end();
  }
}
