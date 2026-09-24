import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { query } from './db.js';
import { loadStudentModel } from './student-model.js';
import { studentDocument } from './learning.js';
import { loadKnowledge } from './knowledge.js';

// The read-only admin dashboard's data (/admin, public/admin.js). Everything here is anonymized:
// students are "Student N" with a hashed key, never a name or an email. Admins' own accounts are left
// out of every number. Deleted chats and deactivated accounts are included and marked. A population
// filter splits students into real and eval (every account Claude plays a student in: the simulated
// students test1–10, the eval account, and synthetic eval users). Nothing here writes.

const APP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EVAL_RESULTS_DIR = path.join(APP_DIR, 'eval', 'results');
export const GROUPS = ['all', 'real', 'eval'];
// Time windows for the activity chart and the misconceptions tab. Six months is bucketed by week.
export const RANGES = {
  '7d': { label: 'Last 7 days', unit: 'day', back: '6 days', since: '7 days' },
  '30d': { label: 'Last 30 days', unit: 'day', back: '29 days', since: '30 days' },
  '6m': { label: 'Last 6 months', unit: 'week', back: '6 months', since: '6 months' },
};

function rangeOf(range) {
  const r = RANGES[range || '30d'];
  if (!r) throw httpError(400, `range must be one of ${Object.keys(RANGES).join(', ')}`);
  return r;
}

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

const num = (x) => (x === null || x === undefined ? 0 : Number(x));
const keyOf = (userId) => crypto.createHash('sha256').update(`kelvin-admin:${userId}`).digest('hex').slice(0, 10);

export function categoryOf({ user_id: userId, email }) {
  const e = String(email || '').toLowerCase();
  if (/^test\d+@tutor\.(test|com)$/.test(e) || e.endsWith('@thermo-tutor.test') || String(userId).startsWith('eval-')) return 'eval';
  return 'real';
}

// Every non-admin student, oldest first, labelled "Student 1…N" in that order.
export async function population() {
  const { rows } = await query(
    `WITH ids AS (
       SELECT user_id FROM user_profiles
       UNION SELECT user_id FROM conversations WHERE user_id IS NOT NULL
     )
     SELECT ids.user_id, p.email, coalesce(p.is_admin, false) AS is_admin, p.deactivated_at,
            coalesce(p.created_at, (SELECT min(c.created_at) FROM conversations c WHERE c.user_id = ids.user_id)) AS created_at
       FROM ids LEFT JOIN user_profiles p ON p.user_id = ids.user_id
      ORDER BY created_at NULLS LAST, ids.user_id`
  );
  const out = [];
  for (const r of rows) {
    if (r.is_admin) continue;
    out.push({ userId: r.user_id, key: keyOf(r.user_id), label: `Student ${out.length + 1}`, category: categoryOf(r), createdAt: r.created_at, deactivated: Boolean(r.deactivated_at) });
  }
  return out;
}

async function scope(group) {
  if (!GROUPS.includes(group)) throw httpError(400, `group must be one of ${GROUPS.join(', ')}`);
  const pop = await population();
  const members = group === 'all' ? pop : pop.filter((s) => s.category === group);
  return { pop, members, ids: members.map((s) => s.userId), byId: new Map(pop.map((s) => [s.userId, s])) };
}

