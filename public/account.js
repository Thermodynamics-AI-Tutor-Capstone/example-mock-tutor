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
    if (code === 'INVALID_EMAIL_OR_PASSWORD') return 'Incorrect name or password.';
    if (code === 'NAME_TAKEN' || code === 'NAME_REQUIRED') return d.error || d.message || 'Pick a name and try again.';
    if (/ALREADY_EXISTS/.test(code)) return 'That name is already taken. Pick another.';
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
      if (r.status === 403 && r.data && r.data.error === 'account_inactive') {
        // A deleted (deactivated) account: end the session instead of looping through /login.
        await call('/api/auth/sign-out', { method: 'POST', body: '{}' }).catch(() => {});
        if (location.pathname !== '/login') location.replace('/login?inactive=1');
        return null;
      }
      return r.ok ? r.data : null;
    },
    // An email signs into an existing account; anything else is treated as the made-up Kelvin name.
    async signIn(identifier, password) {
      const body = identifier.includes('@') ? { email: identifier, password } : { username: identifier, password };
      const r = await call('/api/auth/sign-in/email', { method: 'POST', body: JSON.stringify(body) });
      if (!r.ok) throw new Error(authMessage(r));
      const check = await call('/api/me');
      if (check.status === 403 && check.data && check.data.error === 'account_inactive') {
        await call('/api/auth/sign-out', { method: 'POST', body: '{}' }).catch(() => {});
        throw new Error('This account has been deleted.');
      }
      return r.data;
    },
    // Accounts are deactivated, never erased; the team keeps the data (see the note in Settings).
    async deleteAccount() {
      const r = await call('/api/me', { method: 'DELETE' });
      if (!r.ok) throw new Error((r.data && r.data.error) || 'Could not delete the account (' + r.status + ')');
      await call('/api/auth/sign-out', { method: 'POST', body: '{}' }).catch(() => {});
      location.href = '/login?deleted=1';
    },
    // Sign-up posts only the picked name parts: the account's email is derived from them server-side.
    async signUp(first, last, password) {
      const r = await call('/api/auth/sign-up/email', { method: 'POST', body: JSON.stringify({ first, last, password }) });
      if (!r.ok) {
        const err = new Error(authMessage(r));
        if (r.data && r.data.code) err.code = r.data.code;
        throw err;
      }
      return r.data;
    },
    // The choices the sign-up page offers: lists of first and last names plus which combos are taken.
    async nameOptions() {
      const r = await call('/api/auth/name-options');
      if (!r.ok) throw new Error((r.data && r.data.error) || 'Could not load names (' + r.status + ')');
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
