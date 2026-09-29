// Browser speech drives short drawing phrases. No speech API, key, audio download, or autoplay.
(function () {
  'use strict';
  const players = new Set();
  const clamp = (x) => Math.max(0, Math.min(1, x));
  function validate(spec) {
    const lesson = spec.lesson;
    if (!lesson || !/^[0-9a-f-]{36}$/i.test(lesson.id) || !Array.isArray(lesson.segments) || !lesson.segments.length || lesson.segments.length > 8) throw new Error('Invalid narrated lesson.');
    const targets = new Set([...spec.nodes.map((n) => `node:${n.id}`), ...spec.arrows.map((_, i) => `arrow:${i}`), ...spec.steps.map((_, i) => `step:${i}`)]);
    const seen = new Set();
    let total = 0;
    for (const segment of lesson.segments) {
      if (!segment || typeof segment.speech !== 'string' || !segment.speech.trim() || segment.speech.length > 500 || !Array.isArray(segment.cues) || segment.cues.length > 26) throw new Error('Invalid narrated step.');
      total += segment.speech.length;
      let previous = -1;
      for (const cue of segment.cues) {
        if (!cue || !targets.has(cue.target) || seen.has(cue.target) || !Number.isFinite(cue.at) || cue.at < 0 || cue.at > .85 || cue.at < previous) throw new Error('Invalid drawing cue.');
        previous = cue.at;
        seen.add(cue.target);
      }
    }
    if (total > 2500 || seen.size !== targets.size) throw new Error('Incomplete narrated lesson.');
    return lesson;
  }


  // Cue fractions refer to positions in the spoken words. Sentence breaks keep utterances short
  // even when a segment has no cues. Do not rely on browser-specific word-boundary events.
  function phrases(segment) {
    const words = segment.speech.trim().split(/\s+/);
    const starts = new Set([0]);
    const cues = new Map();
    for (const cue of segment.cues) {
      const at = Math.min(words.length - 1, Math.floor(cue.at * words.length));
      starts.add(at);
      if (!cues.has(at)) cues.set(at, []);
      cues.get(at).push(cue.target);
    }
    words.forEach((word, i) => { if (i + 1 < words.length && /[.!?]["')]*$/.test(word)) starts.add(i + 1); });
    const positions = [...starts].sort((a, b) => a - b);
    return positions.map((at, i) => ({ text: words.slice(at, positions[i + 1] ?? words.length).join(' '), targets: cues.get(at) || [] }));
  }

  function element(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    return el;
  }

  function mount(host, spec) {
    const lesson = validate(spec);
    const root = host.querySelector('.kboard');
    if (!root) throw new Error('The narrated board could not be initialized.');
    root.classList.remove('kboard-live');
    root.classList.add('kboard-narrated');
    const synth = window.speechSynthesis;
    const supported = Boolean(synth && window.SpeechSynthesisUtterance);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const items = [...root.querySelectorAll('[data-board-target]')];
    const script = lesson.segments.map(phrases);
    const marker = element('span', 'kboard-marker');
    marker.setAttribute('aria-hidden', 'true');
    marker.hidden = true;
    root.append(marker);
    const controls = element('div', 'knarration');
    const header = element('div', 'knarration-heading');
    const disclosure = element('span', 'knarration-disclosure', 'Browser voice');
    header.append(element('span', '', 'Listen & follow'), disclosure);
    const status = element('div', 'knarration-status', 'Press Play to listen, or use Next step to read.');
    status.setAttribute('role', 'status');
    const caption = element('p', 'knarration-caption', 'Your explanation will appear here one step at a time.');
    const toolbar = element('div', 'knarration-toolbar');
    const button = (label, fn) => {
      const el = element('button', 'knarration-button', label);
      el.type = 'button'; el.addEventListener('click', fn); toolbar.append(el); return el;
    };
    let index = -1, phrase = 0, running = false, speaking = false, disposed = false;
    let utterance = null, generation = 0, frame = null, watchdog = null, began = 0;
    let player, voices = [], paused = false;
    const previous = button('Previous', () => manual(index - 1));
    const play = button('Play narration', toggle);
    play.classList.add('knarration-play');
    const replay = button('Replay step', () => start(index < 0 ? 0 : index));
    const next = button('Next step', () => manual(index + 1));
    const rateLabel = element('label', 'knarration-rate', 'Speed ');
    const rate = element('select'); rate.setAttribute('aria-label', 'Narration speed');
    for (const value of [.75, 1, 1.25, 1.5, 2]) {
      const option = element('option', '', value + '×'); option.value = String(value); option.selected = value === 1; rate.append(option);
    }
    rateLabel.append(rate); toolbar.append(rateLabel);
    const voiceLabel = element('label', 'knarration-rate knarration-voice', 'Voice ');
    const voice = element('select'); voice.setAttribute('aria-label', 'Narration voice');
    voiceLabel.append(voice); toolbar.append(voiceLabel);
    const transcript = element('details', 'knarration-transcript');
    transcript.append(element('summary', '', 'Read full transcript'));
    const list = element('ol');
    for (const segment of lesson.segments) list.append(element('li', '', segment.speech));
    transcript.append(list);
    controls.append(header, caption, toolbar, status, transcript); root.append(controls);

    function refreshVoices() {
      const chosen = voice.value;
      voices = supported ? synth.getVoices() : [];
      voices.sort((a, b) => Number(b.localService) - Number(a.localService) || Number(/^en\b/i.test(b.lang)) - Number(/^en\b/i.test(a.lang)));
      voice.replaceChildren();
      const fallback = element('option', '', 'Device default'); fallback.value = ''; voice.append(fallback);
      for (const entry of voices) {
        const option = element('option', '', entry.name + (entry.localService ? ' · on device' : ' · browser service'));
        option.value = entry.voiceURI; voice.append(option);
      }
      const preferred = voices.find((v) => v.localService && /^en\b/i.test(v.lang)) || voices.find((v) => /^en\b/i.test(v.lang)) || voices[0];
      voice.value = voices.some((v) => v.voiceURI === chosen) ? chosen : preferred?.voiceURI || '';
      const selected = voices.find((v) => v.voiceURI === voice.value);
      disclosure.textContent = selected?.localService ? 'Device voice' : 'Browser voice';
    }
    function update() {
      previous.disabled = index <= 0; next.disabled = index >= lesson.segments.length - 1;
      replay.disabled = index < 0 || !supported; play.disabled = !supported;
      voice.disabled = !supported; rate.disabled = !supported;
      play.textContent = running ? 'Pause' : paused ? 'Resume phrase' : 'Play narration';
      play.setAttribute('aria-pressed', String(running));
      if (index >= 0) caption.textContent = lesson.segments[index].speech;
    }
    function draw(stepIndex, phraseIndex, amount, all = false) {
      const revealed = new Map();
      script.forEach((steps, i) => steps.forEach((part, j) => {
        const progress = i < stepIndex || (i === stepIndex && (all || j < phraseIndex)) ? 1 : i === stepIndex && j === phraseIndex ? amount : 0;
        part.targets.forEach((target) => revealed.set(target, progress));
      }));
      let tip = null;
      for (const item of items) {
        const progress = revealed.get(item.dataset.boardTarget) || 0;
        item.style.opacity = progress > 0 ? '1' : '0';
        item.setAttribute('aria-hidden', String(progress === 0));
        const stroke = item.matches('.kboard-arrow') ? item : item.querySelector('.kboard-marker-outline');
        if (stroke) {
          const length = stroke.getTotalLength();
          stroke.style.strokeDasharray = String(length); stroke.style.strokeDashoffset = String(length * (1 - progress));
          if (stroke.classList.contains('kboard-arrow')) stroke.style.markerEnd = progress < 1 ? 'none' : '';
          const label = item.querySelector('text');
          if (label) label.style.opacity = String(clamp((progress - .45) / .55));
        } else item.style.clipPath = 'inset(0 ' + ((1 - progress) * 100) + '% 0 0)';
        if (progress > 0 && progress < 1 && !item.classList.contains('kboard-arrow-label')) tip = { item, stroke, progress };
      }
      marker.hidden = !tip || reducedMotion.matches || !speaking;
      if (!marker.hidden) {
        const bounds = root.getBoundingClientRect();
        let x, y;
        if (tip.stroke) {
          const point = tip.stroke.getPointAtLength(tip.stroke.getTotalLength() * tip.progress);
          const matrix = tip.stroke.getScreenCTM();
          if (!matrix) { marker.hidden = true; return; }
          const screen = new DOMPoint(point.x, point.y).matrixTransform(matrix); x = screen.x; y = screen.y;
        } else {
          const box = tip.item.getBoundingClientRect(); x = box.left + box.width * tip.progress; y = box.top + Math.min(36, box.height / 2);
        }
        marker.style.left = (x - bounds.left) + 'px'; marker.style.top = (y - bounds.top) + 'px';
        marker.style.setProperty('--marker-ink', tip.stroke ? getComputedStyle(tip.stroke).stroke : getComputedStyle(tip.item).color);
      }
    }
    function tick() {
      frame = null;
      if (!speaking || disposed) return;
      const duration = Math.min(1800, Math.max(500, script[index][phrase].text.split(/\s+/).length * 130)) / Number(rate.value);
      draw(index, phrase, reducedMotion.matches ? 1 : clamp((performance.now() - began) / duration));
      if (performance.now() - began < duration) frame = requestAnimationFrame(tick);
    }
    function halt() {
      generation++;
      clearTimeout(watchdog); watchdog = null;
      if (frame !== null) cancelAnimationFrame(frame); frame = null;
      // Only the player that owns an utterance may cancel the shared browser speech queue.
      const owned = utterance; utterance = null; running = false; speaking = false;
      if (owned) synth.cancel();
      marker.hidden = true; update();
    }
    function manual(value) {
      halt(); paused = false; phrase = 0;
      index = Math.max(0, Math.min(lesson.segments.length - 1, value));
      draw(index, 0, 1, true); status.textContent = 'Step ' + (index + 1) + ' of ' + lesson.segments.length + ' · Reading'; update();
    }
    function fail() {
      halt(); paused = false;
      draw(index, phrase, 1);
      status.textContent = 'This browser voice could not speak. Choose another voice and press Play, or use Next step to read.'; update();
    }
    function speakPhrase() {
      if (disposed || !running) return;
      const token = ++generation;
      const part = script[index][phrase];
      const speech = new SpeechSynthesisUtterance(part.text);
      utterance = speech;
      speech.rate = Number(rate.value);
      const selected = voices.find((v) => v.voiceURI === voice.value);
      if (selected) speech.voice = selected;
      speech.lang = selected?.lang || 'en-US';
      draw(index, phrase, 0);
      status.textContent = 'Step ' + (index + 1) + ' of ' + lesson.segments.length + ' · Starting voice…';
      const current = () => !disposed && generation === token && utterance === speech;
      speech.onstart = () => {
        if (!current()) return;
        clearTimeout(watchdog);
        // Recover from platforms that never deliver end/error (for example after sleep).
        watchdog = setTimeout(() => { if (current()) fail(); }, 90000);
        speaking = true; began = performance.now(); tick();
        status.textContent = 'Step ' + (index + 1) + ' of ' + lesson.segments.length + ' · Listening';
      };
      speech.onend = () => {
        if (!current()) return;
        clearTimeout(watchdog); watchdog = null;
        if (frame !== null) cancelAnimationFrame(frame); frame = null;
        speaking = false; utterance = null; draw(index, phrase, 1); marker.hidden = true;
        phrase++;
        if (phrase >= script[index].length) { index++; phrase = 0; }
        if (index >= script.length) {
          index = script.length - 1; phrase = 0; running = false; paused = false;
          status.textContent = 'Explanation complete. Replay a step or continue the conversation.'; update();
        } else { update(); speakPhrase(); }
      };
      speech.onerror = () => { if (current()) fail(); };
      watchdog = setTimeout(() => { if (current()) fail(); }, 10000);
      try { synth.speak(speech); } catch { fail(); }
    }
    function start(value, resume = false) {
      if (!supported || disposed) return;
      for (const other of players) if (other !== player) other.pause();
      halt();
      index = Math.max(0, Math.min(lesson.segments.length - 1, value));
      if (!resume) phrase = 0;
      paused = false; running = true; update(); speakPhrase();
    }
    function pause() {
      if (!running) return;
      paused = true; halt();
      status.textContent = 'Paused. Resume repeats the current phrase.';
    }
    function toggle() { if (running) pause(); else start(index < 0 ? 0 : index, paused); }
    // Voice/rate changes restart just the current phrase; browser voices have no audio seek API.
    rate.addEventListener('change', () => { if (running) start(index, true); });
    voice.addEventListener('change', () => {
      const selected = voices.find((v) => v.voiceURI === voice.value);
      disclosure.textContent = selected?.localService ? 'Device voice' : 'Browser voice';
      if (running) start(index, true);
    });
    player = { host, pause, dispose() {
      if (disposed) return; disposed = true; halt();
      synth?.removeEventListener('voiceschanged', refreshVoices); players.delete(player);
    } };
    players.add(player);
    refreshVoices(); synth?.addEventListener('voiceschanged', refreshVoices);
    draw(-1, 0, 0); update();
    if (!supported) status.textContent = 'Speech is unavailable in this browser. Use Next step and the captions.';
    return player;
  }
  // Streaming temporarily detaches figures in the same task; only dispose truly removed boards.
  const observer = new MutationObserver(() => {
    for (const player of players) if (!player.host.isConnected) player.dispose();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener('pagehide', () => { for (const player of players) player.dispose(); });
  window.KelvinNarration = { mount, validate, phrases, pauseAll() { for (const player of players) player.pause(); } };
})();
