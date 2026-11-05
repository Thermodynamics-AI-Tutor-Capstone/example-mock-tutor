import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { mcpAuthRouter, getOAuthProtectedResourceMetadataUrl } from '@modelcontextprotocol/sdk/server/auth/router.js';
import { requireBearerAuth } from '@modelcontextprotocol/sdk/server/auth/middleware/bearerAuth.js';
import { z } from 'zod';
import { loadContent, metadata, provenance, searchCards } from './content.mjs';
import { addEvent, allEvents, authenticate, trends } from './store.mjs';
import { classify } from './classify.mjs';
import { writeRequestLog } from './request-log.mjs';
import { accountById, completeLogin, createOAuthProvider, loginPage, setSharing, sharedStudents } from './oauth.mjs';

const { cards, skills } = loadContent();
const port = Number(process.env.PORT || 3337);
const origin = process.env.KELVIN_PUBLIC_ORIGIN || 'https://mac.tailfb765c.ts.net:8443';
const resourceUrl = new URL('/mcp/account', origin);
const dashboardResourceUrl = new URL('/dashboard-data', origin);
const dashboardOrigin = process.env.KELVIN_DASHBOARD_ORIGIN || 'https://kelvin-professor-dashboard.vercel.app';
const oauth = createOAuthProvider(resourceUrl, origin, [dashboardResourceUrl]);
const result = value => ({ content: [{ type: 'text', text: JSON.stringify(value) }] });
const error = message => ({ content: [{ type: 'text', text: message }], isError: true });

