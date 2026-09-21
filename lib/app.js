import crypto from 'node:crypto';
import { waitUntil, getDeadline } from '@vercel/functions';
import { query, ensureSchema, dbKind } from './db.js';
import { llmConfig, connectionConfig, runAgentTurn, agentSummary, styleProblem } from './agent.js';
import { listStyles, resolveStyle, findStyle } from './styles.js';
import { proxyAuth, currentUser, getProfile, saveProfile, authBaseUrl } from './auth.js';
import { loadKnowledge } from './knowledge.js';

const MAX_BODY = 1024 * 1024;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const NEW_TITLE = 'New chat';
const FUNCTION_PATHS = new Set(['/api', '/api/', '/api/handler', '/api/handler.js']);
const DEADLINE_MARGIN_MS = 8000;

// Where a course file can be read in the browser. On Vercel the repo and branch come from the
// deployment's own git metadata; the constant is only the fallback for a local run of this repo.
const DEFAULT_SOURCE_REPO = 'Thermodynamics-AI-Tutor-Capstone/example-mock-tutor';

let keyResolver = () => {
  const key = (process.env[llmConfig().apiKeyEnvVar] || '').trim();
  return key ? { key, source: 'env' } : { key: null, source: null };
};

export function configure({ resolveKey } = {}) {
  if (typeof resolveKey === 'function') keyResolver = resolveKey;
}

// A key is available for a connection's env var if it is set, or — for the default connection
// locally — if server.js resolved one from .env or the opencode store.
function hasKey(envVar) {
  if ((process.env[envVar] || '').trim()) return true;
  return envVar === llmConfig().apiKeyEnvVar && Boolean(keyResolver().key);
}

function keyFor(envVar) {
  const fromEnv = (process.env[envVar] || '').trim();
  if (fromEnv) return fromEnv;
  return envVar === llmConfig().apiKeyEnvVar ? keyResolver().key : null;
}

const checkStyle = (style) => styleProblem(style, hasKey);

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

function apiQuery(rawUrl) {
  try {
    return new URL(rawUrl || '/', 'http://localhost').searchParams;
  } catch {
    return new URLSearchParams();
  }
}

function sourceBaseUrl() {
  const override = (process.env.KB_SOURCE_BASE_URL || '').trim();
  if (override) return override.replace(/\/+$/, '');
  const owner = (process.env.VERCEL_GIT_REPO_OWNER || '').trim();
  const slug = (process.env.VERCEL_GIT_REPO_SLUG || '').trim();
  const ref = (process.env.VERCEL_GIT_COMMIT_REF || '').trim() || 'main';
  const repo = owner && slug ? `${owner}/${slug}` : DEFAULT_SOURCE_REPO;
  return `https://github.com/${repo}/blob/${encodeURIComponent(ref)}/agent/knowledge`;
}

function githubUrlFor(relPath) {
  if (typeof relPath !== 'string' || !relPath.trim()) return null;
  const segments = relPath.split('/').filter(Boolean).map(encodeURIComponent);
  return `${sourceBaseUrl()}/${segments.join('/')}`;
}

function cardSummary(card) {
  return {
    id: card.id,
    kind: card.kind,
    title: card.title,
    description: card.description,
    status: card.status,
    parent: card.parent ?? null,
    unit: card.unit ?? null,
    priority: card.priority,
  };
}

// Every id this card points at, in a stable order, so the browse UI can render "before this / next",
// the unit's equations and so on without knowing the link vocabulary.
const LINK_ORDER = [
  'prerequisites',
  'precedes',
  'equations',
  'misconceptions',
  'examples',
  'items',
  'requires_objectives',
  'derives_from',
  'specializes_to',
  'secondary_to',
];

