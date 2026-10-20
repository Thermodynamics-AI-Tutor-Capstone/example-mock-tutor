import fs from 'node:fs';

export function loadCourseProfile() {
  return JSON.parse(fs.readFileSync(new URL('../agent/course-profile.json', import.meta.url), 'utf8'));
}

export function safeSourceUrl(value) {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}

export function sourceLink(source, profile = loadCourseProfile(), baseUrl = process.env.KB_SOURCE_BASE_URL) {
  const explicit = safeSourceUrl(profile.sourceLinks?.[source.path]) || safeSourceUrl(source.url);
  if (explicit) return explicit;
  const base = safeSourceUrl(baseUrl);
  const segments = typeof source.path === 'string' ? source.path.split('/') : [];
  if (!base || !segments.length || segments.some((s) => !s || s === '.' || s === '..' || s.includes('\\'))) return null;
  const url = new URL(base);
  url.pathname = url.pathname.replace(/\/+$/, '') + '/' + segments.map(encodeURIComponent).join('/');
  url.search = '';
  url.hash = '';
  return url.href;
}

export function cardCitations(card, profile = loadCourseProfile()) {
  return {
    citationUrl: `/browse#card=${encodeURIComponent(card.id)}`,
    sourceLinks: (card.sources || []).map((s) => ({
      title: s.title || s.path || 'Course source',
      pages: s.pages ?? null,
      slides: s.slides ?? null,
      url: sourceLink(s, profile),
    })).filter((s) => s.url),
  };
}

export function courseProfileSection(profile = loadCourseProfile()) {
  return [
    '## Course configuration',
    `Materials: ${profile.label}. Instructor associated with these materials: ${profile.instructor || 'not specified'}.`,
    'These are the configured materials, not proof that this is the student’s current professor or term. Do not attribute the experimental teaching criteria to the professor.',
    ...(profile.teachingCriteria || []).map((criterion) => `- ${criterion}`),
    'Link only citationUrl/sourceLinks returned by open_card. If an original slide link is unavailable, link the course summary and identify it as a summary. Do not invent an original-file link.',
  ].join('\n');
}