function makeMcp(user) {
  const mcp = new McpServer({ name: 'kelvin-thermodynamics-me300', title: 'Kelvin: Penn State ME 300 Engineering Thermodynamics', version: '0.1.0' }, {
    capabilities: { tools: {} },
    instructions: 'Kelvin provides real Penn State ME 300 Engineering Thermodynamics course content from Dr. Jacqueline O’Connor’s Summer 2023 Canvas section. Use it as the course reference for substantive thermodynamics questions: call course_map once per conversation, then search_course and get_card for the relevant topic or misconception before answering. Use teaching skills when they fit the task. For dates, grading, and policies, identify the Summer 2023 term and check the student’s current Canvas section. Do not save a learning reflection unless the student explicitly asks.'
  });
  const publicSecurity = user.role === 'anonymous' ? { _meta: { securitySchemes: [{ type: 'noauth' }] } } : {};
  if (user.role !== 'anonymous') mcp.registerTool('my_account', { description: 'Show the Kelvin account and role attached to this authenticated connector.' },
    () => result({ id: user.id, name: user.name || null, role: user.role,
      shareWithInstructor: user.role === 'student' ? Boolean(accountById(user.id)?.shareWithInstructor) : undefined }));
  mcp.registerTool('course_map', { title: 'ME 300 thermodynamics course map', description: 'For thermodynamics questions, start here once per conversation. This is real Penn State ME 300 Engineering Thermodynamics course content: systems, properties, phase change, first and second laws, entropy, control volumes, and cycles. Returns the course map so you can choose the right topic card. Course logistics are from Summer 2023; current dates and policies come from the student’s Canvas.', ...publicSecurity }, () =>
    result({ subject: 'Penn State ME 300 Engineering Thermodynamics', sourceMaterial: 'actual Penn State course files', use: 'For a thermodynamics topic, search_course for matching cards, then get_card before explaining or tutoring. Check current Canvas for dates and policies.', provenance, course: metadata(cards.get('course:me300')),
      units: [...cards.values()].filter(c => c.kind === 'unit').map(metadata) }));
  mcp.registerTool('search_course', { title: 'Search thermodynamics topics and misconceptions', description: 'Use this for each substantive thermodynamics or ME 300 question to find the relevant course topic, concept, equation context, or common misconception. Search terms such as entropy, vapor tables, first law, turbines, refrigeration, or Carnot. Returns brief metadata; call get_card on the matching ID for the actual content before answering.', ...publicSecurity,
    inputSchema: { query: z.string().max(160), kind: z.enum(['course', 'unit', 'topic', 'misconception']).optional() } },
  ({ query, kind }) => result({ provenance, matches: searchCards(cards, query, kind) }));
  mcp.registerTool('get_card', { title: 'Read a thermodynamics course card', description: 'After search_course, read the exact Penn State ME 300 Engineering Thermodynamics topic or misconception card before explaining the concept or guiding a problem. Topic cards draw on real course files; misconception cards draw on cited research. The card status describes how the study note was prepared, not whether the course is real. Summer 2023 dates and policies may differ from the student’s current section.', ...publicSecurity,
    inputSchema: { id: z.string().max(120) } }, ({ id }) => {
      const card = cards.get(id);
      if (!card) return error('Card not found or not available to students');
      return result({ provenance, ...metadata(card), objectives: card.objectives || [],
        related: { misconceptions: card.misconceptions || [], topics: card.topics || [], equations: card.equations || [] },
        sources: card.sources || [], content: card.body.slice(0, 16000) });
    });
  mcp.registerTool('list_teaching_skills', { title: 'Thermodynamics tutoring approaches', description: 'When tutoring a thermodynamics problem, list the available ME 300 teaching approaches, including property-table work, control-volume energy balances, next-step hints, and misconception repair. Then load the useful one with get_teaching_skill.', ...publicSecurity }, () =>
    result([...skills].map(([name, s]) => ({ name, description: s.description }))));
  mcp.registerTool('get_teaching_skill', { title: 'Read a thermodynamics tutoring approach', description: 'Read a named ME 300 thermodynamics tutoring procedure when helping with property tables, control-volume energy balances, step-by-step reasoning, or a misconception. Call list_teaching_skills first to choose a valid name.', ...publicSecurity,
    inputSchema: { name: z.string().max(80) } }, ({ name }) => {
      const skill = skills.get(name);
      return skill ? result({ name, description: skill.description, content: skill.body }) : error('Skill not found');
    });
  if (user.role === 'student') {
    if (accountById(user.id)) mcp.registerTool('share_with_instructor', { description: 'Set whether the course instructor may see your saved learning reflections under your name. This can be changed anytime.',
      inputSchema: { enabled: z.boolean() } }, ({ enabled }) => result({ shareWithInstructor: setSharing(user.id, enabled) }));
    mcp.registerTool('record_learning', { description: 'Save a short learning reflection and classify its topics with DeepSeek. Only call after the student explicitly asks to save what they worked on. Misconception labels are tentative, not diagnoses.',
      inputSchema: { statement: z.string().min(10).max(1000), consent: z.literal(true) } }, async ({ statement }) => {
        try {
          const labels = await classify(statement, cards);
          addEvent({ studentId: user.id, statement, ...labels, classificationStatus: 'classified' });
          return result({ saved: true, classificationStatus: 'classified', ...labels, note: 'Misconception labels are hypotheses. You can correct them or ask the operator to delete this record.' });
        } catch (e) {
          console.error('Learning classification unavailable:', e.message);
          addEvent({ studentId: user.id, statement, topics: [], misconceptions: [], summary: '', classificationStatus: 'pending' });
          return result({ saved: true, classificationStatus: 'pending', note: 'Your reflection was saved. Topic classification is pending; no misconception was inferred.' });
        }
      });
    mcp.registerTool('my_learning', { description: 'Show the authenticated student their saved learning reflections. Only records explicitly saved through this MCP are available.' }, () => {
      const own = allEvents().filter(e => e.studentId === user.id);
      return result({ total: own.length, recent: own.slice(-20).reverse().map(({ studentId, ...e }) => e) });
    });
  }
  if (user.role === 'instructor') {
    mcp.registerTool('course_trends', { description: 'Instructor-only aggregate trends from students who explicitly saved learning reflections. At least five distinct students are required; no identities or statements are returned.' },
      () => result(trends()));
    if (accountById(user.id)) {
      mcp.registerTool('shared_students', { description: 'List students who explicitly allowed this course instructor to see their named learning reflections.' },
        () => result(sharedStudents()));
      mcp.registerTool('student_learning', { description: 'Read saved learning reflections for one student who explicitly enabled instructor sharing.',
        inputSchema: { student_id: z.string().max(80) } }, ({ student_id }) => {
          const student = sharedStudents().find(s => s.id === student_id);
          if (!student) return error('Student has not enabled instructor sharing');
          const own = allEvents().filter(e => e.studentId === student_id);
          const records = own.slice(-20).reverse()
            .map(({ studentId, ...event }) => event);
          return result({ student, total: own.length, recent: records });
        });
    }
  }
  return mcp;
}