function cardDetail(knowledge, card) {
  const visible = new Map(knowledge.studentCards().map((c) => [c.id, c]));
  const ids = [];
  for (const field of LINK_ORDER) for (const id of card.links?.[field] || []) ids.push(id);
  for (const child of knowledge.studentCards().filter((c) => c.parent === card.id)) ids.push(child.id);
  if (card.parent) ids.push(card.parent);

  const seen = new Set();
  const resolvedLinks = [];
  for (const id of ids) {
    if (seen.has(id)) continue;
    seen.add(id);
    const target = visible.get(id);
    // Unresolved ids are reported rather than hidden: a dangling link is a defect the reviewer
    // should see, not something for this endpoint to launder away.
    resolvedLinks.push({ id, title: target?.title ?? null, kind: target?.kind ?? null });
  }

  const sources = (card.sources || []).map((s) => {
    const out = { path: s.path ?? null, pages: s.pages ?? s.slides ?? null, githubUrl: s.path ? githubUrlFor(s.path) : null };
    if (s.url) out.url = s.url;
    if (s.title) out.title = s.title;
    if (s.retrieved) out.retrieved = s.retrieved;
    return out;
  });

  return {
    ...cardSummary(card),
    audience: card.audience,
    body: card.body,
    bodyTokens: card.bodyTokens,
    links: card.links,
    fields: card.extra ?? null,
    generated: card.generated ?? null,
    synthesized: Boolean(card.synthesized),
    resolvedLinks,
    sources,
  };
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
  return {
    id: row.id,
    title: row.title,
    style: row.style || null,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

function validStyleId(value) {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string' || !findStyle(value)) throw httpError(400, `Unknown style "${value}"`);
  return value;
}

function makeTitle(content) {
  const collapsed = content.replace(/\s+/g, ' ').trim();
  const chars = Array.from(collapsed);
  if (chars.length <= 50) return collapsed || NEW_TITLE;
  return chars.slice(0, 50).join('').trimEnd() + '…';
}

// Every conversation belongs to one user; another user's id behaves exactly like a missing one.
async function getConversationRow(id, userId) {
  const { rows } = await query(
    'SELECT id, title, style, created_at, updated_at FROM conversations WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  return rows[0] || null;
}

async function listConversations(userId) {
  const { rows } = await query(
    'SELECT id, title, style, created_at, updated_at FROM conversations WHERE user_id = $1 ORDER BY updated_at DESC, created_at DESC',
    [userId]
  );
  return rows.map(summary);
}

async function createConversation(userId, style = null) {
  const { rows } = await query(
    'INSERT INTO conversations (id, title, style, user_id) VALUES ($1, $2, $3, $4) RETURNING id, title, style, created_at, updated_at',
    [crypto.randomUUID(), NEW_TITLE, style, userId]
  );
  return { ...summary(rows[0]), messages: [] };
}

async function getConversation(id, userId) {
  const row = await getConversationRow(id, userId);
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
    accounts: Boolean(authBaseUrl()),
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

async function handleMessage(req, res, id, user) {
  let settle;
  const lifetime = new Promise((resolve) => {
    settle = resolve;
  });
  waitUntil(lifetime);
  try {
    await streamMessage(req, res, id, user);
  } finally {
    settle();
  }
}

async function streamMessage(req, res, id, user) {
  const convo = await getConversationRow(id, user.id);
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

  const { style, fellBack, reason } = resolveStyle(convo.style, checkStyle);
  if (fellBack) send({ type: 'status', message: `${convo.style} is unavailable (${reason}); using ${style?.name || 'the default style'}` });
  const conn = connectionConfig(style?.connection);
  const key = keyFor(conn.apiKeyEnvVar);
  if (!key) {
    finished = true;
    clearTimeout(deadlineTimer);
    const envVar = conn.apiKeyEnvVar;
    send({
      type: 'error',
      message: `No API key found. Set the ${envVar} environment variable (locally you can put ${envVar}=... in .env), then restart the server or redeploy.`,
    });
    return res.end();
  }

  let accumulated = '';
  let errorMessage = null;
  try {
    const turn = await runAgentTurn({ history, apiKey: key, signal: controller.signal, emit: send, style, conversationId: id });
    accumulated = turn.text;
    errorMessage = turn.error;
    if (turn.exception) {
      if (timedOut) errorMessage = 'The response was cut off because it reached the server time limit.';
      else if (!clientGone) errorMessage = `${conn.provider} request failed: ${turn.exception.message}`;
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

async function route(req, res, pathname, user) {
  const method = req.method;

  if (pathname === '/api/me') {
    if (method !== 'GET') return sendJson(res, 405, { error: 'Method not allowed' });
    return sendJson(res, 200, { user: { id: user.id, email: user.email, name: user.name }, profile: await getProfile(user.id) });
  }
  if (pathname === '/api/me/profile') {
    if (method !== 'PUT' && method !== 'PATCH') return sendJson(res, 405, { error: 'Method not allowed' });
    const body = await readJsonBody(req);
    const profile = await saveProfile(user, body, { validStyle: (id) => Boolean(findStyle(id)) });
    return sendJson(res, 200, { user: { id: user.id, email: user.email, name: user.name }, profile });
  }

  if (pathname === '/api/conversations') {
    if (method === 'GET') return sendJson(res, 200, await listConversations(user.id));
    if (method === 'POST') {
      const body = await readJsonBody(req);
      return sendJson(res, 201, await createConversation(user.id, validStyleId(body.style)));
    }
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  const m = pathname.match(/^\/api\/conversations\/([^/]+)(\/messages)?$/);
  if (m) {
    const id = m[1];
    if (!UUID_RE.test(id)) return sendJson(res, 404, { error: 'Conversation not found' });
    if (m[2]) {
      if (method === 'POST') return handleMessage(req, res, id, user);
      return sendJson(res, 405, { error: 'Method not allowed' });
    }
    if (method === 'GET') {
      const c = await getConversation(id, user.id);
      return c ? sendJson(res, 200, c) : sendJson(res, 404, { error: 'Conversation not found' });
    }
    if (method === 'PATCH') {
      if (!(await getConversationRow(id, user.id))) return sendJson(res, 404, { error: 'Conversation not found' });
      const body = await readJsonBody(req);
      const hasTitle = body.title !== undefined;
      const title = typeof body.title === 'string' ? body.title.replace(/\s+/g, ' ').trim() : '';
      if (hasTitle && !title) return sendJson(res, 400, { error: 'title must be a non-empty string' });
      const style = body.style !== undefined ? validStyleId(body.style) : undefined;
      if (!hasTitle && style === undefined) return sendJson(res, 400, { error: 'nothing to update (title or style)' });
      const { rows } = await query(
        `UPDATE conversations SET
           title = COALESCE($2, title),
           style = CASE WHEN $3::boolean THEN $4 ELSE style END,
           updated_at = now()
         WHERE id = $1 AND user_id = $5 RETURNING id, title, style, created_at, updated_at`,
        [id, hasTitle ? Array.from(title).slice(0, 200).join('') : null, style !== undefined, style ?? null, user.id]
      );
      return rows[0] ? sendJson(res, 200, summary(rows[0])) : sendJson(res, 404, { error: 'Conversation not found' });
    }
    if (method === 'DELETE') {
      const { rows } = await query('DELETE FROM conversations WHERE id = $1 AND user_id = $2 RETURNING id', [id, user.id]);
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
    if (pathname.startsWith('/api/auth/')) return await proxyAuth(req, res, pathname.slice('/api/auth/'.length));
    if (pathname !== '/api' && !pathname.startsWith('/api/')) return sendJson(res, 404, { error: 'Not found' });
    const user = await currentUser(req);
    if (!user) return sendJson(res, 401, { error: 'auth_required', authConfigured: Boolean(authBaseUrl()) });
    if (pathname === '/api/styles') {
      if (req.method !== 'GET') return sendJson(res, 405, { error: 'Method not allowed' });
      return sendJson(res, 200, listStyles(checkStyle));
    }
    if (pathname === '/api/knowledge') {
      if (req.method !== 'GET') return sendJson(res, 405, { error: 'Method not allowed' });
      return sendJson(res, 200, (await loadKnowledge()).publicIndex());
    }
    if (pathname === '/api/kb') {
      if (req.method !== 'GET') return sendJson(res, 405, { error: 'Method not allowed' });
      const knowledge = await loadKnowledge();
      return sendJson(res, 200, {
        l0: knowledge.l0,
        builtAt: knowledge.builtAt,
        // Additive to the KB-1 interface. The map is built from taxonomy.yml, so it looks complete
        // even when no course file has ever been uploaded; the browser needs the corpus size to say
        // so on the home view instead of presenting 44 empty stubs as a finished course.
        courseFiles: knowledge.fileCount,
        cards: knowledge.studentCards().map(cardSummary),
      });
    }
    if (pathname === '/api/kb/card') {
      if (req.method !== 'GET') return sendJson(res, 405, { error: 'Method not allowed' });
      const id = (apiQuery(req.url).get('id') || '').trim();
      if (!id) return sendJson(res, 400, { error: 'id is required' });
      const knowledge = await loadKnowledge();
      const card = knowledge.findCard(id);
      // A card the student may not see is a 404, not a 403: the existence of an instructor-only card
      // is itself not public.
      if (!card || (card.audience !== 'student' && card.audience !== 'both')) {
        return sendJson(res, 404, { error: `No card with id \"${id}\"` });
      }
      return sendJson(res, 200, cardDetail(knowledge, card));
    }
    try {
      await ensureSchema();
    } catch (e) {
      console.error('Database unavailable:', e.message);
      return sendJson(res, 503, { error: 'Database unavailable' });
    }
    return await route(req, res, pathname, user);
  } catch (e) {
    console.error('Request error:', e.message);
    if (!res.headersSent) sendJson(res, e.status || 500, { error: e.status ? e.message : 'Internal server error' });
    else if (!res.writableEnded) res.end();
  }
}