// ── Overview ────────────────────────────────────────────────────────────────────────────────────
export async function overview(group) {
  const { members, ids } = await scope(group);
  const [chats, msgs, styles, cost, active] = await Promise.all([
    query(`SELECT count(*) AS n, count(*) FILTER (WHERE deleted_at IS NOT NULL) AS deleted FROM conversations WHERE user_id = ANY($1::text[])`, [ids]),
    query(
      `SELECT count(*) FILTER (WHERE m.role = 'user') AS student, count(*) FILTER (WHERE m.role = 'assistant') AS tutor
         FROM messages m JOIN conversations c ON c.id = m.conversation_id WHERE c.user_id = ANY($1::text[])`,
      [ids]
    ),
    query(`SELECT coalesce(routed_style, 'none') AS style, count(*) AS n FROM turn_decisions WHERE user_id = ANY($1::text[]) GROUP BY 1 ORDER BY 2 DESC`, [ids]),
    query(`SELECT coalesce(sum(cost_usd), 0) AS usd FROM model_usage WHERE user_id = ANY($1::text[]) AND at > now() - interval '30 days'`, [ids]).catch(() => ({ rows: [{ usd: 0 }] })),
    query(
      `SELECT count(DISTINCT c.user_id) AS n FROM messages m JOIN conversations c ON c.id = m.conversation_id
        WHERE c.user_id = ANY($1::text[]) AND m.role = 'user' AND m.created_at > now() - interval '7 days'`,
      [ids]
    ),
  ]);
  const byCategory = { real: 0, eval: 0 };
  for (const s of members) byCategory[s.category] += 1;
  const chatCount = num(chats.rows[0].n);
  return {
    kpis: {
      students: members.length,
      byCategory,
      deactivated: members.filter((s) => s.deactivated).length,
      activeLast7Days: num(active.rows[0].n),
      chats: chatCount,
      deletedChats: num(chats.rows[0].deleted),
      studentMessages: num(msgs.rows[0].student),
      tutorReplies: num(msgs.rows[0].tutor),
      messagesPerChat: chatCount ? Math.round((num(msgs.rows[0].student) / chatCount) * 10) / 10 : 0,
      costLast30Days: Math.round(num(cost.rows[0].usd) * 100) / 100,
    },
    styles: styles.rows.map((r) => ({ style: r.style, n: num(r.n) })),
  };
}

// Everything the Overview charts plot over time, for one window: day buckets (week buckets for six
// months), with empty buckets kept so the axis always spans the whole window. Per bucket:
// - students: total signed up by the end of the bucket (cumulative), by kind of account
// - active: students who sent at least one message, by kind
// - newStudents, chats (new chats), messages (student messages): counts by kind
// - cost: model spend by provider. With group "all" it includes calls with no student (offline
//   scripts, the knowledge-base pipeline), as the Cost & usage tab does.
export async function activity(group, range) {
  const r = rangeOf(range);
  const { members, ids, byId } = await scope(group);
  const costWhere = group === 'all' ? '(user_id = ANY($1::text[]) OR user_id IS NULL)' : 'user_id = ANY($1::text[])';
  const created = members.filter((m) => m.createdAt);
  const [buckets, msgs, chats, joined, cost] = await Promise.all([
    query(
      `SELECT to_char(b, 'YYYY-MM-DD') AS bucket, b AS starts
         FROM generate_series(date_trunc($1, now() - $2::interval), date_trunc($1, now()), ('1 ' || $1)::interval) AS b`,
      [r.unit, r.back]
    ),
    query(
      `SELECT to_char(date_trunc($2, m.created_at), 'YYYY-MM-DD') AS bucket, c.user_id, count(*) AS n
         FROM messages m JOIN conversations c ON c.id = m.conversation_id
        WHERE c.user_id = ANY($1::text[]) AND m.role = 'user' AND m.created_at >= date_trunc($2, now() - $3::interval)
        GROUP BY 1, 2`,
      [ids, r.unit, r.back]
    ),
    query(
      `SELECT to_char(date_trunc($2, created_at), 'YYYY-MM-DD') AS bucket, user_id, count(*) AS n
         FROM conversations
        WHERE user_id = ANY($1::text[]) AND created_at >= date_trunc($2, now() - $3::interval)
        GROUP BY 1, 2`,
      [ids, r.unit, r.back]
    ),
    query(
      `SELECT to_char(date_trunc($1, t.at), 'YYYY-MM-DD') AS bucket, t.category, count(*) AS n
         FROM unnest($2::timestamptz[], $3::text[]) AS t(at, category)
        WHERE t.at >= date_trunc($1, now() - $4::interval)
        GROUP BY 1, 2`,
      [r.unit, created.map((m) => new Date(m.createdAt).toISOString()), created.map((m) => m.category), r.back]
    ),
    query(
      `SELECT to_char(date_trunc($2, at), 'YYYY-MM-DD') AS bucket, provider, coalesce(sum(cost_usd), 0) AS usd
         FROM model_usage
        WHERE ${costWhere} AND at >= date_trunc($2, now() - $3::interval)
        GROUP BY 1, 2`,
      [ids, r.unit, r.back]
    ).catch(() => ({ rows: [] })),
  ]);
  const kinds = () => ({ real: 0, eval: 0 });
  const out = new Map(
    buckets.rows.map((b) => [b.bucket, { bucket: b.bucket, students: kinds(), active: kinds(), newStudents: kinds(), chats: kinds(), messages: kinds(), cost: { deepseek: 0, openrouter: 0 } }])
  );
  const kindOf = (userId) => byId.get(userId)?.category || 'real';
  const activeInWindow = new Set();
  for (const m of msgs.rows) {
    const row = out.get(m.bucket);
    if (!row) continue;
    row.messages[kindOf(m.user_id)] += num(m.n);
    row.active[kindOf(m.user_id)] += 1;
    activeInWindow.add(m.user_id);
  }
  for (const c of chats.rows) {
    const row = out.get(c.bucket);
    if (row) row.chats[kindOf(c.user_id)] += num(c.n);
  }
  for (const j of joined.rows) {
    const row = out.get(j.bucket);
    if (row && j.category in row.newStudents) row.newStudents[j.category] += num(j.n);
  }
  for (const c of cost.rows) {
    const row = out.get(c.bucket);
    if (row) row.cost[c.provider === 'openrouter' ? 'openrouter' : 'deepseek'] += num(c.usd);
  }
  // Running total of students: everyone who joined before the window, then each bucket's sign-ups.
  const windowStart = buckets.rows.length ? new Date(buckets.rows[0].starts) : new Date();
  const total = kinds();
  for (const m of members) if (!m.createdAt || new Date(m.createdAt) < windowStart) total[m.category] += 1;
  const list = [...out.values()];
  for (const row of list) {
    for (const k of Object.keys(total)) total[k] += row.newStudents[k];
    row.students = { ...total };
    row.cost = { deepseek: Math.round(row.cost.deepseek * 10000) / 10000, openrouter: Math.round(row.cost.openrouter * 10000) / 10000 };
  }
  const sum = (key) => list.reduce((n, b) => n + b[key].real + b[key].eval, 0);
  return {
    range: range || '30d',
    label: r.label,
    unit: r.unit,
    totals: {
      students: members.length,
      deactivated: members.filter((m) => m.deactivated).length,
      newStudents: sum('newStudents'),
      activeStudents: activeInWindow.size,
      chats: sum('chats'),
      messages: sum('messages'),
      cost: Math.round(list.reduce((n, b) => n + b.cost.deepseek + b.cost.openrouter, 0) * 100) / 100,
    },
    buckets: list,
  };
}

