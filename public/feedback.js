// Feedback on Kelvin, as a modal over the chat: thumbs up or down, a comment, or both. Built on
// first open and reused, like Settings. Usage: KelvinFeedback.open({ conversationId, messageId,
// title, excerpt, rating, opener, onSent(saved) }). The thumbs icons are shared with the reply bar.
(function () {
  const MAX = 4000;
  const ICON_UP = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 10v11H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zM7 10l4-7a2.5 2.5 0 0 1 3 3l-1 4h5.5a2 2 0 0 1 2 2.4l-1.4 7A2 2 0 0 1 17.1 21H7"/></svg>';
  const ICON_DOWN = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 14V3h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1zM17 14l-4 7a2.5 2.5 0 0 1-3-3l1-4H5.5a2 2 0 0 1-2-2.4l1.4-7A2 2 0 0 1 6.9 3H17"/></svg>';

  const TEMPLATE = `
    <div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="fbTitle">
      <div class="modal-head">
        <h2 id="fbTitle" class="modal-title">Feedback on Kelvin</h2>
        <button type="button" class="icon-btn modal-close" data-close aria-label="Close feedback">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>
      <form class="modal-body acct-form fb-form" novalidate>
        <div class="fb-about"></div>
        <div class="fb-rating" role="group" aria-label="How did Kelvin do?">
          <button type="button" class="fb-thumb" data-rating="up" aria-pressed="false">${ICON_UP}<span>Helpful</span></button>
          <button type="button" class="fb-thumb" data-rating="down" aria-pressed="false">${ICON_DOWN}<span>Not helpful</span></button>
        </div>
        <div class="acct-field">
          <label for="fbText">What did Kelvin do well, or get wrong?</label>
          <textarea id="fbText" rows="5" maxlength="${MAX}" placeholder="For example: it gave away the answer, the numbers in step 2 were wrong, or the hint about entropy really helped."></textarea>
          <div class="fb-count" aria-live="polite"></div>
        </div>
        <div class="fb-error acct-error" role="alert"></div>
        <button class="fb-submit acct-btn" type="submit">Send feedback</button>
        <p class="fb-note"></p>
      </form>
      <div class="modal-body fb-done" hidden>
        <p class="fb-done-title" tabindex="-1">Thanks! Your feedback was sent.</p>
        <p class="fb-done-text"></p>
        <button type="button" class="acct-btn secondary" data-close>Close</button>
      </div>
    </div>`;

  let root = null;
  let opener = null;
  let ctx = {};
  let rating = null;

  const plain = (text) => String(text || '').replace(/[`*_#>$\\]/g, '').replace(/\s+/g, ' ').trim();

  function build() {
    root = document.createElement('div');
    root.className = 'modal-backdrop fb-modal';
    root.hidden = true;
    root.innerHTML = TEMPLATE;
    document.body.appendChild(root);
    root.addEventListener('mousedown', (e) => {
      if (e.target === root) close();
    });
    for (const b of root.querySelectorAll('[data-close]')) b.addEventListener('click', close);
    root.addEventListener('keydown', onKey);
    for (const b of root.querySelectorAll('.fb-thumb')) {
      b.addEventListener('click', () => setRating(rating === b.dataset.rating ? null : b.dataset.rating));
    }
    const text = root.querySelector('#fbText');
    text.addEventListener('input', count);
    text.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        root.querySelector('form').requestSubmit();
      }
    });
    root.querySelector('form').addEventListener('submit', submit);
  }

  function setRating(r) {
    rating = r;
    for (const b of root.querySelectorAll('.fb-thumb')) b.setAttribute('aria-pressed', String(b.dataset.rating === r));
    error('');
  }

  function count() {
    const n = Array.from(root.querySelector('#fbText').value).length;
    root.querySelector('.fb-count').textContent = n > MAX - 500 ? `${n} / ${MAX}` : '';
  }

  function error(text) {
    root.querySelector('.fb-error').textContent = text;
  }

  function focusables() {
    return Array.from(root.querySelectorAll('button, textarea')).filter((el) => !el.disabled && el.offsetParent !== null);
  }

  function onKey(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'Tab') {
      const els = focusables();
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function about() {
    const box = root.querySelector('.fb-about');
    box.replaceChildren();
    const line = document.createElement('p');
    line.className = 'fb-about-line';
    if (ctx.messageId) {
      line.textContent = 'About this reply from Kelvin:';
      const quote = document.createElement('blockquote');
      quote.className = 'fb-quote';
      if (window.KelvinMarkdown) quote.innerHTML = window.KelvinMarkdown.render(ctx.excerpt || '');
      else quote.textContent = plain(ctx.excerpt);
      box.append(line, quote);
    } else if (ctx.conversationId) {
      line.textContent = ctx.title ? `About this chat: “${ctx.title}”` : 'About this chat.';
      box.append(line);
    } else {
      line.textContent = 'About Kelvin in general. To give feedback on a chat, open it first.';
      box.append(line);
    }
    root.querySelector('.fb-note').textContent = ctx.conversationId
      ? 'The capstone team reads your feedback together with this chat. Please leave out your name and other personal details.'
      : 'The capstone team reads every piece of feedback. Please leave out your name and other personal details.';
  }

  async function submit(e) {
    e.preventDefault();
    const text = root.querySelector('#fbText').value.trim();
    if (!rating && !text) {
      error('Choose Helpful or Not helpful, or write a few words.');
      return;
    }
    const button = root.querySelector('.fb-submit');
    button.disabled = true;
    error('');
    try {
      const r = await window.KelvinAccount.call('/api/feedback', {
        method: 'POST',
        body: JSON.stringify({ conversationId: ctx.conversationId || null, messageId: ctx.messageId || null, rating, text }),
      });
      if (!r.ok) throw new Error((r.data && r.data.error) || `Could not send feedback (${r.status}). Try again.`);
      root.querySelector('.fb-form').hidden = true;
      const done = root.querySelector('.fb-done');
      done.querySelector('.fb-done-text').textContent = ctx.conversationId ? 'The capstone team will read it with this chat.' : 'The capstone team will read it.';
      done.hidden = false;
      done.querySelector('.fb-done-title').focus();
      if (typeof ctx.onSent === 'function') ctx.onSent(r.data || {});
    } catch (err) {
      error(err.message || 'Could not send feedback. Try again.');
    } finally {
      button.disabled = false;
    }
  }

  function open(opts) {
    if (!root) build();
    ctx = opts || {};
    opener = ctx.opener || document.activeElement;
    root.querySelector('.fb-form').hidden = false;
    root.querySelector('.fb-done').hidden = true;
    root.querySelector('#fbText').value = '';
    count();
    setRating(ctx.rating === 'up' || ctx.rating === 'down' ? ctx.rating : null);
    about();
    root.hidden = false;
    const quote = root.querySelector('.fb-quote');
    if (quote) quote.classList.toggle('clamped', quote.scrollHeight > quote.clientHeight + 2);
    root.querySelector('.fb-form').scrollTop = 0;
    root.querySelector('#fbText').focus();
  }

  function close() {
    if (!root || root.hidden) return;
    root.hidden = true;
    if (opener && typeof opener.focus === 'function' && opener.isConnected) opener.focus();
  }

  window.KelvinFeedback = { open, close, ICON_UP, ICON_DOWN };
})();
