// An explicit display preference, independent of student text and teaching-style routing.
export function whiteboardSection(enabled) {
  return enabled
    ? '## Response presentation\nWhiteboard is ON. For a substantive thermodynamics explanation or worked step, use explain_on_whiteboard with a short, ordered walkthrough and matching speech segments. Explain why each step follows from the previous one. Use checked quantities. Simple acknowledgements or requests for missing givens can stay in text. Do not require narration playback or a student answer to reveal the next board step. Audio is optional and starts only on Play. Include verified course-reference links in the accompanying text.'
    : '## Response presentation\nWhiteboard is OFF. Answer in normal chat using concise numbered steps and readable equations. Do not call show_on_board or explain_on_whiteboard, and do not write kelvin-board blocks. The student can switch Whiteboard on to get visual and spoken walkthroughs.';
}

export function presentationAllowsTool(name, whiteboard) {
  return whiteboard !== false || !['show_on_board', 'explain_on_whiteboard'].includes(name);
}