// ── Students ────────────────────────────────────────────────────────────────────────────────────
export async function students(group) {
  const { members, ids } = await scope(group);
  const { rows } = await query(
    `SELECT c.user_id, count(DISTINCT c.id) AS chats, count(DISTINCT c.id) FILTER (WHERE c.deleted_at IS NOT NULL) AS deleted_chats,
            count(m.id) FILTER (WHERE m.role = 'user') AS messages, max(m.created_at) AS last_active
       FROM conversations c LEFT JOIN messages m ON m.conversation_id = c.id
      WHERE c.user_id = ANY($1::text[]) GROUP BY c.user_id`,
    [ids]
  );
  const stats = new Map(rows.map((r) => [r.user_id, r]));
  const list = [];
  for (const s of members) {
    const st = stats.get(s.userId) || {};
    const model = await loadStudentModel(s.userId).catch(() => null);
    const miscs = Object.values(model?.misconceptions || {});
    list.push({
      key: s.key,
      label: s.label,
      category: s.category,
      createdAt: s.createdAt,
      deactivated: s.deactivated,
      chats: num(st.chats),
      deletedChats: num(st.deleted_chats),
      messages: num(st.messages),
      lastActive: st.last_active || null,
      openMisconceptions: miscs.filter((m) => m.status !== 'repaired').length,
      fixedMisconceptions: miscs.filter((m) => m.status === 'repaired').length,
      notes: (model?.hypotheses || []).length,
    });
  }
  return { students: list };
}

async function titlesFor(refs) {
  const knowledge = await loadKnowledge().catch(() => null);
  const out = {};
  for (const ref of refs) {
    const card = knowledge?.findCard?.(ref);
    if (card?.title) out[ref] = card.title;
  }
  return out;
}

