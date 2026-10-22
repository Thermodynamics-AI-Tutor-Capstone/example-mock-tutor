// Activated only by the loopback server's --dev-login flag, never by the hosted API.
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
let session = null;
const COOKIE = 'kelvin_local_dev';
const HOURS = 8 * 60 * 60;
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export function enableLocalDev() {
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') throw new Error('Development login is local-only.');
  // Clear inherited remote services before app/database modules are loaded.
  for (const name of ['DATABASE_URL', 'POSTGRES_URL', 'NEON_AUTH_BASE_URL', 'BLOB_READ_WRITE_TOKEN']) delete process.env[name];
  process.env.PGLITE_DIR = path.join(root, 'data', 'local-dev', 'database');
  process.env.USAGE_LOG_DIR = path.join(root, 'data', 'local-dev', 'usage');
  session = { token: crypto.randomBytes(32).toString('hex'), expires: Date.now() + HOURS * 1000,
    user: { id: 'local-dev-' + crypto.randomUUID(), name: 'Local tester', email: null, localDev: true } };
}
export function localDevEnabled() {
  return Boolean(session) && !process.env.VERCEL && process.env.NODE_ENV !== 'production'
    && !process.env.DATABASE_URL && !process.env.POSTGRES_URL && !process.env.NEON_AUTH_BASE_URL
    && !process.env.BLOB_READ_WRITE_TOKEN
    && process.env.PGLITE_DIR === path.join(root, 'data', 'local-dev', 'database');
}
function localRequest(req) {
  if (!localDevEnabled()) return false;
  if (!['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket?.remoteAddress)) return false;
  if (req.headers['x-forwarded-for'] || req.headers['x-forwarded-host'] || req.headers['x-forwarded-proto']) return false;
  const port = req.socket?.localPort;
  return Number.isInteger(port) && [`127.0.0.1:${port}`, `localhost:${port}`].includes(req.headers.host);
}
export function localDevAvailable(req) { return localRequest(req); }
export function localDevSignIn(req) {
  if (!localRequest(req) || req.headers.origin !== `http://${req.headers.host}`
      || !/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) return null;
  session.token = crypto.randomBytes(32).toString('hex');
  session.expires = Date.now() + HOURS * 1000;
  return { user: session.user, cookie: `${COOKIE}=${session.token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${HOURS}` };
}
export function localDevUser(req) {
  if (!localRequest(req) || Date.now() > session.expires) return null;
  const value = String(req.headers.cookie || '').split(';').map((v) => v.trim()).find((v) => v.startsWith(COOKIE + '='))?.slice(COOKIE.length + 1);
  if (!value || !/^[a-f0-9]{64}$/.test(value)) return null;
  return crypto.timingSafeEqual(Buffer.from(value), Buffer.from(session.token)) ? session.user : null;
}
export function localDevSignOut(req) {
  if (!localRequest(req) || req.headers.origin !== `http://${req.headers.host}`) return null;
  session.token = crypto.randomBytes(32).toString('hex');
  return `${COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`;
}
