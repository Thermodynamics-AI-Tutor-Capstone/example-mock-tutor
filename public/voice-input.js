(function () {
  'use strict';
  let enabled = false, permissionDenied = false, phase = 'idle', generation = 0, recorder, stream, controller, timer;
  let clockTimer, startedAt = 0, shortcutHeld = false;
  let options, mime, maxBytes = 3 * 1024 * 1024, maxSeconds = 120;
  const $ = (id) => document.getElementById(id);
  const active = () => phase !== 'idle';
  function message(text) {
    $('voiceStatus').hidden = !text;
    $('voiceMessage').textContent = text;
  }
  function refresh(notify = true) {
    const button = $('micBtn');
    button.disabled = !enabled || (phase === 'idle' && options?.blocked()) || ['permission', 'stopping', 'transcribing'].includes(phase);
    button.setAttribute('aria-pressed', String(phase === 'recording'));
    button.setAttribute('aria-label', phase === 'recording' ? 'Stop dictation' : 'Dictate your reasoning');
    if (enabled) button.title = phase === 'recording' ? 'Stop and transcribe' : 'Explain your reasoning aloud';
    $('voiceCancel').hidden = !active();
    $('voiceStop').hidden = phase !== 'recording';
    $('voiceClock').hidden = phase !== 'recording';
    $('voiceHint').hidden = !enabled || active();
    $('voiceStatus').dataset.phase = phase;
    if (notify) options?.onChange();
  }
  function updateClock() {
    const seconds = Math.min(maxSeconds, Math.floor((Date.now() - startedAt) / 1000));
    const format = (value) => Math.floor(value / 60) + ':' + String(value % 60).padStart(2, '0');
    $('voiceClock').textContent = format(seconds) + ' / ' + format(maxSeconds);
  }
  function release() {
    clearTimeout(timer);
    clearInterval(clockTimer);
    stream?.getTracks().forEach((track) => track.stop());
    stream = null;
  }
  function cancel() {
    shortcutHeld = false;
    generation++;
    controller?.abort();
    controller = null;
    if (recorder?.state === 'recording') recorder.stop();
    recorder = null;
    release();
    phase = 'idle';
    message('');
    refresh();
  }
  function stop() {
    if (phase !== 'recording' || recorder?.state !== 'recording') return;
    shortcutHeld = false;
    phase = 'stopping';
    clearInterval(clockTimer);
    clearTimeout(timer);
    message('Finishing your recording…');
    refresh();
    recorder.stop();
  }
  async function finish(token, chunks, type) {
    if (token !== generation) return;
    release();
    recorder = null;
    const audio = new Blob(chunks, { type });
    if (!audio.size || audio.size > maxBytes) {
      phase = 'idle';
      message(audio.size ? 'Recording is too large. Try a shorter explanation.' : 'No audio was recorded. Try again.');
      refresh();
      return;
    }
    phase = 'transcribing';
    message('Turning your explanation into text…');
    refresh();
    controller = new AbortController();
    try {
      const response = await options.apiFetch('/api/dictation', {
        method: 'POST', headers: { 'Content-Type': type }, body: audio, signal: controller.signal,
      });
      let result;
      try { result = await response.json(); } catch { throw new Error('Voice transcription is unavailable. Please try again.'); }
      if (!response.ok) throw new Error(result.error || 'Voice transcription failed. Please try again.');
      if (typeof result.text !== 'string' || !result.text.trim()) throw new Error('No speech was detected. Please try again.');
      if (token !== generation) return;
      const input = $('input');
      // Preserve everything typed while the recording/request was in progress.
      input.value += (input.value && !/\s$/.test(input.value) ? ' ' : '') + result.text.trim();
      input.dispatchEvent(new Event('input', { bubbles: true }));
      message('Added to your draft. Check numbers, units, and symbols before sending.');
      input.focus();
    } catch (error) {
      if (token === generation) message(error.message || 'Voice transcription failed. Your typed draft is still here.');
    } finally {
      if (token === generation) { phase = 'idle'; controller = null; refresh(); }
    }
  }
  async function start() {
    if (!enabled || active() || options.blocked()) return;
    const token = ++generation;
    phase = 'permission';
    message('Allow microphone access to explain your reasoning. Audio is sent to OpenAI when you stop.');
    refresh();
    window.KelvinNarration?.pauseAll();
    window.KelvinTips?.hide();
    try {
      const acquired = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true }, video: false });
      if (token !== generation) { acquired.getTracks().forEach((track) => track.stop()); return; }
      permissionDenied = false;
      stream = acquired;
      const current = new MediaRecorder(stream, { mimeType: mime, audioBitsPerSecond: 32000 });
      recorder = current;
      const chunks = [];
      let size = 0;
      current.ondataavailable = (event) => {
        if (token !== generation || !event.data.size) return;
        size += event.data.size;
        chunks.push(event.data);
        if (size > maxBytes) stop();
      };
      current.onstop = () => finish(token, chunks, current.mimeType || mime);
      current.onerror = () => { if (token === generation) { cancel(); message('Recording failed. Please try again or type your explanation.'); } };
      current.start(1000);
      phase = 'recording';
      startedAt = Date.now();
      updateClock();
      clockTimer = setInterval(updateClock, 1000);
      message(shortcutHeld
        ? 'Listening. Release the shortcut to transcribe. Audio goes to OpenAI when you stop.'
        : 'Listening. Explain your steps and where you got stuck. Audio goes to OpenAI when you stop.');
      document.dispatchEvent(new CustomEvent('kelvin:feature-used', { detail: 'voice' }));
      timer = setTimeout(() => { if (token === generation) stop(); }, maxSeconds * 1000);
      refresh();
    } catch (error) {
      if (token !== generation) return;
      cancel();
      permissionDenied = error.name === 'NotAllowedError';
      message(error.name === 'NotAllowedError'
        ? 'Microphone access was denied. Allow it in your browser’s site settings, or keep typing.'
        : 'Could not access the microphone. Check that it is connected and available, or keep typing.');
    }
  }
  window.KelvinVoice = {
    active, available: () => enabled && !permissionDenied, start, cancel,
    update() { if (options) refresh(false); },
    async init(config) {
      options = config;
      $('micBtn').addEventListener('click', () => {
        if (phase === 'recording') { stop(); return; }
        start();
      });
      $('voiceStop').addEventListener('click', stop);
      $('input').addEventListener('keydown', (event) => {
        if (event.code !== 'Space' || !event.ctrlKey || !event.shiftKey || event.altKey || event.metaKey || event.isComposing) return;
        if (!enabled || options.blocked()) return;
        event.preventDefault();
        if (event.repeat || shortcutHeld || active()) return;
        shortcutHeld = true;
        start();
      });
      document.addEventListener('keyup', (event) => {
        if (!shortcutHeld || !['Space', 'ControlLeft', 'ControlRight', 'ShiftLeft', 'ShiftRight'].includes(event.code)) return;
        shortcutHeld = false;
        if (phase === 'permission') cancel();
        else stop();
      });
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && active()) { event.preventDefault(); cancel(); $('input').focus(); }
      });
      window.addEventListener('blur', () => { if (shortcutHeld) cancel(); });
      $('voiceCancel').addEventListener('click', () => { cancel(); $('input').focus(); });
      window.addEventListener('pagehide', cancel);
      document.addEventListener('visibilitychange', () => { if (document.hidden && active()) cancel(); });
      if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
        $('micBtn').title = 'Voice input requires a supported browser with microphone access over HTTPS.';
        return;
      }
      mime = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].find((type) => MediaRecorder.isTypeSupported(type));
      if (!mime) { $('micBtn').title = 'This browser cannot record a supported audio format. You can still type.'; return; }
      try {
        const capability = await options.api('GET', '/api/dictation');
        enabled = capability.available === true;
        maxBytes = capability.maxBytes || maxBytes;
        maxSeconds = capability.maxSeconds || maxSeconds;
        $('micBtn').title = enabled ? 'Explain your reasoning aloud' : 'Voice input is not configured yet. You can still type.';

      } catch { $('micBtn').title = 'Voice input is unavailable right now. You can still type.'; }
      refresh();
    },
  };
})();