export async function student(key) {
  const pop = await population();
  const s = pop.find((x) => x.key === key);
  if (!s) throw httpError(404, 'No such student.');
  const model = await loadStudentModel(s.userId);
  const refs = [...Object.keys(model.misconceptions || {}), ...Object.keys(model.kcs || {}), ...(model.hypotheses || []).map((h) => h.about)];
  const titles = await titlesFor([...new Set(refs)]);
  const { rows } = await query(
    `SELECT c.id, c.title, c.style, c.created_at, c.updated_at, c.deleted_at IS NOT NULL AS deleted,
            (SELECT count(*) FROM messages m WHERE m.conversation_id = c.id AND m.role = 'user') AS messages
       FROM conversations c WHERE c.user_id = $1 ORDER BY c.updated_at DESC`,
    [s.userId]
  );
  return {
    key: s.key,
    label: s.label,
    category: s.category,
    createdAt: s.createdAt,
    deactivated: s.deactivated,
    document: studentDocument(model, titles),
    conversations: rows.map((r) => ({ id: r.id, title: r.title, style: r.style, createdAt: r.created_at, updatedAt: r.updated_at, deleted: r.deleted, messages: num(r.messages) })),
  };
}

// ── Conversations ───────────────────────────────────────────────────────────────────────────────
export async function conversations(group) {
  const { ids, byId } = await scope(group);
  const { rows } = await query(
    `SELECT c.id, c.user_id, c.title, c.style, c.created_at, c.updated_at, c.deleted_at IS NOT NULL AS deleted,
            count(m.id) FILTER (WHERE m.role = 'user') AS messages
       FROM conversations c LEFT JOIN messages m ON m.conversation_id = c.id
      WHERE c.user_id = ANY($1::text[]) GROUP BY c.id ORDER BY c.updated_at DESC LIMIT 1000`,
    [ids]
  );
  return {
    conversations: rows.map((r) => {
      const s = byId.get(r.user_id);
      return { id: r.id, student: s?.label, studentKey: s?.key, category: s?.category, title: r.title, style: r.style, createdAt: r.created_at, updatedAt: r.updated_at, deleted: r.deleted, messages: num(r.messages) };
    }),
  };
}

export async function conversation(id) {
  if (!/^[0-9a-f-]{36}$/i.test(String(id))) throw httpError(404, 'No such conversation.');
  const { byId } = await scope('all');
  const { rows } = await query('SELECT id, user_id, title, style, created_at, deleted_at FROM conversations WHERE id = $1', [id]);
  const c = rows[0];
  const s = c && byId.get(c.user_id);
  if (!c || !s) throw httpError(404, 'No such conversation.');
  const [msgs, decisions, refs, usage] = await Promise.all([
    query('SELECT id, role, content, created_at FROM messages WHERE conversation_id = $1 ORDER BY id', [id]),
    query('SELECT message_id, provider, routed_style, read, policy, audit, latency_ms FROM turn_decisions WHERE conversation_id = $1 ORDER BY id', [id]),
    query('SELECT ok, error, solution, latency_ms, created_at FROM reference_solutions WHERE conversation_id = $1 ORDER BY id', [id]).catch(() => ({ rows: [] })),
    query('SELECT provider, purpose, count(*) AS calls, coalesce(sum(cost_usd), 0) AS usd FROM model_usage WHERE conversation_id = $1 GROUP BY 1, 2', [id]).catch(() => ({ rows: [] })),
  ]);
  const parse = (v) => (typeof v === 'string' ? JSON.parse(v) : v);
  const byMessage = new Map(decisions.rows.map((d) => [Number(d.message_id), d]));
  return {
    id: c.id,
    student: s.label,
    studentKey: s.key,
    category: s.category,
    title: c.title,
    style: c.style,
    deleted: Boolean(c.deleted_at),
    messages: msgs.rows.map((m) => {
      const d = byMessage.get(Number(m.id));
      const read = d ? parse(d.read) || {} : null;
      const policy = d ? parse(d.policy) || {} : null;
      const audit = d ? parse(d.audit) : null;
      return {
        role: m.role,
        content: m.content,
        at: m.created_at,
        decision: d
          ? {
              reader: d.provider,
              style: d.routed_style,
              intent: read?.intent?.label || null,
              misconceptions: (read?.misconceptions || []).filter((x) => x.p >= 0.5).map((x) => ({ id: x.id, title: x.title, p: x.p })),
              ceiling: policy?.ceiling ?? null,
              tools: policy?.tools || [],
              auditFlags: audit?.flags || [],
            }
          : null,
      };
    }),
    referenceSolutions: refs.rows.map((r) => ({ ok: r.ok, error: r.error, latencyMs: r.latency_ms, at: r.created_at, answers: parse(r.solution)?.answers || [] })),
    cost: usage.rows.map((r) => ({ provider: r.provider, purpose: r.purpose, calls: num(r.calls), usd: Math.round(num(r.usd) * 10000) / 10000 })),
  };
}

