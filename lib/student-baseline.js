import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const file = fileURLToPath(new URL('../agent/student-baseline.json', import.meta.url));
export function loadStudentBaseline() {
  try { return JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '')); }
  catch { return { instructionalPrior: 'Start with a capable undergraduate engineering explanation; adjust support to the student’s own reasoning and requests.', foundations: [] }; }
}
export function studentBaselineSection(profile = loadStudentBaseline()) {
  return ['## Starting instructional prior (not observed student evidence)',
    profile.instructionalPrior,
    ...(profile.foundations || []).map((f) => `- ${f.category}: ${f.course}: ${f.topics.join(', ')}. ${f.thermoBridge || ''} Curriculum source: ${f.source}`),
    profile.qualification || '',
    'Do not seed mastery, correct-attempt counts or weakness labels from this prior. Never ask prerequisite quiz questions as a condition of helping. A student can ask for a calculation or refresher without being weak at that skill.'
  ].filter(Boolean).join('\n');
}
