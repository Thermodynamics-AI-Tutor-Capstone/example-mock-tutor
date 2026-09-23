import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import { attachDatabasePool } from '@vercel/functions';

const APP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_PGLITE_DIR = path.join(APP_DIR, 'data', 'pglite');
const SCHEMA_LOCK_KEY = 734001;

const SCHEMA_SQL = `
BEGIN;
SELECT pg_advisory_xact_lock(${SCHEMA_LOCK_KEY});
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY,
  title text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS messages (
  id bigserial PRIMARY KEY,
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS messages_conversation_id_id_idx ON messages (conversation_id, id);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS style text;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS user_id text;
CREATE INDEX IF NOT EXISTS conversations_user_updated_idx ON conversations (user_id, updated_at DESC);
CREATE TABLE IF NOT EXISTS attachments (
  id uuid PRIMARY KEY,
  user_id text NOT NULL,
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  message_id bigint REFERENCES messages(id) ON DELETE SET NULL,
  filename text NOT NULL,
  mime text NOT NULL,
  bytes integer NOT NULL,
  kind text NOT NULL,
  source text NOT NULL,
  status text NOT NULL,
  markdown text NOT NULL DEFAULT '',
  storage text NOT NULL,
  storage_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  confirmed_at timestamptz
);
CREATE INDEX IF NOT EXISTS attachments_conversation_idx ON attachments (conversation_id, created_at);
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id text PRIMARY KEY,
  email text,
  display_name text,
  course_number text,
  professor text,
  section text,
  semester text,
  major text,
  year text,
  default_style text,
  onboarded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS use_jev boolean;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS show_decisions boolean;
-- Nothing a student creates is ever removed: "delete" hides it from them and keeps it for the
-- capstone team (research data, and the eval). deleted_at / deactivated_at say when.
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE attachments ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS deactivated_at timestamptz;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS style_router text;
-- One row per model call (lib/usage.js). No foreign keys, so usage is never removed with anything.
CREATE TABLE IF NOT EXISTS model_usage (
  id bigserial PRIMARY KEY,
  at timestamptz NOT NULL DEFAULT now(),
  provider text NOT NULL,
  model text,
  purpose text NOT NULL,
  conversation_id uuid,
  user_id text,
  prompt_tokens integer,
  cached_tokens integer,
  completion_tokens integer,
  reasoning_tokens integer,
  cost_usd double precision,
  cost_source text,
  latency_ms integer,
  ok boolean NOT NULL DEFAULT true,
  error text,
  meta jsonb
);
CREATE INDEX IF NOT EXISTS model_usage_at_idx ON model_usage (at DESC);
CREATE INDEX IF NOT EXISTS model_usage_conversation_idx ON model_usage (conversation_id);
CREATE TABLE IF NOT EXISTS tutoring_state (
  conversation_id uuid PRIMARY KEY REFERENCES conversations(id) ON DELETE CASCADE,
  style text,
  state jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS student_evidence (
  id bigserial PRIMARY KEY,
  user_id text NOT NULL,
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  kind text NOT NULL,
  ref text NOT NULL,
  source text NOT NULL,
  probability real,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS student_evidence_user_idx ON student_evidence (user_id, created_at DESC);
CREATE TABLE IF NOT EXISTS turn_decisions (
  id bigserial PRIMARY KEY,
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id text,
  message_id bigint REFERENCES messages(id) ON DELETE SET NULL,
  provider text NOT NULL,
  model text,
  latency_ms integer,
  cost_usd double precision,
  read jsonb NOT NULL DEFAULT '{}'::jsonb,
  routed_style text,
  auto_routed boolean NOT NULL DEFAULT false,
  policy jsonb NOT NULL DEFAULT '{}'::jsonb,
  audit jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS turn_decisions_conversation_idx ON turn_decisions (conversation_id, id);
COMMIT;
`;

export function databaseUrl() {
  const url = (process.env.DATABASE_URL || process.env.POSTGRES_URL || '').trim();
  return url || null;
}

export function dbKind() {
  return databaseUrl() ? 'postgres' : 'pglite';
}

function sslOption(connectionString) {
  let u;
  try {
    u = new URL(connectionString);
  } catch {
    return undefined;
  }
  const p = u.searchParams;
  if (['ssl', 'sslmode', 'sslcert', 'sslkey', 'sslrootcert', 'sslnegotiation'].some((k) => p.has(k))) return undefined;
  const host = u.hostname.replace(/^\[|\]$/g, '');
  if (!host || p.has('host') || host === 'localhost' || host === '127.0.0.1' || host === '::1') return false;
  return true;
}

function createPgBackend(connectionString) {
  const options = {
    connectionString,
    max: 5,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 10000,
  };
  const ssl = sslOption(connectionString);
  if (ssl !== undefined) options.ssl = ssl;
  const pool = new pg.Pool(options);
  pool.on('error', (e) => console.error('Postgres pool error:', e.message));
  try {
    attachDatabasePool(pool);
  } catch (e) {
    console.error('attachDatabasePool failed:', e.message);
  }
  return {
    kind: 'postgres',
    query: async (text, params) => ({ rows: (await pool.query(text, params)).rows }),
    exec: async (sql) => {
      await pool.query(sql);
    },
    close: () => pool.end(),
  };
}

function importOptional(specifier) {
  return import(specifier);
}

async function createPgliteBackend() {
  const dir = process.env.PGLITE_DIR ? path.resolve(APP_DIR, process.env.PGLITE_DIR) : DEFAULT_PGLITE_DIR;
  fs.mkdirSync(dir, { recursive: true });
  const { PGlite } = await importOptional('@electric-sql/pglite');
  const db = await PGlite.create(dir);
  return {
    kind: 'pglite',
    query: async (text, params) => ({ rows: (await db.query(text, params)).rows }),
    exec: async (sql) => {
      try {
        await db.exec(sql);
      } catch (e) {
        await db.exec('ROLLBACK').catch(() => {});
        throw e;
      }
    },
    close: () => db.close(),
  };
}

async function createBackend() {
  const url = databaseUrl();
  if (url) return createPgBackend(url);
  if (process.env.VERCEL) {
    throw new Error('DATABASE_URL or POSTGRES_URL must be set on Vercel; the embedded PGlite database is for local use only');
  }
  return createPgliteBackend();
}

let backendPromise = null;
let schemaPromise = null;

function getBackend() {
  if (!backendPromise) {
    backendPromise = createBackend().catch((e) => {
      backendPromise = null;
      throw e;
    });
  }
  return backendPromise;
}

export async function query(text, params = []) {
  const backend = await getBackend();
  return backend.query(text, params);
}

export function ensureSchema() {
  if (!schemaPromise) {
    schemaPromise = getBackend()
      .then((backend) => backend.exec(SCHEMA_SQL))
      .catch((e) => {
        schemaPromise = null;
        throw e;
      });
  }
  return schemaPromise;
}

export async function closeDb() {
  const pending = backendPromise;
  backendPromise = null;
  schemaPromise = null;
  if (!pending) return;
  try {
    const backend = await pending;
    await backend.close();
  } catch (e) {
    console.error('Failed to close database:', e.message);
  }
}