// ── Misconceptions ──────────────────────────────────────────────────────────────────────────────
export async function misconceptions(group, range) {
  const r = rangeOf(range);
  const { ids } = await scope(group);
  const { rows } = await query(
    `SELECT ref,
            count(DISTINCT user_id) FILTER (WHERE kind IN ('misconception_signal', 'misconception_confirmed') AND (kind <> 'misconception_signal' OR probability >= 0.6)) AS students,
            count(*) FILTER (WHERE kind = 'misconception_signal' AND probability >= 0.6) AS signals,
            count(*) FILTER (WHERE kind = 'misconception_confirmed') AS confirmed,
            count(*) FILTER (WHERE kind = 'misconception_repaired') AS repaired,
            count(*) FILTER (WHERE kind = 'misconception_dismissed') AS dismissed
       FROM student_evidence
      WHERE user_id = ANY($1::text[]) AND ref LIKE 'misc:%' AND created_at >= now() - $2::interval
      GROUP BY ref ORDER BY 2 DESC, 3 DESC`,
    [ids, r.since]
  );
  const titles = await titlesFor(rows.map((r) => r.ref));
  return {
    range: range || '30d',
    misconceptions: rows.map((m) => ({
      ref: m.ref,
      title: titles[m.ref] || m.ref,
      students: num(m.students),
      signals: num(m.signals),
      confirmed: num(m.confirmed),
      repaired: num(m.repaired),
      dismissed: num(m.dismissed),
    })),
  };
}

// ── Tutoring decisions ──────────────────────────────────────────────────────────────────────────
export async function tutoring(group) {
  const { ids } = await scope(group);
  const { rows } = await query(
    `SELECT provider, routed_style, policy, audit, latency_ms FROM turn_decisions WHERE user_id = ANY($1::text[])`,
    [ids]
  );
  const parse = (v) => (typeof v === 'string' ? JSON.parse(v) : v);
  const count = (arr) => arr.reduce((m, k) => ((m[k] = (m[k] || 0) + 1), m), {});
  const readers = [];
  const styles = [];
  const ceilings = [];
  const flags = [];
  const tools = [];
  const latencies = [];
  let audited = 0;
  for (const r of rows) {
    readers.push(r.provider === 'llm' ? 'DeepSeek backup' : r.provider === 'jev' ? 'Jev' : r.provider === 'heuristic' ? 'Keyword rules' : r.provider);
    styles.push(r.routed_style || 'none');
    const policy = parse(r.policy) || {};
    if (Number.isFinite(policy.ceiling)) ceilings.push(String(policy.ceiling));
    for (const t of policy.tools || []) tools.push(t);
    const audit = parse(r.audit);
    if (audit && !audit.error) {
      audited += 1;
      for (const f of audit.flags || []) flags.push(f);
    }
    if (Number.isFinite(r.latency_ms)) latencies.push(r.latency_ms);
  }
  latencies.sort((a, b) => a - b);
  const toList = (m) => Object.entries(m).map(([k, n]) => ({ k, n })).sort((a, b) => b.n - a.n);
  return {
    turns: rows.length,
    audited,
    readers: toList(count(readers)),
    styles: toList(count(styles)),
    ceilings: toList(count(ceilings)).sort((a, b) => Number(a.k) - Number(b.k)),
    auditFlags: toList(count(flags)),
    tools: toList(count(tools)),
    readLatencyMedianMs: latencies.length ? latencies[Math.floor(latencies.length / 2)] : null,
  };
}

