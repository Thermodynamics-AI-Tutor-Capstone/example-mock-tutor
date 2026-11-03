import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync, renameSync } from 'node:fs';
import { createHash, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';
import { join } from 'node:path';

const dir = process.env.KELVIN_MCP_DATA_DIR || join(import.meta.dirname, 'data');
const usersPath = join(dir, 'users.json');
const eventsPath = join(dir, 'events.jsonl');
mkdirSync(dir, { recursive: true, mode: 0o700 });
const hash = token => createHash('sha256').update(token).digest('hex');
const users = () => existsSync(usersPath) ? JSON.parse(readFileSync(usersPath, 'utf8')) : [];
function saveUsers(data) {
  const tmp = `${usersPath}.${process.pid}.tmp`;
  writeFileSync(tmp, JSON.stringify(data, null, 2), { mode: 0o600 });
  renameSync(tmp, usersPath);
}
export function provision(role = 'student', id = randomUUID()) {
  if (!['student', 'instructor'].includes(role)) throw new Error('Invalid role');
  if (!/^[a-zA-Z0-9_-]{3,80}$/.test(id)) throw new Error('Invalid user ID');
  const data = users();
  if (data.some(u => u.id === id)) throw new Error('User ID already exists');
  const token = `kelvin_${randomBytes(32).toString('base64url')}`;
  data.push({ id, role, tokenHash: hash(token), createdAt: new Date().toISOString(), revoked: false });
  saveUsers(data);
  return { id, role, token };
}
export function provisionHash(role, id, tokenHash) {
  if (!['student', 'instructor'].includes(role)) throw new Error('Invalid role');
  if (!/^[a-zA-Z0-9_-]{3,80}$/.test(id)) throw new Error('Invalid user ID');
  if (!/^[a-f0-9]{64}$/.test(tokenHash)) throw new Error('Invalid SHA-256 token hash');
  const data = users();
  if (data.some(u => u.id === id || u.tokenHash === tokenHash)) throw new Error('User or token already exists');
  data.push({ id, role, tokenHash, createdAt: new Date().toISOString(), revoked: false });
  saveUsers(data);
  return { id, role };
}
export function authenticate(token) {
  if (!token?.startsWith('kelvin_')) return null;
  const digest = Buffer.from(hash(token), 'hex');
  return users().find(u => !u.revoked && timingSafeEqual(Buffer.from(u.tokenHash, 'hex'), digest)) || null;
}
export function revoke(id) {
  const data = users();
  const user = data.find(u => u.id === id);
  if (!user) throw new Error('Unknown user');
  user.revoked = true;
  saveUsers(data);
}
export function addEvent(event) {
  appendFileSync(eventsPath, JSON.stringify({ id: randomUUID(), at: new Date().toISOString(), ...event }) + '\n', { mode: 0o600 });
}
export function allEvents() {
  if (!existsSync(eventsPath)) return [];
  return readFileSync(eventsPath, 'utf8').split('\n').filter(Boolean).map(line => JSON.parse(line));
}
export function deleteStudent(id) {
  const data = users();
  if (!data.some(u => u.id === id && u.role === 'student')) throw new Error('Unknown student');
  const remaining = allEvents().filter(e => e.studentId !== id);
  const tmp = `${eventsPath}.${process.pid}.tmp`;
  writeFileSync(tmp, remaining.map(e => JSON.stringify(e)).join('\n') + (remaining.length ? '\n' : ''), { mode: 0o600 });
  renameSync(tmp, eventsPath);
  revoke(id);
}
export function trends(minStudents = 5) {
  const events = allEvents();
  const students = new Set(events.map(e => e.studentId));
  if (students.size < minStudents) return { suppressed: true, minimumStudents: minStudents, students: students.size };
  const counts = field => Object.entries(events.reduce((acc, e) => {
    for (const id of e[field] || []) acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {})).filter(([id, count]) => new Set(events.filter(e => (e[field] || []).includes(id)).map(e => e.studentId)).size >= minStudents)
    .sort((a,b) => b[1]-a[1]).map(([id, count]) => ({ id, count }));
  return { suppressed: false, students: students.size, events: events.length,
    topics: counts('topics'), misconceptions: counts('misconceptions') };
}
