// A separate learning area and a tour of the real controls. No tutorial messages are sent.
(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const lessons = [
    { id: 'prompt', target: 'input', title: 'Start with your thinking', short: 'Give Kelvin a place to start.',
      text: 'Describe the problem, the equation or assumption you tried, and exactly where you got stuck. Your reasoning gives Kelvin something useful to respond to.',
      task: 'Try typing: “I used the steady-flow energy equation. Can you help me check my assumptions?”', action: 'Try writing a question',
      demo: 'I used the steady-flow energy equation for a turbine. I assumed it was adiabatic. Do I need to include the change in velocity?', label: 'A useful starting question' },
    { id: 'attachment', target: 'attBtn', title: 'Show your work', short: 'Bring your calculations into the conversation.',
      text: 'Use the paperclip to attach a photo, screenshot, or course file. Review what Kelvin reads, especially equations and handwritten numbers, before sending.',
      task: 'Try attaching a photo of one calculation and explain which step you want to check.', action: 'Find the attachment button',
      demo: 'energy-balance.jpg\nReview the extracted text → check symbols and units → send with your question.', label: 'Attach • review • ask' },
    { id: 'whiteboard', target: 'whiteboardBtn', title: 'See the explanation', short: 'Follow a narrated whiteboard.',
      text: 'Turn on Whiteboard before sending your question. The drawing opens in our workspace. Play narration, Voice & speed, and Read full transcript are above the compact board. Follow the captions or use Next step without audio.',
      task: 'Try asking for an energy balance on a turbine. Select the whiteboard, then send when you are ready.', action: 'Find the whiteboard button',
      demo: 'Whiteboard → ask your question → Play narration above the drawing. Voice & speed and Read full transcript are beside the controls.', label: 'Explain on whiteboard' },
    { id: 'voice', target: 'micBtn', title: 'Talk it through', short: 'Turn spoken reasoning into an editable draft.',
      text: 'Select the microphone, explain your thinking, and select it again to stop. Check the transcript’s numbers, units, and symbols before you send it. Audio is sent for transcription when you stop.',
      task: 'Try explaining your assumption aloud. You decide when the reviewed text is ready to send.', action: 'Find the microphone',
      demo: '“I assumed the turbine was adiabatic, but I’m unsure about the velocity term.”\nStop → review the draft → edit → send.', label: 'Speak • review • send' },
    { id: 'check-work', target: 'checkWorkBtn', title: 'Check your reasoning', short: 'Review the steps you have already tried.',
      text: 'Turn on Check my work and share your equations or a photo of your solution, including the problem and givens. Review the extracted symbols before sending.',
      task: 'Try sharing one step you want to check. You can type it or attach your written work.', action: 'Find Check my work',
      demo: 'Check my work → add the problem and your solution → review symbols and units → send.', label: 'Make your reasoning visible' },
    { id: 'map', target: 'courseMapLink', title: 'Explore the course map', short: 'See how the course topics connect.',
      text: 'Use Course map at the top of chat to browse the available course topics and knowledge cards. Come back to Learn KELVIN any time you want a refresher.',
      task: 'Try opening the course map and choosing a topic you are studying.', action: 'Find the course map',
      demo: 'Course map → pick a topic → explore its knowledge cards. Return to Learn KELVIN whenever you need a refresher.', label: 'Keep exploring' },
    { id: 'about-me', target: 'aboutMeLink', title: 'Make Kelvin familiar with you', short: 'Share the context you want your tutor to use.',
      text: 'Open About Me to share your learning goals, starting point, and preferences. These are your descriptions of what helps you learn, and you can revisit them as your needs change.',
      task: 'Think of one goal or preference you would want a tutor to know. Open About Me when you are ready to add it.', action: 'Find About Me',
      demo: 'About Me → share a goal or preference → review what you entered. Return to update it when your needs change.', label: 'Your starting point, in your words' },
    { id: 'self-check', target: 'selfCheckLink', title: 'Check my understanding', short: 'Find a useful next step with a short self-check.',
      text: 'Open Check My Understanding to try a short question and look at the feedback. Use it to identify what to practice or ask about next. One answer is a starting point, not a complete picture of your understanding.',
      task: 'Choose something you are studying, try a self-check, and use the feedback to decide your next step.', action: 'Find Check My Understanding',
      demo: 'Check My Understanding → try a question → read the feedback → decide what to practice or ask next.', label: 'A quick check, then a next step' },
  ].map((lesson, index) => ({ ...lesson, icon: String(index + 1).padStart(2, '0') }));
  let hooks, key, prefs = { viewed: [], dismissed: false }, tourIndex = 0, returnToHub = true;
  let timer = null, elapsed = 0, lastTick = 0, lastScene = -1, positionedTarget = null;
  const chapterSeconds = 10, duration = lessons.length * chapterSeconds;
  const timeLabel = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
  let sidebarBeforeTour = null;

  function restoreSidebar() {
    if (!sidebarBeforeTour) return;
    $('app').classList.toggle('collapsed', sidebarBeforeTour.collapsed);
    $('app').classList.toggle('mobile-open', sidebarBeforeTour.mobileOpen);
    $('app').classList.remove('tour-active');
  }
  function revealTourTarget() {
    if (!positionedTarget || !sidebarBeforeTour) return;
    const sidebarTarget = Boolean(positionedTarget.closest('#sidebar'));
    $('app').classList.toggle('collapsed', sidebarTarget ? false : sidebarBeforeTour.collapsed);
    $('app').classList.toggle('mobile-open', sidebarTarget && matchMedia('(max-width: 767px)').matches);
  }

  function save() { try { localStorage.setItem(key, JSON.stringify(prefs)); } catch {} }
  function markViewed() {
    const id = lessons[tourIndex].id;
    if (!prefs.viewed.includes(id)) prefs.viewed.push(id);
    save(); renderProgress();
  }
  function dismissWelcome() { prefs.dismissed = true; save(); $('learnWelcome').hidden = true; }
  function renderProgress() {
    $('learnWelcome').hidden = prefs.dismissed || prefs.viewed.length === lessons.length;
    $('learnProgressText').textContent = `${prefs.viewed.length} of ${lessons.length} features explored`;
    $('learnProgress').value = prefs.viewed.length;
    $('startTour').textContent = prefs.viewed.length === lessons.length ? 'Replay the guided tour' : prefs.viewed.length ? 'Continue the guided tour' : 'Start the guided tour';
    document.querySelectorAll('[data-lesson]').forEach((button, i) => {
      button.querySelector('.lesson-status').textContent = prefs.viewed.includes(lessons[i].id) ? 'Explored · Show me again ↗' : 'Show me the control ↗';
    });
  }
  function pause() {
    clearInterval(timer); timer = null;
    $('demoPlay').textContent = elapsed >= duration ? '↻ Replay' : '▶ Play';
    $('demoPlay').setAttribute('aria-label', elapsed >= duration ? 'Replay walkthrough' : 'Play walkthrough');
  }
  function renderDemo() {
    const index = Math.min(lessons.length - 1, Math.floor(elapsed / chapterSeconds));
    const lesson = lessons[index];
    if (index !== lastScene) {
      lastScene = index;
      $('demoLabel').textContent = lesson.label;
      $('demoText').textContent = lesson.demo;
      $('demoChapter').textContent = `${lesson.icon} / ${String(lessons.length).padStart(2, '0')}`;
      $('demoCaption').textContent = lesson.text;
      $('demoStage').dataset.scene = lesson.id;
      document.querySelectorAll('[data-chapter]').forEach((button, i) => {
        button.setAttribute('aria-pressed', String(index === i));
      });
    }
    $('demoSeek').value = elapsed;
    $('demoTime').textContent = `${timeLabel(elapsed)} / ${timeLabel(duration)}`;
  }
  function play() {
    if (timer) { pause(); return; }
    if (elapsed >= duration) elapsed = 0;
    lastTick = performance.now();
    $('demoPlay').textContent = 'Ⅱ Pause'; $('demoPlay').setAttribute('aria-label', 'Pause walkthrough');
    timer = setInterval(() => {
      const now = performance.now(); elapsed = Math.min(duration, elapsed + (now - lastTick) / 1000); lastTick = now;
      renderDemo(); if (elapsed >= duration) pause();
    }, 200);
    renderDemo();
  }
  function showHub() {
    if (!$('learnPanel').hidden) return;
    window.KelvinVoice?.cancel(); window.KelvinTips?.hide(); window.KelvinNarration?.pauseAll();
    $('app').classList.remove('mobile-open'); $('app').classList.add('learning');
    if (!$('propertyTableDock').hidden) $('closePropertyTables').click();
    $('chatMain').hidden = true; $('learnPanel').hidden = false;
    $('learnLink').setAttribute('aria-current', 'page');
    $('learnReturn').href = hooks.chatHash();
    $('learnTitle').focus({ preventScroll: true });
  }
  function hide() {
    if (!hooks) return;
    pause();
    if ($('learnPanel').hidden) return;
    $('chatMain').hidden = false; $('learnPanel').hidden = true;
    $('app').classList.remove('learning'); $('learnLink').removeAttribute('aria-current');
    hooks.onReturn();
  }
  function positionTour() {
    const dialog = $('learnTour');
    if (!dialog.open || !positionedTarget) return;
    revealTourTarget();
    const rect = positionedTarget.getBoundingClientRect();
    const ring = $('tourSpotlight');
    ring.style.left = `${Math.max(4, rect.left - 6)}px`;
    ring.style.top = `${Math.max(4, rect.top - 6)}px`;
    ring.style.width = `${Math.min(rect.width + 12, innerWidth - 8)}px`;
    ring.style.height = `${rect.height + 12}px`;
    // Fit in the larger free area, including short mobile viewports and zoomed text.
    const card = $('tourCard');
    const above = rect.top - 6, below = innerHeight - rect.bottom - 6;
    card.style.top = above >= below ? '16px' : 'auto';
    card.style.bottom = above >= below ? 'auto' : '16px';
    card.style.maxHeight = `${Math.max(100, Math.max(above, below) - 32)}px`;
  }
  function renderTour() {
    const lesson = lessons[tourIndex];
    $('tourCount').textContent = `FEATURE ${tourIndex + 1} OF ${lessons.length}`;
    $('tourTitle').textContent = lesson.title;
    $('tourText').textContent = lesson.text;
    $('tourTask').textContent = lesson.task;
    const target = $(lesson.target);
    const unavailable = lesson.id === 'voice' && !window.KelvinVoice?.available();
    $('tourAvailability').hidden = !unavailable;
    $('tourAvailability').textContent = 'Voice input is unavailable in this session. You can still type your reasoning and explore the other features.';
    $('tourTry').textContent = unavailable ? 'Return to the message box' : lesson.action;
    $('tourBack').disabled = tourIndex === 0;
    $('tourNext').textContent = tourIndex === lessons.length - 1 ? 'Finish tour' : 'Next feature →';
    positionedTarget = target;
    revealTourTarget();
    target.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    positionTour();
    $('tourTitle').focus({ preventScroll: true });
  }
  function finishTour(tryFeature = false) {
    const lesson = lessons[tourIndex];
    $('learnTour').close();
    restoreSidebar();
    if (tryFeature) {
      revealTourTarget();
      const target = $(lesson.target);
      (target.disabled ? $('input') : target).focus({ preventScroll: true });
    } else if (returnToHub) {
      history.replaceState(null, '', location.pathname + location.search + '#/learn'); showHub();
    } else ($('learnWelcome').hidden ? $('input') : $('welcomeTour')).focus();
    positionedTarget = null; sidebarBeforeTour = null;
  }
  function startTour(index = 0) {
    const anotherModal = Array.from(document.querySelectorAll('[aria-modal="true"]')).some(el => el.getClientRects().length);
    if (hooks.blocked() || window.KelvinVoice?.active() || anotherModal) {
      $('learnNotice').textContent = 'Finish the current reply, upload, or recording before starting the tour.';
      if ($('learnPanel').hidden) location.hash = '#/learn';
      return;
    }
    $('learnNotice').textContent = '';
    returnToHub = !$('learnPanel').hidden;
    tourIndex = index;
    sidebarBeforeTour = { collapsed: $('app').classList.contains('collapsed'), mobileOpen: $('app').classList.contains('mobile-open') };
    $('app').classList.add('tour-active');
    hide(); window.KelvinTips?.hide(); window.KelvinNarration?.pauseAll();
    $('app').classList.remove('mobile-open');
    history.replaceState(null, '', location.pathname + location.search + hooks.chatHash());
    $('learnTour').showModal(); renderTour();
  }
  function init(config) {
    hooks = config; key = 'kelvin:learn:v1:' + config.userId;
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      if (saved && typeof saved === 'object') prefs = {
        viewed: [...new Set((Array.isArray(saved.viewed) ? saved.viewed : []).filter(id => lessons.some(l => l.id === id)))],
        dismissed: saved.dismissed === true,
      };
    } catch {}
    $('learnPanel').innerHTML = `
      <header class="learn-topbar"><span class="learn-breadcrumb">KELVIN / GETTING STARTED</span><a id="learnReturn" href="#/">← Back to chat</a></header>
      <div class="learn-content">
        <div class="learn-hero"><div><span class="learn-eyebrow">YOUR FIRST FEW MINUTES</span><h1 id="learnTitle" tabindex="-1">A little tour.<br>A lot more possibility.</h1><p>Meet the tools that help you show your thinking,<br class="learn-wide"> see the steps, and find your way forward.</p></div><div class="learn-orbit" aria-hidden="true"><span>K</span><i>Speak</i><i>Sketch</i><i>Explore</i></div></div>
        <div class="learn-path"><div><strong>Get to know your workspace</strong><span id="learnProgressText"></span><progress id="learnProgress" max="${lessons.length}" value="0" aria-label="Features explored"></progress></div><button id="startTour" class="learn-primary" type="button">Start the guided tour</button><span class="learn-duration">${lessons.length} features · about ${Math.ceil(lessons.length * 20 / 60)} min</span></div>
        <p id="learnNotice" class="learn-notice" role="status"></p>
        <div class="learn-section-heading"><h2>Watch it. Then try it.</h2><span>${timeLabel(duration)} to get oriented</span></div>
        <div class="learn-video-layout"><div class="learn-player">
          <div id="demoStage" class="learn-stage" role="img" aria-label="Illustrated walkthrough of Kelvin features">
            <div class="demo-window-bar"><span>● ● ●</span><strong>KELVIN</strong><span id="demoChapter"></span></div>
            <div class="demo-workspace"><div class="demo-rail" aria-hidden="true"><b>K</b><span>＋</span><span>▤</span><span>◷</span></div><div class="demo-screen"><span class="demo-kicker">LET’S TRY SOMETHING</span><h3 id="demoLabel"></h3><div class="demo-paper"><div id="demoDiagram" class="demo-diagram" aria-hidden="true"><span>Energy in →</span><b>Turbine</b><span>→ Energy out</span></div><p id="demoText"></p></div><div class="demo-tools" aria-hidden="true"><span data-tool="attachment">＋ Attach</span><span data-tool="whiteboard">▱ Whiteboard</span><span data-tool="voice">◉ Voice</span></div></div></div>
          </div>
          <div class="demo-controls"><button id="demoPlay" type="button" aria-label="Play walkthrough">▶ Play</button><input id="demoSeek" type="range" min="0" max="${duration}" step="0.1" value="0" aria-label="Walkthrough position in seconds"><span id="demoTime">0:00 / ${timeLabel(duration)}</span></div>
          <p id="demoCaption" class="demo-caption"></p>
          <p class="demo-format">Captioned animation · no audio · illustrative examples</p>
        </div><div class="learn-chapters"><span class="learn-eyebrow">IN THIS WALKTHROUGH</span>${lessons.map((lesson, i) => `<button type="button" data-chapter="${i}" aria-pressed="false"><span>${lesson.icon}</span><strong>${lesson.title}</strong><small>${timeLabel(i * chapterSeconds)}</small></button>`).join('')}</div></div>
        <div class="learn-section-heading"><h2>Go straight to a feature</h2><span>Explore at your own pace</span></div>
        <div class="learn-lessons">${lessons.map((lesson, i) => `<button class="learn-lesson" data-lesson="${i}" type="button"><span class="lesson-number">${lesson.icon}</span><strong>${lesson.title}</strong><span class="lesson-description">${lesson.short}</span><span class="lesson-status">Show me the control ↗</span></button>`).join('')}</div>
        <footer class="learn-footer">Always here when you need it. Find <strong>Learn KELVIN</strong> above Your conversations.<br>Your place in the tour is saved in this browser.</footer>
      </div>`;
    const dialog = document.createElement('dialog'); dialog.id = 'learnTour'; dialog.className = 'learn-tour';
    dialog.setAttribute('aria-labelledby', 'tourTitle'); dialog.setAttribute('aria-describedby', 'tourText'); dialog.setAttribute('aria-modal', 'true');
    dialog.innerHTML = `<div id="tourSpotlight" class="tour-spotlight" aria-hidden="true"></div><div id="tourCard" class="tour-card"><div class="tour-heading"><span id="tourCount" class="learn-eyebrow"></span><button id="tourClose" type="button" aria-label="Close guided tour">×</button></div><h2 id="tourTitle" tabindex="-1"></h2><p id="tourText"></p><div id="tourTask" class="tour-task"></div><p id="tourAvailability" class="tour-availability" hidden></p><button id="tourTry" class="tour-try" type="button"></button><div class="tour-footer"><button id="tourBack" type="button">← Back</button><button id="tourNext" class="learn-primary" type="button">Next feature →</button></div><span class="tour-footnote">Try it returns you to the control. Nothing is sent automatically.</span></div>`;
    document.body.appendChild(dialog);
    $('learnWelcome').hidden = prefs.dismissed || prefs.viewed.length === lessons.length;
    $('dismissWelcome').onclick = dismissWelcome;
    $('welcomeTour').onclick = () => startTour(0);
    $('startTour').onclick = () => startTour(Math.max(0, lessons.findIndex(l => !prefs.viewed.includes(l.id))));
    document.querySelectorAll('[data-lesson]').forEach(button => button.onclick = () => startTour(Number(button.dataset.lesson)));
    $('demoPlay').onclick = play;
    $('demoSeek').oninput = () => { elapsed = Number($('demoSeek').value); lastTick = performance.now(); renderDemo(); if (!timer || elapsed >= duration) pause(); };
    document.querySelectorAll('[data-chapter]').forEach(button => button.onclick = () => { elapsed = Number(button.dataset.chapter) * chapterSeconds; lastTick = performance.now(); renderDemo(); if (!timer) pause(); });
    $('tourClose').onclick = () => finishTour();
    dialog.addEventListener('cancel', event => { event.preventDefault(); finishTour(); });
    $('tourBack').onclick = () => { if (tourIndex > 0) { tourIndex--; renderTour(); } };
    $('tourNext').onclick = () => {
      markViewed();
      if (tourIndex === lessons.length - 1) { dismissWelcome(); returnToHub = true; finishTour(); }
      else { tourIndex++; renderTour(); }
    };
    $('tourTry').onclick = () => { markViewed(); finishTour(true); };
    window.addEventListener('resize', positionTour);
    document.addEventListener('scroll', positionTour, true);
    document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
    window.addEventListener('pagehide', pause);
    renderDemo(); renderProgress();
  }
  window.KelvinLearn = { init, hide, active: () => !$('learnPanel').hidden,
    route() {
      if (!hooks) return false;
      if ($('learnTour').open) { $('learnTour').close(); restoreSidebar(); positionedTarget = null; sidebarBeforeTour = null; }
      if (location.hash === '#/learn') { showHub(); return true; }
      hide(); return false;
    },
  };
})();