// ── Cost and usage ──────────────────────────────────────────────────────────────────────────────
export async function usage(group) {
  const { ids } = await scope(group);
  // Rows with no user (the KB pipeline, offline scripts) only count in "all".
  const where = group === 'all' ? '(user_id = ANY($1::text[]) OR user_id IS NULL)' : 'user_id = ANY($1::text[])';
  const [days, purposes, totals] = await Promise.all([
    query(`SELECT to_char(date_trunc('day', at), 'YYYY-MM-DD') AS day, provider, coalesce(sum(cost_usd), 0) AS usd, count(*) AS calls FROM model_usage WHERE ${where} GROUP BY 1, 2 ORDER BY 1`, [ids]),
    query(
      `SELECT provider, coalesce(model, '?') AS model, purpose, count(*) AS calls, coalesce(sum(cost_usd), 0) AS usd,
              coalesce(sum(prompt_tokens), 0) AS prompt_tokens, coalesce(sum(cached_tokens), 0) AS cached_tokens, coalesce(sum(completion_tokens), 0) AS completion_tokens,
              percentile_cont(0.5) WITHIN GROUP (ORDER BY latency_ms) AS median_ms
         FROM model_usage WHERE ${where} GROUP BY 1, 2, 3 ORDER BY usd DESC`,
      [ids]
    ),
    query(
      `SELECT coalesce(sum(cost_usd), 0) AS usd, count(*) AS calls, count(*) FILTER (WHERE NOT ok) AS failed,
              coalesce(sum(prompt_tokens), 0) AS prompt_tokens, coalesce(sum(cached_tokens), 0) AS cached_tokens
         FROM model_usage WHERE ${where}`,
      [ids]
    ),
  ]).catch(() => [{ rows: [] }, { rows: [] }, { rows: [{}] }]);
  const t = totals.rows[0] || {};
  const perDay = {};
  for (const r of days.rows) {
    perDay[r.day] ||= { deepseek: 0, openrouter: 0 };
    perDay[r.day][r.provider === 'openrouter' ? 'openrouter' : 'deepseek'] += num(r.usd);
  }
  return {
    totals: {
      usd: Math.round(num(t.usd) * 100) / 100,
      calls: num(t.calls),
      failed: num(t.failed),
      cacheHitRate: num(t.prompt_tokens) ? Math.round((num(t.cached_tokens) / num(t.prompt_tokens)) * 1000) / 10 : null,
    },
    perDay: Object.entries(perDay).map(([day, v]) => ({ day, deepseek: Math.round(v.deepseek * 10000) / 10000, openrouter: Math.round(v.openrouter * 10000) / 10000 })),
    byPurpose: purposes.rows.map((r) => ({
      provider: r.provider,
      model: r.model,
      purpose: r.purpose,
      calls: num(r.calls),
      usd: Math.round(num(r.usd) * 10000) / 10000,
      promptTokens: num(r.prompt_tokens),
      cachedTokens: num(r.cached_tokens),
      completionTokens: num(r.completion_tokens),
      medianMs: r.median_ms === null ? null : Math.round(num(r.median_ms)),
    })),
  };
}

// ── Evals: committed result files (eval/results/*.json, written by scripts/eval/export-results.mjs) ─
export function evalRuns() {
  let files = [];
  try {
    files = fs.readdirSync(EVAL_RESULTS_DIR).filter((f) => f.endsWith('.json'));
  } catch {}
  const runs = [];
  for (const f of files) {
    try {
      const r = JSON.parse(fs.readFileSync(path.join(EVAL_RESULTS_DIR, f), 'utf8'));
      runs.push({ id: r.id, label: r.label, date: r.date, summary: r.summary, harness: r.harness, findings: r.findings, cost: r.cost, latency: r.latency, counts: r.counts });
    } catch {}
  }
  return { runs: runs.sort((a, b) => String(a.date).localeCompare(String(b.date)) || String(a.id).localeCompare(String(b.id))) };
}

export function evalRun(id) {
  const file = path.join(EVAL_RESULTS_DIR, `${String(id).replace(/[^a-z0-9._-]/gi, '')}.json`);
  if (!fs.existsSync(file)) throw httpError(404, 'No such eval run.');
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}