async function handleMcp(req, res, user) {
  if (Number(req.headers['content-length'] || 0) > 32768) {
    res.writeHead(413); res.end('Request too large'); return;
  }
  const mcp = makeMcp(user);
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
  try {
    await mcp.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (e) {
    console.error('MCP request failed:', e.message);
    if (!res.headersSent) { res.writeHead(500); res.end('MCP request failed'); }
  } finally {
    await transport.close();
    await mcp.close();
  }
}

const app = express();
app.set('trust proxy', 'loopback');
app.use((req, res, next) => {
  const started = Date.now();
  const requestId = /^[a-f0-9-]{36}$/.test(String(req.headers['x-kelvin-request-id'] || ''))
    ? String(req.headers['x-kelvin-request-id']) : randomUUID();
  res.set('X-Kelvin-Request-Id', requestId);
  let logged = false;
  const log = outcome => {
    if (logged) return;
    logged = true;
    const body = req.body && typeof req.body === 'object' ? req.body : null;
    writeRequestLog({ event: 'request', at: new Date().toISOString(), requestId,
      method: req.method, path: req.path, status: res.statusCode, outcome, durationMs: Date.now() - started,
      remoteIp: req.socket.remoteAddress, gatewayClientIp: req.headers['x-kelvin-client-ip'] || null,
      userAgent: String(req.headers['user-agent'] || '').slice(0, 300), contentLength: Number(req.headers['content-length'] || 0),
      accountId: req.auth?.extra?.accountId || null,
      rpcMethod: typeof body?.method === 'string' ? body.method : null,
      tool: body?.method === 'tools/call' && typeof body.params?.name === 'string' ? body.params.name : null,
      loginAction: req.path === '/login' && ['create', 'sign-in'].includes(body?.action) ? body.action : null });
  };
  res.once('finish', () => log('finished'));
  res.once('close', () => log('closed'));
  next();
});
app.use(['/mcp', '/mcp/account'], express.json({ limit: '32kb', type: 'application/json' }));
app.get('/health', (_req, res) => res.json({ ok: true, service: 'kelvin-mcp', cards: cards.size }));
app.use(mcpAuthRouter({ provider: oauth, issuerUrl: new URL(origin), resourceServerUrl: resourceUrl,
  scopesSupported: ['mcp:tools'], resourceName: 'Kelvin: Penn State ME 300 Engineering Thermodynamics learning account' }));
app.get('/login', (req, res) => {
  const page = loginPage(req.query.request);
  res.set('Cache-Control', 'no-store');
  return page ? res.type('html').send(page) : res.status(400).send('This sign-in request expired. Start again in Claude.');
});
app.post('/login', express.urlencoded({ extended: false, limit: '8kb' }), rateLimit({ windowMs: 15 * 60_000, limit: 10 }), (req, res) => {
  const outcome = completeLogin(req.body);
  res.set('Cache-Control', 'no-store');
  if (outcome.redirect) return res.redirect(302, outcome.redirect);
  const page = loginPage(req.body.request, outcome.error);
  return page ? res.type('html').send(page) : res.status(400).send(outcome.error);
});
app.use('/dashboard-data', (req, res, next) => {
  res.set('Vary', 'Origin');
  if (req.headers.origin === dashboardOrigin) res.set('Access-Control-Allow-Origin', dashboardOrigin);
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  return next();
});
app.get('/dashboard-data', requireBearerAuth({ verifier: oauth, requiredScopes: ['mcp:tools'], expectedResource: dashboardResourceUrl }), (req, res) => {
  const account = accountById(req.auth?.extra?.accountId);
  if (account?.role !== 'instructor') return res.status(403).json({ error: 'Instructor account required' });
  const studentId = String(req.query.student_id || '');
  if (studentId) {
    const student = sharedStudents().find(s => s.id === studentId);
    if (!student) return res.status(404).json({ error: 'Student has not enabled instructor sharing' });
    const own = allEvents().filter(e => e.studentId === studentId);
    return res.json({ student, total: own.length, recent: own.slice(-20).reverse()
      .map(({ studentId: _id, ...event }) => event) });
  }
  return res.json({ instructor: { id: account.id, name: account.name }, trends: trends(), students: sharedStudents() });
});
app.all('/mcp/account', requireBearerAuth({ verifier: oauth, requiredScopes: ['mcp:tools'],
  resourceMetadataUrl: getOAuthProtectedResourceMetadataUrl(resourceUrl), expectedResource: resourceUrl }),
  (req, res) => {
    const account = accountById(req.auth?.extra?.accountId);
    if (!account) return res.status(401).json({ error: 'Account is unavailable' });
    return handleMcp(req, res, { id: account.id, name: account.name, role: account.role });
  });
app.all('/mcp', (req, res) => {
  if (req.method !== 'POST') return res.set('Allow', 'POST').status(405).json({ error: 'Use MCP Streamable HTTP POST' });
  const authorization = req.headers.authorization || '';
  const token = /^Bearer (.+)$/i.exec(authorization)?.[1];
  const user = token ? authenticate(token) : { role: 'anonymous' };
  if (authorization && (!token || !user)) return res.status(401).json({ error: 'Invalid bearer token' });
  return handleMcp(req, res, user);
});
const server = createServer(app);
server.listen(port, '127.0.0.1', () => console.log(`Kelvin MCP listening on 127.0.0.1:${port}`));
