// A lesson is a saved board plus short speech clips. The audio clock is the only animation
// clock: buffering, pause, seeking and playback-rate changes cannot advance the board alone.
(function () {
  'use strict';
  const players = new Set();
  const clamp = (x) => Math.max(0, Math.min(1, x));
  const progressForCue = (position, at) => clamp((position - at) / 0.15);

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

  function element(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    return el;
  }

  function mount(host, spec, { api, apiFetch } = {}) {
    const lesson = validate(spec);
    const root = host.querySelector('.kboard');
    if (!root || !api || !apiFetch) throw new Error('The narrated board could not be initialized.');
    root.classList.remove('kboard-live');
    root.classList.add('kboard-narrated');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const items = [...root.querySelectorAll('[data-board-target]')];
    const controls = element('div', 'knarration');
    const header = element('div', 'knarration-heading');
    header.append(element('span', '', 'Listen & follow'), element('span', 'knarration-disclosure', 'AI-generated voice'));
    const status = element('div', 'knarration-status', 'Press Play to listen, or use Next step to read.');
    status.setAttribute('role', 'status');
    const caption = element('p', 'knarration-caption', 'Your explanation will appear here one step at a time.');
    const toolbar = element('div', 'knarration-toolbar');
    const button = (label, fn) => {
      const el = element('button', 'knarration-button', label);
      el.type = 'button';
      el.addEventListener('click', fn);
      toolbar.append(el);
      return el;
    };
    const previous = button('Previous', () => manual(index - 1));
    const play = button('Play narration', () => toggle());
    play.classList.add('knarration-play');
    const replay = button('Replay step', () => start(index < 0 ? 0 : index, true));
    const next = button('Next step', () => manual(index + 1));
    const rateLabel = element('label', 'knarration-rate', 'Speed ');
    const rate = element('select');
    rate.setAttribute('aria-label', 'Narration speed');
    for (const value of [.75, 1, 1.25, 1.5, 2]) {
      const option = element('option', '', `${value}×`);
      option.value = String(value);
      option.selected = value === 1;
      rate.append(option);
    }
    rate.addEventListener('change', () => { if (audio) audio.playbackRate = Number(rate.value); });
    rateLabel.append(rate);
    toolbar.append(rateLabel);
    const seek = element('input', 'knarration-seek');
    seek.type = 'range'; seek.min = '0'; seek.max = '1000'; seek.step = '1'; seek.value = '0';
    seek.setAttribute('aria-label', 'Position in current spoken step');
    seek.addEventListener('input', () => {
      if (audio && Number.isFinite(audio.duration)) {
        audio.currentTime = Number(seek.value) / 1000 * audio.duration;
        draw(index, Number(seek.value) / 1000);
      }
    });
    const transcript = element('details', 'knarration-transcript');
    transcript.append(element('summary', '', 'Read full transcript'));
    const list = element('ol');
    for (const segment of lesson.segments) list.append(element('li', '', segment.speech));
    transcript.append(list);
    controls.append(header, caption, toolbar, seek, status, transcript);
    root.append(controls);

    let index = -1, audio = null, request = null, frame = null, generation = 0;
    let disposed = false, loading = false, voiceAvailable = true;
    const urls = new Map();
    let player;

    function draw(stepIndex, position) {
      const revealed = new Map();
      lesson.segments.forEach((segment, i) => {
        for (const cue of segment.cues) {
          const progress = i < stepIndex ? 1 : i === stepIndex ? progressForCue(position, cue.at) : 0;
          revealed.set(cue.target, reducedMotion.matches && progress > 0 ? 1 : progress);
        }
      });
      for (const item of items) {
        const progress = revealed.get(item.dataset.boardTarget) || 0;
        item.style.opacity = progress > 0 ? '1' : '0';
        item.setAttribute('aria-hidden', progress > 0 ? 'false' : 'true');
        if (item.classList.contains('kboard-arrow')) {
          const length = item.getTotalLength();
          item.style.strokeDasharray = String(length);
          item.style.strokeDashoffset = String(length * (1 - progress));
        } else {
          item.style.clipPath = `inset(0 ${(1 - progress) * 100}% 0 0)`;
        }
      }
    }

    function update() {
      previous.disabled = index <= 0;
      next.disabled = index >= lesson.segments.length - 1;
      replay.disabled = index < 0;
      play.textContent = loading ? 'Cancel loading' : audio && !audio.paused ? 'Pause' : 'Play narration';
      play.setAttribute('aria-pressed', String(loading || Boolean(audio && !audio.paused)));
      seek.disabled = !audio || !Number.isFinite(audio.duration);
      if (index >= 0) caption.textContent = lesson.segments[index].speech;
      if (!voiceAvailable) status.textContent = (index >= 0 ? `Step ${index + 1} of ${lesson.segments.length} · ` : '') + 'Voice is not set up yet. Use Next step and the captions.';
    }

    function tick() {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      if (disposed || !audio) return;
      const position = audio.duration > 0 ? audio.currentTime / audio.duration : 0;
      draw(index, position);
      seek.value = String(Math.round(clamp(position) * 1000));
      if (!audio.paused) frame = requestAnimationFrame(tick);
    }

    function halt({ release = false } = {}) {
      generation++;
      request?.abort(); request = null; loading = false;
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      if (audio) {
        audio.pause();
        if (release) { audio.removeAttribute('src'); audio.load(); audio = null; }
      }
      update();
    }

    function manual(value) {
      halt({ release: true });
      index = Math.max(0, Math.min(lesson.segments.length - 1, value));
      seek.value = '1000';
      draw(index, 1);
      status.textContent = `Step ${index + 1} of ${lesson.segments.length} · Reading`;
      update();
    }

    async function start(value, restart = false) {
      for (const other of players) if (other !== player) other.pause();
      if (restart || value !== index) halt({ release: true });
      index = Math.max(0, Math.min(lesson.segments.length - 1, value));
      const token = ++generation;
      loading = true;
      voiceAvailable = true;
      status.textContent = `Step ${index + 1} of ${lesson.segments.length} · Loading voice…`;
      update();
      try {
        if (!audio) {
          draw(index, 0);
          seek.value = '0';
          let url = urls.get(index);
          if (!url) {
            request = new AbortController();
            const response = await apiFetch(`/api/whiteboard/${lesson.id}/audio/${index}`, { method: 'POST', signal: request.signal });
            if (!response.ok) {
              const error = await response.json().catch(() => ({}));
              throw new Error(error.error || 'Voice could not load. Use Next step to read, or try Play again.');
            }
            const blob = await response.blob();
            if (disposed || token !== generation) return;
            url = URL.createObjectURL(blob);
            urls.set(index, url);
          }
          if (disposed || token !== generation) return;
          const clip = new Audio(url);
          audio = clip;
          clip.preload = 'auto';
          clip.addEventListener('loadedmetadata', () => { if (audio === clip) { update(); tick(); } });
          clip.addEventListener('timeupdate', () => { if (audio === clip) tick(); });
          clip.addEventListener('seeked', () => { if (audio === clip) tick(); });
          clip.addEventListener('ended', () => {
            if (audio !== clip || disposed) return;
            draw(index, 1);
            if (index < lesson.segments.length - 1) start(index + 1, true);
            else { status.textContent = 'Explanation complete. Replay a step or continue the conversation.'; update(); }
          });
          clip.addEventListener('error', () => {
            if (audio !== clip || disposed) return;
            halt({ release: true });
            draw(index, 1);
            status.textContent = 'This clip could not play. Use Next step to read, or try Play again.';
          });
        }
        const clip = audio;
        if (clip.ended) clip.currentTime = 0;
        clip.playbackRate = Number(rate.value);
        await clip.play();
        if (disposed || token !== generation || audio !== clip) { clip.pause(); return; }
        loading = false;
        status.textContent = `Step ${index + 1} of ${lesson.segments.length} · Listening`;
        update(); tick();
      } catch (error) {
        if (disposed || token !== generation) return;
        halt({ release: true });
        draw(index, 1);
        status.textContent = error.name === 'NotAllowedError' ? 'Your browser paused audio. Press Play to continue.' : error.message;
      }
    }

    function toggle() {
      if (loading || (audio && !audio.paused)) {
        halt();
        status.textContent = `Step ${index + 1} of ${lesson.segments.length} · Paused`;
      } else start(index < 0 ? 0 : index);
    }

    player = {
      host,
      pause: () => {
        const wasPlaying = loading || (audio && !audio.paused);
        halt();
        if (wasPlaying) status.textContent = `Step ${index + 1} of ${lesson.segments.length} · Paused`;
      },
      dispose: () => {
        if (disposed) return;
        disposed = true;
        halt({ release: true });
        for (const url of urls.values()) URL.revokeObjectURL(url);
        urls.clear(); players.delete(player);
      },
    };
    players.add(player);
    draw(-1, 0); update();
    api('GET', '/api/whiteboard/voice').then((capability) => {
      if (disposed || index >= 0) return;
      voiceAvailable = capability.available;
      update();
    }).catch(() => {});
    return player;
  }

  // Streaming markdown temporarily detaches and reinserts figures in the same task. Observe
  // after that task, disposing only figures genuinely removed by chat navigation or deletion.
  const observer = new MutationObserver(() => {
    for (const player of players) if (!player.host.isConnected) player.dispose();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener('pagehide', () => { for (const player of players) player.dispose(); });
  window.KelvinNarration = { mount, validate, progressForCue, pauseAll() { for (const player of players) player.pause(); } };
})();
