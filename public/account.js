// Shared account helpers for the chat, login, onboarding, settings and browse pages.
// Sessions are an HttpOnly cookie on this origin (Neon Auth, proxied through /api/auth/*), so
// every request here is a plain same-origin fetch.
(function () {
  async function call(url, opts) {
    const o = Object.assign({ credentials: 'same-origin' }, opts || {});
    o.headers = Object.assign({ 'Content-Type': 'application/json' }, (opts && opts.headers) || {});
    const res = await fetch(url, o);
    let data = null;
    try { data = await res.json(); } catch (e) {}
    return { ok: res.ok, status: res.status, data };
  }

  function authMessage(r) {
    const d = r.data || {};
    const code = String(d.code || '');
    if (code === 'INVALID_EMAIL_OR_PASSWORD') return 'Incorrect email or password.';
    if (/ALREADY_EXISTS/.test(code)) return 'An account with that email already exists. Sign in instead.';
    if (/PASSWORD_TOO_SHORT/.test(code)) return 'Password must be at least 8 characters.';
    if (/PASSWORD_TOO_LONG/.test(code)) return 'That password is too long.';
    if (/EMAIL_NOT_VERIFIED/.test(code)) return 'Check your email to verify your account first.';
    if (code === 'VALIDATION_ERROR' && /email/i.test(d.message || '')) return 'Enter a valid email address.';
    return d.message || d.error || 'Something went wrong (' + r.status + '). Try again.';
  }

  function nextUrl() {
    const n = new URLSearchParams(location.search).get('next') || '/';
    return n.startsWith('/') && !n.startsWith('//') ? n : '/';
  }

  window.KelvinAccount = {
    call,
    nextUrl,
    async me() {
      const r = await call('/api/me');
      return r.ok ? r.data : null;
    },
    async signIn(email, password) {
      const r = await call('/api/auth/sign-in/email', { method: 'POST', body: JSON.stringify({ email, password }) });
      if (!r.ok) throw new Error(authMessage(r));
      return r.data;
    },
    async signUp(name, email, password) {
      const r = await call('/api/auth/sign-up/email', { method: 'POST', body: JSON.stringify({ name, email, password }) });
      if (!r.ok) throw new Error(authMessage(r));
      return r.data;
    },
    async signOut() {
      await call('/api/auth/sign-out', { method: 'POST', body: '{}' }).catch(() => {});
      location.href = '/login';
    },
    async saveProfile(fields) {
      const r = await call('/api/me/profile', { method: 'PUT', body: JSON.stringify(fields) });
      if (!r.ok) throw new Error((r.data && r.data.error) || 'Could not save (' + r.status + ')');
      return r.data;
    },
    // Sends signed-out visitors to /login and signed-in visitors without a profile to /onboarding.
    async requireSession(opts) {
      const needProfile = !opts || opts.needProfile !== false;
      const me = await this.me();
      if (!me) {
        location.replace('/login?next=' + encodeURIComponent(location.pathname + location.search + location.hash));
        return null;
      }
      if (needProfile && !(me.profile && me.profile.onboarded)) {
        location.replace('/onboarding');
        return null;
      }
      return me;
    },
    initials(name, email) {
      const src = String(name || email || '?').trim();
      const parts = src.split(/[\s@._-]+/).filter(Boolean);
      return ((parts[0] || '?')[0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
    },
  };
})();
