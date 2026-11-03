import { createServer } from 'node:http';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';
import { loadContent, metadata, provenance, searchCards } from './content.mjs';
import { addEvent, allEvents, authenticate, trends } from './store.mjs';
import { classify } from './classify.mjs';

const { cards, skills } = loadContent();
const port = Number(process.env.PORT || 3337);
const result = value => ({ content: [{ type: 'text', text: JSON.stringify(value) }] });
const error = message => ({ content: [{ type: 'text', text: message }], isError: true });

function makeMcp(user) {
  const mcp = new McpServer({ name: 'kelvin-me300', version: '0.1.0' }, { capabilities: { tools: {} } });
  mcp.registerTool('course_map', { description: 'Start here for the ME 300 sample course, its module map, provenance, and review limits.' }, () =>
    result({ provenance, course: metadata(cards.get('course:me300')),
      units: [...cards.values()].filter(c => c.kind === 'unit').map(metadata) }));
  mcp.registerTool('search_course', { description: 'Find relevant ME 300 course, module, topic, or misconception card metadata. Search first, then get_card by exact ID.',
    inputSchema: { query: z.string().max(160), kind: z.enum(['course', 'unit', 'topic', 'misconception']).optional() } },
  ({ query, kind }) => result({ provenance, matches: searchCards(cards, query, kind) }));
  mcp.registerTool('get_card', { description: 'Read one exact ME 300 course, module, topic, or misconception card. Cards are from a Summer 2023 sample section and have their own review status.',
    inputSchema: { id: z.string().max(120) } }, ({ id }) => {
      const card = cards.get(id);
      if (!card) return error('Card not found or not available to students');
      return result({ provenance, ...metadata(card), objectives: card.objectives || [],
        related: { misconceptions: card.misconceptions || [], topics: card.topics || [], equations: card.equations || [] },
        sources: card.sources || [], content: card.body.slice(0, 16000) });
    });
  mcp.registerTool('list_teaching_skills', { description: 'List selected ME 300 teaching moves and procedures; load one by name only when relevant.' }, () =>
    result([...skills].map(([name, s]) => ({ name, description: s.description }))));
  mcp.registerTool('get_teaching_skill', { description: 'Load a selected teaching move or procedure when it matches the student request.',
    inputSchema: { name: z.string().max(80) } }, ({ name }) => {
      const skill = skills.get(name);
      return skill ? result({ name, description: skill.description, content: skill.body }) : error('Skill not found');
    });
  if (user.role === 'student') {
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
  }
  return mcp;
}

const server = createServer(async (req, res) => {
  const path = new URL(req.url || '/', 'http://localhost').pathname;
  if (path === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ ok: true, service: 'kelvin-mcp', cards: cards.size }));
    return;
  }
  if (path !== '/mcp' || !['POST', 'GET', 'DELETE'].includes(req.method)) {
    res.writeHead(404); res.end('Not found'); return;
  }
  const token = /^Bearer (.+)$/i.exec(req.headers.authorization || '')?.[1];
  const user = authenticate(token);
  if (!user) {
    res.writeHead(401, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ error: 'A valid student or instructor token is required' }));
    return;
  }
  if (Number(req.headers['content-length'] || 0) > 32768) {
    res.writeHead(413); res.end('Request too large'); return;
  }
  const mcp = makeMcp(user);
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
  try {
    await mcp.connect(transport);
    await transport.handleRequest(req, res);
  } catch (e) {
    console.error('MCP request failed:', e.message);
    if (!res.headersSent) { res.writeHead(500); res.end('MCP request failed'); }
  } finally {
    await transport.close();
    await mcp.close();
  }
});
server.listen(port, '127.0.0.1', () => console.log(`Kelvin MCP listening on 127.0.0.1:${port}`));
